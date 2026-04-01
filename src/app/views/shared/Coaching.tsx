import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Phone,
  Video,
  Calendar,
  ChevronRight,
  Star,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Users,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";

const members = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Sales Rep",
    avatar: "SC",
    score: 87,
    change: +5,
    metrics: {
      callsCompleted: 42,
      avgDuration: "12:45",
      conversionRate: 34,
      quotaAttainment: 112,
    },
    strengths: ["Discovery", "Closing", "Objection Handling"],
    improvements: ["Follow-up Timing"],
    lastSession: "Mar 18, 2026",
    nextSession: "Mar 25, 2026",
    status: "on-track",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Sales Rep",
    avatar: "MJ",
    score: 72,
    change: -3,
    metrics: {
      callsCompleted: 38,
      avgDuration: "10:22",
      conversionRate: 28,
      quotaAttainment: 87,
    },
    strengths: ["Rapport Building", "Product Knowledge"],
    improvements: ["Discovery Questions", "Value Articulation"],
    lastSession: "Mar 19, 2026",
    nextSession: "Mar 22, 2026",
    status: "needs-attention",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Sales Rep",
    avatar: "ER",
    score: 91,
    change: +8,
    metrics: {
      callsCompleted: 45,
      avgDuration: "14:15",
      conversionRate: 41,
      quotaAttainment: 125,
    },
    strengths: ["Discovery", "ROI Discussion", "Closing", "Follow-up"],
    improvements: [],
    lastSession: "Mar 17, 2026",
    nextSession: "Mar 24, 2026",
    status: "excellent",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Junior Sales Rep",
    avatar: "DK",
    score: 65,
    change: +2,
    metrics: {
      callsCompleted: 32,
      avgDuration: "9:30",
      conversionRate: 22,
      quotaAttainment: 68,
    },
    strengths: ["Enthusiasm", "Product Knowledge"],
    improvements: ["Discovery", "Objection Handling", "Closing"],
    lastSession: "Mar 20, 2026",
    nextSession: "Mar 21, 2026",
    status: "developing",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    role: "Sales Rep",
    avatar: "JM",
    score: 83,
    change: +4,
    metrics: {
      callsCompleted: 40,
      avgDuration: "11:50",
      conversionRate: 32,
      quotaAttainment: 98,
    },
    strengths: ["Value Proposition", "Rapport", "Discovery"],
    improvements: ["Closing Confidence"],
    lastSession: "Mar 18, 2026",
    nextSession: "Mar 23, 2026",
    status: "on-track",
  },
  {
    id: "6",
    name: "Alex Thompson",
    role: "Senior Sales Rep",
    avatar: "AT",
    score: 79,
    change: -1,
    metrics: {
      callsCompleted: 41,
      avgDuration: "11:15",
      conversionRate: 30,
      quotaAttainment: 94,
    },
    strengths: ["Objection Handling", "Product Demo"],
    improvements: ["Discovery Depth", "Urgency Building"],
    lastSession: "Mar 19, 2026",
    nextSession: "Mar 22, 2026",
    status: "on-track",
  },
];

export function Coaching() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "excellent" | "on-track" | "needs-attention" | "developing">("all");

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-50 text-green-700 border-green-200";
      case "on-track":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "needs-attention":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "developing":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excellent";
      case "on-track":
        return "On Track";
      case "needs-attention":
        return "Needs Attention";
      case "developing":
        return "Developing";
      default:
        return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Coaching Intelligence</h1>
              <p className="text-sm text-gray-600 mt-1">Track team performance and coaching progress</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Link to="/manager/scheduler">
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4" />
                  Schedule Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="excellent">Excellent</option>
              <option value="on-track">On Track</option>
              <option value="needs-attention">Needs Attention</option>
              <option value="developing">Developing</option>
            </select>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              More
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Team Members</div>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{members.length}</div>
            <div className="text-xs text-gray-500 mt-1">Active reps</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Avg Team Score</div>
              <Award className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold text-blue-600">
              {Math.round(members.reduce((sum, m) => sum + m.score, 0) / members.length)}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3" />
              +3.2% this week
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">High Performers</div>
              <Star className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold text-green-600">
              {members.filter((m) => m.score >= 85).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Score 85+</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Need Support</div>
              <AlertCircle className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold text-yellow-600">
              {members.filter((m) => m.status === "needs-attention" || m.status === "developing").length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Require coaching</div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Score */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Performance Score</div>
                  <div className={`text-3xl font-bold ${getScoreColor(member.score)}`}>
                    {member.score}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.change > 0 ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+{member.change}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingDown className="w-4 h-4" />
                      <span className="text-sm font-medium">{member.change}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-semibold text-gray-900">{member.metrics.callsCompleted}</div>
                  <div className="text-xs text-gray-600">Calls</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-semibold text-gray-900">{member.metrics.avgDuration}</div>
                  <div className="text-xs text-gray-600">Avg Duration</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-semibold text-gray-900">{member.metrics.conversionRate}%</div>
                  <div className="text-xs text-gray-600">Conversion</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className={`text-lg font-semibold ${member.metrics.quotaAttainment >= 100 ? 'text-green-600' : 'text-gray-900'}`}>
                    {member.metrics.quotaAttainment}%
                  </div>
                  <div className="text-xs text-gray-600">Quota</div>
                </div>
              </div>

              {/* Status */}
              <div className="mb-4">
                <Badge className={`${getStatusColor(member.status)} text-xs border`}>
                  {getStatusLabel(member.status)}
                </Badge>
              </div>

              {/* Strengths */}
              {member.strengths.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    Strengths
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.strengths.map((strength, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {member.improvements.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-yellow-600" />
                    Areas for Improvement
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.improvements.map((improvement, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                        {improvement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>Last Session: {member.lastSession}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-7">
                    View Details
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                  <Button size="sm" className="flex-1 text-xs h-7 bg-blue-600 hover:bg-blue-700">
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
