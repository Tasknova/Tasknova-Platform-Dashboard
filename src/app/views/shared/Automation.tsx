import { useState } from "react";
import {
  Zap,
  Play,
  Pause,
  Settings,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Database,
  Workflow,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";

const workflows = [
  {
    id: "1",
    name: "Auto-send meeting recap",
    description: "Automatically send AI-generated meeting recap to attendees within 5 minutes of call ending",
    trigger: "Meeting Ends",
    actions: ["Generate Summary", "Extract Action Items", "Send Email"],
    status: "active",
    runs: 342,
    successRate: 98,
    lastRun: "12 minutes ago",
    timeSaved: "28.5 hours",
  },
  {
    id: "2",
    name: "Follow-up task creation",
    description: "Create follow-up tasks in CRM when AI detects commitment or next steps in conversation",
    trigger: "AI Detects Commitment",
    actions: ["Extract Commitment", "Create Task", "Assign Owner", "Set Due Date"],
    status: "active",
    runs: 156,
    successRate: 95,
    lastRun: "2 hours ago",
    timeSaved: "13 hours",
  },
  {
    id: "3",
    name: "Deal risk alerts",
    description: "Send Slack notification to manager when deal shows risk signals (sentiment drop, competitor mention, timeline push)",
    trigger: "Risk Signal Detected",
    actions: ["Analyze Conversation", "Calculate Risk Score", "Send Slack Alert"],
    status: "active",
    runs: 23,
    successRate: 100,
    lastRun: "1 day ago",
    timeSaved: "4.5 hours",
  },
  {
    id: "4",
    name: "Onboarding sequence trigger",
    description: "Automatically enroll new customers in onboarding email sequence when deal is marked closed-won",
    trigger: "Deal Closed-Won",
    actions: ["Create Contact", "Tag Customer", "Enroll in Sequence", "Notify CS Team"],
    status: "active",
    runs: 18,
    successRate: 100,
    lastRun: "3 days ago",
    timeSaved: "6 hours",
  },
  {
    id: "5",
    name: "Coaching opportunity flagging",
    description: "Flag calls with talk-time ratio issues or missed discovery questions for coaching review",
    trigger: "Call Analyzed",
    actions: ["Analyze Metrics", "Detect Patterns", "Create Coaching Card", "Notify Manager"],
    status: "active",
    runs: 89,
    successRate: 92,
    lastRun: "45 minutes ago",
    timeSaved: "11 hours",
  },
  {
    id: "6",
    name: "Competitive intel extraction",
    description: "Extract competitor mentions from calls and update competitive intelligence dashboard",
    trigger: "Competitor Mentioned",
    actions: ["Extract Context", "Update Dashboard", "Tag Deal", "Alert Product Team"],
    status: "paused",
    runs: 67,
    successRate: 94,
    lastRun: "5 days ago",
    timeSaved: "8.5 hours",
  },
  {
    id: "7",
    name: "Pre-meeting brief generation",
    description: "Generate and send pre-meeting brief 1 hour before scheduled call with context from previous interactions",
    trigger: "1 Hour Before Meeting",
    actions: ["Pull Context", "Generate Brief", "Email to Rep", "Slack Notification"],
    status: "active",
    runs: 278,
    successRate: 97,
    lastRun: "1 hour ago",
    timeSaved: "46 hours",
  },
  {
    id: "8",
    name: "Pipeline health check",
    description: "Run weekly pipeline analysis and email report to sales leadership with risk assessment",
    trigger: "Weekly Schedule",
    actions: ["Analyze Pipeline", "Generate Report", "Calculate Metrics", "Email Leaders"],
    status: "active",
    runs: 12,
    successRate: 100,
    lastRun: "4 days ago",
    timeSaved: "24 hours",
  },
];

const integrations = [
  {
    id: "1",
    name: "Salesforce",
    type: "CRM",
    status: "connected",
    logo: "🔷",
    actions: ["Sync deals", "Update contacts", "Create tasks", "Log activities"],
    lastSync: "2 minutes ago",
    recordsSynced: 1247,
  },
  {
    id: "2",
    name: "HubSpot",
    type: "Marketing",
    status: "connected",
    logo: "🟠",
    actions: ["Sync contacts", "Update properties", "Trigger workflows"],
    lastSync: "5 minutes ago",
    recordsSynced: 892,
  },
  {
    id: "3",
    name: "Slack",
    type: "Communication",
    status: "connected",
    logo: "💬",
    actions: ["Send notifications", "Post summaries", "Alert on risks"],
    lastSync: "Just now",
    recordsSynced: 456,
  },
  {
    id: "4",
    name: "Google Calendar",
    type: "Calendar",
    status: "connected",
    logo: "📅",
    actions: ["Sync meetings", "Create events", "Update attendees"],
    lastSync: "1 minute ago",
    recordsSynced: 234,
  },
  {
    id: "5",
    name: "Zoom",
    type: "Video",
    status: "connected",
    logo: "🎥",
    actions: ["Record meetings", "Generate transcripts", "Extract insights"],
    lastSync: "10 minutes ago",
    recordsSynced: 178,
  },
  {
    id: "6",
    name: "Gong",
    type: "Revenue Intelligence",
    status: "available",
    logo: "📊",
    actions: ["Import recordings", "Sync analytics", "Share insights"],
    lastSync: null,
    recordsSynced: 0,
  },
];

const automationMetrics = [
  { label: "Active Workflows", value: "7", change: "+2", trend: "up" },
  { label: "Total Runs", value: "965", change: "+156", trend: "up" },
  { label: "Success Rate", value: "96.8%", change: "+1.2%", trend: "up" },
  { label: "Time Saved", value: "141.5hrs", change: "+23.5hrs", trend: "up" },
];

const recentRuns = [
  {
    id: "1",
    workflow: "Auto-send meeting recap",
    trigger: "Discovery - Acme Corp",
    status: "success",
    duration: "4.2s",
    time: "12 minutes ago",
  },
  {
    id: "2",
    workflow: "Pre-meeting brief generation",
    trigger: "Scheduled: Demo - TechStart",
    status: "success",
    duration: "2.8s",
    time: "1 hour ago",
  },
  {
    id: "3",
    workflow: "Follow-up task creation",
    trigger: "AI detected commitment",
    status: "success",
    duration: "1.5s",
    time: "2 hours ago",
  },
  {
    id: "4",
    workflow: "Coaching opportunity flagging",
    trigger: "Call analyzed: Casey Johnson",
    status: "success",
    duration: "3.1s",
    time: "45 minutes ago",
  },
  {
    id: "5",
    workflow: "Auto-send meeting recap",
    trigger: "Demo - DataFlow",
    status: "failed",
    duration: "5.2s",
    time: "3 hours ago",
    error: "Email delivery failed",
  },
];

export function Automation() {
  const [activeTab, setActiveTab] = useState("workflows");

  const handleToggleWorkflow = (id: string) => {
    console.log(`Toggle workflow ${id}`);
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Automation</h1>
              <p className="text-sm text-gray-600 mt-1">
                Workflow automation and system integrations
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Zap className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-4">
            {automationMetrics.map((metric, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {metric.value}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {metric.change}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 max-w-[1600px] mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 mb-6">
            <TabsTrigger value="workflows" className="gap-2">
              <Workflow className="w-4 h-4" />
              Workflows
              <Badge variant="secondary">{workflows.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Database className="w-4 h-4" />
              Integrations
              <Badge variant="secondary">{integrations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="w-4 h-4" />
              Run History
              <Badge variant="secondary">{recentRuns.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {workflow.name}
                      </h3>
                      <Badge
                        className={
                          workflow.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {workflow.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {workflow.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        {workflow.runs} runs
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {workflow.successRate}% success
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {workflow.timeSaved} saved
                      </div>
                      <span>• Last run {workflow.lastRun}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={workflow.status === "active"}
                      onCheckedChange={() => handleToggleWorkflow(workflow.id)}
                    />
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-purple-100 text-purple-700">
                      Trigger: {workflow.trigger}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Actions:</span>
                    {workflow.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {action}
                        </Badge>
                        {index < workflow.actions.length - 1 && (
                          <span className="text-gray-400">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium text-gray-900">
                      {workflow.successRate}%
                    </span>
                  </div>
                  <Progress value={workflow.successRate} className="mt-2" />
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {integrations.map((integration) => (
                <Card key={integration.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                        {integration.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {integration.name}
                        </h3>
                        <p className="text-sm text-gray-600">{integration.type}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        integration.status === "connected"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {integration.status}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="text-sm">
                      <p className="text-gray-600 mb-2">Available Actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {integration.actions.map((action, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {integration.status === "connected" && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last sync:</span>
                          <span className="font-medium text-gray-900">
                            {integration.lastSync}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-600">Records synced:</span>
                          <span className="font-medium text-gray-900">
                            {integration.recordsSynced.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant={
                      integration.status === "connected" ? "outline" : "default"
                    }
                    size="sm"
                    className="w-full"
                  >
                    {integration.status === "connected"
                      ? "Configure"
                      : "Connect"}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Run History Tab */}
          <TabsContent value="history" className="space-y-3">
            {recentRuns.map((run) => (
              <Card key={run.id} className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {run.workflow}
                      </h3>
                      <Badge
                        className={
                          run.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {run.status === "success" ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {run.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Triggered by: {run.trigger}</span>
                      <span>•</span>
                      <span>Duration: {run.duration}</span>
                      <span>•</span>
                      <span>{run.time}</span>
                    </div>
                    {run.error && (
                      <p className="text-sm text-red-600 mt-2">
                        Error: {run.error}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    View Logs
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="p-8 text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Automation Analytics
              </h3>
              <p className="text-gray-600 mb-4">
                View workflow performance, time savings, and automation trends
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Full Analytics
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
