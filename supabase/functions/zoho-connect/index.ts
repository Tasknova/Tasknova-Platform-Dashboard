import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type Action = "get_auth_url" | "exchange_code" | "status" | "disconnect" | "sync_now" | "list_records";

type ZohoObjectType = "contacts" | "companies" | "deals";

type RequestBody = {
  action?: Action;
  organizationId?: string;
  userId?: string;
  role?: string;
  redirectUri?: string;
  code?: string;
  state?: string;
  objectType?: ZohoObjectType;
  module?: string;
  limit?: number;
  after?: string; // used as page token or converted to page
};

type ZohoTokenResponse = {
  access_token: string;
  refresh_token?: string;
  api_domain?: string;
  token_type?: string;
  expires_in: number;
};

type IntegrationRow = {
  organization_id: string;
  user_id: string;
  provider: "zoho";
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

const ZOHO_MODULES: Record<ZohoObjectType, string> = {
  contacts: "Contacts",
  companies: "Accounts",
  deals: "Deals",
};

class HttpError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

function jsonResponse(status: number, payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: CORS_HEADERS,
  });
}

function getZohoClientId(): string {
  return Deno.env.get("ZOHO_CLIENT_ID") || "";
}

function getZohoClientSecret(): string {
  return Deno.env.get("ZOHO_CLIENT_SECRET") || "";
}

function getZohoScopes(): string {
  return Deno.env.get("ZOHO_SCOPES") || "ZohoCRM.modules.ALL,ZohoCRM.users.READ";
}

function getZohoAccountsBaseUrl(): string {
  return Deno.env.get("ZOHO_ACCOUNTS_BASE_URL") || "https://accounts.zoho.com";
}

function getZohoApiBaseUrl(): string {
  return Deno.env.get("ZOHO_API_BASE_URL") || "https://www.zohoapis.com";
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
    throw new HttpError(message, 400);
  }
  return value.trim();
}

function maskToken(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length <= 8) return `${trimmed.slice(0, 2)}***`;
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
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

function toObjectType(value: string | undefined): ZohoObjectType {
  if (!value || !value.trim()) {
    throw new HttpError("Missing parameter: objectType", 400);
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "contacts") return "contacts";
  if (normalized === "companies" || normalized === "accounts") return "companies";
  if (normalized === "deals") return "deals";

  throw new HttpError(
    "Unsupported objectType/module. Use one of: contacts, companies, deals.",
    400
  );
}

function resolveListObjectType(body: RequestBody): ZohoObjectType {
  return toObjectType(body.objectType || body.module);
}

function normalizeLimit(limit: number | undefined): number {
  if (!Number.isFinite(limit)) return 25;
  const numeric = Math.floor(limit || 25);
  return Math.min(Math.max(numeric, 1), 100);
}

async function fetchZohoObjects(params: {
  accessToken: string;
  apiDomain: string;
  objectType: ZohoObjectType;
  limit?: number;
  after?: string; // used as page in Zoho
}): Promise<Record<string, unknown>> {
  if (!params.objectType) throw new HttpError("Missing parameter: objectType", 400);

  const module = ZOHO_MODULES[params.objectType];
  const queryParams = {
    per_page: normalizeLimit(params.limit),
    page: params.after ? parseInt(params.after, 10) : 1,
  };

  console.log("fetchZohoObjects inputs:", {
    objectType: params.objectType,
    module,
    accessToken: maskToken(params.accessToken),
    apiDomain: params.apiDomain,
    queryParams,
  });

  if (!module) throw new HttpError("Missing parameter: module", 400);
  if (!params.accessToken || !params.accessToken.trim()) {
    throw new HttpError("Missing parameter: accessToken", 400);
  }
  if (!params.apiDomain || !params.apiDomain.trim()) {
    throw new HttpError("Missing parameter: apiDomain", 400);
  }

  const limit = normalizeLimit(params.limit);
  const page = params.after ? parseInt(params.after, 10) : 1;
  const validPage = Number.isNaN(page) || page < 1 ? 1 : page;

  const url = `${params.apiDomain}/crm/v3/${module}?per_page=${limit}&page=${validPage}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${params.accessToken}`,
      Accept: "application/json",
    },
  });

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      (payload.message as string | undefined) ||
      (payload.code as string | undefined) ||
      `Zoho ${module} fetch failed`;
    throw new HttpError(message, response.status);
  }

  return payload;
}

async function exchangeAuthorizationCode(params: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<ZohoTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: params.clientId,
    client_secret: params.clientSecret,
    redirect_uri: params.redirectUri,
    code: params.code,
  });

  const tokenUrl = `${getZohoAccountsBaseUrl()}/oauth/v2/token`;
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.error) {
    const message = payload.error || "Zoho token exchange failed";
    throw new Error(message);
  }

  return payload as ZohoTokenResponse;
}

async function refreshAccessToken(params: {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}): Promise<ZohoTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: params.clientId,
    client_secret: params.clientSecret,
    refresh_token: params.refreshToken,
  });

  const tokenUrl = `${getZohoAccountsBaseUrl()}/oauth/v2/token`;
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.error) {
    const message = payload.error || "Zoho token refresh failed";
    throw new Error(message);
  }

  return payload as ZohoTokenResponse;
}

async function getIntegration(supabase: ReturnType<typeof createClient>, organizationId: string, userId: string) {
  const { data, error } = await supabase
    .from("crm_integrations")
    .select(
      "organization_id,user_id,provider,is_active,access_token,refresh_token,token_type,scope,expires_at,connected_at,last_synced_at,external_account_id,external_user_id,metadata"
    )
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("provider", "zoho")
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
  token: ZohoTokenResponse
): Promise<void> {
  const patch = {
    access_token: token.access_token,
    refresh_token: token.refresh_token || null, // preserve existing if null
    token_type: token.token_type || null,
    expires_at: toIsoFromExpiresIn(token.expires_in),
    updated_at: new Date().toISOString(),
  };

  // If Zoho returned an api_domain, update the metadata
  if (token.api_domain) {
    const { data: existing } = await supabase
      .from("crm_integrations")
      .select("metadata")
      .eq("organization_id", organizationId)
      .eq("user_id", userId)
      .eq("provider", "zoho")
      .maybeSingle();
      
    const newMetadata = { ...(existing?.metadata || {}), api_domain: token.api_domain };
    Object.assign(patch, { metadata: newMetadata });
  }

  const { error } = await supabase
    .from("crm_integrations")
    .update(patch)
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("provider", "zoho")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to update Zoho token: ${error.message}`);
  }
}

async function ensureFreshIntegrationToken(
  supabase: ReturnType<typeof createClient>,
  integration: IntegrationRow,
  clientId: string,
  clientSecret: string
): Promise<IntegrationRow> {
  console.log("ensureFreshIntegrationToken state:", {
    organizationId: integration.organization_id,
    userId: integration.user_id,
    hasAccessToken: Boolean(integration.access_token),
    hasRefreshToken: Boolean(integration.refresh_token),
    expiresAt: integration.expires_at,
    tokenIsStale: tokenIsStale(integration.expires_at),
  });

  if (!tokenIsStale(integration.expires_at) && integration.access_token) {
    return integration;
  }

  if (!integration.refresh_token) {
    throw new HttpError("Zoho access token is expired and no refresh token is available.", 401);
  }

  const refreshed = await refreshAccessToken({
    refreshToken: integration.refresh_token,
    clientId,
    clientSecret,
  });

  const tokenToUpdate = {
    ...refreshed,
    refresh_token: refreshed.refresh_token || integration.refresh_token, // Preserve
  };

  await updateIntegrationTokens(
    supabase,
    integration.organization_id,
    integration.user_id,
    tokenToUpdate
  );

  return {
    ...integration,
    access_token: refreshed.access_token,
    refresh_token: tokenToUpdate.refresh_token,
    token_type: refreshed.token_type || integration.token_type,
    expires_at: toIsoFromExpiresIn(refreshed.expires_in),
    metadata: {
      ...(integration.metadata || {}),
      ...(refreshed.api_domain ? { api_domain: refreshed.api_domain } : {}),
    },
  };
}

async function handleGetAuthUrl(body: RequestBody): Promise<Response> {
  const clientId = assertRequired(getZohoClientId(), "Missing ZOHO_CLIENT_ID in edge function secrets");
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
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: getZohoScopes(),
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const authUrl = `${getZohoAccountsBaseUrl()}/oauth/v2/auth?${params.toString()}`;

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

  const clientId = assertRequired(getZohoClientId(), "Missing ZOHO_CLIENT_ID in edge function secrets");
  const clientSecret = assertRequired(
    getZohoClientSecret(),
    "Missing ZOHO_CLIENT_SECRET in edge function secrets"
  );

  const supabase = getSupabaseAdmin();
  const token = await exchangeAuthorizationCode({
    code,
    clientId,
    clientSecret,
    redirectUri,
  });

  const nowIso = new Date().toISOString();
  const apiDomain = token.api_domain || getZohoApiBaseUrl();

  const row = {
    organization_id: organizationId,
    user_id: userId,
    provider: "zoho",
    is_active: true,
    access_token: token.access_token,
    refresh_token: token.refresh_token || null,
    token_type: token.token_type || null,
    scope: getZohoScopes(),
    expires_at: toIsoFromExpiresIn(token.expires_in),
    connected_at: nowIso,
    last_synced_at: nowIso,
    external_account_id: null,
    external_user_id: null,
    metadata: {
      api_domain: apiDomain,
      scopes: getZohoScopes().split(","),
    },
    disconnected_at: null,
    updated_at: nowIso,
  };

  const { error } = await supabase
    .from("crm_integrations")
    .upsert(row, { onConflict: "organization_id,user_id,provider" });

  if (error) {
    throw new Error(`Failed to save Zoho integration: ${error.message}`);
  }

  return jsonResponse(200, {
    success: true,
    connectedAt: row.connected_at,
    lastSyncedAt: row.last_synced_at,
    scopes: row.metadata.scopes,
  });
}

async function handleStatus(body: RequestBody): Promise<Response> {
  const organizationId = assertRequired(body.organizationId, "Missing organizationId");
  const userId = assertRequired(body.userId, "Missing userId");

  const clientId = assertRequired(getZohoClientId(), "Missing ZOHO_CLIENT_ID in edge function secrets");
  const clientSecret = assertRequired(
    getZohoClientSecret(),
    "Missing ZOHO_CLIENT_SECRET in edge function secrets"
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
    .eq("provider", "zoho")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to disconnect Zoho: ${error.message}`);
  }

  return jsonResponse(200, {
    success: true,
  });
}

async function handleSyncNow(body: RequestBody): Promise<Response> {
  const organizationId = assertRequired(body.organizationId, "Missing organizationId");
  const userId = assertRequired(body.userId, "Missing userId");

  const clientId = assertRequired(getZohoClientId(), "Missing ZOHO_CLIENT_ID in edge function secrets");
  const clientSecret = assertRequired(
    getZohoClientSecret(),
    "Missing ZOHO_CLIENT_SECRET in edge function secrets"
  );

  const supabase = getSupabaseAdmin();
  const integration = await getIntegration(supabase, organizationId, userId);

  if (!integration || !integration.access_token) {
    throw new Error("Zoho is not connected for this user.");
  }

  const fresh = await ensureFreshIntegrationToken(supabase, integration, clientId, clientSecret);
  const apiDomain = (fresh.metadata?.api_domain as string) || getZohoApiBaseUrl();

  const pingUrl = `${apiDomain}/crm/v3/Contacts?per_page=1`;
  const ping = await fetch(pingUrl, {
    method: "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${fresh.access_token}`,
      Accept: "application/json",
    },
  });

  if (!ping.ok) {
    const details = await ping.text().catch(() => "");
    throw new Error(`Zoho sync ping failed: ${ping.status} ${details}`);
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
    .eq("provider", "zoho")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to update Zoho sync timestamp: ${error.message}`);
  }

  return jsonResponse(200, {
    success: true,
    connectedAt: fresh.connected_at,
    lastSyncedAt,
    scopes: Array.isArray(fresh.metadata?.scopes) ? fresh.metadata.scopes : [],
  });
}

async function handleListRecords(body: RequestBody): Promise<Response> {
  const organizationId = assertRequired(body.organizationId, "Missing organizationId");
  const userId = assertRequired(body.userId, "Missing userId");
  const objectType = resolveListObjectType(body);

  const clientId = assertRequired(getZohoClientId(), "Missing ZOHO_CLIENT_ID in edge function secrets");
  const clientSecret = assertRequired(
    getZohoClientSecret(),
    "Missing ZOHO_CLIENT_SECRET in edge function secrets"
  );

  console.log("ENV CHECK:", {
    ZOHO_CLIENT_ID: maskToken(clientId),
    ZOHO_CLIENT_SECRET: maskToken(clientSecret),
    ZOHO_API_BASE_URL: getZohoApiBaseUrl(),
  });

  console.log("handleListRecords inputs:", {
    organizationId,
    userId,
    objectType,
    module: body.module || null,
    limit: body.limit,
    after: body.after,
  });

  const supabase = getSupabaseAdmin();
  const integration = await getIntegration(supabase, organizationId, userId);

  if (!integration || !integration.access_token) {
    throw new HttpError("Zoho is not connected for this user.", 401);
  }

  const fresh = await ensureFreshIntegrationToken(supabase, integration, clientId, clientSecret);
  const apiDomain = (fresh.metadata?.api_domain as string) || getZohoApiBaseUrl();

  console.log("handleListRecords integration state:", {
    organizationId,
    userId,
    objectType,
    apiDomain,
    hasAccessToken: Boolean(fresh.access_token),
    hasRefreshToken: Boolean(fresh.refresh_token),
    expiresAt: fresh.expires_at,
  });

  const payload = await fetchZohoObjects({
    accessToken: fresh.access_token || "",
    apiDomain,
    objectType,
    limit: body.limit,
    after: body.after,
  });

  const results = Array.isArray(payload.data) ? payload.data : [];
  
  // Normalize to HubspotRecord pattern for consistent UI rendering
  // Fields mapped depending on type
  const records = results.map((item) => {
    const row = item as Record<string, unknown>;
    
    // Normalizing specific properties based on type
    const properties: Record<string, unknown> = {};
    if (objectType === "contacts") {
      properties.firstname = row.First_Name || "-";
      properties.lastname = row.Last_Name || "-";
      properties.email = row.Email || "-";
      properties.phone = row.Phone || "-";
    } else if (objectType === "companies") {
      properties.name = row.Account_Name || "-";
      properties.domain = row.Website || "-";
      properties.industry = row.Industry || "-";
    } else if (objectType === "deals") {
      properties.dealname = row.Deal_Name || "-";
      properties.amount = row.Amount || "-";
      properties.dealstage = row.Stage || "-";
    }

    return {
      id: row.id ? String(row.id) : null,
      createdAt: row.Created_Time || null,
      updatedAt: row.Modified_Time || null,
      archived: row.$state === "delete" || false,
      properties,
    };
  });

  const info = payload.info && typeof payload.info === "object" ? payload.info : null;
  const paging = info ? { next: { after: ((info as Record<string, unknown>).page as number) + 1 } } : null;

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
      function: "zoho-connect",
      message: "Zoho connect endpoint is live.",
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const body = (await req.json().catch(() => {
      throw new HttpError("Invalid JSON body", 400);
    })) as RequestBody;
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
    console.error("Zoho Edge Function Error:", error);
    const message = error instanceof Error ? error.message : "Zoho action failed";
    const status = error instanceof HttpError ? error.status : 500;
    return jsonResponse(status, { error: message });
  }
});
