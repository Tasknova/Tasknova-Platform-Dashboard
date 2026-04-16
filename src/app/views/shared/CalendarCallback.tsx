import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((result) => {
        window.clearTimeout(timerId);
        resolve(result);
      })
      .catch((error) => {
        window.clearTimeout(timerId);
        reject(error);
      });
  });
}

export function CalendarCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const hasStartedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting your calendar...");

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const completeConnect = async () => {
      const orgId = localStorage.getItem("userOrganization") || "";
      const userId = localStorage.getItem("userId") || "";
      const role = localStorage.getItem("userRole") || "admin";

      if (oauthError) {
        setStatus("error");
        setMessage(`Google authorization failed: ${oauthError}`);
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("Missing authorization code from Google.");
        return;
      }

      if (!orgId || !userId) {
        setStatus("error");
        setMessage("Missing user context. Please login again and reconnect calendar.");
        return;
      }

      let slowHintTimer: number | undefined;

      try {
        setMessage("Connecting your calendar...");

        slowHintTimer = window.setTimeout(() => {
          setMessage("Still connecting... initial meeting sync can take up to a minute.");
        }, 8000);

        const configuredCalendarRedirectUri = import.meta.env.VITE_GOOGLE_CALENDAR_REDIRECT_URI?.trim();
        const configuredRedirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI?.trim();
        const redirectUri =
          configuredCalendarRedirectUri && configuredCalendarRedirectUri.length > 0
            ? configuredCalendarRedirectUri
            : configuredRedirectUri && /\/calendar\/callback$/i.test(configuredRedirectUri)
            ? configuredRedirectUri
            : `${window.location.origin}/calendar/callback`;

        const connectResult = await withTimeout(
          supabase.functions.invoke("connect-google-calendar", {
            body: {
              code,
              organizationId: orgId,
              userId,
              redirectUri,
            },
          }),
          90000,
          "Calendar connection timed out."
        );

        const { data, error } = connectResult;
        if (slowHintTimer) {
          window.clearTimeout(slowHintTimer);
        }

        if (error) throw error;
        if (!data?.success) {
          throw new Error(data?.error || "Failed to connect calendar");
        }

        localStorage.setItem("calendarConnected", "true");
        setStatus("success");
        setMessage(`Calendar connected. Imported ${data.importedCount || 0} meetings. Redirecting...`);

        setTimeout(() => {
          const roleBasePath = role === "manager" ? "/manager" : role === "rep" ? "/rep" : "/admin";
          const redirectTarget = `${roleBasePath}/meetings`;

          // Try in-app navigation first.
          navigate(redirectTarget);

          // Fallback for cases where SPA navigation is blocked.
          window.setTimeout(() => {
            if (window.location.pathname !== redirectTarget) {
              window.location.replace(redirectTarget);
            }
          }, 300);
        }, 1200);
      } catch (err) {
        if (slowHintTimer) {
          window.clearTimeout(slowHintTimer);
        }

        // Continue gracefully if initial callback call is slow or transiently fails.
        let recoveredFromStatusCheck = false;

        // Recovery path: if callback response timed out but integration completed,
        // status check lets us proceed without leaving users stuck on loading.
        try {
          const statusResult = await withTimeout(
            supabase.functions.invoke("connect-google-calendar", {
              body: {
                action: "get_meetings",
                organizationId: orgId,
                userId,
              },
            }),
            8000,
            "Status check timed out."
          );

          if (statusResult.data?.calendarConnected) {
            recoveredFromStatusCheck = true;
            localStorage.setItem("calendarConnected", "true");
            setStatus("success");
            setMessage("Calendar connected. Redirecting...");

            const roleBasePath = role === "manager" ? "/manager" : role === "rep" ? "/rep" : "/admin";
            const redirectTarget = `${roleBasePath}/meetings`;
            window.setTimeout(() => {
              navigate(redirectTarget);
              window.setTimeout(() => {
                if (window.location.pathname !== redirectTarget) {
                  window.location.replace(redirectTarget);
                }
              }, 300);
            }, 800);
          }
        } catch {
          // Ignore status-check failures and use original error below.
        }

        if (recoveredFromStatusCheck) {
          return;
        }

        let errorMessage = err instanceof Error ? err.message : "Calendar connection failed";

        const edgeContext = (err as { context?: Response } | null)?.context;
        if (edgeContext) {
          try {
            const body = (await edgeContext.json()) as { error?: string };
            if (body?.error) {
              errorMessage = body.error;
            }
          } catch {
            // Keep the existing error message when response body is unavailable.
          }
        }

        setStatus("error");
        setMessage(errorMessage);
      }
    };

    completeConnect();
  }, [navigate, code, oauthError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg p-8 border border-gray-200">
        <div className="text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Connecting Calendar</h2>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Connected Successfully</h2>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Connection Failed</h2>
            </>
          )}

          <p className="text-sm text-gray-600">{message}</p>

          {status === "error" && (
            <Button className="mt-6 bg-blue-600 hover:bg-blue-700" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
