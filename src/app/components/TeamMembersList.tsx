import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle2, Mail, Loader2 } from "lucide-react";
import { getTeamMembers, resendTeamInvite, TeamMember } from "../../lib/auth";
import { supabase } from "../../lib/supabase";

interface TeamMembersListProps {
  orgId: string;
  refreshTrigger?: number;
}

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  REQUEST_SENT: {
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    icon: <Mail className="w-4 h-4" />,
  },
  REQUEST_ACCEPTED: {
    bg: "bg-green-50",
    text: "text-green-800",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
};

export function TeamMembersList({ orgId, refreshTrigger = 0 }: TeamMembersListProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [orgId, refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      // Get admin info
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userEmail = localStorage.getItem("userEmail") || user?.email || "";
      const { data: adminData } = await supabase
        .from("users")
        .select("full_name")
        .eq("email", userEmail)
        .single();

      setAdminName(adminData?.full_name || "Admin");

      // Get org name
      const { data: orgData } = await supabase
        .from("orgs")
        .select("name")
        .eq("org_id", orgId)
        .single();

      setOrgName(orgData?.name || "Organization");

      // Get team members
      const result = await getTeamMembers(orgId);
      if (!result.success) {
        setError(result.error);
      } else {
        setMembers(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvite = async (member: TeamMember) => {
    setResendingId(member.user_id);
    setResendError(null);
    setResendSuccess(null);

    try {
      const senderEmail = localStorage.getItem("userEmail") || "";
      const loginUrl = `${window.location.origin}/login`;

      const result = await resendTeamInvite(
        member.user_id,
        member.email,
        member.full_name,
        member.role,
        orgId,
        adminName,
        orgName,
        senderEmail,
        loginUrl
      );

      if (!result.success) {
        setResendError(result.error || "Failed to resend invitation");
      } else {
        setResendSuccess(`Invitation resent to ${member.email}`);
        // Reload members to show updated status
        setTimeout(() => {
          loadData();
          setResendSuccess(null);
        }, 2000);
      }
    } catch (err) {
      setResendError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setResendingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {resendError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-700">{resendError}</span>
        </div>
      )}

      {resendSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-green-700">{resendSuccess}</span>
        </div>
      )}

      {members.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No team members yet. Add your first team member above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Invited</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const statusConfig =
                  statusColors[member.invitation_status] || statusColors.REQUEST_SENT;

                return (
                  <tr key={member.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{member.full_name}</p>
                      {member.phone_number && (
                        <p className="text-xs text-gray-600">{member.phone_number}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{member.email}</td>
                    <td className="py-3 px-4">
                      <Badge className="capitalize text-xs">
                        {member.role.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                        <span className={statusConfig.text}>
                          {statusConfig.icon}
                        </span>
                        <span className={`text-xs font-medium ${statusConfig.text}`}>
                          {member.invitation_status === "REQUEST_SENT"
                            ? "Pending"
                            : member.invitation_status === "REQUEST_ACCEPTED"
                            ? "Accepted"
                            : member.invitation_status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {member.invited_at
                        ? new Date(member.invited_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {member.invitation_status === "REQUEST_SENT" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResendInvite(member)}
                            disabled={resendingId === member.user_id}
                            className="text-xs"
                          >
                            {resendingId === member.user_id ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="w-3 h-3 mr-1" />
                                Resend
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600">
        Total members: <span className="font-semibold">{members.length}</span>
      </div>
    </Card>
  );
}
