import { useState } from "react";
import { Link } from "react-router";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";

const customers = [
  {
    id: "1",
    name: "Acme Corp",
    slug: "acme-corp",
    logo: "AC",
    industry: "Financial Services",
    size: "250-500",
    dealValue: "$850K",
    stage: "Negotiation",
    dealStatus: "Ongoing",
    health: 85,
    healthTrend: "up",
    lastContact: "2 hours ago",
    nextMeeting: "Today, 3:00 PM",
    contacts: 4,
    openDeals: 2,
    totalCalls: 12,
    sentiment: "positive",
    riskFactors: [],
    keyTopics: ["Integration", "Pricing", "Timeline"],
    championsCount: 2,
    revenue: "$425K",
    engagement: 92,
    discoveryRep: "Alex Rivera",
    owner: "Alex Rivera",
    callPurposes: ["Discovery", "Demo", "Negotiation"],
    conversionRate: 75,
    closedDeals: 2,
    totalRevenue: "$425K",
  },
  {
    id: "2",
    name: "TechStart",
    slug: "techstart",
    logo: "TS",
    industry: "SaaS",
    size: "100-250",
    dealValue: "$425K",
    stage: "Demo",
    dealStatus: "Ongoing",
    health: 78,
    healthTrend: "up",
    lastContact: "1 day ago",
    nextMeeting: "Tomorrow, 10:00 AM",
    contacts: 3,
    openDeals: 1,
    totalCalls: 8,
    sentiment: "positive",
    riskFactors: ["Budget concerns mentioned"],
    keyTopics: ["ROI", "Implementation", "Support"],
    championsCount: 1,
    revenue: "$180K",
    engagement: 85,
    discoveryRep: "Alex Rivera",
    owner: "Alex Rivera",
    callPurposes: ["Discovery", "Demo"],
    conversionRate: 68,
    closedDeals: 1,
    totalRevenue: "$180K",
  },
  {
    id: "3",
    name: "GlobalTech",
    slug: "globaltech",
    logo: "GT",
    industry: "Enterprise Software",
    size: "500+",
    dealValue: "$1.2M",
    stage: "Proposal",
    dealStatus: "Ongoing",
    health: 92,
    healthTrend: "up",
    lastContact: "5 hours ago",
    nextMeeting: "Feb 28, 2:00 PM",
    contacts: 7,
    openDeals: 3,
    totalCalls: 18,
    sentiment: "very positive",
    riskFactors: [],
    keyTopics: ["Enterprise features", "Security", "Compliance"],
    championsCount: 3,
    revenue: "$680K",
    engagement: 95,
    discoveryRep: "Casey Johnson",
    owner: "Casey Johnson",
    callPurposes: ["Discovery", "Demo", "Technical Review", "Compliance"],
    conversionRate: 82,
    closedDeals: 3,
    totalRevenue: "$680K",
  },
  {
    id: "4",
    name: "DataFlow",
    slug: "dataflow",
    logo: "DF",
    industry: "Data Analytics",
    size: "500+",
    dealValue: "$325K",
    stage: "Discovery",
    dealStatus: "Ongoing",
    health: 65,
    healthTrend: "down",
    lastContact: "3 days ago",
    nextMeeting: "Next week",
    contacts: 2,
    openDeals: 1,
    totalCalls: 5,
    sentiment: "neutral",
    riskFactors: ["Long response times", "Competitor evaluation"],
    keyTopics: ["Pricing", "Features comparison", "Migration"],
    championsCount: 0,
    revenue: "$95K",
    engagement: 58,
    discoveryRep: "Alex Rivera",
    owner: "Alex Rivera",
    callPurposes: ["Discovery", "Pricing"],
    conversionRate: 45,
    closedDeals: 0,
    totalRevenue: "$95K",
  },
  {
    id: "5",
    name: "Innovate Labs",
    slug: "innovate-labs",
    logo: "IL",
    industry: "Research & Development",
    size: "50-100",
    dealValue: "$180K",
    stage: "Qualified",
    dealStatus: "Ongoing",
    health: 88,
    healthTrend: "up",
    lastContact: "Today",
    nextMeeting: "Today, 4:30 PM",
    contacts: 2,
    openDeals: 1,
    totalCalls: 6,
    sentiment: "positive",
    riskFactors: [],
    keyTopics: ["Quick implementation", "API access", "Scalability"],
    championsCount: 1,
    revenue: "$75K",
    engagement: 82,
    discoveryRep: "Casey Johnson",
    owner: "Casey Johnson",
    callPurposes: ["Discovery", "Demo"],
    conversionRate: 72,
    closedDeals: 1,
    totalRevenue: "$75K",
  },
  {
    id: "6",
    name: "CloudVista",
    slug: "cloudvista",
    logo: "CV",
    industry: "Cloud Services",
    size: "500+",
    dealValue: "$950K",
    stage: "Negotiation",
    dealStatus: "Ongoing",
    health: 72,
    healthTrend: "neutral",
    lastContact: "Yesterday",
    nextMeeting: "Mar 1, 11:00 AM",
    contacts: 5,
    openDeals: 2,
    totalCalls: 14,
    sentiment: "neutral",
    riskFactors: ["Price sensitivity", "Long decision cycle"],
    keyTopics: ["Contract terms", "Volume discounts", "Support SLA"],
    championsCount: 1,
    revenue: "$420K",
    engagement: 75,
    discoveryRep: "Jordan Smith",
    owner: "Jordan Smith",
    callPurposes: ["Discovery", "Demo", "Negotiation", "Legal Review"],
    conversionRate: 58,
    closedDeals: 1,
    totalRevenue: "$420K",
  },
  {
    id: "7",
    name: "SecureBank",
    slug: "securebank",
    logo: "SB",
    industry: "Financial Services",
    size: "500+",
    dealValue: "$1.5M",
    stage: "Closed-Won",
    dealStatus: "Closed",
    health: 98,
    healthTrend: "up",
    lastContact: "1 week ago",
    nextMeeting: "Onboarding scheduled",
    contacts: 8,
    openDeals: 0,
    totalCalls: 24,
    sentiment: "very positive",
    riskFactors: [],
    keyTopics: ["Security", "Compliance", "Integration"],
    championsCount: 4,
    revenue: "$1.5M",
    engagement: 98,
    discoveryRep: "Jordan Smith",
    owner: "Jordan Smith",
    callPurposes: ["Discovery", "Demo", "Security Review", "Compliance", "Executive Briefing"],
    conversionRate: 100,
    closedDeals: 1,
    totalRevenue: "$1.5M",
  },
  {
    id: "8",
    name: "RetailCo",
    slug: "retailco",
    logo: "RC",
    industry: "Retail",
    size: "250-500",
    dealValue: "$0",
    stage: "Closed-Lost",
    dealStatus: "Closed",
    health: 25,
    healthTrend: "down",
    lastContact: "2 weeks ago",
    nextMeeting: null,
    contacts: 3,
    openDeals: 0,
    totalCalls: 7,
    sentiment: "negative",
    riskFactors: ["Budget constraints", "Chose competitor"],
    keyTopics: ["Pricing", "Budget"],
    championsCount: 0,
    revenue: "$0",
    engagement: 28,
    discoveryRep: "Casey Johnson",
    owner: "Casey Johnson",
    callPurposes: ["Discovery", "Demo", "Pricing"],
    conversionRate: 0,
    closedDeals: 0,
    totalRevenue: "$0",
  },
  {
    id: "9",
    name: "HealthTech Plus",
    slug: "healthtech-plus",
    logo: "HT",
    industry: "Healthcare",
    size: "100-250",
    dealValue: "$0",
    stage: "Not Qualified",
    dealStatus: "Waiting",
    health: 40,
    healthTrend: "neutral",
    lastContact: "10 days ago",
    nextMeeting: null,
    contacts: 1,
    openDeals: 0,
    totalCalls: 2,
    sentiment: "neutral",
    riskFactors: ["No clear budget", "Timeline uncertain"],
    keyTopics: ["Exploring options"],
    championsCount: 0,
    revenue: "$0",
    engagement: 35,
    discoveryRep: "Alex Rivera",
    owner: "Alex Rivera",
    callPurposes: ["Discovery"],
    conversionRate: 0,
    closedDeals: 0,
    totalRevenue: "$0",
  },
];

const customerStats = [
  { label: "Total Customers", value: "142", change: "+8 this month", trend: "up" },
  { label: "Active Deals", value: "68", change: "+12 this week", trend: "up" },
  { label: "Avg Health Score", value: "81", change: "+3 points", trend: "up" },
  { label: "At Risk", value: "7", change: "-2 vs last week", trend: "down" },
];

export function Customers() {
  const [activeTab, setActiveTab] = useState("my");
  const userRole = localStorage.getItem("userRole") || "rep";

  // Filter customers based on tab
  const myCustomers = customers.filter(c => c.owner === "Alex Rivera");
  const teamCustomers = customers.filter(c => c.owner !== "Alex Rivera");
  const ongoingDeals = customers.filter(c => c.dealStatus === "Ongoing");
  const closedDeals = customers.filter(c => c.dealStatus === "Closed");

  const getFilteredCustomers = () => {
    switch(activeTab) {
      case "my": return myCustomers;
      case "team": return teamCustomers;
      case "ongoing": return ongoingDeals;
      case "closed": return closedDeals;
      default: return customers;
    }
  };

  const filteredCustomers = getFilteredCustomers();

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (health >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "very positive" || sentiment === "positive") return "text-green-700 bg-green-50";
    if (sentiment === "neutral") return "text-yellow-700 bg-yellow-50";
    return "text-red-700 bg-red-50";
  };

  const getDealStatusColor = (status: string) => {
    if (status === "Ongoing") return "bg-blue-100 text-blue-700";
    if (status === "Closed") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Customer Intelligence</h1>
              <p className="text-sm text-gray-600 mt-1">
                AI-powered insights across your customer base
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {customerStats.map((stat, index) => (
              <Card key={index} className="p-4 bg-gray-50 border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      stat.trend === "up"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUp className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDown className="w-3 h-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b-0 h-auto p-0">
              <TabsTrigger
                value="my"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
              >
                My Customers ({myCustomers.length})
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
              >
                Team Customers ({teamCustomers.length})
              </TabsTrigger>
              <TabsTrigger
                value="ongoing"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
              >
                Ongoing Deals ({ongoingDeals.length})
              </TabsTrigger>
              <TabsTrigger
                value="closed"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
              >
                Closed Deals ({closedDeals.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 cursor-pointer hover:border-blue-600">
            Health Score <ChevronDown className="w-3 h-3 ml-1" />
          </Badge>
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 cursor-pointer hover:border-blue-600">
            Industry <ChevronDown className="w-3 h-3 ml-1" />
          </Badge>
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 cursor-pointer hover:border-blue-600">
            Company Size <ChevronDown className="w-3 h-3 ml-1" />
          </Badge>
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 cursor-pointer hover:border-blue-600">
            Deal Stage <ChevronDown className="w-3 h-3 ml-1" />
          </Badge>
        </div>
      </div>

      {/* Customer List */}
      <div className="px-8 py-6 space-y-3">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="p-5 hover:shadow-md hover:border-gray-300 transition-all bg-white border border-gray-200"
          >
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {customer.logo}
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        to={`/${userRole}/customer/${customer.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {customer.name}
                      </Link>
                      <Badge variant="outline" className="text-xs">
                        {customer.size}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {customer.industry}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {customer.contacts} contacts
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {customer.totalCalls} conversations
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {customer.openDeals} active deal{customer.openDeals !== 1 ? "s" : ""}
                      </span>
                      <span>•</span>
                      <Badge className={getDealStatusColor(customer.dealStatus)}>
                        {customer.dealStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Discovery: <span className="font-medium text-gray-900">{customer.discoveryRep}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Conversion: <span className="font-medium text-gray-900">{customer.conversionRate}%</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        Total Revenue: <span className="font-medium text-gray-900">{customer.totalRevenue}</span>
                      </span>
                    </div>
                  </div>

                  {/* Health Score */}
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${
                        customer.health >= 80
                          ? "text-green-600"
                          : customer.health >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {customer.health}
                    </div>
                    <div className="text-xs text-gray-600">Health Score</div>
                    <Badge
                      variant="outline"
                      className={`mt-1 text-xs ${getHealthColor(customer.health)}`}
                    >
                      {customer.healthTrend === "up" ? (
                        <ArrowUp className="w-3 h-3 mr-1" />
                      ) : customer.healthTrend === "down" ? (
                        <ArrowDown className="w-3 h-3 mr-1" />
                      ) : (
                        <Activity className="w-3 h-3 mr-1" />
                      )}
                      {customer.healthTrend}
                    </Badge>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Deal Value</div>
                    <div className="text-lg font-semibold text-gray-900">{customer.dealValue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Stage</div>
                    <Badge className="bg-blue-100 text-blue-700">{customer.stage}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Sentiment</div>
                    <Badge className={getSentimentColor(customer.sentiment)}>{customer.sentiment}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Engagement</div>
                    <div className="flex items-center gap-2">
                      <Progress value={customer.engagement} className="h-2 flex-1" />
                      <span className="text-sm font-medium text-gray-900">{customer.engagement}%</span>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="space-y-3">
                  {/* Risk Factors */}
                  {customer.riskFactors.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900 mb-1">Risk Factors Detected</p>
                        <ul className="text-sm text-red-700 space-y-1">
                          {customer.riskFactors.map((risk, idx) => (
                            <li key={idx}>• {risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Key Topics */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-gray-700">Key Topics:</span>
                    {customer.keyTopics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                        {topic}
                      </Badge>
                    ))}
                    {customer.championsCount > 0 && (
                      <>
                        <span className="text-gray-300">|</span>
                        <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                          {customer.championsCount} Champion{customer.championsCount !== 1 ? "s" : ""}
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Call Purposes */}
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">Call Types:</span>
                    {customer.callPurposes.map((purpose, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                        {purpose}
                      </Badge>
                    ))}
                  </div>

                  {/* Activity */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Last contact: {customer.lastContact}
                      </span>
                      {customer.nextMeeting && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Next: {customer.nextMeeting}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/${userRole}/activities`}>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          View Calls
                        </Button>
                      </Link>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Calendar className="w-4 h-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}