import { Link } from "react-router";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Phone,
  Target,
  TrendingUp,
  Users,
  Zap,
  ArrowUpRight,
  Building2,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  Award,
  TrendingDown,
  ChevronRight,
  Filter,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  GraduationCap,
  BarChart3,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Minus,
  DollarSign,
  CircleDot,
  Mic,
  Mail,
  Trophy,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useState } from "react";

const todaysAgenda = [
  {
    id: "1",
    time: "9:00 AM",
    duration: "30m",
    title: "Pipeline Review",
    type: "Team Meeting",
    attendees: ["Casey Johnson", "Morgan Smith"],
    dealValue: "$605K",
    focusAreas: ["At-risk deals review", "Q1 forecast update"],
  },
  {
    id: "2",
    time: "11:00 AM",
    duration: "45m",
    title: "1-on-1 Coaching",
    type: "Coaching Session",
    attendees: ["Casey Johnson"],
    dealValue: "$480K",
    focusAreas: ["Discovery skills", "Quota recovery plan"],
  },
  {
    id: "3",
    time: "2:00 PM",
    duration: "60m",
    title: "Sales Leadership Sync",
    type: "Leadership Meeting",
    attendees: ["VP Sales", "Other Managers"],
    dealValue: null,
    focusAreas: ["Q1 wrap-up", "Q2 planning"],
  },
  {
    id: "4",
    time: "3:30 PM",
    duration: "30m",
    title: "Deal Strategy Session",
    type: "Deal Review",
    attendees: ["Taylor Brooks", "Alex Rivera"],
    dealValue: "$1.77M",
    focusAreas: ["Enterprise deals", "Closing strategies"],
  },
];

const todaysTasks = [
  {
    id: "1",
    title: "Review Casey's at-risk deals (3 deals, $480K)",
    rep: "Casey Johnson",
    dueTime: "Before 11:00 AM",
    priority: "high",
    status: "todo",
  },
  {
    id: "2",
    title: "Approve Morgan's discount request for GlobalTech",
    rep: "Morgan Smith",
    dueTime: "12:00 PM",
    priority: "high",
    status: "todo",
  },
  {
    id: "3",
    title: "Prepare Q1 forecast for leadership meeting",
    rep: null,
    dueTime: "1:30 PM",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "4",
    title: "Review Taylor's enterprise deal closing plan",
    rep: "Taylor Brooks",
    dueTime: "3:00 PM",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: "5",
    title: "Send team performance summary to VP Sales",
    rep: null,
    dueTime: "EOD",
    priority: "medium",
    status: "todo",
  },
  {
    id: "6",
    title: "Complete weekly team review notes",
    rep: null,
    dueTime: "Completed",
    priority: "medium",
    status: "completed",
  },
];

const teamHighlights = [
  {
    id: "1",
    rep: "Taylor Brooks",
    avatar: "TB",
    date: "Yesterday, 2:30 PM",
    type: "Win",
    outcome: "Positive",
    title: "Closed TechCorp Enterprise Deal",
    dealValue: "$498K",
    keyTakeaways: [
      "Deal closed 2 weeks early",
      "Used ROI calculator in final presentation",
      "Multi-threaded with 4 stakeholders",
    ],
    aiInsight: "Taylor's discovery technique led to 92% engagement score. This pattern shows asking 18+ questions early drives faster closes.",
  },
  {
    id: "2",
    rep: "Casey Johnson",
    avatar: "CJ",
    date: "Yesterday, 4:00 PM",
    type: "Risk",
    outcome: "Negative",
    title: "DataFlow Systems - No Response (10 days)",
    dealValue: "$125K",
    keyTakeaways: [
      "Last contact was budget discussion",
      "Champion went silent after pricing",
      "Competitor may be in play",
    ],
    aiInsight: "Deal stalled after pricing discussion. Recommend multi-threading and executive sponsor involvement within 48 hours.",
  },
];

const followUps = [
  {
    id: "1",
    priority: "urgent",
    dueDate: "Today",
    rep: "Casey Johnson",
    avatar: "CJ",
    task: "Intervene on DataFlow deal - no engagement in 10 days. Join next call to rebuild momentum.",
    dealValue: "$125K",
    action: "Join Call",
  },
  {
    id: "2",
    priority: "high",
    dueDate: "Tomorrow",
    rep: "Morgan Smith",
    avatar: "MS",
    task: "Approve discount request for GlobalTech deal. Currently 8% below standard - review competitive intel.",
    dealValue: "$95K",
    action: "Review & Approve",
  },
  {
    id: "3",
    priority: "medium",
    dueDate: "Mon, Mar 2",
    rep: "Jordan Lee",
    avatar: "JL",
    task: "Review deal progression with 3 enterprise deals in proposal stage. Ensure multi-threading strategy.",
    dealValue: "$385K",
    action: "Schedule Review",
  },
];

const topLearnings = [
  {
    id: "1",
    title: "Top Performers Pattern",
    trend: "up",
    change: "+42%",
    insight: "Taylor & Alex ask 18+ discovery questions early in calls",
    description: "Top performers are multi-threading with 3+ stakeholders, leading to 42% faster deal velocity.",
    action: "Coach team on early stakeholder mapping",
  },
  {
    id: "2",
    title: "Team Discovery Skills",
    trend: "up",
    change: "+28%",
    insight: "Team average questions/call increased from 12 to 16",
    description: "After last week's coaching session, the team is asking better qualifying questions in discovery calls.",
    action: "Continue current coaching approach",
  },
  {
    id: "3",
    title: "At-Risk Pattern",
    trend: "down",
    change: "-18%",
    insight: "Deals stalling after pricing discussions",
    description: "3 deals went silent within 48hrs of pricing. Casey needs coaching on ROI-anchored pricing conversations.",
    action: "Schedule Casey 1-on-1 on pricing",
  },
];

// Team productivity metrics
const teamProductivity = [
  {
    rep: "Casey Johnson",
    avatar: "CJ",
    callsMade: 47,
    callsAnswered: 32,
    callsNotAnswered: 15,
    answerRate: 68,
    avgCallDuration: "28m",
    meetingsScheduled: 12,
    emailsSent: 89,
    dealsAdvanced: 5,
    talkTime: "14.2 hrs",
    status: "below-target",
    trend: "down",
  },
  {
    rep: "Morgan Smith",
    avatar: "MS",
    callsMade: 62,
    callsAnswered: 51,
    callsNotAnswered: 11,
    answerRate: 82,
    avgCallDuration: "32m",
    meetingsScheduled: 18,
    emailsSent: 112,
    dealsAdvanced: 8,
    talkTime: "27.2 hrs",
    status: "on-target",
    trend: "up",
  },
  {
    rep: "Taylor Brooks",
    avatar: "TB",
    callsMade: 58,
    callsAnswered: 44,
    callsNotAnswered: 14,
    answerRate: 76,
    avgCallDuration: "35m",
    meetingsScheduled: 15,
    emailsSent: 94,
    dealsAdvanced: 7,
    talkTime: "25.5 hrs",
    status: "on-target",
    trend: "up",
  },
  {
    rep: "Alex Rivera",
    avatar: "AR",
    callsMade: 71,
    callsAnswered: 59,
    callsNotAnswered: 12,
    answerRate: 83,
    avgCallDuration: "30m",
    meetingsScheduled: 22,
    emailsSent: 127,
    dealsAdvanced: 10,
    talkTime: "29.5 hrs",
    status: "exceeding",
    trend: "up",
  },
  {
    rep: "Jordan Lee",
    avatar: "JL",
    callsMade: 52,
    callsAnswered: 38,
    callsNotAnswered: 14,
    answerRate: 73,
    avgCallDuration: "26m",
    meetingsScheduled: 14,
    emailsSent: 98,
    dealsAdvanced: 6,
    talkTime: "16.5 hrs",
    status: "on-target",
    trend: "stable",
  },
];

export function ManagerDashboard() {
  const todoCount = todaysTasks.filter((t) => t.status === "todo").length;
  const inProgressCount = todaysTasks.filter((t) => t.status === "in-progress").length;
  const completedCount = todaysTasks.filter((t) => t.status === "completed").length;

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Good morning, Sarah</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Friday, February 27, 2026 • {todaysAgenda.length} meetings • {todoCount + inProgressCount} urgent tasks
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/manager/forecast">
                <Button variant="outline" size="sm" className="h-8">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Update Forecast
                </Button>
              </Link>
              <Link to="/manager/coaching">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Coaching Center
                </Button>
              </Link>
            </div>
          </div>

          {/* Primary Metrics */}
          <div className="relative mb-6">
            <div className="mb-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Primary Metrics</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {/* Team Quota */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Team Quota</span>
                  <Target className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">84%</div>
                <p className="text-sm text-gray-600 mb-3">$5.9M / $7.0M</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '84%' }}></div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+6% vs last month</span>
                </div>
              </div>

              {/* Team Pipeline */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Team Pipeline</span>
                  <DollarSign className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">$4.2M</div>
                <p className="text-sm text-gray-600 mb-3">41 active deals</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-500">Early</div>
                    <div className="text-sm font-semibold text-gray-900">$1.8M</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-500">Late</div>
                    <div className="text-sm font-semibold text-gray-900">$2.4M</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18% growth</span>
                </div>
              </div>

              {/* Forecast Accuracy */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Forecast Accuracy</span>
                  <Activity className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">91%</div>
                <p className="text-sm text-gray-600 mb-3">Last 90 days</p>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">34</div>
                    <div className="text-xs text-gray-500">Accurate</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">3</div>
                    <div className="text-xs text-gray-500">Missed</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">37</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+4% improvement</span>
                </div>
              </div>

              {/* Team Win Rate */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Team Win Rate</span>
                  <Award className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">58%</div>
                <p className="text-sm text-gray-600 mb-3">This quarter</p>
                <div className="bg-gray-50 rounded p-2 mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Won / Total</span>
                    <span className="font-semibold text-gray-900">34 / 59</span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+14% vs last quarter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="relative mb-6">
            <div className="mb-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Secondary Metrics</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {/* Team Size */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Team Size</span>
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">14</div>
                <p className="text-xs text-gray-500 mb-2">Active reps</p>
                <div className="flex items-center gap-1 text-xs">
                  <Trophy className="w-3 h-3 text-yellow-600" />
                  <span className="text-gray-700 font-medium">3</span>
                  <span className="text-gray-500">top performers</span>
                </div>
              </div>

              {/* At Risk Deals */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">At Risk Deals</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-red-600 mb-1">7</div>
                <p className="text-xs text-gray-500 mb-2">Need attention</p>
                <div className="flex items-center gap-1 text-xs">
                  <AlertCircle className="w-3 h-3 text-red-600" />
                  <span className="text-gray-700 font-medium">$842K</span>
                  <span className="text-gray-500">at risk</span>
                </div>
              </div>

              {/* Coaching Sessions */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Coaching Sessions</span>
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">28</div>
                <p className="text-xs text-gray-500 mb-2">This week</p>
                <div className="flex items-center gap-1 text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    +42%
                  </span>
                  <span className="text-gray-500">impact</span>
                </div>
              </div>

              {/* Avg Sales Cycle */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Avg Sales Cycle</span>
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">32<span className="text-sm text-gray-500">d</span></div>
                <p className="text-xs text-gray-500 mb-2">Average duration</p>
                <div className="flex items-center gap-1 text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    -8d
                  </span>
                  <span className="text-gray-500">faster</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 -mb-px">
            <Link to="/manager/dashboard" className="pb-3 px-1 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              My Day
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6 max-w-[1400px]">

        {/* Team Intelligence Metrics */}
        <section className="bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Team Intelligence
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Key conversation metrics from the last 7 days
              </p>
            </div>
            <Link to="/manager/performance">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                Full Analytics
              </Button>
            </Link>
          </div>

          <div className="p-6">
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {/* Talk-Listen Ratio */}
                <div className="flex-shrink-0 w-72 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mic className="w-4 h-4 text-blue-600" />
                    </div>
                    <Badge className="text-xs px-2 py-0.5 h-5 bg-green-100 text-green-700 border-green-200 font-semibold">
                      Good
                    </Badge>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">42:58</div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Talk-Listen Ratio</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-blue-200">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Team talks 42% • Target: 40-45%</p>
                </div>

                {/* Questions Asked */}
                <div className="flex-shrink-0 w-72 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">16</div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Avg. Questions/Call</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Badge className="text-xs px-1.5 py-0.5 h-5 bg-green-100 text-green-700 border-green-200 font-semibold">
                      +28% vs last week
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">Target: 15-20 questions</p>
                </div>

                {/* Avg Monologue */}
                <div className="flex-shrink-0 w-72 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <Badge className="text-xs px-2 py-0.5 h-5 bg-orange-100 text-orange-700 border-orange-200 font-semibold">
                      Watch
                    </Badge>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">2:15</div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Avg Monologue</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                    <span className="text-xs text-orange-700 font-medium">Above recommended</span>
                  </div>
                  <p className="text-xs text-gray-600">Target: Under 1:30</p>
                </div>

                {/* Engagement Score */}
                <div className="flex-shrink-0 w-72 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-purple-600" />
                    </div>
                    <Badge className="text-xs px-2 py-0.5 h-5 bg-purple-100 text-purple-700 border-purple-200 font-semibold">
                      Excellent
                    </Badge>
                  </div>
                  <div className="text-2xl font-semibold text-purple-600 mb-1">87%</div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Engagement Score</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs text-purple-700 font-medium">Above average</span>
                  </div>
                  <p className="text-xs text-gray-600">Strong team interaction</p>
                </div>

                {/* Team Win Rate */}
                <div className="flex-shrink-0 w-72 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-teal-600" />
                    </div>
                    <Badge className="text-xs px-2 py-0.5 h-5 bg-teal-100 text-teal-700 border-teal-200 font-semibold">
                      Strong
                    </Badge>
                  </div>
                  <div className="text-2xl font-semibold text-teal-600 mb-1">58%</div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Team Win Rate</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-xs text-teal-700 font-medium">+14% vs last quarter</span>
                  </div>
                  <p className="text-xs text-gray-600">34 won / 59 total deals</p>
                </div>

                {/* Avg Sales Cycle */}
                <div className="flex-shrink-0 w-72 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-rose-600" />
                    </div>
                    <Badge className="text-xs px-2 py-0.5 h-5 bg-rose-100 text-rose-700 border-rose-200 font-semibold">
                      Good
                    </Badge>
                  </div>
                  <div className="text-2xl font-semibold text-rose-600 mb-1">32 days</div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Avg Sales Cycle</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingDown className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">-8 days faster</span>
                  </div>
                  <p className="text-xs text-gray-600">Industry avg: 45 days</p>
                </div>

                {/* Coaching Impact */}
                <div className="flex-shrink-0 w-72 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                    </div>
                    <Badge className="text-xs px-2 py-0.5 h-5 bg-amber-100 text-amber-700 border-amber-200 font-semibold">
                      High Impact
                    </Badge>
                  </div>
                  <div className="text-2xl font-semibold text-amber-600 mb-1">+42%</div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Coaching Impact Score</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs text-amber-700 font-medium">Performance lift</span>
                  </div>
                  <p className="text-xs text-gray-600">After coaching sessions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Risk Alert */}
        <section className="bg-gradient-to-br from-red-600 to-rose-700 border border-red-400 rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-white">Top Team Risk Factor</h3>
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  Urgent
                </Badge>
              </div>
              <p className="text-white text-sm mb-4">
                <span className="font-semibold">3 deals ($248K)</span> stalling after pricing discussions. Pattern detected: 
                reps not anchoring ROI before pricing. Average silence period: 4.2 days post-pricing call.
              </p>
              <div className="flex items-center gap-3">
                <Link to="/manager/coaching">
                  <Button className="bg-white hover:bg-gray-100 text-red-600 h-8 text-xs font-medium">
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    Schedule Team Coaching
                  </Button>
                </Link>
                <Link to="/manager/deals">
                  <Button variant="outline" className="border-white/30 bg-white/10 hover:bg-white/20 text-white h-8 text-xs">
                    <Target className="w-3.5 h-3.5 mr-1.5" />
                    View At-Risk Deals
                  </Button>
                </Link>
                <button className="text-white/80 hover:text-white text-xs ml-auto">
                  View all 7 risk factors →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TODAY'S SCHEDULE */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Today's Schedule
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Friday, February 27, 2026 • {todaysAgenda.length} meetings scheduled
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/manager/calendar">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  View Calendar
                </Button>
              </Link>
              <Link to="/manager/meetings">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  All Meetings
                </Button>
              </Link>
            </div>
          </div>

          {/* Horizontal Calendar Cards */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {todaysAgenda.map((meeting, index) => {
                const colors = [
                  { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-600", badge: "bg-blue-100" },
                  { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-600", badge: "bg-purple-100" },
                  { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-600", badge: "bg-orange-100" },
                  { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-600", badge: "bg-green-100" },
                ];
                const color = colors[index % colors.length];

                return (
                  <div
                    key={meeting.id}
                    className={`flex-shrink-0 w-80 ${color.bg} border ${color.border} rounded-lg overflow-hidden hover:shadow-lg transition-all`}
                  >
                    {/* Color indicator at top */}
                    <div className={`h-1 ${color.dot}`}></div>

                    {/* Time Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-gray-900">{meeting.time}</div>
                        <Badge className={`text-xs px-2 py-0.5 h-5 ${color.badge} ${color.text} border-0`}>
                          {meeting.duration}
                        </Badge>
                      </div>
                    </div>

                    {/* Meeting Content */}
                    <div className="px-4 py-4">
                      {/* Title */}
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        {meeting.title}
                      </h3>

                      {/* Type */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium mb-2">
                        <Users className="w-3.5 h-3.5" />
                        {meeting.type}
                      </div>

                      {/* Attendees */}
                      <div className="text-xs text-gray-600 mb-2">
                        {meeting.attendees.join(", ")}
                      </div>

                      {/* Deal Value */}
                      {meeting.dealValue && (
                        <div className="text-sm font-semibold text-blue-600 mb-4">
                          {meeting.dealValue}
                        </div>
                      )}

                      {/* Focus Areas */}
                      <div className="space-y-1.5 mb-4">
                        {meeting.focusAreas.map((area, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-gray-700 bg-white rounded px-2.5 py-1.5 border border-gray-200"
                          >
                            {area}
                          </div>
                        ))}
                      </div>

                      {/* Join Button */}
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs font-medium"
                      >
                        <Video className="w-3.5 h-3.5 mr-1.5" />
                        Join Meeting
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* KANBAN TASK BOARD */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Today's Tasks ({todaysTasks.length})
            </h2>
            <Link to="/manager/tasks">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                View All Tasks
              </Button>
            </Link>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-3 gap-4">
            {/* TO DO Column */}
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      To Do
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-white text-gray-600 border-gray-300">
                    {todoCount}
                  </Badge>
                </div>
              </div>
              <div className="p-3 space-y-2.5">
                {todaysTasks.filter(task => task.status === 'todo').map((task) => (
                  <div
                    key={task.id}
                    className={`bg-white border rounded-lg p-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
                      task.priority === "high"
                        ? "border-l-4 border-l-red-500 border-t border-r border-b border-gray-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <input
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                      />
                      <p className="text-sm text-gray-900 font-medium flex-1 leading-snug">{task.title}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      {task.rep && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-3 h-3" />
                          {task.rep}
                        </div>
                      )}
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        {task.dueTime}
                      </span>
                    </div>
                    {task.priority === "high" && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-red-50 text-red-700 border-red-200">
                          High Priority
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* IN PROGRESS Column */}
            <div className="bg-blue-50 rounded-lg border border-blue-200">
              <div className="px-4 py-3 border-b border-blue-200 bg-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                      In Progress
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-white text-blue-600 border-blue-300">
                    {inProgressCount}
                  </Badge>
                </div>
              </div>
              <div className="p-3 space-y-2.5">
                {todaysTasks.filter(task => task.status === 'in-progress').map((task) => (
                  <div
                    key={task.id}
                    className={`bg-white border rounded-lg p-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
                      task.priority === "high"
                        ? "border-l-4 border-l-red-500 border-t border-r border-b border-gray-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <input
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                      />
                      <p className="text-sm text-gray-900 font-medium flex-1 leading-snug">{task.title}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      {task.rep && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-3 h-3" />
                          {task.rep}
                        </div>
                      )}
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        {task.dueTime}
                      </span>
                    </div>
                    {task.priority === "high" && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-red-50 text-red-700 border-red-200">
                          High Priority
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* COMPLETED Column */}
            <div className="bg-green-50 rounded-lg border border-green-200">
              <div className="px-4 py-3 border-b border-green-200 bg-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                      Completed
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-white text-green-600 border-green-300">
                    {completedCount}
                  </Badge>
                </div>
              </div>
              <div className="p-3 space-y-2.5">
                {todaysTasks.filter(task => task.status === 'completed').map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 opacity-60 hover:opacity-80 transition-all"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle2 className="mt-0.5 w-4 h-4 text-green-600" />
                      <p className="text-sm text-gray-600 line-through flex-1 leading-snug">{task.title}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      {task.rep && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Users className="w-3 h-3" />
                          {task.rep}
                        </div>
                      )}
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        {task.dueTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Follow-ups Needed */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Follow-ups Needed</h2>
              <p className="text-xs text-gray-600 mt-0.5">Action items requiring your attention</p>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              View All Follow-ups
            </Button>
          </div>
          <div className="space-y-3">
            {followUps.map((followUp) => (
              <div key={followUp.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {followUp.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {followUp.priority === "urgent" && (
                        <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-0.5 h-5">
                          Urgent
                        </Badge>
                      )}
                      {followUp.priority === "high" && (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5 h-5">
                          High Priority
                        </Badge>
                      )}
                      {followUp.priority === "medium" && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5 h-5">
                          Medium Priority
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                        Due {followUp.dueDate}
                      </Badge>
                    </div>
                    <div className="font-medium text-gray-900 mb-1 text-sm">{followUp.rep}</div>
                    <div className="text-sm text-gray-700 mb-3">{followUp.task}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 font-medium">Deal value: {followUp.dealValue}</div>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        {followUp.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top 3 Team Learnings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Top 3 Team Learnings This Week</h2>
              <p className="text-xs text-gray-600 mt-0.5">Performance patterns identified by AI</p>
            </div>
            <Link to="/manager/coaching">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                View Coaching
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {topLearnings.map((learning) => (
              <div key={learning.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {learning.trend === "up" ? (
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <ThumbsUp className="w-6 h-6 text-green-600" />
                      </div>
                    ) : learning.trend === "down" ? (
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <ThumbsDown className="w-6 h-6 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Minus className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-gray-900 text-sm">{learning.title}</div>
                      <Badge
                        className={
                          learning.trend === "up"
                            ? "bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5"
                            : learning.trend === "down"
                            ? "bg-red-100 text-red-700 border-red-200 text-xs px-2 py-0.5 h-5"
                            : "bg-gray-100 text-gray-700 border-gray-200 text-xs px-2 py-0.5 h-5"
                        }
                      >
                        {learning.change}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-900 font-medium mb-1">{learning.insight}</div>
                    <div className="text-sm text-gray-600 mb-3">{learning.description}</div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium ${
                          learning.trend === "up" ? "text-green-700" : "text-orange-700"
                        }`}
                      >
                        {learning.trend === "up" ? "Keep it up!" : "Action Required"}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600">{learning.action}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Team Highlights */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Recent Team Highlights</h2>
              <p className="text-xs text-gray-600 mt-0.5">AI-powered insights from your team's latest activity</p>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {teamHighlights.map((highlight) => (
              <div key={highlight.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {highlight.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{highlight.rep}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{highlight.date}</div>
                      </div>
                      <Badge
                        className={
                          highlight.outcome === "Positive"
                            ? "bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5"
                            : highlight.outcome === "Mixed"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200 text-xs px-2 py-0.5 h-5"
                            : "bg-red-100 text-red-700 border-red-200 text-xs px-2 py-0.5 h-5"
                        }
                      >
                        {highlight.outcome}
                      </Badge>
                    </div>
                    <div className="font-semibold text-gray-900 mb-1 text-sm">{highlight.title}</div>
                    {highlight.dealValue && (
                      <div className="text-sm text-gray-600 mb-3">Deal Value: {highlight.dealValue}</div>
                    )}
                    <div className="space-y-1.5 mb-3">
                      <div className="text-xs font-medium text-gray-700">Key Takeaways</div>
                      {highlight.keyTakeaways.map((takeaway, idx) => (
                        <div key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <CircleDot className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-purple-900 mb-1">AI Insight</div>
                          <div className="text-xs text-purple-800">{highlight.aiInsight}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Productivity Tracking */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Team Productivity (Last 7 Days)</h2>
              <p className="text-xs text-gray-600 mt-0.5">Call activity, meetings, and deals across your team</p>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Export Report
            </Button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Rep</span>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Calls Made</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-semibold text-gray-700">Answered</span>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-semibold text-gray-700">Not Answered</span>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-semibold text-gray-700">Answer Rate</span>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Meetings</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Emails</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Deals Advanced</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Talk Time</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-semibold text-gray-700">Status</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teamProductivity.map((rep) => (
                    <tr key={rep.rep} className="hover:bg-gray-50 transition-colors">
                      {/* Rep Name */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                            {rep.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{rep.rep}</div>
                            <div className="text-xs text-gray-500">Avg call: {rep.avgCallDuration}</div>
                          </div>
                        </div>
                      </td>

                      {/* Calls Made */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-semibold text-gray-900">{rep.callsMade}</div>
                      </td>

                      {/* Answered */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-medium text-green-600">{rep.callsAnswered}</div>
                      </td>

                      {/* Not Answered */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-medium text-gray-500">{rep.callsNotAnswered}</div>
                      </td>

                      {/* Answer Rate */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-sm font-semibold ${
                            rep.answerRate >= 80 
                              ? "text-green-600" 
                              : rep.answerRate >= 70 
                              ? "text-yellow-600" 
                              : "text-red-600"
                          }`}>
                            {rep.answerRate}%
                          </span>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                rep.answerRate >= 80 
                                  ? "bg-green-500" 
                                  : rep.answerRate >= 70 
                                  ? "bg-yellow-500" 
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${rep.answerRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Meetings */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-medium text-gray-900">{rep.meetingsScheduled}</div>
                      </td>

                      {/* Emails */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-medium text-gray-900">{rep.emailsSent}</div>
                      </td>

                      {/* Deals Advanced */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-semibold text-blue-600">{rep.dealsAdvanced}</div>
                      </td>

                      {/* Talk Time */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-medium text-gray-900">{rep.talkTime}</div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {rep.status === "exceeding" && (
                            <>
                              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5 font-semibold">
                                Exceeding
                              </Badge>
                              {rep.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                            </>
                          )}
                          {rep.status === "on-target" && (
                            <>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5 h-5 font-semibold">
                                On Target
                              </Badge>
                              {rep.trend === "up" && <TrendingUp className="w-4 h-4 text-blue-600" />}
                              {rep.trend === "stable" && <Minus className="w-4 h-4 text-gray-600" />}
                            </>
                          )}
                          {rep.status === "below-target" && (
                            <>
                              <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-0.5 h-5 font-semibold">
                                Below Target
                              </Badge>
                              {rep.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Team Totals Footer */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 px-6 py-4">
              <div className="grid grid-cols-7 gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-2 h-8 flex items-center">Total Calls</div>
                  <div className="text-lg font-bold text-gray-900 h-7 flex items-center">
                    {teamProductivity.reduce((sum, rep) => sum + rep.callsMade, 0)}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-2 h-8 flex items-center">Answered</div>
                  <div className="text-lg font-bold text-green-600 h-7 flex items-center">
                    {teamProductivity.reduce((sum, rep) => sum + rep.callsAnswered, 0)}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-2 h-8 flex items-center">Avg Answer Rate</div>
                  <div className="text-lg font-bold text-gray-900 h-7 flex items-center">
                    {Math.round(
                      teamProductivity.reduce((sum, rep) => sum + rep.answerRate, 0) / teamProductivity.length
                    )}%
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-2 h-8 flex items-center">Total Meetings</div>
                  <div className="text-lg font-bold text-gray-900 h-7 flex items-center">
                    {teamProductivity.reduce((sum, rep) => sum + rep.meetingsScheduled, 0)}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-2 h-8 flex items-center">Total Emails</div>
                  <div className="text-lg font-bold text-gray-900 h-7 flex items-center">
                    {teamProductivity.reduce((sum, rep) => sum + rep.emailsSent, 0)}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-2 h-8 flex items-center">Deals Advanced</div>
                  <div className="text-lg font-bold text-blue-600 h-7 flex items-center">
                    {teamProductivity.reduce((sum, rep) => sum + rep.dealsAdvanced, 0)}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-2 h-8 flex items-center text-center">Team Performance</div>
                  <div className="flex items-center justify-center gap-1 h-7">
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5 font-semibold">
                      Strong
                    </Badge>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
