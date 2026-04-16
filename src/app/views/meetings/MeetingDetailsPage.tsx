import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { ArrowLeft, Calendar, Clock, MapPin, Video, Users, UserRound } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { supabase } from "../../../lib/supabase";

type Meeting = {
  id: string;
  title: string;
  description: string | null;
  meeting_type: string | null;
  scheduled_start_time: string;
  scheduled_end_time: string;
  duration_minutes: number | null;
  status: string | null;
  timezone: string | null;
  location: string | null;
  meeting_platform: string | null;
  meeting_url: string | null;
  owner_id: string | null;
};

type Participant = {
  meeting_id: string;
  name: string | null;
  email: string | null;
  participant_type: string | null;
};

const MEETING_SYNC_WINDOW_DAYS = 30;
const MEETING_SYNC_WINDOW_MS = MEETING_SYNC_WINDOW_DAYS * 24 * 60 * 60 * 1000;

function isWithinNextSyncWindow(startIso: string): boolean {
  const startMs = new Date(startIso).getTime();
  if (Number.isNaN(startMs)) return false;

  const nowMs = Date.now();
  const endMs = nowMs + MEETING_SYNC_WINDOW_MS;
  return startMs >= nowMs && startMs <= endMs;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function durationText(startIso: string, endIso: string, durationMinutes?: number | null) {
  if (durationMinutes && durationMinutes > 0) return `${durationMinutes} mins`;
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  const mins = Math.max(0, Math.round((end - start) / (1000 * 60)));
  return `${mins} mins`;
}

export default function MeetingDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const orgId = localStorage.getItem("userOrganization") || "";
  const userId = localStorage.getItem("userId") || "";
  const basePath = location.pathname.split("/")[1] || "rep";

  useEffect(() => {
    const loadMeeting = async () => {
      if (!orgId || !userId || !id) {
        setError("Missing meeting context. Please reopen from meetings list.");
        setLoading(false);
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
        if (!data?.success) throw new Error(data?.error || "Failed to load meeting details");

        const meetings = ((data?.meetings || []) as Meeting[]).filter((meeting) =>
          isWithinNextSyncWindow(meeting.scheduled_start_time)
        );
        const selectedMeeting = meetings.find((m) => m.id === id) || null;

        if (!selectedMeeting) {
          setError("Meeting not found. It may not be synced yet.");
          setMeeting(null);
          setParticipants([]);
          return;
        }

        setMeeting(selectedMeeting);

        const participantRows = ((data?.participants || []) as Participant[]).filter(
          (p) => p.meeting_id === id
        );
        setParticipants(participantRows);
      } catch (err) {
        let message = err instanceof Error ? err.message : "Failed to load meeting details";
        const edgeContext = (err as { context?: Response } | null)?.context;
        if (edgeContext) {
          try {
            const body = (await edgeContext.json()) as { error?: string };
            if (body?.error) message = body.error;
          } catch {
            // Keep the original message.
          }
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
  }, [id, orgId, userId]);

  const externalParticipants = useMemo(
    () => participants.filter((p) => p.participant_type !== "internal"),
    [participants]
  );

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">Loading meeting details...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-4 border border-red-200 bg-red-50 text-red-700 text-sm">{error}</Card>
      </div>
    );
  }

  if (!meeting) {
    return <div className="p-6 text-sm text-gray-600">Meeting not available.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link to={`/${basePath}/meetings`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Meetings
          </Button>
        </Link>
        {meeting.meeting_url && (
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => window.open(meeting.meeting_url as string, "_blank", "noopener,noreferrer")}
          >
            <Video className="w-4 h-4 mr-2" />
            Join Meeting
          </Button>
        )}
      </div>

      <Card className="p-5 border border-gray-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{meeting.title}</h1>
            <p className="text-sm text-gray-600 mt-1">{meeting.description || "No description available."}</p>
          </div>
          <div className="flex items-center gap-2">
            {meeting.meeting_type && (
              <Badge variant="outline" className="capitalize">{meeting.meeting_type}</Badge>
            )}
            {meeting.status && <Badge variant="secondary" className="capitalize">{meeting.status}</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4" />
            {formatDateTime(meeting.scheduled_start_time)}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4" />
            {durationText(meeting.scheduled_start_time, meeting.scheduled_end_time, meeting.duration_minutes)}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4" />
            {meeting.location || "No location"}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Video className="w-4 h-4" />
            {meeting.meeting_platform || "Platform not specified"}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-4 h-4" />
            {externalParticipants.length} participants
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <UserRound className="w-4 h-4" />
            Timezone: {meeting.timezone || "UTC"}
          </div>
        </div>
      </Card>

      <Card className="p-5 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Participants</h2>
        {externalParticipants.length === 0 ? (
          <p className="text-sm text-gray-600">No participants synced for this meeting yet.</p>
        ) : (
          <div className="space-y-2">
            {externalParticipants.map((participant, idx) => (
              <div key={`${participant.email || participant.name || "participant"}-${idx}`} className="flex items-center justify-between border border-gray-100 rounded-md p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{participant.name || "Unnamed participant"}</p>
                  <p className="text-xs text-gray-600">{participant.email || "No email"}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {participant.participant_type || "external"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
