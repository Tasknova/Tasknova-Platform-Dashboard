import { Link } from "react-router";
import {
  ArrowLeft,
  Filter,
  Search,
  Building2,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const pipelineStages = [
  {
    id: "discovery",
    name: "Discovery",
    deals: 3,
    value: 255000,
    color: "bg-blue-600",
  },
  {
    id: "demo",
    name: "Demo",
    deals: 2,
    value: 210000,
    color: "bg-purple-600",
  },
  {
    id: "proposal",
    name: "Proposal",
    deals: 1,
    value: 210000,
    color: "bg-orange-600",
  },
  {
    id: "negotiation",
    name: "Negotiation",
    deals: 1,
    value: 45000,
    color: "bg-green-600",
  },
  {
    id: "closed-won",
    name: "Closed Won",
    deals: 4,
    value: 498000,
    color: "bg-emerald-600",
  },
];

const myDeals = [
  {
    id: "1",
    company: "TechStart",
    value: 125000,
    stage: "Demo",
    closeDate: "Mar 28, 2026",
    probability: 70,
    lastActivity: "4 hours ago",
    health: "good",
    nextStep: "Executive briefing with CEO next week",
    contact: "Michael Chen, VP Engineering",
    aiInsight: "High engagement score (89%). Stakeholder mapping shows 4 active champions. On track for close.",
  },
  {
    id: "2",
    company: "Acme Corp",
    value: 85000,
    stage: "Demo",
    closeDate: "Mar 22, 2026",
    probability: 60,
    lastActivity: "1 day ago",
    health: "good",
    nextStep: "Technical deep dive scheduled for tomorrow",
    contact: "Sarah Johnson, CFO",
    aiInsight: "Budget confirmed at $85K. Security compliance is key decision criteria. Prepare technical documentation.",
  },
  {
    id: "3",
    company: "GlobalTech",
    value: 45000,
    stage: "Negotiation",
    closeDate: "Mar 20, 2026",
    probability: 50,
    lastActivity: "3 days ago",
    health: "warning",
    nextStep: "Address pricing concerns - competitor in play",
    contact: "Emma Davis, Director of Sales",
    aiInsight: "Pricing objection detected. Recommend ROI calculator demo and case study from similar customer.",
  },
  {
    id: "4",
    company: "DataFlow",
    value: 210000,
    stage: "Proposal",
    closeDate: "Mar 25, 2026",
    probability: 85,
    lastActivity: "2 hours ago",
    health: "good",
    nextStep: "Legal review of contract terms",
    contact: "James Wilson, CTO",
    aiInsight: "Strong champion engagement. Multi-threading with 5 stakeholders. Contract negotiations going well.",
  },
  {
    id: "5",
    company: "CloudVista",
    value: 145000,
    stage: "Discovery",
    closeDate: "Mar 30, 2026",
    probability: 65,
    lastActivity: "Yesterday",
    health: "good",
    nextStep: "Send security documentation",
    contact: "David Brown, VP Operations",
    aiInsight: "Budget approved for Q2 ($145K). Security compliance is top priority. Decision timeline: 3-4 weeks.",
  },
  {
    id: "6",
    company: "Innovate Labs",
    value: 180000,
    stage: "Discovery",
    closeDate: "Apr 5, 2026",
    probability: 50,
    lastActivity: "2 days ago",
    health: "warning",
    nextStep: "Schedule CEO meeting - approval required",
    contact: "Lisa Martinez, Director",
    aiInsight: "Impressed with AI capabilities but concerned about implementation time. Need executive buy-in.",
  },
];

export function RepPipeline() {
  const totalDeals = pipelineStages.reduce((sum, stage) => sum + stage.deals, 0);
  const totalValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0);
  const healthyDeals = myDeals.filter((d) => d.health === "good").length;
  const warningDeals = myDeals.filter((d) => d.health === "warning").length;

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
                <h1 className="text-lg font-semibold text-gray-900">My Pipeline</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {totalDeals} active deals • ${(totalValue / 1000000).toFixed(1)}M total value
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  className="h-8 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Link to="/rep/compose-email?type=pipeline-report">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                  <Target className="w-4 h-4 mr-2" />
                  Share Pipeline
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6 max-w-[1400px]">
        {/* Pipeline Overview */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Pipeline by Stage</h2>
          <div className="grid grid-cols-5 gap-4">
            {pipelineStages.map((stage) => (
              <div key={stage.id} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                  <span className="text-xs text-gray-600">{stage.deals} deals</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{stage.name}</h3>
                <div className="text-xl font-bold text-gray-900">
                  ${(stage.value / 1000).toFixed(0)}K
                </div>
                <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-full`}
                    style={{ width: `${(stage.value / totalValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pipeline Health */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Pipeline Health</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Total Pipeline</span>
                <DollarSign className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${(totalValue / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-gray-600 mt-1">{totalDeals} active deals</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Healthy Deals</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{healthyDeals}</div>
              <p className="text-xs text-gray-600 mt-1">On track</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Need Attention</span>
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{warningDeals}</div>
              <p className="text-xs text-gray-600 mt-1">Review needed</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Avg Deal Size</span>
                <Target className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${(totalValue / totalDeals / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-gray-600 mt-1">This quarter</p>
            </div>
          </div>
        </section>

        {/* All Deals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">My Deals</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                Sort by Value
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                Sort by Close Date
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {myDeals.map((deal) => (
              <div
                key={deal.id}
                className={`bg-white rounded-lg p-5 hover:shadow-md transition-all border-l-4 ${
                  deal.health === "warning"
                    ? "border-l-orange-500 border-t border-r border-b border-orange-200"
                    : "border-l-green-500 border-t border-r border-b border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        to={`/rep/customers/${deal.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {deal.company}
                      </Link>
                      <Badge
                        className={
                          deal.health === "warning"
                            ? "bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5 h-5"
                            : "bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5"
                        }
                      >
                        {deal.health === "warning" ? "Needs Attention" : "Healthy"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-5 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Value</div>
                        <div className="text-sm font-semibold text-gray-900">
                          ${(deal.value / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Stage</div>
                        <div className="text-sm text-gray-900">{deal.stage}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Close Date</div>
                        <div className="text-sm text-gray-900">{deal.closeDate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Probability</div>
                        <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                          {deal.probability}%
                        </Badge>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Last Activity</div>
                        <div className="text-sm text-gray-900">{deal.lastActivity}</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-600 mb-1">Contact</div>
                      <div className="text-sm text-gray-900">{deal.contact}</div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <ChevronRight className="w-3 h-3" />
                      <span className="font-medium">Next Step:</span>
                      <span>{deal.nextStep}</span>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-purple-900 mb-1">AI Insight</div>
                          <div className="text-xs text-purple-800">{deal.aiInsight}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="h-8 text-xs ml-4">
                    View Details
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
