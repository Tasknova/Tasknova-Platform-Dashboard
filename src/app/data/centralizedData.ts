// Centralized data model for consistent KPIs across all dashboards
// This ensures data integrity and consistency across Rep, Manager, and Admin views

// =============================================================================
// ORGANIZATION STRUCTURE
// =============================================================================

export const organizationStructure = {
  totalUsers: 134,
  breakdown: {
    reps: 112,
    managers: 18,
    admins: 4,
  },
  teams: [
    { id: "team-1", name: "East Coast Sales", managerId: "mgr-1", repIds: ["rep-1", "rep-2", "rep-3", "rep-4", "rep-5", "rep-6", "rep-7"] },
    { id: "team-2", name: "West Coast Sales", managerId: "mgr-2", repIds: ["rep-8", "rep-9", "rep-10", "rep-11", "rep-12", "rep-13", "rep-14"] },
    // Additional teams...
  ]
};

// =============================================================================
// USER PROFILES
// =============================================================================

export const users = {
  // Current logged in rep
  "rep-1": {
    id: "rep-1",
    name: "Alex Rivera",
    role: "rep",
    email: "alex.rivera@tasknova.ai",
    avatar: "AR",
    teamId: "team-1",
    managerId: "mgr-1",
    quota: {
      monthly: 500000,
      quarterly: 1500000,
      achieved: 460000, // 92%
    },
    pipeline: {
      total: 1200000,
      dealCount: 8,
      weighted: 840000,
    },
    performance: {
      winRate: 0.68,
      avgDealSize: 85000,
      callsToday: 4,
      meetingsToday: 4,
      tasksCompleted: 12,
      tasksPending: 8,
    },
    conversationMetrics: {
      talkListenRatio: 42, // 42% talk, 58% listen
      questionsPerCall: 18,
      longestMonologue: 135, // seconds
      engagementScore: 89,
      actionItemFollowThrough: 85,
    }
  },
  
  // Manager
  "mgr-1": {
    id: "mgr-1",
    name: "Sarah Chen",
    role: "manager",
    email: "sarah.chen@tasknova.ai",
    avatar: "SC",
    teamId: "team-1",
    repIds: ["rep-1", "rep-2", "rep-3", "rep-4", "rep-5", "rep-6", "rep-7", "rep-8", "rep-9", "rep-10", "rep-11", "rep-12", "rep-13", "rep-14"],
    teamSize: 14,
    teamQuota: {
      monthly: 7000000,
      achieved: 5900000, // 84%
    },
    teamPipeline: {
      total: 4200000,
      dealCount: 41,
      atRiskDeals: 7,
    },
    teamPerformance: {
      forecastAccuracy: 91,
      avgWinRate: 64,
    },
    teamConversationMetrics: {
      avgTalkListenRatio: 42,
      avgQuestionsPerCall: 16,
      avgMonologue: 135,
      avgEngagementScore: 87,
    }
  },
  
  // Admin
  "admin-1": {
    id: "admin-1",
    name: "Michael Foster",
    role: "admin",
    email: "michael.foster@tasknova.ai",
    avatar: "MF",
    orgMetrics: {
      totalUsers: 134,
      activeUsers: 128,
      totalRevenue: 14000000,
      avgQuotaAttainment: 94,
      platformUsage: 89,
      systemHealth: 99.98,
    }
  }
};

// =============================================================================
// REVENUE & DEAL DATA (ensures consistency)
// =============================================================================

export const dealsData = [
  {
    id: "deal-1",
    name: "Enterprise Platform Upgrade - Acme Corp",
    company: "Acme Corp",
    value: 125000,
    valueType: "ARR", // Annual Recurring Revenue
    stage: "Proposal",
    probability: 70,
    repId: "rep-1",
    closeDate: "2026-03-15",
    status: "active",
    isAtRisk: false,
    lastActivity: "2026-02-26",
    nextStep: "Send final proposal with ROI calculator",
  },
  {
    id: "deal-2",
    name: "New Business - TechVision Inc",
    company: "TechVision Inc",
    value: 95000,
    valueType: "ARR",
    stage: "Negotiation",
    probability: 80,
    repId: "rep-1",
    closeDate: "2026-03-10",
    status: "active",
    isAtRisk: false,
    lastActivity: "2026-02-27",
    nextStep: "Security review scheduled for Mar 3",
  },
  {
    id: "deal-3",
    name: "DataFlow Systems - Platform License",
    company: "DataFlow Systems",
    value: 125000,
    valueType: "ARR",
    stage: "Discovery",
    probability: 30,
    repId: "rep-1",
    closeDate: "2026-04-15",
    status: "at-risk",
    isAtRisk: true,
    atRiskReason: "No contact in 10 days after pricing discussion",
    lastActivity: "2026-02-17",
    nextStep: "Multi-threading required - contact VP of Operations",
  },
  // Add more deals for other reps to total 41 deals for the team
];

// =============================================================================
// MEETINGS & CALLS DATA
// =============================================================================

export const meetingsData = [
  {
    id: "meeting-1",
    title: "Discovery Call - Acme Corp",
    type: "Discovery",
    datetime: "2026-02-27T09:00:00",
    duration: 45, // minutes
    attendees: ["John Smith (Acme)", "Lisa Wong (Acme)"],
    dealId: "deal-1",
    dealValue: 125000,
    repId: "rep-1",
    platform: "zoom",
    platformUrl: "https://zoom.us/j/123456789",
    status: "scheduled",
    aiInsights: {
      preparationScore: 92,
      suggestedQuestions: ["What's your current tech stack?", "Who else needs to be involved?"],
    },
    outcome: null,
  },
  {
    id: "meeting-2",
    title: "Demo - CloudVista",
    type: "Demo",
    datetime: "2026-02-27T11:00:00",
    duration: 60,
    attendees: ["Sarah Johnson (CloudVista)", "Mike Chen (CloudVista)"],
    dealId: "deal-4",
    dealValue: 210000,
    repId: "rep-1",
    platform: "teams",
    platformUrl: "https://teams.microsoft.com/l/meetup-join/...",
    status: "scheduled",
    aiInsights: {
      preparationScore: 88,
      suggestedQuestions: ["What are your integration requirements?"],
    },
    outcome: null,
  },
  {
    id: "meeting-3",
    title: "Closed Won - TechCorp Enterprise",
    type: "Closing",
    datetime: "2026-02-26T14:30:00",
    duration: 30,
    attendees: ["David Park (TechCorp)"],
    dealId: "deal-closed-1",
    dealValue: 498000,
    repId: "rep-2", // Taylor Brooks
    platform: "zoom",
    status: "completed",
    outcome: "won",
    conversationMetrics: {
      talkListenRatio: 38,
      questionsAsked: 22,
      engagementScore: 92,
      longestMonologue: 90,
    },
    aiInsights: {
      keyTakeaways: [
        "Deal closed 2 weeks early",
        "Used ROI calculator in final presentation",
        "Multi-threaded with 4 stakeholders",
      ],
      insight: "Taylor's discovery technique led to 92% engagement score. This pattern shows asking 18+ questions early drives faster closes.",
    }
  },
];

// =============================================================================
// TASKS DATA
// =============================================================================

export const tasksData = [
  {
    id: "task-1",
    title: "Send proposal to Acme Corp",
    description: "Include ROI calculator and security documentation",
    dueDate: "2026-02-27T17:00:00",
    dueTime: "5:00 PM",
    priority: "high",
    status: "todo",
    assignedTo: "rep-1",
    assignedBy: "mgr-1",
    dealId: "deal-1",
    dealValue: 125000,
    tags: ["proposal", "urgent"],
  },
  {
    id: "task-2",
    title: "Follow up with DataFlow Systems",
    description: "Attempt to re-engage - deal has been silent for 10 days",
    dueDate: "2026-02-27T12:00:00",
    dueTime: "12:00 PM",
    priority: "high",
    status: "todo",
    assignedTo: "rep-1",
    assignedBy: "rep-1",
    dealId: "deal-3",
    dealValue: 125000,
    tags: ["follow-up", "at-risk"],
  },
  {
    id: "task-3",
    title: "Prepare demo environment for CloudVista",
    description: "Set up custom demo with their data",
    dueDate: "2026-02-27T10:00:00",
    dueTime: "10:00 AM",
    priority: "high",
    status: "in-progress",
    assignedTo: "rep-1",
    assignedBy: "rep-1",
    dealId: "deal-4",
    dealValue: 210000,
    tags: ["demo", "preparation"],
  },
  {
    id: "task-4",
    title: "Update CRM with meeting notes",
    description: "Log yesterday's discovery call outcomes",
    dueDate: "2026-02-27T09:00:00",
    dueTime: "Completed",
    priority: "medium",
    status: "completed",
    assignedTo: "rep-1",
    assignedBy: "rep-1",
    completedAt: "2026-02-27T08:45:00",
    tags: ["admin"],
  },
];

// =============================================================================
// GLOSSARY & HELP TEXT
// =============================================================================

export const glossary = {
  // Revenue Metrics
  "ARR": {
    term: "ARR (Annual Recurring Revenue)",
    definition: "The value of contracted recurring revenue normalized to a one-year period",
    calculation: "Monthly recurring revenue × 12",
  },
  "ACV": {
    term: "ACV (Annual Contract Value)",
    definition: "Total contract value divided by number of years",
    calculation: "Total contract value ÷ Contract length in years",
  },
  "TCV": {
    term: "TCV (Total Contract Value)",
    definition: "The total value of a contract over its entire duration",
    calculation: "Sum of all payments over contract lifetime",
  },
  
  // Performance Metrics
  "Quota Attainment": {
    term: "Quota Attainment",
    definition: "Percentage of assigned sales quota achieved",
    calculation: "(Closed Won Revenue ÷ Quota) × 100",
    goodRange: "90-110%",
  },
  "Win Rate": {
    term: "Win Rate",
    definition: "Percentage of opportunities that result in closed won deals",
    calculation: "(Closed Won Deals ÷ Total Closed Deals) × 100",
    goodRange: "25-35% for new business, 60-75% for existing customers",
  },
  "Pipeline Coverage": {
    term: "Pipeline Coverage",
    definition: "Ratio of pipeline value to quota remaining",
    calculation: "Total Pipeline Value ÷ Remaining Quota",
    goodRange: "3-5x coverage",
  },
  
  // Conversation Intelligence
  "Talk-Listen Ratio": {
    term: "Talk-Listen Ratio",
    definition: "Percentage of call time spent talking vs. listening",
    calculation: "(Rep talk time ÷ Total call time) × 100",
    goodRange: "40-45% for discovery, 55-60% for demos",
  },
  "Engagement Score": {
    term: "Engagement Score",
    definition: "AI-calculated measure of prospect participation and interest",
    calculation: "Based on: questions asked by prospect, verbal affirmations, topic switches initiated, tone analysis",
    goodRange: "80%+",
  },
  "Longest Monologue": {
    term: "Longest Monologue",
    definition: "Duration of longest uninterrupted speaking segment",
    calculation: "Maximum seconds of continuous speech without interruption",
    goodRange: "Under 90 seconds",
  },
  
  // Deal Risk
  "At Risk": {
    term: "At Risk Deal",
    definition: "Deal with elevated probability of being lost",
    triggers: [
      "No contact in 7+ days",
      "Champion unresponsive after pricing",
      "Competitor mentioned in last call",
      "Decision date pushed 2+ times",
      "Stakeholder count decreased",
    ],
  },
  
  // Forecast
  "Forecast Accuracy": {
    term: "Forecast Accuracy",
    definition: "How closely actual results match forecasted results",
    calculation: "1 - (|Forecasted - Actual| ÷ Forecasted) × 100",
    goodRange: "90%+",
  },
};

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

export const notificationTypes = {
  AI_INSIGHT: "ai_insight",
  MEETING_REMINDER: "meeting_reminder",
  TASK_ASSIGNED: "task_assigned",
  DEAL_AT_RISK: "deal_at_risk",
  QUOTA_MILESTONE: "quota_milestone",
  SYSTEM_UPDATE: "system_update",
};

// =============================================================================
// TIMEZONE SETTINGS
// =============================================================================

export const timezoneSettings = {
  default: "America/Los_Angeles",
  displayFormat: "h:mm A z", // e.g., "2:30 PM PST"
};

// =============================================================================
// EXPORT FORMATS
// =============================================================================

export const exportFormats = [
  { id: "pdf", label: "PDF Document", icon: "FileText" },
  { id: "csv", label: "CSV Spreadsheet", icon: "Table" },
  { id: "xlsx", label: "Excel Workbook", icon: "Sheet" },
  { id: "json", label: "JSON Data", icon: "Code" },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function calculateTeamMetrics(repIds: string[]) {
  // Calculate aggregated team metrics from individual rep data
  const reps = repIds.map(id => users[id as keyof typeof users]).filter(Boolean);
  
  const totalQuota = reps.reduce((sum, rep: any) => sum + (rep.quota?.monthly || 0), 0);
  const totalAchieved = reps.reduce((sum, rep: any) => sum + (rep.quota?.achieved || 0), 0);
  const totalPipeline = reps.reduce((sum, rep: any) => sum + (rep.pipeline?.total || 0), 0);
  const totalDeals = reps.reduce((sum, rep: any) => sum + (rep.pipeline?.dealCount || 0), 0);
  
  return {
    teamQuota: totalQuota,
    teamAchieved: totalAchieved,
    teamQuotaPercent: Math.round((totalAchieved / totalQuota) * 100),
    teamPipeline: totalPipeline,
    teamDealCount: totalDeals,
  };
}

export function getMetricTooltip(metricKey: string): string {
  const glossaryEntry = glossary[metricKey as keyof typeof glossary];
  if (!glossaryEntry) return "";
  
  let tooltip = `${glossaryEntry.definition}\n\n`;
  
  if ('calculation' in glossaryEntry) {
    tooltip += `Calculation: ${glossaryEntry.calculation}\n`;
  }
  
  if ('goodRange' in glossaryEntry) {
    tooltip += `Target Range: ${glossaryEntry.goodRange}`;
  }
  
  if ('triggers' in glossaryEntry && Array.isArray(glossaryEntry.triggers)) {
    tooltip += `Triggered by:\n${glossaryEntry.triggers.map((t: string) => `• ${t}`).join('\n')}`;
  }
  
  return tooltip;
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatTime(datetime: string, includeTimezone = true): string {
  const date = new Date(datetime);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    ...(includeTimezone && { timeZoneName: 'short' }),
  };
  return date.toLocaleTimeString('en-US', options);
}

export function formatDate(datetime: string): string {
  const date = new Date(datetime);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
