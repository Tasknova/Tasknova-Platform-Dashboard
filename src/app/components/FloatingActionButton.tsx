import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  X,
  Phone,
  Calendar,
  CheckSquare,
  Target,
  Mail,
  Users,
  FileText,
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  link: string;
  color: string;
  bgColor: string;
  roles: string[];
}

const quickActions: QuickAction[] = [
  {
    id: "log-call",
    label: "Log Call",
    icon: Phone,
    link: "/calls",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    roles: ["rep", "manager", "admin"],
  },
  {
    id: "schedule-meeting",
    label: "Schedule Meeting",
    icon: Calendar,
    link: "/scheduler",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    roles: ["rep", "manager", "admin"],
  },
  {
    id: "create-task",
    label: "Create Task",
    icon: CheckSquare,
    link: "/tasks",
    color: "text-green-600",
    bgColor: "bg-green-50",
    roles: ["rep", "manager", "admin"],
  },
  {
    id: "create-deal",
    label: "Create Deal",
    icon: Target,
    link: "/deals",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    roles: ["rep", "manager", "admin"],
  },
  {
    id: "compose-email",
    label: "Compose Email",
    icon: Mail,
    link: "/compose-email",
    color: "text-red-600",
    bgColor: "bg-red-50",
    roles: ["rep", "manager", "admin"],
  },
  {
    id: "add-customer",
    label: "Add Customer",
    icon: Users,
    link: "/customers",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    roles: ["rep", "manager", "admin"],
  },
  {
    id: "create-note",
    label: "Create Note",
    icon: FileText,
    link: "/activities",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    roles: ["rep", "manager", "admin"],
  },
];

interface FloatingActionButtonProps {
  userRole?: string;
}

export function FloatingActionButton({ userRole = "rep" }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleActionClick = (link: string) => {
    navigate(`/${userRole}${link}`);
    setIsOpen(false);
  };

  // Filter actions by role
  const filteredActions = quickActions.filter((action) =>
    action.roles.includes(userRole)
  );

  return (
    <div className="fixed bottom-6 right-6 z-30" ref={fabRef}>
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 mb-2">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Quick Actions
            </p>
          </div>
          <div className="py-1 max-h-80 overflow-y-auto">
            {filteredActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.link)}
                  className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${action.bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen
            ? "bg-gray-700 hover:bg-gray-800 rotate-45"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        title="Quick Actions"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Tooltip when closed */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Quick Actions
        </div>
      )}
    </div>
  );
}
