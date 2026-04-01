import { Link, useParams, useLocation } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Video,
  Mail,
  ExternalLink,
  Copy,
  Share2,
  Settings,
  ChevronDown,
  MessageSquare,
  FileText,
  Bell,
  GraduationCap,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  MoreVertical,
  Play,
  Search,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function MeetingDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"insights" | "chapters" | "questions" | "keywords">("insights");

  // Determine the base path (rep, manager, or admin)
  const basePath = location.pathname.split('/')[1] || 'rep';

  // Mock meeting data
  const meeting = {
    title: "Daily Stand up",
    date: "Mar 20th, 10:30am",
    duration: "40 mins",
    participants: 10,
    organizer: "C Efdbaadabaadc abdafeeedbf",
    type: "STAND UP",
    outcome: "OUTCOME",
    videoUrl: "",
  };

  const speakers = [
    {
      name: "Aarav Tasknova",
      role: "Founder",
      talkTime: "4%",
      duration: "1 min",
      color: "bg-blue-500",
    },
    {
      name: "Aarav Tasknova",
      role: "Founder", 
      talkTime: "93%",
      duration: "12 min",
      color: "bg-orange-500",
    },
    {
      name: "Rajpal Rathod",
      role: "",
      talkTime: "0%",
      duration: "<1 min",
      color: "bg-red-500",
    },
  ];

  const insights = [
    { label: "IN HOS", count: 0, color: "bg-blue-500" },
    { label: "PRICING", count: 0, color: "bg-purple-500" },
    { label: "NEXT STEPS", count: 2, color: "bg-green-500" },
  ];

  const autoChapters = [
    { time: "00:00", duration: "2m 15s", title: "Introduction and agenda setting", description: "Team members join the call and Aarav outlines the meeting agenda" },
    { time: "02:15", duration: "5m 30s", title: "AI Agent Development Update", description: "Discussion about allocating 5 hours daily on AI agents and customer intelligence features" },
    { time: "07:45", duration: "3m 20s", title: "Hiring Plans and Recruitment", description: "Job postings for UI/UX interns and backend AI pipeline candidates, overseas hiring discussion" },
    { time: "11:05", duration: "4m 10s", title: "Dashboard Hosting and Deployment", description: "Anshita's dashboard hosting on Supabase, Mihir to handle deployment and restart" },
    { time: "15:15", duration: "6m 45s", title: "Twilio Integration and AI Calls", description: "Plan to purchase Twilio numbers for automated client follow-up calls with AI agents" },
    { time: "22:00", duration: "8m 30s", title: "Pricing Strategy and Deposits", description: "Discussion about ₹10,000 refundable deposit requirement and value delivery guarantee" },
    { time: "30:30", duration: "4m 25s", title: "Timeline and Deliverables", description: "2-3 day timeline for revenue agent features and forecasting model exploration" },
    { time: "34:55", duration: "2m 40s", title: "Budget and Cost Analysis", description: "Cost estimates of ₹5-6 per call and trial budget allocation" },
    { time: "37:35", duration: "1m 50s", title: "Action Items Assignment", description: "Team members assigned specific tasks and responsibilities" },
    { time: "39:25", duration: "0m 35s", title: "Closing remarks", description: "Summary of decisions and next meeting schedule" },
    { time: "40:00", duration: "0m 15s", title: "Post-meeting discussion", description: "Brief informal discussion after main agenda" },
  ];

  const questions = [
    { time: "03:45", speaker: "Rajpal Rathod", question: "How much time should we allocate to the forecasting model specifically?", answered: true },
    { time: "08:20", speaker: "Mihir", question: "What's the priority level for the dashboard hosting task?", answered: true },
    { time: "12:10", speaker: "Snehal Pawar", question: "Should we focus on local or overseas candidates first?", answered: true },
    { time: "18:35", speaker: "Nishtha", question: "What's the expected ROI timeline for the Twilio integration?", answered: false },
    { time: "24:50", speaker: "Adi Vora", question: "How do we handle refunds if clients are unsatisfied?", answered: true },
    { time: "28:15", speaker: "Rajpal Rathod", question: "What documentation do we need for the deposit process?", answered: false },
    { time: "33:40", speaker: "Nish", question: "Can we scale the AI agents to handle multiple calls simultaneously?", answered: true },
  ];

  const keywords = [
    { word: "AI agents", count: 24, category: "Technology" },
    { word: "Customer intelligence", count: 18, category: "Product" },
    { word: "Revenue agent", count: 15, category: "Feature" },
    { word: "Twilio", count: 12, category: "Integration" },
    { word: "Dashboard", count: 11, category: "Product" },
    { word: "Forecasting model", count: 10, category: "Feature" },
    { word: "Deposit", count: 9, category: "Pricing" },
    { word: "UI/UX intern", count: 8, category: "Hiring" },
    { word: "Supabase", count: 7, category: "Technology" },
    { word: "Backend pipeline", count: 6, category: "Technology" },
    { word: "Timeline", count: 5, category: "Project Management" },
    { word: "Budget", count: 5, category: "Finance" },
  ];

  const participants = [
    "Tasknova",
    "Rajpal Rathod",
    "Aarav Tasknova",
    "Snehal Pawar",
    "Mihir",
    "Adi Vora",
    "Aarav Tasknova",
    "Nishtha",
    "Group: C Efdbaadabaadc abdafeeedbf",
    "Nish",
    "Contact Tasknova",
  ];

  const keyTakeaways = [
    "Commitment made to allocate five hours daily exclusively on AI agents and customer intelligence, targeting completion of revenue agent features and forecasting model exploration within 2-3 days.",
    "Job postings to be created for UI/UX interns skilled in design thinking, alongside sourcing backend AI pipeline candidates, including outreach to potential overseas hires.",
    "Anshita's dashboard hosting on Supabase to be handled immediately by Mihir, who will assist in deploying and re-starting the static dashboard hosting.",
    "Plan established to purchase Twilio numbers and attach AI agents for automated client follow-up calls, with costs estimated at ₹5-6 per call and a trial budget.",
    "A refundable deposit of ₹10,000 is required to ensure seriousness and cover initial setup expenses, with refund pledged if no value is delivered.",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to={`/${basePath}/meetings`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">{meeting.title}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {meeting.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {meeting.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {meeting.participants}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  By {meeting.organizer}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {meeting.type}
              </Badge>
              <Button variant="ghost" size="sm" className="gap-2 text-blue-600">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="w-4 h-4" />
                Send email
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Video and Analysis */}
        <div className="w-[520px] border-r border-gray-200 bg-white overflow-y-auto">
          {/* Video Player */}
          <div className="p-4">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-16 h-16 text-white/50" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60">
                <div className="flex items-center justify-between">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Play className="w-4 h-4 mr-2" />
                    No Recording Available
                  </Button>
                  <div className="text-white text-sm">00:00 / 40:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center px-4">
              <button
                onClick={() => setActiveTab("insights")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "insights"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Insights
                </span>
              </button>
              <button
                onClick={() => setActiveTab("chapters")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "chapters"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Auto Chapters
                  <Badge variant="secondary" className="text-xs">
                    {autoChapters.length}
                  </Badge>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("questions")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "questions"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Questions
                  <Badge variant="secondary" className="text-xs">
                    {questions.length}
                  </Badge>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("keywords")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "keywords"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Keywords
                  <Badge variant="secondary" className="text-xs">
                    {keywords.length}
                  </Badge>
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === "insights" && (
              <>
                {/* Topics */}
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase mb-2">TOPICS</h3>
                  <div className="flex gap-2">
                    {insights.map((insight, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {insight.label} {insight.count > 0 && `(${insight.count})`}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Speakers */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase mb-3">SPEAKERS</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    TASKNOVA <span className="float-right">Total Talk Time : 97% (12 Min)</span>
                  </div>
                  <div className="space-y-3">
                    {speakers.map((speaker, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${speaker.color} flex items-center justify-center text-white text-xs font-semibold`}>
                          {speaker.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{speaker.name}</span>
                            {speaker.role && (
                              <span className="text-xs text-gray-500">, {speaker.role}</span>
                            )}
                            <span className="ml-auto text-sm text-blue-600 font-medium">
                              Talk Time: {speaker.talkTime} ({speaker.duration})
                            </span>
                          </div>
                          <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${speaker.color}`}
                              style={{ width: speaker.talkTime }}
                            ></div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <div className="font-medium mb-1">OTHERS</div>
                    <div className="text-xs text-gray-500">
                      Total Talk Time : 3% (0 Min)
                    </div>
                  </div>
                </div>

                {/* Longest Monologue */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                        A
                      </div>
                      <span className="text-sm font-medium text-gray-900">LONGEST MONOLOGUE</span>
                    </div>
                    <span className="text-sm text-orange-600 font-medium">
                      Talk Time: 6m 55s
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: "85%" }}></div>
                  </div>
                </div>

                {/* Longest Customer Story */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                        C
                      </div>
                      <span className="text-sm font-medium text-gray-900">LONGEST CUSTOMER STORY</span>
                    </div>
                    <span className="text-sm text-yellow-600 font-medium">
                      Talk Time: 0m 17s
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: "20%" }}></div>
                  </div>
                </div>

                {/* Sentiment */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase mb-3">SENTIMENT</h3>
                  <div className="flex items-center gap-4 mb-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      Positive
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                      Neutral
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      Negative
                    </span>
                  </div>
                  <div className="h-24 relative">
                    <div className="absolute bottom-0 left-0 right-0 h-full flex items-end gap-1">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-green-500 rounded-t"
                          style={{
                            height: `${Math.random() * 60 + 20}%`,
                            backgroundColor: Math.random() > 0.7 ? "#ef4444" : Math.random() > 0.5 ? "#9ca3af" : "#22c55e",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "chapters" && (
              <div className="space-y-3">
                {autoChapters.map((chapter, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-600">{chapter.time}</span>
                        <Badge variant="outline" className="text-xs">
                          {chapter.duration}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{chapter.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{chapter.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "questions" && (
              <div className="space-y-3">
                {questions.map((question, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-600">{question.time}</span>
                        <span className="text-xs text-gray-600">{question.speaker}</span>
                      </div>
                      <Badge
                        variant={question.answered ? "default" : "secondary"}
                        className={`text-xs ${question.answered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {question.answered ? "Answered" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-900">{question.question}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "keywords" && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search keywords..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {keywords.map((keyword, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">{keyword.word}</span>
                        <Badge variant="secondary" className="text-xs">
                          {keyword.count}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{keyword.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Notes and Content */}
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="p-6">
            {/* Template Selector */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Current template</div>
                  <div className="text-sm font-semibold text-blue-900">Daily Standup</div>
                </div>
                <Button variant="link" className="text-blue-600 text-sm">
                  <FileText className="w-4 h-4 mr-1" />
                  Change Template
                </Button>
              </div>
            </div>

            {/* Rich Text Toolbar */}
            <div className="mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  H1
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  H2
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  H3
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <strong>B</strong>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <em>I</em>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <u>U</u>
                </Button>
              </div>
            </div>

            {/* Participants */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Participants</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {participants.map((participant, idx) => (
                  <li key={idx}>{participant}</li>
                ))}
              </ul>
            </div>

            {/* Key Takeaways */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Takeaways</h2>
              <ul className="list-disc list-inside space-y-3 text-sm text-gray-700">
                {keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="leading-relaxed">{takeaway}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}