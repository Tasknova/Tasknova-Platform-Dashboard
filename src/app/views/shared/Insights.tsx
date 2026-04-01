import { useState } from "react";
import { Link } from "react-router";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Clock,
  Users,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Award,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Zap,
  Mic,
  Volume2,
  Timer,
  Activity,
  AlertTriangle,
  Pause,
  Play,
  FastForward,
  FileText,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Workflow,
  ListChecks,
  X,
  Maximize2,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";

// Sample call data for topic drill-down
const topicCallMentions: Record<string, any[]> = {
  "Pricing": [
    {
      id: "c1",
      company: "Postmedia Health",
      contact: "Cam Brenner",
      timestamp: "51:03",
      duration: "28:52",
      date: "Feb 25, 2026",
      meetingTitle: "Discovery Call - Postmedia Health",
      highlight: "Two two way CRM field updates is nice. Okay so the pricing structure makes sense for our use case. I'm looking at the enterprise tier and comparing it to what we currently pay for our existing solution...",
    },
    {
      id: "c2",
      company: "TechCorp Solutions",
      contact: "Sarah Mitchell",
      timestamp: "10:59",
      date: "Feb 24, 2026",
      meetingTitle: "Pricing Discussion - TechCorp",
      highlight: "The pricing seems competitive, especially when you factor in the ROI from automation. Can we discuss volume discounts if we roll this out to all 50 reps?",
    },
    {
      id: "c3",
      company: "CloudScale Inc",
      contact: "Robert Kim",
      timestamp: "35:02",
      date: "Feb 23, 2026",
      meetingTitle: "Enterprise Demo - CloudScale",
      highlight: "I need to understand the pricing model better. Is it per user per month or do you have any annual commitment options? Our CFO wants to see the total cost breakdown.",
    },
    {
      id: "c4",
      company: "DataFlow Systems",
      contact: "Jessica Lee",
      timestamp: "18:22",
      date: "Feb 22, 2026",
      meetingTitle: "Follow-up Call - DataFlow",
      highlight: "After reviewing the pricing proposal with my team, we have some concerns about the implementation costs on top of the subscription pricing. Can we bundle those?",
    },
    {
      id: "c5",
      company: "Revenue Ops Inc",
      contact: "David Chen",
      timestamp: "22:45",
      date: "Feb 21, 2026",
      meetingTitle: "Negotiation Call - Revenue Ops",
      highlight: "The pricing is in our budget range, but I'd like to discuss payment terms. Can we do quarterly payments instead of annual upfront? That would help with our cash flow planning.",
    },
  ],
};

// Call mentions for objections
const objectionCallMentions: Record<string, any[]> = {
  "Price too high": [
    {
      id: "o1",
      company: "CloudScale Inc",
      contact: "Robert Kim",
      timestamp: "35:02",
      date: "Feb 23, 2026",
      meetingTitle: "Enterprise Demo - CloudScale",
      highlight: "I need to be honest with you, the price is significantly higher than what we're currently paying. Our CFO is going to push back hard on this unless we can show immediate ROI. Can you help me build a business case?",
    },
    {
      id: "o2",
      company: "TechStart Labs",
      contact: "Emily Rodriguez",
      timestamp: "22:18",
      date: "Feb 22, 2026",
      meetingTitle: "Budget Discussion - TechStart",
      highlight: "Look, I love the platform, but the price point is a concern for us. We're a startup and every dollar counts. Is there any flexibility on pricing for companies our size? Maybe a startup discount or tiered pricing?",
    },
    {
      id: "o3",
      company: "Global Finance Corp",
      contact: "Michael Chen",
      timestamp: "18:45",
      date: "Feb 21, 2026",
      meetingTitle: "Pricing Negotiation - Global Finance",
      highlight: "The enterprise tier pricing seems steep compared to alternatives we've evaluated. We need to understand what justifies the premium here. What specific value are we getting for that price difference?",
    },
  ],
  "Need more features": [
    {
      id: "o4",
      company: "DataFlow Systems",
      contact: "Jessica Lee",
      timestamp: "28:12",
      date: "Feb 24, 2026",
      meetingTitle: "Feature Requirements - DataFlow",
      highlight: "We really need advanced analytics and custom reporting capabilities that I don't see in the current offering. Our data team requires specific metrics tracking. Is this on your roadmap or can it be custom developed?",
    },
    {
      id: "o5",
      company: "SalesPro Inc",
      contact: "Amanda Foster",
      timestamp: "14:33",
      date: "Feb 23, 2026",
      meetingTitle: "Technical Discussion - SalesPro",
      highlight: "The core features are solid, but we're missing some key functionality like AI-powered lead scoring and automated email sequencing. These are must-haves for our sales process. Can you add these?",
    },
  ],
  "Implementation concerns": [
    {
      id: "o6",
      company: "Enterprise Solutions Ltd",
      contact: "David Park",
      timestamp: "31:22",
      date: "Feb 25, 2026",
      meetingTitle: "Implementation Planning - Enterprise Solutions",
      highlight: "I'm worried about the implementation timeline and potential disruption to our current operations. We can't afford downtime. How do you ensure a smooth migration with minimal business impact? What's the typical timeline?",
    },
    {
      id: "o7",
      company: "FinTech Innovations",
      contact: "Sarah Mitchell",
      timestamp: "25:40",
      date: "Feb 24, 2026",
      meetingTitle: "Technical Assessment - FinTech",
      highlight: "Our IT team has concerns about the complexity of implementation and whether we have the technical resources to manage this. Do you provide dedicated support during onboarding? What if we run into technical issues?",
    },
  ],
  "Timing not right": [
    {
      id: "o8",
      company: "Retail Solutions Group",
      contact: "John Williams",
      timestamp: "12:15",
      date: "Feb 22, 2026",
      meetingTitle: "Initial Discussion - Retail Solutions",
      highlight: "This looks great, but honestly the timing isn't ideal for us. We're in the middle of a major org restructure and won't have bandwidth to take on new tech implementation until Q3. Can we revisit this in a few months?",
    },
  ],
};

// Call mentions for competitors
const competitorCallMentions: Record<string, any[]> = {
  "Competitor A": [
    {
      id: "comp1",
      company: "CloudVista Corp",
      contact: "Alex Thompson",
      timestamp: "19:45",
      date: "Feb 25, 2026",
      meetingTitle: "Competitive Analysis - CloudVista",
      highlight: "We've been looking at Competitor A as well. They seem to have similar features but at a lower price point. What differentiates your platform from theirs? Why should we choose you over Competitor A?",
    },
    {
      id: "comp2",
      company: "Revenue Analytics Inc",
      contact: "Lisa Chen",
      timestamp: "33:20",
      date: "Feb 24, 2026",
      meetingTitle: "Vendor Comparison - Revenue Analytics",
      highlight: "Our VP of Sales mentioned that Competitor A has better integration with our CRM. How does your platform compare in terms of ease of use and third-party integrations? That's a key decision factor for us.",
    },
    {
      id: "comp3",
      company: "Growth Partners LLC",
      contact: "Mark Richardson",
      timestamp: "27:10",
      date: "Feb 23, 2026",
      meetingTitle: "Final Evaluation - Growth Partners",
      highlight: "We currently use Competitor A and are evaluating whether to switch. What's your migration process like? And be honest - what can you do that Competitor A can't? I need concrete differentiation to justify the switch.",
    },
  ],
  "Competitor B": [
    {
      id: "comp4",
      company: "TechFlow Systems",
      contact: "Rachel Green",
      timestamp: "41:15",
      date: "Feb 24, 2026",
      meetingTitle: "Platform Comparison - TechFlow",
      highlight: "Competitor B has a more user-friendly interface from what I've seen in demos. Our reps aren't super technical, so ease of use is critical. How does your platform stack up in terms of user experience and learning curve?",
    },
    {
      id: "comp5",
      company: "Sales Automation Pro",
      contact: "Kevin Martinez",
      timestamp: "16:50",
      date: "Feb 22, 2026",
      meetingTitle: "Feature Comparison - Sales Automation",
      highlight: "We're also evaluating Competitor B. They claim to have better AI capabilities. Can you walk me through your AI features and how they compare? That's really what we're after - intelligent automation.",
    },
  ],
  "Competitor C": [
    {
      id: "comp6",
      company: "Enterprise Sales Group",
      contact: "Patricia Johnson",
      timestamp: "29:30",
      date: "Feb 25, 2026",
      meetingTitle: "Enterprise Assessment - Sales Group",
      highlight: "Competitor C seems to have stronger enterprise features like advanced security and compliance controls. As a regulated industry player, that's non-negotiable for us. What enterprise-grade features do you offer?",
    },
  ],
  "Competitor D": [
    {
      id: "comp7",
      company: "Market Leaders Inc",
      contact: "Thomas Anderson",
      timestamp: "38:25",
      date: "Feb 23, 2026",
      meetingTitle: "Market Position Discussion - Market Leaders",
      highlight: "Competitor D is the market leader with proven track record. You're the challenger here. Why should we take a risk on a less established player? What's your edge? I need to sell this internally and market position matters.",
    },
  ],
};

const conversationMetrics = [
  { label: "Avg Talk-to-Listen Ratio", value: "43:57", change: "+5%", trend: "up", ideal: "40:60" },
  { label: "Avg Call Duration", value: "38 min", change: "+3 min", trend: "up", ideal: "35-45 min" },
  { label: "Question Rate", value: "12/call", change: "+2", trend: "up", ideal: "10-15" },
  { label: "Engagement Score", value: "84", change: "+6", trend: "up", ideal: "80+" },
];

const topTopics = [
  { topic: "Pricing", mentions: 156, sentiment: 0.65, trend: "up", change: "+12%" },
  { topic: "Implementation Timeline", mentions: 142, sentiment: 0.82, trend: "up", change: "+8%" },
  { topic: "Integration Capabilities", mentions: 128, sentiment: 0.78, trend: "neutral", change: "+2%" },
  { topic: "ROI & Value", mentions: 115, sentiment: 0.88, trend: "up", change: "+15%" },
  { topic: "Competitor Comparison", mentions: 94, sentiment: 0.55, trend: "down", change: "-5%" },
  { topic: "Support & Training", mentions: 87, sentiment: 0.92, trend: "up", change: "+10%" },
];

const objectionInsights = [
  {
    objection: "Price too high",
    frequency: 42,
    avgResolutionTime: "8 min",
    successRate: 68,
    topResponse: "ROI calculator & payment terms",
    trend: "improving",
  },
  {
    objection: "Need more features",
    frequency: 31,
    avgResolutionTime: "12 min",
    successRate: 75,
    topResponse: "Product roadmap & custom development",
    trend: "stable",
  },
  {
    objection: "Implementation concerns",
    frequency: 28,
    avgResolutionTime: "15 min",
    successRate: 82,
    topResponse: "Success stories & dedicated support",
    trend: "improving",
  },
  {
    objection: "Timing not right",
    frequency: 24,
    avgResolutionTime: "6 min",
    successRate: 45,
    topResponse: "Pilot program & flexible start dates",
    trend: "declining",
  },
];

const competitorMentions = [
  { name: "Competitor A", mentions: 67, winRate: 72, sentiment: -0.3, commonComparison: "Pricing vs Features" },
  { name: "Competitor B", mentions: 54, winRate: 65, sentiment: -0.2, commonComparison: "Ease of use" },
  { name: "Competitor C", mentions: 42, winRate: 78, sentiment: -0.4, commonComparison: "Enterprise features" },
  { name: "Competitor D", mentions: 31, winRate: 58, sentiment: -0.1, commonComparison: "Market position" },
];

const aiRecommendations = [
  {
    type: "Coaching Opportunity",
    icon: Award,
    color: "purple",
    title: "Improve objection handling for pricing concerns",
    description: "Reps taking 30% longer than top performers to handle pricing objections",
    action: "Review top performer calls",
    impact: "High",
  },
  {
    type: "Deal Risk",
    icon: AlertCircle,
    color: "red",
    title: "3 deals showing low engagement patterns",
    description: "DataFlow, CloudVista, and NexTech calls below engagement threshold",
    action: "Schedule urgent follow-ups",
    impact: "Critical",
  },
  {
    type: "Win Pattern",
    icon: CheckCircle2,
    color: "green",
    title: "Strong ROI discussions correlate with 85% win rate",
    description: "Deals with ROI calculator demo have highest close rates",
    action: "Make ROI demo standard",
    impact: "High",
  },
  {
    type: "Product Insight",
    icon: Zap,
    color: "blue",
    title: "API integration is top buying criteria",
    description: "Mentioned in 78% of won deals vs 32% of lost deals",
    action: "Lead with API capabilities",
    impact: "Medium",
  },
];

const performanceByStage = [
  { stage: "Discovery", calls: 142, avgScore: 82, conversionRate: 68 },
  { stage: "Demo", calls: 118, avgScore: 85, conversionRate: 72 },
  { stage: "Proposal", calls: 94, avgScore: 88, conversionRate: 78 },
  { stage: "Negotiation", calls: 67, avgScore: 86, conversionRate: 82 },
];

// Detailed conversation analysis data
const talkPatterns = [
  { speaker: "You (Rep)", talkTime: 42, color: "bg-blue-600", questions: 18, avgMonologue: "45s", interruptions: 3 },
  { speaker: "Prospect", talkTime: 58, color: "bg-green-600", questions: 12, avgMonologue: "1m 22s", interruptions: 2 },
];

const fillerWords = [
  { word: "um", count: 24, perMinute: 0.6, trend: "down", change: "-15%" },
  { word: "uh", count: 18, perMinute: 0.5, trend: "down", change: "-22%" },
  { word: "like", count: 15, perMinute: 0.4, trend: "stable", change: "+2%" },
  { word: "you know", count: 12, perMinute: 0.3, trend: "down", change: "-10%" },
  { word: "so", count: 31, perMinute: 0.8, trend: "stable", change: "+5%" },
];

const questionTypes = [
  { type: "Open-Ended", count: 142, percentage: 68, examples: ["Tell me about your current workflow", "What challenges are you facing?"], effectiveness: 92 },
  { type: "Closed-Ended", count: 52, percentage: 25, examples: ["Do you have budget approved?", "Is that correct?"], effectiveness: 78 },
  { type: "Hypothetical", count: 14, percentage: 7, examples: ["If you could solve one problem, what would it be?"], effectiveness: 88 },
];

const sentimentTrend = [
  { timeSegment: "0-25%", sentiment: 72, engagement: 68, label: "Opening" },
  { timeSegment: "25-50%", sentiment: 85, engagement: 82, label: "Discovery" },
  { timeSegment: "50-75%", sentiment: 91, engagement: 88, label: "Value Prop" },
  { timeSegment: "75-100%", sentiment: 78, engagement: 75, label: "Next Steps" },
];

const actionItemsTracking = [
  { item: "Send security documentation", assignedTo: "You", status: "completed", dueDate: "Feb 27", company: "CloudVista" },
  { item: "Schedule CEO briefing", assignedTo: "Prospect", status: "pending", dueDate: "Mar 1", company: "TechStart" },
  { item: "Provide ROI calculator", assignedTo: "You", status: "in-progress", dueDate: "Feb 28", company: "Acme Corp" },
  { item: "Review contract terms", assignedTo: "Legal Team", status: "pending", dueDate: "Mar 3", company: "DataFlow" },
];

const talkTracks = [
  { track: "Discovery Questions", adherence: 88, used: 15, total: 17, impact: "High" },
  { track: "Value Proposition", adherence: 92, used: 11, total: 12, impact: "High" },
  { track: "Objection Handling", adherence: 75, used: 6, total: 8, impact: "Medium" },
  { track: "Closing Techniques", adherence: 82, used: 9, total: 11, impact: "High" },
];

const engagementSignals = [
  { signal: "Positive Verbal Cues", count: 47, examples: ["That sounds great", "Exactly what we need", "I love that"], sentiment: 0.95 },
  { signal: "Negative Verbal Cues", count: 8, examples: ["That's concerning", "Not sure about", "Expensive"], sentiment: 0.25 },
  { signal: "Questions from Prospect", count: 23, examples: ["How does integration work?", "What about security?"], sentiment: 0.82 },
  { signal: "Agreement Markers", count: 34, examples: ["Yes", "Right", "Absolutely"], sentiment: 0.88 },
];

export function Insights() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedObjection, setSelectedObjection] = useState<string | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const userRole = localStorage.getItem("userRole") || "rep";

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return "text-green-600 bg-green-50";
    if (sentiment >= 0.4) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up" || trend === "improving") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "down" || trend === "declining") return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <ArrowUp className="w-4 h-4 text-gray-400" />;
  };

  // Determine which drill-down panel to show and what calls to display
  const selectedCalls = selectedTopic 
    ? (topicCallMentions[selectedTopic] || []) 
    : selectedObjection 
    ? (objectionCallMentions[selectedObjection] || [])
    : selectedCompetitor
    ? (competitorCallMentions[selectedCompetitor] || [])
    : [];
  
  const selectedItem = selectedTopic || selectedObjection || selectedCompetitor;
  const selectedType = selectedTopic ? 'topic' : selectedObjection ? 'objection' : 'competitor';

  return (
    <div className="flex-1 bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Conversation Insights</h1>
              <p className="text-sm text-gray-600 mt-1">
                AI-powered analytics across your conversations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                Filter Period
              </Button>
              <Link to={`/${userRole}/insights/export`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-7 text-xs">
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                  Export Report
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b-0 h-auto p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="conversation"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
              >
                Conversation Analysis
              </TabsTrigger>
              <TabsTrigger
                value="topics"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
              >
                Topics & Themes
              </TabsTrigger>
              <TabsTrigger
                value="objections"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
              >
                Objections
              </TabsTrigger>
              <TabsTrigger
                value="competitors"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
              >
                Competitive Intel
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <Tabs value={activeTab}>
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            {/* Key Metrics */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation Metrics</h2>
              <div className="grid grid-cols-4 gap-4">
                {conversationMetrics.map((metric, index) => (
                  <Card key={index} className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <p className="text-sm text-gray-600 mt-1">{metric.label}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          metric.trend === "up"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {metric.trend === "up" ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                        {metric.change}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">Ideal: {metric.ideal}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {aiRecommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <Card key={index} className="p-5 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-${rec.color}-100 flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 text-${rec.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {rec.type}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                rec.impact === "Critical"
                                  ? "bg-red-100 text-red-700"
                                  : rec.impact === "High"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {rec.impact} Impact
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                          <Button size="sm" variant="outline" className="w-full">
                            {rec.action}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Performance by Stage */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance by Deal Stage</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  {performanceByStage.map((stage, index) => (
                    <div key={index} className="flex items-center gap-6">
                      <div className="w-32">
                        <p className="font-medium text-gray-900">{stage.stage}</p>
                        <p className="text-sm text-gray-600">{stage.calls} calls</p>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Avg Score</span>
                            <span className="text-sm font-semibold text-gray-900">{stage.avgScore}</span>
                          </div>
                          <Progress value={stage.avgScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Conversion</span>
                            <span className="text-sm font-semibold text-gray-900">{stage.conversionRate}%</span>
                          </div>
                          <Progress value={stage.conversionRate} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Conversation Analysis Tab */}
          <TabsContent value="conversation" className="mt-0 space-y-6">
            {/* Talk Patterns Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mic className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Talk Patterns & Speaking Dynamics</h2>
              </div>
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Talk Time Visualization */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Talk-to-Listen Ratio</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="bg-blue-600 h-full flex items-center justify-center text-white text-xs font-semibold" style={{ width: '42%' }}>
                          You: 42%
                        </div>
                        <div className="bg-green-600 h-full flex items-center justify-center text-white text-xs font-semibold" style={{ width: '58%' }}>
                          Prospect: 58%
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {talkPatterns.map((pattern, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">{pattern.speaker}</span>
                            <Badge className={`text-xs px-2 py-0.5 ${pattern.speaker.includes('Rep') ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                              {pattern.talkTime}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div>
                              <div className="text-gray-600 mb-1">Questions</div>
                              <div className="font-semibold text-gray-900">{pattern.questions}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Avg Monologue</div>
                              <div className="font-semibold text-gray-900">{pattern.avgMonologue}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Interruptions</div>
                              <div className="font-semibold text-gray-900">{pattern.interruptions}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filler Words Analysis */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filler Words & Speaking Quality</h2>
              </div>
              <Card className="p-6">
                <div className="space-y-3">
                  {fillerWords.map((word, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2">
                      <div className="w-24">
                        <span className="text-sm font-mono font-semibold text-gray-900">&quot;{word.word}&quot;</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{word.count} times</span>
                            <span className="text-xs text-gray-500">({word.perMinute}/min)</span>
                          </div>
                          <Badge className={`text-xs px-2 py-0.5 ${
                            word.trend === 'down' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {word.trend === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                            {word.change}
                          </Badge>
                        </div>
                        <Progress value={(word.count / 50) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Question Types Breakdown */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Question Types & Effectiveness</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {questionTypes.map((type, idx) => (
                  <Card key={idx} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">{type.type}</h3>
                      <Badge className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700">
                        {type.effectiveness}% effective
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{type.count}</div>
                    <div className="text-xs text-gray-600 mb-3">{type.percentage}% of all questions</div>
                    <Progress value={type.percentage} className="h-2 mb-4" />
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700">Examples:</div>
                      {type.examples.map((example, exIdx) => (
                        <div key={exIdx} className="text-xs text-gray-600 italic bg-gray-50 rounded px-2 py-1.5">
                          &quot;{example}&quot;
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sentiment Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Sentiment & Engagement Throughout Call</h2>
              </div>
              <Card className="p-6">
                <div className="space-y-4">
                  {sentimentTrend.map((segment, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">{segment.label}</span>
                          <span className="text-xs text-gray-600">{segment.timeSegment}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Heart className={`w-4 h-4 ${segment.sentiment >= 85 ? 'text-green-600' : segment.sentiment >= 70 ? 'text-yellow-600' : 'text-gray-400'}`} />
                            <span className="text-sm font-semibold text-gray-900">{segment.sentiment}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className={`w-4 h-4 ${segment.engagement >= 85 ? 'text-green-600' : segment.engagement >= 70 ? 'text-yellow-600' : 'text-gray-400'}`} />
                            <span className="text-sm font-semibold text-gray-900">{segment.engagement}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <span className="text-gray-600">Sentiment</span>
                            <span className={`font-semibold ${segment.sentiment >= 85 ? 'text-green-600' : segment.sentiment >= 70 ? 'text-yellow-600' : 'text-gray-600'}`}>
                              {segment.sentiment >= 85 ? 'Positive' : segment.sentiment >= 70 ? 'Neutral' : 'Negative'}
                            </span>
                          </div>
                          <Progress value={segment.sentiment} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <span className="text-gray-600">Engagement</span>
                            <span className={`font-semibold ${segment.engagement >= 85 ? 'text-green-600' : segment.engagement >= 70 ? 'text-yellow-600' : 'text-gray-600'}`}>
                              {segment.engagement >= 85 ? 'High' : segment.engagement >= 70 ? 'Medium' : 'Low'}
                            </span>
                          </div>
                          <Progress value={segment.engagement} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Action Items Tracking */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Action Items Extracted from Conversations</h2>
              </div>
              <Card className="p-6">
                <div className="space-y-3">
                  {actionItemsTracking.map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-4 rounded-lg border ${
                      item.status === 'completed' ? 'bg-green-50 border-green-200' :
                      item.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex-shrink-0">
                        {item.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : item.status === 'in-progress' ? (
                          <Timer className="w-5 h-5 text-blue-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${
                            item.status === 'completed' ? 'text-gray-700 line-through' : 'text-gray-900'
                          }`}>
                            {item.item}
                          </span>
                          <Badge className="text-xs px-2 py-0.5 bg-white border border-gray-200">
                            {item.company}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>Assigned to: <span className="font-medium">{item.assignedTo}</span></span>
                          <span>•</span>
                          <span>Due: <span className="font-medium">{item.dueDate}</span></span>
                        </div>
                      </div>
                      <Badge className={`text-xs px-2 py-0.5 ${
                        item.status === 'completed' ? 'bg-green-100 text-green-700' :
                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {item.status === 'completed' ? 'Completed' :
                         item.status === 'in-progress' ? 'In Progress' :
                         'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Talk Track Adherence */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Workflow className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Talk Track & Playbook Adherence</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {talkTracks.map((track, idx) => (
                  <Card key={idx} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">{track.track}</h3>
                      <Badge className={`text-xs px-2 py-0.5 ${
                        track.adherence >= 85 ? 'bg-green-100 text-green-700' :
                        track.adherence >= 70 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {track.impact} Impact
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-bold text-gray-900">{track.adherence}%</span>
                      <span className="text-sm text-gray-600">adherence</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <span>Used: <span className="font-semibold text-gray-900">{track.used}/{track.total}</span></span>
                      <span>{track.used === track.total ? '✓ Complete' : `${track.total - track.used} missed`}</span>
                    </div>
                    <Progress value={track.adherence} className="h-2" />
                  </Card>
                ))}
              </div>
            </div>

            {/* Engagement Signals */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Customer Engagement Signals</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {engagementSignals.map((signal, idx) => (
                  <Card key={idx} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">{signal.signal}</h3>
                      <Badge className={`text-xs px-2 py-0.5 ${getSentimentColor(signal.sentiment)}`}>
                        {Math.round(signal.sentiment * 100)}%
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-4">{signal.count}</div>
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700">Examples:</div>
                      {signal.examples.slice(0, 2).map((example, exIdx) => (
                        <div key={exIdx} className="text-xs text-gray-600 italic bg-gray-50 rounded px-2 py-1.5">
                          &quot;{example}&quot;
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Topics Tab */}
          <TabsContent value="topics" className="mt-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics Across Conversations</h2>
              <div className="space-y-3">
                {topTopics.map((topic, index) => (
                  <Card 
                    key={index} 
                    className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedObjection(null);
                      setSelectedCompetitor(null);
                      setSelectedTopic(topic.topic);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{topic.topic}</h3>
                          <Badge variant="outline" className="text-xs">
                            {topic.mentions} mentions
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              topic.trend === "up"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : topic.trend === "down"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            {getTrendIcon(topic.trend)}
                            {topic.change}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Sentiment Score</span>
                              <span className={`text-sm font-semibold ${getSentimentColor(topic.sentiment).split(' ')[0]}`}>
                                {(topic.sentiment * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={topic.sentiment * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Frequency</span>
                              <span className="text-sm font-semibold text-gray-900">{topic.mentions}</span>
                            </div>
                            <Progress value={(topic.mentions / 160) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Objections Tab */}
          <TabsContent value="objections" className="mt-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Objections & Resolution Patterns</h2>
              <div className="space-y-3">
                {objectionInsights.map((obj, index) => (
                  <Card 
                    key={index} 
                    className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTopic(null);
                      setSelectedCompetitor(null);
                      setSelectedObjection(obj.objection);
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{obj.objection}</h3>
                            <Badge variant="outline" className="text-xs">
                              {obj.frequency} occurrences
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                obj.trend === "improving"
                                  ? "bg-green-100 text-green-700"
                                  : obj.trend === "declining"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {obj.trend}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            <strong>Top Response:</strong> {obj.topResponse}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-gray-600 mb-2">Success Rate</div>
                          <div className="flex items-center gap-2">
                            <Progress value={obj.successRate} className="h-2 flex-1" />
                            <span className="text-sm font-semibold text-gray-900">{obj.successRate}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-2">Avg Resolution Time</div>
                          <div className="text-sm font-semibold text-gray-900">{obj.avgResolutionTime}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-2">Frequency Trend</div>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(obj.trend)}
                            <span className="text-sm font-medium text-gray-900">{obj.trend}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="mt-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Competitive Intelligence from Calls</h2>
              <div className="space-y-3">
                {competitorMentions.map((comp, index) => (
                  <Card 
                    key={index} 
                    className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTopic(null);
                      setSelectedObjection(null);
                      setSelectedCompetitor(comp.name);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{comp.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {comp.mentions} mentions
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              comp.winRate >= 70
                                ? "bg-green-100 text-green-700"
                                : comp.winRate >= 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {comp.winRate}% win rate
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Common Comparison:</strong> {comp.commonComparison}
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Our Win Rate vs {comp.name}</span>
                              <span className="text-sm font-semibold text-gray-900">{comp.winRate}%</span>
                            </div>
                            <Progress value={comp.winRate} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Mention Frequency</span>
                              <span className="text-sm font-semibold text-gray-900">{comp.mentions}</span>
                            </div>
                            <Progress value={(comp.mentions / 70) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>

      {/* Drill-Down Side Panel for Topics, Objections, and Competitors */}
      {selectedItem && (
        <div className="w-[500px] bg-white border-l border-gray-200 flex flex-col shadow-xl">
          {/* Panel Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedItem}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedType === 'topic' ? 'Topic' : selectedType === 'objection' ? 'Objection' : 'Competitor'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTopic(null);
                  setSelectedObjection(null);
                  setSelectedCompetitor(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {selectedCalls.length} conversations as per applied filters
            </p>
          </div>

          {/* Call List */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 space-y-4">
              {selectedCalls.map((call, idx) => (
                <div key={call.id} className="pb-4 border-b border-gray-200 last:border-b-0">
                  {/* Call Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">{call.contact}</span>
                    <span className="text-xs text-gray-500">{call.date}</span>
                    <Badge className="ml-auto text-xs px-2 py-0.5 bg-blue-100 text-blue-700 border-blue-200">
                      {call.timestamp}
                    </Badge>
                  </div>

                  {/* Meeting Title */}
                  <div className="text-xs text-gray-600 mb-2">{call.meetingTitle}</div>

                  {/* Highlighted Quote */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 px-3 py-2.5 mb-3">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {selectedItem && call.highlight.split(new RegExp(`(${selectedItem})`, 'gi')).map((part, i) => (
                        <span key={i}>
                          {part.toLowerCase() === selectedItem.toLowerCase() ? (
                            <span className="bg-yellow-200 font-semibold px-0.5">{part}</span>
                          ) : (
                            part
                          )}
                        </span>
                      ))}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Play className="w-3 h-3 mr-1" />
                      Play at {call.timestamp}
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      View Transcript
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}