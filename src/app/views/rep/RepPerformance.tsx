import { Link } from "react-router";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Activity,
  Mic,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Calendar,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Mail,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const performanceMetrics = {
  aiScore: 8.4,
  talkListenRatio: 42,
  avgQuestions: 18,
  avgMonologue: "2:15",
  engagementScore: 92,
  actionItemCompletion: 85,
  callsThisMonth: 42,
  totalMeetings: 28,
};

const weeklyTrend = [
  { week: "Week 1", score: 7.8, calls: 8 },
  { week: "Week 2", score: 8.1, calls: 10 },
  { week: "Week 3", score: 8.3, calls: 12 },
  { week: "Week 4", score: 8.4, calls: 12 },
];

const skillsBreakdown = [
  {
    skill: "Discovery Questioning",
    score: 94,
    trend: "up",
    change: "+35%",
    description: "Asking more open-ended questions early in calls, leading to 22% longer prospect talk time.",
    recommendation: "Keep this up! Your discovery technique is driving strong engagement.",
  },
  {
    skill: "Objection Handling",
    score: 88,
    trend: "up",
    change: "+28%",
    description: "Anchoring with ROI data before discussing price, reducing pushback by 28%.",
    recommendation: "Excellent improvement. Continue using ROI calculator in pricing discussions.",
  },
  {
    skill: "Active Listening",
    score: 72,
    trend: "down",
    change: "58%",
    description: "Your average talk time is 58%, above the recommended 42% for discovery calls.",
    recommendation: "Focus on asking questions and listening more. Aim for 40% talk time or less.",
  },
  {
    skill: "Value Communication",
    score: 85,
    trend: "stable",
    change: "0%",
    description: "Consistently articulating product value and ROI to prospects.",
    recommendation: "Maintain current approach. Consider using more customer success stories.",
  },
];

const recentCallScores = [
  {
    id: "1",
    company: "CloudVista",
    date: "Yesterday, 1:00 PM",
    type: "Discovery",
    score: 92,
    highlights: ["Excellent questioning", "Strong engagement", "Clear next steps"],
    areasToImprove: ["Reduce monologue length"],
  },
  {
    id: "2",
    company: "Innovate Labs",
    date: "Feb 25, 3:00 PM",
    type: "Demo",
    score: 78,
    highlights: ["Good product knowledge", "Handled objections well"],
    areasToImprove: ["More discovery questions", "Less talking, more listening"],
  },
  {
    id: "3",
    company: "TechStart",
    date: "Feb 24, 11:00 AM",
    type: "Demo",
    score: 89,
    highlights: ["Great pacing", "Strong value proposition", "Multi-stakeholder engagement"],
    areasToImprove: ["Follow up on action items faster"],
  },
];

const quotaProgress = {
  quota: 500000,
  achieved: 498000,
  attainment: 99.6,
  rank: "2nd",
  totalReps: 7,
};

export function RepPerformance() {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <Link to="/rep/dashboard">
                <Button variant="outline" size="sm" className="h-8">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">My Performance</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {performanceMetrics.callsThisMonth} calls analyzed this month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
              <Link to="/rep/compose-email?type=performance-report">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                  <Mail className="w-4 h-4 mr-2" />
                  Share with Manager
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6 max-w-[1400px]">
        {/* Performance Overview */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Performance Overview</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">AI Performance Score</span>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{performanceMetrics.aiScore}/10</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700">+0.6 vs last month</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Quota Attainment</span>
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{quotaProgress.attainment}%</div>
              <p className="text-xs text-gray-600 mt-2">
                ${(quotaProgress.achieved / 1000).toFixed(0)}K / ${(quotaProgress.quota / 1000).toFixed(0)}K
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Team Ranking</span>
                <Award className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{quotaProgress.rank}</div>
              <p className="text-xs text-gray-600 mt-2">out of {quotaProgress.totalReps} reps</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Engagement Score</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{performanceMetrics.engagementScore}%</div>
              <p className="text-xs text-gray-600 mt-2">Above average</p>
            </div>
          </div>
        </section>

        {/* Conversation Intelligence Metrics */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Conversation Intelligence</h2>
          <div className="grid grid-cols-4 gap-4">
            {/* Talk-Listen Ratio */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <Mic className="w-4 h-4 text-blue-600" />
                <Badge className="text-xs px-2 py-0.5 h-5 bg-blue-50 text-blue-700 border-blue-200">
                  Good
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">{performanceMetrics.talkListenRatio}:58</div>
              <p className="text-xs text-gray-600 mb-2">Talk-Listen Ratio</p>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${performanceMetrics.talkListenRatio}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">You talk {performanceMetrics.talkListenRatio}% of time</p>
            </div>

            {/* Questions Asked */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{performanceMetrics.avgQuestions}</div>
              <p className="text-xs text-gray-600 mb-2">Avg. Questions/Call</p>
              <div className="flex items-center gap-1 mt-2">
                <Badge className="text-xs px-1.5 py-0 h-4 bg-green-50 text-green-700 border-green-200">
                  +35% improvement
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">Target: 15-20 questions</p>
            </div>

            {/* Longest Monologue */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <Badge className="text-xs px-2 py-0.5 h-5 bg-orange-50 text-orange-700 border-orange-200">
                  Watch
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">{performanceMetrics.avgMonologue}</div>
              <p className="text-xs text-gray-600 mb-2">Longest Monologue</p>
              <div className="flex items-center gap-1 mt-2">
                <AlertTriangle className="w-3 h-3 text-orange-600" />
                <span className="text-xs text-orange-700">Above recommended</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Target: Under 1:30</p>
            </div>

            {/* Action Items */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{performanceMetrics.actionItemCompletion}%</div>
              <p className="text-xs text-gray-600 mb-2">Action Item Follow-through</p>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${performanceMetrics.actionItemCompletion}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">17 of 20 completed</p>
            </div>
          </div>
        </section>

        {/* Skills Breakdown */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Skills Breakdown</h2>
          <div className="space-y-3">
            {skillsBreakdown.map((skill, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {skill.trend === "up" ? (
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <ThumbsUp className="w-5 h-5 text-green-600" />
                        </div>
                      ) : skill.trend === "down" ? (
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <ThumbsDown className="w-5 h-5 text-red-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{skill.skill}</h3>
                      <p className="text-xs text-gray-600 mb-2">{skill.description}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      skill.score >= 85
                        ? "bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5"
                        : skill.score >= 70
                        ? "bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5 h-5"
                        : "bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5 h-5"
                    }
                  >
                    {skill.score}%
                  </Badge>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${
                      skill.score >= 85
                        ? "bg-green-600"
                        : skill.score >= 70
                        ? "bg-blue-600"
                        : "bg-orange-600"
                    }`}
                    style={{ width: `${skill.score}%` }}
                  ></div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium text-blue-900 mb-1">Recommendation</div>
                      <div className="text-xs text-blue-800">{skill.recommendation}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Call Scores */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Call Scores</h2>
            <Link to="/rep/calls">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                View All Calls
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentCallScores.map((call) => (
              <div key={call.id} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        to={`/rep/meeting/${call.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {call.company}
                      </Link>
                      <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                        {call.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{call.date}</p>
                  </div>
                  <Badge
                    className={
                      call.score >= 85
                        ? "bg-green-100 text-green-700 border-green-200"
                        : call.score >= 70
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-orange-100 text-orange-700 border-orange-200"
                    }
                  >
                    Score: {call.score}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-2">Highlights</div>
                    <ul className="space-y-1">
                      {call.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-2">Areas to Improve</div>
                    <ul className="space-y-1">
                      {call.areasToImprove.map((area, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0 text-orange-600" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Performance Trend */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Weekly Performance Trend</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              {weeklyTrend.map((week, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium text-gray-900">{week.week}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">AI Score: {week.score}/10</span>
                      <span className="text-xs text-gray-600">{week.calls} calls</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(week.score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
