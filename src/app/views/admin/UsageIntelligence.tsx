import { useState } from "react";
import {
  Users,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  Phone,
  Video,
  Mail,
  MessageSquare,
  Calendar,
  Filter,
  Download,
  ChevronDown,
  BarChart3,
  Target,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const activityData = [
  {
    id: "1",
    user: "Sarah Chen",
    avatar: "SC",
    role: "Sales Rep",
    lastActive: "2 min ago",
    todayActivity: {
      calls: 8,
      meetings: 3,
      emails: 12,
      messages: 24,
    },
    weekActivity: {
      calls: 42,
      meetings: 18,
      emails: 67,
      messages: 145,
    },
    avgSessionTime: "6h 45m",
    productivity: 94,
    status: "active",
  },
  {
    id: "2",
    user: "Marcus Johnson",
    avatar: "MJ",
    role: "Sales Rep",
    lastActive: "15 min ago",
    todayActivity: {
      calls: 6,
      meetings: 2,
      emails: 9,
      messages: 18,
    },
    weekActivity: {
      calls: 38,
      meetings: 14,
      emails: 52,
      messages: 112,
    },
    avgSessionTime: "5h 30m",
    productivity: 78,
    status: "active",
  },
  {
    id: "3",
    user: "Emily Rodriguez",
    avatar: "ER",
    role: "Sales Rep",
    lastActive: "1 hour ago",
    todayActivity: {
      calls: 10,
      meetings: 4,
      emails: 15,
      messages: 28,
    },
    weekActivity: {
      calls: 45,
      meetings: 20,
      emails: 78,
      messages: 162,
    },
    avgSessionTime: "7h 15m",
    productivity: 98,
    status: "idle",
  },
  {
    id: "4",
    user: "David Kim",
    avatar: "DK",
    role: "Junior Sales Rep",
    lastActive: "3 hours ago",
    todayActivity: {
      calls: 5,
      meetings: 2,
      emails: 7,
      messages: 14,
    },
    weekActivity: {
      calls: 32,
      meetings: 11,
      emails: 42,
      messages: 89,
    },
    avgSessionTime: "5h 00m",
    productivity: 68,
    status: "offline",
  },
  {
    id: "5",
    user: "Jessica Martinez",
    avatar: "JM",
    role: "Sales Rep",
    lastActive: "5 min ago",
    todayActivity: {
      calls: 7,
      meetings: 3,
      emails: 11,
      messages: 22,
    },
    weekActivity: {
      calls: 40,
      meetings: 16,
      emails: 61,
      messages: 128,
    },
    avgSessionTime: "6h 20m",
    productivity: 86,
    status: "active",
  },
  {
    id: "6",
    user: "Alex Thompson",
    avatar: "AT",
    role: "Senior Sales Rep",
    lastActive: "30 min ago",
    todayActivity: {
      calls: 9,
      meetings: 3,
      emails: 13,
      messages: 26,
    },
    weekActivity: {
      calls: 41,
      meetings: 17,
      emails: 65,
      messages: 138,
    },
    avgSessionTime: "6h 50m",
    productivity: 91,
    status: "active",
  },
];

export function UsageIntelligence() {
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "idle" | "offline">("all");
  const [timeRange, setTimeRange] = useState<"today" | "week">("today");

  const filteredData = activityData.filter((item) => {
    return filterStatus === "all" || item.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getProductivityColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const totalUsers = activityData.length;
  const activeUsers = activityData.filter((u) => u.status === "active").length;
  const avgProductivity = Math.round(
    activityData.reduce((sum, u) => sum + u.productivity, 0) / totalUsers
  );
  const totalCalls = activityData.reduce((sum, u) => sum + (timeRange === "today" ? u.todayActivity.calls : u.weekActivity.calls), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Usage Intelligence</h1>
              <p className="text-sm text-gray-600 mt-1">Monitor team activity and platform usage</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={timeRange === "today" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange("today")}
                  className="h-7"
                >
                  Today
                </Button>
                <Button
                  variant={timeRange === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange("week")}
                  className="h-7"
                >
                  This Week
                </Button>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="offline">Offline</option>
            </select>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Users</div>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{totalUsers}</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${getStatusColor("active")}`}></span>
              {activeUsers} active now
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Avg Productivity</div>
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold text-blue-600">{avgProductivity}%</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3" />
              +5% vs last {timeRange === "today" ? "day" : "week"}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Calls</div>
              <Phone className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{totalCalls}</div>
            <div className="text-xs text-gray-500 mt-1">{timeRange === "today" ? "Today" : "This week"}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Avg Session</div>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {Math.round(
                activityData.reduce((sum, u) => {
                  const [hours, mins] = u.avgSessionTime.split("h ");
                  return sum + parseInt(hours) * 60 + parseInt(mins);
                }, 0) / totalUsers / 60 * 10) / 10}h
            </div>
            <div className="text-xs text-gray-500 mt-1">Average time online</div>
          </div>
        </div>

        {/* Activity Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    User
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Status
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Activity {timeRange === "today" ? "(Today)" : "(Week)"}
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Avg Session
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Productivity
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item) => {
                const activity = timeRange === "today" ? item.todayActivity : item.weekActivity;
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {item.avatar}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(item.status)}`}></span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.user}</div>
                          <div className="text-xs text-gray-500">{item.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : item.status === "idle"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {getStatusLabel(item.status)}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">{item.lastActive}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="w-3 h-3 text-blue-600" />
                          <span className="text-gray-900 font-medium">{activity.calls}</span>
                          <span className="text-gray-500">calls</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Video className="w-3 h-3 text-purple-600" />
                          <span className="text-gray-900 font-medium">{activity.meetings}</span>
                          <span className="text-gray-500">meetings</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="w-3 h-3 text-green-600" />
                          <span className="text-gray-900 font-medium">{activity.emails}</span>
                          <span className="text-gray-500">emails</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <MessageSquare className="w-3 h-3 text-orange-600" />
                          <span className="text-gray-900 font-medium">{activity.messages}</span>
                          <span className="text-gray-500">messages</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{item.avgSessionTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`text-lg font-semibold ${getProductivityColor(item.productivity)}`}>
                          {item.productivity}%
                        </div>
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              item.productivity >= 90
                                ? "bg-green-500"
                                : item.productivity >= 75
                                ? "bg-blue-500"
                                : item.productivity >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${item.productivity}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
