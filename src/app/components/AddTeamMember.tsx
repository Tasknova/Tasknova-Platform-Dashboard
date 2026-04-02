import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { createTeamMember, generateTemporaryPassword } from "../../lib/auth";

interface AddTeamMemberProps {
  orgId: string;
  onSuccess?: () => void;
}

export function AddTeamMember({ orgId, onSuccess }: AddTeamMemberProps) {
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

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Team Member</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              className="mt-1"
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
              className="mt-1"
              required
            />
          </div>

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
              className="mt-1"
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
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Role *
            </Label>
            <Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1"
            >
              <option value="team_member">Team Member</option>
              <option value="manager">Manager</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="mt-1 flex gap-2">
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
                className="px-3"
              >
                Generate
              </Button>
            </div>
            {tempPassword && (
              <p className="text-xs text-gray-600 mt-1">
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
