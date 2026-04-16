import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type Action = "get_auth_url" | "exchange_code" | "status" | "disconnect" | "sync_now" | "list_records";

type HubspotObjectType = "contacts" | "companies" | "deals";

type RequestBody = {
  action?: Action;
  organizationId?: string;
  userId?: string;
  role?: string;
  redirectUri?: string;
  code?: string;
  state?: string;
  objectType?: HubspotObjectType;
  limit?: number;
  after?: string;
};

type HubspotTokenResponse = {
  token_type: string;
  refresh_token?: string;
  access_token: string;
  expires_in: number;
  scope: string;
};

type HubspotTokenMeta = {
  hub_id?: number;
  user?: string;
  scopes?: string[];
  token_type?: string;
};

type IntegrationRow = {
  organization_id: string;
  user_id: string;
  provider: "hubspot";
  is_active: boolean;
  access_token: string | null;
  refresh_token: string | null;
  token_type: string | null;
  scope: string | null;
  expires_at: string | null;
  connected_at: string | null;
  last_synced_at: string | null;
  external_account_id: string | null;
  external_user_id: string | null;
  metadata: Record<string, unknown>;
};

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

const HUBSPOT_AUTH_URL = "https://app.hubspot.com/oauth/authorize";
const HUBSPOT_TOKEN_URL = "https://api.hubapi.com/oauth/v1/token";
const HUBSPOT_TOKEN_META_URL = "https://api.hubapi.com/oauth/v1/access-tokens";
const HUBSPOT_CONTACTS_PING_URL = "https://api.hubapi.com/crm/v3/objects/contacts?limit=1&archived=false";

const HUBSPOT_OBJECT_PROPERTIES: Record<HubspotObjectType, string[]> = {
  contacts: ["firstname", "lastname", "email", "phone", "jobtitle", "company", "lastmodifieddate"],
  companies: ["name", "domain", "phone", "city", "country", "industry", "website", "lastmodifieddate"],
  deals: ["dealname", "amount", "dealstage", "pipeline", "closedate", "lastmodifieddate"],
};

function jsonResponse(status: number, payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: CORS_HEADERS,
  });
}

function getHubspotClientId(): string {
  return Deno.env.get("HUBSPOT_CLIENT_ID") || "";
}

function getHubspotClientSecret(): string {
  return Deno.env.get("HUBSPOT_CLIENT_SECRET") || "";
}

function getHubspotScopes(): string {
  return (
    Deno.env.get("HUBSPOT_SCOPES") ||
    "oauth crm.objects.leads.read crm.objects.leads.write crm.objects.contacts.write crm.objects.appointments.read crm.objects.appointments.write crm.objects.projects.read crm.objects.companies.write crm.objects.projects.write crm.objects.companies.read crm.objects.deals.read crm.objects.deals.write crm.objects.contacts.read"
  );
}

function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function assertRequired(value: string | undefined, message: string): string {
  if (!value || !value.trim()) {
    throw new Error(message);
  }
  return value.trim();
}

function encodeState(payload: Record<string, unknown>): string {
  const json = JSON.stringify(payload);
  const b64 = btoa(json);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeState(state: string | undefined): Record<string, unknown> | null {
  if (!state) return null;

  try {
    const normalized = state.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded) as Record<string, unknown>;
    return parsed;
  } catch {
    return null;
  }
}

function toIsoFromExpiresIn(expiresIn: number): string {
  const safeExpiresIn = Number.isFinite(expiresIn) ? Math.max(0, expiresIn) : 0;
  return new Date(Date.now() + safeExpiresIn * 1000).toISOString();
}

function tokenIsStale(expiresAt: string | null): boolean {
  if (!expiresAt) return true;
  const expiresMs = new Date(expiresAt).getTime();
  if (Number.isNaN(expiresMs)) return true;

  const skewMs = 60 * 1000;
  return Date.now() >= expiresMs - skewMs;
}

function toObjectType(value: string | undefined): HubspotObjectType {
  if (value === "contacts" || value === "companies" || value === "deals") {
    return value;
  }
  throw new Error("Unsupported objectType. Use one of: contacts, companies, deals.");
}

function normalizeLimit(limit: number | undefined): number {
  if (!Number.isFinite(limit)) return 25;
  const numeric = Math.floor(limit || 25);
  return Math.min(Math.max(numeric, 1), 100);
}

async function fetchHubspotObjects(params: {
  accessToken: string;
  objectType: HubspotObjectType;
  limit?: number;
  after?: string;
}): Promise<Record<string, unknown>> {
  const properties = HUBSPOT_OBJECT_PROPERTIES[params.objectType];
  const query = new URLSearchParams({
    limit: String(normalizeLimit(params.limit)),
    archived: "false",
    properties: properties.join(","),
  });

  if (params.after?.trim()) {
    query.set("after", params.after.trim());
  }

  const url = `https://api.hubapi.com/crm/v3/objects/${params.objectType}?${query.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      Accept: "application/json",
    },
  });

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      (payload.message as string | undefined) ||
      (payload.error as string | undefined) ||
      `HubSpot ${params.objectType} fetch failed`;
    throw new Error(message);
  }

  return payload;
}

async function exchangeAuthorizationCode(params: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<HubspotTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: params.clientId,
    client_secret: params.clientSecret,
    redirect_uri: params.redirectUri,
    code: params.code,
  });

  const response = await fetch(HUBSPOT_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (payload as { message?: string; error_description?: string }).message ||
      (payload as { message?: string; error_description?: string }).error_description ||
      "HubSpot token exchange failed";
    throw new Error(message);
  }

  return payload as HubspotTokenResponse;
}

async function refreshAccessToken(params: {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}): Promise<HubspotTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: params.clientId,
    client_secret: params.clientSecret,
    refresh_token: params.refreshToken,
  });

  const response = await fetch(HUBSPOT_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (payload as { message?: string; error_description?: string }).message ||
      (payload as { message?: string; error_description?: string }).error_description ||
      "HubSpot token refresh failed";
    throw new Error(message);
  }

  return payload as HubspotTokenResponse;
}

async function fetchTokenMetadata(accessToken: string): Promise<HubspotTokenMeta | null> {
  const response = await fetch(`${HUBSPOT_TOKEN_META_URL}/${accessToken}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) return null;
  const payload = (await response.json().catch(() => null)) as HubspotTokenMeta | null;
  return payload;
}

async function getIntegration(supabase: ReturnType<typeof createClient>, organizationId: string, userId: string) {
  const { data, error } = await supabase
    .from("crm_integrations")
    .select(
      "organization_id,user_id,provider,is_active,access_token,refresh_token,token_type,scope,expires_at,connected_at,last_synced_at,external_account_id,external_user_id,metadata"
    )
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("provider", "hubspot")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read CRM integration: ${error.message}`);
  }

  return data as IntegrationRow | null;
}

async function updateIntegrationTokens(
  supabase: ReturnType<typeof createClient>,
  organizationId: string,
  userId: string,
  token: HubspotTokenResponse,
  metadata: HubspotTokenMeta | null
): Promise<void> {
  const patch = {
    access_token: token.access_token,
    refresh_token: token.refresh_token || null,
    token_type: token.token_type || null,
    scope: token.scope || null,
    expires_at: toIsoFromExpiresIn(token.expires_in),
    external_account_id: metadata?.hub_id ? String(metadata.hub_id) : null,
    external_user_id: metadata?.user || null,
    metadata: {
      ...(metadata || {}),
      scopes: metadata?.scopes || token.scope?.split(" ") || [],
    },
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("crm_integrations")
    .update(patch)
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("provider", "hubspot")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to update HubSpot token: ${error.message}`);
  }
}

async function ensureFreshIntegrationToken(
  supabase: ReturnType<typeof createClient>,
  integration: IntegrationRow,
  clientId: string,
  clientSecret: string
): Promise<IntegrationRow> {
  if (!tokenIsStale(integration.expires_at) && integration.access_token) {
    return integration;
  }

  if (!integration.refresh_token) {
    return integration;
  }

  const refreshed = await refreshAccessToken({
    refreshToken: integration.refresh_token,
    clientId,
    clientSecret,
  });

  const metadata = await fetchTokenMetadata(refreshed.access_token);

  await updateIntegrationTokens(
    supabase,
    integration.organization_id,
    integration.user_id,
    refreshed,
    metadata
  );

  return {
    ...integration,
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token || integration.refresh_token,
    token_type: refreshed.token_type,
    scope: refreshed.scope,
    expires_at: toIsoFromExpiresIn(refreshed.expires_in),
    external_account_id: metadata?.hub_id ? String(metadata.hub_id) : integration.external_account_id,
    external_user_id: metadata?.user || integration.external_user_id,
    metadata: {
      ...(integration.metadata || {}),
      ...(metadata || {}),
      scopes: metadata?.scopes || refreshed.scope?.split(" ") || [],
    },
  };
}

async function handleGetAuthUrl(body: RequestBody): Promise<Response> {
  const clientId = assertRequired(getHubspotClientId(), "Missing HUBSPOT_CLIENT_ID in edge function secrets");
  const redirectUri = assertRequired(body.redirectUri, "Missing redirectUri");
  const organizationId = assertRequired(body.organizationId, "Missing organizationId");
  const userId = assertRequired(body.userId, "Missing userId");

  const state = encodeState({
    organizationId,
    userId,
    role: body.role || "rep",
    ts: Date.now(),
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: getHubspotScopes(),
    state,
  });

  const authUrl = `${HUBSPOT_AUTH_URL}?${params.toString()}`;

  return jsonResponse(200, {
    success: true,
    authUrl,
    state,
  });
}

async function handleExchangeCode(body: RequestBody): Promise<Response> {
  const code = assertRequired(body.code, "Missing code");
  const redirectUri = assertRequired(body.redirectUri, "Missing redirectUri");
  const statePayload = decodeState(body.state);

  const organizationId =
    assertRequired(
      body.organizationId || (statePayload?.organizationId as string | undefined),
      "Missing organizationId"
    );

  const userId = assertRequired(
    body.userId || (statePayload?.userId as string | undefined),
    "Missing userId"
  );

  const clientId = assertRequired(getHubspotClientId(), "Missing HUBSPOT_CLIENT_ID in edge function secrets");
  const clientSecret = assertRequired(
    getHubspotClientSecret(),
    "Missing HUBSPOT_CLIENT_SECRET in edge function secrets"
  );

  const supabase = getSupabaseAdmin();
  const token = await exchangeAuthorizationCode({
    code,
    clientId,
    clientSecret,
    redirectUri,
  });

  const metadata = await fetchTokenMetadata(token.access_token);
  const nowIso = new Date().toISOString();

  const row = {
    organization_id: organizationId,
    user_id: userId,
    provider: "hubspot",
    is_active: true,
    access_token: token.access_token,
    refresh_token: token.refresh_token || null,
    token_type: token.token_type || null,
    scope: token.scope || null,
    expires_at: toIsoFromExpiresIn(token.expires_in),
    connected_at: nowIso,
    last_synced_at: nowIso,
    external_account_id: metadata?.hub_id ? String(metadata.hub_id) : null,
    external_user_id: metadata?.user || null,
    metadata: {
      ...(metadata || {}),
      scopes: metadata?.scopes || token.scope?.split(" ") || [],
    },
    disconnected_at: null,
    updated_at: nowIso,
  };

  const { error } = await supabase
    .from("crm_integrations")
    .upsert(row, { onConflict: "organization_id,user_id,provider" });

  if (error) {
    throw new Error(`Failed to save HubSpot integration: ${error.message}`);
  }

  return jsonResponse(200, {
    success: true,
    connectedAt: row.connected_at,
    lastSyncedAt: row.last_synced_at,
    portalId: metadata?.hub_id || null,
    scopes: metadata?.scopes || token.scope?.split(" ") || [],
  });
}

async function handleStatus(body: RequestBody): Promise<Response> {
  const organizationId = assertRequired(body.organizationId, "Missing organizationId");
  const userId = assertRequired(body.userId, "Missing userId");

  const clientId = assertRequired(getHubspotClientId(), "Missing HUBSPOT_CLIENT_ID in edge function secrets");
  const clientSecret = assertRequired(
    getHubspotClientSecret(),
    "Missing HUBSPOT_CLIENT_SECRET in edge function secrets"
  );

  const supabase = getSupabaseAdmin();
  const integration = await getIntegration(supabase, organizationId, userId);

  if (!integration) {
    return jsonResponse(200, {
      success: true,
      connected: false,
    });
  }

  const fresh = await ensureFreshIntegrationToken(supabase, integration, clientId, clientSecret);

  return jsonResponse(200, {
    success: true,
    connected: true,
    connectedAt: fresh.connected_at,
    lastSyncedAt: fresh.last_synced_at,
    portalId: fresh.external_account_id ? Number(fresh.external_account_id) : null,
    scopes: Array.isArray(fresh.metadata?.scopes) ? fresh.metadata.scopes : [],
  });
}

async function handleDisconnect(body: RequestBody): Promise<Response> {
  const organizationId = assertRequired(body.organizationId, "Missing organizationId");
  const userId = assertRequired(body.userId, "Missing userId");

  const supabase = getSupabaseAdmin();
  const nowIso = new Date().toISOString();

  const { error } = await supabase
    .from("crm_integrations")
    .update({
      is_active: false,
      access_token: null,
      refresh_token: null,
      token_type: null,
      expires_at: null,
      disconnected_at: nowIso,
      updated_at: nowIso,
    })
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("provider", "hubspot")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to disconnect HubSpot: ${error.message}`);
  }

  return jsonResponse(200, {
    success: true,
  });
}

async function handleSyncNow(body: RequestBody): Promise<Response> {
  const organizationId = assertRequired(body.organizationId, "Missing organizationId");
  const userId = assertRequired(body.userId, "Missing userId");

  const clientId = assertRequired(getHubspotClientId(), "Missing HUBSPOT_CLIENT_ID in edge function secrets");
  const clientSecret = assertRequired(
    getHubspotClientSecret(),
    "Missing HUBSPOT_CLIENT_SECRET in edge function secrets"
  );

  const supabase = getSupabaseAdmin();
  const integration = await getIntegration(supabase, organizationId, userId);

  if (!integration || !integration.access_token) {
    throw new Error("HubSpot is not connected for this user.");
  }

  const fresh = await ensureFreshIntegrationToken(supabase, integration, clientId, clientSecret);

  const ping = await fetch(HUBSPOT_CONTACTS_PING_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${fresh.access_token}`,
      Accept: "application/json",
    },
  });

  if (!ping.ok) {
    const details = await ping.text().catch(() => "");
    throw new Error(`HubSpot sync ping failed: ${ping.status} ${details}`);
  }

  const lastSyncedAt = new Date().toISOString();
  const { error } = await supabase
    .from("crm_integrations")
    .update({
      last_synced_at: lastSyncedAt,
      updated_at: lastSyncedAt,
    })
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("provider", "hubspot")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to update HubSpot sync timestamp: ${error.message}`);
  }

  return jsonResponse(200, {
    success: true,
    connectedAt: fresh.connected_at,
    lastSyncedAt,
    portalId: fresh.external_account_id ? Number(fresh.external_account_id) : null,
    scopes: Array.isArray(fresh.metadata?.scopes) ? fresh.metadata.scopes : [],
  });
}

async function handleListRecords(body: RequestBody): Promise<Response> {
  const organizationId = assertRequired(body.organizationId, "Missing organizationId");
  const userId = assertRequired(body.userId, "Missing userId");
  const objectType = toObjectType(body.objectType);

  const clientId = assertRequired(getHubspotClientId(), "Missing HUBSPOT_CLIENT_ID in edge function secrets");
  const clientSecret = assertRequired(
    getHubspotClientSecret(),
    "Missing HUBSPOT_CLIENT_SECRET in edge function secrets"
  );

  const supabase = getSupabaseAdmin();
  const integration = await getIntegration(supabase, organizationId, userId);

  if (!integration || !integration.access_token) {
    throw new Error("HubSpot is not connected for this user.");
  }

  const fresh = await ensureFreshIntegrationToken(supabase, integration, clientId, clientSecret);
  const payload = await fetchHubspotObjects({
    accessToken: fresh.access_token || "",
    objectType,
    limit: body.limit,
    after: body.after,
  });

  const results = Array.isArray(payload.results) ? payload.results : [];
  const records = results.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      id: row.id || null,
      createdAt: row.createdAt || null,
      updatedAt: row.updatedAt || null,
      archived: row.archived || false,
      properties:
        row.properties && typeof row.properties === "object"
          ? (row.properties as Record<string, unknown>)
          : {},
    };
  });

  const paging = payload.paging && typeof payload.paging === "object" ? payload.paging : null;

  return jsonResponse(200, {
    success: true,
    objectType,
    total: records.length,
    records,
    paging,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse(200, { ok: true });
  }

  if (req.method === "GET") {
    return jsonResponse(200, {
      ok: true,
      function: "hubspot-connect",
      message: "HubSpot connect endpoint is live.",
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const body = (await req.json()) as RequestBody;
    const action = body.action;

    if (!action) {
      return jsonResponse(400, { error: "Missing action" });
    }

    if (action === "get_auth_url") return await handleGetAuthUrl(body);
    if (action === "exchange_code") return await handleExchangeCode(body);
    if (action === "status") return await handleStatus(body);
    if (action === "disconnect") return await handleDisconnect(body);
    if (action === "sync_now") return await handleSyncNow(body);
    if (action === "list_records") return await handleListRecords(body);

    return jsonResponse(400, { error: "Unsupported action" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "HubSpot action failed";
    return jsonResponse(500, { error: message });
  }
});
