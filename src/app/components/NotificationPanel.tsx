import { useState } from "react";
import { Link } from "react-router";
import {
  Bell,
  X,
  Lightbulb,
  Calendar,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  Settings as SettingsIcon,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Notification {
  id: string;
  type: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

const sampleNotifications: Notification[] = [
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
    type: "deal_at_risk",
    icon: AlertTriangle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    title: "Deal at risk",
    message: "DataFlow Systems - No response in 10 days",
    time: "2 hours ago",
    read: true,
    link: "/deals",
  },
  {
    id: "5",
    type: "quota_milestone",
    icon: TrendingUp,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    title: "Quota milestone reached",
    message: "You've hit 90% of your monthly quota!",
    time: "Yesterday",
    read: true,
    link: "/performance",
  },
];

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export function NotificationPanel({ isOpen, onClose, userRole = "rep" }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-16 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-700" />
            <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0 h-4">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 w-7 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">All caught up!</p>
              <p className="text-xs text-gray-500 text-center">
                You have no notifications right now
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-full ${notification.iconBg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${notification.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={notification.link.startsWith('/') ? `/${userRole}${notification.link}` : notification.link}
                          onClick={() => {
                            markAsRead(notification.id);
                            onClose();
                          }}
                          className="block"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1.5 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </Link>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded p-1 transition-opacity"
                        title="Dismiss"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Link
            to={`/${userRole}/settings`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            Notification Settings
          </Link>
        </div>
      </div>
    </>
  );
}
