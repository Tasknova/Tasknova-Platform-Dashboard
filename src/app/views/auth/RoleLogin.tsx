import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ArrowLeft, Building2, Users, User, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { customLogin, getAppRole } from "../../../lib/auth";

interface Organization {
  org_id: string;
  name: string;
}

const roleConfig = {
  rep: { 
    title: "Employee Login", 
    subtitle: "Sign in to access your assigned leads and make calls",
    icon: User,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    buttonColor: "bg-purple-500 hover:bg-purple-600" 
  },
  manager: { 
    title: "Manager Login",
    subtitle: "Sign in to manage your team and leads",
    icon: Users,
    color: "bg-green-100",
    iconColor: "text-green-600",
    buttonColor: "bg-green-500 hover:bg-green-600" 
  },
  admin: { 
    title: "Admin Login",
    subtitle: "Sign in to access admin dashboard and settings",
    icon: Building2,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonColor: "bg-blue-500 hover:bg-blue-600" 
  },
};

export function RoleLogin() {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  if (!role || !["rep", "manager", "admin"].includes(role)) {
    return navigate("/");
  }

  const config = roleConfig[role as keyof typeof roleConfig];

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
        email,
        password,
      });

      if (!result.success) {
        setError(result.error || "Login failed");
        setLoading(false);
        return;
      }

      const appRole = getAppRole(result.role);

      // Verify user has correct role
      if (appRole !== role) {
        setError(`You don't have access to ${config.title} account`);
        setLoading(false);
        return;
      }

      // Get organization name
      const { data: orgData } = await supabase
        .from("orgs")
        .select("name")
        .eq("org_id", result.orgId)
        .single();

      // Store user data in localStorage
      localStorage.setItem("userRole", appRole);
      localStorage.setItem("userEmail", result.email);
      localStorage.setItem("userName", result.fullName || result.email.split("@")[0]);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userOrganization", result.orgId);
      localStorage.setItem("organizationName", orgData?.name || "Organization");

      // Redirect to role dashboard
      navigate(`/${appRole}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const colorMap = {
    blue: { button: "bg-blue-600 hover:bg-blue-700" },
    purple: { button: "bg-purple-600 hover:bg-purple-700" },
    green: { button: "bg-green-600 hover:bg-green-700" },
  };

  const colors = colorMap[config.color as keyof typeof colorMap] || colorMap.blue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white border-0 p-8 shadow-lg rounded-2xl">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${config.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {config.icon && <config.icon className={`w-8 h-8 ${config.iconColor}`} />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h1>
            <p className="text-gray-600 text-sm">{config.subtitle}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Organization Selector */}
            <div>
              <Label htmlFor="organization" className="text-sm font-semibold text-gray-900 block mb-2">
                Organization
              </Label>
              {loadingOrgs ? (
                <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 text-sm">
                  Loading organizations...
                </div>
              ) : organizations.length === 0 ? (
                <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 text-sm">
                  No organizations found.{" "}
                  <button onClick={() => navigate("/signup")} className="text-blue-600 hover:text-blue-700 font-medium">
                    Create one
                  </button>
                </div>
              ) : (
                <select
                  id="organization"
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-900 block mb-2">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-gray-900 block mb-2">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full ${config.buttonColor} text-white border-0 h-11 font-semibold rounded-lg transition-all mt-6`}
            >
              {loading ? "Signing in..." : `Sign In as ${config.title.split(" ")[0]}`}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate(`/signup/${role}`)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign Up
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
