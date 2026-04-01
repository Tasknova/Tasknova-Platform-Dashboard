import { Link } from "react-router";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Activity,
  Users,
  Mic,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const teamMetrics = {
  avgTalkListenRatio: 42,
  avgQuestionsPerCall: 16,
  avgMonologue: "2:15",
  avgEngagementScore: 87,
  teamSize: 7,
  totalCalls: 142,
  totalMeetings: 98,
};

const repPerformance = [
  {
    id: "1",
    name: "Taylor Brooks",
    avatar: "TB",
    aiScore: 9.4,
    talkRatio: 38,
    questions: 18,
    engagement: 92,
    deals: 8,
    pipelineValue: 520000,
    trend: "up",
    callsThisWeek: 24,
  },
  {
    id: "2",
    name: "Alex Rivera",
    avatar: "AR",
    aiScore: 8.9,
    talkRatio: 40,
    questions: 17,
    engagement: 89,
    deals: 12,
    pipelineValue: 490000,
    trend: "up",
    callsThisWeek: 28,
  },
  {
    id: "3",
    name: "Jordan Lee",
    avatar: "JL",
    aiScore: 8.6,
    talkRatio: 41,
    questions: 16,
    engagement: 88,
    deals: 10,
    pipelineValue: 475000,
    trend: "up",
    callsThisWeek: 22,
  },
  {
    id: "4",
    name: "Riley Chen",
    avatar: "RC",
    aiScore: 8.5,
    talkRatio: 43,
    questions: 15,
    engagement: 86,
    deals: 9,
    pipelineValue: 465000,
    trend: "stable",
    callsThisWeek: 20,
  },
  {
    id: "5",
    name: "Sam Taylor",
    avatar: "ST",
    aiScore: 8.2,
    talkRatio: 45,
    questions: 14,
    engagement: 84,
    deals: 7,
    pipelineValue: 430000,
    trend: "stable",
    callsThisWeek: 18,
  },
  {
    id: "6",
    name: "Morgan Smith",
    avatar: "MS",
    aiScore: 7.8,
    talkRatio: 46,
    questions: 13,
    engagement: 81,
    deals: 9,
    pipelineValue: 420000,
    trend: "stable",
    callsThisWeek: 16,
  },
  {
    id: "7",
    name: "Casey Johnson",
    avatar: "CJ",
    aiScore: 7.2,
    talkRatio: 52,
    questions: 11,
    engagement: 76,
    deals: 11,
    pipelineValue: 340000,
    trend: "down",
    callsThisWeek: 14,
  },
];

const performanceCategories = [
  {
    category: "Top Performers",
    description: "AI Score 8.5+",
    reps: repPerformance.filter((r) => r.aiScore >= 8.5),
    color: "green",
  },
  {
    category: "Meeting Expectations",
    description: "AI Score 7.5-8.4",
    reps: repPerformance.filter((r) => r.aiScore >= 7.5 && r.aiScore < 8.5),
    color: "blue",
  },
  {
    category: "Needs Coaching",
    description: "AI Score < 7.5",
    reps: repPerformance.filter((r) => r.aiScore < 7.5),
    color: "orange",
  },
];

const skillsBreakdown = [
  {
    skill: "Discovery Questioning",
    teamAvg: 82,
    topPerformer: "Taylor Brooks",
    topScore: 94,
    needsCoaching: ["Casey Johnson", "Morgan Smith"],
  },
  {
    skill: "Active Listening",
    teamAvg: 78,
    topPerformer: "Alex Rivera",
    topScore: 91,
    needsCoaching: ["Casey Johnson"],
  },
  {
    skill: "Objection Handling",
    teamAvg: 75,
    topPerformer: "Jordan Lee",
    topScore: 88,
    needsCoaching: ["Casey Johnson", "Sam Taylor"],
  },
  {
    skill: "Value Communication",
    teamAvg: 80,
    topPerformer: "Taylor Brooks",
    topScore: 92,
    needsCoaching: ["Morgan Smith"],
  },
];

export function ManagerPerformance() {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <Link to="/manager/dashboard">
                <Button variant="outline" size="sm" className="h-8">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Team Performance</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {teamMetrics.teamSize} reps • {teamMetrics.totalCalls} calls analyzed this month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
              <Link to="/manager/coaching">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                  <Award className="w-4 h-4 mr-2" />
                  Coaching Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6">
        {/* Team Overview Metrics */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Team Overview</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Avg AI Score</span>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">8.4/10</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700">+0.6 vs last month</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Talk-Listen Ratio</span>
                <Mic className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{teamMetrics.avgTalkListenRatio}:58</div>
              <p className="text-xs text-gray-600 mt-2">Team avg: {teamMetrics.avgTalkListenRatio}%</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Questions/Call</span>
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{teamMetrics.avgQuestionsPerCall}</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700">+28% improvement</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Engagement Score</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{teamMetrics.avgEngagementScore}%</div>
              <p className="text-xs text-gray-600 mt-2">Above industry avg</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Avg Monologue</span>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{teamMetrics.avgMonologue}</div>
              <p className="text-xs text-orange-700 mt-2">Target: Under 1:30</p>
            </div>
          </div>
        </section>

        {/* Performance Distribution */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Performance Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            {performanceCategories.map((category) => (
              <div
                key={category.category}
                className={`bg-white border rounded-lg p-5 ${
                  category.color === "green"
                    ? "border-green-200"
                    : category.color === "blue"
                    ? "border-blue-200"
                    : "border-orange-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">{category.category}</h3>
                  <Badge
                    className={
                      category.color === "green"
                        ? "bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5"
                        : category.color === "blue"
                        ? "bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5 h-5"
                        : "bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5 h-5"
                    }
                  >
                    {category.reps.length} reps
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.reps.map((rep) => (
                    <div
                      key={rep.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                          {rep.avatar}
                        </div>
                        <span className="text-sm text-gray-900">{rep.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{rep.aiScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rep Performance Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Individual Performance</h2>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Export Report
            </Button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Rep
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    AI Score
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Talk Ratio
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Questions
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Calls/Week
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Pipeline
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {repPerformance.map((rep) => (
                  <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                          {rep.avatar}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{rep.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        className={
                          rep.aiScore >= 8.5
                            ? "bg-green-100 text-green-700 border-green-200"
                            : rep.aiScore >= 7.5
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                        }
                      >
                        {rep.aiScore}/10
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{rep.talkRatio}%</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{rep.questions}</td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      {rep.engagement}%
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {rep.callsThisWeek}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      ${(rep.pipelineValue / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 text-center">
                      {rep.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />}
                      {rep.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600 mx-auto" />}
                      {rep.trend === "stable" && <Activity className="w-4 h-4 text-gray-400 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link to={`/manager/coaching/${rep.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Coach
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Skills Breakdown */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Skills Breakdown</h2>
          <div className="space-y-3">
            {skillsBreakdown.map((skill, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{skill.skill}</h3>
                    <p className="text-xs text-gray-600">Team Average: {skill.teamAvg}%</p>
                  </div>
                  <Badge
                    className={
                      skill.teamAvg >= 80
                        ? "bg-green-100 text-green-700 border-green-200"
                        : skill.teamAvg >= 70
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-orange-100 text-orange-700 border-orange-200"
                    }
                  >
                    {skill.teamAvg}%
                  </Badge>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full ${
                      skill.teamAvg >= 80
                        ? "bg-green-600"
                        : skill.teamAvg >= 70
                        ? "bg-blue-600"
                        : "bg-orange-600"
                    }`}
                    style={{ width: `${skill.teamAvg}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-xs text-gray-600">Top Performer</div>
                      <div className="text-sm font-medium text-gray-900">
                        {skill.topPerformer} ({skill.topScore}%)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="text-xs text-gray-600">Needs Coaching</div>
                      <div className="text-sm text-gray-900">{skill.needsCoaching.join(", ")}</div>
                    </div>
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
