import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../../../lib/supabase";

const roleConfig = {
  rep: { title: "Sales Representative", color: "blue" },
  manager: { title: "Sales Manager", color: "purple" },
  admin: { title: "Administrator", color: "orange" },
};

export function RoleSignup() {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!role || !["rep", "manager", "admin"].includes(role)) {
    return navigate("/");
  }

  const config = roleConfig[role as keyof typeof roleConfig];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // Create user profile in database
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Continue anyway, profile can be created manually
      }

      // Show success message and redirect to login
      alert("Signup successful! Please check your email for verification before logging in.");
      navigate(`/login/${role}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const colorMap = {
    blue: { gradient: "from-blue-500 to-cyan-500", button: "bg-blue-600 hover:bg-blue-700" },
    purple: { gradient: "from-purple-500 to-pink-500", button: "bg-purple-600 hover:bg-purple-700" },
    orange: { gradient: "from-orange-500 to-red-500", button: "bg-orange-600 hover:bg-orange-700" },
  };

  const colors = colorMap[config.color as keyof typeof colorMap];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-72 h-72 bg-gradient-to-br ${colors.gradient} rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob`}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gray-800/50 border-gray-700 p-8 shadow-2xl">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to role selection</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">{config.title}</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-300">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                required
              />
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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700/50"
              />
              Show passwords
            </label>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full ${colors.button} text-white border-0 h-11 font-medium transition-all`}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate(`/login/${role}`)}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign In
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
