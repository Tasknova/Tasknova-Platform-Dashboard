import { useState } from "react";
import { Link } from "react-router";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronDown,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Settings,
  Search,
  Calendar,
  Users,
  Building2,
  Target,
  Star,
  CheckSquare,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  Plus,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";

// Tracker categories
const trackerCategories = [
  { id: "business-goals", name: "Business Goals" },
  { id: "features", name: "Features Interested" },
  { id: "competitors", name: "Competitors" },
  { id: "churn-risk", name: "Churn Risk" },
  { id: "product-feedback", name: "Product Feedback" },
  { id: "pain-points", name: "Pain Points" },
];

// Tracker data by category
const trackerData = {
  "business-goals": [
    { name: "Coaching", mentions: 85, color: "bg-purple-500" },
    { name: "Training", mentions: 66, color: "bg-purple-500" },
    { name: "Onboarding", mentions: 46, color: "bg-purple-500" },
    { name: "Automate Call Scoring", mentions: 31, color: "bg-purple-500" },
    { name: "Compliance", mentions: 20, color: "bg-purple-500" },
    { name: "Automate CRM Data Entry", mentions: 16, color: "bg-purple-500" },
    { name: "Note taking", mentions: 16, color: "bg-purple-500" },
    { name: "Monitoring", mentions: 10, color: "bg-purple-500" },
    { name: "Automate Note taking", mentions: 9, color: "bg-purple-500" },
    { name: "Meeting Assistant", mentions: 3, color: "bg-purple-500" },
  ],
  "product-feedback": [
    { name: "Positive Avoma Feedback", mentions: 75, color: "bg-yellow-500" },
    { name: "Negative Avoma Feedback", mentions: 71, color: "bg-yellow-500" },
    { name: "Negative Notes Feedback", mentions: 70, color: "bg-yellow-500" },
    { name: "Positive UX Feedback", mentions: 63, color: "bg-yellow-500" },
    { name: "Negative UX Feedback", mentions: 46, color: "bg-yellow-500" },
    { name: "Negative Transcription Feedback", mentions: 62, color: "bg-yellow-500" },
    { name: "Positive Scorecards Feedback", mentions: 38, color: "bg-yellow-500" },
    { name: "Negative Scorecards Feedback", mentions: 35, color: "bg-yellow-500" },
    { name: "Negative AI Feedback", mentions: 19, color: "bg-yellow-500" },
    { name: "Positive Notes Feedback", mentions: 19, color: "bg-yellow-500" },
  ],
  "pain-points": [
    { name: "Manual Data Entry", mentions: 92, color: "bg-red-500" },
    { name: "Lack of Call Visibility", mentions: 78, color: "bg-red-500" },
    { name: "Poor CRM Integration", mentions: 65, color: "bg-red-500" },
    { name: "Inconsistent Follow-ups", mentions: 54, color: "bg-red-500" },
    { name: "Missing Call Context", mentions: 47, color: "bg-red-500" },
    { name: "Time-consuming Note Taking", mentions: 42, color: "bg-red-500" },
  ],
  "competitors": [
    { name: "Gong", mentions: 67, color: "bg-blue-500" },
    { name: "Chorus", mentions: 54, color: "bg-blue-500" },
    { name: "Outreach", mentions: 42, color: "bg-blue-500" },
    { name: "SalesLoft", mentions: 31, color: "bg-blue-500" },
  ],
  "features": [
    { name: "AI Note Taking", mentions: 88, color: "bg-green-500" },
    { name: "CRM Integration", mentions: 76, color: "bg-green-500" },
    { name: "Call Recording", mentions: 69, color: "bg-green-500" },
    { name: "Analytics Dashboard", mentions: 58, color: "bg-green-500" },
    { name: "Conversation Intelligence", mentions: 52, color: "bg-green-500" },
  ],
  "churn-risk": [
    { name: "Pricing Concerns", mentions: 34, color: "bg-orange-500" },
    { name: "Missing Features", mentions: 28, color: "bg-orange-500" },
    { name: "Poor Support Experience", mentions: 19, color: "bg-orange-500" },
    { name: "Switching to Competitor", mentions: 15, color: "bg-orange-500" },
  ],
};

// Sample call data for drill-down
const callMentions = {
  "Coaching": [
    {
      id: "c1",
      company: "Postmedia Health",
      contact: "Cam Brenner",
      timestamp: "51:03",
      duration: "28:52",
      date: "Feb 25, 2026",
      highlight: "Two two way CRM field updates is nice. Okay so updating two way integration is an ROI thing, and I'm not like our SDRs. Right, and so at this point, the second like conversational intelligence is if we...",
      context: "CRM logging process is choose to auto ticket.",
      fullTranscript: true,
    },
    {
      id: "c2",
      company: "Avoma Team",
      contact: "Internal Discussion",
      timestamp: "10:59",
      duration: "28:52",
      date: "Feb 24, 2026",
      highlight: "Okay. So. CRM logging process is choose to auto ticket. So right now, sync external emails from connected accounts to Avoma. So this is putting it into Avoma, and then this is an additional setting that it's gonna now push to Hubspot.",
      context: "Discussing CRM integration capabilities",
      fullTranscript: true,
    },
    {
      id: "c3",
      company: "CSM Team Meeting",
      contact: "Mike Graham",
      timestamp: "35:02",
      duration: "28:52",
      date: "Feb 23, 2026",
      highlight: "I have a quick question about the connecting your CRM to sync notes in Hubspot. Yeah. But, like, I don't know if you know what I'm referencing. The Avoma integration really takes notes into Hubspot, right? But there are some with a below, okay let's go on an agency call. If you're on with like agency doing a call, there's the Avoma wasn't able to distinguish what the client was because the Hubspot not set up by our client.",
      context: "Discussing note-taking automation",
      fullTranscript: true,
    },
    {
      id: "c4",
      company: "Enterprise Sales Call",
      contact: "Sarah Mitchell",
      timestamp: "18:22",
      duration: "45:18",
      date: "Feb 22, 2026",
      highlight: "The coaching capability is really impressive. Being able to identify key moments in calls and provide real-time feedback to reps would transform our training program completely.",
      context: "Evaluating coaching features",
      fullTranscript: true,
    },
    {
      id: "c5",
      company: "TechCorp Demo",
      contact: "David Chen",
      timestamp: "22:45",
      duration: "38:12",
      date: "Feb 21, 2026",
      highlight: "We're specifically interested in the coaching analytics. Can you show me how managers can track improvement over time and identify coaching opportunities across the team?",
      context: "Demo of coaching intelligence",
      fullTranscript: true,
    },
  ],
  "Positive Avoma Feedback": [
    {
      id: "p1",
      company: "DataTech Solutions",
      contact: "Alex Rivera",
      timestamp: "12:34",
      duration: "32:15",
      date: "Feb 26, 2026",
      highlight: "This is exactly what we've been looking for! The AI summaries are spot-on and save us hours every week. The transcription quality is outstanding.",
      context: "Product feedback during check-in",
      fullTranscript: true,
    },
    {
      id: "p2",
      company: "Growth Ventures",
      contact: "Jessica Lee",
      timestamp: "08:15",
      duration: "28:45",
      date: "Feb 25, 2026",
      highlight: "I love how intuitive the interface is. My team was up and running in less than a day. The automatic action items feature is a game-changer for us.",
      context: "Onboarding success story",
      fullTranscript: true,
    },
    {
      id: "p3",
      company: "CloudScale Inc",
      contact: "Robert Kim",
      timestamp: "19:42",
      duration: "41:30",
      date: "Feb 24, 2026",
      highlight: "The conversation intelligence insights have helped us close 3 deals this month that we would have lost. The competitor mentions tracking is invaluable.",
      context: "ROI discussion",
      fullTranscript: true,
    },
  ],
  "Manual Data Entry": [
    {
      id: "m1",
      company: "SalesPro Inc",
      contact: "Emma Thompson",
      timestamp: "15:20",
      duration: "35:42",
      date: "Feb 26, 2026",
      highlight: "Our reps spend 2-3 hours daily just updating CRM fields. It's killing our productivity and they hate it. We need automation yesterday.",
      context: "Pain point discovery",
      fullTranscript: true,
    },
    {
      id: "m2",
      company: "Revenue Systems",
      contact: "Carlos Martinez",
      timestamp: "24:18",
      duration: "29:33",
      date: "Feb 25, 2026",
      highlight: "The manual note-taking after every call is unsustainable. We're looking for a solution that can automatically capture and sync everything to Salesforce.",
      context: "Requirements gathering",
      fullTranscript: true,
    },
  ],
};

export function Trackers() {
  const [activeCategory, setActiveCategory] = useState("product-feedback");
  const [selectedTracker, setSelectedTracker] = useState<string | null>(null);
  const [selectedCalls, setSelectedCalls] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const userRole = localStorage.getItem("userRole") || "rep";

  const currentTrackers = trackerData[activeCategory as keyof typeof trackerData] || [];
  const totalMentions = currentTrackers.reduce((sum, t) => sum + t.mentions, 0);
  const maxMentions = Math.max(...currentTrackers.map(t => t.mentions));

  const handleTrackerClick = (trackerName: string) => {
    setSelectedTracker(trackerName);
    // Auto-select all calls for this tracker
    const calls = callMentions[trackerName as keyof typeof callMentions] || [];
    setSelectedCalls(calls.map(c => c.id));
  };

  const handleCallToggle = (callId: string) => {
    setSelectedCalls(prev => 
      prev.includes(callId) 
        ? prev.filter(id => id !== callId)
        : [...prev, callId]
    );
  };

  const handleSelectAll = () => {
    if (!selectedTracker) return;
    const calls = callMentions[selectedTracker as keyof typeof callMentions] || [];
    if (selectedCalls.length === calls.length) {
      setSelectedCalls([]);
    } else {
      setSelectedCalls(calls.map(c => c.id));
    }
  };

  const selectedCallData = selectedTracker 
    ? (callMentions[selectedTracker as keyof typeof callMentions] || [])
    : [];

  return (
    <div className="flex-1 bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Trackers</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Track key topics and themes across all conversations
                </p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Custom Tracker
              </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Date range (1)
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Member
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Team (1)
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Target className="w-3.5 h-3.5 mr-1.5" />
                Purpose
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Building2 className="w-3.5 h-3.5 mr-1.5" />
                Company
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs bg-blue-50 text-blue-700 border-blue-200">
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                All filters (3)
                <X className="w-3 h-3 ml-1" />
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-200 -mb-px overflow-x-auto">
              {trackerCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSelectedTracker(null);
                  }}
                  className={`pb-3 px-1 text-sm whitespace-nowrap ${
                    activeCategory === category.id
                      ? "font-medium text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {category.name}
                </button>
              ))}
              <button className="pb-3 px-1 text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
                + Add More
              </button>
            </div>
          </div>
        </div>

        {/* Tracker List */}
        <div className="flex-1 overflow-auto">
          <div className="px-8 py-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Which {trackerCategories.find(c => c.id === activeCategory)?.name} do{" "}
                <select className="bg-transparent border-b border-gray-300 text-gray-900 font-semibold focus:outline-none focus:border-blue-600">
                  <option>Clients</option>
                  <option>Prospects</option>
                  <option>All Contacts</option>
                </select>{" "}
                mention most?
              </h2>
              <p className="text-sm text-gray-600 mt-1">Total: {totalMentions}</p>
            </div>

            {/* Tracker Bars */}
            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 uppercase">Tracker Name</span>
                  <span className="text-xs font-semibold text-gray-600 uppercase">Number of Conversations with Mention</span>
                </div>
                {currentTrackers.map((tracker, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTrackerClick(tracker.name)}
                    className={`w-full flex items-center gap-4 py-2.5 px-3 rounded-lg transition-all hover:bg-gray-50 ${
                      selectedTracker === tracker.name ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 w-48">
                      <Star className={`w-4 h-4 ${selectedTracker === tracker.name ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      <span className="text-sm font-medium text-gray-900 text-left">{tracker.name}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${tracker.color} rounded-full transition-all`}
                          style={{ width: `${(tracker.mentions / maxMentions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                        {tracker.mentions}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Drill-Down Side Panel */}
      {selectedTracker && (
        <div className="w-[480px] bg-white border-l border-gray-200 flex flex-col">
          {/* Panel Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900">{selectedTracker}</h3>
                <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700">
                  {selectedCallData.length}
                </Badge>
              </div>
              <button
                onClick={() => setSelectedTracker(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {selectedCallData.length} conversations as per applied filters
            </p>
          </div>

          {/* Call List */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 space-y-4">
              {selectedCallData.map((call, idx) => (
                <Card key={call.id} className={`p-4 hover:shadow-md transition-all cursor-pointer ${
                  selectedCalls.includes(call.id) ? 'border-blue-300 bg-blue-50' : ''
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCalls.includes(call.id)}
                      onChange={() => handleCallToggle(call.id)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      {/* Call Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">{call.company}</span>
                      </div>

                      {/* Contact & Timestamp */}
                      <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                        <span>{call.contact}</span>
                        <span>•</span>
                        <span>{call.date}</span>
                        <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0">
                          {call.timestamp}
                        </Badge>
                      </div>

                      {/* Highlighted Quote */}
                      <div className="bg-yellow-50 border-l-3 border-yellow-400 px-3 py-2 mb-2">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {call.highlight.split(selectedTracker).map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="bg-yellow-200 font-semibold">{selectedTracker}</span>
                              )}
                            </span>
                          ))}
                        </p>
                      </div>

                      {/* Context */}
                      <p className="text-xs text-gray-600 italic">{call.context}</p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-3">
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
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Select All Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <CheckSquare className="w-4 h-4" />
              {selectedCalls.length === selectedCallData.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
