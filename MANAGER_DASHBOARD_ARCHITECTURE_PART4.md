# Manager Dashboard - Complete Architecture
## PART 4: SHARED FEATURE PAGES (COMPLETE COVERAGE)

---

# TABLE OF CONTENTS

## Quick Navigation
- [Meetings Management](#section-1-meetings-management-page)
- [Calls & Recordings](#section-2-calls--call-recordings-page)
- [Tasks & Activities](#section-3-tasks--activity-management)
- [Scheduler & Calendar](#section-4-scheduler--calendar-page)
- [Customer Intelligence](#section-5-customer-intelligence-page)
- [Deals Management](#section-6-deals-management-page)
- [Coaching Platform](#section-7-coaching-platform)
- [Insights & Analytics](#section-8-insights--conversation-intelligence)
- [Revenue Intelligence](#section-9-revenue-intelligence-page)
- [Settings & Preferences](#section-10-settings--account-management)
- [AI Features](#section-11-ai-features-page)
- [Database & Query Reference](#section-12-complete-database-reference)

---

## EXECUTIVE OVEVIEW

This PART 4 documents **11 shared feature pages** available to managers, providing:
- Team meeting management & coordination
- Call recording & analysis access
- Team task assignments & tracking
- Calendar & scheduling interface
- Customer/account intelligence
- Deal tracking & pipeline management
- Comprehensive coaching platform
- Conversation intelligence & analytics
- Revenue forecasting & tracking
- Manager preferences & settings
- AI-powered features

---

## SECTION 1: MEETINGS MANAGEMENT PAGE

### Route: `/manager/meetings`

**1.1 Purpose**
- View all team meetings (scheduled and completed)
- Track meeting outcomes & call quality
- Manage scheduling & follow-ups
- Access recorded meetings

**1.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│              MEETINGS - TEAM VIEW                        │
│  [Tabs: My Meetings | Team Meetings]                   │
│  [Filter: All | Today | Upcoming | Past]               │
│  [Search] [Sort: Date | Type | priority] [Export]      │
└─────────────────────────────────────────────────────────┘

MY MEETINGS TAB:
├─ UPCOMING MEETINGS:
│  ├─ Card 1: Discovery - Acme Corp
│  │  ├─ Date/Time: Feb 27, 10:00 AM
│  │  ├─ Participant: Sarah Johnson, CFO
│  │  ├─ Duration: 45 mins
│  │  ├─ Deal Value: $85K
│  │  ├─ Priority: High (red)
│  │  ├─ [Join Call] [Reschedule] [Add Notes]
│  │  └─ Status: Scheduled
│  │
│  └─ Card N: ...more upcoming
│
└─ PAST MEETINGS:
   ├─ Card: Sales Pitch - Beta Corp
   │  ├─ Date/Time: Feb 26, 3:00 PM
   │  ├─ Participant: Robert Taylor
   │  ├─ Duration: 42 mins
   │  ├─ Outcome: Qualified (green badge)
   │  ├─ AI Score: 87 / 100
   │  ├─ Sentiment: Positive (green)
   │  ├─ Deal Value: $95K
   │  ├─ Has Recording: ✓
   │  ├─ [View Details] [Play Recording] [View Transcript]
   │  └─ [Add Coaching Notes]
   │
   └─ Card N: ...more past

TEAM MEETINGS TAB:
├─ UPCOMING TEAM MEETINGS:
│  ├─ Card: Discovery - Quantum Systems
│  │  ├─ Date/Time: Feb 27, 11:00 AM
│  │  ├─ Rep: Jordan Lee
│  │  ├─ Participant: Thomas Anderson
│  │  ├─ Duration: 40 mins
│  │  ├─ Deal Value: $112K
│  │  ├─ [View Rep's Calendar] [Monitor Call] [Notes]
│  │  └─ Status: Scheduled
│  │
│  └─ Card N: ...more
│
└─ PAST TEAM MEETINGS:
   ├─ Card: Demo - Nexus Digital
   │  ├─ Date/Time: Feb 25, 11:00 AM
   │  ├─ Rep: Jordan Lee
   │  ├─ Participant: Amanda Green
   │  ├─ Duration: 48 mins
   │  ├─ Outcome: Proposal Sent (blue badge)
   │  ├─ AI Score: 78 / 100
   │  ├─ Sentiment: Positive
   │  ├─ Deal Value: $78K
   │  ├─ [Review Call] [Coaching Insights] [Share with Rep]
   │  └─ [Add Coaching Notes]
   │
   └─ Card N: ...more

MEETINGS ANALYTICS SECTION (Bottom):
├─ Total Meetings This Month: 42
├─ Avg Meeting Duration: 28 mins
├─ Avg AI Score: 84 / 100
├─ Recorded Meetings: 38 (90%)
├─ Meeting Outcomes: Qualified (45%), Demo (30%), Other (25%)
└─ [View Detailed Analytics]
```

**1.3 Data Displayed**

```
UPCOMING MEETINGS:
├─ Date, Time, Duration
├─ Meeting Type (Discovery, Demo, Follow-up, etc.)
├─ Participant Name & Title
├─ Deal Associated & Value
├─ Priority (High/Medium/Low)
├─ Rep (for team meetings)
└─ Action buttons: Join, Reschedule, Notes

PAST MEETINGS:
├─ All above fields plus:
├─ Outcome (Qualified, Interested, Not interested, etc.)
├─ AI Score (0-100)
├─ Sentiment Analysis (Positive, Neutral, Negative)
├─ Recording status & link
├─ Transcript availability
└─ Related coaching opportunities

MEETING ANALYTICS:
├─ Total meetings count
├─ Average duration
├─ Average AI score
├─ Recording percentage
├─ Outcomes breakdown
└─ Trend vs previous period
```

**1.4 Queries**

```sql
-- My Meetings (Upcoming)
SELECT * FROM meetings
WHERE user_id = ? AND manager_id = ? 
  AND scheduled_start_time > CURRENT_TIMESTAMP
ORDER BY scheduled_start_time ASC;

-- Team Meetings (Upcoming)
SELECT m.*, u.full_name as rep_name
FROM meetings m
JOIN users u ON m.user_id = u.id
WHERE u.manager_id = ? 
  AND m.scheduled_start_time > CURRENT_TIMESTAMP
ORDER BY m.scheduled_start_time ASC;

-- Past Meetings with AI Metrics
SELECT m.*, t.processing_status, d.deal_name
FROM meetings m
LEFT JOIN transcripts t ON m.id = t.meeting_id
LEFT JOIN deals d ON m.deal_id = d.id
WHERE (m.user_id = ? OR m.user_id IN (SELECT id FROM users WHERE manager_id = ?))
  AND m.scheduled_end_time <= CURRENT_TIMESTAMP
  AND m.status = 'completed'
ORDER BY m.scheduled_end_time DESC;
```

---

## SECTION 2: CALLS & CALL RECORDINGS PAGE

### Route: `/manager/calls`

**2.1 Purpose**
- Access all team call recordings
- Listen to calls with AI analysis
- Review call transcripts
- Identify coaching opportunities

**2.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│              CALLS - CALL RECORDINGS                     │
│  [Filter: All | My Calls | Team Calls | Recorded Only] │
│  [Search by: Contact | Company | Date]                  │
│  [Sort: Latest | Highest Score | Duration] [Export]    │
│  [Downloaded: 0]                                        │
└─────────────────────────────────────────────────────────┘

CALL LIST TABLE:
┌─ Type │ Contact │ Company │ Duration │ Date │ Sentiment │ Score │ Actions ┐
├─────┼─────────┼─────────┼──────────┼──────┼───────────┼───────┼─────────┤
│ ⬇️  │ Sarah J.│ Acme    │ 12:34    │ 3/20 │ Positive ✓│ 85    │ [Play]  │
│ ⬆️  │ Michael │TechStart│ 8:12     │ 3/20 │ Neutral   │ 72    │ [Play]  │
│ ✗  │ Emma D. │GlobalTc │ 0:00     │ 3/19 │ ---       │ ---   │ [Retry] │
│ ⬇️  │ James W.│DataFlow │ 15:47    │ 3/19 │ Very Pos ✓│ 92    │ [Play]  │
│ ⬇️  │ Lisa A. │CloudCor │ 6:23     │ 3/19 │ Positive ✓│ 78    │ [Play]  │
└─────┴─────────┴─────────┴──────────┴──────┴───────────┴───────┴─────────┘

Call Details (On Expand):
┌─ CALL PLAYER ──────────────────────────────────┐
│ [Contact: Sarah Johnson, Acme Corp]            │
│ [Date: Mar 20, 2026 | Duration: 12:34]        │
│                                                │
│ ┌─ AUDIO PLAYER ─────────────────────────────┐ │
│ │ [▶ Play] [⏸] [⏹] | [🔊 Vol] [Speed: 1x]   │ │
│ │ [Time: 0:00 → 12:34] [Download MP3]        │ │
│ │ [Waveform visualization with scrubber]     │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ┌─ CALL METRICS ─────────────────────────────┐ │
│ │ AI Score: 85 / 100                         │ │
│ │ Sentiment: Positive                        │ │
│ │ Talk Ratio: 44% (rep) 56% (prospect)       │ │
│ │ Questions Asked: 16                        │ │
│ │ Topics: [Pricing] [Demo] [Next Steps]      │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ┌─ CALL TRANSCRIPT ──────────────────────────┐ │
│ │ [Search] [Copy All] [Download]             │ │
│ │                                             │ │
│ │ 00:00 - Sarah: "Hi, thanks for calling"   │ │
│ │ 00:05 - You: "Great, how are you?"        │ │
│ │ ...transcript continues...                 │ │
│ │                                             │ │
│ │ [Show more]                                 │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ┌─ COACHING INSIGHTS ────────────────────────┐ │
│ │ ✓ Strength: Good listening (high talk ratio)│ │
│ │ ⚠ Area to improve: Fewer questions than avg │ │
│ │ ✓ Positive sentiment throughout call       │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ [Add Coaching Notes] [Schedule Coaching]      │
└────────────────────────────────────────────────┘

CALL ANALYTICS (Bottom Summary):
├─ Total Calls This Month: 85
├─ Recorded: 73 (85%)
├─ Avg Duration: 11:45
├─ Avg Score: 82 / 100
├─ Sentiment Breakdown: Positive (60%), Neutral (35%), Negative (5%)
└─ [View Trends]
```

**2.3 Data Fields**

```
CALL LIST ROWS:
├─ Call Type Icon (Outgoing, Incoming, Missed)
├─ Contact Name
├─ Company/Account
├─ Call Duration
├─ Date & Time
├─ Sentiment (Positive, Neutral, Negative)
├─ AI Score (0-100, color-coded)
├─ Recording Status (✓, ✗, ⏳)
├─ Rep Name (for team calls)
└─ [Play] [Details] [Download] [Coach]

CALL DETAIL PANEL:
├─ Contact info
├─ Call metrics (duration, date, time)
├─ Audio player with waveform
├─ Full transcript (searchable, copyable)
├─ AI metrics (score, sentiment, talk ratio, questions, topics)
├─ Coaching recommendations
├─ Manager notes section
└─ Related deals/opportunities
```

**2.4 Key Queries**

```sql
-- All Calls (Manager's team + own)
SELECT m.id, m.call_recording_url, m.user_id, m.scheduled_start_time,
       m.call_sentiment, m.engagement_score, u.full_name,
       c.contact_name, c.company_name
FROM meetings m
LEFT JOIN users u ON m.user_id = u.id
LEFT JOIN contacts c ON m.contact_id = c.id
WHERE m.user_id IN (
  SELECT id FROM users 
  WHERE manager_id = ? OR id = ?
)
AND m.status = 'completed'
AND m.has_recording = TRUE
ORDER BY m.scheduled_start_time DESC;

-- Call Statistics
SELECT 
  COUNT(*) as total_calls,
  COUNT(CASE WHEN has_recording = TRUE THEN 1 END) as recorded_calls,
  ROUND(AVG(EXTRACT(EPOCH FROM (scheduled_end_time - scheduled_start_time)) / 60))::int as avg_duration_mins,
  ROUND(AVG(engagement_score))::int as avg_score,
  call_sentiment as sentiment
FROM meetings
WHERE user_id IN (SELECT id FROM users WHERE manager_id = ?)
  AND status = 'completed'
GROUP BY call_sentiment;
```

---

## SECTION 3: TASKS & ACTIVITY MANAGEMENT

### Route: `/manager/tasks`

**3.1 Purpose**
- Assign and track team tasks
- Monitor activity completion
- Set reminders and follow-ups
- Track team accountability

**3.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│          TASKS - TEAM TASK MANAGEMENT                   │
│  [Filter: All | My Tasks | Team Tasks | Overdue]       │
│  [Assigned To: Me | All] [Status: Pending | Done]      │
│  [Due: Today | This Week | All]                        │
│  [+New Task] [Export] [Settings]                       │
└─────────────────────────────────────────────────────────┘

TASKS BY STATUS:

┌─ TO DO (12 tasks) ─────────────────────────────────┐
│                                                     │
│ [Priority] Task Name │ Assigned To │ Due │ Actions│
│ ──────────────────────────────────────────────────┤
│ 🔴 HIGH │ Send proposal to CloudVista │ Taylor B │ Today │ [...]
│ 🟡 MED  │ Schedule follow-up call      │ Alex R   │ 3/23  │ [...] 
│ 🟡 MED  │ Update deal in CRM          │ Jordan L │ 3/23  │ [...]
│ 🟢 LOW  │ Send case study email      │ Morgan S │ 3/24  │ [...]
│                                                     │
│ [Load More]                                         │
└─────────────────────────────────────────────────────┘

┌─ IN PROGRESS (5 tasks) ────────────────────────────┐
│                                                     │
│ [Task with progress bar]                            │
│ 🔴 Setup meeting with VP Finance (Taylor B) 60% │
│ 🟡 Prepare demo (Alex R) 40%                     │
│ ...                                                 │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─ COMPLETED (28 tasks this month) ─────────────────┐
│                                                     │
│ ✓ Sent contract to Acme Corp │ Taylor B │ 3/19    │
│ ✓ Closed deal with TechStart  │ Alex R   │ 3/18    │
│ ...                                                 │
│ [Show More]                                         │
│                                                     │
└─────────────────────────────────────────────────────┘

TASK CREATION MODAL (On [+New Task]):
┌─ CREATE NEW TASK ──────────────────┐
│                                    │
│ Task Title: [________________]     │
│ Description: [________________]    │
│ Assign To: [Dropdown: Rep names]   │
│ Due Date: [________________]        │
│ Priority: [Dropdown: High/Med/Low] │
│ Related Deal: [Dropdown]           │
│ Related Contact: [Dropdown]        │
│ Set Reminder: ☑ 1 day before      │
│                                    │
│ [Create Task] [Cancel]             │
└────────────────────────────────────┘

TASK ANALYTICS (Bottom):
├─ Tasks Due Today: 3
├─ Overdue Tasks: 1
├─ On-Time Completion: 94%
├─ Avg Task Completion Time: 1.2 days
└─ [View Trends]
```

**3.3 Data Model**

```
TASKS TABLE:
├─ id (PK)
├─ manager_id (FK)
├─ assigned_to_user_id (FK)
├─ task_title
├─ description
├─ status (pending, in_progress, completed)
├─ priority (high, medium, low)
├─ due_date
├─ completed_date
├─ related_deal_id (FK)
├─ related_contact_id (FK)
├─ created_at
└─ updated_at

ACTIVITY TABLE:
├─ id (PK)
├─ user_id (FK)
├─ activity_type (call, email, meeting, task, note)
├─ related_entity_id
├─ description
├─ timestamp
└─ visible_to (user, manager, team)
```

---

## SECTION 4: SCHEDULER & CALENDAR PAGE

### Route: `/manager/scheduler`

**4.1 Purpose**
- View team calendar
- Schedule meetings and calls
- Manage availability
- Sync with external calendars

**4.2 Page Layout**

```
┌──────────────────────────────────────────────────┐
│            SCHEDULER - TEAM CALENDAR              │
│  [View: Week | Month | Agenda] [Today]           │
│  [Filter: All | My Calendar | Team Members]     │
│  [+New Meeting] [Sync Calendar]                 │
└──────────────────────────────────────────────────┘

WEEK VIEW (Default):
┌─ Mon 3/20 ─ Tue 3/21 ─ Wed 3/22 ─ Thu 3/23 ─ Fri 3/24 ┐
│                                                        │
│ MON 3/20                                              │
│ 9:00  - [Your Team Standup] (All reps)              │
│ 10:00 - [Discovery - Acme] (Taylor B)               │
│ 2:00  - [Demo Prep] (You)                           │
│ 3:30  - [1:1 with Taylor] (You)                     │
│                                                       │
│ TUE 3/21                                              │
│ 9:30  - [Demo - TechStart] (Alex R)                 │
│ 11:00 - [Follow-up - Global] (Jordan L)             │
│ 1:00  - [Sales Meeting] (You)                       │
│                                                       │
│ ...more days...                                      │
└────────────────────────────────────────────────────┘

MONTH VIEW:
┌─ S  │  M  │  T  │  W  │  T  │  F  │  S ┐
│     │  1  │  2  │  3  │  4  │  5  │  6 │
│     │ [3] │ [4] │ [2] │ [1] │ [6] │    │
│  7  │  8  │  9  │ 10  │ 11  │ 12  │ 13 │
│     │ [2] │ [5] │ [3] │ [4] │ [2] │    │
...continues...
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘

MEETING CARD (Clickable):
┌─ Discovery - Acme Corp ────────┐
│ Time: 10:00 - 10:45 AM         │
│ Rep: Taylor Brooks             │
│ Status: Confirmed              │
│ [Edit] [Cancel] [Add Notes]    │
└────────────────────────────────┘

NEW MEETING MODAL:
┌─ SCHEDULE MEETING ─────────────────────┐
│                                        │
│ Meeting Title: [________________]      │
│ Date: [Date Picker]                    │
│ Start Time: [Time] - End Time: [Time] │
│ With: [Contact Name]                   │
│ Rep(s): [Multi-select Rep names]       │
│ Call Type: [Discovery/Demo/Follow-up]  │
│ Deal: [Dropdown]                       │
│ Zoom/Teams Link: [Auto-generate]       │
│ Reminders: [☑ 15 mins] [☑ 1 day]      │
│ Attendees: Send Invite ☑               │
│                                        │
│ [Schedule] [Cancel]                    │
└────────────────────────────────────────┘

CALENDAR ANALYTICS:
├─ Team Meetings This Week: 12
├─ Available Time for Coaching: 4.5 hours
├─ Busiest Day: Thursday (6 meetings)
└─ [View Team Availability]
```

---

## SECTION 5: CUSTOMER INTELLIGENCE PAGE

### Route: `/manager/customers`

**5.1 Purpose**
- Track all customer accounts
- Monitor customer health & engagement
- Identify upsell/cross-sell opportunities
- View customer timeline

**5.2 Page Layout**

```
┌─────────────────────────────────────────────────────┐
│         CUSTOMER INTELLIGENCE - ACCOUNTS             │
│  [Filter: All | At Risk | Healthy | Champions]    │
│  [Search] [Sort: Last Contact | Revenue | Health] │
│  [Import] [Export]                                │
└─────────────────────────────────────────────────────┘

CUSTOMER GRID:
┌─ CUSTOMER CARDS ─────────────────────────────────┐
│                                                   │
│ ┌─ Acme Corp ──────────────────────┐            │
│ │ Logo: AC                          │            │
│ │ Industry: Financial Services      │            │
│ │ Size: 250-500                     │            │
│ │                                   │            │
│ │ Health Score: 85 ✓ [Green up]   │            │
│ │ Revenue: $425K                    │            │
│ │ Open Deals: 2 ($850K)             │            │
│ │ Last Contact: 2 hours ago         │            │
│ │ Next Meeting: Today 3 PM          │            │
│ │ Engagement: 92%                   │            │
│ │                                   │            │
│ │ Contacts: 4 | Calls: 12           │            │
│ │ Key Topics: Integration, Pricing  │            │
│ │ Champions: 2                      │            │
│ │                                   │            │
│ │ [View Details] [Add Note]         │            │
│ └───────────────────────────────────┘            │
│                                                   │
│ ┌─ TechStart ──────────────────────┐            │
│ │ ...similar card structure...      │            │
│ └───────────────────────────────────┘            │
│                                                   │
│ ...more customer cards...                         │
│ [Load More]                                       │
│                                                   │
└───────────────────────────────────────────────────┘

CUSTOMER DETAIL VIEW (On Click):
┌─ CUSTOMER PROFILE ─────────────────────────────────┐
│ [Back to List]                                     │
│                                                    │
│ HEADER:                                            │
│ Logo | Acme Corp | Industry: Finance | Size: 250+  │
│ Health: 85 ✓ | Revenue: $425K | Engagement: 92%  │
│                                                    │
│ LEFT PANEL (40%):                                 │
│ ┌─ COMPANY INFO ──────────────────────┐          │
│ │ Industry: Financial Services        │          │
│ │ Company Size: 250-500 employees     │          │
│ │ Founded: 1995                       │          │
│ │ Website: www.acmecorp.com           │          │
│ │ LinkedIn: /company/acme-corp        │          │
│ │                                     │          │
│ │ Decision Makers: 4                  │          │
│ │ ├─ John Smith (CFO) - Champion ✓   │          │
│ │ ├─ Jane Doe (COO)                   │          │
│ │ ├─ Mike Johnson (VP IT)             │          │
│ │ └─ Sarah Lee (Manager)              │          │
│ │                                     │          │
│ │ [Add Contact] [View LinkedIn]       │          │
│ └─────────────────────────────────────┘          │
│                                                    │
│ MIDDLE PANEL (35%):                               │
│ ┌─ ENGAGEMENT TIMELINE ───────────────┐          │
│ │ Timeline of all interactions:        │          │
│ │                                     │          │
│ │ Mar 20, 2:00 PM                     │          │
│ │ [📞 Call] Demo with John Smith      │          │
│ │ Duration: 45 mins | Score: 87       │          │
│ │ [View Recording]                    │          │
│ │                                     │          │
│ │ Mar 19, 10:30 AM                    │          │
│ │ [📧 Email] Sent proposal draft      │          │
│ │                                     │          │
│ │ Mar 18, 3:00 PM                     │          │
│ │ [📞 Call] Discovery call with CFO   │          │
│ │ Duration: 42 mins | Score: 92       │          │
│ │                                     │          │
│ │ [Show More...]                      │          │
│ └─────────────────────────────────────┘          │
│                                                    │
│ RIGHT PANEL (25%):                                │
│ ┌─ OPEN OPPORTUNITIES ────────────────┐          │
│ │ Deal 1: Enterprise License          │          │
│ │ Value: $425K | Stage: Negotiation   │          │
│ │ Rep: Alex Rivera                    │          │
│ │ [View Deal]                         │          │
│ │                                     │          │
│ │ Deal 2: Support Add-on              │          │
│ │ Value: $45K | Stage: Proposal       │          │
│ │ Rep: Taylor Brooks                  │          │
│ │ [View Deal]                         │          │
│ │                                     │          │
│ │ Total Open: $850K                   │          │
│ │                                     │          │
│ │ [View Full Pipeline]                │          │
│ └─────────────────────────────────────┘          │
│                                                    │
├─ CUSTOMER HEALTH & RISKS:                         │
│ ├─ Health Score: 85 / 100 ✓                      │
│ ├─ Health Trend: ↑ Improving                     │
│ ├─ Risk Factors: None                             │
│ ├─ Engagement: Very High (92%) ✓                 │
│ ├─ Conversation Sentiment: Positive 95%           │
│ ├─ Last Contact: 2 hours ago                      │
│ ├─ Days Since Contact: 0 (today)                  │
│ └─ Next Meeting: Today 3 PM                       │
│                                                    │
├─ ACTIONS:                                         │
│ [Schedule Meeting] [Add Note] [Send Email]        │
│ [Create Opportunity] [View ROI] [Export Profile]  │
└────────────────────────────────────────────────────┘
```

**5.3 Data Model**

```
CUSTOMERS TABLE:
├─ id
├─ organization_id (FK)
├─ name
├─ industry
├─ company_size
├─ website
├─ health_score (0-100)
├─ engagement_score (0-100)
├─ last_contact_date
├─ total_revenue
├─ open_deals_count
├─ open_deals_value
├─ created_at

CUSTOMER_CONTACTS TABLE:
├─ id
├─ customer_id (FK)
├─ contact_name
├─ title
├─ email
├─ phone
├─ is_champion (boolean)
├─ last_contacted
└─ created_at
```

---

## SECTION 6: DEALS MANAGEMENT PAGE

### Route: `/manager/deals`

**6.1 Purpose**
- Centralized deal tracking (alternative to pipeline kanban)
- List view of all active deals
- Quick status updates
- Deal analytics

**6.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│         DEALS - DEAL MANAGEMENT LIST                    │
│  [Filter: All | Active | Won | Lost] [Due Soon]       │
│  [Sort: Close Date | Value | Stage | Company]         │
│  [View: List | Kanban] [+New Deal] [Export]           │
└─────────────────────────────────────────────────────────┘

DEALS TABLE:
┌─ Deal Name │ Company │ Rep │ Value │ Stage │ Close Date │ Prob │ Actions ┐
├─────────────┼─────────┼─────┼───────┼───────┼────────────┼─────┼─────────┤
│ Enterprise  │ Acme    │ AR  │ $425K │ Nego? │ Mar 15     │ 85% │ [Edit]  │
│ License     │ Corp    │     │       │       │            │     │         │
├─────────────┼─────────┼─────┼───────┼───────┼────────────┼─────┼─────────┤
│ Support     │TechStart│ TB  │ $85K  │Demo  │ Mar 22     │ 60% │ [Edit]  │
│ Package     │         │     │       │      │            │     │         │
├─────────────┼─────────┼─────┼───────┼───────┼────────────┼─────┼─────────┤
│ ROI Modules │ Global  │ JL  │ $125K │Prop  │ Mar 10     │ 40% │ [Edit]  │
│             │ Tech    │     │       │ ⚠️ OVERDUE     │     │         │
└─────────────┴─────────┴─────┴───────┴───────┴────────────┴─────┴─────────┘

DEAL DETAIL MODAL (On Row Click):
┌─ DEAL: Enterprise License - Acme Corp ──────────┐
│ [X Close]                                       │
│                                                 │
│ DEAL INFO:                                      │
│ ├─ Rep: Alex Rivera                            │
│ ├─ Account: Acme Corp                          │
│ ├─ Value: $425K                                │
│ ├─ Stage: Negotiation                          │
│ ├─ Expected Close: Mar 15, 2026                │
│ ├─ Probability: 85%                            │
│ ├─ Status: On Track ✓                          │
│ └─ Deal Created: Feb 1, 2026                   │
│                                                 │
│ DEAL HEALTH:                                    │
│ ├─ Days in Current Stage: 8                    │
│ ├─ Avg Days in Stage: 5 (⚠️ Longer than avg)   │
│ ├─ Last Activity: Email sent 2 days ago        │
│ ├─ Risk Factors: None                          │
│ └─ Engagement: High                            │
│                                                 │
│ RECENT ACTIVITIES:                              │
│ ├─ Mar 18: [📞] Call with John Smith           │
│ ├─ Mar 16: [📧] Sent contract for review       │
│ ├─ Mar 15: [📞] Pricing discussion             │
│ └─ [View Full Timeline]                        │
│                                                 │
│ ACTIONS:                                        │
│ [Update Stage] [Edit Details] [Add Note]       │
│ [Schedule Call] [Send Email] [View Rep Profile]│
│                                                 │
│ [Save] [Cancel]                                │
└─────────────────────────────────────────────────┘

DEALS ANALYTICS (Summary):
├─ Total Deals: 42
├─ Total Pipeline Value: $3.2M
├─ Weighted Pipeline: $1.8M
├─ Avg Deal Size: $76K
├─ Win Rate: 42%
└─ [View Forecast]
```

---

## SECTION 7: COACHING PLATFORM

### Route: `/manager/coaching`

**7.1 Purpose**
- Track coaching sessions with reps
- Schedule & review coaching
- Monitor skill development
- Generate coaching plans

**7.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│          COACHING - TEAM DEVELOPMENT PLATFORM           │
│  [Tabs: Upcoming | Past Sessions | Skills | Plans]    │
│  [Filter: All Reps | Individual | Status] [+New]      │
└─────────────────────────────────────────────────────────┘

UPCOMING SESSIONS TAB:
┌─ SCHEDULED COACHING SESSIONS ──────────────────┐
│                                                 │
│ ┌─ Tomorrow 2:00 PM ─────────────────────────┐ │
│ │ Rep: Taylor Brooks                         │ │
│ │ Focus Areas: Discovery Questions, Closing  │ │
│ │ Duration: 1 hour                           │ │
│ │ Status: Scheduled                          │ │
│ │ Preparation: Notes ready ✓                 │ │
│ │ [Edit] [Reschedule] [Add Resources]        │ │
│ └────────────────────────────────────────────┘ │
│                                                 │
│ ┌─ Mar 25, 10:00 AM ────────────────────────┐ │
│ │ Rep: Alex Rivera                           │ │
│ │ Focus Areas: Objection Handling             │ │
│ │ Duration: 45 mins                          │ │
│ │ Status: Scheduled                          │ │
│ │ [Edit] [Reschedule] [Add Resources]        │ │
│ └────────────────────────────────────────────┘ │
│                                                 │
│ [+ Schedule New Session]                        │
│                                                 │
└─────────────────────────────────────────────────┘

PAST SESSIONS TAB:
┌─ SESSION HISTORY ──────────────────────────────┐
│                                                 │
│ ┌─ Mar 18, 2:00 PM ──────────────────────────┐ │
│ │ Rep: Taylor Brooks                         │ │
│ │ Focus: Talk Ratio & Listening              │ │
│ │ Duration: 60 mins                          │ │
│ │ Outcome: Completed ✓                       │ │
│ │ Rating: 9/10 (Excellent)                   │ │
│ │                                            │ │
│ │ COACHING NOTES:                            │ │
│ │ "Taylor showed excellent improvement in   │ │
│ │ listening during calls. Her talk ratio    │ │
│ │ improved from 48% to 44%. Next focus:     │ │
│ │ consistency. Schedule follow-up call."    │ │
│ │                                            │ │
│ │ [Run-off Recording] [Export Notes]        │ │
│ │ [Schedule Follow-up] [Coaching Resources] │ │
│ └────────────────────────────────────────────┘ │
│                                                 │
│ ...more past sessions...                        │
│                                                 │
└─────────────────────────────────────────────────┘

SKILLS TAB:
┌─ TEAM SKILLS MATRIX ───────────────────────────┐
│                                                 │
│ Rep         │Discovery│Closing│PresRatio│ROI │ │
│─────────────┼─────────┼───────┼─────────┼────┤ │
│ Taylor B    │ ★★★★★  │ ★★★★☆│ ★★★★☆ │★★★ │ │
│ Alex R      │ ★★★★☆  │ ★★★☆☆│ ★★★★★ │★★★ │ │
│ Jordan L    │ ★★★★☆  │ ★★★★☆│ ★★★★☆ │★★★ │ │
│ Morgan S    │ ★★★☆☆  │ ★★★★☆│ ★★★☆☆ │★★  │ │
│ Casey J     │ ★★☆☆☆  │ ★★★☆☆│ ★★★☆☆ │★   │ │
│                                                 │
│ Team Avg    │ ★★★★☆  │ ★★★★☆│ ★★★★☆ │★★★ │ │
│                                                 │
└─────────────────────────────────────────────────┘

COACHING PLANS TAB:
┌─ INDIVIDUAL DEVELOPMENT PLANS ─────────────────┐
│                                                 │
│ ┌─ Taylor Brooks - 30-60-90 Day Plan ────────┐ │
│ │ Goal: Become Top Performer (125%+ attain) │ │
│ │ Status: On Track (60% complete)            │ │
│ │                                             │ │
│ │ 30-Day Goal: Maintain talk ratio 44%      │ │
│ │ Progress: ✓ Complete                       │ │
│ │                                             │ │
│ │ 60-Day Goal: Improve closing rate 5%      │ │
│ │ Progress: In Progress (50%)                │ │
│ │ Next Session: Mar 25                       │ │
│ │                                             │ │
│ │ 90-Day Goal: Reach 125% quota attainment  │ │
│ │ Progress: On Track (current: 114%)         │ │
│ │                                             │ │
│ │ [View Full Plan] [Edit Plan] [Print Plan]  │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ...more plans...                                │
│                                                 │
└─────────────────────────────────────────────────┘

COACHING CREATION MODAL:
┌─ SCHEDULE COACHING SESSION ──────────────────────┐
│                                                  │
│ Rep(s): [Select: Taylor Brooks] ▼               │
│ Focus Areas:                                     │
│   ☑ Discovery Questions    ☑ Talk Ratio         │
│   ☑ Objection Handling     ☐ ROI Discussion     │
│   ☐ Closing Techniques     ☐ Follow-up          │
│                                                  │
│ Session Type:                                    │
│   ◉ One-on-One   ○ Group   ○ Skill Training    │
│                                                  │
│ Date: [Date Picker]                             │
│ Time: [Time] - [Time]                           │
│ Duration: [45 mins ▼]                          │
│                                                  │
│ Preparation:                                     │
│ ☑ Review rep's recent calls                    │
│ ☑ Pull AI coaching recommendations              │
│ ☐ Prepare sample calls to analyze               │
│                                                  │
│ Coaching Notes (optional):                       │
│ [________________]                              │
│                                                  │
│ [Schedule] [Cancel]                             │
└──────────────────────────────────────────────────┘
```

---

## SECTION 8: INSIGHTS & CONVERSATION INTELLIGENCE

### Route: `/manager/insights`

**8.1 Purpose**
- Analyze conversation patterns across team
- Identify common objections
- Track trending topics
- Benchmark conversation quality

**8.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│     INSIGHTS - CONVERSATION INTELLIGENCE & ANALYTICS    │
│  [Time Period: This Month | Quarter | Year] [Industry]│
│  [Tabs: Topics | Objections | Sentiment | Trends]     │
└─────────────────────────────────────────────────────────┘

TOPICS TAB:
┌─ TRENDING TOPICS ──────────────────────────────┐
│                                                 │
│ Topic               │ Mentions │ Trend    │... │
│─────────────────────┼──────────┼──────────┤    │
│ Pricing             │ 234      │ ↑ 12%   │ [+]│
│ Integration         │ 198      │ ↑ 5%    │ [+]│
│ Implementation      │ 187      │ ↑ 8%    │ [+]│
│ ROI / Business Case │ 165      │ → 0%    │ [▼]│
│ Security / Compliance
 │ 142      │ ↓ 3%    │ [-]│
│ Training Support    │ 128      │ ↑ 15%   │ [▲]│
│ Timeline            │ 96       │ ↓ 5%    │ [-]│
│                                                 │
└─────────────────────────────────────────────────┘

OBJECTION TRACKING:
┌─ TOP OBJECTIONS ────────────────────────────────┐
│                                                 │
│ Objection          │ Count │ Win Rate │ Status │
│────────────────────┼───────┼──────────┼────────┤
│ Price Too High     │ 45    │ 62%      │ ⚠️    │
│ Wrong Fit          │ 32    │ 38%      │ 🔴    │
│ Competition Better │ 28    │ 71%      │ ✓     │
│ Need Budget Approval│ 25    │ 84%      │ ✓     │
│ No Timeline        │ 18    │ 55%      │ ⚠️    │
│                                                 │
│ [Drill into "Price Too High"]                  │
│ ├─ Sample calls mentioning this objection:    │
│ ├─ [Call 1] Postmedia Health - Feb 25        │
│ ├─ [Call 2] TechCorp Solutions - Feb 24      │
│ ├─ [Call 3] CloudScale Inc - Feb 23          │
│ └─ [Sample Handling Techniques]               │
│                                                 │
└─────────────────────────────────────────────────┘

SENTIMENT ANALYSIS:
┌─ TEAM CONVERSATION SENTIMENT ───────────────────┐
│                                                 │
│ Positive:   ████████████░░ 72% (↑ 3% vs last m)│
│ Neutral:    ██████░░░░░░░░ 18% (→ 0%)         │
│ Negative:   ██░░░░░░░░░░░░ 10% (↓ 3%)         │
│                                                 │
│ Positive talks closing rate: 68%               │
│ Neutral talks closing rate: 45%                │
│ Negative talks closing rate: 12%               │
│                                                 │
│ [View Example Calls]                           │
│                                                 │
└─────────────────────────────────────────────────┘

TRENDS OVER TIME:
┌─ TRENDS (Last 8 weeks) ─────────────────────────┐
│                                                 │
│ Line chart showing topic mentions over time     │
│                                                 │
│ ↑ Pricing mentions increasing (more sensitivity)│
│ ↑ Integration complexity being raised more     │
│ ↓ Timeline objections decreasing               │
│                                                 │
│ [Export Insights] [Customize Chart]            │
│                                                 │
└─────────────────────────────────────────────────┘

REP COMPARISON:
┌─ CONVERSATION QUALITY BY REP ──────────────────┐
│                                                 │
│ Rep              │ Avg Score │ Sentiment │ Top │
│──────────────────┼───────────┼───────────┼─────┤
│ Taylor Brooks    │ 9.1       │ 82% pos   │ ROI │
│ Emily Rodriguez  │ 8.9       │ 79% pos   │ Impl│
│ Alex Rivera      │ 8.7       │ 74% pos   │Prici│
│ Jordan Lee       │ 8.5       │ 71% pos   │Sec  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## SECTION 9: REVENUE INTELLIGENCE PAGE

### Route: `/manager/revenue`

**9.1 Purpose**
- Track revenue performance
- Monitor quota attainment
- Forecast quarterly revenue
- Analyze sales cycle metrics

**9.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│         REVENUE INTELLIGENCE - TRACKING & FORECASTING   │
│  [Period: Q1 2026] [View: Summary | Detailed | Forecast]
│  [Export] [Settings]                                   │
└─────────────────────────────────────────────────────────┘

REVENUE SUMMARY CARDS:
┌─ REVENUE CARDS ────────────────────────────────┐
│                                                 │
│ ┌─ Revenue Closed ─────────────┐               │
│ │ $1.85M / $3.5M (53%)         │               │
│ │ ↑ 8% vs. last month          │               │
│ │ vs. Target: $1.65M ✓         │               │
│ └──────────────────────────────┘               │
│                                                 │
│ ┌─ Committed Pipeline ────────┐                │
│ │ $950K (strong deals)         │                │
│ │ Probability: 85%+            │                │
│ └──────────────────────────────┘                │
│                                                 │
│ ┌─ Best Case Pipeline ────────┐                │
│ │ $400K (good potential)       │                │
│ │ Probability: 60-85%          │                │
│ └──────────────────────────────┘                │
│                                                 │
│ ┌─ Forecast Total ───────────────────┐         │
│ │ $1.2M (additional expected)        │         │
│ │ → Projected Total: $2.95M (84%)   │         │
│ │ vs. $3.5M target                   │         │
│ └────────────────────────────────────┘         │
│                                                 │
└─────────────────────────────────────────────────┘

REP-BY-REP REVENUE BREAKDOWN:
┌─────────────────────────────────────────────────┐
│ Rep Name        │ Revenue │ Quota │ Attainment │
│─────────────────┼─────────┼───────┼────────────┤
│ Taylor Brooks   │ $425K   │ $400K │ 106% ✓    │
│ Emily Rodriguez │ $398K   │ $375K │ 106% ✓    │
│ Alex Rivera     │ $378K   │ $380K │ 99%       │
│ Jordan Lee      │ $348K   │ $380K │ 92%       │
│ Morgan Smith    │ $310K   │ $350K │ 89%       │
│ Casey Johnson   │ $285K   │ $330K │ 86%       │
│ [+3 more reps]  │ $810K   │ $795K │ 102% ✓    │
│                                                 │
│ TEAM TOTAL      │ $1.85M  │ $3.5M │ 53%       │
│                                                 │
└─────────────────────────────────────────────────┘

REVENUE FORECAST:
┌─ QUARTERLY FORECAST ─────────────────────────┐
│                                              │
│ $3.5M Target + Potential                    │
│ $2.95M Projected ├─ Closed: $1.85M          │
│                  ├─ Committed: $950K        │
│                  └─ Forecast: $150K         │
│                                              │
│ Status: ON TRACK (84% probably)             │
│                                              │
│ Confidence Level: 79% (strong pipeline)     │
│                                              │
│ If we close best-case: $3.25M (93% target) │
│ If we lose committed: $1.35M (39% target)  │
│                                              │
└─────────────────────────────────────────────┘

SALES CYCLE METRICS:
├─ Average Deal Size: $125K
├─ Average Sales Cycle: 38 days
├─ Win Rate: 42% (vs. target: 45%)
├─ Avg Time to Close: 12 days (negotiations)
└─ [View Trends]

HISTORICAL QUARTERS:
┌─ QUARTERLY PERFORMANCE COMPARISON ─────────┐
│ Quarter │ Target │ Closed │ Attainment    │
│─────────┼────────┼────────┼───────────────┤
│ Q1 2026 │ $3.5M  │ $1.85M │ 53% (in prog) │
│ Q4 2025 │ $3.2M  │ $2.4M  │ 75% ✓         │
│ Q3 2025 │ $3.0M  │ $2.1M  │ 70%           │
│ Q2 2025 │ $2.8M  │ $1.95M │ 70%           │
└─────────────────────────────────────────────┘
```

---

## SECTION 10: SETTINGS & ACCOUNT MANAGEMENT

### Route: `/manager/settings`

**10.1 Purpose**
- Manager preferences and configuration
- Notification settings
- Calendar sync
- Team management settings

**10.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│              SETTINGS - MANAGER PREFERENCES              │
│  [Tabs: Account | Communications | Calendar | Team]    │
└─────────────────────────────────────────────────────────┘

ACCOUNT TAB:
┌─ PROFILE SETTINGS ─────────────────────────────┐
│ [Avatar] [Upload Photo]                        │
│ Name: [John Manager]                           │
│ Email: [john.manager@company.com]              │
│ Title: Sales Manager                           │
│ Team: Enterprise Sales Team (18 reps)          │
│ Department: Sales - East Region                │
│ [Save Changes]                                 │
│                                                 │
│ PASSWORD & SECURITY:                           │
│ [Change Password] [Two-Factor Auth: ON] ✓     │
│ [Login History] [Active Sessions (2)]          │
│                                                 │
│ PREFERENCES:                                    │
│ Default Dashboard View: [Summary ▼]             │
│ Default Time Period: [This Quarter ▼]          │
│ Currency: [USD ▼]                              │
│ Timezone: [Eastern ▼]                          │
│ Date Format: [MM/DD/YYYY ▼]                    │
│ [Save Changes]                                 │
└─────────────────────────────────────────────────┘

COMMUNICATIONS TAB:
┌─ NOTIFICATION SETTINGS ────────────────────────┐
│ ☑ Email notifications enabled                  │
│ ☑ In-app notifications enabled                │
│ ☑ Push notifications enabled (mobile)          │
│                                                 │
│ EMAIL DIGEST:                                  │
│ ◉ Daily   ○ Weekly   ○ Never                   │
│ Preferred time: [9:00 AM ▼]                    │
│                                                 │
│ ALERT PREFERENCES:                             │
│ ☑ Deal at risk (immediate)                    │
│ ☑ Rep below 80% quota (daily)                 │
│ ☑ Team performance update (daily)              │
│ ☑ New coaching opportunity (immediate)        │
│ ☑ Call analysis ready (within 1 hour)        │
│ ☑ Forecast updated (weekly)                   │
│                                                 │
│ [Save Changes]                                 │
└─────────────────────────────────────────────────┘

CALENDAR TAB:
┌─ CALENDAR INTEGRATION ─────────────────────────┐
│ Connected Calendar: [Microsoft Outlook]        │
│ Auto-sync: ☑ Enabled                           │
│ Last Sync: 1 hour ago                          │
│                                                 │
│ SYNC OPTIONS:                                  │
│ ☑ Manager meetings                            │
│ ☑ Team rep meetings                           │
│ ☑ Coaching sessions                            │
│ ☑ Reminders                                    │
│ ☑ Calls                                        │
│                                                 │
│ [Disconnect] [Re-sync Now]                     │
│ [Connect Another Calendar]                     │
│ [Save Changes]                                 │
└─────────────────────────────────────────────────┘

TEAM TAB:
┌─ TEAM MANAGEMENT ──────────────────────────────┐
│ Team Name: Enterprise Sales Team               │
│ Manager: John Manager                          │
│ Team Size: 18 reps                             │
│                                                 │
│ TEAM MEMBERS:                                  │
│ 1. Taylor Brooks (Senior Rep) [Remove] [Edit]  │
│ 2. Alex Rivera (Senior Rep) [Remove] [Edit]    │
│ 3. Jordan Lee (Rep) [Remove] [Edit]            │
│ ... [+15 more]                                 │
│                                                 │
│ [Add Team Member] [Bulk Import] [Export Team] │
│                                                 │
│ TEAM QUOTAS:                                   │
│ Total Quota: $3.5M                             │
│ [Customize Individual Quotas]                  │
│ [Sync from Salesforce]                        │
│ [Save Changes]                                 │
└─────────────────────────────────────────────────┘
```

---

## SECTION 11: AI FEATURES PAGE

### Route: `/manager/ai`

**11.1 Purpose**
- AI-powered recommendations for team
- Automated coaching insights
- Sales playbook recommendations
- Deal risk analysis

**11.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│              AI FEATURES - AUTOMATED INSIGHTS            │
│  [Feature: Coaching | Deal Risk | Recommendations]     │
│  [Settings] [Feedback]                                 │
└─────────────────────────────────────────────────────────┘

AI COACHING TAB:
┌─ AUTOMATED COACHING RECOMMENDATIONS ─────────┐
│                                               │
│ ┌─ Taylor Brooks - Priority Coaching ──────┐ │
│ │ AI Confidence: 92%                       │ │
│ │ Focus: Improve close rate (currently 68%)│ │
│ │                                           │ │
│ │ Recommendation:                           │ │
│ │ "Taylor's closing technique is strong,  │ │
│ │  but needs more trial closes in demo    │ │
│ │  phase. Suggested playbook: 'Trial      │ │
│ │  Close Method'. Success rate: 71% with  │ │
│ │  similar reps."                         │ │
│ │                                           │ │
│ │ Key Calls Showing this Pattern:           │ │
│ │ • Call: Acme Corp - Mar 18 (Score: 87)  │ │
│ │ • Call: TechStart - Mar 15 (Score: 92)  │ │
│ │                                           │ │
│ │ [Schedule Coaching] [View Playbook]      │ │
│ │ [Save for Later] [Dismiss]               │ │
│ └─────────────────────────────────────────┘ │
│                                               │
│ ┌─ Jordan Lee - Development Opportunity ───┐ │
│ │ AI Confidence: 85%                       │ │
│ │ Focus: Stronger discovery questions      │ │
│ │                                           │ │
│ │ Recommendation:                           │ │
│ │ "Jordan's ask only 12 questions vs team │ │
│ │  avg of 15. Playbook: 'Discovery        │ │
│ │  Mastery'. Reps using this improved      │ │
│ │  close rate by 8%."                      │ │
│ │                                           │ │
│ │ [View Playbook] [Schedule Coaching]      │ │
│ │ [Save] [Dismiss]                         │ │
│ └─────────────────────────────────────────┘ │
│                                               │
│ [Show More Recommendations]                   │
│                                               │
└───────────────────────────────────────────────┘

DEAL RISK TAB:
┌─ AI DEAL RISK ANALYSIS ────────────────────────┐
│                                                 │
│ 🔴 Critical Risk (2 deals):                    │
│ ├─ TechStart License ($425K) - 72% risk      │
│ │  Reason: 8 days no activity, no responses  │
│ │  AI Recommendation: Scale outreach, call  │
│ │  champion directly (John Smith)            │
│ │  Sample email: [View template]             │
│ │  [Take Action] [Reschedule]                │
│ │                                             │
│ └─ CloudScale Integration ($125K) - 68% risk│
│    Reason: Pricing concern mentioned, low  │
│    engagement in last call                    │
│    AI Recommendation: Share ROI calculation │
│    Sample ROI calculator: [Generate PDF]     │
│    [Take Action]                             │
│                                               │
│ 🟡 Medium Risk (5 deals)                     │
│ ├─ GlobalTech Proposal ($1.2M) - 42% risk  │
│ │  Reason: Implementation timeline unclear  │
│ │  [View Details] [Take Action]             │
│ │                                             │
│ └─ ... more deals                             │
│                                               │
│ 🟢 Low Risk: All other deals on track       │
│                                               │
└─────────────────────────────────────────────────┘

PLAYBOOK RECOMMENDATIONS TAB:
┌─ AI-RECOMMENDED SALES PLAYBOOKS ───────────────┐
│                                                 │
│ Based on rep profiles & team performance      │
│                                                 │
│ ┌─ "Discovery Mastery" Playbook ────────────┐ │
│ │ Recommended for: 4 reps (Jordan L, Morgan,│ │
│ │                  Casey J, David K)        │ │
│ │ Expected Impact: +8% close rate           │ │
│ │ Time Investment: 2 hours training         │ │
│ │ Complexity: Intermediate                  │ │
│ │ [Preview] [Start Training] [Schedule]     │ │
│ └────────────────────────────────────────────┘ │
│                                                 │
│ ┌─ "Objection Handling" Playbook ────────────┐ │
│ │ Recommended for: 3 reps (addressing "price│ │
│ │                  too high" objection)     │ │
│ │ Expected Impact: +5% win rate on pricing  │ │
│ │ Time Investment: 1.5 hours                │ │
│ │ [Preview] [Start Training] [Schedule]     │ │
│ └────────────────────────────────────────────┘ │
│                                                 │
│ [View All Available Playbooks]                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## SECTION 12: COMPLETE DATABASE REFERENCE

**12.1 All Database Tables Used**

```sql
-- Core Tables
├── users
├── managers
├── team_performance_metrics
├── user_performance_metrics
├── meetings
├── transcripts
├── deals
├── deal_activities
├── customers
├── customer_contacts
├── contacts
├── tasks
├── activities
├── coaching_sessions
├── coaching_recommendations
├── call_coaching_notes
├── revenue_forecasts
├── forecast_history
├── scheduler_events
├── notifications
└── notifications_settings

-- Relationship Examples
users (1) → (N) meetings
users (1) → (N) coaching_sessions (as assignee)
managers (1) → (N) coaching_sessions (as coach)
customers (1) → (N) deals
deals (1) → (N) deal_activities
meetings (1) → (1) transcripts
```

**12.2 Common Query Patterns**

```sql
-- Manager's Team Dashboard
SELECT * FROM users WHERE manager_id = ? AND is_active = TRUE;

-- Team Meetings This Month
SELECT * FROM meetings 
WHERE user_id IN (SELECT id FROM users WHERE manager_id = ?)
  AND scheduled_start_time >= DATE_TRUNC('month', CURRENT_DATE)
ORDER BY scheduled_start_time;

-- Revenue YTD
SELECT SUM(revenue_closed) FROM user_performance_metrics
WHERE manager_id = ? AND period_start_date >= '2026-01-01';

-- Coaching Sessions (Upcoming)
SELECT * FROM coaching_sessions
WHERE manager_id = ? AND session_date > CURRENT_TIMESTAMP
ORDER BY session_date ASC;

-- Deals at Risk
SELECT * FROM deals 
WHERE user_id IN (SELECT id FROM users WHERE manager_id = ?)
  AND stage != 'closed_won'
  AND (CURRENT_DATE > expected_close_date 
       OR DATEDIFF(day, MAX(activity_date), CURRENT_DATE) > 5);
```

---

**END OF PART 4 - COMPLETE MANAGER PANEL COVERAGE**

---

## COMPREHENSIVE SUMMARY

**Total Manager Panel Pages Documented:**
- Part 1: Dashboard + Performance + Pipeline (3 pages)
- Part 2: Forecast + Call Details (2 pages)
- Part 3: Components, Integration, Deployment (Reference)
- Part 4: Meetings + Calls + Tasks + Scheduler + Customers + Deals + Coaching + Insights + Revenue + Settings + AI (11 pages)

**TOTAL: 16 DISTINCT MANAGER PAGES**
- 5 Core Manager-Specific Pages (Dashboards & Analytics)
- 11 Shared Feature Pages (Full Documentation)

**Total Documentation:**
- UI Layouts: 50+ detailed mockups
- Database Queries: 100+ SQL examples
- API Endpoints: 30+ RESTful endpoints
- Components: 50+ reusable React components
- Database Tables: 25+ tables with relationships
- Data Fields: 200+ field definitions

---

**Document Metadata**
- Total Parts: 4
- Created: April 2, 2026
- Version: 1.0 Complete
- Status: READY FOR SPRINT PLANNING ✓
- Estimated Development Time: 300-400 hours (6-8 week project)

---

**NEXT STEPS FOR YOUR TEAM:**
1. Use Parts 1-4 to create Jira stories
2. Assign components to development teams
3. Execute sprints following outlined order
4. Reference database queries for backend
5. Use UI layouts for frontend component structure
6. Follow deployment checklist on launch

---

**All 16 manager pages + complete technical specifications = COMPLETE MANAGER DASHBOARD BLUEPRINT** ✅
