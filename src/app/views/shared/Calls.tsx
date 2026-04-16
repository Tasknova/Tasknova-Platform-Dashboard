import { useState, useEffect } from "react";
import {
  Phone,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  Building2,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Play,
  Star,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Link, useLocation } from "react-router";
import { supabase } from "../../../lib/supabase";
import { MakeCallDialog } from "../../components/MakeCallDialog";

interface Call {
  id: string;
  type: "outgoing" | "incoming" | "missed";
  contact: string;
  company: string;
  duration: string;
  date: string;
  time: string;
  status: string;
  recorded: boolean;
  sentiment: string | null;
  topics: string[];
  score: number | null;
}

export function Calls() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "incoming" | "outgoing" | "missed">("all");
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [makeCallDialogOpen, setMakeCallDialogOpen] = useState(false);
  const location = useLocation();

  // Load calls from database
  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("call_records")
        .select(
          `
          call_record_id,
          duration_seconds,
          call_status,
          created_at,
          sentiment,
          topics,
          quality_score,
          recording_storage_path,
          leads: lead_id (
            full_name,
            company,
            phone_e164
          )
          `
        )
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform the data to match the Call interface
      const transformedCalls: Call[] = (data || []).map((record: any) => {
        const createdAt = new Date(record.created_at);
        const date = createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const time = createdAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const duration = record.duration_seconds
          ? `${Math.floor(record.duration_seconds / 60)}:${(record.duration_seconds % 60)
              .toString()
              .padStart(2, "0")}`
          : "0:00";

        // Determine call type
        let type: "outgoing" | "incoming" | "missed" = "outgoing";
        if (record.call_status === "missed") {
          type = "missed";
        } else if (record.call_status === "completed") {
          type = "outgoing"; // Default to outgoing if not specified
        }

        // Parse topics from JSONB
        let topics: string[] = [];
        if (Array.isArray(record.topics)) {
          topics = record.topics.filter((t) => typeof t === "string");
        }

        return {
          id: record.call_record_id,
          type,
          contact: record.leads?.full_name || "Unknown",
          company: record.leads?.company || "N/A",
          duration,
          date,
          time,
          status: record.call_status,
          recorded: !!record.recording_storage_path,
          sentiment: record.sentiment,
          topics,
          score: record.quality_score,
        };
      });

      setCalls(transformedCalls);
    } catch (error) {
      console.error("Failed to load calls:", error);
      setCalls([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine the base path (rep, manager, or admin)
  const basePath = location.pathname.split('/')[1] || 'rep';

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || call.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming className="w-4 h-4 text-green-600" />;
      case "outgoing":
        return <PhoneOutgoing className="w-4 h-4 text-blue-600" />;
      case "missed":
        return <PhoneMissed className="w-4 h-4 text-red-600" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string | null) => {
    if (!sentiment) return "text-gray-500";
    if (sentiment.includes("Positive")) return "text-green-600";
    if (sentiment === "Neutral") return "text-gray-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Calls</h1>
              <p className="text-sm text-gray-600 mt-1">View and manage all call recordings</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                onClick={() => setMakeCallDialogOpen(true)}
                size="sm"
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Phone className="w-4 h-4" />
                Make Call
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by contact, company, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "incoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("incoming")}
                className="gap-1"
              >
                <PhoneIncoming className="w-3 h-3" />
                Incoming
              </Button>
              <Button
                variant={filterType === "outgoing" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("outgoing")}
                className="gap-1"
              >
                <PhoneOutgoing className="w-3 h-3" />
                Outgoing
              </Button>
              <Button
                variant={filterType === "missed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("missed")}
                className="gap-1"
              >
                <PhoneMissed className="w-3 h-3" />
                Missed
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Calls Table */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading calls...</p>
            </div>
          </div>
        ) : calls.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No calls yet. Start by making a call!</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Type
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Contact
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Company
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Date & Time
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Duration
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Sentiment
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Topics
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Score
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4" onClick={() => {}}>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(call.type)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/${basePath}/meeting/${call.id}`} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{call.contact}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/${basePath}/meeting/${call.id}`} className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{call.company}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/${basePath}/meeting/${call.id}`} className="text-sm text-gray-700">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {call.date}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {call.time}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/${basePath}/meeting/${call.id}`}>
                        <span className="text-sm font-medium text-gray-900">{call.duration}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/${basePath}/meeting/${call.id}`}>
                        {call.sentiment ? (
                          <span className={`text-sm font-medium ${getSentimentColor(call.sentiment)}`}>
                            {call.sentiment}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/${basePath}/meeting/${call.id}`}>
                        <div className="flex flex-wrap gap-1">
                          {call.topics.length > 0 ? (
                            call.topics.slice(0, 2).map((topic, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                          {call.topics.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{call.topics.length - 2}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/${basePath}/meeting/${call.id}`}>
                        {call.score ? (
                          <div className="flex items-center gap-2">
                            <div
                              className={`text-sm font-semibold ${
                                call.score >= 85
                                  ? "text-green-600"
                                  : call.score >= 70
                                  ? "text-blue-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {call.score}
                            </div>
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  call.score >= 85
                                    ? "bg-green-500"
                                    : call.score >= 70
                                    ? "bg-blue-500"
                                    : "bg-yellow-500"
                                }`}
                                style={{ width: `${call.score}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {call.recorded && (
                          <Link to={`/${basePath}/meeting/${call.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Play className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => e.stopPropagation()}>
                          <Star className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && calls.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredCalls.length} of {calls.length} calls
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Make Call Dialog */}
      <MakeCallDialog
        open={makeCallDialogOpen}
        onOpenChange={setMakeCallDialogOpen}
        onCallCompleted={() => {
          setMakeCallDialogOpen(false);
          loadCalls(); // Refresh the calls list
        }}
      />
    </div>
  );
}