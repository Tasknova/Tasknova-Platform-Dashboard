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
  Target,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { activities } from "../../data/activities-data";

export function RepCallDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState<"summary" | "transcript" | "notes" | "chat">("summary");
  const [activeLeftTab, setActiveLeftTab] = useState<"insights" | "chapters" | "questions" | "keywords">("insights");
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
    // Create a simple text export
    const exportData = `
Call Details Export
==================
Title: ${activity?.title}
Contact: ${activity?.contactName}
Company: ${activity?.company}
Date: ${activity?.timestamp}
Duration: 2 mins 31 secs
Deal Value: ${activity?.dealValue}
Stage: ${activity?.stage}

Summary: Discovery call went well. Customer is interested in AI capabilities and integration options.
    `.trim();
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-${id}-export.txt`;
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

  const keyTakeaways = [
    `${activity.company} is interested in AI-powered conversation intelligence to improve sales team performance.`,
    `Pricing discussion focused on $5 per user/month for basic features and $100/month for enterprise package.`,
    `Follow-up scheduled for next Tuesday to discuss implementation timeline and onboarding process.`,
    `Customer requested case studies from similar companies in their industry before making final decision.`,
  ];

  const actionItems = [
    { task: "Send follow-up email with case studies and ROI calculator", completed: false, dueDate: "Today" },
    { task: "Schedule demo call with technical team for next Tuesday", completed: false, dueDate: "Tomorrow" },
    { task: "Prepare pricing proposal with custom enterprise features", completed: false, dueDate: "Nov 18" },
  ];

  const totalDuration = 151;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
                    <Calendar className="w-3 h-3" />
                    {activity.timestamp}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    2 mins
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    2 participants
                  </span>
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
          <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-5xl font-bold mb-2">{activity.company}</div>
                <p className="text-lg opacity-90">Discovery Call</p>
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
                    className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
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
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
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
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 inline mr-1.5" />
                My Insights
              </button>
              <button
                onClick={() => setActiveLeftTab("chapters")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "chapters"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-3.5 h-3.5 inline mr-1.5" />
                Chapters
              </button>
              <button
                onClick={() => setActiveLeftTab("questions")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "questions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 inline mr-1.5" />
                Questions
              </button>
              <button
                onClick={() => setActiveLeftTab("keywords")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "keywords"
                    ? "border-blue-500 text-blue-600"
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
            {/* Topics */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                TOPICS DISCUSSED
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500 text-white border-0 text-xs font-medium px-2.5 py-1 uppercase">
                  INTROS
                </Badge>
                <Badge className="bg-orange-500 text-white border-0 text-xs font-medium px-2.5 py-1 uppercase">
                  DISCOVERY
                </Badge>
                <Badge className="bg-purple-500 text-white border-0 text-xs font-medium px-2.5 py-1 uppercase">
                  PRICING
                </Badge>
                <Badge className="bg-green-600 text-white border-0 text-xs font-medium px-2.5 py-1 uppercase">
                  NEXT STEPS
                </Badge>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-semibold text-green-900">Recommended Next Steps</h3>
              </div>
              <ul className="space-y-2 text-xs text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Send follow-up email within 2 hours while conversation is fresh</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Include case studies for companies in their industry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Schedule technical demo for next week</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Notes & Actions */}
        <div className="bg-white">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center px-4">
              <button
                onClick={() => setActiveRightTab("summary")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "summary"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                Summary
              </button>
              <button
                onClick={() => setActiveRightTab("actions")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "actions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" />
                Action Items
              </button>
              <button
                onClick={() => setActiveRightTab("transcript")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "transcript"
                    ? "border-blue-500 text-blue-600"
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
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
                AI Chat
              </button>
            </div>
          </div>

          {/* Summary Tab */}
          {activeRightTab === "summary" && (
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              {/* Template Selector */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600 uppercase tracking-wide">Current template</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 text-xs h-auto p-0"
                  >
                    Change Template
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600">Tasknova Sales Call</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Rich Text Toolbar */}
              <div className="mb-3 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-1 flex-wrap">
                  <select className="h-7 px-2 text-xs border border-gray-300 rounded bg-white">
                    <option>H1</option>
                    <option>H2</option>
                    <option>H3</option>
                  </select>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Bold className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Italic className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Underline className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Strikethrough className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <AlignLeft className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <AlignCenter className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <AlignRight className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <List className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <ListOrdered className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <LinkIcon className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <ImageIcon className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Participants */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Participants</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-700">
                    <span className="font-medium">Tasknova:</span> You
                  </li>
                  <li className="text-sm text-gray-700">
                    <span className="font-medium">{activity.company}:</span> {activity.contactName}
                  </li>
                </ul>
              </div>

              {/* Key Takeaways */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Takeaways</h3>
                <ul className="space-y-2.5">
                  {keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action Items Tab */}
          {activeRightTab === "actions" && (
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Your Action Items</h3>
                <p className="text-xs text-gray-500">Complete these to move the deal forward</p>
              </div>

              <div className="space-y-3">
                {actionItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <button className="mt-0.5">
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded hover:border-blue-400 transition-colors" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium mb-1">{item.task}</p>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs ${
                              item.dueDate === "Today"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : item.dueDate === "Tomorrow"
                                ? "bg-orange-100 text-orange-700 border-orange-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            Due: {item.dueDate}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Add New Action Item
              </Button>
            </div>
          )}

          {/* Transcript Tab */}
          {activeRightTab === "transcript" && (
            <div className="p-4 space-y-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    YOU
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">You</p>
                      <span className="text-xs text-gray-500">0:05</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Hi {activity.contactName}, thanks for joining today. I'm excited to discuss how Tasknova can help{" "}
                      {activity.company} improve your sales team's performance.
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
                      Great to be here! We're particularly interested in understanding your AI capabilities and how they can integrate with our existing systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Chat */}
          {activeRightTab === "chat" && (
            <div className="p-4 flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Get instant answers about this call</h3>
                <p className="text-xs text-gray-500">Ask AI anything about your performance</p>
              </div>

              <div className="space-y-2 mb-4">
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-lg text-xs text-blue-900 font-medium transition-colors">
                  Compare my discovery questions to top performers
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-lg text-xs text-purple-900 font-medium transition-colors">
                  What specific objections did I miss or handle poorly?
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-lg text-xs text-green-900 font-medium transition-colors">
                  Generate a personalized follow-up email based on this call
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 rounded-lg text-xs text-orange-900 font-medium transition-colors">
                  Which parts of my pitch resonated most with the customer?
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 border border-pink-200 rounded-lg text-xs text-pink-900 font-medium transition-colors">
                  How does this call compare to my last 10 closed deals?
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
                    placeholder="Ask AI anything about this call..."
                    className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <Button onClick={() => setShowShareModal(false)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
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