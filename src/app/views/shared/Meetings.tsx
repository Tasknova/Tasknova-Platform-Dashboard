import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  ChevronDown,
  Filter,
  Users,
  Phone,
  AlertCircle,
  Link2,
  MapPin,
  Sparkles,
  RefreshCw,
  Trash2,
  Unlink,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Calendar as DateCalendar } from "../../components/ui/calendar";
import { supabase } from "../../../lib/supabase";

interface MeetingRow {
  id: string;
  title: string;
  description: string | null;
  meeting_type: string | null;
  scheduled_start_time: string;
  scheduled_end_time: string;
  duration_minutes: number | null;
  status: string | null;
  timezone: string | null;
  meeting_platform: string | null;
  sentiment: string | null;
  outcome: string | null;
  ai_score: number | null;
  has_recording: boolean | null;
  meeting_url: string | null;
  location: string | null;
  owner_id: string | null;
}

interface ParticipantRow {
  meeting_id: string;
  name: string | null;
  email: string | null;
  participant_type: string | null;
}

interface MeetingCardData {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  participant: string;
  duration: string;
  type: string;
  meetingUrl?: string | null;
  location?: string | null;
  meetingPlatform?: string | null;
  priority?: "high" | "medium";
  rep?: string;
}

const MEETING_SYNC_WINDOW_DAYS = 30;
const MEETING_SYNC_WINDOW_MS = MEETING_SYNC_WINDOW_DAYS * 24 * 60 * 60 * 1000;

function isWithinNextSyncWindow(startIso: string): boolean {
  const startMs = new Date(startIso).getTime();
  if (Number.isNaN(startMs)) return false;

  const nowMs = Date.now();
  const endMs = nowMs + MEETING_SYNC_WINDOW_MS;
  return startMs >= nowMs && startMs <= endMs;
}

function toDisplayDateTime(startIso: string, endIso: string): { dateLabel: string; timeLabel: string } {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const dateLabel = start.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const totalMins = Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60)));
  if (totalMins >= 1380) {
    return { dateLabel, timeLabel: "All day" };
  }

  const startTime = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const endTime = end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return { dateLabel, timeLabel: `${startTime} - ${endTime}` };
}

function toDurationLabel(startIso: string, endIso: string, fallbackMinutes?: number | null): string {
  if (fallbackMinutes && fallbackMinutes >= 1380) {
    return "All day";
  }
  if (fallbackMinutes && fallbackMinutes > 0) {
    return `${fallbackMinutes} mins`;
  }
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  const mins = Math.max(0, Math.round((end - start) / (1000 * 60)));
  if (mins >= 1380) return "All day";
  return `${mins} mins`;
}

function toMeetingCardData(meeting: MeetingRow, participantName: string, repName?: string): MeetingCardData {
  const now = Date.now();
  const startsAt = new Date(meeting.scheduled_start_time).getTime();
  const isUpcoming = startsAt >= now;
  const { dateLabel, timeLabel } = toDisplayDateTime(
    meeting.scheduled_start_time,
    meeting.scheduled_end_time
  );

  return {
    id: meeting.id,
    title: meeting.title,
    dateLabel,
    timeLabel,
    participant: participantName || "No participant",
    duration: toDurationLabel(
      meeting.scheduled_start_time,
      meeting.scheduled_end_time,
      meeting.duration_minutes
    ),
    type: meeting.meeting_type || "Meeting",
    meetingUrl: meeting.meeting_url,
    meetingPlatform: meeting.meeting_platform,
    location: meeting.location,
    priority: isUpcoming ? "high" : "medium",
    rep: repName,
  };
}

function toDateKey(isoValue: string): string {
  const d = new Date(isoValue);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isGoogleMeetUrl(url?: string | null): boolean {
  if (!url) return false;
  return /https:\/\/meet\.google\.com\//i.test(url);
}

function getJoinAction(meeting: MeetingCardData): { label: string; canJoin: boolean } {
  const url = meeting.meetingUrl || "";
  const platform = (meeting.meetingPlatform || "").toLowerCase();

  if (/meet\.google\.com/i.test(url) || platform.includes("google")) {
    return { label: "Join on GMeet", canJoin: Boolean(url) };
  }

  if (/teams\.microsoft\.com/i.test(url) || platform.includes("teams")) {
    return { label: "Join on Teams", canJoin: Boolean(url) };
  }

  if (/zoom\.us/i.test(url) || platform.includes("zoom")) {
    return { label: "Join on Zoom", canJoin: Boolean(url) };
  }

  if (url) {
    return { label: "Open Meeting", canJoin: true };
  }

  return { label: "No Join Link", canJoin: false };
}

export function Meetings() {
  const [activeTab, setActiveTab] = useState("my");
  const [statusFilter, setStatusFilter] = useState<"upcoming" | "past" | "completed">("upcoming");
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(
    localStorage.getItem("calendarConnected") === "true"
  );
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState("");
  const [authExpired, setAuthExpired] = useState(false);
  const [syncWarning, setSyncWarning] = useState("");
  const [meetings, setMeetings] = useState<MeetingRow[]>([]);
  const [participantsByMeeting, setParticipantsByMeeting] = useState<Record<string, string>>({});
  const [participantEmailsByMeeting, setParticipantEmailsByMeeting] = useState<Record<string, string[]>>({});
  const [currentUserEmail, setCurrentUserEmail] = useState(
    localStorage.getItem("userEmail") || localStorage.getItem("email") || ""
  );

  const userId = localStorage.getItem("userId") || "";
  const orgId = localStorage.getItem("userOrganization") || "";
  const role = localStorage.getItem("userRole") || "rep";
  const roleBasePath = role === "admin" ? "/admin" : role === "manager" ? "/manager" : "/rep";

  const loadMeetings = async () => {
    if (!orgId) {
      setLoading(false);
      setError("Organization not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data, error: loadError } = await supabase.functions.invoke("connect-google-calendar", {
        body: {
          action: "get_meetings",
          organizationId: orgId,
          userId,
        },
      });

      if (loadError) throw loadError;
      if (!data?.success) {
        throw new Error(data?.error || "Failed to load meetings");
      }

      const isConnected = Boolean(data?.calendarConnected);
      setCalendarConnected(isConnected);
      localStorage.setItem("calendarConnected", isConnected ? "true" : "false");
      setAuthExpired(Boolean(data?.authExpired));
      setSyncWarning(data?.syncWarning ? String(data.syncWarning) : "");
      if (data?.lastSyncAt) {
        setLastSyncedAt(String(data.lastSyncAt));
      }
      if (data?.currentUserEmail) {
        setCurrentUserEmail(String(data.currentUserEmail));
      }

      if (!isConnected) {
        setAuthExpired(false);
        setSyncWarning("");
        setMeetings([]);
        setParticipantsByMeeting({});
        setParticipantEmailsByMeeting({});
        setLoading(false);
        return;
      }

      const meetingsList = (data?.meetings || []) as MeetingRow[];
      const upcomingWindowMeetings = meetingsList.filter((meeting) =>
        isWithinNextSyncWindow(meeting.scheduled_start_time)
      );
      setMeetings(upcomingWindowMeetings);

      if (upcomingWindowMeetings.length > 0) {
        const participantRows = (data?.participants || []) as ParticipantRow[];
        const meetingIds = new Set(upcomingWindowMeetings.map((meeting) => meeting.id));

        const participantMap: Record<string, string> = {};
        const participantEmailsMap: Record<string, string[]> = {};
        (participantRows as ParticipantRow[] | null)?.forEach((p) => {
          if (!meetingIds.has(p.meeting_id)) return;

          const email = (p.email || "").toLowerCase();
          if (!participantEmailsMap[p.meeting_id]) participantEmailsMap[p.meeting_id] = [];
          if (email && !participantEmailsMap[p.meeting_id].includes(email)) {
            participantEmailsMap[p.meeting_id].push(email);
          }

          if (participantMap[p.meeting_id]) return;
          if (p.participant_type === "internal") return;
          participantMap[p.meeting_id] = p.name || p.email || "Participant";
        });
        setParticipantsByMeeting(participantMap);
        setParticipantEmailsByMeeting(participantEmailsMap);
      } else {
        setParticipantsByMeeting({});
        setParticipantEmailsByMeeting({});
      }
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : "Failed to load meetings";
      const edgeContext = (err as { context?: Response } | null)?.context;
      if (edgeContext) {
        try {
          const body = (await edgeContext.json()) as { error?: string };
          if (body?.error) {
            errorMessage = body.error;
          }
        } catch {
          // Keep the existing error message when response body is unavailable.
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [orgId]);

  useEffect(() => {
    if (!calendarConnected || !orgId || !userId) return;

    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void handleSyncNow(false);
      }
    }, 180000);

    return () => window.clearInterval(id);
  }, [calendarConnected, orgId, userId]);

  const upcomingMeetings = useMemo(
    () => meetings.filter((m) => new Date(m.scheduled_start_time).getTime() >= Date.now()),
    [meetings]
  );

  const pastMeetings = useMemo(
    () => meetings.filter((m) => new Date(m.scheduled_start_time).getTime() < Date.now()),
    [meetings]
  );

  const completedMeetings = useMemo(
    () =>
      meetings.filter(
        (m) =>
          m.status === "completed" || new Date(m.scheduled_end_time).getTime() < Date.now()
      ),
    [meetings]
  );

  const selectedByStatus = useMemo(() => {
    if (statusFilter === "upcoming") return upcomingMeetings;
    if (statusFilter === "past") return pastMeetings;
    return completedMeetings;
  }, [statusFilter, upcomingMeetings, pastMeetings, completedMeetings]);

  const myMeetingRows = useMemo(
    () => selectedByStatus.filter((m) => m.owner_id === userId),
    [selectedByStatus, userId]
  );

  const teamMeetingRows = useMemo(
    () => selectedByStatus.filter((m) => m.owner_id && m.owner_id !== userId),
    [selectedByStatus, userId]
  );

  const allMeetingRows = selectedByStatus;

  const sharedMeetingRows = useMemo(
    () =>
      selectedByStatus.filter((m) => {
        const participantEmails = participantEmailsByMeeting[m.id] || [];
        if (!currentUserEmail) return false;
        return participantEmails.includes(currentUserEmail.toLowerCase()) && m.owner_id !== userId;
      }),
    [selectedByStatus, participantEmailsByMeeting, currentUserEmail, userId]
  );

  const meetingDays = useMemo(() => {
    const daySet = new Set<string>();
    meetings.forEach((m) => daySet.add(toDateKey(m.scheduled_start_time)));
    return daySet;
  }, [meetings]);

  const selectedDateMeetings = useMemo(() => {
    if (!selectedDate) return [];
    const selectedKey = toDateKey(selectedDate.toISOString());
    return meetings.filter((m) => toDateKey(m.scheduled_start_time) === selectedKey);
  }, [meetings, selectedDate]);

  const handleConnectCalendar = async () => {
    if (!orgId || !userId) {
      setError("Missing user context. Please login again.");
      return;
    }

    try {
      setConnectLoading(true);
      setError("");
      const configuredCalendarRedirectUri = import.meta.env.VITE_GOOGLE_CALENDAR_REDIRECT_URI?.trim();
      const configuredRedirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI?.trim();
      const redirectUri =
        configuredCalendarRedirectUri && configuredCalendarRedirectUri.length > 0
          ? configuredCalendarRedirectUri
          : configuredRedirectUri && /\/calendar\/callback$/i.test(configuredRedirectUri)
          ? configuredRedirectUri
          : `${window.location.origin}/calendar/callback`;

      const { data, error: connectError } = await supabase.functions.invoke("connect-google-calendar", {
        body: {
          action: "get_auth_url",
          organizationId: orgId,
          userId,
          redirectUri,
        },
      });

      if (connectError) throw connectError;
      if (!data?.authUrl) throw new Error("Failed to generate Google authorization URL");

      window.location.href = data.authUrl;
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : "Failed to start calendar connection";

      const edgeContext = (err as { context?: Response } | null)?.context;
      if (edgeContext) {
        try {
          const body = (await edgeContext.json()) as { error?: string };
          if (body?.error) {
            errorMessage = body.error;
          }
        } catch {
          // Keep the existing error message when response body is unavailable.
        }
      }

      setError(errorMessage);
      setConnectLoading(false);
    }
  };

  const handleSyncNow = async (showError = true) => {
    if (!orgId || !userId || syncing) return;

    try {
      setSyncing(true);
      if (showError) setError("");

      const { data, error: syncError } = await supabase.functions.invoke("connect-google-calendar", {
        body: {
          action: "sync_now",
          organizationId: orgId,
          userId,
        },
      });

      if (syncError) throw syncError;
      if (!data?.success) throw new Error(data?.error || "Sync failed");

      if (data?.lastSyncAt) {
        setLastSyncedAt(String(data.lastSyncAt));
      }

      setAuthExpired(false);
      setSyncWarning("");

      await loadMeetings();
    } catch (err) {
      if (!showError) return;

      let errorMessage = err instanceof Error ? err.message : "Failed to sync meetings";
      const edgeContext = (err as { context?: Response } | null)?.context;
      if (edgeContext) {
        try {
          const body = (await edgeContext.json()) as { error?: string };
          if (body?.error) {
            errorMessage = body.error;
          }
        } catch {
          // Keep the existing error message when response body is unavailable.
        }
      }
      setError(errorMessage);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!orgId || !userId) return;

    const confirmed = window.confirm("Delete this meeting from dashboard and connected calendar?");
    if (!confirmed) return;

    try {
      setError("");
      const { data, error: deleteError } = await supabase.functions.invoke("connect-google-calendar", {
        body: {
          action: "delete_meeting",
          organizationId: orgId,
          userId,
          meetingId,
        },
      });

      if (deleteError) throw deleteError;
      if (!data?.success) throw new Error(data?.error || "Failed to delete meeting");

      await loadMeetings();
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : "Failed to delete meeting";
      const edgeContext = (err as { context?: Response } | null)?.context;
      if (edgeContext) {
        try {
          const body = (await edgeContext.json()) as { error?: string };
          if (body?.error) {
            errorMessage = body.error;
          }
        } catch {
          // Keep the existing error message when response body is unavailable.
        }
      }
      setError(errorMessage);
    }
  };

  const handleDisconnectCalendar = async () => {
    if (!orgId || !userId || disconnecting) return;

    const confirmed = window.confirm(
      "Disconnect calendar and delete all meetings synced from this calendar?"
    );
    if (!confirmed) return;

    try {
      setDisconnecting(true);
      setError("");

      const { data, error: disconnectError } = await supabase.functions.invoke("connect-google-calendar", {
        body: {
          action: "disconnect_calendar",
          organizationId: orgId,
          userId,
        },
      });

      if (disconnectError) throw disconnectError;
      if (!data?.success) throw new Error(data?.error || "Failed to disconnect calendar");

      setCalendarConnected(false);
      localStorage.setItem("calendarConnected", "false");
      setAuthExpired(false);
      setSyncWarning("");
      setMeetings([]);
      setParticipantsByMeeting({});
      setParticipantEmailsByMeeting({});
      setLastSyncedAt("");
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : "Failed to disconnect calendar";
      const edgeContext = (err as { context?: Response } | null)?.context;
      if (edgeContext) {
        try {
          const body = (await edgeContext.json()) as { error?: string };
          if (body?.error) {
            errorMessage = body.error;
          }
        } catch {
          // Keep the existing error message when response body is unavailable.
        }
      }
      setError(errorMessage);
    } finally {
      setDisconnecting(false);
    }
  };

  const renderMeetingCard = (meeting: MeetingCardData) => {
    const joinAction = getJoinAction(meeting);

    return (
    <Card 
      key={meeting.id} 
      className="p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all border border-gray-200 bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            statusFilter !== "upcoming" ? 'bg-gray-100' : meeting.priority === 'high' ? 'bg-red-50' : 'bg-blue-50'
          }`}>
            {statusFilter !== "upcoming" ? (
              <Phone className="w-6 h-6 text-gray-600" />
            ) : (
              <Video className={`w-6 h-6 ${meeting.priority === 'high' ? 'text-red-600' : 'text-blue-600'}`} />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link 
                to={`${roleBasePath}/meeting/${meeting.id}`}
                className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {meeting.title}
              </Link>
              {meeting.type && (
                <Badge variant="outline" className="text-xs capitalize border-gray-300 bg-white">
                  {meeting.type}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-0">
                {meeting.duration}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                {meeting.dateLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {meeting.timeLabel}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {meeting.participant}
              </span>
              {meeting.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {meeting.location}
                </span>
              )}
              {meeting.rep && (
                <>
                  <span className="text-blue-600 font-medium">By {meeting.rep}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {statusFilter === "upcoming" ? (
            <div className="flex items-center gap-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700 h-8 text-xs"
                disabled={!joinAction.canJoin}
                onClick={() => {
                  if (joinAction.canJoin && meeting.meetingUrl) {
                    window.open(meeting.meetingUrl as string, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                <Video className="w-3.5 h-3.5 mr-1.5" />
                {joinAction.label}
              </Button>
              <Link to={`${roleBasePath}/meeting/${meeting.id}`}>
                <Button variant="outline" className="h-8 text-xs">
                  View
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleDeleteMeeting(meeting.id)}
                title="Delete meeting"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to={`${roleBasePath}/meeting/${meeting.id}`}>
                <Button variant="outline" className="h-7 text-xs">
                  View
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-7 w-7 p-0 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleDeleteMeeting(meeting.id)}
                title="Delete meeting"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Meetings</h1>
        <p className="text-sm text-gray-600 mt-1">Your upcoming schedule across connected calendars (next 30 days)</p>
      </div>

      {calendarConnected && (
        <Card className="mb-6 p-4 border border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-900">Connected Calendar</p>
              <p className="text-sm text-blue-800 mt-1">Google Calendar {currentUserEmail ? `• ${currentUserEmail}` : ""}</p>
              {lastSyncedAt && (
                <p className="text-xs text-blue-700 mt-1">
                  Last synced: {new Date(lastSyncedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={() => handleSyncNow(true)}
                disabled={syncing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync Now"}
              </Button>
              <Button
                variant="outline"
                className="bg-white border-red-300 text-red-700 hover:bg-red-50"
                onClick={handleDisconnectCalendar}
                disabled={disconnecting}
              >
                <Unlink className="w-4 h-4 mr-2" />
                {disconnecting ? "Disconnecting..." : "Disconnect"}
              </Button>
              <Badge className="bg-blue-600 text-white border-0">Connected</Badge>
            </div>
          </div>
        </Card>
      )}

      {calendarConnected && authExpired && (
        <Card className="mb-6 p-4 border border-amber-300 bg-amber-50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900">Google token expired</h3>
                <p className="text-sm text-amber-800 mt-1">
                  {syncWarning || "We could not refresh your Google credentials. Reconnect calendar to resume live sync."}
                </p>
              </div>
            </div>
            <Button
              onClick={handleConnectCalendar}
              disabled={connectLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link2 className="w-4 h-4 mr-2" />
              {connectLoading ? "Connecting..." : "Reconnect Calendar"}
            </Button>
          </div>
        </Card>
      )}

      {calendarConnected && !loading && (
        <Card className="mb-6 p-4 border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
            <div className="rounded-lg border border-gray-200 bg-white">
              <DateCalendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  hasMeeting: (date) => meetingDays.has(toDateKey(date.toISOString())),
                }}
                modifiersClassNames={{
                  hasMeeting: "bg-blue-100 text-blue-700 font-semibold",
                }}
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Meetings on selected date
              </h3>
              {selectedDateMeetings.length === 0 ? (
                <p className="text-sm text-gray-600">No meetings scheduled for this date.</p>
              ) : (
                <div className="space-y-2">
                  {selectedDateMeetings.map((m) => (
                    <div key={m.id} className="flex items-center justify-between border border-gray-100 rounded-md p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{m.title}</p>
                        <p className="text-xs text-gray-600">{toDisplayDateTime(m.scheduled_start_time, m.scheduled_end_time).timeLabel} • {toDurationLabel(m.scheduled_start_time, m.scheduled_end_time, m.duration_minutes)}</p>
                      </div>
                      <Link to={`${roleBasePath}/meeting/${m.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {!calendarConnected && !loading && (
        <Card className="mb-6 p-6 border border-amber-200 bg-amber-50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900">Calendar not connected</h3>
                <p className="text-sm text-amber-800 mt-1">
                  Connect Google Calendar to fetch and display actual meetings.
                </p>
              </div>
            </div>
            <Button
              onClick={handleConnectCalendar}
              disabled={connectLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link2 className="w-4 h-4 mr-2" />
              {connectLoading ? "Connecting..." : "Connect Calendar"}
            </Button>
          </div>
        </Card>
      )}

      {error && (
        <Card className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </Card>
      )}

      {loading && (
        <Card className="mb-6 p-6 text-sm text-gray-600">Loading meetings...</Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-white border-b border-gray-200 h-auto p-0 rounded-none">
          <TabsTrigger 
            value="my" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3 text-sm"
          >
            My Meetings
          </TabsTrigger>
          <TabsTrigger 
            value="team" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3 text-sm"
          >
            Team Meetings
          </TabsTrigger>
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3 text-sm"
          >
            All Meetings
          </TabsTrigger>
          <TabsTrigger 
            value="shared" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3 text-sm"
          >
            Shared with Me
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Time Filter & Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant={statusFilter === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("upcoming")}
            className={`h-8 text-xs ${statusFilter === "upcoming" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          >
            Upcoming
          </Button>
          <Button
            variant={statusFilter === "past" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("past")}
            className={`h-8 text-xs ${statusFilter === "past" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          >
            Past
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("completed")}
            className={`h-8 text-xs ${statusFilter === "completed" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          >
            Completed
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 cursor-pointer hover:border-blue-600 text-xs">
            Date range <ChevronDown className="w-3 h-3 ml-1" />
          </Badge>
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 cursor-pointer hover:border-blue-600 text-xs">
            Meeting type <ChevronDown className="w-3 h-3 ml-1" />
          </Badge>
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 cursor-pointer hover:border-blue-600 text-xs">
            Outcome <ChevronDown className="w-3 h-3 ml-1" />
          </Badge>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs value={activeTab}>
        <TabsContent value="my" className="mt-0">
          <div className="space-y-3">
            {!calendarConnected ? (
              <Card className="p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Connect your calendar to view meetings</p>
              </Card>
            ) : myMeetingRows.length > 0 ? (
              myMeetingRows.map((m) =>
                renderMeetingCard(
                  toMeetingCardData(m, participantsByMeeting[m.id] || "Participant")
                )
              )
            ) : (
              <Card className="p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No meetings found for this filter</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-0">
          <div className="space-y-3">
            {!calendarConnected ? (
              <Card className="p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Connect your calendar to view team meetings</p>
              </Card>
            ) : teamMeetingRows.length > 0 ? (
              teamMeetingRows.map((m) =>
                renderMeetingCard(
                  toMeetingCardData(m, participantsByMeeting[m.id] || "Participant", "Team Member")
                )
              )
            ) : (
              <Card className="p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No team meetings found</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-3">
            {!calendarConnected ? (
              <Card className="p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Connect your calendar to view all meetings</p>
              </Card>
            ) : allMeetingRows.length > 0 ? (
              allMeetingRows.map((m) =>
                renderMeetingCard(
                  toMeetingCardData(m, participantsByMeeting[m.id] || "Participant")
                )
              )
            ) : (
              <Card className="p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No meetings available</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="shared" className="mt-0">
          {sharedMeetingRows.length > 0 ? (
            <div className="space-y-3">
              {sharedMeetingRows.map((m) =>
                renderMeetingCard(
                  toMeetingCardData(m, participantsByMeeting[m.id] || "Participant")
                )
              )}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No shared meetings</p>
              <p className="text-sm text-gray-500">Meetings shared with you will appear here</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}