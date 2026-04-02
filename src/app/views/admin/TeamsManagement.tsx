import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Tabs } from "../../components/ui/tabs";
import { AddTeamMember } from "../../components/AddTeamMember";
import { TeamMembersList } from "../../components/TeamMembersList";
import { CSVBulkUpload } from "../../components/CSVBulkUpload";
import { Users, Download } from "lucide-react";
import { Button } from "../../components/ui/button";

export function TeamsManagement() {
  const orgId = localStorage.getItem("userOrganization") || "";
  const userRole = localStorage.getItem("userRole") || "";
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("members");

  // Only admins can access this page
  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            Only administrators can access the Teams Management page.
          </p>
        </Card>
      </div>
    );
  }

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const downloadCSVTemplate = () => {
    const template =
      "full_name,email,phone_number,date_of_birth,role,password\\nJohn Doe,john@example.com,+1 (555) 000-0000,1990-01-15,manager,\\nJane Smith,jane@example.com,+1 (555) 000-0001,1992-03-21,team_member,";
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(template)
    );
    element.setAttribute("download", "team_members_template.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teams Management</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Add, manage, and invite team members to your organization
                </p>
              </div>
            </div>
            <Button
              onClick={downloadCSVTemplate}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV Template
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-white border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Total Members</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
          </Card>
          <Card className="p-4 bg-white border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Pending Invites</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">-</p>
          </Card>
          <Card className="p-4 bg-white border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Accepted</p>
            <p className="text-2xl font-bold text-green-600 mt-1">-</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("members")}
              className={`pb-3 px-4 font-medium text-sm transition-colors ${
                activeTab === "members"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Team Members
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`pb-3 px-4 font-medium text-sm transition-colors ${
                activeTab === "add"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Add Member
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`pb-3 px-4 font-medium text-sm transition-colors ${
                activeTab === "bulk"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Bulk Upload
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "members" && (
              <TeamMembersList orgId={orgId} refreshTrigger={refreshTrigger} />
            )}

            {activeTab === "add" && (
              <AddTeamMember orgId={orgId} onSuccess={handleAddSuccess} />
            )}

            {activeTab === "bulk" && (
              <CSVBulkUpload orgId={orgId} onSuccess={handleAddSuccess} />
            )}
          </div>
        </Tabs>

        {/* Help Section */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-semibold text-blue-600">1.</span>
              <span>Add individual members manually or upload multiple users via CSV</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-blue-600">2.</span>
              <span>Each member receives an invitation email with their temporary password</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-blue-600">3.</span>
              <span>Members click the invite link and log in with their temporary password</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-blue-600">4.</span>
              <span>Upon login, the invitation is marked as accepted</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
