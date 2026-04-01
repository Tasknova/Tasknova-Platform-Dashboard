import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Video,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const sessions = [
  {
    id: "1",
    type: "1:1 Coaching",
    participant: "Casey Johnson",
    role: "Sales Rep",
    date: "Mar 21, 2026",
    time: "10:00 AM",
    duration: "30 min",
    status: "scheduled",
    topics: ["Quota Recovery", "Discovery Skills"],
    notes: "Focus on improving question framework",
  },
  {
    id: "2",
    type: "Performance Review",
    participant: "Morgan Smith",
    role: "Sales Rep",
    date: "Mar 21, 2026",
    time: "2:00 PM",
    duration: "45 min",
    status: "scheduled",
    topics: ["Q1 Performance", "Goals Setting"],
    notes: "Quarterly review and goal alignment",
  },
  {
    id: "3",
    type: "1:1 Coaching",
    participant: "Alex Rivera",
    role: "Sales Rep",
    date: "Mar 22, 2026",
    time: "11:00 AM",
    duration: "30 min",
    status: "scheduled",
    topics: ["Objection Handling", "Closing Techniques"],
    notes: "",
  },
  {
    id: "4",
    type: "Team Sync",
    participant: "Sales Team",
    role: "Team Meeting",
    date: "Mar 22, 2026",
    time: "9:00 AM",
    duration: "60 min",
    status: "scheduled",
    topics: ["Pipeline Review", "Best Practices"],
    notes: "Weekly team standup",
  },
];

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

export function Scheduler() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter((session) =>
    session.participant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSessionColor = (type: string) => {
    switch (type) {
      case "1:1 Coaching":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "Performance Review":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "Team Sync":
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Scheduler</h1>
              <p className="text-sm text-gray-600 mt-1">Schedule and manage 1:1 coaching sessions</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("list")}
                  className="h-7"
                >
                  List
                </Button>
                <Button
                  variant={view === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("calendar")}
                  className="h-7"
                >
                  Calendar
                </Button>
              </div>
              <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Schedule Session
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by participant or session type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {view === "list" ? (
          /* List View */
          <div className="space-y-4">
            {/* Upcoming Sessions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
              <div className="space-y-3">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`border rounded-lg p-4 ${getSessionColor(session.type)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {session.type}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900">
                            with {session.participant}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.time} ({session.duration})
                          </span>
                          {session.role && session.role !== "Team Meeting" && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {session.role}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 h-7">
                          <Video className="w-3 h-3" />
                          Join
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {session.topics.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-medium text-gray-600 mb-1">Topics:</div>
                        <div className="flex flex-wrap gap-1">
                          {session.topics.map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {session.notes && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Notes:</span> {session.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-semibold text-gray-900">
                  {sessions.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Sessions</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-semibold text-blue-600">
                  {sessions.filter((s) => s.type === "1:1 Coaching").length}
                </div>
                <div className="text-sm text-gray-600 mt-1">1:1 Coaching</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-semibold text-purple-600">
                  {sessions.filter((s) => s.type === "Performance Review").length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Reviews</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-semibold text-green-600">
                  {sessions.filter((s) => s.type === "Team Sync").length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Team Meetings</div>
              </div>
            </div>
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white border border-gray-200 rounded-lg">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                March 2026
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  Today
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Week View */}
            <div className="p-4">
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="text-xs font-medium text-gray-500 text-center">Time</div>
                {["Mon 17", "Tue 18", "Wed 19", "Thu 20", "Fri 21", "Sat 22", "Sun 23"].map((day) => (
                  <div key={day} className="text-xs font-medium text-gray-700 text-center">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-8 gap-2">
                <div className="space-y-12">
                  {timeSlots.map((time) => (
                    <div key={time} className="text-xs text-gray-500 text-right pr-2">
                      {time}
                    </div>
                  ))}
                </div>

                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                  <div key={dayIndex} className="space-y-12 border-l border-gray-200">
                    {timeSlots.map((time, timeIndex) => {
                      const hasSession = dayIndex === 4 && (timeIndex === 2 || timeIndex === 6);
                      return (
                        <div
                          key={time}
                          className={`min-h-[48px] p-1 ${
                            hasSession ? "bg-blue-50 border border-blue-200 rounded" : ""
                          }`}
                        >
                          {hasSession && (
                            <div className="text-xs">
                              <div className="font-medium text-blue-900">
                                {timeIndex === 2 ? "Casey Johnson" : "Morgan Smith"}
                              </div>
                              <div className="text-blue-600">
                                {timeIndex === 2 ? "1:1 Coaching" : "Review"}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
