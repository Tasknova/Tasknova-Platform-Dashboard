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
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const pipelineStages = [
  {
    id: "discovery",
    name: "Discovery",
    deals: 12,
    value: 1450000,
    color: "bg-blue-600",
  },
  {
    id: "demo",
    name: "Demo",
    deals: 8,
    value: 980000,
    color: "bg-purple-600",
  },
  {
    id: "proposal",
    name: "Proposal",
    deals: 6,
    value: 720000,
    color: "bg-orange-600",
  },
  {
    id: "negotiation",
    name: "Negotiation",
    deals: 5,
    value: 620000,
    color: "bg-green-600",
  },
  {
    id: "closed-won",
    name: "Closed Won",
    deals: 14,
    value: 1820000,
    color: "bg-emerald-600",
  },
];

const deals = [
  {
    id: "1",
    company: "TechCorp Enterprise",
    rep: "Taylor Brooks",
    avatar: "TB",
    value: 498000,
    stage: "Negotiation",
    closeDate: "Mar 15, 2026",
    probability: 90,
    lastActivity: "2 hours ago",
    health: "good",
    nextStep: "Contract review with legal",
  },
  {
    id: "2",
    company: "Acme Corp",
    rep: "Alex Rivera",
    avatar: "AR",
    value: 85000,
    stage: "Demo",
    closeDate: "Mar 22, 2026",
    probability: 60,
    lastActivity: "1 day ago",
    health: "good",
    nextStep: "Technical deep dive scheduled",
  },
  {
    id: "3",
    company: "DataFlow Systems",
    rep: "Casey Johnson",
    avatar: "CJ",
    value: 125000,
    stage: "Negotiation",
    closeDate: "Mar 15, 2026",
    probability: 40,
    lastActivity: "10 days ago",
    health: "at-risk",
    nextStep: "Re-engage with champion",
  },
  {
    id: "4",
    company: "GlobalTech Inc",
    rep: "Morgan Smith",
    avatar: "MS",
    value: 95000,
    stage: "Proposal",
    closeDate: "Mar 20, 2026",
    probability: 50,
    lastActivity: "3 days ago",
    health: "warning",
    nextStep: "Address pricing concerns",
  },
  {
    id: "5",
    company: "TechStart",
    rep: "Alex Rivera",
    avatar: "AR",
    value: 125000,
    stage: "Demo",
    closeDate: "Mar 28, 2026",
    probability: 70,
    lastActivity: "4 hours ago",
    health: "good",
    nextStep: "Executive briefing next week",
  },
  {
    id: "6",
    company: "Innovate Labs",
    rep: "Jordan Lee",
    avatar: "JL",
    value: 180000,
    stage: "Discovery",
    closeDate: "Apr 5, 2026",
    probability: 50,
    lastActivity: "1 day ago",
    health: "good",
    nextStep: "CEO approval needed",
  },
  {
    id: "7",
    company: "CloudVista",
    rep: "Sam Taylor",
    avatar: "ST",
    value: 145000,
    stage: "Discovery",
    closeDate: "Mar 30, 2026",
    probability: 65,
    lastActivity: "Yesterday",
    health: "good",
    nextStep: "Security documentation review",
  },
  {
    id: "8",
    company: "Summit Group",
    rep: "Riley Chen",
    avatar: "RC",
    value: 250000,
    stage: "Proposal",
    closeDate: "Mar 18, 2026",
    probability: 85,
    lastActivity: "3 hours ago",
    health: "good",
    nextStep: "Final approval from CEO",
  },
];

export function ManagerPipeline() {
  const totalDeals = pipelineStages.reduce((sum, stage) => sum + stage.deals, 0);
  const totalValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0);

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
                <h1 className="text-lg font-semibold text-gray-900">Team Pipeline</h1>
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
              <Link to="/manager/forecast">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                  <Target className="w-4 h-4 mr-2" />
                  View Forecast
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6">
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
                  ${(stage.value / 1000000).toFixed(1)}M
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
                <span className="text-xs text-gray-600">Healthy Deals</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">28</div>
              <p className="text-xs text-gray-600 mt-1">Active engagement</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Need Attention</span>
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">7</div>
              <p className="text-xs text-gray-600 mt-1">Low activity</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">At Risk</span>
                <Clock className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-xs text-gray-600 mt-1">Stalled deals</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Avg Deal Size</span>
                <DollarSign className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${(totalValue / totalDeals / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-gray-600 mt-1">Across all stages</p>
            </div>
          </div>
        </section>

        {/* All Deals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">All Deals</h2>
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
            {deals.map((deal) => (
              <div
                key={deal.id}
                className={`bg-white rounded-lg p-5 hover:shadow-md transition-all border-l-4 ${
                  deal.health === "at-risk"
                    ? "border-l-red-500 border-t border-r border-b border-red-200"
                    : deal.health === "warning"
                    ? "border-l-orange-500 border-t border-r border-b border-orange-200"
                    : "border-l-green-500 border-t border-r border-b border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">{deal.company}</h3>
                      <Badge
                        className={
                          deal.health === "at-risk"
                            ? "bg-red-100 text-red-700 border-red-200 text-xs px-2 py-0.5 h-5"
                            : deal.health === "warning"
                            ? "bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5 h-5"
                            : "bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 h-5"
                        }
                      >
                        {deal.health === "at-risk" ? "At Risk" : deal.health === "warning" ? "Needs Attention" : "Healthy"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-6 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Rep</div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                            {deal.avatar}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{deal.rep}</span>
                        </div>
                      </div>
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

                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <ChevronRight className="w-3 h-3" />
                      <span className="font-medium">Next Step:</span>
                      <span>{deal.nextStep}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    View Deal
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
