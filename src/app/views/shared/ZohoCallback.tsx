import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { exchangeZohoCode } from "../../../lib/zohoApi";

export function ZohoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const server = searchParams.get("server") || undefined;
  const state = searchParams.get("state") || undefined;
  const hasStartedRef = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting Zoho CRM...");

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const run = async () => {
      const role = localStorage.getItem("userRole") || "rep";

      if (oauthError) {
        setStatus("error");
        setMessage(`Zoho authorization failed: ${oauthError}`);
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("Missing authorization code from Zoho.");
        return;
      }

      try {
        const result = await exchangeZohoCode(code, state);

        if (!result.connected) {
          throw new Error("Zoho connection could not be completed.");
        }

        localStorage.setItem("crmConnected", "true");
        localStorage.setItem("crmProvider", "zoho");
        window.dispatchEvent(new Event("crm-status-changed"));

        setStatus("success");
        setMessage("Zoho connected successfully. Redirecting...");

        const roleBasePath = role === "manager" ? "/manager" : role === "admin" ? "/admin" : "/rep";
        const target = `${roleBasePath}/crm`;

        window.setTimeout(() => {
          navigate(target);
          window.setTimeout(() => {
            if (window.location.pathname !== target) {
              window.location.replace(target);
            }
          }, 300);
        }, 1200);
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Zoho connection failed.");
      }
    };

    run();
  }, [code, navigate, oauthError, state, server]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg p-8 border border-gray-200">
        <div className="text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Connecting Zoho CRM</h2>
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
