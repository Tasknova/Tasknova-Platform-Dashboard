import { useNavigate, useLocation } from "react-router";
import { UserCircle2, Shield, Briefcase, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const roles = [
  {
    value: "rep",
    label: "Sales Rep",
    name: "Alex Rivera",
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    value: "manager",
    label: "Sales Manager",
    name: "Sarah Chen",
    icon: UserCircle2,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    value: "admin",
    label: "Admin",
    name: "Michael Foster",
    icon: Shield,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export function RoleSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine current role from path
  const currentRole = location.pathname.split("/")[1] || "rep";
  const currentRoleData = roles.find((r) => r.value === currentRole) || roles[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleChange = (newRole: string) => {
    // Get the current page path (after the role)
    const pathParts = location.pathname.split("/");
    const currentPage = pathParts.slice(2).join("/") || "dashboard";

    // Navigate to the same page but with new role
    navigate(`/${newRole}/${currentPage}`);
    setIsOpen(false);
  };

  const CurrentIcon = currentRoleData.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white"
        title="Switch role (Demo)"
      >
        <div className={`w-6 h-6 rounded-full ${currentRoleData.bg} flex items-center justify-center`}>
          <CurrentIcon className={`w-3.5 h-3.5 ${currentRoleData.color}`} />
        </div>
        <div className="text-left">
          <div className="text-xs font-medium text-gray-900">{currentRoleData.name}</div>
          <div className="text-xs text-gray-500">{currentRoleData.label}</div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Demo Mode - Switch View
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              See how different roles experience Tasknova
            </p>
          </div>
          
          <div className="py-1">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = role.value === currentRole;

              return (
                <button
                  key={role.value}
                  onClick={() => handleRoleChange(role.value)}
                  className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    isActive ? "bg-blue-50" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${role.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${role.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                    <div className="text-xs text-gray-500">{role.label}</div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-t border-gray-100 mt-1">
            <p className="text-xs text-gray-500">
              Your current view will be preserved when switching roles
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
