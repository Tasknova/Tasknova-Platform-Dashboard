import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type HubSpotWebhookEvent = {
  eventId?: number;
  subscriptionId?: number;
  portalId?: number;
  appId?: number;
  occurredAt?: number;
  subscriptionType?: string;
  attemptNumber?: number;
  objectId?: number;
  changeFlag?: string;
  changeSource?: string;
  propertyName?: string;
  propertyValue?: string;
};

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hubspot-signature-v3, x-hubspot-request-timestamp",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

function toBase64(bytes: ArrayBuffer): string {
  const uint8 = new Uint8Array(bytes);
  let binary = "";
  for (const byte of uint8) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

async function createHubSpotSignatureV3(
  appSecret: string,
  method: string,
  requestUri: string,
  rawBody: string,
  timestamp: string
): Promise<string> {
  const source = `${method}${requestUri}${rawBody}${timestamp}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(source));
  return toBase64(signature);
}

function isValidTimestamp(timestamp: string): boolean {
  const tsMs = Number(timestamp);
  if (!Number.isFinite(tsMs)) return false;

  const now = Date.now();
  const maxAgeMs = 5 * 60 * 1000;
  return Math.abs(now - tsMs) <= maxAgeMs;
}

function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
}

async function tryLogWebhook(
  events: HubSpotWebhookEvent[],
  headers: Headers,
  rawBody: string
): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return;

  // Optional persistence: create this table if you want audit logs.
  // hubspot_webhook_events(id uuid default gen_random_uuid(), received_at timestamptz default now(), event_count int, payload jsonb, headers jsonb)
  const { error } = await supabaseAdmin.from("hubspot_webhook_events").insert({
    event_count: events.length,
    payload: events,
    headers: {
      signature_v3: headers.get("x-hubspot-signature-v3"),
      request_timestamp: headers.get("x-hubspot-request-timestamp"),
      content_type: headers.get("content-type"),
    },
    raw_body: rawBody,
  });

  if (error) {
    console.error("[hubspot-webhook] Failed to insert webhook log", error.message);
  }
}

async function processEvent(event: HubSpotWebhookEvent): Promise<void> {
  const subscriptionType = event.subscriptionType || "unknown";

  // TODO: Replace this switch with real object sync logic.
  // Typical flow per event:
  // 1) Resolve integration record by HubSpot portalId.
  // 2) Fetch fresh object details from HubSpot API using stored OAuth token.
  // 3) Upsert to local canonical tables (contacts/companies/deals).
  // 4) Track cursor/state and sync logs.
  switch (subscriptionType) {
    case "contact.creation":
    case "contact.propertyChange":
    case "company.creation":
    case "company.propertyChange":
    case "deal.creation":
    case "deal.propertyChange":
      console.log("[hubspot-webhook] Received CRM event", {
        subscriptionType,
        objectId: event.objectId,
        portalId: event.portalId,
      });
      return;
    default:
      console.log("[hubspot-webhook] Ignored webhook event", {
        subscriptionType,
        objectId: event.objectId,
      });
      return;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        ok: true,
        function: "hubspot-webhook",
        message: "HubSpot webhook endpoint is live.",
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  const appSecret = Deno.env.get("HUBSPOT_CLIENT_SECRET") || Deno.env.get("HUBSPOT_APP_SECRET");
  if (!appSecret) {
    return new Response(JSON.stringify({ error: "Missing HubSpot app secret in function environment" }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }

  const signatureV3 = req.headers.get("x-hubspot-signature-v3") || "";
  const requestTimestamp = req.headers.get("x-hubspot-request-timestamp") || "";

  if (!signatureV3 || !requestTimestamp) {
    return new Response(JSON.stringify({ error: "Missing HubSpot signature headers" }), {
      status: 401,
      headers: CORS_HEADERS,
    });
  }

  if (!isValidTimestamp(requestTimestamp)) {
    return new Response(JSON.stringify({ error: "HubSpot webhook timestamp is outside allowed window" }), {
      status: 401,
      headers: CORS_HEADERS,
    });
  }

  const rawBody = await req.text();
  const requestUri = new URL(req.url).toString();
  const expectedSignature = await createHubSpotSignatureV3(
    appSecret,
    req.method,
    requestUri,
    rawBody,
    requestTimestamp
  );

  if (expectedSignature !== signatureV3) {
    return new Response(JSON.stringify({ error: "Invalid HubSpot webhook signature" }), {
      status: 401,
      headers: CORS_HEADERS,
    });
  }

  let events: HubSpotWebhookEvent[] = [];
  try {
    const parsed = JSON.parse(rawBody);
    events = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  try {
    await tryLogWebhook(events, req.headers, rawBody);

    for (const event of events) {
      await processEvent(event);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        received: events.length,
      }),
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});
