import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume1,
  Maximize2,
  Share2,
  Link2,
  Sparkles,
  FileText,
  MessageSquare,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  SkipForward,
  SkipBack,
  RotateCcw,
  RotateCw,
  Subtitles,
  Download,
  Copy,
  MoreVertical,
  ChevronDown,
  Zap,
  Key,
  Tag,
  List,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  MessageCircle,
  HelpCircle,
  BarChart3,
  ShoppingCart,
  Award,
  Bell,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Target,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  FileQuestion,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { activities } from "../../data/activities-data";

export function ManagerCallDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState<"coaching" | "scorecard" | "transcript" | "notes" | "alerts" | "chat">("coaching");
  const [activeLeftTab, setActiveLeftTab] = useState<"insights" | "chapters" | "questions" | "keywords" | "performance">("insights");
  const [showingHide, setShowingHide] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const activity = activities.find((a) => a.id === id);

  const handleCopyLink = () => {
    const url = window.location.href;
    
    // Fallback method for clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleSyncToCRM = () => {
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2000);
  };

  const handleExport = () => {
    const exportData = `
Call Details Export - Manager View
==================================
Title: ${activity?.title}
Rep: ${activity?.contactName}
Contact: ${activity?.contactName}
Company: ${activity?.company}
Date: ${activity?.timestamp}
Duration: 2 mins 31 secs
Deal Value: ${activity?.dealValue}
Stage: ${activity?.stage}

Coaching Insights: Strong discovery questions, talk time imbalance noted, objection handling needs improvement.
    `.trim();
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-${id}-manager-export.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!activity) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Call Not Found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const coachingInsights = [
    {
      type: "positive",
      title: "Strong Discovery Questions",
      description: "Rep asked 8 open-ended questions, 30% above team average. Great job uncovering pain points.",
      timestamp: "2:15",
    },
    {
      type: "warning",
      title: "Talk Time Imbalance",
      description: "Rep talked for 58% of the call. Best practice is 40-50%. Coach on active listening.",
      timestamp: "5:30",
    },
    {
      type: "negative",
      title: "Missed Objection Handling",
      description: "Pricing objection wasn't fully addressed. Opportunity to coach on objection handling framework.",
      timestamp: "7:45",
    },
    {
      type: "positive",
      title: "Excellent Next Steps",
      description: "Clear mutual action plan established with specific dates and deliverables.",
      timestamp: "9:20",
    },
  ];

  const scorecard = {
    overall: 78,
    categories: [
      { name: "Discovery & Qualification", score: 85, target: 80 },
      { name: "Active Listening", score: 62, target: 75 },
      { name: "Value Proposition", score: 90, target: 85 },
      { name: "Objection Handling", score: 58, target: 75 },
      { name: "Next Steps & Close", score: 92, target: 80 },
    ],
  };

  const totalDuration = 151;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const parseTimestamp = (timestamp: string): number => {
    const parts = timestamp.split(":");
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return minutes * 60 + seconds;
  };

  const jumpToMoment = (timestamp: string) => {
    const seconds = parseTimestamp(timestamp);
    setCurrentTime(seconds);
    setActiveLeftTab("insights");
    // Scroll to top to see video
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = Math.floor(percentage * totalDuration);
    setCurrentTime(newTime);
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
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
                <h1 className="text-lg font-semibold text-gray-900">{activity.title}</h1>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Rep: {activity.contactName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {activity.timestamp}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    2 mins
                  </span>
                  <span>•</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Score: {scorecard.overall}/100
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleSyncToCRM}>
                <Download className="w-3 h-3 mr-1.5" />
                Sync to CRM
                {syncSuccess && <span className="text-green-500 ml-1">✓</span>}
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleCopyLink}>
                <Copy className="w-3 h-3 mr-1.5" />
                Copy Link
                {copySuccess && <span className="text-green-500 ml-1">✓</span>}
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowShareModal(true)}>
                <Link2 className="w-3 h-3 mr-1.5" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleExport}>
                <Share2 className="w-3 h-3 mr-1.5" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs px-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[1fr,480px] gap-0">
        {/* Left Side - Video & Analysis */}
        <div className="bg-white border-r border-gray-200">
          {/* Video Player */}
          <div className="relative bg-gradient-to-br from-purple-400 to-purple-600 aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-5xl font-bold mb-2">{activity.company}</div>
                <p className="text-lg opacity-90">Team Call Review</p>
              </div>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-black/60 transition-colors">
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" />
                )}
              </div>
            </button>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-1 bg-white/30 rounded-full relative cursor-pointer" onClick={handleProgressClick}>
                  <div
                    className="absolute inset-y-0 left-0 bg-purple-500 rounded-full"
                    style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 hover:bg-white/20 rounded transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button className="p-1.5 hover:bg-white/20 rounded transition-colors">
                    <SkipBack className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-1.5 hover:bg-white/20 rounded transition-colors">
                    <SkipForward className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-1.5 hover:bg-white/20 rounded transition-colors">
                    <RotateCcw className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-1.5 hover:bg-white/20 rounded transition-colors">
                    <RotateCw className="w-4 h-4 text-white" />
                  </button>
                  <button className="px-2 py-1 hover:bg-white/20 rounded transition-colors text-white text-xs font-medium">
                    {playbackSpeed}x
                  </button>
                  <button className="p-1.5 hover:bg-white/20 rounded transition-colors">
                    <Volume1 className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-1.5 hover:bg-white/20 rounded transition-colors">
                    <Subtitles className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white text-xs ml-2">
                    {formatTime(currentTime)} / {formatTime(totalDuration)}
                  </span>
                </div>

                <button className="p-1.5 hover:bg-white/20 rounded transition-colors">
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-b border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Award className="w-3.5 h-3.5 mr-1.5" />
                  Coach Rep
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 uppercase font-medium">
                  {showingHide ? "SHOWING" : "HIDE"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setShowingHide(!showingHide)}
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Tag className="w-3.5 h-3.5 mr-1.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Analysis Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center gap-1 px-3">
              <button
                onClick={() => setActiveLeftTab("insights")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "insights"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 inline mr-1.5" />
                Coach Insights
              </button>
              <button
                onClick={() => setActiveLeftTab("performance")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "performance"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 inline mr-1.5" />
                Performance
              </button>
              <button
                onClick={() => setActiveLeftTab("questions")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "questions"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 inline mr-1.5" />
                Questions (8)
              </button>
              <button
                onClick={() => setActiveLeftTab("keywords")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "keywords"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Key className="w-3.5 h-3.5 inline mr-1.5" />
                Keywords
              </button>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 520px)" }}>
            {/* Performance Comparison */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-900 mb-3">Rep vs Team Average</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-purple-700 mb-1">Talk Time</p>
                  <p className="text-lg font-bold text-purple-900">58%</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-red-600" />
                    <span className="text-red-600">+18% vs avg</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-purple-700 mb-1">Questions</p>
                  <p className="text-lg font-bold text-purple-900">8</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">+30% vs avg</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-purple-700 mb-1">Engagement</p>
                  <p className="text-lg font-bold text-purple-900">High</p>
                  <div className="flex items-center gap-1 text-xs">
                    <ThumbsUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">Above avg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deal Health */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Deal Health Score</h3>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  Medium Risk
                </Badge>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Budget Confirmed</span>
                  <XCircle className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Decision Maker Present</span>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Timeline Discussed</span>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Competition Mentioned</span>
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Topics */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                CONVERSATION FLOW
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500 text-white border-0 text-xs font-medium px-2.5 py-1">
                    0:00 - 1:30
                  </Badge>
                  <span className="text-xs text-gray-700">INTROS & RAPPORT</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500 text-white border-0 text-xs font-medium px-2.5 py-1">
                    1:30 - 5:00
                  </Badge>
                  <span className="text-xs text-gray-700">DISCOVERY QUESTIONS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-500 text-white border-0 text-xs font-medium px-2.5 py-1">
                    5:00 - 7:30
                  </Badge>
                  <span className="text-xs text-gray-700">PRICING DISCUSSION</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600 text-white border-0 text-xs font-medium px-2.5 py-1">
                    7:30 - 10:00
                  </Badge>
                  <span className="text-xs text-gray-700">NEXT STEPS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Coaching & Scorecards */}
        <div className="bg-white">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center px-4">
              <button
                onClick={() => setActiveRightTab("coaching")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "coaching"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Award className="w-3.5 h-3.5 inline mr-1.5" />
                Coaching
              </button>
              <button
                onClick={() => setActiveRightTab("scorecard")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "scorecard"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5 inline mr-1.5" />
                Scorecard
              </button>
              <button
                onClick={() => setActiveRightTab("alerts")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "alerts"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Bell className="w-3.5 h-3.5 inline mr-1.5" />
                Alerts (3)
              </button>
              <button
                onClick={() => setActiveRightTab("notes")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "notes"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                Notes
              </button>
              <button
                onClick={() => setActiveRightTab("transcript")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "transcript"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 inline mr-1.5" />
                Transcript
              </button>
              <button
                onClick={() => setActiveRightTab("chat")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "chat"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
                AI Chat
              </button>
            </div>
          </div>

          {/* Coaching Tab */}
          {activeRightTab === "coaching" && (
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">AI Coaching Insights</h3>
                <p className="text-xs text-gray-500">Key moments to discuss with your rep</p>
              </div>

              <div className="space-y-3">
                {coachingInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-lg p-3 ${
                      insight.type === "positive"
                        ? "border-green-200 bg-green-50"
                        : insight.type === "warning"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {insight.type === "positive" ? (
                        <ThumbsUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : insight.type === "warning" ? (
                        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <ThumbsDown className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {insight.timestamp}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-700">{insight.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 h-7 text-xs"
                      onClick={() => jumpToMoment(insight.timestamp)}
                    >
                      Jump to Moment
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="text-sm font-semibold text-purple-900 mb-2">Coaching Action Items</h4>
                <ul className="space-y-1.5 text-xs text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>Schedule 1:1 to discuss active listening techniques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>Role-play objection handling scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>Share best practice recording on pricing discussions</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Scorecard Tab */}
          {activeRightTab === "scorecard" && (
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="mb-4 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-3">
                  <span className="text-3xl font-bold text-green-700">{scorecard.overall}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Overall Call Score</h3>
                <p className="text-xs text-gray-500">Above team average (72)</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Category Breakdown
                </h4>
                {scorecard.categories.map((category, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{category.score}/100</span>
                        {category.score >= category.target ? (
                          <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          category.score >= category.target
                            ? "bg-green-500"
                            : category.score >= category.target - 10
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${category.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Target: {category.target}</p>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
                <Award className="w-4 h-4 mr-2" />
                Send Scorecard to Rep
              </Button>
            </div>
          )}

          {/* Alerts Tab */}
          {activeRightTab === "alerts" && (
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="space-y-3">
                <div className="border border-red-200 bg-red-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-900 mb-1">Competitor Mentioned</h4>
                      <p className="text-xs text-red-800 mb-2">
                        Prospect mentioned "Gong" as alternative solution at 6:45
                      </p>
                      <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                        High Priority
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-yellow-900 mb-1">Budget Not Confirmed</h4>
                      <p className="text-xs text-yellow-800 mb-2">
                        No clear budget discussion detected in this call
                      </p>
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                        Medium Priority
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Next Steps Confirmed</h4>
                      <p className="text-xs text-blue-800 mb-2">
                        Follow-up demo scheduled for next Tuesday at 2pm
                      </p>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                        Info
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeRightTab === "notes" && (
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Manager Notes</h3>
                <textarea
                  className="w-full h-32 p-3 border border-gray-300 rounded text-sm"
                  placeholder="Add private coaching notes..."
                />
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Call Summary</h3>
                <p className="text-sm text-gray-700">
                  Rep conducted discovery call with {activity.company}. Strong questioning but needs improvement on talk time and objection handling. Deal shows medium risk due to competitor mention and lack of budget confirmation.
                </p>
              </div>
            </div>
          )}

          {/* Transcript Tab */}
          {activeRightTab === "transcript" && (
            <div className="p-4 space-y-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    REP
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">Sales Rep</p>
                      <span className="text-xs text-gray-500">0:05</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Hi everyone, thanks for joining today. I'm excited to discuss how we can help {activity.company} improve their workflow.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {activity.contactName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">{activity.contactName}</p>
                      <span className="text-xs text-gray-500">0:12</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Great to be here! We're particularly interested in your AI capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Chat Tab */}
          {activeRightTab === "chat" && (
            <div className="p-4 flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Get instant answers about this call</h3>
                <p className="text-xs text-gray-500">Ask AI anything about team performance</p>
              </div>

              <div className="space-y-2 mb-4">
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-lg text-xs text-purple-900 font-medium transition-colors">
                  What coaching moments would have the biggest impact on this rep?
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-lg text-xs text-blue-900 font-medium transition-colors">
                  Compare this rep's objection handling to team benchmarks
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-lg text-xs text-green-900 font-medium transition-colors">
                  Generate a coaching plan based on this call's scorecard
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 rounded-lg text-xs text-orange-900 font-medium transition-colors">
                  What patterns indicate this deal will close or stall?
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 border border-pink-200 rounded-lg text-xs text-pink-900 font-medium transition-colors">
                  How does this call compare to this rep's won vs lost deals?
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {/* Example AI responses would go here */}
                <div className="text-xs text-gray-500 text-center py-8">
                  Select a prompt or type your own question below
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask AI anything about this call or rep..."
                    className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Press Enter or click to send</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Call</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share with team members</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="allowComments" className="rounded" />
                <label htmlFor="allowComments" className="text-sm text-gray-700">Allow comments</label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={() => setShowShareModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setShowShareModal(false)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}