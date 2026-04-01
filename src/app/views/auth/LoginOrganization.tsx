import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { customLogin } from "../../../lib/auth";

interface Organization {
  org_id: string;
  name: string;
}

export function LoginOrganization() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("orgs")
        .select("org_id, name")
        .order("name");

      if (fetchError) throw fetchError;
      setOrganizations(data || []);

      // Auto-select first org if only one
      if (data && data.length === 1) {
        setSelectedOrgId(data[0].org_id);
      }
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedOrgId) {
      setError("Please select an organization");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      // Use custom login function
      const result = await customLogin({
        orgId: selectedOrgId,
        email,
        password,
      });

      if (!result.success) {
        setError(result.error || "Login failed");
        setLoading(false);
        return;
      }

      // Get organization name
      const { data: orgData } = await supabase
        .from("orgs")
        .select("name")
        .eq("org_id", selectedOrgId)
        .single();

      // Store user data in localStorage
      localStorage.setItem("userRole", result.role);
      localStorage.setItem("userEmail", result.email);
      localStorage.setItem("userName", result.fullName || result.email.split("@")[0]);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userOrganization", selectedOrgId);
      localStorage.setItem("organizationName", orgData?.name || "Organization");

      // Redirect to role dashboard
      navigate(`/${result.role}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gray-800/50 border-gray-700 p-8 shadow-2xl">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to home</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">Sign In</h1>
            <p className="text-gray-400 text-sm">To your organization account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Organization Selector */}
            <div>
              <Label htmlFor="organization" className="text-sm font-medium text-gray-300">
                Organization
              </Label>
              {loadingOrgs ? (
                <div className="mt-2 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 text-sm">
                  Loading organizations...
                </div>
              ) : organizations.length === 0 ? (
                <div className="mt-2 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 text-sm">
                  No organizations found.{" "}
                  <button onClick={() => navigate("/signup")} className="text-blue-400 hover:text-blue-300">
                    Create one
                  </button>
                </div>
              ) : (
                <select
                  id="organization"
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="mt-2 w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select an organization</option>
                  {organizations.map((org) => (
                    <option key={org.org_id} value={org.org_id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-400">{error}</div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-11 font-medium transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an organization?{" "}
            <button onClick={() => navigate("/signup")} className="text-blue-400 hover:text-blue-300 font-medium">
              Create one
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-700 pt-6">
            <p>
              Need help?{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Contact support
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
