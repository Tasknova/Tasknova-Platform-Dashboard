import { supabase } from "./supabase";

interface AppAuthContext {
  userId: string;
  email: string;
  organizationId: string;
  role: string;
}

interface GmailAuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  email: string;
}

interface EmailFetchResponse {
  success: boolean;
  emailsCount: number;
  emails: any[];
}

const GMAIL_STATE_FUNCTION = "gmail-state-v3";
const GMAIL_FETCH_FUNCTION = "fetch-gmail-emails-v3";

async function getFunctionErrorMessage(
  error: unknown,
  fallbackMessage: string
): Promise<string> {
  let message = fallbackMessage;

  if (error && typeof error === "object" && "message" in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      message = maybeMessage;
    }
  }

  const edgeContext = (error as { context?: Response } | null)?.context;
  if (edgeContext) {
    try {
      const body = (await edgeContext.json()) as { error?: string; message?: string };
      if (body?.error) return body.error;
      if (body?.message) return body.message;
    } catch {
      // Keep fallback when response body is unavailable.
    }
  }

  return message;
}

function getAppAuthContext(): AppAuthContext {
  if (typeof window === "undefined") {
    return {
      userId: "",
      email: "",
      organizationId: "",
      role: "",
    };
  }

  return {
    userId: localStorage.getItem("userId") || "",
    email: localStorage.getItem("userEmail") || localStorage.getItem("email") || "",
    organizationId: localStorage.getItem("userOrganization") || "",
    role: localStorage.getItem("userRole") || "",
  };
}

/**
 * Exchange authorization code for Gmail tokens using Edge Function
 */
export async function exchangeGmailCode(code: string): Promise<GmailAuthResponse> {
  const authContext = getAppAuthContext();
  if (!authContext.userId) {
    throw new Error("Please sign in before connecting Gmail.");
  }

  const { data, error } = await supabase.functions.invoke("auth-gmail-callback-v2", {
    body: {
      code,
      userId: authContext.userId,
      email: authContext.email,
      organizationId: authContext.organizationId,
      role: authContext.role,
    },
  });

  if (error) {
    throw new Error(await getFunctionErrorMessage(error, "Failed to exchange code"));
  }

  return (data || {}) as GmailAuthResponse;
}

/**
 * Refresh Gmail access token using Edge Function
 */
export async function refreshGmailToken(): Promise<{ access_token: string; expires_in: number }> {
  const authContext = getAppAuthContext();
  if (!authContext.userId) {
    throw new Error("Please sign in before refreshing Gmail.");
  }

  const { data, error } = await supabase.functions.invoke("auth-gmail-refresh-v2", {
    body: {
      userId: authContext.userId,
      email: authContext.email,
      organizationId: authContext.organizationId,
      role: authContext.role,
    },
  });

  if (error) {
    throw new Error(await getFunctionErrorMessage(error, "Failed to refresh token"));
  }

  return (data || {}) as { access_token: string; expires_in: number };
}

/**
 * Fetch emails from Gmail using Edge Function
 */
export async function fetchGmailEmails(daysToFetch: number): Promise<EmailFetchResponse> {
  const authContext = getAppAuthContext();
  if (!authContext.userId) {
    throw new Error("Please sign in before fetching Gmail messages.");
  }

  const { data, error } = await supabase.functions.invoke(GMAIL_FETCH_FUNCTION, {
    body: {
      daysToFetch,
      userId: authContext.userId,
      email: authContext.email,
      organizationId: authContext.organizationId,
      role: authContext.role,
    },
  });

  if (error) {
    throw new Error(await getFunctionErrorMessage(error, "Failed to fetch emails"));
  }

  return (data || {}) as EmailFetchResponse;
}

/**
 * Check if Gmail is connected for current user
 */
export async function checkGmailConnection(): Promise<boolean> {
  try {
    const authContext = getAppAuthContext();

    if (!authContext.userId) return false;

    const { data, error } = await supabase.functions.invoke(GMAIL_STATE_FUNCTION, {
      body: {
        action: "status",
        userId: authContext.userId,
        email: authContext.email,
        organizationId: authContext.organizationId,
      },
    });

    if (error) return false;

    return data?.isConnected === true;
  } catch {
    return false;
  }
}

/**
 * Disconnect Gmail account
 */
export async function disconnectGmail(options?: { deleteEmails?: boolean }): Promise<void> {
  const authContext = getAppAuthContext();

  if (!authContext.userId) throw new Error("Please sign in before disconnecting Gmail.");

  const deleteEmails = options?.deleteEmails ?? true;

  const { error } = await supabase.functions.invoke(GMAIL_STATE_FUNCTION, {
    body: {
      action: "disconnect",
      deleteEmails,
      userId: authContext.userId,
      email: authContext.email,
      organizationId: authContext.organizationId,
    },
  });

  if (error) throw new Error(await getFunctionErrorMessage(error, "Failed to disconnect Gmail"));
}

/**
 * Get stored emails from database
 */
export async function getStoredEmails(type?: "all" | "client" | "normal" | "filtered_out") {
  const authContext = getAppAuthContext();

  if (!authContext.userId) throw new Error("Please sign in before loading Gmail messages.");

  const { data, error } = await supabase.functions.invoke(GMAIL_STATE_FUNCTION, {
    body: {
      action: "list_emails",
      type: type || "all",
      userId: authContext.userId,
      email: authContext.email,
      organizationId: authContext.organizationId,
    },
  });

  if (error) throw new Error(await getFunctionErrorMessage(error, "Failed to fetch emails"));

  return data?.emails || [];
}
