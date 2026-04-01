import { Link } from "react-router";
import {
  ArrowLeft,
  Download,
  Mail,
  FileText,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  Target,
  TrendingUp,
  Building2,
  Activity,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useState } from "react";

const reportTypes = [
  {
    id: "revenue",
    name: "Revenue Performance Report",
    description: "Comprehensive revenue metrics across all departments",
    icon: DollarSign,
    frequency: "Monthly",
    lastGenerated: "Mar 1, 2026",
    size: "2.4 MB",
  },
  {
    id: "performance",
    name: "Team Performance Report",
    description: "Individual and team performance metrics with AI insights",
    icon: Activity,
    frequency: "Weekly",
    lastGenerated: "Feb 27, 2026",
    size: "1.8 MB",
  },
  {
    id: "pipeline",
    name: "Pipeline Health Report",
    description: "Deal progression, pipeline coverage, and forecast accuracy",
    icon: Target,
    frequency: "Weekly",
    lastGenerated: "Feb 27, 2026",
    size: "1.2 MB",
  },
  {
    id: "conversation",
    name: "Conversation Intelligence Report",
    description: "Talk patterns, engagement scores, and coaching opportunities",
    icon: BarChart3,
    frequency: "Monthly",
    lastGenerated: "Mar 1, 2026",
    size: "3.1 MB",
  },
  {
    id: "quota",
    name: "Quota Attainment Report",
    description: "Quota performance by department and individual rep",
    icon: TrendingUp,
    frequency: "Monthly",
    lastGenerated: "Mar 1, 2026",
    size: "980 KB",
  },
  {
    id: "department",
    name: "Department Comparison Report",
    description: "Cross-department metrics and best practices",
    icon: Building2,
    frequency: "Quarterly",
    lastGenerated: "Jan 15, 2026",
    size: "2.7 MB",
  },
];

const scheduledReports = [
  {
    id: "1",
    name: "Weekly Executive Summary",
    recipients: ["CEO", "CRO", "CFO"],
    schedule: "Every Monday, 8:00 AM",
    status: "active",
  },
  {
    id: "2",
    name: "Monthly Board Package",
    recipients: ["Board of Directors"],
    schedule: "1st of every month, 9:00 AM",
    status: "active",
  },
  {
    id: "3",
    name: "Department Performance Digest",
    recipients: ["All Managers"],
    schedule: "Every Friday, 5:00 PM",
    status: "active",
  },
];

export function AdminReports() {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const toggleReport = (id: string) => {
    if (selectedReports.includes(id)) {
      setSelectedReports(selectedReports.filter((r) => r !== id));
    } else {
      setSelectedReports([...selectedReports, id]);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard">
                <Button variant="outline" size="sm" className="h-8">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Reports & Export</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Generate and download organization-wide reports
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedReports.length > 0 && (
                <>
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="w-4 h-4 mr-2" />
                    Download ({selectedReports.length})
                  </Button>
                  <Link to={`/admin/compose-email?type=reports&reports=${selectedReports.join(",")}`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Reports
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6 max-w-[1400px]">
        {/* Quick Export Options */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Export Options</h2>
          <div className="grid grid-cols-4 gap-4">
            <Link
              to="/admin/compose-email?type=weekly-summary"
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5 h-5">
                  Weekly
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Executive Summary</h3>
              <p className="text-xs text-gray-600">Email weekly performance summary</p>
            </Link>

            <Link
              to="/admin/compose-email?type=monthly-board"
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs px-2 py-0.5 h-5">
                  Monthly
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Board Package</h3>
              <p className="text-xs text-gray-600">Comprehensive board presentation</p>
            </Link>

            <Link
              to="/admin/compose-email?type=department-digest"
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <Users className="w-5 h-5 text-green-600" />
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5">
                  Weekly
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Department Digest</h3>
              <p className="text-xs text-gray-600">Send to all department managers</p>
            </Link>

            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5 h-5">
                  Custom
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Custom Report</h3>
              <p className="text-xs text-gray-600">Build custom analytics report</p>
            </div>
          </div>
        </section>

        {/* Available Reports */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Available Reports</h2>
            <p className="text-xs text-gray-600">
              Select reports to download or email
            </p>
          </div>
          <div className="space-y-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              const isSelected = selectedReports.includes(report.id);

              return (
                <div
                  key={report.id}
                  onClick={() => toggleReport(report.id)}
                  className={`bg-white border rounded-lg p-5 hover:shadow-md transition-all cursor-pointer ${
                    isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {report.name}
                          </h3>
                          <p className="text-xs text-gray-600">{report.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                          {report.frequency}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Last generated: {report.lastGenerated}</span>
                        <span>•</span>
                        <span>Size: {report.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download
                      </Button>
                      <Link to={`/admin/compose-email?type=report&reportId=${report.id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          <Mail className="w-3.5 h-3.5 mr-1.5" />
                          Email
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Scheduled Reports */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Scheduled Reports</h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Automated report delivery schedules
              </p>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              + Add Schedule
            </Button>
          </div>
          <div className="space-y-3">
            {scheduledReports.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">{schedule.name}</h3>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{schedule.recipients.join(", ")}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{schedule.schedule}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs text-red-600">
                      Pause
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
