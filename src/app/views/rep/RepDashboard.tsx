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
  Mic,
  Volume2,
  Timer,
  Sparkles,
  CircleDot,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  FileText,
  Quote,
  Trophy,
  DollarSign,
  Mail,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useState } from "react";
import { useEvents } from "../../contexts/EventsContext";

// Simplified today's meetings data
const todaysAgenda = [
  {
    id: "1",
    time: "10:00 AM",
    duration: "45m",
    title: "Discovery Call",
    company: "Acme Corp",
    companyId: "acme-corp",
    contact: "Sarah Johnson, CFO",
    dealValue: "$85K",
    sentiment: "Positive",
    focusAreas: ["Budget confirmation", "Timeline discussion"],
  },
  {
    id: "2",
    time: "11:30 AM",
    duration: "60m",
    title: "Product Demo",
    company: "TechStart",
    companyId: "techstart",
    contact: "Michael Chen, VP Engineering",
    dealValue: "$125K",
    sentiment: "Very Positive",
    focusAreas: ["Technical architecture", "API capabilities"],
  },
  {
    id: "3",
    time: "2:00 PM",
    duration: "30m",
    title: "Follow-up Sync",
    company: "GlobalTech",
    companyId: "globaltech",
    contact: "Emma Davis, Director of Sales",
    dealValue: "$45K",
    sentiment: "Neutral",
    focusAreas: ["Address pricing concerns", "Competitor comparison"],
  },
  {
    id: "4",
    time: "3:30 PM",
    duration: "45m",
    title: "Negotiation Call",
    company: "DataFlow",
    companyId: "dataflow",
    contact: "James Wilson, CTO",
    dealValue: "$210K",
    sentiment: "Positive",
    focusAreas: ["Contract terms", "Implementation timeline"],
  },
];

const todaysTasks = [
  {
    id: "1",
    title: "Send security documentation to CloudVista",
    company: "CloudVista",
    companyId: "cloudvista",
    dueTime: "5:00 PM",
    priority: "high",
    status: "todo",
  },
  {
    id: "2",
    title: "Prepare demo environment for TechStart",
    company: "TechStart",
    companyId: "techstart",
    dueTime: "11:00 AM",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Review pricing objections from GlobalTech",
    company: "GlobalTech",
    companyId: "globaltech",
    dueTime: "1:30 PM",
    priority: "high",
    status: "todo",
  },
  {
    id: "4",
    title: "Update CRM notes for Acme Corp discovery",
    company: "Acme Corp",
    companyId: "acme-corp",
    dueTime: "EOD",
    priority: "medium",
    status: "completed",
  },
  {
    id: "5",
    title: "Schedule executive briefing with Innovate Labs CEO",
    company: "Innovate Labs",
    companyId: "innovate-labs",
    dueTime: "EOD",
    priority: "medium",
    status: "in-progress",
  },
];

const pastHighlights = [
  {
    id: "1",
    company: "CloudVista",
    companyId: "cloudvista",
    contact: "David Brown",
    date: "Yesterday, 1:00 PM",
    type: "Discovery",
    outcome: "Positive",
    keyTakeaways: [
      "Budget approved for Q2 ($145K)",
      "Security compliance is top priority",
      "Decision timeline: 3-4 weeks",
    ],
  },
  {
    id: "2",
    company: "Innovate Labs",
    companyId: "innovate-labs",
    contact: "Lisa Martinez",
    date: "Feb 25, 3:00 PM",
    type: "Demo",
    outcome: "Mixed",
    keyTakeaways: [
      "Impressed with AI capabilities",
      "Concerned about implementation time",
      "Need CEO approval before decision",
    ],
  },
];

// Upcoming meetings data (next 7 days)
const upcomingMeetings = [
  {
    id: "5",
    date: "Tomorrow",
    time: "9:00 AM",
    duration: "30m",
    title: "Intro Call",
    company: "Zenith Solutions",
    companyId: "zenith-solutions",
    contact: "Robert Kim, Head of Sales",
    dealValue: "$95K",
    type: "Discovery",
    focusAreas: ["Pain points discovery", "Current solution analysis"],
  },
  {
    id: "6",
    date: "Tomorrow",
    time: "2:30 PM",
    duration: "45m",
    title: "Technical Deep Dive",
    company: "Acme Corp",
    companyId: "acme-corp",
    contact: "Sarah Johnson, CFO & IT Team",
    dealValue: "$85K",
    type: "Demo",
    focusAreas: ["Security features", "Integration capabilities"],
  },
  {
    id: "7",
    date: "Monday, Mar 2",
    time: "10:00 AM",
    duration: "60m",
    title: "Executive Briefing",
    company: "TechStart",
    companyId: "techstart",
    contact: "Michael Chen + CEO",
    dealValue: "$125K",
    type: "Business Review",
    focusAreas: ["ROI presentation", "Implementation timeline"],
  },
  {
    id: "8",
    date: "Monday, Mar 2",
    time: "3:00 PM",
    duration: "30m",
    title: "Contract Review",
    company: "DataFlow",
    companyId: "dataflow",
    contact: "James Wilson, CTO",
    dealValue: "$210K",
    type: "Negotiation",
    focusAreas: ["Legal terms", "MSA review"],
  },
  {
    id: "9",
    date: "Tuesday, Mar 3",
    time: "11:00 AM",
    duration: "45m",
    title: "Final Demo",
    company: "Innovate Labs",
    companyId: "innovate-labs",
    contact: "Lisa Martinez + Team",
    dealValue: "$180K",
    type: "Demo",
    focusAreas: ["Custom workflows", "Q&A session"],
  },
  {
    id: "10",
    date: "Wednesday, Mar 4",
    time: "1:00 PM",
    duration: "30m",
    title: "Check-in Call",
    company: "CloudVista",
    companyId: "cloudvista",
    contact: "David Brown",
    dealValue: "$145K",
    type: "Follow-up",
    focusAreas: ["Security docs review", "Next steps"],
  },
];

// Past meetings data (last 30 days)
const pastMeetings = [
  {
    id: "p1",
    date: "Yesterday, Feb 26",
    time: "1:00 PM",
    duration: "45m",
    title: "Discovery Call",
    company: "CloudVista",
    companyId: "cloudvista",
    contact: "David Brown, VP Operations",
    dealValue: "$145K",
    type: "Discovery",
    outcome: "Positive",
    score: 92,
    keyPoints: ["Budget approved for Q2", "Security compliance is top priority", "Decision timeline: 3-4 weeks"],
  },
  {
    id: "p2",
    date: "Feb 25",
    time: "3:00 PM",
    duration: "60m",
    title: "Product Demo",
    company: "Innovate Labs",
    companyId: "innovate-labs",
    contact: "Lisa Martinez, Director",
    dealValue: "$180K",
    type: "Demo",
    outcome: "Mixed",
    score: 78,
    keyPoints: ["Impressed with AI capabilities", "Concerned about implementation time", "Need CEO approval"],
  },
  {
    id: "p3",
    date: "Feb 24",
    time: "10:30 AM",
    duration: "30m",
    title: "Follow-up Sync",
    company: "Vertex Inc",
    companyId: "vertex-inc",
    contact: "Amanda Walsh, CTO",
    dealValue: "$65K",
    type: "Follow-up",
    outcome: "Positive",
    score: 88,
    keyPoints: ["Technical requirements clarified", "Ready to move to contract", "Targeting April 1 start date"],
  },
  {
    id: "p4",
    date: "Feb 23",
    time: "2:00 PM",
    duration: "45m",
    title: "Qualification Call",
    company: "Nexus Corp",
    companyId: "nexus-corp",
    contact: "Tom Anderson, Sales Lead",
    dealValue: "$110K",
    type: "Discovery",
    outcome: "Negative",
    score: 45,
    keyPoints: ["Budget not available until Q3", "Evaluating 3 other solutions", "Low urgency signal"],
  },
  {
    id: "p5",
    date: "Feb 22",
    time: "11:00 AM",
    duration: "60m",
    title: "Executive Demo",
    company: "Summit Group",
    companyId: "summit-group",
    contact: "Patricia Lee, CEO",
    dealValue: "$250K",
    type: "Demo",
    outcome: "Very Positive",
    score: 96,
    keyPoints: ["CEO highly engaged", "Wants to move fast", "Budget pre-approved", "Decision expected by March 5"],
  },
  {
    id: "p6",
    date: "Feb 21",
    time: "4:00 PM",
    duration: "30m",
    title: "Pricing Discussion",
    company: "DataFlow",
    companyId: "dataflow",
    contact: "James Wilson, CTO",
    dealValue: "$210K",
    type: "Negotiation",
    outcome: "Positive",
    score: 85,
    keyPoints: ["Negotiated 15% discount for annual contract", "Security review in progress", "Legal review next week"],
  },
];

const topLearnings = [
  {
    id: "1",
    category: "Discovery Technique",
    title: "Your discovery questions increased by 35%",
    description:
      "You're asking more open-ended questions early in calls, leading to 22% longer prospect talk time.",
    metric: "+35%",
    trend: "up",
  },
  {
    id: "2",
    category: "Objection Handling",
    title: "Improved response to pricing objections",
    description:
      "You're now anchoring with ROI data before discussing price, reducing pushback by 28%.",
    metric: "-28%",
    trend: "up",
  },
  {
    id: "3",
    category: "Active Listening",
    title: "Talk-time ratio needs adjustment",
    description:
      "Your average talk time is 58%, above the recommended 42% for discovery calls.",
    metric: "58%",
    trend: "down",
  },
];

// SPICED Framework Data for Rep
const mySpicedDeals = [
  {
    id: "1",
    company: "Acme Corp",
    dealValue: "$85K",
    stage: "Discovery",
    spiced: {
      S: true,  // Situation
      P: true,  // Pain
      I: false, // Impact
      C: true,  // Critical Event
      E: false, // Decision Process
      D: false, // Decision Criteria
    },
    qualificationScore: 50,
    riskLevel: "medium",
    nextStep: "Quantify business impact",
  },
  {
    id: "2",
    company: "TechStart",
    dealValue: "$125K",
    stage: "Demo",
    spiced: {
      S: true,
      P: true,
      I: true,
      C: true,
      E: true,
      D: false,
    },
    qualificationScore: 83,
    riskLevel: "low",
    nextStep: "Identify decision criteria",
  },
  {
    id: "3",
    company: "GlobalTech",
    dealValue: "$45K",
    stage: "Negotiation",
    spiced: {
      S: true,
      P: false,
      I: false,
      C: true,
      E: true,
      D: true,
    },
    qualificationScore: 67,
    riskLevel: "high",
    nextStep: "Clarify pain points",
  },
  {
    id: "4",
    company: "DataFlow",
    dealValue: "$210K",
    stage: "Proposal",
    spiced: {
      S: true,
      P: true,
      I: true,
      C: true,
      E: true,
      D: true,
    },
    qualificationScore: 100,
    riskLevel: "low",
    nextStep: "None - well qualified",
  },
];

const mySpicedScore = {
  S: 100, // All deals have Situation
  P: 75,  // 3 of 4 have Pain
  I: 50,  // 2 of 4 have Impact
  C: 100, // All have Critical Event
  E: 75,  // 3 of 4 have Decision Process
  D: 50,  // 2 of 4 have Decision Criteria
};

// AI Recommendations Data
const aiRecommendations = [
  {
    id: "1",
    priority: "high",
    title: "Follow up with Acme Corp",
    company: "Acme Corp",
    dealValue: "$85K",
    timeframe: "Within 2 hours",
    insight: "AI detected buying signals in yesterday's call: mentioned budget approval (3x) and asked about implementation timeline (2x).",
    actions: [
      { type: "call", label: "Call Now", link: "/rep/deals" },
      { type: "email", label: "Send Email", link: "/rep/compose-email" },
    ],
    reasoning: "High engagement + Budget discussion + Timeline questions = High intent",
    confidence: 94,
  },
  {
    id: "2",
    priority: "high",
    title: "Send proposal to TechStart",
    company: "TechStart",
    dealValue: "$120K",
    timeframe: "By EOD",
    insight: "Decision maker requested pricing 48hrs ago. Competitor evaluation in progress. Speed critical to stay top-of-mind.",
    actions: [
      { type: "document", label: "Send Proposal", link: "/rep/proposals" },
      { type: "calendar", label: "Schedule Follow-up", link: "/rep/calendar" },
    ],
    reasoning: "Pricing request + Active evaluation + Time sensitivity = Action needed",
    confidence: 89,
  },
  {
    id: "3",
    priority: "medium",
    title: "Multi-thread with GlobalTech stakeholders",
    company: "GlobalTech",
    dealValue: "$215K",
    timeframe: "This week",
    insight: "Currently single-threaded with IT Director. AI identified 3 additional stakeholders mentioned in call: VP Ops, CFO, Head of Sales. Risk of deal stalling without wider buy-in.",
    actions: [
      { type: "email", label: "Request Intro", link: "/rep/compose-email" },
      { type: "research", label: "View Org Chart", link: "/rep/deals" },
    ],
    reasoning: "Single-threaded + Large deal size + Missing economic buyer = Expansion needed",
    confidence: 87,
  },
  {
    id: "4",
    priority: "medium",
    title: "Address pricing objection with DataCorp",
    company: "DataCorp",
    dealValue: "$95K",
    timeframe: "Next 3 days",
    insight: "Prospect mentioned \"price seems high\" twice. AI suggests sharing ROI calculator and case study from similar company (FinanceFlow - 340% ROI in 6 months).",
    actions: [
      { type: "document", label: "Send ROI Doc", link: "/rep/resources" },
      { type: "call", label: "Schedule Value Call", link: "/rep/calendar" },
    ],
    reasoning: "Price objection + No ROI discussion + Available proof points = Value gap",
    confidence: 82,
  },
];

export function RepDashboard() {
  const { events } = useEvents();
  const [showDialer, setShowDialer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedView, setSelectedView] = useState<"today" | "spiced">("today");
  const [showSetupProgress, setShowSetupProgress] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Filter today's events (March 9, 2026)
  const todaysEvents = events.filter(event => event.date === "2026-03-09");
  
  // Convert events to agenda format with mock data for missing fields
  const todaysAgendaFromContext = todaysEvents.map((event, idx) => ({
    id: event.id,
    time: event.time.toUpperCase(),
    duration: event.duration || "30m",
    title: event.title,
    company: event.company || `Company ${idx + 1}`,
    companyId: event.companyId || `company-${idx + 1}`,
    contact: event.contact || "Contact Person",
    dealValue: event.dealValue || "$50K",
    sentiment: event.sentiment || "Neutral",
    focusAreas: event.focusAreas || ["Discussion points"],
  }));

  const setupSteps = [
    { id: 1, title: "Connect Calendar", description: "Sync your meetings", completed: true },
    { id: 2, title: "Install Browser Extension", description: "Auto-capture calls", completed: false },
    { id: 3, title: "Customize Call Template", description: "Define your note format", completed: false },
    { id: 4, title: "Set Personal Goals", description: "Define your targets", completed: false },
    { id: 5, title: "Review AI Scorecard", description: "Understand call metrics", completed: false },
    { id: 6, title: "Schedule First Call", description: "Book your first meeting", completed: false },
    { id: 7, title: "Complete Training", description: "Watch getting started guide", completed: false },
  ];

  const completedSteps = setupSteps.filter((step) => step.completed).length;
  const progressPercent = Math.round((completedSteps / setupSteps.length) * 100);

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Good morning, Alex</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Friday, February 27, 2026 • {todaysAgenda.length} meetings • {todaysTasks.filter(t => t.priority === 'high').length} urgent tasks
              </p>
            </div>
          </div>

          {/* Primary Metrics */}
          <div className="relative mb-6">
            <div className="mb-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Primary Metrics</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {/* Quota Attainment */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quota Attainment</span>
                  <Target className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">92%</div>
                <p className="text-sm text-gray-600 mb-3">$460K / $500K</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8% vs last month</span>
                </div>
              </div>

              {/* Pipeline Value */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pipeline Value</span>
                  <DollarSign className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">$1.2M</div>
                <p className="text-sm text-gray-600 mb-3">8 active deals</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-500">Early</div>
                    <div className="text-sm font-semibold text-gray-900">$485K</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-500">Late</div>
                    <div className="text-sm font-semibold text-gray-900">$715K</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+15% growth</span>
                </div>
              </div>

              {/* Win Rate */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Win Rate</span>
                  <Award className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">68%</div>
                <p className="text-sm text-gray-600 mb-3">This quarter</p>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">17</div>
                    <div className="text-xs text-gray-500">Won</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">8</div>
                    <div className="text-xs text-gray-500">Lost</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">25</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% vs last quarter</span>
                </div>
              </div>

              {/* Average Deal Size */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg Deal Size</span>
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">$48K</div>
                <p className="text-sm text-gray-600 mb-3">Per closed deal</p>
                <div className="bg-gray-50 rounded p-2 mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Target</span>
                    <span className="font-semibold text-gray-900">$45K</span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '107%' }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+7% above target</span>
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
              {/* Meetings Booked */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Meetings Booked</span>
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">12</div>
                <p className="text-xs text-gray-500 mb-2">of 15 weekly target</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">80%</span>
                </div>
              </div>

              {/* AI Performance Score */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">AI Performance</span>
                  <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">8.4<span className="text-sm text-gray-500">/10</span></div>
                <p className="text-xs text-gray-500 mb-2">Call quality score</p>
                <div className="flex gap-0.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 bg-blue-500 rounded-sm"></div>
                  ))}
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-sm"></div>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-sm"></div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Response Time</span>
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">2.4h</div>
                <p className="text-xs text-gray-500 mb-2">Avg first response</p>
                <div className="flex items-center gap-1 text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    -18%
                  </span>
                  <span className="text-gray-500">vs last week</span>
                </div>
              </div>

              {/* Active Conversations */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Active Conversations</span>
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">23</div>
                <p className="text-xs text-gray-500 mb-2">In progress</p>
                <div className="flex gap-2">
                  <span className="inline-flex items-center text-xs">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                    <span className="text-gray-700 font-medium">5</span>
                    <span className="text-gray-500 ml-0.5">urgent</span>
                  </span>
                  <span className="inline-flex items-center text-xs">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                    <span className="text-gray-700 font-medium">8</span>
                    <span className="text-gray-500 ml-0.5">follow-up</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 -mb-px">
            <Link to="/rep/dashboard" className="pb-3 px-1 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              My Day
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6 max-w-[1400px]">
        {/* Account Setup Progress */}
        {showSetupProgress && (
          <section>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">Account Setup Progress</h2>
                  <p className="text-xs text-gray-600">Complete these steps to get started</p>
                </div>
                <button
                  onClick={() => setShowSetupProgress(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {completedSteps} of {setupSteps.length} completed
                  </span>
                  <span className="text-sm font-semibold text-blue-600">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Setup Steps Horizontal Scroll */}
              <div className="relative mb-4">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {setupSteps.map((step, idx) => (
                    <button
                      key={step.id}
                      className={`flex-shrink-0 w-72 text-left p-4 rounded-lg border transition-all ${
                        step.completed
                          ? "bg-green-50 border-green-200 opacity-75"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {step.completed ? (
                          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">{idx + 1}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-sm font-semibold mb-0.5 ${
                              step.completed ? "text-gray-600 line-through" : "text-gray-900"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p className="text-xs text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Need help getting started?</h4>
                      <p className="text-xs text-gray-600 mt-0.5">Watch our 5-minute setup guide</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                    <Video className="w-4 h-4 mr-2" />
                    Watch Setup Video
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI Next Best Action */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 border border-indigo-400 rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-white">AI Next Best Action</h3>
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  High Priority
                </Badge>
              </div>
              <p className="text-white text-sm mb-4">
                Follow up with <span className="font-semibold">Acme Corp</span> within 2 hours. AI detected buying signals in yesterday's call: 
                mentioned budget approval (3x) and asked about implementation timeline (2x).
              </p>
              <div className="flex items-center gap-3">
                <Link to="/rep/deals">
                  <Button className="bg-white hover:bg-gray-100 text-indigo-600 h-8 text-xs font-medium">
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    Call Now
                  </Button>
                </Link>
                <Link to="/rep/compose-email">
                  <Button variant="outline" className="border-white/30 bg-white/10 hover:bg-white/20 text-white h-8 text-xs">
                    <Mail className="w-3.5 h-3.5 mr-1.5" />
                    Send Email
                  </Button>
                </Link>
                <button 
                  onClick={() => setShowRecommendations(true)}
                  className="text-white/80 hover:text-white text-xs ml-auto transition-colors"
                >
                  View all 4 recommendations →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Conversation Intelligence Metrics */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Conversation Intelligence
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Your performance metrics from the last 7 days
              </p>
            </div>
            <Link to="/rep/insights">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                Full Analytics
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {/* Talk-Listen Ratio */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <Mic className="w-4 h-4 text-blue-600" />
                <Badge className="text-xs px-2 py-0.5 h-5 bg-blue-50 text-blue-700 border-blue-200">
                  Good
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">42:58</div>
              <p className="text-xs text-gray-600 mb-2">Talk-Listen Ratio</p>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">You talk 42% of the time</p>
            </div>

            {/* Questions Asked */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">18</div>
              <p className="text-xs text-gray-600 mb-2">Avg. Questions/Call</p>
              <div className="flex items-center gap-1 mt-2">
                <Badge className="text-xs px-1.5 py-0 h-4 bg-green-50 text-green-700 border-green-200">
                  +35% vs last week
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">Target: 15-20 questions</p>
            </div>

            {/* Longest Monologue */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <Timer className="w-4 h-4 text-orange-600" />
                <Badge className="text-xs px-2 py-0.5 h-5 bg-orange-50 text-orange-700 border-orange-200">
                  Watch
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2:15</div>
              <p className="text-xs text-gray-600 mb-2">Longest Monologue</p>
              <div className="flex items-center gap-1 mt-2">
                <AlertTriangle className="w-3 h-3 text-orange-600" />
                <span className="text-xs text-orange-700">Above recommended</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Target: Under 1:30</p>
            </div>

            {/* Engagement Score */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-4 h-4 text-green-600" />
                <Badge className="text-xs px-2 py-0.5 h-5 bg-green-50 text-green-700 border-green-200">
                  Excellent
                </Badge>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">92%</div>
              <p className="text-xs text-gray-600 mb-2">Engagement Score</p>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700">Above average</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Prospect interaction high</p>
            </div>

            {/* Action Items Completion */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">85%</div>
              <p className="text-xs text-gray-600 mb-2">Action Item Follow-through</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">17 of 20 completed</p>
            </div>
          </div>
        </section>

        {/* TODAY'S CALENDAR VIEW */}
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
              <Link to="/rep/calendar">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  View Calendar
                </Button>
              </Link>
              <Link to="/rep/meetings">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  All Meetings
                </Button>
              </Link>
            </div>
          </div>

          {/* Horizontal Calendar Cards */}
          <div className="grid grid-cols-4 gap-4">
            {todaysAgendaFromContext.map((meeting, index) => {
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
                  className={`${color.bg} border ${color.border} rounded-lg overflow-hidden hover:shadow-lg transition-all`}
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

                    {/* Company */}
                    <Link
                      to={`/rep/customers/${meeting.companyId}`}
                      className="flex items-center gap-1.5 text-xs text-gray-900 hover:text-blue-600 font-medium mb-2"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      {meeting.company}
                    </Link>

                    {/* Contact */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                      <Users className="w-3.5 h-3.5" />
                      {meeting.contact}
                    </div>

                    {/* Deal Value */}
                    <div className="text-sm font-semibold text-blue-600 mb-4">
                      {meeting.dealValue}
                    </div>

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
                    <Link to={`/rep/call/${meeting.id}`} className="block">
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs font-medium"
                      >
                        <Video className="w-3.5 h-3.5 mr-1.5" />
                        Join Meeting
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* KANBAN TASK BOARD */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Today's Tasks ({todaysTasks.length})
            </h2>
            <Link to="/rep/tasks">
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
                    {todaysTasks.filter(t => t.status === 'todo').length}
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
                      <Link
                        to={`/rep/customers/${task.companyId}`}
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                      >
                        <Building2 className="w-3 h-3" />
                        {task.company}
                      </Link>
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
                    {todaysTasks.filter(t => t.status === 'in-progress').length}
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
                      <Link
                        to={`/rep/customers/${task.companyId}`}
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                      >
                        <Building2 className="w-3 h-3" />
                        {task.company}
                      </Link>
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
                    {todaysTasks.filter(t => t.status === 'completed').length}
                  </Badge>
                </div>
              </div>
              <div className="p-3 space-y-2.5">
                {todaysTasks.filter(task => task.status === 'completed').map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing opacity-75"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="mt-0.5 w-4 h-4 text-green-600 rounded border-gray-300 cursor-pointer"
                      />
                      <p className="text-sm text-gray-700 flex-1 leading-snug line-through">{task.title}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <Link
                        to={`/rep/customers/${task.companyId}`}
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                      >
                        <Building2 className="w-3 h-3" />
                        {task.company}
                      </Link>
                      <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3" />
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOLLOW-UP SECTION */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Follow-ups Needed
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Action items from recent meetings requiring your attention
              </p>
            </div>
            <Link to="/rep/tasks">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                View All Follow-ups
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Follow-up Card 1 */}
            <div className="bg-white border border-orange-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <Badge className="text-xs px-2 py-0.5 h-5 bg-orange-50 text-orange-700 border-orange-200">
                  Urgent
                </Badge>
                <span className="text-xs text-gray-500">Due Today</span>
              </div>
              <Link
                to="/rep/customers/cloudvista"
                className="text-sm font-semibold text-gray-900 hover:text-blue-600 flex items-center gap-1 mb-2"
              >
                <Building2 className="w-4 h-4" />
                CloudVista
              </Link>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                Send security compliance documentation to David Brown before EOD. Deal value: <span className="font-semibold text-blue-600">$145K</span>
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 flex-1">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Follow-up Card 2 */}
            <div className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <Badge className="text-xs px-2 py-0.5 h-5 bg-blue-50 text-blue-700 border-blue-200">
                  High Priority
                </Badge>
                <span className="text-xs text-gray-500">Due Tomorrow</span>
              </div>
              <Link
                to="/rep/customers/innovate-labs"
                className="text-sm font-semibold text-gray-900 hover:text-blue-600 flex items-center gap-1 mb-2"
              >
                <Building2 className="w-4 h-4" />
                Innovate Labs
              </Link>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                Schedule executive briefing with CEO to address implementation timeline concerns. Deal value: <span className="font-semibold text-blue-600">$180K</span>
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 flex-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  Schedule Call
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Follow-up Card 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <Badge className="text-xs px-2 py-0.5 h-5 bg-gray-50 text-gray-700 border-gray-200">
                  Medium Priority
                </Badge>
                <span className="text-xs text-gray-500">Due Mon, Mar 2</span>
              </div>
              <Link
                to="/rep/customers/acme-corp"
                className="text-sm font-semibold text-gray-900 hover:text-blue-600 flex items-center gap-1 mb-2"
              >
                <Building2 className="w-4 h-4" />
                Acme Corp
              </Link>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                Update CRM with discovery call notes and prepare technical deep dive materials. Deal value: <span className="font-semibold text-blue-600">$85K</span>
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 flex-1">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Update CRM
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Two Column Layout for Past Highlights and Learnings */}
        <div className="grid grid-cols-2 gap-6">
          {/* PAST MEETING HIGHLIGHTS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Recent Highlights
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  AI-powered insights from your latest meetings
                </p>
              </div>
              <Link to="/rep/meetings">
                <button className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  View all
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {pastHighlights.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition-all"
                >
                  {/* Header */}
                  <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Link
                          to={`/rep/customers/${meeting.companyId}`}
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600 flex items-center gap-1.5"
                        >
                          <Building2 className="w-4 h-4" />
                          {meeting.company}
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <p className="text-xs text-gray-600 mt-1">
                          {meeting.contact} • {meeting.date}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs px-2 py-0.5 h-5 ${
                          meeting.outcome === "Positive"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {meeting.outcome}
                      </Badge>
                    </div>
                  </div>

                  {/* Key Takeaways */}
                  <div className="px-4 py-3 bg-gray-50">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Key Takeaways
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {meeting.keyTakeaways.map((takeaway, index) => (
                        <div
                          key={index}
                          className="text-xs text-gray-700 flex items-start gap-2 pl-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Molecular Insights */}
                  <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
                    <div className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-blue-900 block mb-1">
                          AI Insight
                        </span>
                        <p className="text-xs text-blue-800 leading-relaxed">
                          {meeting.outcome === "Positive"
                            ? "High buying intent detected. Security compliance mentioned 3x. Recommend sending case study + ROI calculator within 24h to maintain momentum."
                            : "Mixed signals: Strong product interest but timeline concerns. CEO buy-in required. Suggest scheduling 15-min executive brief highlighting fast implementation success stories."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TOP 3 LEARNINGS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Top 3 Learnings This Week
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Performance patterns identified by AI
                </p>
              </div>
              <Link to="/rep/coaching">
                <button className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  View coaching
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {topLearnings.map((learning) => (
                <div
                  key={learning.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition-all"
                >
                  {/* Header */}
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="text-xs px-2 py-0.5 h-5 bg-purple-50 text-purple-700 border-purple-200">
                        {learning.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {learning.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-orange-600" />
                        )}
                        <div
                          className={`text-xl font-bold ${
                            learning.trend === "up" ? "text-green-600" : "text-orange-600"
                          }`}
                        >
                          {learning.metric}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {learning.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {learning.description}
                    </p>
                  </div>

                  {/* Molecular Insights */}
                  <div
                    className={`px-4 py-3 border-t ${
                      learning.trend === "up"
                        ? "bg-green-50 border-green-100"
                        : "bg-orange-50 border-orange-100"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb
                        className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                          learning.trend === "up" ? "text-green-600" : "text-orange-600"
                        }`}
                      />
                      <div>
                        <span
                          className={`text-xs font-semibold block mb-1 ${
                            learning.trend === "up" ? "text-green-900" : "text-orange-900"
                          }`}
                        >
                          {learning.trend === "up" ? "Keep it up!" : "Action Required"}
                        </span>
                        <p
                          className={`text-xs leading-relaxed ${
                            learning.trend === "up" ? "text-green-800" : "text-orange-800"
                          }`}
                        >
                          {learning.id === "1" &&
                            "Your question-to-statement ratio improved from 1:3 to 1:1.5. This pattern correlates with 40% higher close rates in your pipeline."}
                          {learning.id === "2" &&
                            "Deals where you use ROI anchoring move 2.3x faster through the pipeline. Consider applying this to GlobalTech and TechStart deals."}
                          {learning.id === "3" &&
                            "Try the 60/40 rule: Prospect talks 60%, you talk 40%. Use strategic silence after questions—wait 3 seconds before responding."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* AI Recommendations Modal */}
      {showRecommendations && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI-Powered Recommendations</h2>
                  <p className="text-xs text-white/80 mt-0.5">Prioritized actions to accelerate your deals</p>
                </div>
              </div>
              <button
                onClick={() => setShowRecommendations(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <div
                    key={rec.id}
                    className={`border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg ${
                      rec.priority === "high"
                        ? "border-red-200 bg-gradient-to-br from-red-50 to-orange-50"
                        : "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50"
                    }`}
                  >
                    {/* Recommendation Header */}
                    <div className="px-5 py-4 border-b border-gray-200 bg-white/50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs font-semibold ${
                              rec.priority === "high"
                                ? "bg-red-100 text-red-700 border-red-300"
                                : "bg-amber-100 text-amber-700 border-amber-300"
                            }`}
                          >
                            {rec.priority === "high" ? "High Priority" : "Medium Priority"}
                          </Badge>
                          <span className="text-xs text-gray-500">#{index + 1}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">{rec.dealValue}</div>
                          <div className="text-xs text-gray-600">{rec.company}</div>
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{rec.title}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-gray-600 font-medium">{rec.timeframe}</span>
                      </div>
                    </div>

                    {/* AI Insight */}
                    <div className="px-5 py-4 bg-white/70">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-700 mb-1">AI Insight</div>
                          <p className="text-sm text-gray-700 leading-relaxed">{rec.insight}</p>
                        </div>
                      </div>

                      {/* Reasoning */}
                      <div className="flex items-start gap-3 mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <Lightbulb className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-indigo-900 mb-1">Why this matters</div>
                          <p className="text-xs text-indigo-700">{rec.reasoning}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-indigo-600">{rec.confidence}%</div>
                          <div className="text-xs text-indigo-600">confidence</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {rec.actions.map((action, actionIndex) => (
                          <Link key={actionIndex} to={action.link}>
                            <Button
                              className={`h-9 text-xs font-medium ${
                                actionIndex === 0
                                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                              }`}
                            >
                              {action.type === "call" && <Phone className="w-3.5 h-3.5 mr-1.5" />}
                              {action.type === "email" && <Mail className="w-3.5 h-3.5 mr-1.5" />}
                              {action.type === "document" && <FileText className="w-3.5 h-3.5 mr-1.5" />}
                              {action.type === "calendar" && <Calendar className="w-3.5 h-3.5 mr-1.5" />}
                              {action.type === "research" && <Users className="w-3.5 h-3.5 mr-1.5" />}
                              {action.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-900 mb-1">How AI generates these recommendations</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Our AI analyzes conversation patterns, buying signals, engagement metrics, deal velocity, and historical win/loss data 
                      to identify the highest-impact actions for each opportunity. Recommendations are updated in real-time as new data is collected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}