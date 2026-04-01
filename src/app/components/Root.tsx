import { Outlet, useLocation, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Clock,
  Users,
  Target,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Zap,
  Settings,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Sparkles,
  Phone,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info,
  TrendingUp as TrendingUpIcon,
  UserPlus,
  Lightbulb,
  X,
  UserCircle2,
  Shield,
  Briefcase,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { SetupChecklist } from "./SetupChecklist";
import { SupportWidget } from "./SupportWidget";
import { NotificationPanel } from "./NotificationPanel";
import { SearchPanel } from "./SearchPanel";

import { FloatingActionButton } from "./FloatingActionButton";
import { EventsProvider } from "../contexts/EventsContext";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["rep", "manager", "admin"] },
  { name: "Meetings", icon: Calendar, path: "/meetings", roles: ["rep", "manager", "admin"] },
  { name: "Calls", icon: Phone, path: "/calls", roles: ["rep", "manager", "admin"] },
  { name: "Tasks", icon: CheckSquare, path: "/tasks", roles: ["rep", "manager", "admin"] },
  { name: "Scheduler", icon: Clock, path: "/scheduler", roles: ["manager", "admin"] },
  { name: "Customers", icon: Users, path: "/customers", roles: ["rep", "manager", "admin"] },
  { name: "Deals", icon: Target, path: "/deals", roles: ["rep", "manager", "admin"] },
  { name: "Coaching", icon: GraduationCap, path: "/coaching", roles: ["manager", "admin"] },
  { name: "Insights", icon: BarChart3, path: "/insights", roles: ["rep", "manager", "admin"] },
  { name: "Revenue", icon: TrendingUp, path: "/revenue", roles: ["manager", "admin"] },
  { name: "Automation", icon: Zap, path: "/automation", roles: ["admin"] },
  { name: "Team", icon: Users, path: "/team", roles: ["admin"] },
  { name: "Settings", icon: Settings, path: "/settings", roles: ["rep", "manager", "admin"] },
];

const roles = [
  { name: "Rep", value: "rep" },
  { name: "Manager", value: "manager" },
  { name: "Admin", value: "admin" },
];

// Notification types and sample data
const sampleNotifications = [
  {
    id: "1",
    type: "ai_insight",
    icon: Lightbulb,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    title: "New AI Coaching Insight",
    message: "Your discovery question rate increased by 35% this week",
    time: "5 minutes ago",
    read: false,
    link: "/coaching",
  },
  {
    id: "2",
    type: "meeting_reminder",
    icon: Calendar,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Meeting starting soon",
    message: "Discovery Call with Acme Corp starts in 15 minutes",
    time: "10 minutes ago",
    read: false,
    link: "/meetings",
  },
  {
    id: "3",
    type: "task_assigned",
    icon: CheckSquare,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    title: "New task assigned",
    message: "Send security documentation to CloudVista by 5:00 PM",
    time: "1 hour ago",
    read: false,
    link: "/tasks",
  },
  {
    id: "4",
    type: "deal_update",
    icon: TrendingUpIcon,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "Deal stage updated",
    message: "TechStart moved to Negotiation stage ($125K)",
    time: "2 hours ago",
    read: true,
    link: "/deals",
  },
  {
    id: "5",
    type: "system_update",
    icon: Info,
    iconColor: "text-gray-600",
    iconBg: "bg-gray-50",
    title: "System Update",
    message: "New dialer features now available in Calls section",
    time: "3 hours ago",
    read: true,
    link: "/calls",
  },
  {
    id: "6",
    type: "customer_activity",
    icon: UserPlus,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    title: "Customer engagement",
    message: "DataFlow viewed your proposal 3 times today",
    time: "4 hours ago",
    read: true,
    link: "/customers/dataflow",
  },
  {
    id: "7",
    type: "alert",
    icon: AlertCircle,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
    title: "Action required",
    message: "GlobalTech meeting needs rescheduling - conflict detected",
    time: "5 hours ago",
    read: true,
    link: "/meetings",
  },
  {
    id: "8",
    type: "success",
    icon: CheckCircle2,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    title: "Meeting recorded",
    message: "Your CloudVista discovery call has been transcribed",
    time: "Yesterday",
    read: true,
    link: "/meetings",
  },
];

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem("userRole") || "rep");
  const [userName] = useState(localStorage.getItem("userName") || "User");
  const [userEmail] = useState(localStorage.getItem("userEmail") || "user@company.com");
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [showSearch, setShowSearch] = useState(false);

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get user initials for avatar
  const userInitials = userName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      // Escape to close panels
      if (e.key === "Escape") {
        setShowSearch(false);
        setShowNotifications(false);
        setShowTopRoleMenu(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("onboardingData");
    localStorage.removeItem("onboardingStep");
    localStorage.removeItem("onboardingCompleted");
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification: typeof sampleNotifications[0]) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    navigate(`/${userRole}${notification.link}`);
  };

  const showOnboarding = userRole === "manager" || userRole === "admin";
  const userPlan = userRole === "admin" ? "enterprise" : userRole === "manager" ? "professional" : "trial";

  return (
    <EventsProvider>
      <div className="flex flex-col h-screen bg-white">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-52"
          }`}>
            {/* Logo */}
            <div className="h-14 flex items-center justify-center px-4 border-b border-gray-100">
              {!isSidebarCollapsed && (
                <img 
                  src="/assets/tasknova-logo.png" 
                  alt="Tasknova" 
                  className="h-8 w-auto"
                />
              )}
              {isSidebarCollapsed && (
                <img 
                  src="/assets/tasknova-logo-1.png" 
                  alt="Tasknova" 
                  className="h-7 w-7"
                />
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-3 overflow-y-auto">
              <div className="space-y-0.5">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.includes(`/${userRole}${item.path}`);
                  return (
                    <Link
                      key={item.name}
                      to={`/${userRole}${item.path}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      } ${isSidebarCollapsed ? "justify-center" : ""}`}
                      title={isSidebarCollapsed ? item.name : undefined}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Collapse Toggle Button */}
            <div className="px-2 pb-2 border-t border-gray-100 pt-2">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                  isSidebarCollapsed ? "justify-center" : ""
                }`}
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs">Collapse</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Command Center Button */}
            <div className="px-2 pb-2 border-t border-gray-100 pt-2">
              <Link to={`/${userRole}/ai`}>
                <button
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors ${
                    isSidebarCollapsed ? "justify-center" : ""
                  }`}
                  title={isSidebarCollapsed ? "Ask Tasknova AI" : undefined}
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Ask Tasknova AI</span>}
                </button>
              </Link>
            </div>

            {/* User Menu */}
            {!isSidebarCollapsed && (
              <div className="p-2 border-t border-gray-100">
                <div className="relative">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="w-full flex items-center gap-2.5 p-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {userInitials}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {showRoleMenu && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Collapsed User Avatar */}
            {isSidebarCollapsed && (
              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="w-full flex items-center justify-center p-2 rounded hover:bg-gray-50 transition-colors relative"
                  title="Alex Rivera"
                >
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    A
                  </div>
                </button>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 relative">
            {/* Top Bar */}
            <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search for anything in Tasknova (⌘K)"
                    className="pl-9 h-9 bg-white border-gray-200 text-sm cursor-pointer"
                    onClick={() => setShowSearch(true)}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">


                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-1.5 text-gray-500 hover:bg-gray-50 rounded transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50"
                            >
                              Mark all read
                            </button>
                          )}
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="flex-1 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 px-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                              <Bell className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">No notifications</p>
                            <p className="text-xs text-gray-600 text-center">
                              We'll notify you when something important happens
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => {
                              const Icon = notification.icon;
                              return (
                                <div
                                  key={notification.id}
                                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors relative group ${
                                    !notification.read ? "bg-blue-50/30" : ""
                                  }`}
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className={`w-8 h-8 ${notification.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                      <Icon className={`w-4 h-4 ${notification.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2 mb-0.5">
                                        <p className="text-sm font-medium text-gray-900">
                                          {notification.title}
                                        </p>
                                        {!notification.read && (
                                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-700 mb-1.5 line-clamp-2">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-gray-500">{notification.time}</p>
                                    </div>

                                    {/* Delete button (shows on hover) */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                      }}
                                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-2">
                          <button
                            onClick={() => {
                              setShowNotifications(false);
                              navigate(`/${userRole}/settings`);
                            }}
                            className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1.5 rounded hover:bg-blue-50 transition-colors"
                          >
                            Notification Settings
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Badge variant="outline" className="bg-white text-gray-700 border-gray-200 capitalize text-xs px-2 py-0.5">
                  {userRole}
                </Badge>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
              <Outlet />
            </main>

            {/* Logout Confirmation Dialog */}
            {showLogoutConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 animate-fadeIn">
                  <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Are you sure you want to logout? You'll need to log in again to access your account.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmLogout}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Setup Checklist Panel (Manager/Admin only) */}
            {showOnboarding && (
              <SetupChecklist onNavigate={(path) => navigate(`/${userRole}${path}`)} />
            )}

            {/* Support Widget (All users) */}
            <SupportWidget 
              userPlan={userPlan as "trial" | "starter" | "professional" | "enterprise"}
              csmName={userRole === "admin" ? "Sarah Johnson" : undefined}
              csmEmail={userRole === "admin" ? "sarah.j@tasknova.ai" : undefined}
            />

            {/* Search Panel */}
            <SearchPanel 
              isOpen={showSearch}
              onClose={() => setShowSearch(false)}
              userRole={userRole}
            />

            {/* Floating Action Button */}
            <FloatingActionButton userRole={userRole} />
          </div>
        </div>
      </div>
    </EventsProvider>
  );
}