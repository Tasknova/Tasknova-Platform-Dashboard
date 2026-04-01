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
  Shield,
  TrendingUp,
  TrendingDown,
  FileCheck,
  AlertTriangle,
  Activity,
  Database,
  Award,
  PieChart,
  Filter,
  FileBarChart,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { activities } from "../../data/activities-data";

export function AdminCallDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState<"analytics" | "compliance" | "transcript" | "notes" | "export" | "chat">("analytics");
  const [activeLeftTab, setActiveLeftTab] = useState<"insights" | "quality" | "sentiment" | "keywords" | "benchmarks">("insights");
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
Call Details Export - Admin View
=================================
Title: ${activity?.title}
Rep: ${activity?.contactName}
Contact: ${activity?.contactName}
Company: ${activity?.company}
Date: ${activity?.timestamp}
Duration: 2 mins 31 secs
Deal Value: ${activity?.dealValue}
Stage: ${activity?.stage}

System Analytics: High performance, AI accuracy 96%, all compliance checks passed.
    `.trim();
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-${id}-admin-export.txt`;
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

  const qualityMetrics = [
    { name: "Audio Quality", score: 95, status: "excellent" },
    { name: "Transcript Accuracy", score: 92, status: "excellent" },
    { name: "Recording Stability", score: 100, status: "excellent" },
    { name: "Noise Level", score: 88, status: "good" },
  ];

  const complianceChecks = [
    { item: "GDPR Consent Verified", status: "pass", details: "Verbal consent recorded at 0:15" },
    { item: "Recording Disclosure", status: "pass", details: "Disclosure statement played" },
    { item: "Data Retention Policy", status: "pass", details: "30-day retention configured" },
    { item: "PII Redaction", status: "warning", details: "1 credit card mention detected" },
  ];

  const sentimentData = {
    overall: "Positive",
    customer: { positive: 65, neutral: 25, negative: 10 },
    rep: { positive: 70, neutral: 20, negative: 10 },
  };

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
                    <Shield className="w-3 h-3 mr-1" />
                    Compliant
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
          <div className="relative bg-gradient-to-br from-slate-400 to-slate-600 aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-5xl font-bold mb-2">{activity.company}</div>
                <p className="text-lg opacity-90">System Analysis View</p>
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
                    className="absolute inset-y-0 left-0 bg-slate-500 rounded-full"
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
                  <FileBarChart className="w-3.5 h-3.5 mr-1.5" />
                  Report
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Database className="w-3.5 h-3.5 mr-1.5" />
                  Archive
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
                    ? "border-slate-500 text-slate-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 inline mr-1.5" />
                System Insights
              </button>
              <button
                onClick={() => setActiveLeftTab("quality")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "quality"
                    ? "border-slate-500 text-slate-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 inline mr-1.5" />
                Quality Metrics
              </button>
              <button
                onClick={() => setActiveLeftTab("sentiment")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "sentiment"
                    ? "border-slate-500 text-slate-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Activity className="w-3.5 h-3.5 inline mr-1.5" />
                Sentiment
              </button>
              <button
                onClick={() => setActiveLeftTab("benchmarks")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "benchmarks"
                    ? "border-slate-500 text-slate-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 inline mr-1.5" />
                Benchmarks
              </button>
              <button
                onClick={() => setActiveLeftTab("keywords")}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeLeftTab === "keywords"
                    ? "border-slate-500 text-slate-600"
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
            {/* System Performance */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Database className="w-4 h-4" />
                System Performance
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-700 mb-1">Processing Time</p>
                  <p className="text-lg font-bold text-slate-900">1.2s</p>
                  <p className="text-xs text-green-600">12% faster</p>
                </div>
                <div>
                  <p className="text-xs text-slate-700 mb-1">AI Accuracy</p>
                  <p className="text-lg font-bold text-slate-900">96%</p>
                  <p className="text-xs text-green-600">Above target</p>
                </div>
                <div>
                  <p className="text-xs text-slate-700 mb-1">Storage Used</p>
                  <p className="text-lg font-bold text-slate-900">45MB</p>
                  <p className="text-xs text-gray-600">Within quota</p>
                </div>
                <div>
                  <p className="text-xs text-slate-700 mb-1">Cost</p>
                  <p className="text-lg font-bold text-slate-900">$0.23</p>
                  <p className="text-xs text-gray-600">Per call</p>
                </div>
              </div>
            </div>

            {/* Quality Metrics */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                QUALITY METRICS
              </h3>
              <div className="space-y-2.5">
                {qualityMetrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{metric.score}%</span>
                        {metric.status === "excellent" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          metric.status === "excellent"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organization Benchmarks */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                vs Organization Average
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Call Duration</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">2:31</span>
                    <span className="text-gray-500">(Avg: 8:45)</span>
                    <TrendingDown className="w-3 h-3 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Conversion Rate</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">High</span>
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Customer Satisfaction</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">4.5/5</span>
                    <span className="text-gray-500">(Avg: 4.2)</span>
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Topics */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                DETECTED TOPICS
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500 text-white border-0 text-xs font-medium px-2.5 py-1 uppercase">
                  SALES
                </Badge>
                <Badge className="bg-orange-500 text-white border-0 text-xs font-medium px-2.5 py-1 uppercase">
                  DISCOVERY
                </Badge>
                <Badge className="bg-purple-500 text-white border-0 text-xs font-medium px-2.5 py-1 uppercase">
                  PRICING
                </Badge>
                <Badge className="bg-green-600 text-white border-0 text-xs font-medium px-2.5 py-1 uppercase">
                  INTEGRATION
                </Badge>
                <Badge className="bg-red-500 text-white border-0 text-xs font-medium px-2.5 py-1 uppercase">
                  COMPETITOR
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Analytics & Compliance */}
        <div className="bg-white">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center px-4">
              <button
                onClick={() => setActiveRightTab("analytics")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "analytics"
                    ? "border-slate-500 text-slate-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 inline mr-1.5" />
                Analytics
              </button>
              <button
                onClick={() => setActiveRightTab("compliance")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "compliance"
                    ? "border-slate-500 text-slate-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Shield className="w-3.5 h-3.5 inline mr-1.5" />
                Compliance
              </button>
              <button
                onClick={() => setActiveRightTab("transcript")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "transcript"
                    ? "border-slate-500 text-slate-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 inline mr-1.5" />
                Transcript
              </button>
              <button
                onClick={() => setActiveRightTab("export")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "export"
                    ? "border-slate-500 text-slate-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Download className="w-3.5 h-3.5 inline mr-1.5" />
                Export
              </button>
              <button
                onClick={() => setActiveRightTab("chat")}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeRightTab === "chat"
                    ? "border-slate-500 text-slate-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
                AI Chat
              </button>
            </div>
          </div>

          {/* Analytics Tab */}
          {activeRightTab === "analytics" && (
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Advanced Analytics</h3>
                <p className="text-xs text-gray-500">Deep insights and metrics</p>
              </div>

              {/* Sentiment Analysis */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Sentiment Analysis</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-700">Customer Sentiment</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {sentimentData.overall}
                      </Badge>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div
                        className="bg-green-500 rounded-l"
                        style={{ width: `${sentimentData.customer.positive}%` }}
                      />
                      <div
                        className="bg-gray-300"
                        style={{ width: `${sentimentData.customer.neutral}%` }}
                      />
                      <div
                        className="bg-red-500 rounded-r"
                        style={{ width: `${sentimentData.customer.negative}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                      <span>{sentimentData.customer.positive}% Positive</span>
                      <span>{sentimentData.customer.neutral}% Neutral</span>
                      <span>{sentimentData.customer.negative}% Negative</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-700">Rep Sentiment</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div
                        className="bg-green-500 rounded-l"
                        style={{ width: `${sentimentData.rep.positive}%` }}
                      />
                      <div
                        className="bg-gray-300"
                        style={{ width: `${sentimentData.rep.neutral}%` }}
                      />
                      <div
                        className="bg-red-500 rounded-r"
                        style={{ width: `${sentimentData.rep.negative}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                      <span>{sentimentData.rep.positive}% Positive</span>
                      <span>{sentimentData.rep.neutral}% Neutral</span>
                      <span>{sentimentData.rep.negative}% Negative</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Talk Statistics */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Talk Statistics</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Total Words Spoken</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Speaking Rate (WPM)</span>
                    <span className="font-medium">145</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Longest Monologue</span>
                    <span className="font-medium">45 seconds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Question Count</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Filler Words</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Engagement Score</h4>
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-slate-900">8.4</div>
                  <p className="text-xs text-gray-500">out of 10</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Interaction Quality</span>
                    <Badge className="bg-green-100 text-green-700 border-green-200">High</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Response Time</span>
                    <Badge className="bg-green-100 text-green-700 border-green-200">Fast</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Topic Relevance</span>
                    <Badge className="bg-green-100 text-green-700 border-green-200">Strong</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeRightTab === "compliance" && (
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Compliance Report</h3>
                <p className="text-xs text-gray-500">Regulatory and policy checks</p>
              </div>

              <div className="space-y-3">
                {complianceChecks.map((check, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-lg p-3 ${
                      check.status === "pass"
                        ? "border-green-200 bg-green-50"
                        : "border-yellow-200 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {check.status === "pass" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{check.item}</h4>
                        <p className="text-xs text-gray-700">{check.details}</p>
                      </div>
                      <Badge
                        className={`${
                          check.status === "pass"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {check.status === "pass" ? "Pass" : "Review"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Compliance Summary</h4>
                <div className="text-xs text-slate-700">
                  <p className="mb-2">
                    <strong>Status:</strong> 3 of 4 checks passed, 1 requires review
                  </p>
                  <p className="mb-2">
                    <strong>Risk Level:</strong> Low
                  </p>
                  <p>
                    <strong>Action Required:</strong> Review PII redaction for credit card mention
                  </p>
                </div>
              </div>

              <Button className="w-full mt-4 bg-slate-600 hover:bg-slate-700 text-white">
                <FileCheck className="w-4 h-4 mr-2" />
                Generate Compliance Report
              </Button>
            </div>
          )}

          {/* Transcript Tab */}
          {activeRightTab === "transcript" && (
            <div className="p-4 space-y-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Full Transcript</h3>
                  <p className="text-xs text-gray-500">AI-generated with 96% accuracy</p>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Filter className="w-3 h-3 mr-1.5" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    REP
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">Sales Rep</p>
                      <span className="text-xs text-gray-500">0:05</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Positive
                      </Badge>
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
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Positive
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">
                      Great to be here! We're particularly interested in your AI capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Export Tab */}
          {activeRightTab === "export" && (
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Export Options</h3>
                <p className="text-xs text-gray-500">Download call data in various formats</p>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Transcript (TXT)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileBarChart className="w-4 h-4 mr-2" />
                  Export Analytics (CSV)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Recording (MP4)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Export Compliance Report (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  Export Full Data (JSON)
                </Button>
              </div>

              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Bulk Export</h4>
                <p className="text-xs text-blue-800 mb-3">
                  Export multiple calls or generate organization-wide reports
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Configure Bulk Export
                </Button>
              </div>
            </div>
          )}

          {/* AI Chat Tab */}
          {activeRightTab === "chat" && (
            <div className="p-4 flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Get instant answers about this call</h3>
                <p className="text-xs text-gray-500">Ask AI anything about system performance</p>
              </div>

              <div className="space-y-2 mb-4">
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium transition-colors">
                  What's the ROI of AI features used in this call?
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-lg text-xs text-blue-900 font-medium transition-colors">
                  Compare system performance metrics across all regions
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-lg text-xs text-green-900 font-medium transition-colors">
                  Identify compliance risks across similar call patterns
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 rounded-lg text-xs text-orange-900 font-medium transition-colors">
                  Which AI models are underperforming this quarter?
                </button>
                <button className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-lg text-xs text-purple-900 font-medium transition-colors">
                  Generate cost optimization report for conversation intelligence
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
                    placeholder="Ask AI anything about system analytics..."
                    className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-colors">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
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
                <Button onClick={() => setShowShareModal(false)} className="flex-1 bg-slate-600 hover:bg-slate-700 text-white">
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