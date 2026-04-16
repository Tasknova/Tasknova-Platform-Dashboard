import { supabase } from "./supabase";

type HubspotAction =
  | "get_auth_url"
  | "exchange_code"
  | "status"
  | "disconnect"
  | "sync_now"
  | "list_records";

export type HubspotObjectType = "contacts" | "companies" | "deals";

export type HubspotRecord = {
  id: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  archived: boolean;
  properties: Record<string, unknown>;
};

export type HubspotStatusResponse = {
  connected: boolean;
  provider: "hubspot";
  connectedAt?: string | null;
  lastSyncedAt?: string | null;
  portalId?: number | null;
  scopes?: string[];
};

export type HubspotRecordsResponse = {
  objectType: HubspotObjectType;
  total: number;
  records: HubspotRecord[];
};

function getUserContext() {
  return {
    organizationId: localStorage.getItem("userOrganization") || "",
    userId: localStorage.getItem("userId") || "",
    role: localStorage.getItem("userRole") || "rep",
  };
}

function getEdgeErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }
  return fallback;
}

export function getHubspotRedirectUri(): string {
  const localRedirect = import.meta.env.VITE_HUBSPOT_REDIRECT_URI?.trim();
  const productionRedirect = import.meta.env.VITE_HUBSPOT_PRODUCTION_REDIRECT_URI?.trim();
  const isLocal = /localhost|127\.0\.0\.1/i.test(window.location.hostname);

  if (isLocal && localRedirect) return localRedirect;
  if (!isLocal && productionRedirect) return productionRedirect;
  if (localRedirect) return localRedirect;

  return `${window.location.origin}/hubspot/callback`;
}

async function invokeHubspot(action: HubspotAction, body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("hubspot-connect", {
    body: {
      action,
      ...body,
    },
  });

  if (error) {
    throw new Error(getEdgeErrorMessage(error, "HubSpot request failed"));
  }

  return data;
}

export async function getHubspotAuthUrl(): Promise<string> {
  const { organizationId, userId, role } = getUserContext();
  if (!organizationId || !userId) {
    throw new Error("Missing organization/user context. Please login again.");
  }

  const redirectUri = getHubspotRedirectUri();

  const data = await invokeHubspot("get_auth_url", {
    organizationId,
    userId,
    role,
    redirectUri,
  });

  if (!data?.authUrl) {
    throw new Error("Failed to generate HubSpot authorization URL.");
  }

  return String(data.authUrl);
}

export async function exchangeHubspotCode(code: string, state?: string): Promise<HubspotStatusResponse> {
  const { organizationId, userId, role } = getUserContext();
  if (!organizationId || !userId) {
    throw new Error("Missing organization/user context. Please login again.");
  }

  const redirectUri = getHubspotRedirectUri();

  const data = await invokeHubspot("exchange_code", {
    code,
    state,
    organizationId,
    userId,
    role,
    redirectUri,
  });

  if (!data?.success) {
    throw new Error(data?.error || "Failed to connect HubSpot");
  }

  return {
    connected: true,
    provider: "hubspot",
    connectedAt: data.connectedAt || null,
    lastSyncedAt: data.lastSyncedAt || null,
    portalId: data.portalId || null,
    scopes: Array.isArray(data.scopes) ? data.scopes : [],
  };
}

export async function getHubspotStatus(): Promise<HubspotStatusResponse> {
  const { organizationId, userId } = getUserContext();
  if (!organizationId || !userId) {
    return { connected: false, provider: "hubspot" };
  }

  const data = await invokeHubspot("status", {
    organizationId,
    userId,
  });

  return {
    connected: Boolean(data?.connected),
    provider: "hubspot",
    connectedAt: data?.connectedAt || null,
    lastSyncedAt: data?.lastSyncedAt || null,
    portalId: data?.portalId || null,
    scopes: Array.isArray(data?.scopes) ? data.scopes : [],
  };
}

export async function disconnectHubspot(): Promise<void> {
  const { organizationId, userId } = getUserContext();
  if (!organizationId || !userId) {
    throw new Error("Missing organization/user context. Please login again.");
  }

  const data = await invokeHubspot("disconnect", {
    organizationId,
    userId,
  });

  if (!data?.success) {
    throw new Error(data?.error || "Failed to disconnect HubSpot");
  }
}

export async function syncHubspotNow(): Promise<HubspotStatusResponse> {
  const { organizationId, userId } = getUserContext();
  if (!organizationId || !userId) {
    throw new Error("Missing organization/user context. Please login again.");
  }

  const data = await invokeHubspot("sync_now", {
    organizationId,
    userId,
  });

  if (!data?.success) {
    throw new Error(data?.error || "HubSpot sync failed");
  }

  return {
    connected: true,
    provider: "hubspot",
    connectedAt: data.connectedAt || null,
    lastSyncedAt: data.lastSyncedAt || null,
    portalId: data.portalId || null,
    scopes: Array.isArray(data.scopes) ? data.scopes : [],
  };
}

export async function listHubspotRecords(
  objectType: HubspotObjectType,
  limit = 25,
  after?: string
): Promise<HubspotRecordsResponse> {
  const { organizationId, userId } = getUserContext();
  if (!organizationId || !userId) {
    throw new Error("Missing organization/user context. Please login again.");
  }

  const data = await invokeHubspot("list_records", {
    organizationId,
    userId,
    objectType,
    limit,
    after,
  });

  if (!data?.success) {
    throw new Error(data?.error || `Failed to load HubSpot ${objectType}`);
  }

  return {
    objectType,
    total: Number(data?.total || 0),
    records: Array.isArray(data?.records) ? (data.records as HubspotRecord[]) : [],
  };
}
