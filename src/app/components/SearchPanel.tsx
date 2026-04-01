import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Phone,
  FileText,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface SearchResult {
  id: string;
  type: "deal" | "customer" | "meeting" | "task" | "page";
  title: string;
  subtitle?: string;
  link: string;
  icon: any;
  metadata?: string;
}

const searchData: SearchResult[] = [
  // Deals
  {
    id: "deal-1",
    type: "deal",
    title: "Acme Corp - Enterprise Platform",
    subtitle: "Proposal Stage",
    link: "/deals",
    icon: Target,
    metadata: "$125K ARR",
  },
  {
    id: "deal-2",
    type: "deal",
    title: "TechVision Inc - New Business",
    subtitle: "Negotiation Stage",
    link: "/deals",
    icon: Target,
    metadata: "$95K ARR",
  },
  {
    id: "deal-3",
    type: "deal",
    title: "DataFlow Systems - Platform License",
    subtitle: "At Risk",
    link: "/deals",
    icon: Target,
    metadata: "$125K ARR",
  },
  
  // Customers
  {
    id: "customer-1",
    type: "customer",
    title: "Acme Corp",
    subtitle: "Technology • San Francisco, CA",
    link: "/customers",
    icon: Building2,
    metadata: "Active deal",
  },
  {
    id: "customer-2",
    type: "customer",
    title: "CloudVista",
    subtitle: "SaaS • New York, NY",
    link: "/customers",
    icon: Building2,
    metadata: "Demo scheduled",
  },
  
  // Meetings
  {
    id: "meeting-1",
    type: "meeting",
    title: "Discovery Call - Acme Corp",
    subtitle: "Today at 9:00 AM PST",
    link: "/meetings",
    icon: Calendar,
    metadata: "Zoom",
  },
  {
    id: "meeting-2",
    type: "meeting",
    title: "Demo - CloudVista",
    subtitle: "Today at 11:00 AM PST",
    link: "/meetings",
    icon: Calendar,
    metadata: "Teams",
  },
  
  // Pages
  {
    id: "page-1",
    type: "page",
    title: "Pipeline",
    subtitle: "View your deals and opportunities",
    link: "/pipeline",
    icon: TrendingUp,
  },
  {
    id: "page-2",
    type: "page",
    title: "Customers",
    subtitle: "Manage customer relationships",
    link: "/customers",
    icon: Users,
  },
  {
    id: "page-3",
    type: "page",
    title: "Calls",
    subtitle: "View call recordings and insights",
    link: "/calls",
    icon: Phone,
  },
  {
    id: "page-4",
    type: "page",
    title: "Coaching",
    subtitle: "AI-powered coaching insights",
    link: "/coaching",
    icon: TrendingUp,
  },
];

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export function SearchPanel({ isOpen, onClose, userRole = "rep" }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Acme Corp",
    "Discovery calls this week",
    "At risk deals",
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query]);

  const handleSelectResult = (result: SearchResult) => {
    navigate(`/${userRole}${result.link}`);
    
    // Add to recent searches
    if (!recentSearches.includes(result.title)) {
      setRecentSearches((prev) => [result.title, ...prev.slice(0, 4)]);
    }
    
    onClose();
    setQuery("");
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  const typeColors = {
    deal: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    customer: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    meeting: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    task: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    page: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Search Panel */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
        {/* Search Input */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search deals, customers, meetings, or pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-9 h-10 text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() === "" ? (
            // Recent Searches
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Recent Searches
                  </h3>
                </div>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              {recentSearches.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No recent searches
                </p>
              ) : (
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(search)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {search}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : results.length === 0 ? (
            // No Results
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
              <p className="text-xs text-gray-500">
                Try searching for deals, customers, or meetings
              </p>
            </div>
          ) : (
            // Search Results
            <div className="p-2">
              {Object.entries(
                results.reduce((acc, result) => {
                  if (!acc[result.type]) acc[result.type] = [];
                  acc[result.type].push(result);
                  return acc;
                }, {} as Record<string, SearchResult[]>)
              ).map(([type, items]) => (
                <div key={type} className="mb-4 last:mb-0">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                    {type}s
                  </h3>
                  <div className="space-y-1">
                    {items.map((result) => {
                      const Icon = result.icon;
                      const colors = typeColors[result.type as keyof typeof typeColors];
                      
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleSelectResult(result)}
                          className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`w-4 h-4 ${colors.text}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {result.title}
                                </p>
                                {result.metadata && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-1.5 py-0 h-4 bg-white"
                                  >
                                    {result.metadata}
                                  </Badge>
                                )}
                              </div>
                              {result.subtitle && (
                                <p className="text-xs text-gray-500 truncate">
                                  {result.subtitle}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">
                  ↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">
                  ↵
                </kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">
                  Esc
                </kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
