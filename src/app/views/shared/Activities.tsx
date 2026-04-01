import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckSquare,
  Filter,
  Search,
  Download,
  ChevronDown,
  Clock,
  User,
  Building2,
  PlayCircle,
  FileText as Transcript,
  Sparkles,
  ArrowRight,
  X,
  TrendingUp,
  MessageSquare,
  Video,
  ArrowLeft,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { activities } from "../../data/activities-data";

const activityStats = [
  { label: "Total Activities", value: "156", change: "+23 this week", icon: MessageSquare },
  { label: "Calls Completed", value: "47", change: "+8 this week", icon: Phone },
  { label: "Meetings Held", value: "28", change: "+5 this week", icon: Calendar },
  { label: "Emails Sent", value: "81", change: "+10 this week", icon: Mail },
];

const filterOptions = [
  { id: "all", label: "All Activities", count: activities.length },
  { id: "calls", label: "Calls", count: activities.filter(a => a.type === "call").length },
  { id: "emails", label: "Emails", count: activities.filter(a => a.type === "email").length },
  { id: "meetings", label: "Meetings", count: activities.filter(a => a.type === "meeting").length },
  { id: "notes", label: "Notes", count: activities.filter(a => a.type === "note").length },
  { id: "tasks", label: "Tasks", count: activities.filter(a => a.type === "task").length },
];

export function Activities() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["completed", "scheduled"]);
  const [sentimentFilter, setSentimentFilter] = useState<string[]>([]);
  const userRole = localStorage.getItem("userRole") || "rep";
  const navigate = useNavigate();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="w-5 h-5" />;
      case "email":
        return <Mail className="w-5 h-5" />;
      case "meeting":
        return <Calendar className="w-5 h-5" />;
      case "note":
        return <FileText className="w-5 h-5" />;
      case "task":
        return <CheckSquare className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "call":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "email":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "meeting":
        return "bg-green-100 text-green-700 border-green-300";
      case "note":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "task":
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-50 text-green-700 border-green-200";
      case "negative":
        return "bg-red-50 text-red-700 border-red-200";
      case "neutral":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 border-0 text-xs">Completed</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Scheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 border-0 text-xs">Cancelled</Badge>;
      case "no-show":
        return <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">No-show</Badge>;
      default:
        return null;
    }
  };

  const getFilteredActivities = () => {
    let filtered = activities;

    // Filter by type
    if (activeFilter !== "all") {
      const typeMap: Record<string, string> = {
        calls: "call",
        emails: "email",
        meetings: "meeting",
        notes: "note",
        tasks: "task",
      };
      filtered = filtered.filter(a => a.type === typeMap[activeFilter]);
    }

    // Filter by status
    if (statusFilter.length > 0) {
      filtered = filtered.filter(a => statusFilter.includes(a.status));
    }

    // Filter by sentiment
    if (sentimentFilter.length > 0) {
      filtered = filtered.filter(a => a.sentiment && sentimentFilter.includes(a.sentiment));
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        a =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredActivities = getFilteredActivities();

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleSentimentFilter = (sentiment: string) => {
    setSentimentFilter(prev =>
      prev.includes(sentiment) ? prev.filter(s => s !== sentiment) : [...prev, sentiment]
    );
  };

  const exportToCSV = () => {
    const filtered = getFilteredActivities();
    
    // CSV headers
    const headers = [
      "Date",
      "Type",
      "Title",
      "Contact",
      "Title",
      "Company",
      "Duration",
      "Status",
      "Sentiment",
      "Outcome",
      "Deal Value",
      "Deal Stage",
      "Next Steps"
    ];

    // Convert activities to CSV rows
    const rows = filtered.map(activity => [
      activity.timestamp,
      activity.type,
      activity.title,
      activity.contactName,
      activity.contactTitle || "",
      activity.company,
      activity.duration || "",
      activity.status,
      activity.sentiment || "",
      activity.outcome || "",
      activity.dealValue || "",
      activity.dealStage || "",
      activity.nextSteps ? activity.nextSteps.join("; ") : ""
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `activities_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Activity Intelligence
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Complete communication history across all customers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate(`/${userRole}/activity-log`)}>
                <Phone className="w-4 h-4 mr-2" />
                Log Activity
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Activity Type Filters */}
          <div className="flex items-center gap-2 flex-1">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${
                    activeFilter === option.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {option.label}
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    activeFilter === option.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {option.count}
                </Badge>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-9 w-64 bg-gray-50 border-gray-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Status:</span>
            {["completed", "scheduled", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => toggleStatusFilter(status)}
                className={`
                  px-2.5 py-1 rounded text-xs font-medium transition-colors capitalize
                  ${
                    statusFilter.includes(status)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Sentiment:</span>
            {["positive", "neutral", "negative"].map((sentiment) => (
              <button
                key={sentiment}
                onClick={() => toggleSentimentFilter(sentiment)}
                className={`
                  px-2.5 py-1 rounded text-xs font-medium transition-colors capitalize
                  ${
                    sentimentFilter.includes(sentiment)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {sentiment}
              </button>
            ))}
          </div>

          {(statusFilter.length < 2 || sentimentFilter.length > 0) && (
            <button
              onClick={() => {
                setStatusFilter(["completed", "scheduled"]);
                setSentimentFilter([]);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Activities List */}
      <div className="px-8 py-6 space-y-3">
        {filteredActivities.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No activities found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
                setStatusFilter(["completed", "scheduled"]);
                setSentimentFilter([]);
              }}
            >
              Clear All Filters
            </Button>
          </Card>
        ) : (
          filteredActivities.map((activity) => (
            <Card
              key={activity.id}
              className="p-5 hover:shadow-md hover:border-gray-300 transition-all bg-white border border-gray-200"
            >
              <div className="flex items-start gap-4">
                {/* Activity Icon */}
                <div className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </h3>
                        {getStatusBadge(activity.status)}
                        {activity.sentiment && (
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${getSentimentColor(
                              activity.sentiment
                            )}`}
                          >
                            {activity.sentiment}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>

                    {/* Deal Info */}
                    {activity.dealValue && activity.dealValue !== "-" && (
                      <div className="text-right ml-4">
                        <div className="text-lg font-semibold text-gray-900">
                          {activity.dealValue}
                        </div>
                        <div className="text-xs text-gray-600">{activity.dealStage}</div>
                      </div>
                    )}
                  </div>

                  {/* Contact & Company Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-gray-900">
                        {activity.contactName}
                      </span>
                      {activity.contactTitle && (
                        <span className="text-gray-500">• {activity.contactTitle}</span>
                      )}
                    </span>
                    <span>•</span>
                    <Link
                      to={`/${userRole}/customer/${activity.companyId}`}
                      className="flex items-center gap-1.5 hover:text-blue-600"
                    >
                      <Building2 className="w-4 h-4" />
                      {activity.company}
                    </Link>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {activity.timestamp}
                    </span>
                    {activity.duration && (
                      <>
                        <span>•</span>
                        <span>{activity.duration}</span>
                      </>
                    )}
                    {activity.direction && (
                      <>
                        <span>•</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            activity.direction === "inbound"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {activity.direction}
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* AI Summary */}
                  {activity.aiSummary && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-purple-900 mb-1">
                            AI Summary
                          </p>
                          <p className="text-sm text-purple-800">{activity.aiSummary}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {activity.tags && activity.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      {activity.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs bg-gray-50 border-gray-200 text-gray-700"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Next Steps */}
                  {activity.nextSteps && activity.nextSteps.length > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-900 mb-1">
                            Next Steps
                          </p>
                          <ul className="text-sm text-blue-800 space-y-1">
                            {activity.nextSteps.map((step, idx) => (
                              <li key={idx}>• {step}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Participants */}
                  {activity.participants && activity.participants.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <span className="font-medium">Participants:</span>
                      {activity.participants.slice(0, 3).map((participant, idx) => (
                        <span key={idx} className="text-gray-900">
                          {participant}
                        </span>
                      ))}
                      {activity.participants.length > 3 && (
                        <span className="text-gray-500">
                          +{activity.participants.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Outcome */}
                  {activity.outcome && (
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-700">Outcome: </span>
                      <span className="text-sm text-gray-900">{activity.outcome}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {activity.recording && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => navigate(`/${userRole}/activity/${activity.id}`)}
                      >
                        <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                        Play Recording
                      </Button>
                    )}
                    {activity.transcript && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => navigate(`/${userRole}/activity/${activity.id}`)}
                      >
                        <Transcript className="w-3.5 h-3.5 mr-1.5" />
                        View Transcript
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => navigate(`/${userRole}/activity/${activity.id}`)}
                    >
                      View Details
                    </Button>
                    {activity.status === "scheduled" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 h-7 text-xs"
                      >
                        <Video className="w-3.5 h-3.5 mr-1.5" />
                        Join Meeting
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Footer Summary */}
      {filteredActivities.length > 0 && (
        <div className="px-8 py-4 bg-white border-t border-gray-200 sticky bottom-0">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {filteredActivities.length} of {activities.length} activities
            </div>
            <div className="flex items-center gap-4">
              <span>
                Total Time: <span className="font-semibold text-gray-900">47.5 hours</span>
              </span>
              <span>
                Avg Response Time: <span className="font-semibold text-gray-900">2.3 hours</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}