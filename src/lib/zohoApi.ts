import { supabase } from "./supabase";
import { HubspotObjectType, HubspotRecord, HubspotStatusResponse, HubspotRecordsResponse } from "./hubspotApi";

type ZohoAction =
  | "get_auth_url"
  | "exchange_code"
  | "status"
  | "disconnect"
  | "sync_now"
  | "list_records";

export type ZohoObjectType = HubspotObjectType;
export type ZohoRecord = HubspotRecord;
export type ZohoStatusResponse = Omit<HubspotStatusResponse, "provider"> & { provider: "zoho" };
export type ZohoRecordsResponse = HubspotRecordsResponse;

function getUserContext() {
  return {
    organizationId: localStorage.getItem("userOrganization") || "",
    userId: localStorage.getItem("userId") || "",
    role: localStorage.getItem("userRole") || "rep",
  };
}

async function getEdgeErrorMessage(error: unknown, fallback: string): Promise<string> {
  if (error && typeof error === "object" && "context" in error) {
    const maybeContext = (error as { context?: unknown }).context;
    if (maybeContext && typeof maybeContext === "object" && "json" in maybeContext) {
      const maybeJson = (maybeContext as { json?: unknown }).json;
      if (typeof maybeJson === "function") {
        try {
          const payload = await (maybeJson as () => Promise<Record<string, unknown>>)();
          if (typeof payload?.error === "string" && payload.error.trim()) {
            return payload.error;
          }
          if (typeof payload?.message === "string" && payload.message.trim()) {
            return payload.message;
          }
        } catch {
          // Fall through to generic message parsing.
        }
      }
    }
  }

  if (error && typeof error === "object" && "message" in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }
  return fallback;
}

export function getZohoRedirectUri(): string {
  const localRedirect = import.meta.env.VITE_ZOHO_REDIRECT_URI?.trim();
  const productionRedirect = import.meta.env.VITE_ZOHO_PRODUCTION_REDIRECT_URI?.trim();
  const isLocal = /localhost|127\.0\.0\.1/i.test(window.location.hostname);

  if (isLocal && localRedirect) return localRedirect;
  if (!isLocal && productionRedirect) return productionRedirect;
  if (localRedirect) return localRedirect;

  return `${window.location.origin}/zoho/callback`;
}

async function invokeZoho(action: ZohoAction, body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("zoho-connect", {
    body: {
      action,
      ...body,
    },
  });

  if (error) {
    throw new Error(await getEdgeErrorMessage(error, "Zoho request failed"));
  }

  return data;
}

export async function getZohoAuthUrl(): Promise<string> {
  const { organizationId, userId, role } = getUserContext();
  if (!organizationId || !userId) {
    throw new Error("Missing organization/user context. Please login again.");
  }

  const redirectUri = getZohoRedirectUri();

  const data = await invokeZoho("get_auth_url", {
    organizationId,
    userId,
    role,
    redirectUri,
  });

  if (!data?.authUrl) {
    throw new Error("Failed to generate Zoho authorization URL.");
  }

  return String(data.authUrl);
}

export async function exchangeZohoCode(code: string, state?: string): Promise<ZohoStatusResponse> {
  const { organizationId, userId, role } = getUserContext();
  if (!organizationId || !userId) {
    throw new Error("Missing organization/user context. Please login again.");
  }

  const redirectUri = getZohoRedirectUri();

  const data = await invokeZoho("exchange_code", {
    code,
    state,
    organizationId,
    userId,
    role,
    redirectUri,
  });

  if (!data?.success) {
    throw new Error(data?.error || "Failed to connect Zoho");
  }

  return {
    connected: true,
    provider: "zoho",
    connectedAt: data.connectedAt || null,
    lastSyncedAt: data.lastSyncedAt || null,
    scopes: Array.isArray(data.scopes) ? data.scopes : [],
  };
}

export async function getZohoStatus(): Promise<ZohoStatusResponse> {
  const { organizationId, userId } = getUserContext();
  if (!organizationId || !userId) {
    return { connected: false, provider: "zoho" };
  }

  const data = await invokeZoho("status", {
    organizationId,
    userId,
  });

  return {
    connected: Boolean(data?.connected),
    provider: "zoho",
    connectedAt: data?.connectedAt || null,
    lastSyncedAt: data?.lastSyncedAt || null,
    scopes: Array.isArray(data?.scopes) ? data.scopes : [],
  };
}

export async function disconnectZoho(): Promise<void> {
  const { organizationId, userId } = getUserContext();
  if (!organizationId || !userId) {
    throw new Error("Missing organization/user context. Please login again.");
  }

  const data = await invokeZoho("disconnect", {
    organizationId,
    userId,
  });

  if (!data?.success) {
    throw new Error(data?.error || "Failed to disconnect Zoho");
  }
}

export async function syncZohoNow(): Promise<ZohoStatusResponse> {
  const { organizationId, userId } = getUserContext();
  if (!organizationId || !userId) {
    throw new Error("Missing organization/user context. Please login again.");
  }

  const data = await invokeZoho("sync_now", {
    organizationId,
    userId,
  });

  if (!data?.success) {
    throw new Error(data?.error || "Zoho sync failed");
  }

  return {
    connected: true,
    provider: "zoho",
    connectedAt: data.connectedAt || null,
    lastSyncedAt: data.lastSyncedAt || null,
    scopes: Array.isArray(data.scopes) ? data.scopes : [],
  };
}

export async function listZohoRecords(
  objectType: ZohoObjectType,
  limit = 25,
  after?: string
): Promise<ZohoRecordsResponse> {
  const { organizationId, userId } = getUserContext();
  // Debug log for context
  console.log("[Zoho] listZohoRecords context", { organizationId, userId, objectType, limit, after });
  if (!organizationId || !userId) {
    alert("Missing organization/user context. Please login again.");
    throw new Error("Missing organization/user context. Please login again.");
  }

  const data = await invokeZoho("list_records", {
    organizationId,
    userId,
    objectType,
    limit,
    after,
  });

  if (!data?.success) {
    console.error("[Zoho] listZohoRecords error", data?.error, { organizationId, userId, objectType, limit, after });
    throw new Error(data?.error || `Failed to load Zoho ${objectType}`);
  }

  return {
    objectType,
    total: Number(data?.total || 0),
    records: Array.isArray(data?.records) ? (data.records as ZohoRecord[]) : [],
  };
}
