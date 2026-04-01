import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle2,
  Users,
  Calendar,
  BarChart3,
  Activity,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const quarterSummary = {
  quarter: "Q1 2026",
  quota: 3500000,
  forecast: 2940000,
  committed: 2450000,
  closed: 1820000,
  attainment: 52,
  daysLeft: 31,
};

// Quarter data for different periods
const quartersData = {
  "Q1 2026": {
    quarter: "Q1 2026",
    quota: 3500000,
    forecast: 2940000,
    committed: 2450000,
    closed: 1820000,
    attainment: 52,
    daysLeft: 31,
  },
  "Q4 2025": {
    quarter: "Q4 2025",
    quota: 3200000,
    forecast: 3100000,
    committed: 2980000,
    closed: 3050000,
    attainment: 95,
    daysLeft: 0,
  },
  "Q3 2025": {
    quarter: "Q3 2025",
    quota: 3000000,
    forecast: 2850000,
    committed: 2720000,
    closed: 2780000,
    attainment: 93,
    daysLeft: 0,
  },
  "Q2 2025": {
    quarter: "Q2 2025",
    quota: 2800000,
    forecast: 2650000,
    committed: 2540000,
    closed: 2590000,
    attainment: 92,
    daysLeft: 0,
  },
};

const repForecasts = [
  {
    id: "1",
    name: "Taylor Brooks",
    avatar: "TB",
    quota: 500000,
    committed: 420000,
    bestCase: 485000,
    pipeline: 520000,
    attainment: 84,
    trend: "up",
    deals: 8,
  },
  {
    id: "2",
    name: "Alex Rivera",
    avatar: "AR",
    quota: 500000,
    committed: 380000,
    bestCase: 445000,
    pipeline: 490000,
    attainment: 76,
    trend: "up",
    deals: 12,
  },
  {
    id: "3",
    name: "Morgan Smith",
    avatar: "MS",
    quota: 500000,
    committed: 310000,
    bestCase: 375000,
    pipeline: 420000,
    attainment: 62,
    trend: "stable",
    deals: 9,
  },
  {
    id: "4",
    name: "Casey Johnson",
    avatar: "CJ",
    quota: 500000,
    committed: 245000,
    bestCase: 290000,
    pipeline: 340000,
    attainment: 49,
    trend: "down",
    deals: 11,
  },
  {
    id: "5",
    name: "Jordan Lee",
    avatar: "JL",
    quota: 500000,
    committed: 385000,
    bestCase: 440000,
    pipeline: 475000,
    attainment: 77,
    trend: "up",
    deals: 10,
  },
  {
    id: "6",
    name: "Sam Taylor",
    avatar: "ST",
    quota: 500000,
    committed: 340000,
    bestCase: 395000,
    pipeline: 430000,
    attainment: 68,
    trend: "stable",
    deals: 7,
  },
  {
    id: "7",
    name: "Riley Chen",
    avatar: "RC",
    quota: 500000,
    committed: 370000,
    bestCase: 425000,
    pipeline: 465000,
    attainment: 74,
    trend: "up",
    deals: 9,
  },
];

const weeklyTrend = [
  { week: "Week 1", committed: 2100000, bestCase: 2450000 },
  { week: "Week 2", committed: 2200000, bestCase: 2520000 },
  { week: "Week 3", committed: 2350000, bestCase: 2680000 },
  { week: "Week 4", committed: 2450000, bestCase: 2865000 },
];

const riskDeals = [
  {
    id: "1",
    company: "DataFlow Systems",
    rep: "Casey Johnson",
    value: 125000,
    closeDate: "Mar 15",
    stage: "Negotiation",
    risk: "No contact in 10 days",
    probability: 40,
  },
  {
    id: "2",
    company: "GlobalTech Inc",
    rep: "Morgan Smith",
    value: 95000,
    closeDate: "Mar 20",
    stage: "Proposal",
    risk: "Pricing concerns",
    probability: 50,
  },
  {
    id: "3",
    company: "Vertex Solutions",
    rep: "Casey Johnson",
    value: 78000,
    closeDate: "Mar 25",
    stage: "Discovery",
    risk: "Low engagement score",
    probability: 30,
  },
];

export function ManagerForecast() {
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Q1 2026");
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  
  const currentQuarterData = quartersData[selectedQuarter as keyof typeof quartersData];
  const attainmentPercent = (currentQuarterData.closed / currentQuarterData.quota) * 100;
  const forecastPercent = (currentQuarterData.forecast / currentQuarterData.quota) * 100;

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
                <h1 className="text-lg font-semibold text-gray-900">Forecast Management</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="relative">
                    <button
                      onClick={() => setShowQuarterDropdown(!showQuarterDropdown)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {currentQuarterData.quarter}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showQuarterDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowQuarterDropdown(false)}
                        ></div>
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
                          {Object.keys(quartersData).map((quarter) => (
                            <button
                              key={quarter}
                              onClick={() => {
                                setSelectedQuarter(quarter);
                                setShowQuarterDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                quarter === selectedQuarter
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {quarter}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    • {currentQuarterData.daysLeft > 0 ? `${currentQuarterData.daysLeft} days remaining` : 'Closed'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                <Zap className="w-4 h-4 mr-2" />
                Update Forecast
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6">
        {/* Quarter Summary */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Quarter Summary</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Quota</span>
                <Target className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${(currentQuarterData.quota / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-gray-600 mt-1">{currentQuarterData.quarter}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Forecast</span>
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ${(currentQuarterData.forecast / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-gray-600 mt-1">{forecastPercent.toFixed(0)}% of quota</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Committed</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${(currentQuarterData.committed / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-gray-600 mt-1">High confidence</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Closed Won</span>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${(currentQuarterData.closed / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-gray-600 mt-1">{attainmentPercent.toFixed(0)}% attainment</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Gap to Quota</span>
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                ${((currentQuarterData.quota - currentQuarterData.forecast) / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-gray-600 mt-1">Coverage needed</p>
            </div>
          </div>
        </section>

        {/* Forecast Progress */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Forecast Progress</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Closed Won</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${(currentQuarterData.closed / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${attainmentPercent}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Committed</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${(currentQuarterData.committed / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(currentQuarterData.committed / currentQuarterData.quota) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Best Case Forecast</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${(currentQuarterData.forecast / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${forecastPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rep Forecasts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Rep Forecasts</h2>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Sort by Attainment
            </Button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Rep
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Quota
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Committed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Best Case
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Pipeline
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Attainment
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Deals
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {repForecasts.map((rep) => (
                  <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                          {rep.avatar}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{rep.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      ${(rep.quota / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                      ${(rep.committed / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-blue-600">
                      ${(rep.bestCase / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      ${(rep.pipeline / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge
                        className={
                          rep.attainment >= 80
                            ? "bg-green-100 text-green-700 border-green-200"
                            : rep.attainment >= 60
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {rep.attainment}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {rep.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />}
                      {rep.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600 mx-auto" />}
                      {rep.trend === "stable" && <Activity className="w-4 h-4 text-gray-400 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{rep.deals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* At-Risk Deals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">At-Risk Deals</h2>
            <Link to="/manager/pipeline">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                View All Deals
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {riskDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white border border-red-200 rounded-lg p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">{deal.company}</h3>
                      <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-0.5 h-5">
                        At Risk
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {deal.rep}
                      </div>
                      <div>${(deal.value / 1000).toFixed(0)}K</div>
                      <div>Close: {deal.closeDate}</div>
                      <div>Stage: {deal.stage}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                      <span className="text-xs text-orange-700 font-medium">{deal.risk}</span>
                      <span className="text-xs text-gray-500">• {deal.probability}% probability</span>
                    </div>
                  </div>
                  <Link to={`/manager/deal/${deal.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Review Deal
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}