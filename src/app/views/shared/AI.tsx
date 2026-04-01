import { useState } from "react";
import {
  Sparkles,
  Calendar,
  Send,
  MessageSquare,
  Zap,
  TrendingUp,
  ChevronDown,
  Target,
  Users,
  BarChart3,
  Search,
  Plus,
  FileText,
  AlertTriangle,
  Trophy,
  GitBranch,
  Shield,
  Activity,
  Clock,
  Briefcase,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

export function AI() {
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);
  const userRole = localStorage.getItem("userRole") || "rep";
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const suggestedPrompts = [
    {
      title: "Follow-up Email Draft",
      description:
        "Write a concise follow-up email to the prospect that confirms Tuesday's agenda for the demo call, thanks them for their time, references key pain points mentioned, and lists 5 pointed questions we need answered.",
      icon: MessageSquare,
      color: "purple",
    },
    {
      title: "Pricing Objection Pack",
      description:
        "Create a one-page objection-handling cheat sheet focused on pricing concerns. Include 3 proof points to counter budget concerns, 2 demo tests to propose, and 4 tight talk-tracks tailored to this deal size.",
      icon: Target,
      color: "blue",
    },
    {
      title: "Deal Risk Analysis",
      description:
        "Analyze DataFlow Analytics deal: identify why it stalled after 25 days in discovery, extract competitor mentions from last 3 calls, and recommend 3 specific actions to re-engage by end of week.",
      icon: TrendingUp,
      color: "orange",
    },
    {
      title: "Stakeholder Influence Map",
      description:
        "Review meeting patterns to surface the decision maker, champions, blockers across Acme Corp. Then recommend a standardized next-step checklist and personalized engagement strategy for each person.",
      icon: Users,
      color: "teal",
    },
  ];

  const savedPrompts = [
    {
      title: "Win/Loss Analysis",
      description: "Compare recent closed-won vs. closed-lost deals to identify success patterns and failure modes.",
      fullDescription: `Compare recent closed-won vs. closed-lost deals to identify success patterns and failure modes.

## Closed-Won & Closed-Lost Analysis
For each group, output a table with columns: Question, Finding. Cover: main reason they chose/rejected us (stated + inferred), decision timeline, economic buyer engagement, competitive set, key turning-point moments, whether there was a champion, and which value proposition resonated (or didn't).

## Comparative Analysis
Output a table with columns: Factor, Won, Lost, Learning. Cover: avg decision timeline, champion engagement rate, discovery completion, competitive positioning, and budget confirmation rate.

## Key Patterns
List 2–3 patterns for why we win and 2 for why we lose, each with example deals.

## Competitive Positioning Insights
Output a table with columns: Question, Finding. Cover: competitor we beat consistently and how, competitor we struggle against and why, our unfair advantage, and our main gaps.

## Sales Process & Coaching Implications
Output a table with columns: Question, Finding. Cover: where deals stall, qualification vs. execution issues, playbook gaps, rep training needs, and any battlecards needed.

## Business Recommendations
Output a table with columns: Priority, Area, Recommendation. Provide 3–5 rows covering: what to double down on, what to fix, deal types to avoid, and marketing/positioning implications.

Format as a quarterly executive summary.`,
      icon: Trophy,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Call Quality Coaching Feedback",
      description: "Review this sales call and provide constructive coaching feedback for the rep.",
      fullDescription: `Review this sales call and provide constructive coaching feedback for the rep:

## What Went Well
- What did the rep do well in this call?
- Which moments showed strong discovery, handling objections, or building rapport?
- What questions or techniques were particularly effective?
- Did they uncover important information or advance the deal?

## Discovery Depth
- Did the rep understand the prospect's pain point, budget, timeline, and decision process?
- What discovery questions were asked?
- Were there any discovery gaps? (e.g., "budget not confirmed" or "decision-maker not identified")
- Did they confirm next steps and action items with the prospect?

## Value Positioning
- How did they position the product?
- Did they tailor the value message to the prospect's specific needs?
- Were there missed opportunities to differentiate or address stated objections?

## Objection Handling
- How did the rep respond to objections?
- Were objections addressed directly or deflected?
- Did they reframe concerns into opportunities?

## Talking Time & Engagement
- Was the rep doing most of the talking, or did they listen and ask questions?
- Ideal ratio for discovery calls: Rep 40% / Prospect 60%
- Was there natural dialogue or did it feel scripted?

## Specific Coaching Moments
List 2-3 specific moments where the rep could improve. For each:
- **Moment:** What was said or done?
- **What to do differently:** Specific alternative approach
- **Why:** How would this improve the outcome?`,
      icon: Zap,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
      roles: ["manager", "admin"],
    },
    {
      title: "Account Health Score Report",
      description: "Assess the overall health of this customer account based on recent interactions.",
      fullDescription: `Assess the overall health of this customer account based on recent interactions. For each of the five sections below, output a table with columns: Signal, Finding, Score (🟢 / 🟡 / 🔴). End each section with an overall section score.

**Customer Sentiment & Satisfaction** — overall tone, satisfaction, frustrations/unmet needs, and any expansion or churn signals.

**Product & Service Adoption** — what they're using, what they haven't adopted, any workarounds, and how central we are to their workflow.

**Engagement Signals** — meeting cadence, new stakeholders joining (expansion), interest in new capabilities (growth), and contract/pricing questions (renewal/exit).

**Business Impact & Outcomes** — results attributed to us, ability to quantify ROI, and any metrics shared.

**Risk Assessment** — engagement gaps, budget pressure, product-fit concerns, and key contact or leadership changes.

**Overall Health Score**
Assign 🟢 GREEN (strong, likely to grow), 🟡 YELLOW (needs proactive attention), or 🔴 RED (immediate intervention needed).

**Recommended Actions**
Output a table with columns: Action, Timeline (Urgent / Within 2 weeks / Next quarter).

Close with a 1-paragraph account health summary covering overall sentiment, key risks or opportunities, and the recommended next step.`,
      icon: Activity,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Executive Business Review (EBR) Briefing",
      description: "Prepare an Executive Business Review (EBR) briefing by synthesizing recent customer interactions and outcomes.",
      fullDescription: `Prepare an Executive Business Review (EBR) briefing by synthesizing recent customer interactions and outcomes.

Wins & Achievements This Period
What quantifiable outcomes has the customer achieved? (time saved, deals closed, revenue impact, etc.)
What features or capabilities have driven the most value?
What has the customer explicitly called out as a win?
Have they shared any public references or case study material?

Adoption & Usage Metrics (If available)
How many users are actively using the tool?
Which teams/roles have adopted it?
Are there adoption gaps? (e.g., sales team adopted but CS team hasn't)
What features have the highest usage? Lowest?

Business Alignment
Is the tool helping them meet their stated business objectives?
Have their priorities changed since the last review?
Are there new initiatives (org restructure, market expansion, product launch) that could drive more value?

Expansion Opportunities
Are there other teams or business units that could benefit?
What are the expansion use cases they've mentioned or implied?
What is the land-and-expand roadmap? (beachhead → team expansion → org-wide)
Potential contract expansion: # of seats, # of features, scope of use

Executive Talking Points (1-2 paragraphs)
Craft 2-3 compelling talking points for the executive sponsor to open with, highlighting impact and partnership. Include metric if possible.

Format as a 1-page briefing with bullet points and talking points.`,
      icon: Briefcase,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Feature Requests & Product Feedback",
      description: "Extract product feedback, feature requests, and integration needs from recent customer calls.",
      fullDescription: `Extract product feedback, feature requests, and integration needs from recent customer calls and external research.

For each feature request:
Feature: What they're asking for
Pain point: Why they need it / what it solves
Impact: Nice-to-have / Blocking deployment / High user impact
Frequency: How often mentioned across calls
Segment: Vertical-specific (sales, CS, finance, legal) or cross-org?

Integrations:
Systems requested: CRM, tools, data warehouse, APIs
Use case: What workflow needs the integration?
Blocking status: Preventing deployment or just limiting value?
Request pattern: Multiple customers or one-off?

Competitive intelligence:
Recent competitor launches: Specific features released in last 6 months (name competitor + feature)
Customer citations: Direct quotes like "We need X like [Competitor] has"
Feature parity gaps: Capabilities competitors have that we're missing
Market trends: What's becoming table-stakes in the category?

Priority ranking:
P0 (Critical): Blocking deployment, customer can't proceed without it
P1 (High): Mentioned by multiple customers, high user impact, significant workflow improvement
P2 (Medium): 1-2 customer requests, nice-to-have, quality-of-life improvement
P3 (Low): One-off request, vertical-specific, edge case

Output format: Prioritized feature table with all details, Competitive comparison highlighting our gaps, Top 5 feature requests with justification, 3-4 sentence executive summary of biggest product gaps and recommended next steps`,
      icon: FileText,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Bug & Defect Triage",
      description: "Identify technical issues from the most recent customer calls for engineering triage.",
      fullDescription: `Identify technical issues from the most recent customer calls for engineering triage.

For each issue, capture:
- Issue: What's broken?
- Severity: Blocking / Degrading / Minor
- Frequency: One-time / Intermittent / Reproducible
- Reproduce: Steps to trigger
- Environment: Web / Mobile / Desktop / API
- Customer(s): Account & reporter name
- Date: Date reported

Classify:
- Product bug vs. config/setup issue?
- Performance issue? (speed/latency thresholds)

Priority:
P0: Data loss, security, complete unavailability
P1: Core functionality broken, cumbersome workaround
P2: Minor issues, low impact
P3: Enhancements, cosmetic issues

Output format: Issue table with severity breakdown and prioritized action items. Keep it brief.`,
      icon: AlertTriangle,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Competitive Intelligence Brief",
      description: "Output a competitive intelligence brief based on recent customer calls and market research.",
      fullDescription: `Output a competitive intelligence brief

Research Scope: Recent customer calls + up to date external market research

Include:
- Competitive Landscape
- Competitor Market Presence
- Customers' Assessment
- Our Position

[Competitor] [Market size/growth] [Key perception] [Win/Loss reasons]

- Market Perception
- We Win On: [1-3 core differentiators customers cite, with evidence]
- We Lose On: [1-3 specific reasons, with deal/call references]
- Market Gap: [What external research + customers reveal we're missing]
- Positioning Recommendation [Section on how to reframe positioning based on market reality]`,
      icon: GitBranch,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Next Meeting Prep",
      description: "Generate a pre-call briefing the AE can scan in 5 minutes.",
      fullDescription: `Generate a pre-call briefing the AE can scan in 5 minutes. Be specific and actionable — no generic filler. If a field can't be filled from Avoma data, write [UNKNOWN — ask on call].

## ⚡ Deal Snapshot
One sentence: current stage, deal value, close date, and momentum since last call.

## ✅ Action Item Status
Table with columns: Action Item, Owner (AE / Prospect), Due Date, Status (✅ Done / ⏳ Pending / 🚨 Overdue).

## 🎯 Call Objective
State the must-win outcome (a specific decision or commitment, not an activity) and what success looks like.

## 💬 Talking Points
Table with columns: Priority (1–3), Point, Why It Lands for This Prospect. Lead with the most relevant pain, follow with a proof point, close with a value callback.

## ❓ Must-Ask Questions
Table with columns: Question, Goal. Limit to 3; each should uncover a blocker, validate urgency, or drive next steps.

## 👥 Stakeholder Map
Table with columns: Name, Role, Top Priority, Message to Land (one-line tailored hook).

## ⚠️ Objection Prep
Table with columns: Likely Objection, Proactive Response. Draw from prior calls.

## 🚨 Deal Health
Momentum: 🟢 On track / 🟡 Watch closely / 🔴 At risk — with a one-sentence reason.

Tone: direct, confident, and concise.`,
      icon: Calendar,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Deal Health Check",
      description: "Analyze the provided sales call(s) and deliver a structured deal health assessment.",
      fullDescription: `Analyze the provided sales call(s) and deliver a structured deal health assessment.

## Current Deal Status
Table with columns: Field, Details. Cover: deal stage, prospect's stated decision timeline, and confidence level (Low / Medium / High based on tone and language).

## Buying Committee
Table with columns: Name, Title, Role in Deal (decision-maker / influencer / end user), Enthusiasm (Champion / Supporter / Skeptic / Silent). Add a separate row for the economic buyer noting whether they've been identified and are directly engaged.

## Blockers & Risks
Table with columns: Category, Detail. Cover any present: stated objections, missing information, budget constraints, technical constraints, organizational constraints, and competitors named.

## Agreed Next Steps
Table with columns: Action Item, Owner (Us / Them), Due Date. Note whether a follow-up call is scheduled and, if so, when and who's attending.

Be concise and actionable. This output is intended for a manager reviewing deal health at a glance.`,
      icon: Shield,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Morning Briefing",
      description: "Prepare a morning briefing for my day ahead using my Avoma data.",
      fullDescription: `Prepare a morning briefing for my day ahead using my Avoma data. For each meeting I have today, pull context from past interactions with those attendees: the key topic or outcome of the last call, any open action items (mine or theirs), and one or two things worth raising or following up on.

Then close with:
- A prioritized list of the top things I need to get done today before EOD
- Any people or conversations that need attention today based on recent signals (overdue follow-ups, unanswered questions, stalled threads)

Keep it scannable.`,
      icon: Clock,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Deal Risks",
      description: "What were the major risks identified in the last workday's calls with prospects / customers?",
      fullDescription: `What were the major risks identified in the last workday's calls with prospects / customers? Only describe the three most serious risks`,
      icon: AlertTriangle,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Pipeline Forecast Review",
      description: "Analyze recent sales calls to assess close probability and forecast accuracy for the current quarter.",
      fullDescription: `Analyze recent sales calls to assess close probability and forecast accuracy for the current quarter.

For each open opportunity, output a table with columns: Deal, Stage, Close Date, Confidence (High / Medium / Low), Key Signal (what from the call supports or undermines the forecast), and Recommended Action.

Close with: total forecasted revenue range, the top 3 at-risk deals, and any pattern in deals slipping to next quarter.`,
      icon: TrendingUp,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
      roles: ["manager", "admin"],
    },
    {
      title: "Messaging Resonance Analysis",
      description: "Analyze recent sales and customer calls to identify which messages land and which fall flat.",
      fullDescription: `Analyze recent sales and customer calls to identify which messages land and which fall flat.

Output a table with columns: Message / Claim, Reaction (Positive / Neutral / Negative), Frequency, and a Representative Quote.

Highlight the top 3 messages resonating most and the top 3 generating objections or confusion. Close with recommendations on what to amplify and what to retire or rework.`,
      icon: MessageSquare,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "ICP & Persona Insights",
      description: "Surface ideal customer profile (ICP) patterns from recent calls.",
      fullDescription: `Surface ideal customer profile (ICP) patterns from recent calls.

Output a table with columns: Attribute, Pattern Observed, Supporting Evidence. Cover: company attributes with the most traction (industry, size, growth stage, tech stack), the personas most engaged in buying decisions (title, pain points, success metrics), and characteristics of deals that progress quickly vs. stall.

Close with a recommended ICP refinement and any segments to prioritize or deprioritize.`,
      icon: Users,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Action Items Review",
      description: "Summarize all of my action items from the previous work day using Avoma data sources.",
      fullDescription: `Summarize all of my action items from the previous work day using Avoma data sources (meeting transcripts/notes). Consolidate duplicates and group items by category (customer-facing, internal, follow-ups, admin).

For each action item, include: the exact wording/source quote when available, the originating meeting/email/thread, timestamp or message time, associated account/opportunity/contact (with CRM links if present), owner, due date (explicit or inferred), priority/urgency, current status (open/complete/blocked), and next best step.

Highlight dependencies, blockers, and any missing information that could prevent completion.

Also provide: (1) a "top 5" list ranked by impact and urgency, (2) items that are overdue or at risk based on typical cycle times, (3) suggested email/Slack follow-up drafts for key items, (4) recommended calendar blocks to complete the work, and (5) any coaching recommendations or scorecard insights that indicate recurring follow-up gaps or process issues from yesterday's meetings.

Include a brief end-of-day checklist I can use to verify completion. Also look at some recent past meetings of mine to pick one or two tasks which are not currently complete but that i could pick up if i have free time

Keep this concise so i can easily read it`,
      icon: BarChart3,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Stalled Deals & Follow-up Gaps",
      description: "Using recent meeting transcripts and call history, identify deals or accounts that show signs of stalling.",
      fullDescription: `Using recent meeting transcripts and call history, identify deals or accounts that show signs of stalling or missed follow-through.

Look for: accounts with no recent meeting activity, calls where a next step was committed but there's no evidence of follow-up, and conversations where the last interaction ended without a clear outcome or owner.

Output a markdown table with columns: Account / Deal, Last Meeting Date, Gap (days since last touchpoint), Issue (No Follow-up / No Next Step / Gone Silent), and Suggested Action.

Close with a short summary of the highest-risk accounts and a recommended re-engagement order.`,
      icon: AlertTriangle,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
    },
    {
      title: "Rep Activity & Performance Patterns",
      description: "Analyze rep activity and conversational performance across the team for the past 30 days.",
      fullDescription: `Analyze rep activity and conversational performance across the team for the past 30 days.

**Step 1 — Meeting activity:** Use the usage data to pull all meetings in the past 30 days. Aggregate per rep (organizer): total meetings, external call count, internal meeting count, average recording duration (minutes), and inbound vs. outbound call split where available.

**Step 2 — Coaching signals:** Pull recent coaching recommendations for each rep. For each rep, extract: average talk ratio (rep vs. prospect), recurring strengths called out, and the most common improvement area.

**Step 3 — Output**
Present a summary table with columns: Rep, Calls (30d), Avg Duration (min), Talk Ratio, Top Strength, Top Coaching Area.

Then below the table:
- **Most active reps:** Top 3 by external call volume
- **Coaching spotlight:** 2–3 specific coaching patterns seen across multiple reps
- **Standout performers:** Any rep with a strong talk ratio AND positive coaching signals worth recognizing
- **At-risk reps:** Any rep with low call volume or consistently flagged on the same coaching area

Keep it factual and specific — reference rep names and meeting counts, not generic advice.`,
      icon: BarChart3,
      category: "org",
      lastUpdated: "Wednesday, Feb 25",
      roles: ["manager", "admin"],
    },
  ];

  const filteredSavedPrompts = savedPrompts.filter(
    (p) => !p.roles || p.roles.includes(userRole)
  );

  const orgPromptsCount = filteredSavedPrompts.filter(p => p.category === "org").length;

  const handlePromptClick = (promptText: string) => {
    setInputValue(promptText);
    setShowSavedPrompts(false);
  };

  return (
    <div className="flex-1 bg-gray-50 h-screen flex flex-col">
      {!showSavedPrompts ? (
        <>
          {/* Main Content - Centered Chat Interface */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-8">
            <div className="max-w-4xl w-full">
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Hi, Alex! How can I help you today?
                </h1>
                <p className="text-gray-600">
                  Ask me about your conversations, deals, or companies...
                </p>
              </div>

              {/* Suggested Prompts */}
              <div className="mb-12">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center mb-6">
                  Suggested Prompts
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {suggestedPrompts.map((prompt, index) => {
                    const Icon = prompt.icon;
                    return (
                      <Card
                        key={index}
                        className="p-5 hover:shadow-lg transition-all cursor-pointer group border border-gray-200 hover:border-blue-300"
                        onClick={() => handlePromptClick(prompt.description)}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-${prompt.color}-100 flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className={`w-5 h-5 text-${prompt.color}-600`} />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {prompt.title}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {prompt.description}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t border-gray-200 bg-white shadow-lg">
            <div className="px-8 py-6 max-w-4xl mx-auto">
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Tasknova about your conversations, deals, or companies..."
                  className="pr-12 h-12 text-base"
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Saved Prompts Button */}
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSavedPrompts(true)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Saved prompts
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Saved Prompts Library View
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">Saved prompts</h1>
                <p className="text-sm text-gray-600">
                  {filteredSavedPrompts.length} prompts available
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavedPrompts(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to chat
              </Button>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search for a prompt..."
                  className="pl-10"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>

            {/* Tabs and Filters */}
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all" className="gap-2">
                    All
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {filteredSavedPrompts.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="private" className="gap-2">
                    Private
                    <Badge variant="secondary">0</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="org" className="gap-2">
                    Org
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {orgPromptsCount}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-sm text-gray-600">
                  Latest
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
                <Button variant="ghost" size="sm" className="text-sm text-gray-600">
                  Created by
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Prompts List */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-5xl space-y-3">
              {filteredSavedPrompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <Card
                    key={index}
                    className="p-5 hover:shadow-md transition-all cursor-pointer group border border-gray-200 hover:border-blue-300"
                    onClick={() => handlePromptClick(prompt.fullDescription)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {prompt.title}
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-3">
                          {prompt.fullDescription}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>By Tasknova AI</span>
                          <span>•</span>
                          <span>Last updated {prompt.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}