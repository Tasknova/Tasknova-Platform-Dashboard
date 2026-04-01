import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

const users = {
  rep: { email: "rep@tasknova.com", password: "rep123", role: "rep" },
  manager: { email: "manager@tasknova.com", password: "manager123", role: "manager" },
  admin: { email: "admin@tasknova.com", password: "admin123", role: "admin" },
};

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [demoExpanded, setDemoExpanded] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    const user = Object.values(users).find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", user.role.charAt(0).toUpperCase() + user.role.slice(1));
      navigate(`/${user.role}`);
    } else {
      setError("Invalid email or password");
    }
  };

  const handleDemoLogin = (userType: "rep" | "manager" | "admin") => {
    const user = users[userType];
    setEmail(user.email);
    setPassword(user.password);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", userType.charAt(0).toUpperCase() + userType.slice(1));
    navigate(`/${user.role}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white border border-gray-200 p-8 shadow-lg rounded-2xl animate-fadeIn">
          {/* Logo */}
          <div className="text-center mb-10">
            <img 
              src="/assets/tasknova-logo.png" 
              alt="Tasknova Logo" 
              className="w-20 h-20 mx-auto mb-6 rounded-3xl shadow-md"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tasknova
            </h1>
            <p className="text-gray-600 text-sm">
              AI-powered Revenue Intelligence
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="group">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-900 mb-2.5 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tasknova.com"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>

            <div className="group">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-900 mb-2.5 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-slideDown">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-700 font-medium">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-11 font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Sign In
            </Button>
          </form>

          {/* Quick Access with Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setDemoExpanded(!demoExpanded)}
              className="w-full text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center justify-between mb-3"
            >
              <span>Demo Accounts</span>
              <span className={`text-xs transition-transform ${demoExpanded ? "rotate-180" : ""}`}>▾</span>
            </button>

            {demoExpanded && (
              <div className="space-y-2 animate-fadeIn">
                {[
                  { type: "rep" as const, icon: "👤", desc: "Sales Rep account" },
                  { type: "manager" as const, icon: "📊", desc: "Manager account" },
                  { type: "admin" as const, icon: "⚙️", desc: "Admin account" },
                ].map(({ type, icon, desc }) => (
                  <button
                    key={type}
                    onClick={() => handleDemoLogin(type)}
                    className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-900 mb-1">
                          {icon} {type.charAt(0).toUpperCase() + type.slice(1)}
                        </p>
                        <p className="text-xs text-gray-600">{users[type].email}</p>
                      </div>
                      <CheckCircle2 size={16} className="text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Create organization
              </button>
            </p>
          </div>
        </Card>

        {/* Info Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>This is a demo environment. Use the demo accounts above to explore all features.</p>
        </div>
      </div>
    </div>
  );
}
