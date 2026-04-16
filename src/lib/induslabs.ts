/**
 * Induslabs API Integration
 * Handles authentication and call operations with Induslabs Click2Call API
 */

// Types
export interface InduslabsLoginResponse {
  status_code: number;
  message: string;
  error: string | null;
  data: {
    access_token: string;
  };
}

export interface InduslabsClick2CallResponse {
  status_code: number;
  message: string;
  error: string | null;
  data: {
    call_id: string;
    status: string;
    transcript: boolean;
    transcript_language: string;
  };
}

export interface InduslabsTranscriptResponse {
  status_code: number;
  message: string;
  error: string | null;
  data: {
    call_id: string;
    transcript_status: 'pending' | 'processing' | 'ready' | 'disabled' | 'failed';
    customer_number: string;
    agent_number: string;
    duration: number | null;
    recording: string | null;
    transcript: {
      summary?: string;
      history?: string;
    } | null;
  };
}

export interface InduslabsCallConfig {
  client_name: string;
  due_amount?: number;
  additional_details?: string;
}

// Configuration
const BASE_URL = import.meta.env.VITE_INDUSLABS_BASE_URL || 'https://developer.induslabs.io/api';
const EMAIL = import.meta.env.VITE_INDUSLABS_EMAIL || '';
const PASSWORD = import.meta.env.VITE_INDUSLABS_PASSWORD || '';
const DID = import.meta.env.VITE_INDUSLABS_DID || '';
const CALLBACK_URL = import.meta.env.VITE_INDUSLABS_CALLBACK_URL || '';

// Token storage
let cachedAccessToken: string | null = null;
let tokenExpireTime: number = 0;

/**
 * Login to Induslabs API and get access token
 */
export async function induslabsLogin(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedAccessToken && Date.now() < tokenExpireTime) {
    return cachedAccessToken;
  }

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data: InduslabsLoginResponse = await response.json();

    if (data.status_code !== 200 || !data.data?.access_token) {
      throw new Error(data.error || 'Login failed');
    }

    // Cache the token for 1 hour
    cachedAccessToken = data.data.access_token;
    tokenExpireTime = Date.now() + 3600000; // 1 hour

    return cachedAccessToken;
  } catch (error) {
    console.error('Induslabs login error:', error);
    throw error;
  }
}

/**
 * Make a click2call to a customer
 */
export async function induslabsClick2Call(
  customerNumber: string,
  agentNumber: string,
  enableTranscript: boolean = true,
  transcriptLanguage: string = 'en',
  agentConfig?: InduslabsCallConfig
): Promise<InduslabsClick2CallResponse['data']> {
  try {
    if (!DID) {
      throw new Error('Missing VITE_INDUSLABS_DID. Add it in your environment configuration.');
    }

    const token = await induslabsLogin();

    const payload: Record<string, any> = {
      customer_number: customerNumber,
      agent_number: agentNumber,
      did: DID,
      transcript: enableTranscript,
      transcript_language: transcriptLanguage,
    };

    if (CALLBACK_URL) {
      payload.callback_url = CALLBACK_URL;
    }

    if (agentConfig) {
      payload.agent_config = agentConfig;
    }

    const response = await fetch(`${BASE_URL}/calls/click2call`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Click2Call failed: ${response.statusText}`);
    }

    const data: InduslabsClick2CallResponse = await response.json();

    if (data.status_code !== 200 || !data.data?.call_id) {
      throw new Error(data.error || 'Click2Call failed');
    }

    return data.data;
  } catch (error) {
    console.error('Induslabs Click2Call error:', error);
    throw error;
  }
}

/**
 * Get transcript and status of a call
 * @param callId The Induslabs call ID
 * @returns Call data including transcript if ready
 */
export async function induslabsGetTranscript(
  callId: string
): Promise<InduslabsTranscriptResponse['data']> {
  try {
    const token = await induslabsLogin();

    const response = await fetch(`${BASE_URL}/calls/${callId}/transcript`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Get transcript failed: ${response.statusText}`);
    }

    const data: InduslabsTranscriptResponse = await response.json();

    if (data.status_code !== 200) {
      throw new Error(data.error || 'Get transcript failed');
    }

    return data.data;
  } catch (error) {
    console.error('Induslabs get transcript error:', error);
    throw error;
  }
}

/**
 * Poll for transcript until it's ready
 * @param callId The Induslabs call ID
 * @param maxAttempts Maximum number of polling attempts (default: 60)
 * @param intervalMs Interval between polls in milliseconds (default: 2000ms)
 * @returns Transcript data when ready
 */
export async function induslabsPollTranscript(
  callId: string,
  maxAttempts: number = 60,
  intervalMs: number = 2000
): Promise<InduslabsTranscriptResponse['data']> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const data = await induslabsGetTranscript(callId);

      if (data.transcript_status === 'ready') {
        return data;
      }

      // Wait before next attempt
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    } catch (error) {
      console.error(`Poll attempt ${attempt + 1} failed:`, error);
      // Continue polling even if there's an error
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }
  }

  throw new Error('Transcript not ready after maximum polling attempts');
}

/**
 * Clear the cached token (e.g., on logout)
 */
export function clearInduslabsToken() {
  cachedAccessToken = null;
  tokenExpireTime = 0;
}
