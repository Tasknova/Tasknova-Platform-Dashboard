import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  Download,
  Sparkles,
  BarChart3,
  ChevronDown,
  Info,
  Search,
  ChevronRight,
  Circle,
  Users,
  Building2,
  FileText,
  X,
  PhoneCall,
  Mail,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

// Quarterly revenue data for all quarters
const quarterlyData: Record<string, {
  quarter: string;
  target: number;
  committed: number;
  bestCase: number;
  pipeline: number;
  closed: number;
  forecast: number;
  attainment: number;
  daysLeft: number;
  averageDealSize: number;
  winRate: number;
  avgSalesCycle: number;
}> = {
  "Q1 2026": {
    quarter: "Q1 2026",
    target: 3500000,
    committed: 950000,
    bestCase: 400000,
    pipeline: 1250000,
    closed: 1850000,
    forecast: 2950000,
    attainment: 53,
    daysLeft: 46,
    averageDealSize: 125000,
    winRate: 42,
    avgSalesCycle: 38,
  },
  "Q4 2025": {
    quarter: "Q4 2025",
    target: 3200000,
    committed: 1100000,
    bestCase: 500000,
    pipeline: 900000,
    closed: 2400000,
    forecast: 3200000,
    attainment: 75,
    daysLeft: 0,
    averageDealSize: 115000,
    winRate: 45,
    avgSalesCycle: 35,
  },
  "Q3 2025": {
    quarter: "Q3 2025",
    target: 3000000,
    committed: 950000,
    bestCase: 450000,
    pipeline: 800000,
    closed: 2100000,
    forecast: 2850000,
    attainment: 70,
    daysLeft: 0,
    averageDealSize: 110000,
    winRate: 41,
    avgSalesCycle: 40,
  },
  "Q2 2025": {
    quarter: "Q2 2025",
    target: 2800000,
    committed: 850000,
    bestCase: 400000,
    pipeline: 750000,
    closed: 1950000,
    forecast: 2650000,
    attainment: 70,
    daysLeft: 0,
    averageDealSize: 105000,
    winRate: 39,
    avgSalesCycle: 42,
  },
  "Q1 2025": {
    quarter: "Q1 2025",
    target: 2500000,
    committed: 750000,
    bestCase: 350000,
    pipeline: 700000,
    closed: 1700000,
    forecast: 2350000,
    attainment: 68,
    daysLeft: 0,
    averageDealSize: 100000,
    winRate: 38,
    avgSalesCycle: 45,
  },
};

// Forecast categories
const forecastCategories = [
  {
    category: "Closed Won",
    amount: 1850000,
    count: 15,
    probability: 100,
    percentOfTarget: 63,
    color: "bg-green-600",
    bgLight: "bg-green-50",
    textColor: "text-green-700",
  },
  {
    category: "Commit",
    amount: 950000,
    count: 8,
    probability: 90,
    percentOfTarget: 27,
    color: "bg-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    category: "Best Case",
    amount: 400000,
    count: 5,
    probability: 70,
    percentOfTarget: 11,
    color: "bg-purple-600",
    bgLight: "bg-purple-50",
    textColor: "text-purple-700",
  },
  {
    category: "Pipeline",
    amount: 1250000,
    count: 23,
    probability: 40,
    percentOfTarget: 35,
    color: "bg-gray-400",
    bgLight: "bg-gray-50",
    textColor: "text-gray-700",
  },
];

// Pipeline by stage
const pipelineByStage = [
  { stage: "Discovery", count: 12, value: 480000, avgAge: 15, conversionRate: 35 },
  { stage: "Demo", count: 8, value: 340000, avgAge: 22, conversionRate: 45 },
  { stage: "Proposal", count: 6, value: 520000, avgAge: 18, conversionRate: 55 },
  { stage: "Negotiation", count: 4, value: 780000, avgAge: 30, conversionRate: 68 },
];

// Revenue alerts
const revenueAlerts = [
  {
    id: 1,
    title: "Forecast Gap: $550K",
    description: "Current forecast $550K below target with 46 days remaining",
    action: "Review pipeline acceleration strategies",
    icon: AlertTriangle,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: 2,
    title: "Strong Commit Category",
    description: "$950K in Commit stage with 90% win probability",
    action: "Focus on closing these deals this month",
    icon: TrendingUp,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: 3,
    title: "3 Deals Stalled Over 30 Days",
    description: "Combined value of $425K at risk in late stages",
    action: "Immediate re-engagement required",
    icon: AlertTriangle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    id: 4,
    title: "On Track for 84% Attainment",
    description: "Based on current win rates and pipeline velocity",
    action: "Add $200K to pipeline to hit target",
    icon: Info,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    borderColor: "border-blue-200",
  },
];

// Deal table data - moved before getDealSegments to fix initialization order
const deals = [
  {
    id: 1,
    name: "Enterprise Deal - Acme Corp",
    company: "Acme Corp",
    riskScore: 42,
    qualificationScore: 72,
    methodology: ["S", "P", "I", "CE", "D"],
    engagement: "high",
    value: 145000,
    owner: "Alex Chen",
    stage: "Negotiation",
    closeDate: "Mar 28, 2026",
  },
  {
    id: 2,
    name: "Growth Package - TechFlow Inc",
    company: "TechFlow Inc",
    riskScore: 38,
    qualificationScore: 76,
    methodology: ["S", "P", "I", "CE", "D"],
    engagement: "high",
    value: 92000,
    owner: "Sarah Kim",
    stage: "Proposal",
    closeDate: "Mar 22, 2026",
  },
  {
    id: 3,
    name: "Starter Plan - InnovateX",
    company: "InnovateX",
    riskScore: 54,
    qualificationScore: 65,
    methodology: ["S", "P", "I"],
    engagement: "low",
    value: 28000,
    owner: "Mike Johnson",
    stage: "Discovery",
    closeDate: "Apr 5, 2026",
  },
  {
    id: 4,
    name: "Premium Suite - DataCorp",
    company: "DataCorp",
    riskScore: 22,
    qualificationScore: 88,
    methodology: ["S", "P", "I", "CE", "D"],
    engagement: "high",
    value: 168000,
    owner: "Emma Davis",
    stage: "Negotiation",
    closeDate: "Mar 18, 2026",
  },
  {
    id: 5,
    name: "Mid-Market - CloudBase",
    company: "CloudBase",
    riskScore: 61,
    qualificationScore: 58,
    methodology: ["S", "P"],
    engagement: "medium",
    value: 74000,
    owner: "Alex Chen",
    stage: "Demo",
    closeDate: "Apr 12, 2026",
  },
  {
    id: 6,
    name: "Professional Edition - Acme Corp",
    company: "Acme Corp",
    riskScore: 35,
    qualificationScore: 81,
    methodology: ["S", "P", "I", "CE"],
    engagement: "high",
    value: 68000,
    owner: "Sarah Kim",
    stage: "Proposal",
    closeDate: "Mar 25, 2026",
  },
  {
    id: 7,
    name: "Team Package - Acme Corp",
    company: "Acme Corp",
    riskScore: 48,
    qualificationScore: 70,
    methodology: ["S", "P", "I"],
    engagement: "medium",
    value: 32000,
    owner: "Mike Johnson",
    stage: "Demo",
    closeDate: "Apr 8, 2026",
  },
  {
    id: 8,
    name: "Scale Plan - TechFlow Inc",
    company: "TechFlow Inc",
    riskScore: 28,
    qualificationScore: 85,
    methodology: ["S", "P", "I", "CE", "D"],
    engagement: "high",
    value: 60000,
    owner: "Emma Davis",
    stage: "Negotiation",
    closeDate: "Mar 20, 2026",
  },
  {
    id: 9,
    name: "Enterprise Plus - DataCorp",
    company: "DataCorp",
    riskScore: 31,
    qualificationScore: 82,
    methodology: ["S", "P", "I", "CE", "D"],
    engagement: "high",
    value: 125000,
    owner: "Alex Chen",
    stage: "Proposal",
    closeDate: "Mar 30, 2026",
  },
  {
    id: 10,
    name: "Growth Edition - DataCorp",
    company: "DataCorp",
    riskScore: 44,
    qualificationScore: 74,
    methodology: ["S", "P", "I", "CE"],
    engagement: "medium",
    value: 52000,
    owner: "Sarah Kim",
    stage: "Discovery",
    closeDate: "Apr 10, 2026",
  },
  {
    id: 11,
    name: "Team Suite - DataCorp",
    company: "DataCorp",
    riskScore: 39,
    qualificationScore: 78,
    methodology: ["S", "P", "I"],
    engagement: "high",
    value: 23000,
    owner: "Mike Johnson",
    stage: "Demo",
    closeDate: "Apr 2, 2026",
  },
  {
    id: 12,
    name: "Professional Plan - CloudBase",
    company: "CloudBase",
    riskScore: 52,
    qualificationScore: 68,
    methodology: ["S", "P", "I"],
    engagement: "medium",
    value: 50000,
    owner: "Emma Davis",
    stage: "Proposal",
    closeDate: "Apr 15, 2026",
  },
];

// Deal segments data - calculated dynamically (moved after deals array)
const getDealSegments = () => {
  const today = new Date("2026-03-17");
  const allDeals = deals;
  const topHighValue = deals.filter(d => d.value >= 100000);
  const highRisk = deals.filter(d => d.riskScore > 50);
  const weakQual = deals.filter(d => d.qualificationScore < 60);
  const noEngagement = deals.filter(d => d.engagement === "low");
  const overdue = deals.filter(d => new Date(d.closeDate) < today);

  return [
    { 
      id: "all", 
      label: "All", 
      value: allDeals.reduce((sum, d) => sum + d.value, 0), 
      count: allDeals.length 
    },
    { 
      id: "top-high-value", 
      label: "Top High Value", 
      value: topHighValue.reduce((sum, d) => sum + d.value, 0), 
      count: topHighValue.length 
    },
    { 
      id: "high-risk", 
      label: "High Risk", 
      value: highRisk.reduce((sum, d) => sum + d.value, 0), 
      count: highRisk.length 
    },
    { 
      id: "weak-qualification", 
      label: "Weak Qualification", 
      value: weakQual.reduce((sum, d) => sum + d.value, 0), 
      count: weakQual.length 
    },
    { 
      id: "no-engagement", 
      label: "No Engagement (>7 days)", 
      value: noEngagement.reduce((sum, d) => sum + d.value, 0), 
      count: noEngagement.length 
    },
    { 
      id: "overdue", 
      label: "Overdue", 
      value: overdue.reduce((sum, d) => sum + d.value, 0), 
      count: overdue.length 
    },
  ];
};

const dealSegments = getDealSegments();

export function Revenue() {
  // Revenue Intelligence Dashboard - Updated Version
  const userRole = localStorage.getItem("userRole") || "rep";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("deals");
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState("Q1 2026");
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    stage: [] as string[],
    owner: [] as string[],
    dealSize: "all" as string,
  });
  
  // Get current quarter data
  const currentQuarterData = quarterlyData[selectedQuarter];

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  // Filter deals based on selected segment
  const getFilteredDeals = () => {
    switch (selectedSegment) {
      case "top-high-value":
        return deals.filter(deal => deal.value >= 100000);
      case "high-risk":
        return deals.filter(deal => deal.riskScore > 50);
      case "weak-qualification":
        return deals.filter(deal => deal.qualificationScore < 60);
      case "no-engagement":
        return deals.filter(deal => deal.engagement === "low");
      case "overdue":
        // Filter deals with close date before today (Mar 17, 2026)
        const today = new Date("2026-03-17");
        return deals.filter(deal => {
          const closeDate = new Date(deal.closeDate);
          return closeDate < today;
        });
      case "all":
      default:
        return deals;
    }
  };

  const filteredDeals = getFilteredDeals();

  return (
    <div className="h-full overflow-y-auto bg-gray-50">{/* Revenue Intelligence Dashboard */}
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Revenue Intelligence</h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time forecasting, pipeline analytics, and revenue insights
            </p>
          </div>
          <div className="flex items-center gap-3 relative">
            {/* Filter Button */}
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowQuarterDropdown(false);
                  setShowExportDropdown(false);
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                {(activeFilters.stage.length > 0 || activeFilters.owner.length > 0 || activeFilters.dealSize !== "all") && (
                  <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {activeFilters.stage.length + activeFilters.owner.length + (activeFilters.dealSize !== "all" ? 1 : 0)}
                  </span>
                )}
              </Button>
              
              {showFilterDropdown && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Filters</h3>
                      <button 
                        onClick={() => setShowFilterDropdown(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Deal Stage Filter */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Deal Stage</label>
                      <div className="space-y-2">
                        {["Discovery", "Demo", "Proposal", "Negotiation"].map((stage) => (
                          <label key={stage} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={activeFilters.stage.includes(stage)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setActiveFilters(prev => ({ ...prev, stage: [...prev.stage, stage] }));
                                } else {
                                  setActiveFilters(prev => ({ ...prev, stage: prev.stage.filter(s => s !== stage) }));
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">{stage}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Deal Size Filter */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Deal Size</label>
                      <select
                        value={activeFilters.dealSize}
                        onChange={(e) => setActiveFilters(prev => ({ ...prev, dealSize: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="all">All Sizes</option>
                        <option value="small">Small (&lt;$50K)</option>
                        <option value="medium">Medium ($50K-$100K)</option>
                        <option value="large">Large (&gt;$100K)</option>
                      </select>
                    </div>
                    
                    {/* Deal Owner Filter */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Deal Owner</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {["Sarah Chen", "Mike Johnson", "Emily Rodriguez", "David Park"].map((owner) => (
                          <label key={owner} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={activeFilters.owner.includes(owner)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setActiveFilters(prev => ({ ...prev, owner: [...prev.owner, owner] }));
                                } else {
                                  setActiveFilters(prev => ({ ...prev, owner: prev.owner.filter(o => o !== owner) }));
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">{owner}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setActiveFilters({ stage: [], owner: [], dealSize: "all" });
                        }}
                        className="flex-1"
                      >
                        Clear All
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setShowFilterDropdown(false)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quarter Selector */}
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowQuarterDropdown(!showQuarterDropdown);
                  setShowFilterDropdown(false);
                  setShowExportDropdown(false);
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {selectedQuarter}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              
              {showQuarterDropdown && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">Select Quarter</h3>
                    </div>
                    {["Q1 2026", "Q4 2025", "Q3 2025", "Q2 2025", "Q1 2025"].map((quarter) => (
                      <button
                        key={quarter}
                        onClick={() => {
                          setSelectedQuarter(quarter);
                          setShowQuarterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-50 ${
                          selectedQuarter === quarter ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                        }`}
                      >
                        {quarter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Export Button */}
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowExportDropdown(!showExportDropdown);
                  setShowFilterDropdown(false);
                  setShowQuarterDropdown(false);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              {showExportDropdown && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">Export Options</h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowExportDropdown(false);
                        navigate(`/${userRole}/compose-email?type=revenue-report&format=pdf&quarter=${selectedQuarter}`);
                      }}
                      className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-50 text-gray-700"
                    >
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium">Pipeline Summary PDF</div>
                          <div className="text-xs text-gray-500">Complete overview with charts</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowExportDropdown(false);
                        navigate(`/${userRole}/compose-email?type=revenue-report&format=csv&quarter=${selectedQuarter}`);
                      }}
                      className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-50 text-gray-700"
                    >
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium">Deals Data CSV</div>
                          <div className="text-xs text-gray-500">All deal details in spreadsheet</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowExportDropdown(false);
                        navigate(`/${userRole}/compose-email?type=revenue-report&format=xlsx&quarter=${selectedQuarter}`);
                      }}
                      className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-50 text-gray-700"
                    >
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium">Forecast Report XLSX</div>
                          <div className="text-xs text-gray-500">Detailed forecast breakdown</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowExportDropdown(false);
                        navigate(`/${userRole}/compose-email?type=revenue-report&format=ai-custom&quarter=${selectedQuarter}`);
                      }}
                      className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-50 text-gray-700"
                    >
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 mr-3 text-purple-500" />
                        <div>
                          <div className="font-medium">AI Custom Report</div>
                          <div className="text-xs text-gray-500">Generate tailored insights</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <Link to={`/${userRole}/ai`}>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Forecast Analysis
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-5 gap-4">
          {/* Quarterly Target */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Quarterly Target</span>
              <Target className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">
              {formatCurrency(currentQuarterData.target)}
            </div>
            <div className="text-xs text-gray-600">{currentQuarterData.daysLeft > 0 ? `${currentQuarterData.daysLeft} days left` : 'Quarter ended'}</div>
          </div>

          {/* Closed Won */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Closed Won</span>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">
              {formatCurrency(currentQuarterData.closed)}
            </div>
            <div className="text-xs text-orange-600 font-medium">
              {Math.round((currentQuarterData.closed / currentQuarterData.target) * 100)}% of target
            </div>
          </div>

          {/* Forecast */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Forecast</span>
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">
              {formatCurrency(currentQuarterData.forecast)}
            </div>
            <div className="text-xs text-orange-600 font-medium">
              -$550K gap to target
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Win Rate</span>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">
              {currentQuarterData.winRate}%
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +3% vs Q4
            </div>
          </div>

          {/* Avg Deal Size */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Avg Deal Size</span>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">
              {formatCurrency(currentQuarterData.averageDealSize)}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +12K vs Q4
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-6 px-6 border-b border-gray-200">
            {[
              { id: "deals", label: "Deals", icon: Target },
              { id: "companies", label: "Companies", icon: Building2 },
              { id: "contacts", label: "Contacts", icon: Users },
              { id: "forecast", label: "Forecast", icon: BarChart3 },
              { id: "analysis", label: "AI Win/Loss Analysis", icon: Sparkles },
              { id: "reports", label: "Reports", icon: FileText },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Pipeline Overview Summary Bar - Only for Deals tab */}
          {activeTab === "deals" && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">Total Pipeline</div>
                <div className="font-semibold text-gray-900">$507K <span className="text-gray-500 font-normal">(87)</span></div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Commit</div>
                <div className="font-semibold text-gray-900">$950K <span className="text-gray-500 font-normal">(8)</span></div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Closed Lost</div>
                <div className="font-semibold text-gray-900">$202.86K <span className="text-gray-500 font-normal">(34)</span></div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Best Case</div>
                <div className="font-semibold text-gray-900">$400K <span className="text-gray-500 font-normal">(5)</span></div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Open Pipeline</div>
                <div className="font-semibold text-gray-900">$1.25M <span className="text-gray-500 font-normal">(23)</span></div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Closed Won</div>
                <div className="font-semibold text-gray-900">$1.85M <span className="text-gray-500 font-normal">(15)</span></div>
              </div>
            </div>
          </div>
          )}

          {/* Search and Filters - Only for Deals tab */}
          {activeTab === "deals" && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for a deal"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline" size="sm">
                Owner (1)
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm">
                Deal Pipeline (1)
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm">
                Deal stage now
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm">
                Deal Status
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm">
                Close Date
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="text-blue-600">
                All filters (2)
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="ghost" size="sm">
                Reset
              </Button>
            </div>
          </div>
          )}

          {/* Pipeline Overview - Only for Deals tab */}
          {activeTab === "deals" && (
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Pipeline Overview</h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-7 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">Target</div>
                <div className="font-semibold text-gray-900">$530K</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Closed won</div>
                <div className="font-semibold text-gray-900">$24.92K <span className="text-gray-500 font-normal">(13)</span></div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Gap</div>
                <div className="font-semibold text-orange-600">$305.08K</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Commit</div>
                <div className="font-semibold text-gray-900">$0 <span className="text-gray-500 font-normal">(0)</span></div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Open deals</div>
                <div className="font-semibold text-gray-900">$30.71K <span className="text-gray-500 font-normal">(25)</span></div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Pipeline coverage</div>
                <div className="font-semibold text-gray-900">0.1x</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Avg deal</div>
                <div className="font-semibold text-gray-900">$1,228</div>
              </div>
            </div>
          </div>
          )}

          {/* Review by Deal Segment - Only for Deals tab */}
          {activeTab === "deals" && (
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Review by Deal Segment</h3>
            <div className="grid grid-cols-6 gap-3">
              {dealSegments.map((segment) => {
                // Determine segment color scheme
                const getSegmentColors = () => {
                  if (selectedSegment === segment.id) {
                    switch (segment.id) {
                      case "high-risk":
                        return {
                          border: "border-red-500",
                          bg: "bg-red-50",
                          textPrimary: "text-red-900",
                          textSecondary: "text-red-700",
                          icon: "text-red-600"
                        };
                      case "weak-qualification":
                        return {
                          border: "border-yellow-500",
                          bg: "bg-yellow-50",
                          textPrimary: "text-yellow-900",
                          textSecondary: "text-yellow-700",
                          icon: "text-yellow-600"
                        };
                      case "no-engagement":
                        return {
                          border: "border-orange-500",
                          bg: "bg-orange-50",
                          textPrimary: "text-orange-900",
                          textSecondary: "text-orange-700",
                          icon: "text-orange-600"
                        };
                      case "overdue":
                        return {
                          border: "border-red-600",
                          bg: "bg-red-50",
                          textPrimary: "text-red-900",
                          textSecondary: "text-red-700",
                          icon: "text-red-600"
                        };
                      case "top-high-value":
                        return {
                          border: "border-green-500",
                          bg: "bg-green-50",
                          textPrimary: "text-green-900",
                          textSecondary: "text-green-700",
                          icon: "text-green-600"
                        };
                      default:
                        return {
                          border: "border-blue-500",
                          bg: "bg-blue-50",
                          textPrimary: "text-blue-900",
                          textSecondary: "text-blue-700",
                          icon: "text-blue-600"
                        };
                    }
                  }
                  return {
                    border: "border-gray-200 hover:border-blue-300",
                    bg: "bg-white",
                    textPrimary: "text-gray-900",
                    textSecondary: "text-gray-600",
                    icon: "text-gray-400"
                  };
                };
                const colors = getSegmentColors();
                
                return (
                  <button
                    key={segment.id}
                    onClick={() => setSelectedSegment(segment.id)}
                    className={`relative text-left p-3 rounded-lg border-2 transition-all ${colors.border} ${colors.bg} ${
                      selectedSegment === segment.id ? "shadow-sm" : "hover:shadow-sm"
                    }`}
                  >
                    {selectedSegment === segment.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className={`w-4 h-4 ${colors.icon}`} />
                      </div>
                    )}
                    <div className={`text-xs mb-1 ${selectedSegment === segment.id ? `${colors.textSecondary} font-medium` : "text-gray-600"}`}>
                      {segment.label}
                    </div>
                    <div className={`font-semibold ${colors.textPrimary}`}>
                      ${(segment.value / 1000).toFixed(2)}K <span className={`font-normal ${selectedSegment === segment.id ? colors.textSecondary : "text-gray-500"}`}>({segment.count})</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          )}

          {/* Filter Results Indicator - Only for Deals tab */}
          {activeTab === "deals" && selectedSegment !== "all" && (
            <div className={`px-6 py-3 border-b ${
              selectedSegment === "high-risk" || selectedSegment === "overdue" 
                ? "bg-red-50 border-red-200" 
                : selectedSegment === "weak-qualification" 
                ? "bg-yellow-50 border-yellow-200"
                : selectedSegment === "no-engagement"
                ? "bg-orange-50 border-orange-200"
                : selectedSegment === "top-high-value"
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className={`w-4 h-4 ${
                    selectedSegment === "high-risk" || selectedSegment === "overdue" 
                      ? "text-red-600" 
                      : selectedSegment === "weak-qualification" 
                      ? "text-yellow-600"
                      : selectedSegment === "no-engagement"
                      ? "text-orange-600"
                      : selectedSegment === "top-high-value"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedSegment === "high-risk" || selectedSegment === "overdue" 
                      ? "text-red-900" 
                      : selectedSegment === "weak-qualification" 
                      ? "text-yellow-900"
                      : selectedSegment === "no-engagement"
                      ? "text-orange-900"
                      : selectedSegment === "top-high-value"
                      ? "text-green-900"
                      : "text-blue-900"
                  }`}>
                    Showing {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} • {dealSegments.find(s => s.id === selectedSegment)?.label}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSegment("all")}
                  className={`text-sm font-medium hover:underline ${
                    selectedSegment === "high-risk" || selectedSegment === "overdue" 
                      ? "text-red-600 hover:text-red-700" 
                      : selectedSegment === "weak-qualification" 
                      ? "text-yellow-600 hover:text-yellow-700"
                      : selectedSegment === "no-engagement"
                      ? "text-orange-600 hover:text-orange-700"
                      : selectedSegment === "top-high-value"
                      ? "text-green-600 hover:text-green-700"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  Clear filter
                </button>
              </div>
            </div>
          )}

          {/* Deal Table - Only for Deals tab */}
          {activeTab === "deals" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Deal Name
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Risk Score
                      <Info className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Qualification Score
                      <Info className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Methodology Qualification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Filter className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">No deals found</h3>
                          <p className="text-sm text-gray-600">Try adjusting your filters or segment selection</p>
                        </div>
                        <button
                          onClick={() => setSelectedSegment("all")}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all deals
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDeals.map((deal) => (
                    <tr key={deal.id} onClick={() => setSelectedDeal(deal)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-blue-600 hover:text-blue-700">{deal.name}</span>
                        </div>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                            deal.riskScore <= 30
                              ? "bg-green-100 text-green-700"
                              : deal.riskScore <= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {deal.riskScore}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                            deal.qualificationScore >= 70
                              ? "bg-green-100 text-green-700"
                              : deal.qualificationScore >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {deal.qualificationScore}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {deal.methodology.map((letter, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold"
                          >
                            {letter}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Circle
                          className={`w-3 h-3 fill-current ${
                            deal.engagement === "high"
                              ? "text-green-500"
                              : deal.engagement === "medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(deal.value)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{deal.owner}</span>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}

          {/* Companies Tab */}
          {activeTab === "companies" && (
            <div className="px-6 py-8 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Companies Overview</h3>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Add Company
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: "Acme Corp", deals: 3, value: 245000, industry: "Technology", status: "Active" },
                    { name: "TechFlow Inc", deals: 2, value: 152000, industry: "SaaS", status: "Active" },
                    { name: "InnovateX", deals: 1, value: 28000, industry: "Healthcare", status: "Prospect" },
                    { name: "DataCorp", deals: 4, value: 368000, industry: "Enterprise", status: "Active" },
                    { name: "CloudBase", deals: 2, value: 124000, industry: "Cloud Services", status: "Active" },
                  ].map((company, idx) => (
                    <div 
                      key={idx} 
                      className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all cursor-pointer"
                      onClick={() => setSelectedCompany(company.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{company.name}</h4>
                            <p className="text-sm text-gray-600">{company.industry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xs text-gray-600">Deals</div>
                            <div className="font-semibold text-gray-900">{company.deals}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-600">Total Value</div>
                            <div className="font-semibold text-gray-900">{formatCurrency(company.value)}</div>
                          </div>
                          <div>
                            <Badge className={`${company.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} border-0`}>
                              {company.status}
                            </Badge>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === "contacts" && (
            <div className="px-6 py-8 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Contacts Overview</h3>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Add Contact
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: "John Smith", role: "VP of Sales", company: "Acme Corp", email: "john@acme.com", deals: 2, status: "Active" },
                    { name: "Sarah Johnson", role: "CTO", company: "TechFlow Inc", email: "sarah@techflow.com", deals: 2, status: "Active" },
                    { name: "Michael Chen", role: "CEO", company: "InnovateX", email: "michael@innovatex.com", deals: 1, status: "Prospect" },
                    { name: "Emily Davis", role: "CFO", company: "DataCorp", email: "emily@datacorp.com", deals: 3, status: "Active" },
                    { name: "Robert Wilson", role: "Director", company: "CloudBase", email: "robert@cloudbase.com", deals: 2, status: "Active" },
                  ].map((contact, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                            <p className="text-sm text-gray-600">{contact.role} at {contact.company}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{contact.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xs text-gray-600">Active Deals</div>
                            <div className="font-semibold text-gray-900">{contact.deals}</div>
                          </div>
                          <div>
                            <Badge className={`${contact.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} border-0`}>
                              {contact.status}
                            </Badge>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Forecast Tab */}
          {activeTab === "forecast" && (
            <div className="px-6 py-8 bg-white">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Detailed Forecast Analysis</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Forecast Trend</h4>
                    <div className="space-y-4">
                      {[
                        { month: "January", forecast: 850000, actual: 920000 },
                        { month: "February", forecast: 950000, actual: 880000 },
                        { month: "March", forecast: 1150000, actual: null },
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">{item.month}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-500">Forecast: {formatCurrency(item.forecast)}</span>
                              {item.actual && (
                                <span className="text-xs font-semibold text-green-600">Actual: {formatCurrency(item.actual)}</span>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-blue-600 rounded-full h-2"
                              style={{ width: `${(item.forecast / 1200000) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Forecast Accuracy</h4>
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <div className="text-5xl font-bold text-green-600 mb-2">94%</div>
                        <div className="text-sm text-gray-600">Average Forecast Accuracy</div>
                      </div>
                      <div className="border-t border-gray-200 pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Best Month</span>
                          <span className="text-sm font-semibold text-gray-900">January (98%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Lowest Month</span>
                          <span className="text-sm font-semibold text-gray-900">February (89%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Win/Loss Analysis Tab */}
          {activeTab === "analysis" && (
            <div className="px-6 py-8 bg-white">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">AI Win/Loss Analysis</h3>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate New Analysis
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900">Top Win Factors</h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        { factor: "Strong product demo performance", impact: 92 },
                        { factor: "Executive stakeholder engagement", impact: 88 },
                        { factor: "Competitive pricing advantage", impact: 85 },
                        { factor: "Quick response time", impact: 82 },
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-gray-700">{item.factor}</span>
                            <span className="text-xs font-semibold text-green-700">{item.impact}%</span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-1.5">
                            <div
                              className="bg-green-600 rounded-full h-1.5"
                              style={{ width: `${item.impact}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900">Top Loss Factors</h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        { factor: "Budget constraints", impact: 78 },
                        { factor: "Lack of champion", impact: 72 },
                        { factor: "Lost to competitor", impact: 68 },
                        { factor: "Long sales cycle", impact: 65 },
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-gray-700">{item.factor}</span>
                            <span className="text-xs font-semibold text-red-700">{item.impact}%</span>
                          </div>
                          <div className="w-full bg-red-200 rounded-full h-1.5">
                            <div
                              className="bg-red-600 rounded-full h-1.5"
                              style={{ width: `${item.impact}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">AI Recommendations</h4>
                  <div className="space-y-3">
                    {[
                      "Focus on early executive engagement - deals with C-level involvement in first 2 weeks have 3x higher win rate",
                      "Strengthen product demo customization - personalized demos show 42% higher conversion",
                      "Reduce response time to under 4 hours - correlates with 28% improvement in close rate",
                      "Implement multi-threading strategy - deals with 3+ stakeholders have 2.5x success rate",
                    ].map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="px-6 py-8 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Reports</h3>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: "Q1 2026 Revenue Summary", type: "Quarterly Report", date: "Generated today", status: "Ready" },
                    { name: "Pipeline Health Analysis", type: "Weekly Report", date: "Mar 15, 2026", status: "Ready" },
                    { name: "Win/Loss Trends Report", type: "Monthly Report", date: "Mar 1, 2026", status: "Ready" },
                    { name: "Forecast Accuracy Report", type: "Monthly Report", date: "Mar 1, 2026", status: "Ready" },
                    { name: "Team Performance Metrics", type: "Weekly Report", date: "Mar 14, 2026", status: "Ready" },
                  ].map((report, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{report.name}</h4>
                            <p className="text-sm text-gray-600">{report.type}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className="bg-green-100 text-green-700 border-0">
                            {report.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Forecast Breakdown & Pipeline */}
          <div className="col-span-2 space-y-6">
            {/* Forecast Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">Forecast Breakdown</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Forecast to Target Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Forecast to Target</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(currentQuarterData.forecast)} / {formatCurrency(currentQuarterData.target)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 via-blue-600 via-purple-600 to-gray-400 rounded-full transition-all"
                      style={{ width: `${(currentQuarterData.forecast / currentQuarterData.target) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Forecast Category Cards - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {forecastCategories.map((cat, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-900">{cat.category}</span>
                        <Badge
                          className={`text-xs px-2.5 py-0.5 ${cat.bgLight} ${cat.textColor} border-0 font-semibold`}
                        >
                          {cat.probability}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {formatCurrency(cat.amount)}
                      </div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-gray-600">{cat.count} deals</span>
                        <span className="font-semibold text-gray-700">{cat.percentOfTarget}% of target</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline by Stage */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">Pipeline by Stage</h2>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  {pipelineByStage.map((stage, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">{stage.stage}</span>
                          <span className="text-xs text-gray-500">{stage.count} deals</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-600">Avg: {stage.avgAge}d</span>
                          <span className="font-medium text-gray-700">{stage.conversionRate}% win rate</span>
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(stage.value)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 rounded-full h-2.5 transition-all"
                          style={{ width: `${(stage.value / 1000000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Revenue Alerts */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Revenue Alerts</h3>
              </div>
              <div className="p-4 space-y-3">
                {revenueAlerts.map((alert) => {
                  const Icon = alert.icon;
                  return (
                    <div
                      key={alert.id}
                      className={`border-l-4 ${alert.borderColor} bg-gray-50 rounded-r-lg p-4`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 ${alert.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4.5 h-4.5 ${alert.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">{alert.title}</h4>
                          <p className="text-xs text-gray-600 mb-2 leading-relaxed">{alert.description}</p>
                          <p className="text-xs text-gray-500 italic">{alert.action}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Deal Insights Panel */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCompany}</h2>
                  <p className="text-blue-100 text-sm">
                    {deals.filter(d => d.company === selectedCompany).length} Active Deals • {formatCurrency(deals.filter(d => d.company === selectedCompany).reduce((sum, d) => sum + d.value, 0))} Total Value
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* Company Stats */}
              <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Total Pipeline</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(deals.filter(d => d.company === selectedCompany).reduce((sum, d) => sum + d.value, 0))}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Avg Deal Size</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(deals.filter(d => d.company === selectedCompany).reduce((sum, d) => sum + d.value, 0) / deals.filter(d => d.company === selectedCompany).length)}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Avg Risk Score</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(deals.filter(d => d.company === selectedCompany).reduce((sum, d) => sum + d.riskScore, 0) / deals.filter(d => d.company === selectedCompany).length)}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Avg Qualification</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(deals.filter(d => d.company === selectedCompany).reduce((sum, d) => sum + d.qualificationScore, 0) / deals.filter(d => d.company === selectedCompany).length)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="px-6 py-6 bg-purple-50 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">AI Account Intelligence</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedCompany} shows <span className="font-semibold text-purple-700">strong buying signals</span> with {deals.filter(d => d.company === selectedCompany).length} active deals. 
                      {deals.filter(d => d.company === selectedCompany).some(d => d.riskScore < 40) && 
                        " Multiple deals have low risk scores indicating high win probability."
                      }
                      {deals.filter(d => d.company === selectedCompany).some(d => d.stage === "Negotiation") && 
                        " Deals in negotiation stage require immediate attention to close this quarter."
                      } Recommended next action: Schedule executive alignment meeting to discuss multi-product strategy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Deals Table */}
              <div className="px-6 py-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Deals for {selectedCompany}</h3>
                <div className="space-y-4">
                  {deals.filter(d => d.company === selectedCompany).map((deal) => (
                    <div key={deal.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all">
                      {/* Deal Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900 mb-1">{deal.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              {deal.owner}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              Close: {deal.closeDate}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4" />
                              {formatCurrency(deal.value)}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-0">
                          {deal.stage}
                        </Badge>
                      </div>

                      {/* Deal Metrics Grid */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                                deal.riskScore <= 30
                                  ? "bg-green-100 text-green-700"
                                  : deal.riskScore <= 50
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {deal.riskScore}
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Risk Score</div>
                              <div className="text-xs font-semibold text-gray-900">
                                {deal.riskScore <= 30 ? "Low Risk" : deal.riskScore <= 50 ? "Medium Risk" : "High Risk"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                                deal.qualificationScore >= 70
                                  ? "bg-green-100 text-green-700"
                                  : deal.qualificationScore >= 50
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {deal.qualificationScore}
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Qualification</div>
                              <div className="text-xs font-semibold text-gray-900">
                                {deal.qualificationScore >= 70 ? "Well Qualified" : deal.qualificationScore >= 50 ? "Moderate" : "Weak"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-600 mb-1">Engagement Level</div>
                          <div className="flex items-center gap-2">
                            <Circle
                              className={`w-3 h-3 fill-current ${
                                deal.engagement === "high"
                                  ? "text-green-500"
                                  : deal.engagement === "medium"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                              }`}
                            />
                            <span className="text-sm font-semibold text-gray-900 capitalize">{deal.engagement}</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-600 mb-1">Methodology</div>
                          <div className="flex items-center gap-1">
                            {deal.methodology.map((letter, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold"
                              >
                                {letter}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Deal Insights */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold text-blue-900">Deal Insight:</span> 
                            {deal.riskScore <= 30 && " This deal has a low risk profile with strong qualification signals. Focus on accelerating timeline."}
                            {deal.riskScore > 30 && deal.riskScore <= 50 && " Medium risk - consider addressing qualification gaps and increasing stakeholder engagement."}
                            {deal.riskScore > 50 && " High risk - immediate action required. Review MEDDICC criteria and schedule stakeholder alignment meeting."}
                            {deal.stage === "Negotiation" && " Priority deal in late stage - ensure all legal and procurement blockers are resolved quickly."}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                        <Button size="sm" variant="outline" className="flex-1">
                          <PhoneCall className="w-4 h-4 mr-2" />
                          Call Contact
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Add Note
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Full Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8" onClick={() => setSelectedDeal(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedDeal.name}</h2>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{selectedDeal.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{selectedDeal.owner}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Close: {selectedDeal.closeDate}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedDeal(null)} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Deal Value & Stage */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Deal Value</span>
                  </div>
                  <div className="text-3xl font-bold text-green-900">{formatCurrency(selectedDeal.value)}</div>
                  <p className="text-xs text-green-700 mt-1">Quote Amount</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Current Stage</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{selectedDeal.stage}</div>
                  <p className="text-xs text-blue-700 mt-1">Deal Progress</p>
                </div>

                <div className={`bg-gradient-to-br rounded-xl p-6 border ${
                  selectedDeal.engagement === "high" 
                    ? "from-green-50 to-green-100 border-green-200" 
                    : selectedDeal.engagement === "medium"
                    ? "from-yellow-50 to-yellow-100 border-yellow-200"
                    : "from-red-50 to-red-100 border-red-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`w-5 h-5 ${
                      selectedDeal.engagement === "high" ? "text-green-600" :
                      selectedDeal.engagement === "medium" ? "text-yellow-600" : "text-red-600"
                    }`} />
                    <span className={`text-sm font-medium ${
                      selectedDeal.engagement === "high" ? "text-green-900" :
                      selectedDeal.engagement === "medium" ? "text-yellow-900" : "text-red-900"
                    }`}>Engagement</span>
                  </div>
                  <div className={`text-2xl font-bold capitalize ${
                    selectedDeal.engagement === "high" ? "text-green-900" :
                    selectedDeal.engagement === "medium" ? "text-yellow-900" : "text-red-900"
                  }`}>{selectedDeal.engagement}</div>
                  <p className={`text-xs mt-1 ${
                    selectedDeal.engagement === "high" ? "text-green-700" :
                    selectedDeal.engagement === "medium" ? "text-yellow-700" : "text-red-700"
                  }`}>Activity Level</p>
                </div>
              </div>

              {/* Deal Scores Analysis */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI Deal Score Analysis
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {/* Risk Score */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${
                          selectedDeal.riskScore <= 30
                            ? "bg-green-100 text-green-700"
                            : selectedDeal.riskScore <= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {selectedDeal.riskScore}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Risk Score</div>
                          <div className={`text-xs font-medium ${
                            selectedDeal.riskScore <= 30 ? "text-green-600" :
                            selectedDeal.riskScore <= 50 ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {selectedDeal.riskScore <= 30 ? "Low Risk - High Probability" :
                             selectedDeal.riskScore <= 50 ? "Medium Risk - Monitor Closely" : 
                             "High Risk - Needs Attention"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-700 mb-3">
                        <span className="font-semibold">Why this score?</span>
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {selectedDeal.riskScore <= 30 ? (
                          <>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                              <span>Strong stakeholder engagement and executive buy-in</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                              <span>Budget confirmed and timeline aligned</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                              <span>Competitive position is strong</span>
                            </li>
                          </>
                        ) : selectedDeal.riskScore <= 50 ? (
                          <>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5" />
                              <span>Some stakeholders engaged, but need executive champion</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5" />
                              <span>Budget needs final approval or timeline uncertain</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5" />
                              <span>Facing moderate competition</span>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                              <span>Limited stakeholder engagement or single-threaded</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                              <span>Budget unclear or decision timeline pushed</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                              <span>Strong competition or internal build considered</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Qualification Score */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${
                          selectedDeal.qualificationScore >= 70
                            ? "bg-green-100 text-green-700"
                            : selectedDeal.qualificationScore >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {selectedDeal.qualificationScore}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Qualification Score</div>
                          <div className={`text-xs font-medium ${
                            selectedDeal.qualificationScore >= 70 ? "text-green-600" :
                            selectedDeal.qualificationScore >= 50 ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {selectedDeal.qualificationScore >= 70 ? "Well Qualified - Strong Fit" :
                             selectedDeal.qualificationScore >= 50 ? "Partially Qualified - Gaps Exist" : 
                             "Poorly Qualified - High Risk"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-700 mb-3">
                        <span className="font-semibold">Why this score?</span>
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {selectedDeal.qualificationScore >= 70 ? (
                          <>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                              <span>Clear pain points and compelling event identified</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                              <span>Strong ROI case and decision criteria established</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                              <span>All SPICED elements thoroughly covered</span>
                            </li>
                          </>
                        ) : selectedDeal.qualificationScore >= 50 ? (
                          <>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5" />
                              <span>Pain points identified, but urgency unclear</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5" />
                              <span>Some SPICED elements missing or incomplete</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5" />
                              <span>Decision process not fully mapped</span>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                              <span>Pain points vague or not validated</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                              <span>Multiple SPICED elements not addressed</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                              <span>Lack of economic buyer access</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* SPICED Methodology Coverage */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">SPICED Qualification Framework</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { letter: "S", label: "Situation", desc: "Current state and context", covered: selectedDeal.methodology.includes("S") },
                    { letter: "P", label: "Pain", desc: "Critical business problems", covered: selectedDeal.methodology.includes("P") },
                    { letter: "I", label: "Impact", desc: "Quantified business impact", covered: selectedDeal.methodology.includes("I") },
                    { letter: "C", label: "Critical Event", desc: "Deadline driving urgency", covered: selectedDeal.methodology.includes("C") || selectedDeal.methodology.includes("CE") },
                    { letter: "E", label: "Economic Buyer", desc: "Budget authority identified", covered: selectedDeal.methodology.includes("E") || selectedDeal.methodology.includes("CE") },
                    { letter: "D", label: "Decision Process", desc: "Steps and stakeholders mapped", covered: selectedDeal.methodology.includes("D") },
                  ].map((item) => (
                    <div key={item.letter} className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                      item.covered ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        item.covered ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}>
                        {item.letter}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold mb-0.5 ${item.covered ? "text-green-900" : "text-gray-600"}`}>
                          {item.label}
                        </div>
                        <div className={`text-xs ${item.covered ? "text-green-700" : "text-gray-500"}`}>
                          {item.desc}
                        </div>
                        {item.covered ? (
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            <span className="text-xs font-medium text-green-700">Completed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            <span className="text-xs font-medium text-gray-500">Not Covered</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Contacts */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Key Contacts & Stakeholders
                </h3>
                <div className="space-y-3">
                  {/* Example contacts - in real app this would come from deal data */}
                  {[
                    { name: "Sarah Mitchell", role: "VP of Operations", status: "Champion", engagement: "High" },
                    { name: "James Chen", role: "Director of IT", status: "Influencer", engagement: "Medium" },
                    { name: "Emily Rodriguez", role: "CFO", status: "Economic Buyer", engagement: "Low" },
                  ].map((contact, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-600">{contact.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${
                          contact.status === "Economic Buyer" ? "bg-purple-100 text-purple-700" :
                          contact.status === "Champion" ? "bg-green-100 text-green-700" :
                          "bg-blue-100 text-blue-700"
                        } border-0`}>
                          {contact.status}
                        </Badge>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          contact.engagement === "High" ? "bg-green-100 text-green-700" :
                          contact.engagement === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          <Circle className={`w-2 h-2 fill-current`} />
                          {contact.engagement}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps & Actions */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Next Steps</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {selectedDeal.riskScore > 50 ? "Schedule executive alignment call" : "Prepare proposal presentation"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedDeal.riskScore > 50 
                          ? "Connect with economic buyer to validate budget and timeline"
                          : "Review pricing and ROI calculator with key stakeholders"
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {selectedDeal.methodology.length < 5 ? "Complete missing SPICED elements" : "Multi-thread with additional stakeholders"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedDeal.methodology.length < 5
                          ? "Address gaps in qualification framework to strengthen the deal"
                          : "Expand influence by engaging technical and operational teams"
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">Send follow-up email with case study</div>
                      <div className="text-sm text-gray-600">Share relevant success story from similar company in their industry</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-4 flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedDeal(null)}>
                Close
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Call Contact
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full CRM Record
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}