import { useState } from "react";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

interface Step2Props {
  data: any;
  onUpdate: (data: any) => void;
}

export default function OnboardingStep2({ data, onUpdate }: Step2Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const strength = calculatePasswordStrength(data.adminPassword || "");
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-green-600"];

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[\d\s\-\+\(\)]{10,}$/.test(phone);

  return (
    <Card className="bg-white border border-gray-200 p-8 rounded-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Admin Account</h1>
        <p className="text-gray-600">This account will be your primary administrator</p>
      </div>

      <div className="space-y-6">
        {/* Admin Name */}
        <div className="group">
          <Label htmlFor="adminName" className="text-sm font-semibold text-gray-900 mb-2 block">
            Full Name <span className="text-red-600">*</span>
          </Label>
          <Input
            id="adminName"
            type="text"
            value={data.adminName || ""}
            onChange={(e) => onUpdate({ ...data, adminName: e.target.value })}
            placeholder="John Doe"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            required
          />
        </div>

        {/* Admin Email */}
        <div className="group">
          <Label htmlFor="adminEmail" className="text-sm font-semibold text-gray-900 mb-2 flex items-center justify-between">
            <span>Email Address <span className="text-red-600">*</span></span>
            {isValidEmail(data.adminEmail) && <CheckCircle2 size={16} className="text-green-500" />}
          </Label>
          <Input
            id="adminEmail"
            type="email"
            value={data.adminEmail || ""}
            onChange={(e) => onUpdate({ ...data, adminEmail: e.target.value })}
            placeholder="john@company.com"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            required
          />
          {data.adminEmail && !isValidEmail(data.adminEmail) && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} /> Please enter a valid email
            </p>
          )}
        </div>

        {/* Admin Phone */}
        <div className="group">
          <Label htmlFor="adminPhone" className="text-sm font-semibold text-gray-900 mb-2 flex items-center justify-between">
            <span>Phone Number <span className="text-red-600">*</span></span>
            {isValidPhone(data.adminPhone) && <CheckCircle2 size={16} className="text-green-500" />}
          </Label>
          <Input
            id="adminPhone"
            type="tel"
            value={data.adminPhone || ""}
            onChange={(e) => onUpdate({ ...data, adminPhone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            required
          />
          {data.adminPhone && !isValidPhone(data.adminPhone) && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} /> Please enter a valid phone number
            </p>
          )}
        </div>

        {/* Password */}
        <div className="group">
          <Label htmlFor="adminPassword" className="text-sm font-semibold text-gray-900 mb-2 block">
            Password <span className="text-red-600">*</span>
          </Label>
          <div className="relative">
            <Input
              id="adminPassword"
              type={showPassword ? "text" : "password"}
              value={data.adminPassword || ""}
              onChange={(e) => onUpdate({ ...data, adminPassword: e.target.value })}
              placeholder="Create a strong password"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {data.adminPassword && (
            <div className="mt-3">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < strength ? strengthColors[strength] : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-semibold ${strength >= 2 ? "text-green-600" : "text-orange-600"}`}>
                {strengthLabels[strength]} password
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="group">
          <Label htmlFor="adminPasswordConfirm" className="text-sm font-semibold text-gray-900 mb-2 flex items-center justify-between">
            <span>Confirm Password <span className="text-red-600">*</span></span>
            {data.adminPasswordConfirm && data.adminPassword === data.adminPasswordConfirm && (
              <CheckCircle2 size={16} className="text-green-500" />
            )}
          </Label>
          <div className="relative">
            <Input
              id="adminPasswordConfirm"
              type={showConfirm ? "text" : "password"}
              value={data.adminPasswordConfirm || ""}
              onChange={(e) => onUpdate({ ...data, adminPasswordConfirm: e.target.value })}
              placeholder="Confirm your password"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {data.adminPasswordConfirm && data.adminPassword !== data.adminPasswordConfirm && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} /> Passwords do not match
            </p>
          )}
        </div>

        {/* Requirements */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Password requirements:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className={data.adminPassword?.length >= 8 ? "text-green-600" : ""}>
              ✓ At least 8 characters
            </li>
            <li className={data.adminPassword?.match(/[A-Z]/) ? "text-green-600" : ""}>
              ✓ One uppercase letter
            </li>
            <li className={data.adminPassword?.match(/[0-9]/) ? "text-green-600" : ""}>
              ✓ One number
            </li>
            <li className={data.adminPassword?.match(/[^a-zA-Z0-9]/) ? "text-green-600" : ""}>
              ✓ One special character
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
