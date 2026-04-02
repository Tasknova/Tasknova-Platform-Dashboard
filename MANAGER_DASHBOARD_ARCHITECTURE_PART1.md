# Manager Dashboard - Complete Frontend Architecture
## PART 1: COMPONENT BREAKDOWN & UI MAPPING

---

# TABLE OF CONTENTS

## Quick Navigation
- [Executive Summary](#executive-summary)
- [Component Inventory](#section-1-component-inventory)
- [Page Structure Overview](#section-2-page-structure-overview)
- [Manager Dashboard - Detailed Breakdown](#section-3-manager-dashboard---detailed-breakdown)
- [Manager Pipeline - Detailed Breakdown](#section-4-manager-pipeline---detailed-breakdown)
- [Component Dependencies](#section-5-component-dependencies)
- [Navigation & Routing](#section-6-navigation-and-routing)
- [Data Architecture](#section-7-data-architecture-for-manager-panel-part-1)
- [UI Specifications](#section-8-ui-specifications-and-design-system)

---

## EXECUTIVE SUMMARY

**Manager Panel** is the operational control center for sales managers in Tasknova. It provides:
- Daily operational oversight (agenda, tasks, follow-ups)
- Team performance visibility (individual rep metrics, deal pipeline)
- AI-powered coaching insights and recommendations
- Real-time opportunity identification (at-risk deals, team learnings)
- Forecasting and quota tracking
- Call analysis and rep development tracking

This document comprises **PART 1** covering the main dashboard and pipeline views, with **PART 2** covering advanced analytics (Performance, Forecast, Call Details).

**Part 1 Scope:**
- Manager Dashboard page (10 major components)
- Manager Pipeline page (5 major components & filtering)
- All UI elements, buttons, filters, and interactions
- Data sources and database relationships
- Navigation flows between pages

---

## SECTION 1: COMPONENT INVENTORY

### 1.1 Dashboard Components (ManagerDashboard.tsx)

| # | Component Name | Purpose | Location | Data Type |
|---|---|---|---|---|
| **1.1** | Today's Agenda | Display scheduled meetings/tasks for manager | Top left section | Dynamic list |
| **1.2** | Today's Tasks | Action items and to-do list with priority | Left sidebar below agenda | Dynamic list |
| **1.3** | Team Highlights | Key wins and risk notifications | Center section | Dynamic cards |
| **1.4** | Follow-ups Required | Urgent manager interventions needed | Right sidebar top | Dynamic list |
| **1.5** | Top Learnings | AI insights about team patterns | Right sidebar center | Dynamic cards |
| **1.6** | Team Productivity Metrics | Individual rep activity summary | Bottom section | Data grid/table |
| **1.7** | Week Summary Card | Weekly performance snapshot | Header section | KPI display |
| **1.8** | Action Buttons Bar | Quick action buttons | Top navigation area | Interactive buttons |
| **1.9** | Filtering & Views | Time period and view filters | Dashboard toolbar | Filter controls |
| **1.10** | Notifications Panel | Real-time alerts popup | Top right popup | Alert notifications |

### 1.2 Pipeline Components (ManagerPipeline.tsx)

| # | Component Name | Purpose | Location | Data Type |
|---|---|---|---|---|
| **2.1** | Header with Stats | Page title, total deals & value | Top section | Static heading + KPIs |
| **2.2** | Search & Filter Bar | Deal search and filtering options | Below header | Input + filter controls |
| **2.3** | Pipeline Stage Cards | Kanban-style pipeline visualization | Top half left | Summary cards by stage |
| **2.4** | Deal List Table | Individual deal details in table | Main section | Data table/grid |
| **2.5** | Deal Card (Expandable) | Individual deal detailed view | Right side or expanded | Detail card |

### 1.3 Component Grouping by Layer

```
┌─ DASHBOARD LAYER (Manager Dashboard.tsx)
│  ├─ 1.1 Today's Agenda (Meetings + Tasks scheduled)
│  ├─ 1.2 Today's Tasks (Action items list)
│  ├─ 1.3 Team Highlights (Wins & Risks)
│  ├─ 1.4 Follow-ups Required (Urgent interventions)
│  ├─ 1.5 Top Learnings (AI insights/patterns)
│  ├─ 1.6 Team Productivity (Rep metrics table)
│  ├─ 1.7 Week Summary (KPIs snapshot)
│  ├─ 1.8 Action Buttons (Quick actions)
│  └─ 1.9 Filtering Controls
│
└─ PIPELINE LAYER (ManagerPipeline.tsx)
   ├─ 2.1 Header Section
   ├─ 2.2 Search & Filters
   ├─ 2.3 Stage Cards (5 stages)
   ├─ 2.4 Deal Table (8+ deals per page)
   └─ 2.5 Deal Details (Expandable/Modal)
```

---

## SECTION 2: PAGE STRUCTURE OVERVIEW

### 2.1 Manager Dashboard - Full Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER ROW                                                         │
│ ┌──────────────────────────────────────────────────────┐  [FILTER] │
│ │ Manager Dashboard                  Today, Mar 1 2026 │            │ 
│ │ Showing team performance & operational insights      │            │
│ └──────────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ WEEK SUMMARY CARDS (KPIs)                                           │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│ │ Team Revenue │  │ Quota Track  │  │ Team AI Avg  │  │ At-Risk  │ │
│ │ This Week    │  │              │  │ Score        │  │ Deals    │ │
│ │ $485.3K      │  │ 78% (Q1)     │  │ 87.2         │  │ 3 deals  │ │
│ └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ MAIN CONTENT (3-COLUMN LAYOUT)                                     │
│ ┌─────────────────┐  ┌──────────────────────┐  ┌────────────────┐ │
│ │  LEFT COLUMN    │  │  CENTER COLUMN       │  │  RIGHT COLUMN  │ │
│ │                 │  │                      │  │                │ │
│ │ [1.1] Agenda    │  │ [1.3] Team           │  │ [1.4] Follow-  │ │
│ │ - Meetings      │  │ Highlights           │  │     ups        │ │
│ │ - Times         │  │ - Win cards          │  │ - Actions      │ │
│ │ - Attendees     │  │ - Risk cards         │  │ - Priorities   │ │
│ │                 │  │                      │  │                │ │
│ │ [1.2] Tasks     │  │ [1.5] Top Learnings  │  │ [1.9] Filters  │ │
│ │ - Priority      │  │ - Pattern findings   │  │ - Time period  │ │
│ │ - Due time      │  │ - AI insights        │  │ - Rep filter   │ │
│ │ - Status        │  │ - Recommended action │  │ - Stage filter │ │
│ │                 │  │                      │  │                │ │
│ └─────────────────┘  └──────────────────────┘  └────────────────┘ │
└────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ BOTTOM SECTION - TEAM PRODUCTIVITY TABLE [1.6]                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Rep      │ Calls │ Answer │ Ratio │ Duration │ Meetings │ Status  │ │
│ │ Casey J  │  47   │  68%   │ 38%   │  28m     │    12    │ ⚠ Below  │ │
│ │ Morgan S │  52   │  78%   │ 42%   │  31m     │    14    │ ✓ Good   │ │
│ │ Taylor B │  58   │  89%   │ 38%   │  35m     │    16    │ ⭐ Top   │ │
│ │ Alex R   │  61   │  82%   │ 40%   │  33m     │    18    │ ✓ Good   │ │
│ │ ... more │ ...   │ ...    │ ...   │  ...     │ ...      │ ...     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Manager Pipeline - Full Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER                                                              │
│ [< Back]  Team Pipeline                    51 deals • $5.7M total   │
│           ┌──────────────────┐  ┌──────────┐                       │
│           │ [Search deals...] │  [Filters] │                       │
│           └──────────────────┘  └──────────┘                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PIPELINE STAGE SUMMARY (5 STAGES)                                   │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────┐ │
│ │ Discovery  │ │ Demo       │ │ Proposal   │ │ Negotiat.  │ │ Closed │
│ │ 12 deals   │ │ 8 deals    │ │ 6 deals    │ │ 5 deals    │ │ 14 Won  │
│ │ $1.45M     │ │ $980K      │ │ $720K      │ │ $620K      │ │ $1.82M  │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ └─────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ DEAL TABLE [2.4] - SCROLLABLE                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Company  │ Rep      │ Value   │ Stage    │ Close Dt │ Prob │ ⋮  │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │ TechCorp │ Taylor B │ $498K   │ Negot.   │ Mar 15   │ 90%  │ ► │ │
│ │ Acme     │ Alex R   │ $85K    │ Demo     │ Mar 22   │ 60%  │ ► │ │
│ │ DataFlow │ Casey J  │ $125K   │ Negot.   │ Mar 15   │ 40%  │ ► │ │
│ │ GlobalTech│ Morgan S │ $95K    │ Proposal │ Mar 20   │ 50%  │ ► │ │
│ │ TechStart│ Alex R   │ $125K   │ Demo     │ Mar 28   │ 70%  │ ► │ │
│ │ Innovate │ Jordan L │ $180K   │ Discovery│ Apr 5    │ 50%  │ ► │ │
│ │ CloudVista│ Sam T   │ $145K   │ Discovery│ Mar 30   │ 65%  │ ► │ │
│ │ Summit   │ Riley C  │ $250K   │ Proposal │ Mar 18   │ 85%  │ ► │ │
│ │ ...more  │ ...      │ ...     │ ...      │ ...      │ ...  │ ... │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## SECTION 3: MANAGER DASHBOARD - DETAILED BREAKDOWN

### Component 1.1: Today's Agenda

**Purpose:**
- List all scheduled meetings and tasks for the current day
- Show timing, attendees, deal values, focus areas
- Allow quick navigation to meetings

**Location:** Left sidebar, top section of Manager Dashboard

**UI Elements:**

```
┌─ TODAY'S AGENDA ─────────────────────────┐
│ 9:00 AM - 30m  [Meeting Icon]           │
│ Pipeline Review                         │
│ Attendees: Casey Johnson, Morgan Smith  │
│ Deal Value: $605K                       │
│ Focus: At-risk deals, Q1 forecast       │
│ [View Details]                          │
│                                          │
│ 11:00 AM - 45m [1-on-1 Icon]            │
│ 1-on-1 Coaching                         │
│ Attendee: Casey Johnson                 │
│ Deal Value: $480K                       │
│ Focus: Discovery, Quota recovery        │
│ [Join Call]                             │
│                                          │
│ 2:00 PM - 60m [Leadership Icon]         │
│ Sales Leadership Sync                   │
│ Attendees: VP Sales, Other Managers     │
│ Focus: Q1 wrap-up, Q2 planning          │
│ [Add to Calendar]                       │
│                                          │
│ 3:30 PM - 30m [Deal Icon]               │
│ Deal Strategy Session                   │
│ Attendees: Taylor Brooks, Alex Rivera   │
│ Deal Value: $1.77M                      │
│ Focus: Enterprise deals, Closing        │
│ [Review Deals]                          │
└──────────────────────────────────────────┘
```

**Data Source:**
- Meetings table (filtered by manager_id and meeting_date = TODAY)
- Deal values from deals table
- Attendee info from users table

**Database Tables:**
```
meetings
├── id (PK)
├── manager_id (FK)
├── meeting_type ('team_meeting', 'coaching', 'leadership', 'deal_review')
├── scheduled_start_time
├── duration_minutes
├── title
├── attendees (JSON array or separate meeting_attendees junction table)
└── associated_deal_ids (JSON or foreign key)

users
├── id (PK)
├── full_name
└── avatar_url

deals
├── id (PK)
├── deal_value
└── stage
```

**Buttons & Interactions:**
- [View Details] - Opens meeting detail modal
- [Join Call] - Starts video call for coaching sessions
- [Add to Calendar] - Exports to calendar app
- [Review Deals] - Links to pipeline view filtered by deals in meeting
- Meeting cards clickable - Expands to show more details

---

### Component 1.2: Today's Tasks

**Purpose:**
- Show action items the manager needs to complete
- Display priority levels and due times
- Track completion status

**Location:** Left sidebar, below Today's Agenda

**UI Elements:**

```
┌─ TODAY'S TASKS ──────────────────────────┐
│ Priority │ Status │ Task                 │ Due      │
├──────────┼────────┼──────────────────────┼──────────┤
│ 🔴 HIGH  │ ⭘ TODO │ Review Casey's      │ 11:00 AM │
│          │        │ at-risk deals       │ Before   │
│          │        │ (3 deals, $480K)    │ 11am mtg │
│ [Mark Done]      [Join Deal Review]     │          │
│                                          │          │
│ 🔴 HIGH  │ ⭘ TODO │ Approve Morgan's    │ 12:00 PM │
│          │        │ discount request    │          │
│          │        │ for GlobalTech      │          │
│ [Mark Done]      [Review Request]       │          │
│                                          │          │
│ 🔴 HIGH  │ ◐ IN-  │ Prepare Q1 forecast │ 1:30 PM  │
│          │ PROG   │ for leadership      │          │
│ [Mark Done]      [Open Document]        │          │
│                                          │          │
│ 🟡 MEDIUM│ ◐ IN-  │ Review Taylor's     │ 3:00 PM  │
│          │ PROG   │ enterprise deal     │          │
│ [Mark Done]      [View Deal Analytics]  │          │
│                                          │          │
│ 🟡 MEDIUM│ ⭘ TODO │ Send team perf      │ EOD      │
│          │        │ summary to VP       │          │
│ [Mark Done]      [Generate Report]      │          │
│                                          │          │
│ 🟡 MEDIUM│ ✓ DONE │ Complete weekly     │ Completed│
│          │        │ review notes        │          │
│ [Reopen]                                │          │
└──────────────────────────────────────────┘
```

**Data Source:**
- Tasks table associated with manager
- Status tracking from task_status enum
- Priority levels stored in database

**Buttons & Interactions:**
- [Mark Done] - Updates task status to completed
- [Reopen] - Reverts completed task back to TODO
- Action buttons on right navigate to relevant views
- Color-coded priority badges (red=high, yellow=medium, green=low)
- Task cards clickable to expand with more details

---

### Component 1.3: Team Highlights

**Purpose:**
- Show recent team wins and risks
- Provide AI-powered insights on deals and performance
- Alert manager to critical situations

**Location:** Center section of dashboard

**UI Elements:**

```
┌─ TEAM HIGHLIGHTS ────────────────────────────────────┐
│                                                      │
│ ▲ WIN - Yesterday, 2:30 PM  [Taylor Brooks]         │
│ ♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦ (✓ Positive)             │
│                                                      │
│ Closed TechCorp Enterprise Deal - $498K             │
│ • Deal closed 2 weeks early                         │
│ • Used ROI calculator in final presentation         │
│ • Multi-threaded with 4 stakeholders                │
│                                                      │
│ 💡 AI Insight:                                       │
│ Taylor's discovery technique led to 92% engagement  │
│ score. This pattern shows asking 18+ questions      │
│ early drives faster closes.                         │
│                                                      │
│ [View Call Recording]  [Review Deal]  [Share]      │
│                                                      │
├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│                                                      │
│ ▼ RISK - Yesterday, 4:00 PM  [Casey Johnson]        │
│ ######   ⚠️ Negative - Needs Attention             │
│                                                      │
│ DataFlow Systems - No Response (10 days) - $125K    │
│ • Last contact was budget discussion                │
│ • Champion went silent after pricing                │
│ • Competitor may be in play                         │
│                                                      │
│ 💡 AI Insight:                                       │
│ Deal stalled after pricing discussion. Recommend    │
│ multi-threading and executive sponsor involvement   │
│ within 48 hours.                                    │
│                                                      │
│ [Join Call]  [Re-engage Plan]  [Analytics]         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Data Source:**
- Won deals from deals table (stage = 'closed_won', closed_date yesterday/recent)
- At-risk deals identified by:
  - No activity in 10+ days
  - Stalled in proposal/negotiation stage
  - Low engagement score
- AI insights generated from call analytics & deal history

**Key Metrics Displayed:**
- Engagement score (0-100)
- Days since last contact
- Deal value
- Deal stage
- Rep name and avatar

**Buttons & Interactions:**
- [View Call Recording] - Links to ManagerCallDetails view
- [Review Deal] - Links to deal detail panel
- [Share] - Shares highlight with team via notifications
- [Join Call] - Initiates video call to re-engage customer
- [Re-engage Plan] - Shows recommended next steps
- Card expansion - Click to see full details
- Win/Risk cards color-coded (green=win, red=risk)

---

### Component 1.4: Follow-ups Required

**Purpose:**
- Show urgent manager interventions and decisions needed
- Prioritize urgent items that need attention today

**Location:** Right sidebar, top section

**UI Elements:**

```
┌─ FOLLOW-UPS REQUIRED ──────────────────────────────┐
│ Priority  Due Date   Rep         Action            │
├───────────┼───────────┼────────────┼────────────────┤
│ 🔴 URGENT │ TODAY     │ Casey J    │ Intervene on  │
│           │           │ [CJ avatar]│ DataFlow deal │
│           │           │            │ - no engage   │
│           │           │            │ in 10 days    │
│           │           │            │ Deal: $125K   │
│           │           │            │               │
│           │           │            │ [Join Call]   │
│           │           │            │ [View Deal]   │
├───────────┼───────────┼────────────┼────────────────┤
│ 🔴 HIGH   │ TOMORROW  │ Morgan S   │ Approve       │
│           │           │ [MS avatar]│ discount req  │
│           │           │            │ for GlobalTch │
│           │           │            │ Deal: $95K    │
│           │           │            │ Discount: 8%  │
│           │           │            │               │
│           │ [Review & Approve] [Deny] [Comments]    │
├───────────┼───────────┼────────────┼────────────────┤
│ 🟡 MEDIUM │ Mon Mar 2 │ Jordan L   │ Review deal   │
│           │           │ [JL avatar]│ progression   │
│           │           │            │ 3 enterprise  │
│           │           │            │ in proposal   │
│           │           │            │ Deal: $385K   │
│           │           │            │               │
│ [Schedule Review] [View Deals] [Notes]             │
│                                                    │
└──────────────────────────────────────────────────────┘
```

**Data Source:**
- Aggregated from:
  - At-risk deals (no activity 10+ days)
  - Pending approvals (discounts, changes)
  - High-value deals needing review
  - Coaching interventions needed
- Priority calculated by:
  - Deal value
  - Days of inactivity
  - Engagement score
  - Sales stage

**Buttons & Interactions:**
- [Join Call] - Start video call with rep
- [View Deal] - Open deal detail panel
- [Review & Approve] - Approve discount/change
- [Deny] - Reject request with reason
- [Comments] - Add comment to follow-up
- [Schedule Review] - Calendar integration
- [View Deals] - Links to filtered pipeline view
- Color-coded priority badges

---

### Component 1.5: Top Learnings

**Purpose:**
- Provide AI-generated insights about team patterns
- Suggest coaching actions based on data
- Show wins and areas for improvement

**Location:** Right sidebar, center section

**UI Elements:**

```
┌─ TOP LEARNINGS ────────────────────────────────────┐
│                                                    │
│ ⬆️ TOP PERFORMERS PATTERN                          │
│ Change: +42% (compared to last week)              │
│ [Green indicator]                                  │
│                                                    │
│ Insight: Taylor & Alex ask 18+ discovery         │
│ questions early in calls                          │
│                                                    │
│ Description: Top performers are multi-threading  │
│ with 3+ stakeholders, leading to 42% faster      │
│ deal velocity.                                    │
│                                                    │
│ Recommended Action:                               │
│ Coach team on early stakeholder mapping          │
│                                                    │
│ [Share with Team] [Schedule Coaching] [Dismiss]  │
│                                                    │
├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│                                                    │
│ ⬆️ TEAM DISCOVERY SKILLS                           │
│ Change: +28% (good progress)                      │
│ [Green indicator]                                 │
│                                                    │
│ Insight: Team avg questions/call increased      │
│ from 12 to 16                                     │
│                                                    │
│ Description: After last week's coaching session, │
│ the team is asking better qualifying questions    │
│ in discovery calls.                               │
│                                                    │
│ Recommended Action:                               │
│ Continue current coaching approach                │
│                                                    │
│ [View Coach Notes] [See Reps] [Dismiss]          │
│                                                    │
├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│                                                    │
│ ⬇️ AT-RISK PATTERN                                │
│ Change: -18% (area of concern)                   │
│ [Red indicator]                                   │
│                                                    │
│ Insight: Deals stalling after pricing disc.      │
│                                                    │
│ Description: 3 deals went silent within 48hrs   │
│ of pricing. Casey needs coaching on ROI-anchored │
│ pricing conversations.                            │
│                                                    │
│ Recommended Action:                               │
│ Schedule Casey 1-on-1 on pricing                 │
│                                                    │
│ [Schedule 1-on-1] [View Deals] [Coaching]        │
│                                                    │
└──────────────────────────────────────────────────────┘
```

**Data Sources:**
- AI analytics engine analyzing:
  - Call recordings and transcripts
  - Deal progression patterns
  - Rep performance metrics
  - Team trends week-over-week
- Calculations include:
  - Question frequency
  - Talk time ratios
  - Deal velocity
  - Engagement scores
  - Multi-threading depth

**Buttons & Interactions:**
- [Share with Team] - Sends to team notifications
- [Schedule Coaching] - Creates coaching task
- [View Coach Notes] - Shows previous coaching notes
- [See Reps] - Shows which reps have this pattern
- [View Deals] - Filtered deal view
- [Dismiss] - Removes learning from view
- Up/down indicators color-coded (green=up/positive, red=down/negative)

---

### Component 1.6: Team Productivity Metrics Table

**Purpose:**
- Show individual rep activity metrics in one table
- Identify high/low performers at a glance
- Allow sorting and filtering

**Location:** Bottom section of dashboard (full-width)

**UI Elements:**

```
┌─ TEAM PRODUCTIVITY METRICS ──────────────────────────────────────────┐
│ [Sort by different columns]  [Filter]  [Export]  [Refresh]          │
│                                                                      │
│ Rep           │Calls │Answer│ Talk │Duration│Meets│Emails│Deals│ St8│
│               │ Made │ Rate │Ratio │                                 │
├───────────────┼──────┼──────┼──────┼─────────┼─────┼──────┼──────┤───┤
│ Taylor Brooks │  58  │ 89%  │ 38%  │  35 min │ 16  │ 124  │  8  │⭐T│
│ ↑ Top Perf    │ ↑UP  │ ↑UP  │ GOOD │  ↑UP    │ ↑UP │ ↑UP  │ ↑UP │OP │
│               │                                                      │
│ Alex Rivera   │  61  │ 82%  │ 40%  │  33 min │ 18  │ 156  │ 12  │✓G │
│ ↑ Good        │ GOOD │ GOOD │ GOOD │  GOOD   │ TOP │ HIGH │ TOP │OD │
│               │                                                      │
│ Jordan Lee    │  52  │ 76%  │ 41%  │  29 min │ 14  │ 98   │ 10  │✓G │
│ ↑ Good        │ GOOD │ GOOD │ GOOD │  GOOD   │ MID │ MID  │ MID │OD │
│               │                                                      │
│ Morgan Smith  │  52  │ 78%  │ 42%  │  31 min │ 14  │ 112  │  9  │✓G │
│ ↑ Good        │ GOOD │ GOOD │ GOOD │  GOOD   │ MID │ MID  │ MID │OD │
│               │                                                      │
│ Sam Taylor    │  48  │ 71%  │ 45%  │  27 min │ 11  │ 87   │  7  │⚠W │
│ → Stable      │ MID  │ MID  │ OK   │  MID    │ LOW │ LOW  │ LOW │AR │
│               │                                                      │
│ Riley Chen    │  50  │ 74%  │ 43%  │  30 min │ 13  │ 95   │  9  │✓G │
│ ↑ Good        │ GOOD │ GOOD │ GOOD │  GOOD   │ MID │ MID  │ MID │OD │
│               │                                                      │
│ Casey Johnson │  47  │ 68%  │ 52%  │  28 min │ 12  │ 89   │ 11  │⚠N │
│ ↓ Below Tgt   │ LOW  │ LOW  │ HIGH │  LOW    │ LOW │ MID  │ MID │CO │
│               │                                                      │
│ [View Analytics] [Schedule Coaching] [Send Message] [View Profile]  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

Legend:
⭐ = Top Performer    ✓ = Meeting Expectations    ⚠ = Needs Attention
G = Good Status       W = Warning                 N = Needs Coaching
DES = Color status indicator
```

**Data Columns:**
- Rep name with avatar
- Calls Made (this week)
- Answer Rate % 
- Talk Ratio % (should be 40-50%, lower is better)
- Avg Call Duration
- Meetings Scheduled
- Emails Sent
- Deals Advanced
- Status indicator (trend + performance level)

**Data Sources:**
- meetings table (count by rep, filtered by date range)
- call_analytics table (talk_ratio, answers)
- deal progression tracking
- communication logs

**Buttons & Interactions:**
- Column headers clickable to sort (ascending/descending)
- [Filter] - Filter by status, department, date range
- [Export] - Export to CSV/Excel
- [Refresh] - Reload latest data
- Row click - Expands to show more details
- [View Analytics] - Links to ManagerPerformance page for that rep
- [Schedule Coaching] - Creates 1-on-1 coaching session
- [Send Message] - Opens messaging to rep
- [View Profile] - Shows customer rep profile

---

### Component 1.7: Week Summary Card

**Purpose:**
- Quick overview of team performance for the week
- Display key KPIs at a glance

**Location:** Top of dashboard (4-column layout)

**UI Elements:**

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐
│ Team Revenue     │  │ Quota Tracking   │  │ Team AI Avg      │  │ At-Risk  │
│ (This Week)      │  │ (Q1 2026)        │  │ Score (Calls)    │  │ Deals    │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤  ├──────────┤
│                  │  │                  │  │                  │  │          │
│    $485.3K       │  │      78%         │  │      87.2        │  │  3 deals │
│                  │  │    ($2.73M/      │  │                  │  │          │
│   ↑ +$42K (+9%)  │  │     $3.5M)       │  │   ↑ +2.1 pts     │  │ $385K    │
│                  │  │                  │  │                  │  │ value    │
│   vs last week   │  │   ↑ +3% vs Q1    │  │   vs last week   │  │          │
│                  │  │                  │  │                  │  │ Intervene│
│ ⭐ Great pace    │  │ ⚠️ On track but  │  │ ✓ Healthy pace   │  │ today    │
│                  │  │    needs close   │  │                  │  │          │
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────┘
```

**Buttons & Interactions:**
- Card click - Opens detailed view (Performance page, Forecast page, Pipeline page)
- Trend indicators (arrows) color-coded
- Status emoji/text color-coded

---

### Component 1.8: Action Buttons Bar

**Purpose:**
- Quick access to common manager actions
- Navigation to secondary views

**Location:** Top navigation area of dashboard

**UI Elements:**

```
┌─ ACTION BUTTONS ───────────────────────────────────────┐
│ [➕ New Task] [📞 Schedule 1-on-1] [📊 View Analytics]  │
│ [📋 Team Notes] [📧 Send Update] [🔔 Notifications]    │
│ [⚙️ Settings] [? Help]                                  │
└────────────────────────────────────────────────────────┘
```

**Buttons:**
- **[+ New Task]** - Creates new task for team member
- **[📞 Schedule 1-on-1]** - Opens scheduling modal for coaching
- **[📊 View Analytics]** - Links to ManagerPerformance page
- **[📋 Team Notes]** - Opens shared team notes
- **[📧 Send Update]** - Compose message to team
- **[🔔 Notifications]** - Shows notification panel
- **[⚙️ Settings]** - Dashboard settings/preferences
- **[? Help]** - Help documentation

---

### Component 1.9: Filtering & Views

**Purpose:**
- Filter dashboard by time period, rep, or department
- Save custom views
- Compare time periods

**Location:** Dashboard toolbar / right side of header

**UI Elements:**

```
┌─ FILTER CONTROLS ───────────────┐
│ Time Period:                    │
│ [This Week ▼]  [Week Of ▼]      │
│                                 │
│ Department/Team:                │
│ [All Reps ▼]  [Department ▼]    │
│                                 │
│ Deal Stage Focus:               │
│ [All Stages ▼]                  │
│                                 │
│ View:                           │
│ [Overview ▼] [Detail ▼]         │
│                                 │
│ [Apply] [Reset] [Save View]     │
└─────────────────────────────────┘
```

**Filter Options:**
- Time Period: Today, This Week, Last Week, This Month, Custom Range
- Department/Team: All, By Department, By Rep, By Status
- Deal Stage: All, Discovery, Demo, Proposal, Negotiation, etc.
- View Modes: Overview, Detailed, Coaching Focus, At-Risk Focus

---

### Component 1.10: Notifications Panel

**Purpose:**
- Show real-time alerts and notifications
- Urgent manager actions
- System and activity notifications

**Location:** Top right popup (triggered by notification bell icon)

**UI Elements:**

```
┌─────────────────────────────────────┐
│ Notifications                   [x] │
├─────────────────────────────────────┤
│ 🔴 URGENT - 2 mins ago             │
│ Casey's DataFlow deal: No response │
│ in 10 days. Recommend action.      │
│ [Intervene]  [Dismiss]             │
│                                     │
│ 🟡 HIGH - 15 mins ago              │
│ Morgan requesting discount for     │
│ GlobalTech (8% below standard)     │
│ [Review]  [Approve]  [Deny]        │
│                                     │
│ 🔵 INFO - 1 hour ago               │
│ Taylor closed TechCorp deal for    │
│ $498K. Great execution!             │
│ [View Deal]  [Dismiss]             │
│                                     │
│ 🟢 SUCCESS - 2 hours ago           │
│ Your weekly forecast is ready.     │
│ [View Forecast]  [Close]           │
│                                     │
│ [View All Notifications]            │
└─────────────────────────────────────┘
```

---

## SECTION 4: MANAGER PIPELINE - DETAILED BREAKDOWN

### Component 2.1: Header with Stats

**Purpose:**
- Display page title and key statistics
- Show total deal count and pipeline value
- Provide back navigation

**Location:** Top of Pipeline page

**UI Elements:**

```
┌─────────────────────────────────────────────────────┐
│ [◀ Back]   Team Pipeline                           │
│            51 active deals • $5.7M total value      │
│            Last updated: 15 mins ago                │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Back button (arrow) - Returns to dashboard
- Page title "Team Pipeline"
- Total deal count
- Total pipeline value
- Last refresh timestamp

**Data Source:**
- COUNT of all deals in pipeline (stages: discovery to negotiation)
- SUM of all deal values for open deals
- Latest update timestamp from deals table

---

### Component 2.2: Search & Filter Bar

**Purpose:**
- Search for specific deals by company name or rep
- Filter by various criteria
- Improve deal visibility

**Location:** Below header on Pipeline page

**UI Elements:**

```
┌───────────────────────────────┬──────────────────────────────┐
│ 🔍 [Search deals...]         │ [Filters ▼] [Sort ▼]        │
├───────────────────────────────┴──────────────────────────────┤
│ Filter Options:                                              │
│ ┌─ Columns ────────────────────────────────────────┐        │
│ │ [✓] Company  [✓] Rep  [✓] Value  [✓] Stage      │        │
│ │ [✓] Close Dt [✓] Probability [✗] Last Activity  │        │
│ │ [✗] Health Status                               │        │
│ └──────────────────────────────────────────────────┘        │
│                                                              │
│ ┌─ Deal Stage ────────────────────────────────────┐        │
│ │ [✓] Discovery  [✓] Demo  [✓] Proposal          │        │
│ │ [✓] Negotiation  [✓] Closed Won                │        │
│ └──────────────────────────────────────────────────┘        │
│                                                              │
│ ┌─ Rep Filter ────────────────────────────────────┐        │
│ │ [All Reps ▼]                                    │        │
│ │ [✓] Taylor Brooks  [✓] Alex Rivera             │        │
│ │ [✓] Casey Johnson  [✓] Morgan Smith            │        │
│ │ [✓] Jordan Lee  [✓] Sam Taylor  [✓] Riley Chen │        │
│ └──────────────────────────────────────────────────┘        │
│                                                              │
│ ┌─ Close Date Range ──────────────────────────────┐        │
│ │ From: [Date Picker]  To: [Date Picker]          │        │
│ └──────────────────────────────────────────────────┘        │
│                                                              │
│ ┌─ Probability Range ─────────────────────────────┐        │
│ │ Min: [20%] ━━━━ Max: [100%]                     │        │
│ └──────────────────────────────────────────────────┘        │
│                                                              │
│ ┌─ Deal Value Range ──────────────────────────────┐        │
│ │ Min: [$50K] ━━━━ Max: [$500K+]                  │        │
│ └──────────────────────────────────────────────────┘        │
│                                                              │
│ [Apply Filters] [Reset] [Save View: "My View"]   │        │
└────────────────────────────────────────────────────────────┘
```

**Search Features:**
- Real-time search as you type
- Searches company name, deal name, rep name

**Filter Capabilities:**
- Column visibility toggle
- Deal stage filter (multi-select)
- Rep filter (multi-select)
- Close date range picker
- Probability slider (20-100%)
- Deal value slider ($50K-$500K+)

**Sort Options:**
- By Deal Value (high to low, low to high)
- By Close Date (nearest to furthest)
- By Probability (highest to lowest)
- By Stage (discovery → closed)
- By Rep Name (A-Z)
- By Last Activity (most recent first)

---

### Component 2.3: Pipeline Stage Cards

**Purpose:**
- Visual overview of deals across 5 pipeline stages
- Quick summary of each stage
- Click to filter table by stage

**Location:** Top of Pipeline page, below search bar

**UI Elements:**

```
┌──────────────────────────────────────────────────────────────────────┐
│ PIPELINE STAGE SUMMARY                                               │
│                                                                      │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ ┌─┐│
│ │ 🔵 DISCOVERY │ │ 🟣 DEMO      │ │ 🟠 PROPOSAL  │ │ 🟢 NEGOT.  │ │C││
│ ├──────────────┤ ├──────────────┤ ├──────────────┤ ├────────────┤ │W││
│ │ 12 deals     │ │ 8 deals      │ │ 6 deals      │ │ 5 deals    │ │O││
│ │ $1.45M       │ │ $980K        │ │ $720K        │ │ $620K      │ │N││
│ │              │ │              │ │              │ │            │ │ ││
│ │ Avg Prob:    │ │ Avg Prob:    │ │ Avg Prob:    │ │ Avg Prob:  │ │1││
│ │ 25%          │ │ 55%          │ │ 60%          │ │ 80%        │ │4││
│ │              │ │              │ │              │ │            │ │d││
│ │ [View All]   │ │ [View All]   │ │ [View All]   │ │ [View All] │ │e││
│ └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │a││
│                                                    │$1.82M│ │l││
│                                                    │14 won│ │s││
│                                                    │[View]│ │s││
│                                                    └─────┘ └─┘│
│                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

**Stage Cards Show:**
- Stage name with color indicator
- Deal count
- Total pipeline value for stage
- Average probability
- [View All] button to filter table

**Colors:**
- Blue = Discovery
- Purple = Demo
- Orange = Proposal
- Green = Negotiation
- Emerald = Closed Won

**Interactions:**
- Click card to filter table by stage
- [View All] button highlights stage in table

---

### Component 2.4: Deal List Table

**Purpose:**
- Show detailed information for each deal
- Allow sorting, filtering, and actions
- Provide quick deal status at a glance

**Location:** Main section of Pipeline page (full-width, scrollable)

**UI Elements:**

```
┌─ DEAL TABLE ─────────────────────────────────────────────────────────┐
│ [Columns: Company | Rep | Value | Stage | Close Date | Prob | ...]   │
│ [Sorting: ▲▼ available on all columns]                               │
│                                                                       │
│ # │Company│ Rep      │ Value  │ Stage    │Close Dt│Prob│LastActiv│► │
│──┼───────┼──────────┼────────┼──────────┼────────┼────┼─────────┼──┤
│1 │TechC  │ TB       │ $498K  │ Negotiat │Mar 15  │90% │2h ago   │► │
│  │Corp   │ Taylor B │        │          │        │    │        │  │
│  │Ent.   │ TB       │        │          │        │🟢  │        │  │
│  │       │ [Avatar] │        │          │        │Good│        │  │
├──┼───────┼──────────┼────────┼──────────┼────────┼────┼─────────┼──┤
│2 │Acme   │ AR       │ $85K   │ Demo     │Mar 22  │60% │1d ago   │► │
│  │Corp   │ Alex R   │        │          │        │🟡  │        │  │
│  │       │ [Avatar] │        │          │        │Good│        │  │
├──┼───────┼──────────┼────────┼──────────┼────────┼────┼─────────┼──┤
│3 │DataFl │ CJ       │ $125K  │ Negotiat │Mar 15  │40% │10d ago  │► │
│  │ow Sys │ Casey J  │        │          │        │🔴  │        │  │
│  │       │ [Avatar] │        │          │        │Risk│        │  │
├──┼───────┼──────────┼────────┼──────────┼────────┼────┼─────────┼──┤
│4 │Global │ MS       │ $95K   │ Proposal │Mar 20  │50% │3d ago   │► │
│  │Tech   │ Morgan S │        │          │        │🟡  │        │  │
│  │       │ [Avatar] │        │          │        │Warn│        │  │
├──┼───────┼──────────┼────────┼──────────┼────────┼────┼─────────┼──┤
│5 │TechSt │ AR       │ $125K  │ Demo     │Mar 28  │70% │4h ago   │► │
│  │art    │ Alex R   │        │          │        │🟢  │        │  │
│  │       │ [Avatar] │        │          │        │Good│        │  │
├──┼───────┼──────────┼────────┼──────────┼────────┼────┼─────────┼──┤
│6 │Innov8 │ JL       │ $180K  │ Discovery│Apr 5   │50% │1d ago   │► │
│  │ Labs  │ Jordan L │        │          │        │🟡  │        │  │
│  │       │ [Avatar] │        │          │        │Good│        │  │
├──┼───────┼──────────┼────────┼──────────┼────────┼────┼─────────┼──┤
│7 │Cloud  │ ST       │ $145K  │ Discovery│Mar 30  │65% │Yest     │► │
│  │Vista  │ Sam T    │        │          │        │🟢  │        │  │
│  │       │ [Avatar] │        │          │        │Good│        │  │
├──┼───────┼──────────┼────────┼──────────┼────────┼────┼─────────┼──┤
│8 │Summit │ RC       │ $250K  │ Proposal │Mar 18  │85% │3h ago   │► │
│  │Group  │ Riley C  │        │          │        │🟢  │        │  │
│  │       │ [Avatar] │        │          │        │Good│        │  │
└──┴───────┴──────────┴────────┴──────────┴────────┴────┴─────────┴──┘
                            [Load More] or [Pagination]
```

**Table Columns:**
1. **Company** - Deal company name
2. **Rep** - Sales rep name + avatar
3. **Value** - Deal value ($XXK format)
4. **Stage** - Current pipeline stage
5. **Close Date** - Expected close date
6. **Probability** - Win probability %
7. **Last Activity** - When deal was last updated
8. **Health** - Status indicator (🟢good, 🟡warning, 🔴risk)
9. **Actions (►)** - Expand/menu button

**Health Status Indicators:**
- 🟢 Green (Good) - On track, good metrics
- 🟡 Yellow (Warning) - Needs attention
- 🔴 Red (At-Risk) - Requires urgent intervention

**Buttons & Interactions:**
- Column headers - Click to sort (up/down arrows)
- Rep avatar - Shows rep profile on hover
- Company name - Clickable to view company details
- Stage/Probability cells - Shows trend indicators
- [►] Expand button - Opens Component 2.5 (Deal details)
- Row hover - Shows action buttons [View] [Edit] [Notes] [Remove]
- Multi-row select checkbox - Batch operations
- Pagination controls at bottom

**Sorting:**
- Default: By close date (soonest first)
- Available on all columns
- Click column header to toggle sort direction

**Pagination:**
- Shows 8 deals per page by default
- Load More button or page selector
- Total deal count displayed

---

### Component 2.5: Deal Card (Expandable)

**Purpose:**
- Show detailed information for a single deal
- Allow editing and taking actions
- Display deal timeline and history

**Location:** Right side of Pipeline page or expanded view

**UI Elements:**

```
┌─────────────────────────────────────────────────────────┐
│ TechCorp Enterprise                          [x]        │
│ Rep: Taylor Brooks [TB Avatar]                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ DEAL DETAILS                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Deal Value: $498K                                  │ │
│ │ Stage: Negotiation                                 │ │
│ │ Expected Close: Mar 15, 2026                       │ │
│ │ Probability: 90%                                   │ │
│ │ Created: Jan 15, 2026 (59 days in pipeline)       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ NEXT STEP:                                              │
│ Contract review with legal                              │
│ Assigned to: John Legal (Legal Dept)                    │
│ Due: Mar 10, 2026                                       │
│ Status: ⏳ Pending                                      │
│                                                         │
│ DEAL HEALTH                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Overall Health: 🟢 GOOD                           │ │
│ │ Sales Activity: ✓ Active (last update: 2h ago)    │ │
│ │ Stakeholder Engagement: ✓ Strong                  │ │
│ │ Competition: ✓ No competitors visible             │ │
│ │ Price Negotiation: ✓ Resolved                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ RECENT ACTIVITY                                         │
│ > Mar 1, 2:30 PM - Call completed with procurement    │
│   AI Call Score: 92/100 ⭐                            │
│   "Deal closed 2 weeks early"                         │
│                                                         │
│ > Feb 28 - Demo completed with 4 stakeholders         │
│   Feedback: Very positive, ready to move to negotiat. │
│                                                         │
│ > Feb 25 - Discovery call conducted                    │
│   Pain points: Performance, Integration, ROI          │
│                                                         │
│ STAKEHOLDERS                                            │
│ • John Procurement (Primary)  - john@techcorp.io      │
│ • Sarah IT Director           - sarah@techcorp.io     │
│ • Mike CFO (Sponsor)          - mike@techcorp.io      │
│                                                         │
│ ACTIONS                                                 │
│ [View Call Recording] [Schedule Call] [Add Note]       │
│ [Edit Deal] [Change Stage] [Close Deal] [Remove]       │
│ [Share With Team] [Print] [Export]                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Deal Information Sections:**
1. Deal title and rep name
2. Deal value, stage, close date, probability
3. Days in pipeline
4. Next step and owner
5. Overall deal health assessment
6. Recent activity timeline
7. Stakeholder list
8. Action buttons

**Buttons & Interactions:**
- [View Call Recording] - Links to ManagerCallDetails page
- [Schedule Call] - Calendar integration
- [Add Note] - Add private note to deal
- [Edit Deal] - Allows editing deal fields
- [Change Stage] - Drag-and-drop or dropdown to change stage
- [Close Deal] - Marks as closed-won or closed-lost
- [Remove] - Archive deal
- [Share With Team] - Send to team members
- [Print] - Print deal summary
- [Export] - Export as PDF
- Close button (x) - Collapses deal card

**Data Sources:**
- deals table (all deal info)
- deal_activity / deal_history table (timeline)
- meetings/calls associated with deal
- stakeholders from company_contacts table
- deal_notes table (activity)

---

## SECTION 5: COMPONENT DEPENDENCIES

### 5.1 Component Dependency Map

```
Manager Dashboard (Main Page)
├── Today's Agenda [1.1]
│   └── Depends on: meetings, users, deals tables
├── Today's Tasks [1.2]
│   └── Depends on: tasks, users tables
├── Team Highlights [1.3]
│   ├── Depends on: deals, call_analytics, users tables
│   └── Requires: AI insights engine output
├── Follow-ups Required [1.4]
│   ├── Depends on: deals, task_approvals, activities tables
│   └── Requires: Rule engine for urgency scoring
├── Top Learnings [1.5]
│   ├── Depends on: call_analytics, user_performance_metrics, deals tables
│   └── Requires: AI analytics engine, ML models
├── Team Productivity Metrics [1.6]
│   ├── Depends on: meetings, call_analytics, deals, activities tables
│   └── Requires: Aggregation of metrics
├── Week Summary Card [1.7]
│   ├── Depends on: user_performance_metrics, team_performance_metrics, deals tables
│   └── Requires: Date range filtering
├── Action Buttons [1.8]
│   └── Navigates to: Other pages and modals
├── Filters & Views [1.9]
│   └── Provides: Date, department, deal stage filters
└── Notifications Panel [1.10]
    └── Depends on: notifications, alerts tables

Manager Pipeline (Secondary Page)
├── Header with Stats [2.1]
│   └── Depends on: deals table (COUNT, SUM)
├── Search & Filter Bar [2.2]
│   ├── Input: Text search, filter controls
│   └── Output: Filtered deal list
├── Pipeline Stage Cards [2.3]
│   ├── Depends on: deals table grouped by stage
│   └── Triggers: Table filter on click
├── Deal List Table [2.4]
│   └── Depends on: deals, users, activities, call_analytics tables
└── Deal Card (Expandable) [2.5]
    ├── Depends on: deals, company_contacts, deal_history, meetings tables
    └── Navigates to: ManagerCallDetails page
```

### 5.2 Data Table Dependencies

```
deals table
├── Used by: Components 1.1, 1.3, 1.4, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5
└── Fields: id, company_id, rep_id, value, stage, close_date, probability, health_status, created_at, last_activity_at

users table
├── Used by: All components (for rep names, avatars, etc.)
├── Fields: id, full_name, avatar_url, role, manager_id, department_id, last_login_at
└── Relationships: (1) users → (N) meetings, (1) users → (N) deals

meetings table
├── Used by: Components 1.1, 1.2, 1.6, 2.5
├── Fields: id, manager_id, rep_id, meeting_type, scheduled_start_time, duration_minutes, title, has_recording
└── Relationships: (1) meetings → (N) meeting_attendees, meetings → (1) deals (optional)

call_analytics table
├── Used by: Components 1.3, 1.5, 1.6, 2.4
├── Fields: id, call_id, rep_id, talk_ratio, questions_asked, engagement_score, ai_score
└── Relationships: (1) calls → (1) call_analytics

user_performance_metrics table
├── Used by: Components 1.5, 1.6, 1.7
├── Fields: user_id, period_month, revenue_closed, quota, attainment_percentage, avg_ai_score
└── Relationships: (N) metrics → (1) users

tasks table
├── Used by: Components 1.2, 1.4
├── Fields: id, manager_id, assigned_to_user_id, task_type, title, priority, due_date, status
└── Relationships: (1) tasks → (1) users

notifications/alerts table
├── Used by: Component 1.10
├── Fields: id, manager_id, alert_type, severity, triggered_by, created_at
└── Relationships: (N) notifications → (1) managers

activities/deal_history table
├── Used by: Components 1.3, 2.5
├── Fields: id, deal_id, activity_type, timestamp, description
└── Relationships: (N) activities → (1) deals
```

---

## SECTION 6: NAVIGATION AND ROUTING

### 6.1 Route Structure

```
/manager
├── /dashboard                 → Manager Dashboard page
│   └── Query params:
│       - ?timeframe=week      (day, week, month)
│       - ?rep=all             (rep_id or 'all')
│       - ?dept=all            (department or 'all')
│
├── /pipeline                  → Manager Pipeline page
│   └── Query params:
│       - ?stage=all           (discovery, demo, proposal, negotiation, closed)
│       - ?rep=all             (rep_id or 'all')
│       - ?sort=closedate      (field to sort by)
│       - ?search=string       (search term)
│       - ?page=1              (pagination)
│
├── /call-details/:id          → Manager Call Details page (PART 2)
│   └── Dynamic parameter: call/activity ID
│
├── /performance               → Manager Performance page (PART 2)
│   └── Query params:
│       - ?rep=all             (rep_id or 'all')
│       - ?timeframe=month     (week, month, quarter)
│
└── /forecast                  → Manager Forecast page (PART 2)
    └── Query params:
        - ?quarter=q1-2026     (quarter to view)
        - ?rep=all             (rep_id or 'all')
```

### 6.2 Navigation Flows

```
FLOW 1: Dashboard → Pipeline
User: Clicks "View All" from Pipeline Stage Card
Route: /manager/dashboard → /manager/pipeline?stage=discovery

FLOW 2: Dashboard → Deal Details
User: Clicks deal from Team Highlights
Route: /manager/dashboard → /manager/pipeline (card expands with deal details)

FLOW 3: Dashboard → Call Details
User: Clicks [View Call Recording] from Team Highlights
Route: /manager/dashboard → /manager/call-details/[call_id]

FLOW 4: Pipeline → Deal Details
User: Clicks [►] expand button on deal row
Route: /manager/pipeline → (same page, card expands)
Or: /manager/pipeline → /deals/[deal_id] (detail page)

FLOW 5: Pipeline → Call Details
User: Clicks [View Recording] on deal card
Route: /manager/pipeline → /manager/call-details/[call_id]

FLOW 6: Dashboard → Performance Analytics
User: Clicks [📊 View Analytics] or rep row in table
Route: /manager/dashboard → /manager/performance

FLOW 7: Dashboard → Forecast
User: Clicks "Quota Track" card
Route: /manager/dashboard → /manager/forecast

FLOW 8: Cross-page filters applied
Query params update to maintain filter state
Example: /manager/dashboard?timeframe=month&dept=sales-team
This persists when navigating to other pages
```

### 6.3 Back Button Behavior

```
All secondary pages have back button:
/manager/pipeline → [Back] → /manager/dashboard
/manager/call-details/:id → [Back] → /manager/pipeline (or prev page)
/manager/performance → [Back] → /manager/dashboard

Back button uses browser history, not hardcoded route
Implementation: useNavigate(-1) from react-router
```

---

## SECTION 7: DATA ARCHITECTURE FOR MANAGER PANEL (PART 1)

### 7.1 Core Data Tables

**Table: deals**
```sql
CREATE TABLE deals (
  id UUID PRIMARY KEY,
  manager_id UUID REFERENCES users(id),
  rep_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  deal_value DECIMAL(15, 2),
  stage VARCHAR(50), -- 'discovery', 'demo', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
  probability INTEGER, -- 0-100
  expected_close_date DATE,
  actual_close_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_activity_at TIMESTAMP,
  health_status VARCHAR(50), -- 'good', 'warning', 'at_risk'
  notes TEXT
);

Query: Get all team deals for pipeline
SELECT * FROM deals 
WHERE manager_id = ? AND stage != 'closed_lost'
ORDER BY expected_close_date ASC;
```

**Table: meetings**
```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY,
  manager_id UUID REFERENCES users(id),
  rep_id UUID REFERENCES users(id),
  meeting_type VARCHAR(50), -- 'team_meeting', 'coaching', 'leadership', 'deal_review'
  scheduled_start_time TIMESTAMP,
  duration_minutes INTEGER,
  title VARCHAR(255),
  description TEXT,
  attendees JSONB, -- array of user objects
  associated_deal_ids UUID[], -- optional deal references
  has_recording BOOLEAN,
  recording_url VARCHAR(500),
  call_score INTEGER, -- AI score if recording
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

Query: Get today's agenda for manager
SELECT * FROM meetings 
WHERE manager_id = ? 
  AND DATE(scheduled_start_time) = CURRENT_DATE
ORDER BY scheduled_start_time ASC;
```

**Table: tasks**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  manager_id UUID REFERENCES users(id),
  assigned_to_user_id UUID REFERENCES users(id), -- rep who needs coaching
  associated_deal_id UUID REFERENCES deals(id),
  task_type VARCHAR(50), -- 'review', 'approve', 'coach', 'follow_up'
  title VARCHAR(255),
  description TEXT,
  priority VARCHAR(20), -- 'low', 'medium', 'high', 'urgent'
  due_date DATE,
  due_time TIME,
  status VARCHAR(20), -- 'todo', 'in_progress', 'completed', 'blocked'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

Query: Get today's tasks for manager
SELECT * FROM tasks 
WHERE manager_id = ? 
  AND status != 'completed'
  AND DATE(due_date) = CURRENT_DATE
ORDER BY priority DESC, due_date ASC;
```

**Table: call_analytics**
```sql
CREATE TABLE call_analytics (
  id UUID PRIMARY KEY,
  call_id UUID REFERENCES meetings(id),
  rep_id UUID REFERENCES users(id),
  talk_ratio DECIMAL(5, 2), -- percentage
  questions_asked INTEGER,
  objections_raised INTEGER,
  objections_handled INTEGER,
  engagement_score INTEGER, -- 0-100
  ai_score DECIMAL(3, 1), -- 0-10
  key_moments JSONB, -- array of timestamps and messages
  sentiment_analysis JSONB,
  created_at TIMESTAMP
);

Query: Get AI insights for team learnings
SELECT 
  AVG(questions_asked) as avg_questions,
  AVG(talk_ratio) as avg_talk_ratio,
  AVG(engagement_score) as avg_engagement,
  MAX(ai_score) as top_score,
  MIN(ai_score) as needs_coaching
FROM call_analytics
WHERE rep_id IN (SELECT id FROM users WHERE manager_id = ?)
  AND created_at >= NOW() - INTERVAL '7 days';
```

**Table: notifications/alerts**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  manager_id UUID REFERENCES users(id),
  alert_type VARCHAR(50), -- 'deal_risk', 'task_due', 'team_win', 'approval_pending'
  severity VARCHAR(20), -- 'info', 'warning', 'urgent'
  title VARCHAR(255),
  description TEXT,
  action_url VARCHAR(500),
  triggered_by UUID REFERENCES users(id) OR NULL,
  associated_deal_id UUID REFERENCES deals(id) OR NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

Query: Get recent notifications for manager
SELECT * FROM notifications 
WHERE manager_id = ? 
  AND is_read = FALSE
ORDER BY severity DESC, created_at DESC
LIMIT 10;
```

### 7.2 Query Patterns for Key Metrics

**Team Revenue This Week**
```sql
SELECT COALESCE(SUM(d.deal_value), 0) as total_revenue
FROM deals d
WHERE d.manager_id = ?
  AND d.stage = 'closed_won'
  AND DATE(d.actual_close_date) >= DATE_TRUNC('week', CURRENT_DATE)
  AND DATE(d.actual_close_date) < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days';
```

**Average Team AI Score**
```sql
SELECT ROUND(AVG(ca.ai_score)::NUMERIC, 2) as avg_score
FROM call_analytics ca
WHERE ca.rep_id IN (SELECT id FROM users WHERE manager_id = ?)
  AND ca.created_at >= NOW() - INTERVAL '7 days';
```

**At-Risk Deals Count**
```sql
SELECT COUNT(*) as at_risk_count
FROM deals
WHERE manager_id = ?
  AND stage IN ('negotiation', 'proposal', 'demo')
  AND (
    health_status = 'at_risk'
    OR EXTRACT(DAY FROM (NOW() - last_activity_at)) > 10
  );
```

**Team Productivity Metrics**
```sql
SELECT 
  u.id,
  u.full_name,
  COUNT(m.id) as meetings_this_week,
  SUM(CASE WHEN m.has_recording THEN 1 ELSE 0 END) as calls_with_recording,
  ROUND(AVG(ca.talk_ratio)::NUMERIC, 1) as avg_talk_ratio,
  ROUND(AVG(ca.engagement_score)::NUMERIC, 0) as avg_engagement,
  COUNT(DISTINCT d.id) as deals_advanced
FROM users u
LEFT JOIN meetings m ON u.id = m.rep_id 
  AND m.manager_id = ?
  AND DATE(m.scheduled_start_time) >= DATE_TRUNC('week', CURRENT_DATE)
LEFT JOIN call_analytics ca ON m.id = ca.call_id
LEFT JOIN deals d ON u.id = d.rep_id 
  AND DATE(d.updated_at) >= DATE_TRUNC('week', CURRENT_DATE)
WHERE u.manager_id = ?
  AND u.role = 'rep'
GROUP BY u.id, u.full_name
ORDER BY deals_advanced DESC;
```

---

## SECTION 8: UI SPECIFICATIONS AND DESIGN SYSTEM

### 8.1 Color Palette

```
Primary Colors:
┌─────────────────────────┐
│ Blue: #2563eb          │ Main brand color, headers, CTAs
│ Indigo: #4f46e5        │ Secondary actions
│ Purple: #7c3aed        │ Highlights, premium features
└─────────────────────────┘

Semantic Colors:
┌─────────────────────────┐
│ Green: #10b981         │ Success, good status, positive trends
│ Red: #ef4444           │ Error, at-risk, negative
│ Yellow: #f59e0b        │ Warning, needs attention
│ Orange: #f97316        │ In progress, moderate risk
└─────────────────────────┘

Stage Colors:
┌─────────────────────────┐
│ Discovery: #3b82f6     │ Blue
│ Demo: #8b5cf6          │ Purple
│ Proposal: #f97316      │ Orange
│ Negotiation: #10b981   │ Green
│ Closed Won: #059669    │ Emerald
└─────────────────────────┘

Grayscale:
┌─────────────────────────┐
│ Gray-50: #f9fafb       │ Backgrounds
│ Gray-100: #f3f4f6      │ Secondary backgrounds
│ Gray-400: #9ca3af      │ Secondary text
│ Gray-600: #4b5563      │ Body text
│ Gray-900: #111827      │ Primary text
└─────────────────────────┘
```

### 8.2 Typography

```
Font: Inter (system fallback: -apple-system, BlinkMacSystemFont, Segoe UI)
Line Height: 1.5 (body), 1.2 (headings)

Heading Styles:
┌──────────────────────────┐
│ H1: 28px, 700 weight     │ Page titles
│ H2: 24px, 700 weight     │ Section headers
│ H3: 20px, 600 weight     │ Subsection headers
│ H4: 16px, 600 weight     │ Component titles
│ Body: 14px, 400 weight   │ Standard text
│ Small: 12px, 400 weight  │ Secondary text
│ Micro: 11px, 400 weight  │ Labels, badges
└──────────────────────────┘
```

### 8.3 Spacing System

```
Spacing Scale (Base: 4px):
0px, 2px, 4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px

Common Patterns:
┌──────────────────────┐
│ Padding: 12px, 16px  │ Standard padding
│ Margin: 16px, 24px   │ Between sections
│ Gap: 8px, 12px       │ Between items
│ Radius: 6px, 8px     │ Border radius
└──────────────────────┘
```

### 8.4 Component Specifications

**Card Component**
```
Background: white
Border: 1px solid #e5e7eb
Border Radius: 8px
Padding: 16px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Hover Shadow: 0 4px 6px rgba(0,0,0,0.1)
Transition: box-shadow 200ms ease
```

**Button Component**
```
Primary Button:
  Background: #2563eb
  Text: white
  Padding: 8px 16px
  Border Radius: 6px
  Font: 14px, 500 weight
  Hover: Background #1d4ed8, Shadow
  Active: Background #1e40af

Secondary Button:
  Background: #f3f4f6
  Text: #111827
  Border: 1px #d1d5db
  Padding: 8px 16px
  Hover: Background #e5e7eb
```

**Table Component**
```
Header Row:
  Background: #f9fafb
  Border-bottom: 1px #e5e7eb
  Font: 12px, 600 weight, uppercase
  Padding: 12px

Data Row:
  Padding: 12px
  Border-bottom: 1px #f3f4f6
  Hover Background: #f9fafb

Alternating Row Color: none (white only)
```

**Badge Component**
```
High Priority: Background #fecaca, Text #dc2626
Medium Priority: Background #fef3c7, Text #d97706
Low Priority: Background #dcfce7, Text #16a34a

Status Badge:
  Good: Green background #d1fae5, Text #065f46
  Warning: Yellow background #fef3c7, Text #92400e
  Risk: Red background #fee2e2, Text #7f1d1d
```

### 8.5 Interactive Elements

**Hover States**
```
Links: Underline + color change
Buttons: Shadow + slight background change
Cards: Slight shadow increase
Rows: Subtle background highlight
```

**Active/Selected States**
```
Selected Row: Background #e0e7ff (blue tint)
Active Tab: Bottom border #2563eb, text bold
Focus State: Outline 2px #2563eb (for keyboard nav)
```

**Loading States**
```
Skeleton Loaders: Gray #e5e7eb
Spinner: Blue #2563eb, rotating
Progress Bar: Background #e5e7eb, filled #2563eb
```

---

# END OF PART 1

**Next: PART 2 will cover:**
- Manager Performance page (Analytics, Skills Breakdown, Rep Rankings)
- Manager Forecast page (Quarterly Forecast, Risk Deals, Weekly Trends)
- Manager Call Details page (Call Player, Coaching Insights, Scorecard, Transcript)
- Advanced filtering and reporting capabilities
- API endpoints and backend integration
- Data aggregation schedules

---

*Document Version: 1.0*
*Last Updated: March 1, 2026*
*Status: Complete for PART 1*
