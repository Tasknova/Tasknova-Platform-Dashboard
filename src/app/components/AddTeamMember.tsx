import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { createTeamMember, generateTemporaryPassword } from "../../lib/auth";

interface AddTeamMemberProps {
  orgId: string;
  onSuccess?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export function AddTeamMember({ orgId, onSuccess, isModal = false, onClose }: AddTeamMemberProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    role: "team_member" as "manager" | "team_member",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGeneratePassword = () => {
    const generated = generateTemporaryPassword();
    setFormData((prev) => ({
      ...prev,
      password: generated,
    }));
    setTempPassword(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.full_name.trim()) {
      setError("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const result = await createTeamMember(
        {
          email: formData.email,
          full_name: formData.full_name,
          phone_number: formData.phone_number || undefined,
          date_of_birth: formData.date_of_birth || undefined,
          role: formData.role,
          password: formData.password || undefined,
        },
        orgId
      );

      if (!result.success) {
        setError(result.error || "Failed to create team member");
        setLoading(false);
        return;
      }

      setSuccess(`Team member ${formData.full_name} added successfully!`);
      setTempPassword(result.data?.temporaryPassword || "");
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        role: "team_member",
        password: "",
      });

      // Call onSuccess after 2 seconds
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return isModal ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-3xl bg-white border border-gray-200 shadow-lg my-8">
        {/* Modal Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Add Team Member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Full Name & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@company.com"
                className="mt-1.5"
                required
              />
            </div>
          </div>

          {/* Phone & DOB */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700">
                Date of Birth
              </Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Role & Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role *
              </Label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1.5"
              >
                <option value="team_member">Team Member</option>
                <option value="manager">Manager</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave empty to auto-generate"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleGeneratePassword}
                  variant="outline"
                  className="px-3 text-sm"
                >
                  Generate
                </Button>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {tempPassword && (
                <p className="text-xs text-gray-600 mt-2">
                  Temp password will be sent to user's email
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  ) : (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Team Member</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@company.com"
              className="mt-1.5"
              required
            />
          </div>
        </div>

        {/* Phone & DOB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700">
              Date of Birth
            </Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Role & Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Role *
            </Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1.5"
            >
              <option value="team_member">Team Member</option>
              <option value="manager">Manager</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Leave empty to auto-generate"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleGeneratePassword}
                variant="outline"
                className="px-3 text-sm"
              >
                Generate
              </Button>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {tempPassword && (
              <p className="text-xs text-gray-600 mt-2">
                Temp password will be sent to user's email
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-green-700">{success}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Adding..." : "Add Team Member"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
