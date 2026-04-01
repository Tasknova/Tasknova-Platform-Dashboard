import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ChevronDown,
  X,
  Settings,
  ArrowUp,
  ArrowDown,
  Target,
  AlertTriangle,
  MessageSquare,
  Building2,
  ClipboardList,
  Calendar,
  DollarSign,
  Sparkles,
  Phone,
  Mail,
  Info,
  Send,
  Users,
  ExternalLink,
  Copy,
  Clock,
  Filter,
  Search,
  Grid3x3,
  List,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { deals } from "../../data/deals-data";

// Calculate stage totals
const calculateStageTotals = () => {
  const allDeals = deals;
  const openDeals = deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));
  const closedWon = deals.filter(d => d.stage === "Closed Won");
  const closedLost = deals.filter(d => d.stage === "Closed Lost");
  const commit = deals.filter(d => d.stage === "Negotiation");
  const pipeline = deals.filter(d => ["Qualified", "Discovery", "Demo", "Proposal"].includes(d.stage));
  const atRisk = deals.filter(d => d.health < 60 || d.momentum === "stalled");

  return {
    allDeals: { value: allDeals.reduce((sum, d) => sum + d.value, 0), count: allDeals.length },
    openDeals: { value: openDeals.reduce((sum, d) => sum + d.value, 0), count: openDeals.length },
    closedWon: { value: closedWon.reduce((sum, d) => sum + d.value, 0), count: closedWon.length },
    closedLost: { value: closedLost.reduce((sum, d) => sum + d.value, 0), count: closedLost.length },
    commit: { value: commit.reduce((sum, d) => sum + d.value, 0), count: commit.length },
    pipeline: { value: pipeline.reduce((sum, d) => sum + d.value, 0), count: pipeline.length },
    atRisk: { value: atRisk.reduce((sum, d) => sum + d.value, 0), count: atRisk.length },
  };
};

const stageTotals = calculateStageTotals();

const stageViews = [
  { id: "all", label: "All Deals", value: stageTotals.allDeals.value, count: stageTotals.allDeals.count },
  { id: "open", label: "Open Deals", value: stageTotals.openDeals.value, count: stageTotals.openDeals.count },
  { id: "won", label: "Closed Won", value: stageTotals.closedWon.value, count: stageTotals.closedWon.count },
  { id: "lost", label: "Closed Lost", value: stageTotals.closedLost.value, count: stageTotals.closedLost.count },
  { id: "commit", label: "Commit", value: stageTotals.commit.value, count: stageTotals.commit.count },
  { id: "pipeline", label: "Pipeline", value: stageTotals.pipeline.value, count: stageTotals.pipeline.count },
  { id: "at-risk", label: "At Risk", value: stageTotals.atRisk.value, count: stageTotals.atRisk.count },
];

export function Deals() {
  const [activeView, setActiveView] = useState("open");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [dealPanelTab, setDealPanelTab] = useState("brief");
  const [aiQuestion, setAiQuestion] = useState("");
  const [showAiChat, setShowAiChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userRole = localStorage.getItem("userRole") || "rep";
  const navigate = useNavigate();
  const params = useParams();

  // Handle URL params to open specific deal
  useEffect(() => {
    if (params.id) {
      const deal = deals.find(d => d.id === params.id);
      if (deal) {
        setSelectedDeal(deal);
        setDealPanelTab("brief");
        setShowAiChat(false);
      }
    }
  }, [params.id]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const getRiskScore = (health: number) => {
    return 100 - health;
  };

  const getRiskScoreStyle = (score: number) => {
    if (score >= 60) return "bg-red-100 text-red-700 border border-red-300";
    if (score >= 40) return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    return "bg-green-100 text-green-700 border border-green-300";
  };

  const getEngagementDots = (deal: any) => {
    const dots = [];
    
    // Blue dots for meetings
    const meetingCount = Math.min(deal.meetings || 0, 5);
    for (let i = 0; i < meetingCount; i++) {
      dots.push("bg-blue-500");
    }
    
    // Orange/Red dots for calls
    const callCount = Math.min(Math.floor((deal.contacts || 0) / 2), 3);
    for (let i = 0; i < callCount; i++) {
      dots.push("bg-orange-500");
    }
    
    // Cyan dots for emails  
    const emailCount = Math.min(Math.floor((deal.probability || 0) / 25), 3);
    for (let i = 0; i < emailCount; i++) {
      dots.push("bg-cyan-500");
    }

    // Yellow dot for proposals
    if (deal.stage === "Proposal" || deal.stage === "Negotiation") {
      dots.push("bg-yellow-500");
    }

    return dots;
  };

  const getFilteredDeals = () => {
    let filtered = [...deals];

    switch(activeView) {
      case "all":
        filtered = deals;
        break;
      case "open":
        filtered = deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));
        break;
      case "won":
        filtered = deals.filter(d => d.stage === "Closed Won");
        break;
      case "lost":
        filtered = deals.filter(d => d.stage === "Closed Lost");
        break;
      case "commit":
        filtered = deals.filter(d => d.stage === "Negotiation");
        break;
      case "pipeline":
        filtered = deals.filter(d => ["Qualified", "Discovery", "Demo", "Proposal"].includes(d.stage));
        break;
      case "at-risk":
        filtered = deals.filter(d => d.health < 60 || d.momentum === "stalled");
        break;
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(deal => 
        deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredDeals = getFilteredDeals();

  const isOverdue = (closeDate: string) => {
    return closeDate.includes("2022") || closeDate.includes("2023") || 
           (closeDate.includes("Jan") || closeDate.includes("Feb")) && closeDate.includes("2024");
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      "Lead": "bg-gray-100 text-gray-700",
      "Qualified": "bg-blue-100 text-blue-700",
      "Discovery": "bg-cyan-100 text-cyan-700",
      "Demo": "bg-purple-100 text-purple-700",
      "Proposal": "bg-orange-100 text-orange-700",
      "Negotiation": "bg-yellow-100 text-yellow-700",
      "Closed Won": "bg-green-100 text-green-700",
      "Closed Lost": "bg-red-100 text-red-700",
    };
    return colors[stage] || "bg-gray-100 text-gray-700";
  };

  const getMomentumIcon = (momentum: string) => {
    if (momentum === "positive") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (momentum === "negative") return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your sales pipeline and track deal progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Pipeline</span>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stageTotals.openDeals.value)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">12.5%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Open Deals</span>
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stageTotals.openDeals.count}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-600">Avg:</span>
              <span className="text-gray-900 font-medium">
                {formatCurrency(Math.round(stageTotals.openDeals.value / stageTotals.openDeals.count))}
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Closed Won</span>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stageTotals.closedWon.value)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-600">{stageTotals.closedWon.count} deals</span>
              <span className="text-gray-400">•</span>
              <span className="text-green-600 font-medium">42% win rate</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">At Risk</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stageTotals.atRisk.count}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-600">Value:</span>
              <span className="text-red-600 font-medium">
                {formatCurrency(stageTotals.atRisk.value)}
              </span>
            </div>
          </div>
        </div>

        {/* View Tabs and Controls */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
            <div className="flex items-center gap-6">
              {stageViews.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`
                    pb-1 text-sm font-medium transition-colors relative
                    ${activeView === view.id 
                      ? "text-blue-600" 
                      : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                >
                  {view.label}
                  {activeView === view.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search deals..."
                  className="pl-9 h-9 w-64 bg-gray-50 border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                  title="Grid view"
                >
                  <Grid3x3 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* List View */}
          {viewMode === "list" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left">
                      <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider">
                        Deal
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider">
                        Company
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider">
                        Stage
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider">
                        Value
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider">
                        Close Date
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-wider">
                        Health
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Engagement
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDeals.map((deal) => {
                    const riskScore = getRiskScore(deal.health);
                    const engagementDots = getEngagementDots(deal);
                    const overdueDate = isOverdue(deal.closeDate);
                    
                    return (
                      <tr
                        key={deal.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedDeal(deal);
                          setDealPanelTab("brief");
                          setShowAiChat(false);
                        }}
                      >
                        {/* Deal Name */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900 mb-0.5">
                              {deal.name}
                            </div>
                            <div className="flex items-center gap-2">
                              {getMomentumIcon(deal.momentum)}
                              <span className="text-xs text-gray-500">
                                {deal.probability}% probability
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{deal.company}</span>
                          </div>
                        </td>

                        {/* Stage */}
                        <td className="px-6 py-4">
                          <Badge className={`${getStageColor(deal.stage)} border-0`}>
                            {deal.stage}
                          </Badge>
                        </td>

                        {/* Value */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(deal.value)}
                          </span>
                        </td>

                        {/* Close Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {overdueDate && (
                              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${overdueDate ? "text-red-600 font-medium" : "text-gray-900"}`}>
                              {deal.closeDate}
                            </span>
                          </div>
                        </td>

                        {/* Health */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                              <div
                                className={`h-2 rounded-full ${
                                  deal.health >= 70 ? "bg-green-500" : 
                                  deal.health >= 50 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${deal.health}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-700 min-w-[2rem]">
                              {deal.health}%
                            </span>
                          </div>
                        </td>

                        {/* Engagement */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {engagementDots.length === 0 ? (
                              <span className="text-xs text-gray-400">No activity</span>
                            ) : (
                              engagementDots.slice(0, 8).map((color, idx) => (
                                <div
                                  key={idx}
                                  className={`w-2 h-2 rounded-full ${color}`}
                                />
                              ))
                            )}
                            {engagementDots.length > 8 && (
                              <span className="text-xs text-gray-500 ml-1">
                                +{engagementDots.length - 8}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="p-6 grid grid-cols-3 gap-4">
              {filteredDeals.map((deal) => {
                const riskScore = getRiskScore(deal.health);
                const engagementDots = getEngagementDots(deal);
                const overdueDate = isOverdue(deal.closeDate);
                
                return (
                  <div
                    key={deal.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
                    onClick={() => {
                      setSelectedDeal(deal);
                      setDealPanelTab("brief");
                      setShowAiChat(false);
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                          {deal.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Building2 className="w-3 h-3" />
                          {deal.company}
                        </div>
                      </div>
                      {getMomentumIcon(deal.momentum)}
                    </div>

                    {/* Stage Badge */}
                    <Badge className={`${getStageColor(deal.stage)} border-0 mb-3`}>
                      {deal.stage}
                    </Badge>

                    {/* Value */}
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(deal.value)}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Close Date</span>
                        <span className={overdueDate ? "text-red-600 font-medium" : "text-gray-900"}>
                          {deal.closeDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Probability</span>
                        <span className="text-gray-900 font-medium">{deal.probability}%</span>
                      </div>
                    </div>

                    {/* Health Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Deal Health</span>
                        <span className="text-xs font-medium text-gray-700">{deal.health}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            deal.health >= 70 ? "bg-green-500" : 
                            deal.health >= 50 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${deal.health}%` }}
                        />
                      </div>
                    </div>

                    {/* Engagement */}
                    <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-600 mr-2">Activity:</span>
                      {engagementDots.length === 0 ? (
                        <span className="text-xs text-gray-400">No activity</span>
                      ) : (
                        engagementDots.slice(0, 10).map((color, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${color}`}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredDeals.length === 0 && (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
              <p className="text-sm text-gray-600 mb-4">
                {searchQuery ? "Try adjusting your search query" : "Get started by creating your first deal"}
              </p>
              {searchQuery ? (
                <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              ) : (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Deal
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Deal Detail Panel - Gong-style slide-out */}
      {selectedDeal && (
        <div className="fixed inset-y-0 right-0 w-[500px] bg-white border-l border-gray-200 shadow-2xl z-50 overflow-y-auto">
          {/* Panel Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">{selectedDeal.name}</h2>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedDeal.company}</span>
                  <Badge className={`${getStageColor(selectedDeal.stage)} border-0`}>
                    {selectedDeal.stage}
                  </Badge>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDeal(null)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Value</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(selectedDeal.value)}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Probability</div>
                <div className="text-lg font-bold text-gray-900">
                  {selectedDeal.probability}%
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Health</div>
                <div className={`text-lg font-bold ${
                  selectedDeal.health >= 70 ? "text-green-600" :
                  selectedDeal.health >= 50 ? "text-yellow-600" : "text-red-600"
                }`}>
                  {selectedDeal.health}%
                </div>
              </div>
            </div>

            {/* AI Question Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Ask AI about this deal..."
                className="w-full px-4 py-2.5 pr-10 text-sm border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && aiQuestion.trim()) {
                    setShowAiChat(true);
                  }
                }}
              />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 mt-4 border-b border-gray-200 -mb-px">
              {["brief", "score", "contacts", "timeline"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDealPanelTab(tab)}
                  className={`
                    pb-3 text-sm font-medium capitalize border-b-2 transition-colors
                    ${dealPanelTab === tab 
                      ? "border-purple-600 text-purple-600" 
                      : "border-transparent text-gray-600 hover:text-gray-900"
                    }
                  `}
                >
                  {tab === "brief" && <Sparkles className="w-4 h-4 inline mr-1.5" />}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Panel Content */}
          <div className="p-6">
            {/* AI Chat Expanded */}
            {showAiChat && aiQuestion && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-900 mb-2">
                      {aiQuestion}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Based on recent conversations, here are the key insights:
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>High engagement with technical team, 3 demos completed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>Budget approved, awaiting final security review</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>Champion identified: VP of Operations actively promoting</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiChat(false)}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Close
                </button>
              </div>
            )}

            {/* Brief Tab */}
            {dealPanelTab === "brief" && (
              <div className="space-y-6">
                {/* Obstacles */}
                <div className="border border-red-200 rounded-lg p-5 bg-red-50/30">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Obstacles</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>No clear timeline for decision from {selectedDeal.company}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Concerns about buy-in from key stakeholders (IT director and CFO)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>Pricing appears to be a significant factor</span>
                    </li>
                  </ul>
                </div>

                {/* Progress */}
                <div className="border border-green-200 rounded-lg p-5 bg-green-50/30">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Progress</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Critical requirements (security, compliance, scalability) well-addressed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Technical Deep Dive scheduled, showing active engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Champion identified and actively supporting the deal</span>
                    </li>
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ClipboardList className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Next Steps</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>Schedule follow-up call with IT director and CFO</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Send className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>Send case study showing 10-month ROI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>Prepare custom pricing proposal with flexible payment terms</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/${userRole}/calendar`);
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/${userRole}/compose-email`, { 
                        state: { 
                          dealName: selectedDeal.name, 
                          company: selectedDeal.company 
                        } 
                      });
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            )}

            {/* Score Tab */}
            {dealPanelTab === "score" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getRiskScoreStyle(getRiskScore(selectedDeal.health))}`}>
                    {getRiskScore(selectedDeal.health)}
                  </div>
                  <p className="text-sm text-gray-600 mt-3 font-medium">Deal Risk Score</p>
                  <p className="text-xs text-gray-500 mt-1">Lower is better</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Deal Health</span>
                      <span className="text-sm text-gray-900 font-semibold">{selectedDeal.health}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedDeal.health >= 70 ? "bg-green-500" :
                          selectedDeal.health >= 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${selectedDeal.health}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Engagement Level</span>
                      <span className="text-sm text-gray-900 font-semibold">{selectedDeal.probability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${selectedDeal.probability}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Momentum</span>
                      <div className="flex items-center gap-1">
                        {getMomentumIcon(selectedDeal.momentum)}
                        <span className="text-sm text-gray-900 font-semibold capitalize">
                          {selectedDeal.momentum}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">AI Recommendation</h4>
                      <p className="text-sm text-blue-800">
                        This deal requires immediate attention. Schedule a call with decision-makers within the next 48 hours to maintain momentum.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {dealPanelTab === "contacts" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Key Contacts</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Sarah Johnson", role: "VP of Operations", champion: true, email: "sarah.j@company.com" },
                    { name: "Michael Chen", role: "IT Director", champion: false, email: "m.chen@company.com" },
                    { name: "Emily Davis", role: "CFO", champion: false, email: "e.davis@company.com" },
                  ].map((contact, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-gray-900">{contact.name}</h4>
                              {contact.champion && (
                                <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                  Champion
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{contact.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/${userRole}/calls`);
                          }}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/${userRole}/compose-email`, { 
                              state: { 
                                to: contact.email,
                                contactName: contact.name,
                                dealName: selectedDeal.name, 
                                company: selectedDeal.company 
                              } 
                            });
                          }}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {dealPanelTab === "timeline" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Activity Timeline</h3>
                
                <div className="space-y-4">
                  {[
                    { date: "Mar 10, 2026", type: "call", title: "Discovery Call", description: "Initial discovery call with VP of Operations" },
                    { date: "Mar 8, 2026", type: "email", title: "Proposal Sent", description: "Sent initial proposal and pricing" },
                    { date: "Mar 5, 2026", type: "meeting", title: "Demo Completed", description: "Product demo with technical team" },
                    { date: "Mar 1, 2026", type: "note", title: "Deal Created", description: "New opportunity identified" },
                  ].map((event, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.type === "call" ? "bg-orange-100" :
                          event.type === "email" ? "bg-blue-100" :
                          event.type === "meeting" ? "bg-purple-100" : "bg-gray-100"
                        }`}>
                          {event.type === "call" && <Phone className="w-4 h-4 text-orange-600" />}
                          {event.type === "email" && <Mail className="w-4 h-4 text-blue-600" />}
                          {event.type === "meeting" && <Users className="w-4 h-4 text-purple-600" />}
                          {event.type === "note" && <Clock className="w-4 h-4 text-gray-600" />}
                        </div>
                        {idx < 3 && <div className="w-px h-full bg-gray-200 mt-1" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-xs text-gray-500 mb-1">{event.date}</div>
                        <div className="text-sm font-semibold text-gray-900 mb-0.5">{event.title}</div>
                        <div className="text-sm text-gray-600">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}