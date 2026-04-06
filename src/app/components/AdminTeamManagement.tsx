import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Plus, Trash2, Eye, EyeOff, Edit2, Copy, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { hashPassword, sendTeamInvite } from "../../lib/auth";

interface TeamMember {
  user_id: string;
  email: string;
  full_name: string;
  phone_number?: string | null;
  date_of_birth?: string | null;
  invitation_status?: string | null;
  invited_at?: string | null;
  accepted_at?: string | null;
  role: string;
  created_at: string;
}

function getUserFacingError(err: unknown, fallback: string): string {
  const code = typeof err === "object" && err !== null && "code" in err
    ? String((err as { code?: unknown }).code ?? "")
    : "";
  const message = typeof err === "object" && err !== null && "message" in err
    ? String((err as { message?: unknown }).message ?? "")
    : "";
  const details = typeof err === "object" && err !== null && "details" in err
    ? String((err as { details?: unknown }).details ?? "")
    : "";

  const combined = `${message} ${details}`.toLowerCase();
  if (
    code === "23505" ||
    combined.includes("uq_users_email_per_org") ||
    combined.includes("duplicate key value")
  ) {
    return "This email is already added in your organization. Please use a different email.";
  }

  if (message) return message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function AdminTeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberCredentials, setNewMemberCredentials] = useState<{ [key: string]: string }>({});
  const [copiedMemberId, setCopiedMemberId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ae" | "manager">("ae");
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRole, setSelectedRole] = useState<"manager" | "ae">("ae");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [retryingInviteUserId, setRetryingInviteUserId] = useState<string | null>(null);

  const organizationId = localStorage.getItem("userOrganization");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    if (showAddMember) {
      const frameId = requestAnimationFrame(() => setIsDrawerVisible(true));
      return () => cancelAnimationFrame(frameId);
    }

    setIsDrawerVisible(false);
  }, [showAddMember]);

  const closeAddMemberPanel = () => {
    setIsDrawerVisible(false);

    setTimeout(() => {
      setShowAddMember(false);
      setEditingMember(null);
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setDateOfBirth("");
      setPassword("");
      setConfirmPassword("");
      setSuccess("");
      setError("");
    }, 220);
  };

  const fetchTeamMembers = async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("user_id, email, full_name, phone_number, date_of_birth, invitation_status, invited_at, accepted_at, role, created_at")
        .eq("org_id", organizationId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setTeamMembers(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch team members";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If editing, use the edit handler instead
    if (editingMember) {
      return handleSaveEdit(e);
    }

    setError("");
    setSuccess("");

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
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

    if (!organizationId) {
      setError("Organization ID not found");
      return;
    }

    setSubmitting(true);

    try {
      const tempPassword = password;

      // Hash the password
      const passwordHash = await hashPassword(tempPassword);

      // Create user directly in database with password hash
      const { data: userData, error: userError } = await supabase.from("users").insert({
        email,
        full_name: fullName,
        phone_number: phoneNumber.trim() || null,
        date_of_birth: dateOfBirth || null,
        role: selectedRole,
        org_id: organizationId,
        is_active: true,
        password_hash: passwordHash,
        invitation_status: "REQUEST_PENDING",
        invited_at: null,
      }).select("user_id").single();

      if (userError) {
        setError(getUserFacingError(userError, "Failed to create team member"));
        setSubmitting(false);
        return;
      }

      if (!userData) {
        setError("Failed to create team member");
        setSubmitting(false);
        return;
      }

      // Send invite email immediately after successful creation
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userEmail = localStorage.getItem("userEmail") || user?.email || "";

      const { data: adminData } = await supabase
        .from("users")
        .select("full_name")
        .eq("email", userEmail)
        .eq("org_id", organizationId)
        .single();

      const { data: orgData } = await supabase
        .from("orgs")
        .select("name")
        .eq("org_id", organizationId)
        .single();

      const inviteResult = await sendTeamInvite(
        userData.user_id,
        email,
        fullName,
        selectedRole === "ae" ? "team_member" : selectedRole,
        organizationId,
        adminData?.full_name || localStorage.getItem("userName") || "Admin",
        orgData?.name || localStorage.getItem("organizationName") || "Organization",
        userEmail,
        tempPassword,
        `${window.location.origin}/login`
      );

      if (!inviteResult.success) {
        await supabase
          .from("users")
          .update({ invitation_status: "REQUEST_FAILED" })
          .eq("user_id", userData.user_id);

        setError(
          `Member added, but invitation email could not be sent: ${
            inviteResult.error || "Unknown error"
          }`
        );
      } else {
        setSuccess(`Invitation sent to ${email}`);
      }

      // Store credentials temporarily for the new member BEFORE resetting form
      if (userData?.user_id) {
        setNewMemberCredentials((prev) => ({
          ...prev,
          [userData.user_id]: tempPassword,
        }));
        // Auto-clear after 10 minutes
        setTimeout(() => {
          setNewMemberCredentials((prev) => {
            const updated = { ...prev };
            delete updated[userData.user_id];
            return updated;
          });
        }, 10 * 60 * 1000);
      }

      // Reset form
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setDateOfBirth("");
      setPassword("");
      setConfirmPassword("");
      closeAddMemberPanel();

      // Refresh team members
      await fetchTeamMembers();
    } catch (err) {
      const msg = getUserFacingError(err, "Failed to add team member");
      setError(msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;

    try {
      // Delete from users table
      const { error: deleteError } = await supabase.from("users").delete().eq("user_id", memberId);

      if (deleteError) throw deleteError;

      // Update local state
      setTeamMembers(teamMembers.filter((m) => m.user_id !== memberId));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete member";
      setError(msg);
      console.error(err);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setFullName(member.full_name);
    setEmail(member.email);
    setPhoneNumber(member.phone_number || "");
    setDateOfBirth(member.date_of_birth || "");
    setPassword("");
    setConfirmPassword("");
    setSelectedRole(member.role as "manager" | "ae");
    setShowAddMember(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setError("");
    setSuccess("");

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!organizationId) {
      setError("Organization ID not found");
      return;
    }

    setSubmitting(true);

    try {
      const updateData: any = {
        full_name: fullName,
        email,
        phone_number: phoneNumber.trim() || null,
        date_of_birth: dateOfBirth || null,
        role: selectedRole,
      };

      // Only update password if provided
      if (password) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setSubmitting(false);
          return;
        }
        const passwordHash = await hashPassword(password);
        updateData.password_hash = passwordHash;
      }

      const { error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("user_id", editingMember.user_id);

      if (updateError) {
        setError(getUserFacingError(updateError, "Failed to update team member"));
        setSubmitting(false);
        return;
      }

      // Reset form
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setDateOfBirth("");
      setPassword("");
      setConfirmPassword("");
      setEditingMember(null);
      closeAddMemberPanel();

      // Refresh team members
      await fetchTeamMembers();
    } catch (err) {
      const msg = getUserFacingError(err, "Failed to update team member");
      setError(msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const roleColors = {
    admin: "bg-red-100 text-red-800",
    manager: "bg-purple-100 text-purple-800",
    ae: "bg-blue-100 text-blue-800",
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrator",
      manager: "Manager",
      ae: "Account Executive",
    };
    return labels[role] || role;
  };

  const getInviteStatusMeta = (status?: string | null) => {
    if (status === "REQUEST_ACCEPTED") {
      return { label: "Accepted", className: "bg-green-100 text-green-700" };
    }
    if (status === "REQUEST_SENT") {
      return { label: "Invite Sent", className: "bg-blue-100 text-blue-700" };
    }
    if (status === "REQUEST_FAILED") {
      return { label: "Invite Failed", className: "bg-red-100 text-red-700" };
    }
    if (status === "REQUEST_PENDING") {
      return { label: "Sending...", className: "bg-amber-100 text-amber-700" };
    }
    return { label: "Not Sent", className: "bg-gray-100 text-gray-700" };
  };

  const handleCopyCredentials = (memberId: string, email: string) => {
    const password = newMemberCredentials[memberId];
    if (!password) return;

    const credentials = `Email: ${email}\nPassword: ${password}`;
    navigator.clipboard.writeText(credentials).then(() => {
      setCopiedMemberId(memberId);
      setTimeout(() => setCopiedMemberId(null), 2000);
    });
  };

  const handleRetryInvite = async (member: TeamMember) => {
    if (!organizationId) {
      setError("Organization ID not found");
      return;
    }

    setError("");
    setSuccess("");
    setRetryingInviteUserId(member.user_id);

    try {
      await supabase
        .from("users")
        .update({ invitation_status: "REQUEST_PENDING" })
        .eq("user_id", member.user_id);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userEmail = localStorage.getItem("userEmail") || user?.email || "";

      const { data: adminData } = await supabase
        .from("users")
        .select("full_name")
        .eq("email", userEmail)
        .eq("org_id", organizationId)
        .single();

      const { data: orgData } = await supabase
        .from("orgs")
        .select("name")
        .eq("org_id", organizationId)
        .single();

      const originalTempPassword = newMemberCredentials[member.user_id];
      if (!originalTempPassword) {
        await supabase
          .from("users")
          .update({ invitation_status: "REQUEST_FAILED" })
          .eq("user_id", member.user_id);

        setError(
          "Retry needs the original admin-set temporary password. Use Edit to set a new password, then retry."
        );
        await fetchTeamMembers();
        setRetryingInviteUserId(null);
        return;
      }

      const retryResult = await sendTeamInvite(
        member.user_id,
        member.email,
        member.full_name,
        member.role === "ae" ? "team_member" : member.role,
        organizationId,
        adminData?.full_name || localStorage.getItem("userName") || "Admin",
        orgData?.name || localStorage.getItem("organizationName") || "Organization",
        userEmail,
        originalTempPassword,
        `${window.location.origin}/login`
      );

      if (!retryResult.success) {
        await supabase
          .from("users")
          .update({ invitation_status: "REQUEST_FAILED" })
          .eq("user_id", member.user_id);

        setError(`Retry failed: ${retryResult.error || "Unknown error"}`);
      } else {
        setSuccess(`Invitation retried successfully for ${member.email}`);
      }

      await fetchTeamMembers();
    } catch (err) {
      await supabase
        .from("users")
        .update({ invitation_status: "REQUEST_FAILED" })
        .eq("user_id", member.user_id);

      setError(getUserFacingError(err, "Failed to retry invitation"));
    } finally {
      setRetryingInviteUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
        <Button
          onClick={() => {
            setEditingMember(null);
            setFullName("");
            setEmail("");
            setPhoneNumber("");
            setDateOfBirth("");
            setPassword("");
            setConfirmPassword("");
            setSelectedRole("ae");
            setShowAddMember(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Plus size={16} />
          Add Team Member
        </Button>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50">
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
              isDrawerVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeAddMemberPanel}
          />
          <Card
            className={`absolute right-0 top-0 h-full w-full max-w-xl bg-white border-l border-gray-200 shadow-2xl overflow-y-auto rounded-none p-6 transition-transform duration-200 ease-out ${
              isDrawerVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">{editingMember ? "Edit Team Member" : "Add Team Member"}</h3>
              <button
                onClick={closeAddMemberPanel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 pb-6">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-900">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-2 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@company.com"
                  className="mt-2 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-900">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="mt-2 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-900">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-2 bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-sm font-medium text-gray-900">
                  Role
                </Label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as "manager" | "ae")}
                  className="mt-2 w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2"
                >
                  <option value="ae">Account Executive</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Temporary Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 pr-10"
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

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-900"
                >
                  Confirm Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  {success}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={closeAddMemberPanel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {submitting ? (editingMember ? "Updating..." : "Adding...") : (editingMember ? "Update Member" : "Add Member")}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("ae")}
          className={`px-4 py-3 font-medium text-sm transition-all ${
            activeTab === "ae"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Representatives ({teamMembers.filter((m) => m.role === "ae").length})
        </button>
        <button
          onClick={() => setActiveTab("manager")}
          className={`px-4 py-3 font-medium text-sm transition-all ${
            activeTab === "manager"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Managers ({teamMembers.filter((m) => m.role === "manager").length})
        </button>
      </div>

      {/* Team Members List */}
      <div>
        {loading ? (
          <div className="text-gray-600 text-center py-12">Loading team members...</div>
        ) : teamMembers.filter((m) => m.role === activeTab).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No {activeTab === "ae" ? "representatives" : "managers"} yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-w-md">
            {teamMembers
              .filter((member) => member.role === activeTab)
              .map((member) => (
                <Card
                  key={member.user_id}
                  className="bg-white border-gray-200 p-6 hover:shadow-lg transition-all hover:border-gray-300"
                >
                  {/* Header with Avatar and Role */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{member.full_name}</p>
                        <p className="text-xs text-gray-500">Member</p>
                      </div>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        roleColors[member.role as keyof typeof roleColors] ||
                        "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {getRoleLabel(member.role)}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Email</p>
                    <p className="text-sm text-gray-700 break-all">{member.email}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Invitation</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          getInviteStatusMeta(member.invitation_status).className
                        }`}
                      >
                        {getInviteStatusMeta(member.invitation_status).label}
                      </span>
                    </div>
                  </div>

                  {/* Password (if newly created) */}
                  {newMemberCredentials[member.user_id] && (
                    <div className="mb-4 pb-4 border-b border-yellow-100 bg-yellow-50 rounded-lg p-3">
                      <p className="text-xs text-yellow-700 uppercase tracking-wide font-semibold mb-2">Temporary Credentials</p>
                      <div className="text-xs space-y-1">
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span> {member.email}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Password:</span> {newMemberCredentials[member.user_id]}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {member.invitation_status === "REQUEST_FAILED" && (
                      <button
                        onClick={() => handleRetryInvite(member)}
                        disabled={retryingInviteUserId === member.user_id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {retryingInviteUserId === member.user_id ? "Retrying..." : "Retry Invite"}
                      </button>
                    )}
                    {newMemberCredentials[member.user_id] && (
                      <button
                        onClick={() => handleCopyCredentials(member.user_id, member.email)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                          copiedMemberId === member.user_id
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                        }`}
                      >
                        {copiedMemberId === member.user_id ? (
                          <>
                            <Check size={16} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleEditMember(member)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    {member.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteMember(member.user_id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
