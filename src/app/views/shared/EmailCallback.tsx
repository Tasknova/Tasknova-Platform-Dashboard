import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { AlertCircle, CheckCircle } from "lucide-react";
import { exchangeGmailCode } from "../../../lib/gmailApi";

const GMAIL_OAUTH_RESULT_KEY = "gmail_oauth_result";

export function EmailCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const role = localStorage.getItem("userRole") || "rep";
  const roleBasePath = role === "manager" ? "/manager" : role === "admin" ? "/admin" : "/rep";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [statusMessage, setStatusMessage] = useState("Exchanging authorization code for access tokens...");

  useEffect(() => {
    const handleCallback = async () => {
      const hasActiveOpener = Boolean(window.opener && !window.opener.closed);

      const publishResult = (payload: { type: "gmail_auth_success"; code: string } | { type: "gmail_auth_error"; error: string }) => {
        localStorage.setItem(
          GMAIL_OAUTH_RESULT_KEY,
          JSON.stringify({ ...payload, ts: Date.now() })
        );

        window.opener?.postMessage(payload, window.location.origin);

        // Best effort close when popup was opened by script.
        window.setTimeout(() => {
          try {
            window.close();
          } catch {
            // Ignore close errors; user can close manually.
          }
        }, 600);
      };

      if (error) {
        console.error("OAuth error:", error);
        setStatus("error");
        setStatusMessage(error);
        publishResult({
          type: "gmail_auth_error",
          error,
        });
        return;
      }

      if (!code) {
        console.error("No authorization code received");
        setStatus("error");
        setStatusMessage("No authorization code received");
        publishResult({
          type: "gmail_auth_error",
          error: "No authorization code received",
        });
        return;
      }

      try {
        if (hasActiveOpener) {
          setStatus("success");
          setStatusMessage("Authorization received. Returning to your dashboard...");
          publishResult({
            type: "gmail_auth_success",
            code,
          });
        } else {
          await exchangeGmailCode(code);
          localStorage.setItem("gmailConnected", "true");

          setStatus("success");
          setStatusMessage("Gmail connected. Redirecting to your dashboard...");
        }

        // Fallback for non-popup flow and blocked close attempts.
        window.setTimeout(() => {
          window.location.replace(`${roleBasePath}/emails`);
        }, 1200);
      } catch (err) {
        console.error("Error handling OAuth callback:", err);
        setStatus("error");
        setStatusMessage(err instanceof Error ? err.message : "Unknown error occurred");
        publishResult({
          type: "gmail_auth_error",
          error: err instanceof Error ? err.message : "Unknown error occurred",
        });
      }
    };

    handleCallback();
  }, [code, error, roleBasePath]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <div className="mb-4">
          {status === "error" ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
              <h1 className="text-xl font-semibold text-gray-900">Authentication Error</h1>
              <p className="text-gray-600 text-sm mt-2">{statusMessage}</p>
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <h1 className="text-lg font-semibold text-gray-900 mt-4">Gmail Authorized</h1>
              <p className="text-gray-600 text-sm mt-2">{statusMessage}</p>
              <p className="text-gray-500 text-xs mt-4 italic">If this window does not close automatically, you will be redirected shortly.</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h1 className="text-lg font-semibold text-gray-900 mt-4">Authenticating Gmail</h1>
              <p className="text-gray-600 text-sm mt-2">{statusMessage}</p>
              <p className="text-gray-500 text-xs mt-4 italic">
                You can close this window after a few seconds.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
