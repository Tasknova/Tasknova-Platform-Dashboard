import { useState } from "react";
import { 
  MessageCircle, 
  BookOpen, 
  Video, 
  HelpCircle, 
  X, 
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Send
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface SupportWidgetProps {
  userPlan?: "trial" | "starter" | "professional" | "enterprise";
  csmName?: string;
  csmEmail?: string;
}

export function SupportWidget({ userPlan = "trial", csmName, csmEmail }: SupportWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"help" | "chat" | "csm">("help");
  const [message, setMessage] = useState("");

  const hasCSM = userPlan === "enterprise" || userPlan === "professional";

  return (
    <>
      {/* Main Widget Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </button>
        </div>
      )}

      {/* Expanded Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-semibold text-sm">Help & Support</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/10 rounded p-1">
              <button
                onClick={() => setActiveTab("help")}
                className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeTab === "help" ? "bg-white text-blue-600" : "text-white/80 hover:text-white"
                }`}
              >
                Help Center
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeTab === "chat" ? "bg-white text-blue-600" : "text-white/80 hover:text-white"
                }`}
              >
                Chat
              </button>
              {hasCSM && (
                <button
                  onClick={() => setActiveTab("csm")}
                  className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    activeTab === "csm" ? "bg-white text-blue-600" : "text-white/80 hover:text-white"
                  }`}
                >
                  Your CSM
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Help Center Tab */}
            {activeTab === "help" && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-blue-900">Getting Started</h4>
                  </div>
                  <p className="text-xs text-blue-800 mb-2">
                    Watch our quick onboarding video to get up and running fast.
                  </p>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs border-blue-300 text-blue-700 hover:bg-blue-100">
                    Watch Now (5 min)
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Popular Articles</h4>
                  {[
                    { icon: BookOpen, title: "How to connect your CRM", time: "3 min read" },
                    { icon: BookOpen, title: "Setting up scorecards", time: "4 min read" },
                    { icon: BookOpen, title: "Understanding deal risk scores", time: "2 min read" },
                    { icon: BookOpen, title: "Inviting team members", time: "2 min read" },
                  ].map((article, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <article.icon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{article.title}</p>
                          <p className="text-xs text-gray-600">{article.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                  <BookOpen className="w-3 h-3 mr-1.5" />
                  Browse All Articles
                </Button>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === "chat" && (
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <HelpCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-xs text-yellow-800 mb-2">
                    Our support team typically responds within 2 hours
                  </p>
                  <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                    Available Now
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">Your Name</label>
                    <Input placeholder="Enter your name" className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">Email</label>
                    <Input type="email" placeholder="your@email.com" className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">How can we help?</label>
                    <Textarea
                      placeholder="Describe your question or issue..."
                      className="text-sm resize-none"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <Button size="sm" className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700">
                    <Send className="w-3 h-3 mr-1.5" />
                    Send Message
                  </Button>
                </div>
              </div>
            )}

            {/* CSM Tab */}
            {activeTab === "csm" && hasCSM && (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {csmName ? csmName.charAt(0) : "S"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {csmName || "Sarah Johnson"}
                      </p>
                      <p className="text-xs text-gray-600">Your Customer Success Manager</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-xs">{csmEmail || "sarah.j@tasknova.ai"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-xs">Schedule a call</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button size="sm" className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700">
                    <Mail className="w-3 h-3 mr-1.5" />
                    Email Your CSM
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                    <Video className="w-3 h-3 mr-1.5" />
                    Schedule Meeting
                  </Button>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-900 mb-2">Quick Tips from Sarah</h4>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Connect your CRM first for best results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Set up scorecards to track team quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Use AI insights to coach your reps</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-600 text-center">
              {userPlan === "trial" && "Upgrade to Professional for dedicated CSM support"}
              {userPlan === "starter" && "Upgrade to Professional for dedicated CSM support"}
              {(userPlan === "professional" || userPlan === "enterprise") && "We're here to help you succeed"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
