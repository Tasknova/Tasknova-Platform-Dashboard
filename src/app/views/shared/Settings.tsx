import { useEffect, useMemo, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Calendar,
  Mic,
  Video,
  Mail,
  Smartphone,
  Globe,
  CreditCard,
  Users,
  Shield,
  Zap,
  Database,
  MessageSquare,
  FileText,
  Target,
  Brain,
  Workflow,
  Code,
  BarChart3,
  UserPlus,
  Tag,
  Lightbulb,
  Award,
  ClipboardList,
  BookOpen,
  Building2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { supabase } from "../../../lib/supabase";
import {
  addCallNumber,
  assignCallNumber,
  getCallNumbers,
  ManagedCallNumber,
  verifyCallNumber,
} from "../../../lib/callNumbers";

type TeamMember = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
};

export function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const userRole = localStorage.getItem("userRole") || "rep";
  const organizationId = localStorage.getItem("userOrganization") || "";
  const currentUserId = localStorage.getItem("userId") || "";
  const currentUserName = localStorage.getItem("userName") || "Admin";
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [managedNumbers, setManagedNumbers] = useState<ManagedCallNumber[]>([]);
  const [newNumberInput, setNewNumberInput] = useState("");
  const [numbersError, setNumbersError] = useState<string | null>(null);
  const [numbersSuccess, setNumbersSuccess] = useState<string | null>(null);

  const organizationSettings = [
    { id: "general", label: "General", icon: Building2 },
    { id: "call-numbers", label: "Call Numbers", icon: Smartphone, roles: ["admin"] },
    { id: "recording-policies", label: "Recording Policies", icon: Mic },
    { id: "privacy-policies", label: "Privacy Policies", icon: Shield },
    { id: "consent-policies", label: "Consent Policies", icon: FileText },
    { id: "notification-policies", label: "Notification Policies", icon: Bell },
    { id: "purposes-outcomes", label: "Purposes & Outcomes", icon: Target },
    { id: "templates", label: "Templates", icon: ClipboardList },
    { id: "answer-cards", label: "Answer Cards", icon: MessageSquare },
    { id: "smart-topics", label: "Smart Topics", icon: Lightbulb },
    { id: "scorecards", label: "Scorecards", icon: Award },
    { id: "prompt-library", label: "Prompt Library", icon: BookOpen },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "automations", label: "Automations", icon: Workflow },
    { id: "scheduler", label: "Scheduler", icon: Calendar },
    { id: "developer", label: "Developer", icon: Code, roles: ["manager", "admin"] },
    { id: "teams", label: "Teams", icon: Users, roles: ["manager", "admin"] },
    { id: "members", label: "Members", icon: UserPlus, roles: ["manager", "admin"] },
    { id: "billing", label: "Billing", icon: CreditCard, roles: ["manager", "admin"] },
  ];

  // Filter settings based on user role
  const filteredSettings = organizationSettings.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const userNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const member of teamMembers) {
      const fallback = member.email || "Unknown";
      map.set(member.user_id, member.full_name || fallback);
    }

    if (currentUserId && !map.has(currentUserId)) {
      map.set(currentUserId, currentUserName);
    }

    return map;
  }, [teamMembers, currentUserId, currentUserName]);

  const yourNumbers = managedNumbers.filter((item) => item.assignedToUserId === currentUserId);
  const teamNumbers = managedNumbers.filter((item) => item.assignedToUserId !== currentUserId);

  useEffect(() => {
    if (!organizationId) return;

    const loadMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("user_id, full_name, email, role")
          .eq("org_id", organizationId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setTeamMembers((data || []) as TeamMember[]);
      } catch (error) {
        console.error("Failed to load team members for call number assignment:", error);
      }
    };

    void loadMembers();
    setManagedNumbers(getCallNumbers(organizationId));
  }, [organizationId]);

  const handleAddNumber = () => {
    if (!organizationId) {
      setNumbersError("Organization context is missing.");
      return;
    }

    const result = addCallNumber(organizationId, newNumberInput, currentUserId || "admin");

    if (!result.ok) {
      setNumbersError(result.error || "Failed to add number.");
      setNumbersSuccess(null);
      return;
    }

    setManagedNumbers(getCallNumbers(organizationId));
    setNewNumberInput("");
    setNumbersError(null);
    setNumbersSuccess("Number added. Click Verify to complete OTP verification simulation.");
  };

  const handleVerifyNumber = (numberId: string) => {
    if (!organizationId) return;
    const updated = verifyCallNumber(organizationId, numberId);
    setManagedNumbers(updated);
    setNumbersError(null);
    setNumbersSuccess("Number verified successfully.");
  };

  const handleAssignNumber = (numberId: string, assignedUserId: string) => {
    if (!organizationId) return;

    const assignedName = userNameById.get(assignedUserId) || "Unknown";
    const updated = assignCallNumber(organizationId, numberId, assignedUserId, assignedName);
    setManagedNumbers(updated);
    setNumbersError(null);
    setNumbersSuccess("Number assignment updated.");
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Settings Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Settings</h2>
        </div>

        <nav className="flex-1 px-2 py-3">
          {/* Organization Section */}
          <div className="mb-4">
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Organization
            </div>
            <div className="space-y-0.5 mt-1">
              {filteredSettings.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-sm font-semibold text-gray-900">
              {organizationSettings.find(s => s.id === activeSection)?.label || "Settings"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Cancel
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
              Save Changes
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl">
            {/* General Settings */}
            {activeSection === "general" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Organization Name</h2>
                  <div className="space-y-4">
                    <Input defaultValue="Tasknova AI" className="max-w-md" />
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Update Name
                    </Button>
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">Multi-language Preferences</h2>
                    <Badge variant="outline" className="text-xs">Beta</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Add the most commonly spoken languages in your organizations' conversations (Maximum 5 languages)
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Select defaultValue="english">
                        <SelectTrigger className="w-48 h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge variant="outline" className="text-xs px-2 py-0.5">English ×</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      + Add Language
                    </Button>
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Security</h2>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Allow Tasknova employees to access your account for troubleshooting issues and support.
                        </p>
                        <p className="text-xs text-gray-600">
                          If enabled, Tasknova employees will have access to the user accounts within your organization for troubleshooting issues and providing support.
                        </p>
                      </div>
                      <Switch className="ml-4" />
                    </div>
                    <div className="flex items-start justify-between py-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Allow only admins to delete the recordings in Tasknova
                        </p>
                        <p className="text-xs text-gray-600">
                          When enabled, only admins will be able to delete recordings. All other users will not have access to the delete option.
                        </p>
                      </div>
                      <Switch className="ml-4" defaultChecked />
                    </div>
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Extreme Measures</h2>
                  <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                    <p className="text-sm font-medium text-red-900 mb-2">Delete Organization</p>
                    <p className="text-xs text-red-700 mb-3">
                      Permanently delete your organization and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-red-300 text-red-700 hover:bg-red-100">
                      Delete Organization
                    </Button>
                  </div>
                </section>
              </div>
            )}

            {/* Recording Policies */}
            {activeSection === "call-numbers" && userRole === "admin" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Add Number</h2>
                  <p className="text-xs text-gray-600 mb-4">
                    Add outbound numbers, verify them, and assign each number to exactly one team member.
                  </p>

                  <div className="flex items-center gap-3 max-w-2xl">
                    <Input
                      value={newNumberInput}
                      onChange={(e) => setNewNumberInput(e.target.value)}
                      placeholder="+919999999999"
                      className="h-9"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700 h-9" onClick={handleAddNumber}>
                      Add Number
                    </Button>
                  </div>

                  {numbersError && (
                    <p className="text-xs text-red-600 mt-3">{numbersError}</p>
                  )}
                  {numbersSuccess && (
                    <p className="text-xs text-green-700 mt-3">{numbersSuccess}</p>
                  )}

                  <div className="mt-6 space-y-3">
                    {managedNumbers.length === 0 ? (
                      <p className="text-sm text-gray-600">No numbers added yet.</p>
                    ) : (
                      managedNumbers.map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.phoneNumber}</p>
                            <p className="text-xs text-gray-600">
                              Assigned to: {item.assignedToName || "Unassigned"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={item.verified ? "default" : "outline"}
                              className={`h-8 text-xs ${item.verified ? "bg-green-600 hover:bg-green-700" : ""}`}
                              onClick={() => handleVerifyNumber(item.id)}
                              disabled={item.verified}
                            >
                              {item.verified ? "Verified" : "Verify"}
                            </Button>

                            <Select
                              value={item.assignedToUserId || "unassigned"}
                              onValueChange={(value) => {
                                if (value === "unassigned") return;
                                handleAssignNumber(item.id, value);
                              }}
                            >
                              <SelectTrigger className="w-52 h-8 text-xs">
                                <SelectValue placeholder="Assign to member" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {teamMembers.map((member) => (
                                  <SelectItem key={member.user_id} value={member.user_id}>
                                    {member.full_name || member.email || member.user_id}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">Your Numbers</h2>
                  <div className="space-y-2">
                    {yourNumbers.length === 0 ? (
                      <p className="text-sm text-gray-600">No numbers are assigned to you yet.</p>
                    ) : (
                      yourNumbers.map((item) => (
                        <div key={item.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{item.phoneNumber}</span>
                          <Badge className={item.verified ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                            {item.verified ? "Verified" : "Pending verification"}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">Team Numbers</h2>
                  <div className="space-y-2">
                    {teamNumbers.length === 0 ? (
                      <p className="text-sm text-gray-600">No team numbers available.</p>
                    ) : (
                      teamNumbers.map((item) => (
                        <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{item.phoneNumber}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.assignedToName || "Unassigned"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* Recording Policies */}
            {activeSection === "recording-policies" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Default Recording Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Auto-record all meetings</p>
                        <p className="text-xs text-gray-600">Automatically start recording for all scheduled meetings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Auto-transcribe recordings</p>
                        <p className="text-xs text-gray-600">Generate AI transcripts for all recordings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-start justify-between py-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Show recording indicator</p>
                        <p className="text-xs text-gray-600">Display recording status to all participants</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Recording Consent</h2>
                  <div className="space-y-3">
                    <Label className="text-sm">Consent Message</Label>
                    <Textarea 
                      defaultValue="This meeting is being recorded for quality and training purposes. By continuing, you consent to this recording."
                      className="text-sm"
                      rows={3}
                    />
                    <p className="text-xs text-gray-600">This message will be displayed to participants before recording starts</p>
                  </div>
                </section>
              </div>
            )}

            {/* Privacy Policies */}
            {activeSection === "privacy-policies" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Data Privacy</h2>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Data encryption at rest</p>
                        <p className="text-xs text-gray-600">All data is encrypted using AES-256 encryption</p>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">Active</Badge>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Data encryption in transit</p>
                        <p className="text-xs text-gray-600">All data transmission uses TLS 1.3</p>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">Active</Badge>
                    </div>
                    <div className="flex items-start justify-between py-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">GDPR compliance</p>
                        <p className="text-xs text-gray-600">Full compliance with EU data protection regulations</p>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">Compliant</Badge>
                    </div>
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Data Retention</h2>
                  <div className="space-y-3">
                    <Label className="text-sm">Recording Retention Period</Label>
                    <Select defaultValue="90">
                      <SelectTrigger className="w-64 h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-600">Recordings will be automatically deleted after this period</p>
                  </div>
                </section>
              </div>
            )}

            {/* Notification Policies */}
            {activeSection === "notification-policies" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Email Notifications</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Meeting reminders", desc: "15 minutes before scheduled meetings" },
                      { label: "AI insights ready", desc: "When AI analysis is complete" },
                      { label: "Task assignments", desc: "When tasks are assigned" },
                      { label: "Deal stage changes", desc: "When deal stages are updated" },
                      { label: "Weekly summary", desc: "Performance summary every Monday" },
                      { label: "Coaching feedback", desc: "When managers provide feedback" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-600">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Scorecards */}
            {activeSection === "scorecards" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">Active Scorecards</h2>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                      + Create Scorecard
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Discovery Call Scorecard", criteria: 8, status: "Active" },
                      { name: "Demo Scorecard", criteria: 12, status: "Active" },
                      { name: "Negotiation Scorecard", criteria: 10, status: "Draft" },
                    ].map((scorecard, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{scorecard.name}</p>
                          <p className="text-xs text-gray-600">{scorecard.criteria} criteria</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${
                            scorecard.status === "Active" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}>
                            {scorecard.status}
                          </Badge>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Integrations */}
            {activeSection === "integrations" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Connected Integrations</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Gmail", status: "disconnected", color: "#EA4335", logo: (
                        <Mail className="w-6 h-6" />
                      ), action: () => window.location.href = "/rep/emails" },
                      { name: "Salesforce", status: "connected", color: "#00A1E0", logo: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M10.006 5.413a4.905 4.905 0 014.101-2.204 4.91 4.91 0 014.385 2.72 3.814 3.814 0 012.117-.637c2.127 0 3.85 1.73 3.85 3.866a3.867 3.867 0 01-.816 2.365 3.726 3.726 0 01.502 1.875A3.867 3.867 0 0120.278 17.3a4.77 4.77 0 01-3.934 2.063 4.765 4.765 0 01-3.394-1.425 4.905 4.905 0 01-4.101 2.205 4.91 4.91 0 01-4.385-2.72 3.814 3.814 0 01-2.117.637A3.857 3.857 0 01-.5 14.193a3.867 3.867 0 01.816-2.365 3.726 3.726 0 01-.502-1.875A3.867 3.867 0 013.681 6.086a4.77 4.77 0 013.934-2.063c.834 0 1.635.22 2.391.637v.753z"/>
                        </svg>
                      )},
                      { name: "HubSpot", status: "connected", color: "#FF7A59", logo: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.063A2.047 2.047 0 0017.388 1a2.047 2.047 0 00-2.043 2.043v.062a2.198 2.198 0 001.267 1.978v2.86a4.929 4.929 0 00-2.606 1.544l-5.72-4.04a2.59 2.59 0 10-1.107 1.364l5.673 4.006a4.927 4.927 0 00.166 6.06 4.89 4.89 0 003.445 1.427 4.894 4.894 0 003.463-1.427 4.894 4.894 0 001.427-3.463 4.894 4.894 0 00-3.189-4.584zm-1.253 7.232a2.901 2.901 0 01-2.058.851 2.901 2.901 0 01-2.058-.85 2.901 2.901 0 01-.85-2.058c0-.775.3-1.507.85-2.058a2.901 2.901 0 012.058-.85 2.901 2.901 0 012.058.85 2.901 2.901 0 01.85 2.058 2.901 2.901 0 01-.85 2.058z"/>
                        </svg>
                      )},
                      { name: "Slack", status: "connected", color: "#4A154B", logo: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M6 15a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2h2v2zm1 0a2 2 0 012-2 2 2 0 012 2v5a2 2 0 01-2 2 2 2 0 01-2-2v-5zM9 6a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2v2H9zm0 1a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2 2 2 0 012-2h5zm9 2a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2h-2V9zm-1 0a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2 2 2 0 012 2v5zm-2 9a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2v-2h2zm0-1a2 2 0 01-2-2 2 2 0 012-2h5a2 2 0 012 2 2 2 0 01-2 2h-5z"/>
                        </svg>
                      )},
                      { name: "Zoom", status: "connected", color: "#2D8CFF", logo: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M7.5 9h7a.5.5 0 01.5.5v5a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5z"/>
                          <path d="M23.498 12.002a1.5 1.5 0 00-.665-1.24l-4.833-3.222V9.5a2.5 2.5 0 00-2.5-2.5h-7A2.5 2.5 0 006 9.5v5a2.5 2.5 0 002.5 2.5h7a2.5 2.5 0 002.5-2.5v-.96l4.833-3.222a1.5 1.5 0 00.665-1.24v-.076z"/>
                        </svg>
                      )},
                      { name: "Google Calendar", status: "connected", color: "#4285F4", logo: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                          <path d="M9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                        </svg>
                      )},
                      { name: "Microsoft Teams", status: "disconnected", color: "#5059C9", logo: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M20.625 8.25h-7.5a.375.375 0 00-.375.375v7.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-7.5a.375.375 0 00-.375-.375z"/>
                          <path d="M11.25 4.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-7.5 6h10.5c.414 0 .75.336.75.75v9c0 .414-.336.75-.75.75H3.75a.75.75 0 01-.75-.75v-9c0-.414.336-.75.75-.75z"/>
                        </svg>
                      )},
                    ].map((integration, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-4 border rounded-lg ${
                          integration.status === "connected"
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center"
                            style={{ color: integration.color }}
                          >
                            {integration.logo}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                            <p className="text-xs text-gray-600 capitalize">{integration.status}</p>
                          </div>
                        </div>
                        <Button
                          variant={integration.status === "connected" ? "outline" : "default"}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={integration.action ? integration.action : undefined}
                        >
                          {integration.status === "connected" ? "Configure" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Teams */}
            {activeSection === "teams" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">Teams</h2>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                      + Create Team
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Enterprise Sales", members: 24, manager: "Morgan Smith" },
                      { name: "Mid-Market", members: 18, manager: "Alex Rivera" },
                      { name: "SMB Sales", members: 32, manager: "Jordan Lee" },
                    ].map((team, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{team.name}</p>
                          <p className="text-xs text-gray-600">{team.members} members • Manager: {team.manager}</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Manage
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Members */}
            {activeSection === "members" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">Team Members (142)</h2>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Search members..." className="w-64 h-8 text-sm" />
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                        + Invite Member
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Alex Rivera", email: "alex@company.com", role: "Rep", status: "Active" },
                      { name: "Jordan Lee", email: "jordan@company.com", role: "Rep", status: "Active" },
                      { name: "Morgan Smith", email: "morgan@company.com", role: "Manager", status: "Active" },
                      { name: "Casey Johnson", email: "casey@company.com", role: "Rep", status: "Active" },
                      { name: "Taylor Brooks", email: "taylor@company.com", role: "Rep", status: "Active" },
                    ].map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-600">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs px-2 py-0.5">{member.role}</Badge>
                          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5">
                            {member.status}
                          </Badge>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Billing */}
            {activeSection === "billing" && userRole === "admin" && (
              <div className="space-y-6">
                {/* License & Plan Overview */}
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">License & Plan Overview</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Monthly
                      </Button>
                      <Button size="sm" className="h-7 text-xs bg-blue-600">
                        Annual (Save 20%)
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-xs text-blue-700 font-medium mb-1">Active Plan</p>
                      <p className="text-2xl font-bold text-blue-900">Enterprise</p>
                      <p className="text-xs text-blue-600 mt-1">Unlimited features</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-xs text-purple-700 font-medium mb-1">Seats Used</p>
                      <p className="text-2xl font-bold text-purple-900">142 / 150</p>
                      <p className="text-xs text-purple-600 mt-1">8 seats available</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-xs text-green-700 font-medium mb-1">Cost per Seat</p>
                      <p className="text-2xl font-bold text-green-900">$49</p>
                      <p className="text-xs text-green-600 mt-1">per month</p>
                    </div>
                  </div>

                  {/* Active Add-ons */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Active Add-ons</h3>
                    <div className="space-y-2">
                      {[
                        { name: "Advanced AI Analysis", cost: "+$99/mo", status: "active" },
                        { name: "Custom Scorecards", cost: "+$49/mo", status: "active" },
                        { name: "Priority Support", cost: "Included", status: "included" },
                      ].map((addon, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${addon.status === "active" ? "bg-green-500" : "bg-blue-500"}`} />
                            <span className="text-sm font-medium text-gray-900">{addon.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{addon.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Current Plan</h2>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Enterprise Plan</h3>
                        <p className="text-sm text-gray-600">Unlimited users • Advanced AI features</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900">$499</p>
                        <p className="text-xs text-gray-600">per month</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Change Plan
                      </Button>
                      <Button size="sm" className="h-8 text-xs">
                        Manage Billing
                      </Button>
                    </div>
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Payment Method</h2>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                        <p className="text-xs text-gray-600">Expires 12/2026</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Update
                    </Button>
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Billing History</h2>
                  <div className="space-y-2">
                    {[
                      { date: "Feb 1, 2026", amount: "$499.00", status: "Paid" },
                      { date: "Jan 1, 2026", amount: "$499.00", status: "Paid" },
                      { date: "Dec 1, 2025", amount: "$499.00", status: "Paid" },
                    ].map((invoice, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{invoice.date}</p>
                          <p className="text-xs text-gray-600">Enterprise Plan</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-semibold text-gray-900">{invoice.amount}</p>
                          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                            {invoice.status}
                          </Badge>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Templates */}
            {activeSection === "templates" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Templates Yet
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create reusable templates for meetings, emails, and more.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                    + Create Template
                  </Button>
                </section>
              </div>
            )}

            {/* Answer Cards */}
            {activeSection === "answer-cards" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Answer Cards Yet
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create quick response cards for common questions and objections.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                    + Create Answer Card
                  </Button>
                </section>
              </div>
            )}

            {/* Smart Topics */}
            {activeSection === "smart-topics" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Smart Topics Yet
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure AI to automatically detect and track important topics in conversations.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                    + Create Smart Topic
                  </Button>
                </section>
              </div>
            )}

            {/* Prompt Library */}
            {activeSection === "prompt-library" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Prompts Yet
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Build a library of AI prompts for different conversation scenarios.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                    + Create Prompt
                  </Button>
                </section>
              </div>
            )}

            {/* Automations */}
            {activeSection === "automations" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Workflow className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Automations Yet
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create automated workflows to streamline your sales process.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                    + Create Automation
                  </Button>
                </section>
              </div>
            )}

            {/* Scheduler */}
            {activeSection === "scheduler" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Scheduling Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Buffer time between meetings</p>
                        <p className="text-xs text-gray-600">Add buffer time before and after meetings</p>
                      </div>
                      <Select defaultValue="15">
                        <SelectTrigger className="w-32 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Default meeting duration</p>
                        <p className="text-xs text-gray-600">Standard length for new meetings</p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-32 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-start justify-between py-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Allow booking on weekends</p>
                        <p className="text-xs text-gray-600">Let people schedule meetings on Saturday and Sunday</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Developer */}
            {activeSection === "developer" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">API Keys</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 font-mono">
                          sk_live_•••••••••••••••••••••••••••4a2b
                        </p>
                        <p className="text-xs text-gray-600">Created Feb 15, 2026</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Regenerate
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs mt-4">
                    + Generate New API Key
                  </Button>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Webhooks</h2>
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      No Webhooks Configured
                    </h3>
                    <p className="text-xs text-gray-600 mb-4">
                      Set up webhooks to receive real-time notifications about events.
                    </p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                      + Add Webhook
                    </Button>
                  </div>
                </section>
              </div>
            )}

            {/* Consent Policies */}
            {activeSection === "consent-policies" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Consent Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Require consent before recording</p>
                        <p className="text-xs text-gray-600">Ask for participant consent before starting recording</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Show consent banner</p>
                        <p className="text-xs text-gray-600">Display consent banner during calls</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-start justify-between py-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Log consent decisions</p>
                        <p className="text-xs text-gray-600">Keep a record of all consent decisions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Purposes & Outcomes */}
            {activeSection === "purposes-outcomes" && (
              <div className="space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Purposes Configured
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Define meeting purposes and track outcomes to measure effectiveness.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                    + Add Purpose
                  </Button>
                </section>
              </div>
            )}

            {/* Placeholder for other sections - remove this now since we've handled all */}
            {!["general", "call-numbers", "recording-policies", "privacy-policies", "notification-policies", "scorecards", "integrations", "teams", "members", "billing", "templates", "answer-cards", "smart-topics", "prompt-library", "automations", "scheduler", "developer", "consent-policies", "purposes-outcomes"].includes(activeSection) && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const Icon = organizationSettings.find(s => s.id === activeSection)?.icon || SettingsIcon;
                    return <Icon className="w-8 h-8 text-gray-400" />;
                  })()}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {organizationSettings.find(s => s.id === activeSection)?.label || "Settings"}
                </h3>
                <p className="text-sm text-gray-600">
                  Configure your {organizationSettings.find(s => s.id === activeSection)?.label.toLowerCase()} settings here.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}