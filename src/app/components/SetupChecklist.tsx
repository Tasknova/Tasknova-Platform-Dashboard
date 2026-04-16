import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Mail,
  Database, 
  FileText, 
  Target,
  Tag,
  Users,
  GitBranch,
  ChevronLeft,
  ChevronDown
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { checkGmailConnection } from "../../lib/gmailApi";

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  icon: React.ElementType;
  path?: string;
  description: string;
}

interface SetupChecklistProps {
  onNavigate?: (path: string) => void;
}

export function SetupChecklist({ onNavigate }: SetupChecklistProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(
    localStorage.getItem("calendarConnected") === "true"
  );
  const [isGmailConnected, setIsGmailConnected] = useState(
    localStorage.getItem("gmailConnected") === "true"
  );
  const [isCrmConnected, setIsCrmConnected] = useState(
    localStorage.getItem("crmConnected") === "true"
  );
  const location = useLocation();

  useEffect(() => {
    let ignore = false;

    const loadIntegrationStatus = async () => {
      const calendarConnected = localStorage.getItem("calendarConnected") === "true";
      if (!ignore) {
        setIsCalendarConnected(calendarConnected);
      }

      try {
        const gmailConnected = await checkGmailConnection();
        localStorage.setItem("gmailConnected", gmailConnected ? "true" : "false");
        if (!ignore) {
          setIsGmailConnected(gmailConnected);
        }
      } catch {
        if (!ignore) {
          setIsGmailConnected(localStorage.getItem("gmailConnected") === "true");
        }
      }

      if (!ignore) {
        setIsCrmConnected(localStorage.getItem("crmConnected") === "true");
      }
    };

    loadIntegrationStatus();

    const handleGmailStatusChange = () => {
      void loadIntegrationStatus();
    };
    const handleCrmStatusChange = () => {
      void loadIntegrationStatus();
    };
    window.addEventListener("gmail-status-changed", handleGmailStatusChange);
    window.addEventListener("crm-status-changed", handleCrmStatusChange);

    return () => {
      ignore = true;
      window.removeEventListener("gmail-status-changed", handleGmailStatusChange);
      window.removeEventListener("crm-status-changed", handleCrmStatusChange);
    };
  }, [location.pathname]);

  const checklist: ChecklistItem[] = [
    {
      id: "calendar",
      label: "Connect Calendar",
      completed: isCalendarConnected,
      icon: Calendar,
      path: "/settings/integrations",
      description: "Sync your meetings",
    },
    {
      id: "email",
      label: "Connect Email",
      completed: isGmailConnected,
      icon: Mail,
      path: "/emails",
      description: "Sync Gmail inbox",
    },
    {
      id: "crm",
      label: "Connect CRM",
      completed: isCrmConnected,
      icon: Database,
      path: "/crm",
      description: "Salesforce, Zoho, or HubSpot",
    },
    {
      id: "templates",
      label: "Customize Notes Template",
      completed: false,
      icon: FileText,
      path: "/settings/templates",
      description: "Define your format",
    },
    {
      id: "scorecards",
      label: "Set Up Scorecards",
      completed: false,
      icon: Target,
      path: "/settings/scorecards",
      description: "Create call quality metrics",
    },
    {
      id: "trackers",
      label: "Define Trackers",
      completed: false,
      icon: Tag,
      path: "/settings/smart-topics",
      description: "Track keywords & topics",
    },
    {
      id: "team",
      label: "Invite Team",
      completed: true,
      icon: Users,
      path: "/settings/members",
      description: "Add your reps",
    },
    {
      id: "routing",
      label: "Configure Routing Rules",
      completed: false,
      icon: GitBranch,
      path: "/settings/automations",
      description: "Auto-assign leads",
    },
  ];

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleItemClick = (path?: string) => {
    if (path && onNavigate) {
      onNavigate(path);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          <div className="flex flex-col items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            <div className="text-xs font-semibold">{progressPercent}%</div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-20 bottom-0 w-80 bg-white border-l border-gray-200 shadow-xl z-30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Account Setup Progress</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Complete these steps to get started
            </p>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              {completedCount} of {totalCount} completed
            </span>
            <span className="font-semibold text-blue-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {checklist.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.path)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  item.completed
                    ? "bg-green-50 border-green-200 hover:bg-green-100"
                    : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {item.completed ? (
                      <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{idx + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${item.completed ? "text-green-600" : "text-gray-500"}`} />
                      <span className={`text-sm font-medium ${item.completed ? "text-green-900" : "text-gray-900"}`}>
                        {item.label}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${item.completed ? "text-green-700" : "text-gray-600"}`}>
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 ${item.completed ? "text-green-600" : "text-gray-400"}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">
            Need help getting started?
          </p>
          <Button size="sm" variant="outline" className="w-full h-8 text-xs">
            Watch Setup Video
          </Button>
        </div>
      </div>
    </div>
  );
}