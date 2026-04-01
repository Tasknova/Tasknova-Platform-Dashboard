import { Link } from "react-router";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  MessageSquare,
  Phone,
  Award,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const organizationMetrics = {
  totalRevenue: 14000000,
  totalReps: 134,
  totalConversations: 24300,
  avgQuotaAttainment: 94,
  avgPerformanceScore: 87,
  systemUptime: 99.98,
};

const departmentPerformance = [
  {
    id: "1",
    department: "Enterprise Sales",
    manager: "Sarah Williams",
    reps: 24,
    revenue: 4200000,
    quota: 3750000,
    attainment: 112,
    avgScore: 9.2,
    trend: "up",
  },
  {
    id: "2",
    department: "Inside Sales",
    manager: "David Thompson",
    reps: 42,
    revenue: 1900000,
    quota: 2450000,
    attainment: 78,
    avgScore: 7.4,
    trend: "down",
  },
  {
    id: "3",
    department: "SMB Sales",
    manager: "Jennifer Lee",
    reps: 35,
    revenue: 3100000,
    quota: 3200000,
    attainment: 97,
    avgScore: 8.5,
    trend: "up",
  },
  {
    id: "4",
    department: "Strategic Accounts",
    manager: "Emily Rodriguez",
    reps: 18,
    revenue: 2900000,
    quota: 2800000,
    attainment: 104,
    avgScore: 9.0,
    trend: "up",
  },
  {
    id: "5",
    department: "Channel Partners",
    manager: "Michael Chen",
    reps: 15,
    revenue: 1900000,
    quota: 1800000,
    attainment: 106,
    avgScore: 8.8,
    trend: "up",
  },
];

const conversationMetrics = {
  totalCalls: 24300,
  avgTalkRatio: 43,
  avgQuestions: 15,
  avgEngagement: 85,
  avgMonologue: "2:20",
  recordedCalls: 23100,
  analyzedCalls: 22800,
};

const topPerformers = [
  {
    id: "1",
    name: "Taylor Brooks",
    department: "Enterprise Sales",
    revenue: 498000,
    attainment: 124,
    aiScore: 9.4,
  },
  {
    id: "2",
    name: "Alex Rivera",
    department: "SMB Sales",
    revenue: 480000,
    attainment: 118,
    aiScore: 8.9,
  },
  {
    id: "3",
    name: "Jordan Lee",
    department: "Strategic Accounts",
    revenue: 465000,
    attainment: 115,
    aiScore: 8.6,
  },
  {
    id: "4",
    name: "Riley Chen",
    department: "Enterprise Sales",
    revenue: 445000,
    attainment: 110,
    aiScore: 8.5,
  },
  {
    id: "5",
    name: "Sam Taylor",
    department: "Channel Partners",
    revenue: 425000,
    attainment: 106,
    aiScore: 8.2,
  },
];

const coachingOpportunities = [
  {
    id: "1",
    area: "Discovery Qualification",
    affectedReps: 42,
    department: "Inside Sales",
    impact: "High",
    description: "Missing SPICED criteria in 45% of deals. Focus on Impact & Decision Criteria.",
  },
  {
    id: "2",
    area: "Active Listening",
    affectedReps: 28,
    department: "Multiple",
    impact: "Medium",
    description: "Talk-time ratio above 50% in discovery calls. Need to improve questioning technique.",
  },
  {
    id: "3",
    area: "Objection Handling",
    affectedReps: 19,
    department: "SMB Sales",
    impact: "Medium",
    description: "Pricing objections not being addressed with ROI data. Deploy value calculator training.",
  },
];

export function AdminAnalytics() {
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
                <h1 className="text-lg font-semibold text-gray-900">Organization Analytics</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Comprehensive performance metrics across all departments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="w-4 h-4 mr-2" />
                Q1 2026
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Link to="/admin/reports">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                  <Download className="w-4 h-4 mr-2" />
                  Export Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6 max-w-[1600px]">
        {/* Organization Overview */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Organization Overview</h2>
          <div className="grid grid-cols-6 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Total Revenue</span>
                <DollarSign className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${(organizationMetrics.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700">+24% YoY</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Total Reps</span>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{organizationMetrics.totalReps}</div>
              <p className="text-xs text-gray-600 mt-2">Across 5 departments</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Conversations</span>
                <MessageSquare className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(organizationMetrics.totalConversations / 1000).toFixed(1)}K
              </div>
              <p className="text-xs text-gray-600 mt-2">This quarter</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Quota Attainment</span>
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {organizationMetrics.avgQuotaAttainment}%
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700">+12% vs Q4</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Performance Score</span>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {organizationMetrics.avgPerformanceScore}%
              </div>
              <p className="text-xs text-gray-600 mt-2">Organization avg</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">System Health</span>
                <BarChart3 className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {organizationMetrics.systemUptime}%
              </div>
              <p className="text-xs text-gray-600 mt-2">Uptime</p>
            </div>
          </div>
        </section>

        {/* Department Performance */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Department Performance</h2>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Sort by Attainment
            </Button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Reps
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Quota
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Attainment
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {departmentPerformance.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {dept.department}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{dept.manager}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{dept.reps}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      ${(dept.revenue / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">
                      ${(dept.quota / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge
                        className={
                          dept.attainment >= 100
                            ? "bg-green-100 text-green-700 border-green-200"
                            : dept.attainment >= 80
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {dept.attainment}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      {dept.avgScore}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {dept.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Conversation Intelligence */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Conversation Intelligence</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Total Calls</span>
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(conversationMetrics.totalCalls / 1000).toFixed(1)}K
              </div>
              <p className="text-xs text-gray-600 mt-2">This quarter</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Avg Talk Ratio</span>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {conversationMetrics.avgTalkRatio}:
                {100 - conversationMetrics.avgTalkRatio}
              </div>
              <p className="text-xs text-gray-600 mt-2">Organization avg</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Avg Questions</span>
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {conversationMetrics.avgQuestions}
              </div>
              <p className="text-xs text-gray-600 mt-2">Per call</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Engagement</span>
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {conversationMetrics.avgEngagement}%
              </div>
              <p className="text-xs text-gray-600 mt-2">Avg score</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Analyzed</span>
                <BarChart3 className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {((conversationMetrics.analyzedCalls / conversationMetrics.recordedCalls) * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {(conversationMetrics.analyzedCalls / 1000).toFixed(1)}K calls
              </p>
            </div>
          </div>
        </section>

        {/* Top Performers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Top Performers</h2>
            <Link to="/admin/performance">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                View All Reps
              </Button>
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Rep
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Department
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Attainment
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    AI Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topPerformers.map((performer, index) => (
                  <tr key={performer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {performer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{performer.department}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      ${(performer.revenue / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {performer.attainment}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      {performer.aiScore}/10
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Coaching Opportunities */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Coaching Opportunities</h2>
              <p className="text-xs text-gray-600 mt-0.5">Areas requiring organizational attention</p>
            </div>
            <Link to="/admin/coaching">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                View Coaching
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {coachingOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">{opportunity.area}</h3>
                      <Badge
                        className={
                          opportunity.impact === "High"
                            ? "bg-red-100 text-red-700 border-red-200 text-xs px-2 py-0.5 h-5"
                            : "bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5 h-5"
                        }
                      >
                        {opportunity.impact} Impact
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{opportunity.affectedReps} reps affected</span>
                      </div>
                      <span>•</span>
                      <span>{opportunity.department}</span>
                    </div>
                    <p className="text-sm text-gray-700">{opportunity.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Deploy Training
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
