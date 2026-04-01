import { Link } from "react-router";
import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2,
  ChevronDown,
  Filter,
  Users,
  Target,
  Phone,
  Play,
  Download
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";

const myMeetings = {
  upcoming: [
    { id: "1", date: "Feb 27", time: "10:00 AM", title: "Discovery - Acme Corp", participant: "Sarah Johnson, CFO", duration: "45 mins", type: "Discovery", dealValue: "$85K", priority: "high" },
    { id: "2", date: "Feb 27", time: "2:00 PM", title: "Demo - TechStart", participant: "Michael Chen, CTO", duration: "60 mins", type: "Demo", dealValue: "$125K", priority: "high" },
    { id: "3", date: "Feb 28", time: "9:00 AM", title: "Follow-up - GlobalTech", participant: "Emma Davis", duration: "30 mins", type: "Follow-up", dealValue: "$45K", priority: "medium" },
  ],
  past: [
    { id: "4", date: "Feb 26", time: "3:00 PM", title: "Sales Pitch - Beta Corp", participant: "Robert Taylor", duration: "42 mins", outcome: "Qualified", score: 87, sentiment: "positive", dealValue: "$95K", hasRecording: true },
    { id: "5", date: "Feb 25", time: "2:00 PM", title: "Demo - CloudVista", participant: "David Brown, CTO", duration: "55 mins", outcome: "Interested", score: 91, sentiment: "positive", dealValue: "$145K", hasRecording: true },
    { id: "6", date: "Feb 24", time: "1:00 PM", title: "Pricing Discussion - Vertex", participant: "Maria Rodriguez, CFO", duration: "38 mins", outcome: "Negotiating", score: 82, sentiment: "positive", dealValue: "$168K", hasRecording: true },
  ],
};

const teamMeetings = {
  upcoming: [
    { id: "7", date: "Feb 27", time: "11:00 AM", title: "Discovery - Quantum Systems", participant: "Thomas Anderson", rep: "Jordan Lee", duration: "40 mins", type: "Discovery", dealValue: "$112K" },
    { id: "8", date: "Feb 27", time: "3:00 PM", title: "Demo - Fusion Corp", participant: "Rachel Kim", rep: "Morgan Smith", duration: "50 mins", type: "Demo", dealValue: "$97K" },
  ],
  past: [
    { id: "9", date: "Feb 26", time: "10:00 AM", title: "Cold Call - Summit Tech", participant: "Kevin Lee", rep: "Casey Johnson", duration: "15 mins", outcome: "Not Interested", score: 45, sentiment: "negative", dealValue: "$0" },
    { id: "10", date: "Feb 25", time: "11:00 AM", title: "Demo - Nexus Digital", participant: "Amanda Green", rep: "Jordan Lee", duration: "48 mins", outcome: "Proposal Sent", score: 78, sentiment: "positive", dealValue: "$78K" },
  ],
};

export function Meetings() {
  const [activeTab, setActiveTab] = useState("my");
  const [timeFilter, setTimeFilter] = useState("upcoming");

  const renderMeetingCard = (meeting: any, isPast: boolean = false) => (
    <Card 
      key={meeting.id} 
      className="p-4 hover:shadow-md hover:border-gray-300 transition-all border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isPast ? 'bg-gray-100' : meeting.priority === 'high' ? 'bg-red-50' : 'bg-blue-50'
          }`}>
            {isPast ? (
              <Phone className="w-6 h-6 text-gray-600" />
            ) : (
              <Video className={`w-6 h-6 ${meeting.priority === 'high' ? 'text-red-600' : 'text-blue-600'}`} />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link 
                to={`/rep/meeting/${meeting.id}`}
                className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {meeting.title}
              </Link>
              {meeting.type && (
                <Badge variant="outline" className="text-xs capitalize border-gray-300 bg-white">
                  {meeting.type}
                </Badge>
              )}
              {meeting.outcome && (
                <Badge className={`text-xs border-0 ${
                  meeting.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                  meeting.sentiment === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  <CheckCircle2 className="w-3 h-3 mr-0.5" />
                  {meeting.outcome}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {meeting.date} • {meeting.time}
              </span>
              <span>•</span>
              <span>{meeting.duration}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {meeting.participant}
              </span>
              {meeting.rep && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 font-medium">By {meeting.rep}</span>
                </>
              )}
              {meeting.dealValue && meeting.dealValue !== "$0" && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-blue-600">
                    <Target className="w-3.5 h-3.5" />
                    {meeting.dealValue}
                  </span>
                </>
              )}
            </div>

            {meeting.hasRecording && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Link to={`/rep/meeting/${meeting.id}/recording`}>
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      <Play className="w-3 h-3 mr-1" />
                      Play Recording
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <span className="text-xs text-gray-500">
                    AI Summary • Topics • Transcript available
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isPast && meeting.score && (
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                meeting.score >= 85 ? 'text-green-600' :
                meeting.score >= 70 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {meeting.score}
              </div>
              <div className="text-xs text-gray-500 mb-1">Score</div>
              <Progress value={meeting.score} className="w-20 h-1.5" />
            </div>
          )}
          
          {!isPast ? (
            <Link to={`/rep/call/${meeting.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                <Video className="w-3.5 h-3.5 mr-1.5" />
                Join Call
              </Button>
            </Link>
          ) : (
            <Link to={`/rep/meeting/${meeting.id}`}>
              <Button variant="outline" className="h-7 text-xs">
                Review Details
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Meetings</h1>
        <p className="text-sm text-gray-600 mt-1">Manage all your conversations and recordings</p>
      </div>

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
            variant={timeFilter === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("upcoming")}
            className={`h-8 text-xs ${timeFilter === "upcoming" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          >
            Upcoming
          </Button>
          <Button
            variant={timeFilter === "past" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("past")}
            className={`h-8 text-xs ${timeFilter === "past" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          >
            Past
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
            {timeFilter === "upcoming" ? (
              myMeetings.upcoming.length > 0 ? (
                myMeetings.upcoming.map(meeting => renderMeetingCard(meeting, false))
              ) : (
                <Card className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming meetings</p>
                </Card>
              )
            ) : (
              myMeetings.past.map(meeting => renderMeetingCard(meeting, true))
            )}
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-0">
          <div className="space-y-3">
            {timeFilter === "upcoming" ? (
              teamMeetings.upcoming.map(meeting => renderMeetingCard(meeting, false))
            ) : (
              teamMeetings.past.map(meeting => renderMeetingCard(meeting, true))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-3">
            {timeFilter === "upcoming" ? (
              [...myMeetings.upcoming, ...teamMeetings.upcoming].map(meeting => renderMeetingCard(meeting, false))
            ) : (
              [...myMeetings.past, ...teamMeetings.past].map(meeting => renderMeetingCard(meeting, true))
            )}
          </div>
        </TabsContent>

        <TabsContent value="shared" className="mt-0">
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No shared meetings</p>
            <p className="text-sm text-gray-500">Meetings shared with you will appear here</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}