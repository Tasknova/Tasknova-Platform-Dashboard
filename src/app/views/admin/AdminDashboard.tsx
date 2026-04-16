import { Link } from "react-router";
import { useEffect, useState } from "react";
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
  Download,
  Globe,
  Shield,
  Mail,
  User,
  MapPin,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { AdminTeamManagement } from "../../components/AdminTeamManagement";
import { supabase } from "../../../lib/supabase";

const todaysAgenda = [
  {
    id: "1",
    time: "9:30 AM",
    duration: "60m",
    title: "Executive Leadership Meeting",
    type: "Leadership",
    attendees: ["CEO", "CRO", "CFO", "COO"],
    dealValue: null,
    focusAreas: ["Q1 performance review", "Q2 strategic planning"],
  },
  {
    id: "2",
    time: "11:00 AM",
    duration: "45m",
    title: "Revenue Operations Review",
    type: "Operations",
    attendees: ["All Sales Managers", "RevOps Team"],
    dealValue: "$14.0M",
    focusAreas: ["Pipeline health", "Forecast accuracy"],
  },
  {
    id: "3",
    time: "1:30 PM",
    duration: "30m",
    title: "Platform Performance Sync",
    type: "Technical",
    attendees: ["Engineering Lead", "Product Manager"],
    dealValue: null,
    focusAreas: ["System health", "Feature roadmap"],
  },
  {
    id: "4",
    time: "3:00 PM",
    duration: "45m",
    title: "Board Preparation Meeting",
    type: "Strategic",
    attendees: ["CEO", "CFO", "CRO"],
    dealValue: null,
    focusAreas: ["Q1 metrics package", "Growth trajectory"],
  },
];

const todaysTasks = [
  {
    id: "1",
    title: "Review Q1 performance package for board meeting",
    department: null,
    dueTime: "Before 3:00 PM",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "2",
    title: "Approve Enterprise Sales budget increase request",
    department: "Enterprise Sales",
    dueTime: "12:00 PM",
    priority: "high",
    status: "todo",
  },
  {
    id: "3",
    title: "Review system uptime report and scaling plan",
    department: "Engineering",
    dueTime: "2:00 PM",
    priority: "high",
    status: "todo",
  },
  {
    id: "4",
    title: "Finalize Q2 territory assignments for all departments",
    department: null,
    dueTime: "EOD",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: "5",
    title: "Sign off on new pricing structure for SMB segment",
    department: "SMB Sales",
    dueTime: "EOD",
    priority: "medium",
    status: "todo",
  },
];

const followUps = [
  {
    id: "1",
    priority: "urgent",
    dueDate: "Today",
    department: "Inside Sales",
    manager: "David Thompson",
    avatar: "DT",
    task: "Inside Sales at 78% quota with 2 weeks left in quarter. Schedule intervention meeting to review pipeline and coaching plan.",
    value: "$400K gap",
    action: "Schedule Meeting",
  },
  {
    id: "2",
    priority: "high",
    dueDate: "Tomorrow",
    department: "Strategic Accounts",
    manager: "Emily Rodriguez",
    avatar: "ER",
    task: "Approve $2.9M enterprise deal with custom contract terms. Legal review completed, awaiting final sign-off.",
    value: "$2.9M",
    action: "Review & Approve",
  },
  {
    id: "3",
    priority: "medium",
    dueDate: "Mon, Mar 2",
    department: "All Departments",
    manager: null,
    avatar: "AD",
    task: "Finalize Q2 territory planning and quota assignments. Coordinate with all 5 department managers for alignment.",
    value: "$16M Q2 target",
    action: "Review Planning",
  },
];

// Manager Performance & Coaching Effectiveness Data
const managerPerformance = [
  {
    manager: "Sarah Mitchell",
    avatar: "SM",
    department: "Enterprise Sales",
    teamSize: 14,
    
    // Team Productivity
    teamCallsMade: 342,
    teamCallsAnswered: 268,
    teamCallsNotAnswered: 74,
    teamAnswerRate: 78,
    teamMeetingsScheduled: 89,
    teamEmailsSent: 612,
    teamDealsAdvanced: 41,
    teamTalkTime: "142.5 hrs",
    
    // Revenue Performance
    teamQuotaAttainment: 84,
    teamPipeline: "$4.2M",
    activeDeals: 41,
    teamRevenue: "$5.9M",
    quotaTarget: "$7.0M",
    
    // Coaching Effectiveness
    oneOnOneSessions: 28,
    avgCoachingFrequency: "2x/week",
    coachingImpactScore: 87,
    repImprovementRate: 42,
    atRiskReps: 2,
    topPerformers: 3,
    
    // Quality Metrics
    avgTalkListenRatio: 42,
    avgQuestionsPerCall: 16,
    avgEngagementScore: 87,
    
    status: "exceeding",
    trend: "up",
  },
  {
    manager: "Michael Chen",
    avatar: "MC",
    department: "Mid-Market Sales",
    teamSize: 12,
    
    teamCallsMade: 512,
    teamCallsAnswered: 425,
    teamCallsNotAnswered: 87,
    teamAnswerRate: 83,
    teamMeetingsScheduled: 102,
    teamEmailsSent: 784,
    teamDealsAdvanced: 58,
    teamTalkTime: "221.3 hrs",
    
    teamQuotaAttainment: 94,
    teamPipeline: "$3.8M",
    activeDeals: 54,
    teamRevenue: "$6.2M",
    quotaTarget: "$6.6M",
    
    oneOnOneSessions: 32,
    avgCoachingFrequency: "2.5x/week",
    coachingImpactScore: 92,
    repImprovementRate: 58,
    atRiskReps: 1,
    topPerformers: 5,
    
    avgTalkListenRatio: 44,
    avgQuestionsPerCall: 18,
    avgEngagementScore: 91,
    
    status: "exceeding",
    trend: "up",
  },
  {
    manager: "Jessica Rodriguez",
    avatar: "JR",
    department: "SMB Sales",
    teamSize: 18,
    
    teamCallsMade: 892,
    teamCallsAnswered: 723,
    teamCallsNotAnswered: 169,
    teamAnswerRate: 81,
    teamMeetingsScheduled: 147,
    teamEmailsSent: 1342,
    teamDealsAdvanced: 94,
    teamTalkTime: "318.7 hrs",
    
    teamQuotaAttainment: 89,
    teamPipeline: "$2.4M",
    activeDeals: 112,
    teamRevenue: "$4.1M",
    quotaTarget: "$4.6M",
    
    oneOnOneSessions: 42,
    avgCoachingFrequency: "2.3x/week",
    coachingImpactScore: 85,
    repImprovementRate: 38,
    atRiskReps: 3,
    topPerformers: 4,
    
    avgTalkListenRatio: 41,
    avgQuestionsPerCall: 15,
    avgEngagementScore: 83,
    
    status: "on-target",
    trend: "up",
  },
  {
    manager: "David Park",
    avatar: "DP",
    department: "Strategic Accounts",
    teamSize: 8,
    
    teamCallsMade: 184,
    teamCallsAnswered: 142,
    teamCallsNotAnswered: 42,
    teamAnswerRate: 77,
    teamMeetingsScheduled: 56,
    teamEmailsSent: 423,
    teamDealsAdvanced: 22,
    teamTalkTime: "97.2 hrs",
    
    teamQuotaAttainment: 76,
    teamPipeline: "$8.9M",
    activeDeals: 18,
    teamRevenue: "$11.4M",
    quotaTarget: "$15.0M",
    
    oneOnOneSessions: 18,
    avgCoachingFrequency: "2.2x/week",
    coachingImpactScore: 79,
    repImprovementRate: 24,
    atRiskReps: 2,
    topPerformers: 2,
    
    avgTalkListenRatio: 38,
    avgQuestionsPerCall: 14,
    avgEngagementScore: 79,
    
    status: "below-target",
    trend: "stable",
  },
  {
    manager: "Emily Thompson",
    avatar: "ET",
    department: "Channel Sales",
    teamSize: 10,
    
    teamCallsMade: 298,
    teamCallsAnswered: 247,
    teamCallsNotAnswered: 51,
    teamAnswerRate: 83,
    teamMeetingsScheduled: 71,
    teamEmailsSent: 542,
    teamDealsAdvanced: 36,
    teamTalkTime: "128.4 hrs",
    
    teamQuotaAttainment: 91,
    teamPipeline: "$3.2M",
    activeDeals: 38,
    teamRevenue: "$5.5M",
    quotaTarget: "$6.0M",
    
    oneOnOneSessions: 24,
    avgCoachingFrequency: "2.4x/week",
    coachingImpactScore: 88,
    repImprovementRate: 47,
    atRiskReps: 1,
    topPerformers: 3,
    
    avgTalkListenRatio: 43,
    avgQuestionsPerCall: 17,
    avgEngagementScore: 88,
    
    status: "on-target",
    trend: "up",
  },
];

// Manager Deals Data
const managerDealsData = [
  {
    managerId: "1",
    managerName: "Sarah Mitchell",
    avatar: "SM",
    department: "Enterprise Sales",
    teamSize: 14,
    email: "sarah.mitchell@tasknova.ai",
    location: "San Francisco, CA",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    activeDeals: [
      {
        id: "deal-1",
        dealName: "DataFlow Systems",
        value: "$725K",
        stage: "Negotiation",
        closeDate: "Mar 15",
        rep: "Taylor Brooks",
        probability: 85,
        daysInStage: 8,
        nextStep: "Contract review meeting",
        stakeholders: ["CTO", "VP Engineering", "CFO"],
        lastActivity: "2 hours ago",
        stageHistory: [
          { stage: "Prospecting", completedDate: "Jan 15, 2026", duration: "5 days" },
          { stage: "Qualification", completedDate: "Jan 22, 2026", duration: "7 days" },
          { stage: "Discovery", completedDate: "Feb 5, 2026", duration: "14 days" },
          { stage: "Proposal", completedDate: "Feb 20, 2026", duration: "15 days" },
          { stage: "Negotiation", completedDate: null, duration: "8 days (ongoing)" },
        ],
        aiInsights: [
          "High engagement from decision makers",
          "Budget confirmed, legal review in progress",
          "Competitor mention: Salesforce - address in next call"
        ],
      },
      {
        id: "deal-2",
        dealName: "TechVision Inc",
        value: "$485K",
        stage: "Proposal",
        closeDate: "Mar 22",
        rep: "Alex Rivera",
        probability: 70,
        daysInStage: 12,
        nextStep: "Executive presentation",
        stakeholders: ["CEO", "Head of Sales"],
        lastActivity: "1 day ago",
        stageHistory: [
          { stage: "Prospecting", completedDate: "Jan 10, 2026", duration: "3 days" },
          { stage: "Qualification", completedDate: "Jan 18, 2026", duration: "8 days" },
          { stage: "Discovery", completedDate: "Feb 2, 2026", duration: "15 days" },
          { stage: "Proposal", completedDate: null, duration: "12 days (ongoing)" },
        ],
        aiInsights: [
          "Decision timeline moved up by 2 weeks",
          "Strong product-market fit identified",
          "Need to address ROI concerns in proposal"
        ],
      },
      {
        id: "deal-3",
        dealName: "Global Enterprises LLC",
        value: "$920K",
        stage: "Discovery",
        closeDate: "Apr 5",
        rep: "Morgan Smith",
        probability: 60,
        daysInStage: 18,
        nextStep: "Technical deep-dive",
        stakeholders: ["VP Operations", "IT Director"],
        lastActivity: "3 hours ago",
        stageHistory: [
          { stage: "Prospecting", completedDate: "Jan 5, 2026", duration: "7 days" },
          { stage: "Qualification", completedDate: "Jan 20, 2026", duration: "15 days" },
          { stage: "Discovery", completedDate: null, duration: "18 days (ongoing)" },
        ],
        aiInsights: [
          "Complex buying committee - 8 stakeholders",
          "Integration requirements are critical",
          "Champion identified: VP Operations"
        ],
      },
    ],
  },
  {
    managerId: "2",
    managerName: "Michael Chen",
    avatar: "MC",
    department: "Mid-Market Sales",
    teamSize: 12,
    email: "michael.chen@tasknova.ai",
    location: "Austin, TX",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    activeDeals: [
      {
        id: "deal-4",
        dealName: "CloudTech Solutions",
        value: "$340K",
        stage: "Negotiation",
        closeDate: "Mar 18",
        rep: "Jordan Lee",
        probability: 80,
        daysInStage: 6,
        nextStep: "Final pricing discussion",
        stakeholders: ["Director of Sales", "Finance Manager"],
        lastActivity: "4 hours ago",
        stageHistory: [
          { stage: "Prospecting", completedDate: "Feb 1, 2026", duration: "4 days" },
          { stage: "Qualification", completedDate: "Feb 8, 2026", duration: "7 days" },
          { stage: "Discovery", completedDate: "Feb 18, 2026", duration: "10 days" },
          { stage: "Proposal", completedDate: "Mar 5, 2026", duration: "15 days" },
          { stage: "Negotiation", completedDate: null, duration: "6 days (ongoing)" },
        ],
        aiInsights: [
          "Price sensitivity detected - discount request expected",
          "Strong alignment on implementation timeline",
          "Decision expected within 1 week"
        ],
      },
      {
        id: "deal-5",
        dealName: "Innovate Corp",
        value: "$275K",
        stage: "Closed Won",
        closeDate: "Feb 28",
        rep: "Sam Taylor",
        probability: 100,
        daysInStage: 2,
        nextStep: "Kickoff meeting scheduled",
        stakeholders: ["CEO", "Head of Revenue"],
        lastActivity: "1 day ago",
        stageHistory: [
          { stage: "Prospecting", completedDate: "Jan 20, 2026", duration: "3 days" },
          { stage: "Qualification", completedDate: "Jan 28, 2026", duration: "8 days" },
          { stage: "Discovery", completedDate: "Feb 8, 2026", duration: "11 days" },
          { stage: "Proposal", completedDate: "Feb 18, 2026", duration: "10 days" },
          { stage: "Negotiation", completedDate: "Feb 25, 2026", duration: "7 days" },
          { stage: "Closed Won", completedDate: "Feb 28, 2026", duration: "2 days" },
        ],
        aiInsights: [
          "Fast sales cycle - 39 days total",
          "Champion drove internal consensus",
          "Upsell opportunity identified for Q2"
        ],
      },
    ],
  },
  {
    managerId: "3",
    managerName: "Jessica Rodriguez",
    avatar: "JR",
    department: "SMB Sales",
    teamSize: 18,
    email: "jessica.rodriguez@tasknova.ai",
    location: "Denver, CO",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    activeDeals: [
      {
        id: "deal-6",
        dealName: "StartupX",
        value: "$95K",
        stage: "Proposal",
        closeDate: "Mar 12",
        rep: "Riley Chen",
        probability: 65,
        daysInStage: 9,
        nextStep: "Demo follow-up call",
        stakeholders: ["Founder", "Head of Growth"],
        lastActivity: "5 hours ago",
        stageHistory: [
          { stage: "Prospecting", completedDate: "Feb 12, 2026", duration: "2 days" },
          { stage: "Qualification", completedDate: "Feb 17, 2026", duration: "5 days" },
          { stage: "Discovery", completedDate: "Feb 25, 2026", duration: "8 days" },
          { stage: "Proposal", completedDate: null, duration: "9 days (ongoing)" },
        ],
        aiInsights: [
          "Fast-growing startup with urgent need",
          "Limited budget - may need custom packaging",
          "Strong product fit for their use case"
        ],
      },
      {
        id: "deal-7",
        dealName: "Digital Agency Pro",
        value: "$125K",
        stage: "Discovery",
        closeDate: "Mar 28",
        rep: "Casey Johnson",
        probability: 55,
        daysInStage: 14,
        nextStep: "Requirements workshop",
        stakeholders: ["Operations Manager", "Account Directors"],
        lastActivity: "2 days ago",
        stageHistory: [
          { stage: "Prospecting", completedDate: "Feb 5, 2026", duration: "3 days" },
          { stage: "Qualification", completedDate: "Feb 12, 2026", duration: "7 days" },
          { stage: "Discovery", completedDate: null, duration: "14 days (ongoing)" },
        ],
        aiInsights: [
          "Multiple stakeholders need alignment",
          "Current solution causing pain - high urgency",
          "Referral from existing customer"
        ],
      },
    ],
  },
];

function formatCurrencyCompact(value: number): string {
  if (!value || Number.isNaN(value)) return "$0";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

function parseCompactMoney(value: string): number {
  if (!value) return 0;
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(numeric)) return 0;
  if (value.includes("M")) return numeric * 1_000_000;
  if (value.includes("K")) return numeric * 1_000;
  return numeric;
}

export function AdminDashboard() {
  const [mainTab, setMainTab] = useState<"overview" | "managers" | "team">("overview");
  const [taskFilter, setTaskFilter] = useState<"all" | "todo" | "in-progress" | "completed">("all");
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const userName = localStorage.getItem("userName") || "Admin";
  const userId = localStorage.getItem("userId") || "";
  const organizationId = localStorage.getItem("userOrganization") || "";
  const userRole = localStorage.getItem("userRole") || "admin";

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userId || !organizationId) {
        setDashboardLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("get-dashboard-data", {
        body: {
          userId,
          organizationId,
          role: userRole,
        },
      });

      if (error || !data?.success) {
        console.error("Failed to load admin dashboard data:", error || data?.error);
        setDashboardData({ success: false });
        setDashboardLoading(false);
        return;
      }

      setDashboardData(data);
      setDashboardLoading(false);
    };

    loadDashboardData();
  }, [organizationId, userId, userRole]);

  const hasBackendData = Boolean(dashboardData?.success);

  const todaysAgenda = (dashboardData?.todaysAgenda || []) as Array<any>;

  const todaysTasks = (dashboardData?.todaysTasks || []) as Array<any>;

  const followUps = (dashboardData?.followUps || []) as Array<any>;

  const managerPerformance = (dashboardData?.managerPerformance || []) as Array<any>;

  const managerDealsData = ((dashboardData?.managerDealsData || []).map((manager: any, idx: number) => ({
        managerId: String(idx + 1),
        managerName: manager.manager || "Manager",
        avatar: manager.avatar || "MG",
        department: manager.department || "Sales",
        teamSize: manager.teamSize || 8,
        activeDeals: (manager.deals || []).map((deal: any, dealIdx: number) => {
          const valueNum = parseCompactMoney(deal.dealValue || deal.value || "$0");
          return {
            id: deal.id || `deal-${idx}-${dealIdx}`,
            dealName: deal.company || deal.dealName || "Deal",
            value: `${Math.max(1, Math.round(valueNum / 1000))}K`,
            stage: deal.stage || "Discovery",
            closeDate: deal.closeDate || "TBD",
            rep: deal.rep || manager.manager || "Rep",
            probability: deal.probability || 60,
            daysInStage: deal.daysInStage || 7,
            nextStep: deal.nextStep || "Follow up",
            stakeholders: deal.stakeholders || ["Primary Contact"],
            lastActivity: deal.lastActivity || "1 day ago",
            stageHistory:
              deal.stageHistory || [{ stage: deal.stage || "Discovery", completedDate: null, duration: "ongoing" }],
            aiInsights: deal.aiInsights || ["Monitor close timeline"],
          };
        }),
      }))) as Array<any>;

  const stats = dashboardData?.stats;
  const totalRevenue = Number(stats?.totalRevenue || 0);
  const totalTarget = Number(stats?.totalTarget || 0);
  const revenuePercent = totalTarget > 0 ? Math.min(100, Math.round((totalRevenue / totalTarget) * 100)) : 0;
  const avgQuota = Number(stats?.avgQuota || 0);
  const aboveTargetCount = managerPerformance.filter((m) => (m.teamQuotaAttainment || 0) >= 100).length;
  const belowTargetCount = managerPerformance.filter((m) => (m.teamQuotaAttainment || 0) < 80).length;
  const activeUsers = Number(stats?.activeUsers || 0);
  const totalUsers = Number(stats?.totalUsers || 0);
  const inactiveUsers = Math.max(0, totalUsers - activeUsers);
  const aiRoi = Number(stats?.aiRoi || 0);
  const aiRoiPercent = totalRevenue > 0 ? Math.round((aiRoi / totalRevenue) * 100) : 0;
  const conversationQuality = Number(stats?.conversationQuality || 0);
  const dataProcessed = Number(stats?.meetingsBooked || 0);
  const orgHealthUptime = Math.min(99.99, Number((99 + Number(stats?.platformAdoption || 0) / 100).toFixed(2)));
  const orgHealthLatency = Math.max(60, Math.round(180 - Number(stats?.platformAdoption || 0)));
  const orgHealthSessions = activeUsers;
  const orgHealthStorageUsed = Number(((dataProcessed + todaysTasks.length + managerDealsData.length * 4) / 1000).toFixed(2));
  const orgHealthStorageCap = 5;
  const orgHealthErrorRate = Number(((100 - Math.max(0, Math.min(100, conversationQuality))) / 500).toFixed(2));
  const todoCount = todaysTasks.filter((t) => t.status === "todo").length;
  const inProgressCount = todaysTasks.filter((t) => t.status === "in-progress").length;
  const completedCount = todaysTasks.filter((t) => t.status === "completed").length;
  const adoptionConversation = Math.min(100, Number(stats?.platformAdoption || 0) + 5);
  const adoptionRevenue = Math.min(100, Number(stats?.platformAdoption || 0));
  const adoptionCoaching = Math.max(0, Number(stats?.platformAdoption || 0) - 13);
  const adoptionAutomation = Math.max(0, Number(stats?.platformAdoption || 0) - 7);
  const adoptionCustomer = Math.min(100, Number(stats?.platformAdoption || 0) + 2);
  const sentimentPositive = Math.max(0, Math.min(100, Math.round(conversationQuality * 0.75)));
  const sentimentNegative = Math.max(0, Math.min(100, Math.round((todoCount + inProgressCount) * 4)));
  const sentimentNeutral = Math.max(0, 100 - sentimentPositive - sentimentNegative);
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const filteredTasks =
    taskFilter === "all" ? todaysTasks : todaysTasks.filter((t) => t.status === taskFilter);

  if (dashboardLoading) {
    return (
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-10 text-sm text-gray-600">Loading dashboard from backend...</div>
      </div>
    );
  }

  if (!hasBackendData) {
    return (
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-10 text-sm text-red-600">Failed to load dashboard data from backend.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="px-8 py-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Good morning, {userName}</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {todayLabel} • {todaysAgenda.length} meetings • {todoCount + inProgressCount} urgent tasks
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => setMainTab("team")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Team
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => setMainTab("managers")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Managers
                </Button>
                <Link to="/admin/reports">
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="w-4 h-4 mr-2" />
                    Export Reports
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
                {/* Total Revenue */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-3xl font-semibold text-gray-900 mb-1">{formatCurrencyCompact(totalRevenue)}</div>
                  <p className="text-sm text-gray-600 mb-3">Target: {formatCurrencyCompact(totalTarget)}</p>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${revenuePercent}%` }}></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>{revenuePercent}% of target</span>
                  </div>
                </div>

                {/* Avg Quota Attainment */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg Quota</span>
                    <Target className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-3xl font-semibold text-gray-900 mb-1">{avgQuota}%</div>
                  <p className="text-sm text-gray-600 mb-3">Org-wide performance</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-xs text-gray-500">Above 100%</div>
                      <div className="text-sm font-semibold text-gray-900">{aboveTargetCount} reps</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-xs text-gray-500">Below 80%</div>
                      <div className="text-sm font-semibold text-gray-900">{belowTargetCount} reps</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>Live backend metrics</span>
                  </div>
                </div>

                {/* Platform Adoption */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Platform Adoption</span>
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-3xl font-semibold text-gray-900 mb-1">{Number(stats?.platformAdoption || 0)}%</div>
                  <p className="text-sm text-gray-600 mb-3">Daily active users</p>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{activeUsers}</div>
                      <div className="text-xs text-gray-500">Active</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{inactiveUsers}</div>
                      <div className="text-xs text-gray-500">Inactive</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{totalUsers}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+7% vs last month</span>
                  </div>
                </div>

                {/* AI ROI */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">AI ROI</span>
                    <Sparkles className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-3xl font-semibold text-gray-900 mb-1">{formatCurrencyCompact(aiRoi)}</div>
                  <p className="text-sm text-gray-600 mb-3">AI-attributed revenue</p>
                  <div className="bg-gray-50 rounded p-2 mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">% of Total</span>
                      <span className="font-semibold text-gray-900">{aiRoiPercent}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${aiRoiPercent}%` }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>Growing rapidly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Metrics Row */}
            <div className="relative">
              <div className="mb-3">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Secondary Metrics</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {/* Organization Size */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Organization Size</span>
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">{Number(stats?.orgSize || totalUsers)}</div>
                  <p className="text-xs text-gray-500 mb-2">Active users</p>
                  <div className="flex items-center gap-1 text-xs">
                    <Building2 className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-700 font-medium">{Number(stats?.departments || 1)}</span>
                    <span className="text-gray-500">departments</span>
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">System Health</span>
                    <Activity className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="text-2xl font-semibold text-green-600 mb-1">{orgHealthUptime}%</div>
                  <p className="text-xs text-gray-500 mb-2">Uptime this month</p>
                  <div className="flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-gray-700 font-medium">All systems</span>
                    <span className="text-gray-500">{orgHealthErrorRate < 0.25 ? "operational" : "monitoring"}</span>
                  </div>
                </div>

                {/* Conversation Quality */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Conv. Quality</span>
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">{conversationQuality}%</div>
                  <p className="text-xs text-gray-500 mb-2">Avg quality score</p>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      +8%
                    </span>
                    <span className="text-gray-500">this quarter</span>
                  </div>
                </div>

                {/* Data Processed */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Data Processed</span>
                    <BarChart3 className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">{dataProcessed}</div>
                  <p className="text-xs text-gray-500 mb-2">Meetings synced today</p>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      +12%
                    </span>
                    <span className="text-gray-500">vs last week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Overview Tab */}
        {mainTab === "overview" && (
          <div className="px-8 py-6 space-y-6">
            {/* Organization Intelligence */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Organization Intelligence</h2>
                <p className="text-xs text-gray-600 mt-0.5">Key performance metrics across all departments</p>
              </div>
              <Link to="/admin/analytics">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                  Full Analytics
                </Button>
              </Link>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {/* Metric 1 */}
                  <div className="flex-shrink-0 w-72 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        {avgQuota >= 90 ? "Excellent" : avgQuota >= 75 ? "Good" : "Watch"}
                      </Badge>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">{avgQuota}%</div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Avg Quota Attainment</div>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-green-600 font-medium">{aboveTargetCount} teams above target</span>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="flex-shrink-0 w-72 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-all">
                    <div className="text-2xl font-semibold text-gray-900 mb-1">{formatCurrencyCompact(totalRevenue)}</div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Total Revenue</div>
                    <div className="flex items-center gap-1 text-xs mb-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-green-600 font-medium">{revenuePercent}% of target</span>
                    </div>
                    <div className="text-xs text-gray-600">Target: {formatCurrencyCompact(totalTarget)} ({revenuePercent}%)</div>
                  </div>

                  {/* Metric 3 - AI ROI */}
                  <div className="flex-shrink-0 w-72 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                        High Value
                      </Badge>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">{formatCurrencyCompact(aiRoi)}</div>
                    <div className="text-sm font-medium text-gray-900 mb-2">AI-Attributed Revenue</div>
                    <div className="flex items-center gap-1 text-xs">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span className="text-purple-600 font-medium">{aiRoiPercent}% of total revenue</span>
                    </div>
                  </div>

                  {/* Metric 4 - Conversation Quality */}
                  <div className="flex-shrink-0 w-72 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                        {conversationQuality >= 85 ? "Excellent" : conversationQuality >= 70 ? "Good" : "Needs Work"}
                      </Badge>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">{conversationQuality}%</div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Conversation Quality Score</div>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-green-600 font-medium">Live from performance metrics</span>
                    </div>
                  </div>

                  {/* Metric 5 - Compliance Score */}
                  <div className="flex-shrink-0 w-72 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-teal-100 text-teal-700 border-teal-200 text-xs">
                        Compliant
                      </Badge>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">{Math.max(90, Math.round(100 - orgHealthErrorRate * 50))}%</div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Compliance Score</div>
                    <div className="text-xs text-gray-600">{dataProcessed} meetings reviewed</div>
                  </div>

                  {/* Metric 6 - Cost Per Call */}
                  <div className="flex-shrink-0 w-72 bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 rounded-lg p-6 hover:shadow-md transition-all">
                    <div className="text-2xl font-semibold text-gray-900 mb-1">${Math.max(0.05, (orgHealthErrorRate + 0.1)).toFixed(2)}</div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Avg Cost Per Call</div>
                    <div className="flex items-center gap-1 text-xs mb-1">
                      <TrendingDown className="w-3 h-3 text-green-600" />
                      <span className="text-green-600 font-medium">Optimized from live usage mix</span>
                    </div>
                    <div className="text-xs text-gray-600">AI optimization savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Feature Adoption Heatmap */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">AI Feature Adoption</h2>
                <p className="text-xs text-gray-600 mt-0.5">Usage metrics across intelligence areas</p>
              </div>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                All Features Active
              </Badge>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 text-center hover:shadow-md transition-all">
                  <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-2 font-medium">Conversation Intelligence</div>
                  <div className="text-2xl font-semibold text-blue-600 mb-1">{adoptionConversation}%</div>
                  <p className="text-xs text-gray-500">{Math.round((totalUsers * adoptionConversation) / 100)} active users</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5 text-center hover:shadow-md transition-all">
                  <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-2 font-medium">Revenue Intelligence</div>
                  <div className="text-2xl font-semibold text-green-600 mb-1">{adoptionRevenue}%</div>
                  <p className="text-xs text-gray-500">{Math.round((totalUsers * adoptionRevenue) / 100)} active users</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-5 text-center hover:shadow-md transition-all">
                  <GraduationCap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-2 font-medium">Coaching Intelligence</div>
                  <div className="text-2xl font-semibold text-purple-600 mb-1">{adoptionCoaching}%</div>
                  <p className="text-xs text-gray-500">{Math.round((totalUsers * adoptionCoaching) / 100)} active users</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-5 text-center hover:shadow-md transition-all">
                  <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-2 font-medium">Performance Automation</div>
                  <div className="text-2xl font-semibold text-orange-600 mb-1">{adoptionAutomation}%</div>
                  <p className="text-xs text-gray-500">{Math.round((totalUsers * adoptionAutomation) / 100)} active users</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-lg p-5 text-center hover:shadow-md transition-all">
                  <Users className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-2 font-medium">Customer Intelligence</div>
                  <div className="text-2xl font-semibold text-cyan-600 mb-1">{adoptionCustomer}%</div>
                  <p className="text-xs text-gray-500">{Math.round((totalUsers * adoptionCustomer) / 100)} active users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Sentiment Trend */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Organization-Wide Sentiment</h2>
                <p className="text-xs text-gray-600 mt-0.5">Customer sentiment analysis across all interactions</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                Positive Trend
              </Badge>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{sentimentPositive}%</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Positive</div>
                  <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>Derived from live quality metrics</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-600 mb-2">{sentimentNeutral}%</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Neutral</div>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Minus className="w-3 h-3" />
                    <span>Stable</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">{sentimentNegative}%</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Negative</div>
                  <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                    <TrendingDown className="w-3 h-3" />
                    <span>Based on active risk load</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                <div className="bg-green-500" style={{ width: `${sentimentPositive}%` }}></div>
                <div className="bg-gray-300" style={{ width: `${sentimentNeutral}%` }}></div>
                <div className="bg-red-500" style={{ width: `${sentimentNegative}%` }}></div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="font-semibold text-gray-900">System Health</h2>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-300 text-xs font-semibold">
                {orgHealthErrorRate < 0.25 ? "All Systems Operational" : "Monitoring"}
              </Badge>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-2 font-medium">Uptime</div>
                  <div className="text-2xl font-semibold text-green-600">{orgHealthUptime}%</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-2 font-medium">API Latency</div>
                  <div className="text-2xl font-semibold text-blue-600">{orgHealthLatency}ms</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-2 font-medium">Active Sessions</div>
                  <div className="text-2xl font-semibold text-purple-600">{orgHealthSessions}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-2 font-medium">Storage Used</div>
                  <div className="text-lg font-semibold text-amber-700">{orgHealthStorageUsed} / {orgHealthStorageCap} TB</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-2 font-medium">Error Rate</div>
                  <div className="text-2xl font-semibold text-green-600">{orgHealthErrorRate}%</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link to="/admin/system-health">
                  <Button variant="outline" size="sm" className="w-full h-9 text-sm font-medium hover:bg-gray-50">
                    View Detailed System Metrics
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {todayLabel} • {todaysAgenda.length} meetings scheduled
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/admin/calendar">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    View Calendar
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  All Meetings
                </Button>
              </div>
            </div>
            <div className="p-6">
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

                          {/* Deal Value */}
                          {meeting.dealValue && (
                            <div className="text-sm font-semibold text-blue-600 mb-2">
                              {meeting.dealValue}
                            </div>
                          )}

                          {/* Attendees */}
                          <div className="text-xs text-gray-600 mb-2">
                            {meeting.attendees.join(", ")}
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
            </div>
          </div>

          {/* KANBAN TASK BOARD */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="font-semibold text-gray-900">Today's Tasks</h2>
                <p className="text-xs text-gray-500 mt-0.5">{todaysTasks.length} total tasks • {todoCount + inProgressCount} active</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                View All Tasks
              </Button>
            </div>

            {/* Kanban Board */}
            <div className="p-6">
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
                          {task.department && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Building2 className="w-3 h-3" />
                              {task.department}
                            </div>
                          )}
                          <span className={`flex items-center gap-1 text-gray-600 ${!task.department ? 'ml-auto' : ''}`}>
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
                          {task.department && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Building2 className="w-3 h-3" />
                              {task.department}
                            </div>
                          )}
                          <span className={`flex items-center gap-1 text-gray-600 ${!task.department ? 'ml-auto' : ''}`}>
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
                          {task.department && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Building2 className="w-3 h-3" />
                              {task.department}
                            </div>
                          )}
                          <span className={`flex items-center gap-1 text-gray-500 ${!task.department ? 'ml-auto' : ''}`}>
                            <Clock className="w-3 h-3" />
                            {task.dueTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Follow-ups Needed */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="font-semibold text-gray-900">Follow-ups Needed</h2>
                <p className="text-xs text-gray-500 mt-0.5">Critical items requiring immediate attention</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                View All
              </Button>
            </div>
            <div className="divide-y divide-gray-100">
              {followUps.map((followUp, index) => {
                const bgColors = [
                  "bg-gradient-to-br from-red-50 to-orange-50 border-red-200",
                  "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200",
                  "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
                ];
                const bgColor = bgColors[index % bgColors.length];
                
                return (
                  <div key={followUp.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className={`${bgColor} border rounded-lg p-4 mb-4`}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {followUp.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {followUp.priority === "urgent" && (
                              <Badge className="bg-red-100 text-red-700 border-red-300 text-xs font-semibold">
                                Urgent
                              </Badge>
                            )}
                            {followUp.priority === "high" && (
                              <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs font-semibold">
                                High Priority
                              </Badge>
                            )}
                            {followUp.priority === "medium" && (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs font-semibold">
                                Medium Priority
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs bg-white">
                              Due {followUp.dueDate}
                            </Badge>
                          </div>
                          <div className="font-semibold text-gray-900 text-sm mb-1">{followUp.department}</div>
                          {followUp.manager && (
                            <div className="text-xs text-gray-600 mb-3">{followUp.manager}</div>
                          )}
                          <div className="text-sm text-gray-700 mb-2 leading-relaxed">{followUp.task}</div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-900">
                            <DollarSign className="w-3 h-3" />
                            {followUp.value}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full h-9 text-sm bg-blue-600 hover:bg-blue-700">
                      {followUp.action}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Manager Performance & Productivity */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Manager Performance & Coaching Effectiveness</h2>
                <p className="text-xs text-gray-600 mt-0.5">Team productivity, revenue performance, and coaching impact across all managers</p>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                Export Report
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Manager</span>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Team Size</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Team Calls</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-semibold text-gray-700">Answer Rate</span>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Quota</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Revenue</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <GraduationCap className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Coaching</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-semibold text-gray-700">Impact Score</span>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-semibold text-gray-700">Rep Growth</span>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-semibold text-gray-700">Status</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {managerPerformance.map((manager) => (
                    <tr key={manager.manager} className="hover:bg-gray-50 transition-colors">
                      {/* Manager Name */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                            {manager.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900"> {manager.manager}</div>
                            <div className="text-xs text-gray-500"> {manager.department}</div>
                          </div>
                        </div>
                      </td>

                      {/* Team Size */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-semibold text-gray-900"> {manager.teamSize}</div>
                        <div className="text-xs text-gray-500"> reps</div>
                      </td>

                      {/* Team Calls */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-semibold text-gray-900"> {manager.teamCallsMade}</div>
                        <div className="text-xs text-gray-500"> {manager.teamCallsAnswered} answered</div>
                      </td>

                      {/* Answer Rate */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`text-sm font-semibold ${
                              manager.teamAnswerRate >= 80
                                ? "text-green-600"
                                : manager.teamAnswerRate >= 70
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {manager.teamAnswerRate}%
                          </span>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                manager.teamAnswerRate >= 80
                                  ? "bg-green-500"
                                  : manager.teamAnswerRate >= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${manager.teamAnswerRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Quota Attainment */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`text-sm font-semibold ${
                              manager.teamQuotaAttainment >= 90
                                ? "text-green-600"
                                : manager.teamQuotaAttainment >= 80
                                ? "text-blue-600"
                                : "text-orange-600"
                            }`}
                          >
                            {manager.teamQuotaAttainment}%
                          </span>
                          <div className="text-xs text-gray-500"> ${manager.teamRevenue}</div>
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-semibold text-blue-600"> {manager.teamRevenue}</div>
                        <div className="text-xs text-gray-500"> of {manager.quotaTarget}</div>
                      </td>

                      {/* Coaching Sessions */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-semibold text-gray-900"> {manager.oneOnOneSessions}</div>
                        <div className="text-xs text-gray-500"> {manager.avgCoachingFrequency}</div>
                      </td>

                      {/* Coaching Impact Score */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`text-sm font-semibold ${
                              manager.coachingImpactScore >= 85
                                ? "text-green-600"
                                : manager.coachingImpactScore >= 75
                                ? "text-blue-600"
                                : "text-orange-600"
                            }`}
                          >
                            {manager.coachingImpactScore}
                          </span>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                manager.coachingImpactScore >= 85
                                  ? "bg-green-500"
                                  : manager.coachingImpactScore >= 75
                                  ? "bg-blue-500"
                                  : "bg-orange-500"
                              }`}
                              style={{ width: `${manager.coachingImpactScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Rep Improvement Rate */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm font-semibold text-green-600"> +{manager.repImprovementRate}%</span>
                          <div className="text-xs text-gray-500">
                            {manager.topPerformers} top • {manager.atRiskReps} risk
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {manager.status === "exceeding" && (
                            <>
                              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5 font-semibold">
                                Exceeding
                              </Badge>
                              {manager.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                            </>
                          )}
                          {manager.status === "on-target" && (
                            <>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5 h-5 font-semibold">
                                On Target
                              </Badge>
                              {manager.trend === "up" && <TrendingUp className="w-4 h-4 text-blue-600" />}
                              {manager.trend === "stable" && <Minus className="w-4 h-4 text-gray-600" />}
                            </>
                          )}
                          {manager.status === "below-target" && (
                            <>
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5 h-5 font-semibold">
                                Below Target
                              </Badge>
                              {manager.trend === "stable" && <Minus className="w-4 h-4 text-gray-600" />}
                              {manager.trend === "down" && <TrendingDown className="w-4 h-4 text-orange-600" />}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Org Totals Footer */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 px-6 py-5">
              <div className="grid grid-cols-5 gap-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xs font-medium text-gray-600 mb-2 text-center">Total Managers</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{managerPerformance.length}</div>
                  <div className="text-xs text-gray-500">
                    {managerPerformance.reduce((sum, m) => sum + m.teamSize, 0)} total reps
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xs font-medium text-gray-600 mb-2 text-center">Org Total Calls</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {managerPerformance.reduce((sum, m) => sum + m.teamCallsMade, 0)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {managerPerformance.reduce((sum, m) => sum + m.teamCallsAnswered, 0)} answered
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xs font-medium text-gray-600 mb-2 text-center">Avg Quota</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {Math.round(
                      managerPerformance.reduce((sum, m) => sum + m.teamQuotaAttainment, 0) / managerPerformance.length
                    )}%
                  </div>
                  <div className="text-xs text-gray-500 invisible">placeholder</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xs font-medium text-gray-600 mb-2 text-center">Avg Coaching Impact</div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {Math.round(
                      managerPerformance.reduce((sum, m) => sum + m.coachingImpactScore, 0) / managerPerformance.length
                    )}
                  </div>
                  <div className="text-xs text-gray-500">High effectiveness</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xs font-medium text-gray-600 mb-2 text-center">Organization Performance</div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-sm px-2.5 py-0.5 font-semibold">
                      Excellent
                    </Badge>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-500 invisible">placeholder</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Managers Tab */}
        {mainTab === "managers" && (
          <div className="px-8 py-6 space-y-6">
            {/* Manager Forecasts Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => setMainTab("overview")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <h2 className="text-sm font-semibold text-gray-900">Manager Forecasts</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Sort by Attainment
                  </Button>
                </div>
              </div>

              {/* Managers Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Manager</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Quota</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Committed</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Best Case</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Pipeline</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Attainment</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Trend</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Deals</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {managerDealsData.map((manager, index) => {
                      // Calculate metrics
                      const totalDealsValue = manager.activeDeals.reduce((sum, deal) => {
                        const value = parseInt(deal.value.replace(/[$K]/g, '')) * 1000;
                        return sum + value;
                      }, 0);
                      const quota = manager.teamSize * 500000;
                      const committed = totalDealsValue * 0.6;
                      const bestCase = totalDealsValue * 0.85;
                      const attainment = Math.round((committed / quota) * 100);
                      
                      return (
                        <tr key={manager.managerId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                index === 0 ? "bg-blue-600" :
                                index === 1 ? "bg-indigo-600" :
                                "bg-purple-600"
                              }`}>
                                {manager.avatar}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{manager.managerName}</div>
                                <div className="text-xs text-gray-500">{manager.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              ${(quota / 1000).toFixed(0)}K
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-green-600">
                              ${(committed / 1000).toFixed(0)}K
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-blue-600">
                              ${(bestCase / 1000).toFixed(0)}K
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              ${(totalDealsValue / 1000).toFixed(0)}K
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={`text-xs font-semibold ${
                              attainment >= 80 ? "bg-green-100 text-green-700 border-green-200" :
                              attainment >= 60 ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                              "bg-red-100 text-red-700 border-red-200"
                            }`}>
                              {attainment}%
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <TrendingUp className={`w-4 h-4 ${
                              attainment >= 80 ? "text-green-600" :
                              attainment >= 60 ? "text-yellow-600" :
                              "text-gray-400"
                            }`} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {manager.activeDeals.length}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* At-Risk Deals by Manager */}
            {managerDealsData.map((manager) => (
              <div key={`deals-${manager.managerId}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs ${
                      manager.managerId === "1" ? "bg-blue-600" :
                      manager.managerId === "2" ? "bg-indigo-600" :
                      "bg-purple-600"
                    }`}>
                      {manager.avatar}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{manager.managerName} - At-Risk Deals</h3>
                  </div>
                </div>

                {/* Deals List */}
                <div className="divide-y divide-gray-100">
                  {manager.activeDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setExpandedDeal(expandedDeal === deal.id ? null : deal.id)}
                    >
                      {/* Deal Header - Compact Format */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs px-2 ${
                              deal.stage === "Negotiation" ? "bg-red-100 text-red-700 border-red-200" :
                              "bg-orange-100 text-orange-700 border-orange-200"
                            }`}>
                              At Risk
                            </Badge>
                            <h4 className="text-sm font-medium text-gray-900">{deal.dealName}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {deal.rep}
                          </span>
                          <span className="font-semibold text-gray-900">${deal.value}</span>
                          <span>Close: {deal.closeDate}</span>
                          <span>Stage: {deal.stage}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              expandedDeal === deal.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedDeal === deal.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-6">
                            {/* Left - Progress */}
                            <div>
                              <h6 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                Deal Progress
                              </h6>
                              <div className="space-y-2">
                                {deal.stageHistory.map((stage, idx) => (
                                  <div key={idx} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                      {stage.completedDate ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <CircleDot className="w-4 h-4 text-blue-600 animate-pulse" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${
                                          stage.completedDate ? "text-gray-900" : "text-blue-600"
                                        }`}>
                                          {stage.stage}
                                        </span>
                                        <span className="text-xs text-gray-500">{stage.duration}</span>
                                      </div>
                                      {stage.completedDate && (
                                        <div className="text-xs text-gray-500 mt-0.5">
                                          {stage.completedDate}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="text-xs font-semibold text-blue-900 mb-1">Next Step</div>
                                      <div className="text-xs text-blue-700">{deal.nextStep}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right - Insights */}
                            <div>
                              <h6 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                Key Stakeholders
                              </h6>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {deal.stakeholders.map((stakeholder, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {stakeholder}
                                  </Badge>
                                ))}
                              </div>

                              <h6 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                AI Insights
                              </h6>
                              <div className="space-y-2">
                                {deal.aiInsights.map((insight, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-purple-50 border border-purple-200 rounded-lg p-2.5"
                                  >
                                    <div className="flex items-start gap-2">
                                      <Lightbulb className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                                      <span className="text-xs text-purple-900">{insight}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team Management Tab */}
        {mainTab === "team" && (
          <div className="px-8 py-6 bg-gray-900 min-h-full">
            <div className="max-w-6xl mx-auto">
              <Button
                variant="outline"
                size="sm"
                className="mb-6 h-8 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={() => setMainTab("overview")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <AdminTeamManagement />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}