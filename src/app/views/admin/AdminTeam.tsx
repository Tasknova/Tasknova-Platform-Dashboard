import { AdminTeamManagement } from "../../components/AdminTeamManagement";

export function AdminTeam() {
  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="px-8 py-5">
            <h1 className="text-lg font-semibold text-gray-900">Team Management</h1>
            <p className="text-sm text-gray-600 mt-0.5">Add, edit, and manage your team members</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <AdminTeamManagement />
        </div>
      </div>
    </div>
  );
}
