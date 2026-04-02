# Employee Panel - Complete Architecture
## PART 3: REMAINING SHARED PAGES, COMPONENTS & INTEGRATION

---

## Section A: ACTIVITIES & TIMELINE PAGE

### Route: `/rep/activities`

**A.1 Purpose**
- View all personal activities (calls, meetings, emails, notes)
- Timeline view of account engagement
- Activity feed for team visibility
- Export activity reports

**A.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│           MY ACTIVITIES - TIMELINE VIEW                 │
│  [Filter: All | Calls | Emails | Meetings | Notes]    │
│  [Period: Today | This Week | This Month | All]       │
│  [Sort: Latest | By Type | By Account]               │
│  [Export] [Print]                                     │
└─────────────────────────────────────────────────────────┘

ACTIVITY TIMELINE (Chronological):
┌─ TODAY ───────────────────────────────────────────────┐
│                                                        │
│ 3:45 PM - [📞 CALL] DataFlow Solutions               │
│ ├─ Duration: 18:56                                   │
│ ├─ Contact: James Wilson, CTO                        │
│ ├─ Deal: Enterprise License $210K                    │
│ ├─ Score: 92/100 ✓✓                                  │
│ ├─ Outcome: Negotiation → Ready to close            │
│ ├─ Next Action: Send contract                        │
│ ├─ [View Recording] [View Transcript] [Share]        │
│ └─ [Add Notes] [Create Follow-up Task]              │
│                                                        │
│ 1:20 PM - [📧 EMAIL] CloudVista Security Questions  │
│ ├─ Recipient: security@cloudvista.com               │
│ ├─ Subject: "RE: Security Documentation"             │
│ ├─ Status: Sent ✓                                   │
│ ├─ Related Deal: CloudVista Pilot $125K              │
│ └─ [View Email] [Track Opens] [Schedule Follow-up]   │
│                                                        │
│ 12:00 PM - [📝 NOTE] Competitive intel on DataFlow   │
│ ├─ Created: 12:00 PM                                │
│ ├─ Related To: Quantum Inc deal                      │
│ ├─ Visibility: Private to me                         │
│ ├─ Content: "Competitor mention in call..."         │
│ └─ [View Note] [Edit] [Share with Manager]           │
│                                                        │
│ 10:15 AM - [📞 CALL] Acme Corp Discovery            │
│ ├─ Duration: 12:34                                   │
│ ├─ Contact: Sarah Johnson, CFO                       │
│ ├─ Deal: Enterprise License $85K                     │
│ ├─ Score: 87/100 ✓                                  │
│ ├─ Sentiment: Positive                              │
│ ├─ Next Action: Schedule technical deep dive         │
│ ├─ [View Recording] [View Transcript]                │
│ └─ [Create Follow-up Task]                           │
│                                                        │
│ 9:30 AM - [📅 MEETING] Team Standup                 │
│ ├─ Duration: 30 mins                                │
│ ├─ Attendees: 7 reps, Sarah (manager)               │
│ ├─ [Meeting Notes] [Action Items]                    │
│ └─ [Follow-up Assigned]                              │
│                                                        │
└────────────────────────────────────────────────────────┘

┌─ YESTERDAY ───────────────────────────────────────────┐
│ ... Activities from yesterday ...                      │
└────────────────────────────────────────────────────────┘

┌─ EARLIER THIS WEEK ───────────────────────────────────┐
│ ... Activities from earlier ...                        │
└────────────────────────────────────────────────────────┘

ACTIVITY ANALYTICS (Bottom):
├─ Total Activities This Month: 156
├─ By Type: Calls (42) | Emails (58) | Meetings (28) | Notes (28)
├─ Total Call Time: 18.5 hours
├─ Avg Activities Per Day: 7.8
└─ [View Detailed Reports]
```

**A.3 Activity Types**
- **Calls**: Call recording, transcript, score, outcome
- **Emails**: Sent/received, open tracking, attachment info
- **Meetings**: Calendar event, participants, agenda, notes
- **Notes**: Internal notes, linked to deals/contacts
- **Tasks**: Completed/assigned, deadline, status

**A.4 Key Query**
```sql
-- Rep's Activity Timeline
SELECT 
  'call' as type, scheduled_start_time as timestamp, 
  'call' as action, contact_id, deal_id, engagement_score as score
FROM meetings WHERE user_id = ?
UNION ALL
SELECT 
  'email', sent_at, 'email', recipient_id, deal_id, NULL
FROM emails WHERE user_id = ?
UNION ALL
SELECT 
  'note', created_at, 'note', NULL, deal_id, NULL
FROM internal_notes WHERE user_id = ?
ORDER BY timestamp DESC;
```

---

## Section B: TRACKERS & METRICS PAGE

### Route: `/rep/trackers`

**B.1 Purpose**
- Monitor personal key metrics
- Set and track goals
- Measure progress on initiatives
- Create custom dashboards

**B.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│         MY TRACKERS - KEY METRICS & GOALS               │
│  [Create New Tracker] [Save Dashboard] [Export]        │
└─────────────────────────────────────────────────────────┘

QUOTA & REVENUE TRACKING:
┌─ QUOTA TRACKER ────────────────────────────────────────┐
│                                                         │
│ Monthly Target: $250K                                  │
│ Progress: $185K (74%)                                  │
│ Days Remaining: 11                                     │
│ Status: ON TRACK ✓                                     │
│                                                         │
│ Forecast:                                              │
│ Projected Close: $260K (↑ $10K - 4% over target) ✓   │
│                                                         │
│ Visual: [████████████░░] 74% complete                 │
│                                                         │
│ Historical:                                            │
│ Feb 2026: $198K (79% of $250K)                        │
│ Jan 2026: $210K (84% of $250K)                        │
│ Dec 2025: $225K (90% of $250K)                        │
│                                                         │
│ Trend: ↑ Improving (Feb → Mar: +$62K)                  │
│ [View Forecast] [Detailed Report]                      │
│                                                         │
└─────────────────────────────────────────────────────────┘

ACTIVITY TRACKERS:
┌─ CALLS TRACKER ───────────────────────────────────────┐
│ Target: 30 calls/month | Goal: Improve call quality  │
│ This Month: 42 calls (140% of target) ✓✓             │
│ Avg Score: 8.5 / 10 (↑ +0.3 vs target of 8.2)       │
│ Status: EXCEEDING ✓✓                                 │
│                                                        │
│ Breakdown:                                             │
│ • Discovery calls: 12 (avg score: 8.6)               │
│ • Demo calls: 8 (avg score: 8.4)                     │
│ • Negotiation calls: 3 (avg score: 8.8)              │
│ • Follow-up calls: 19 (avg score: 8.3)               │
│                                                        │
│ [Track Details] [Set New Goal]                        │
└────────────────────────────────────────────────────────┘

┌─ MEETINGS TRACKER ────────────────────────────────────┐
│ Target: 20 meetings/month | Goal: Book more demos    │
│ This Month: 18 meetings (90% of target) →             │
│ Demos booked: 6 (↑ +2 vs target of 4)               │
│ Status: ON TRACK ✓                                   │
│                                                        │
│ [Track Details] [Set New Goal]                        │
└────────────────────────────────────────────────────────┘

┌─ PIPELINE TRACKER ────────────────────────────────────┐
│ Target: $500K+ open pipeline | Goal: $750K           │
│ Current Pipeline: $720K ✓✓                            │
│ New Deals Added This Month: 3                         │
│ Deals Advanced (stage): 4                             │
│ Status: EXCEEDING ✓✓                                 │
│                                                        │
│ [Track Details] [Set New Goal]                        │
└────────────────────────────────────────────────────────┘

SKILL DEVELOPMENT TRACKERS:
┌─ SKILL TRACKER: Active Listening ─────────────────────┐
│ Goal: Reduce talk time from 50% to 40% by Apr 30    │
│ Progress: 50% → 42% (↓ 8%) ✓                        │
│ Timeline: 40 days remaining                          │
│ Status: ON TRACK (8.4% toward 20% reduction goal)   │
│                                                        │
│ Weekly Progress:                                       │
│ Week 1: 50% → 48% (-2%)                             │
│ Week 2: 48% → 45% (-3%)                             │
│ Week 3: 45% → 44% (-1%)                             │
│ Week 4: 44% → 42% (-2%)  ← This week                │
│                                                        │
│ [View Suggestions] [Get Coaching]                     │
└────────────────────────────────────────────────────────┘

┌─ SKILL TRACKER: Discovery Questions ──────────────────┐
│ Goal: Reach 20 questions per call by end of month    │
│ Progress: 15 → 18.2 avg (+3.2) ✓                    │
│ Status: ON TRACK (98% toward goal!)                 │
│                                                        │
│ [View Suggestions] [Get Coaching] [Complete Goal]   │
└────────────────────────────────────────────────────────┘

CUSTOM TRACKERS:
┌─ MY CUSTOM TRACKERS ──────────────────────────────────┐
│                                                        │
│ 1. Account Expansion Tracker                          │
│    Goal: Generate $150K from existing accounts       │
│    Progress: $45K (30%)                              │
│    Target accounts: 8 | Active: 6                    │
│    Status: ON TRACK                                  │
│                                                        │
│ 2. Networking Events Tracker                          │
│    Goal: Attend 4 events, generate 3 opportunities  │
│    Progress: Attended 1, Opportunities: 2           │
│    Status: ON TRACK                                  │
│                                                        │
│ [Add New Tracker] [Edit Existing] [Delete]          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**B.3 Tracker Types**
- Revenue/Quota trackers
- Activity trackers (calls, meetings, emails)
- Pipeline trackers
- Skill development trackers
- Custom goal trackers
- Team comparison trackers

---

## Section C: COMPOSE EMAIL PAGE

### Route: `/rep/compose-email`

**C.1 Purpose**
- Compose emails to prospects/customers
- Use email templates
- Get AI writing suggestions
- Track email engagement

**C.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│           COMPOSE EMAIL - TO PROSPECT                   │
│  [Back to Dashboard] | [Saved Drafts (2)]            │
└─────────────────────────────────────────────────────────┘

COMPOSE PANEL (Left 70%):

┌─ EMAIL COMPOSER ──────────────────────────────────────┐
│ [Template Library] [Insert Snippet] [Insert Link]     │
│ [Insert Document] [Insert Personalization]            │
│                                                        │
│ FROM: [alex_rivera@company.com ▼]                    │
│                                                        │
│ TO:   [_______________________]                       │
│       [+ Add CC] [+ Add BCC]                          │
│                                                        │
│ SUBJECT: [_______________________]                    │
│          [✓ Personalized] [AI Suggestion: "?" ]       │
│                                                        │
│ BODY:                                                  │
│ ┌──────────────────────────────────────────────────┐  │
│ │ Hi Sarah,                                        │  │
│ │                                                  │  │
│ │ Thanks for taking the time this week. I wanted │  │
│ │ to follow up on our discussion around...       │  │
│ │                                                  │  │
│ │ Based on what you shared about [budget], I     │  │
│ │ think the Enterprise tier would be a strong fit│  │
│ │ for Acme Corp because [ROI statement].         │  │
│ │                                                  │  │
│ │ Happy to schedule a technical deep dive next   │  │
│ │ week. Are you available [days/times]?          │  │
│ │                                                  │  │
│ │ Best,                                           │  │
│ │ Alex                                            │  │
│ └──────────────────────────────────────────────────┘  │
│ [Text formatting: B I U — ⧛ Size Font List]         │
│                                                        │
│ FOOTER:                                                │
│ [Smart footer: Name, Title, Contact, Company]        │
│ [Personalize: {first_name}, {company}, etc]          │
│                                                        │
└────────────────────────────────────────────────────────┘

EMAIL SIDEBAR (Right 30%):

┌─ EMAIL DETAILS ────────────────────────────────────────┐
│ TO:   Sarah Johnson                                    │
│ COMPANY: Acme Corp                                     │
│ DEAL: Enterprise License ($85K)                       │
│ CONTACT INFO:                                          │
│ • Email: sarah@acmecorp.com                          │
│ • Phone: (555) 123-4567                              │
│ • Title: Chief Financial Officer                      │
│ • LinkedIn: [Profile Link]                            │
│                                                        │
│ OPPORTUNITY:                                           │
│ • Related Stage: Discovery                            │
│ • Last Activity: 10 AM discovery call (today)         │
│ • Notes: Budget confirmed, timeline urgent            │
│ • [View Call Recording] [View Deal]                   │
│                                                        │
└────────────────────────────────────────────────────────┘

┌─ AI WRITING ASSISTANT ─────────────────────────────────┐
│ ✓ Grammar Check: 0 issues (Green ✓)                   │
│ ✓ Tone: Professional & warm (Good!)                   │
│ ✓ Length: Optimal (3 short paragraphs)               │
│ ℹ Suggestion: "Add specific meeting times to        │
│   increase acceptance rate (+12% with specific times)"│
│                                                        │
│ [Apply Suggestion] [Get More Tips]                    │
│                                                        │
└────────────────────────────────────────────────────────┘

┌─ EMAIL TEMPLATES ──────────────────────────────────────┐
│ [Discovery Follow-up]                                 │
│ [Demo Confirmation]                                   │
│ [Proposal Sent]                                       │
│ [Pricing Objection Response]                         │
│ [Competitor Comparison]                              │
│ [Timeline Urgency]                                    │
│ [Re-engagement]                                       │
│ [New Connection]                                      │
│ [Browse All Templates (+20)]                         │
│                                                        │
│ [+ Create Custom Template]                            │
│                                                        │
└────────────────────────────────────────────────────────┘

BOTTOM ACTION BUTTONS:
├─ [↙ Save Draft] | [Upload Attachment] | [Schedule ▼]
├─ [Preview Email] | [Personalization Check]
└─ [Send Now] | [Schedule Send]

SCHEDULING OPTIONS:
┌─ SCHEDULE SEND ─────────────────────────────┐
│ Send at: [Date] [Time]                      │
│ ۰ Send immediately                          │
│ ۰ Send in [30 mins ▼]                      │
│ ۰ Schedule for: [Date/Time picker]         │
│                                              │
│ ✓ Optimal Send Time: [2:00 PM Tomorrow]    │
│   (Time when Sarah is most active)          │
│                                              │
│ [Schedule Send] [Send Now]                  │
└─────────────────────────────────────────────┘

TRACKING OPTIONS:
┌─ EMAIL TRACKING ────────────────────────────┐
│ ☑ Track opens                               │
│ ☑ Track clicks on links                     │
│ ☑ Smart follow-up: Remind if no response   │
│   in [3 days ▼]                            │
│ ☑ AI suggestion: Follow-up template        │
│                                              │
│ [More Options]                              │
│                                              │
└─────────────────────────────────────────────┘
```

**C.3 Email Features**
- Template library (20+ pre-built templates)
- Personalization tokens
- AI grammar & tone checking
- Open & click tracking
- Optimal send time suggestions
- Attachment support
- Email scheduling
- Smart follow-up reminders
- Competitor comparison templates
- Objection response templates

**C.4 Compose Email Workflow**
1. Start new or from template
2. Select recipient + auto-populate details
3. Personalize subject/body
4. AI suggestions appear
5. Schedule or send immediately
6. System tracks opens/clicks
7. Auto-generates follow-up reminder

---

## SECTION D: SHARED COMPONENT LIBRARY

### Components Used Across All Rep Pages

**D.1 Core UI Components**

```
BUTTONS:
├─ Primary Action [Send] [Send Message] [Call Rep]
├─ Secondary [Cancel] [Skip] [Learn More]
├─ Danger [Close Deal] [Delete Note]
├─ Success [Completed ✓] [Sent ✓]
└─ States: Regular | Hover | Disabled (grayed) | Loading (spinner)

CARDS:
├─ Meeting Cards (time, company, contact, actions)
├─ Call Cards (type, duration, score, sentiment)
├─ Deal Cards (company, stage, value, health)
├─ Task Cards (title, due date, priority, status)
└─ Account Cards (logo, health score, revenue, contacts)

BADGES / TAGS:
├─ Priority: 🔴 HIGH | 🟡 MEDIUM | 🟢 LOW
├─ Status: Scheduled | In Progress | Completed | At Risk
├─ Sentiment: 🟢 Positive | 🟡 Neutral | 🔴 Negative
├─ Score: 90+ ✓✓ | 80-89 ✓ | 70-79 → | <70 ⚠️
└─ Type: Call | Email | Meeting | Note | Task

TABLES:
├─ Deal table (company, value, stage, probability, actions)
├─ Call history table (date, contact, score, sentiment, actions)
├─ Performance table (metric, score, trend, benchmark)
└─ Sortable & filterable rows

MODALS / DIALOGS:
├─ Confirmation dialogs ("Are you sure?")
├─ Error messages ("Something went wrong")
├─ Loading states ("Please wait...")
├─ Success messages ("✓ Successfully saved")
└─ Action modals (Task creation, deal move, note adding)

FORMS:
├─ Text inputs (with placeholder text)
├─ Dropdowns (with search)
├─ Date pickers (calendar UI)
├─ Time pickers
├─ Multi-select (tags)
├─ Text areas (rich editing)
└─ Radio buttons & checkboxes

CHARTS & GRAPHS:
├─ Progress bars (quota, task completion)
├─ Line charts (trends over time)
├─ Bar charts (multiple metrics)
├─ Pie charts (breakdown by category)
├─ Timeline / waterfall charts
└─ Heat maps (activity by time)

TOOLTIPS & POPOVERS:
├─ Hover tooltips (explain abbreviations)
├─ Info popovers (detailed context)
├─ Help icons (?) with explanations
└─ Smart suggestions (AI prompts)

NAVIGATION:
├─ Sidebar (collapsible, role-based menu)
├─ Top nav bar (back button, breadcrumbs, actions)
├─ Tab groups (organize content sections)
├─ Pagination (for large lists)
└─ Breadcrumb trail
```

**D.2 Specialized Components for Reps**

```
CALL PLAYER:
├─ Audio player with progress bar
├─ Speed controls (0.75x, 1x, 1.5x, 2x)
├─ Waveform visualization
├─ Transcript synced to audio
├─ Playback controls (play, pause, restart)
└─ Timeline scrubber

DEAL KANBAN:
├─ 5-stage columns (Discovery, Demo, Proposal, Negotiation, Closed)
├─ Draggable deal cards
├─ Stage-specific actions
├─ Add deal modal per stage
└─ Column totals (count + value)

PIPELINE FORECAST:
├─ Probability-weighted calculations
├─ Month-over-month comparison
├─ Visual pipeline bar showing $ by stage
├─ At-risk deal highlighting
└─ Forecast vs actual projection

SCORECARD:
├─ Display metric with value + trend
├─ Color-coded status (green/yellow/red)
├─ Spark line mini chart
├─ Comparison to benchmark
├─ [View Details] link
└─ Learn more tips

TIMELINE / ACTIVITY FEED:
├─ Chronological list of activities
├─ Grouped by date
├─ Icon + color coding by type
├─ Expandable detail view
├─ Inline actions (share, export, add note)
└─ Infinite scroll or pagination

COMPARISON PANELS:
├─ You vs Team Average
├─ You vs Top Performer
├─ This Month vs Last Month
├─ Metric breakdown with arrows (↑ ↓ →)
└─ Rank indicator
```

---

## SECTION E: DATABASE ARCHITECTURE FOR EMPLOYEE PANEL

**E.1 Core Tables**

```sql
-- User & Role Management
├── users (id, manager_id, role, team_id, full_name, email, avatar)
├── team_targets (user_id, month, quota, region)
└── user_roles (user_id, role: 'rep', 'manager', 'admin')

-- Sales Activities
├── meetings (id, user_id, contact_id, deal_id, scheduled_start_time, 
│             scheduled_end_time, status, transcript_url, recording_url, 
│             has_recording, engagement_score, call_sentiment)
├── contacts (id, company_id, first_name, last_name, email, phone, title)
├── companies (id, name, industry, website, size, logo_url, health_score)
└── deals (id, user_id, company_id, deal_name, deal_value, stage, 
          probability, expected_close_date, status, created_at)

-- Performance & Metrics
├── user_performance_metrics (user_id, date, revenue_closed, 
│                            calls_completed, meetings_completed,
│                            avg_call_score, avg_engagement)
├── call_metrics (meeting_id, talk_ratio, questions_asked, 
│                pause_count, sentiment_score, objections_handled)
├── rep_skill_assessments (user_id, skill_name, score, week_ending, trend)
└── rep_weekly_metrics (user_id, week_starting, avg_call_score, 
│                       calls_completed, total_deals_advanced)

-- Tasks & Activities
├── tasks (id, title, description, assigned_to_user_id, 
│         due_date, priority, status, deal_id, created_at)
├── activities (id, user_id, activity_type, related_entity_id, 
│              description, timestamp, visibility)
└── internal_notes (id, user_id, deal_id, note_text, created_at)

-- Coaching
├── coaching_sessions (id, manager_id, rep_id, session_date, 
│                     focus_areas, recording_url, notes)
├── development_plans (id, rep_id, goal, start_date, end_date, 
│                     status, milestones)
└── coaching_recommendations (id, rep_id, recommendation_text, 
│                            priority, status, created_by)

-- Email & Communication
├── emails (id, user_id, recipient_id, subject, body, sent_at, 
│          opened_at, clicked_at, deal_id)
├── email_templates (id, template_name, category, body, 
│                   created_by, organization_id)
└── sms_messages (id, user_id, contact_id, message_text, sent_at)

-- Custom Trackers
├── custom_trackers (id, user_id, tracker_name, metric_type, 
│                   goal_value, current_value, target_date)
└── tracker_history (tracker_id, value, recorded_at)

-- Integrations
├── calendar_integrations (user_id, provider, access_token, 
│                        sync_enabled, last_sync)
├── crm_integrations (user_id, crm_type, connection_url, last_sync)
└── zoom_integrations (user_id, zoom_account, auto_generate_links)
```

**E.2 Common Rep Data Queries**

```sql
-- Rep's Today's Agenda
SELECT m.*, c.contact_name, d.deal_name, d.deal_value
FROM meetings m
LEFT JOIN contacts c ON m.contact_id = c.id
LEFT JOIN deals d ON m.deal_id = d.id
WHERE m.user_id = ? AND DATE(m.scheduled_start_time) = CURRENT_DATE
ORDER BY m.scheduled_start_time;

-- Rep's Quota Progress This Month
SELECT 
  SUM(deal_value) as closed_revenue,
  COUNT(*) as deals_closed,
  (SELECT quota FROM team_targets WHERE user_id = ? 
   AND EXTRACT(MONTH FROM month) = EXTRACT(MONTH FROM CURRENT_DATE)) as target
FROM deals
WHERE user_id = ? AND status = 'closed_won'
  AND EXTRACT(MONTH FROM close_date) = EXTRACT(MONTH FROM CURRENT_DATE);

-- Rep's Call Performance
SELECT 
  AVG(engagement_score)::int as avg_score,
  AVG(talk_ratio) as avg_talk_ratio,
  COUNT(*) as total_calls,
  SUM(CASE WHEN call_sentiment = 'positive' THEN 1 ELSE 0 END) as positive_calls
FROM meetings
WHERE user_id = ? 
  AND DATE(scheduled_start_time) >= CURRENT_DATE - INTERVAL '30 days'
  AND status = 'completed';

-- Rep's Personal Pipeline
SELECT stage, COUNT(*) as deal_count, SUM(deal_value) as stage_value,
       ROUND(AVG(probability))::int as avg_probability
FROM deals
WHERE user_id = ? AND status NOT IN ('closed_won', 'closed_lost')
GROUP BY stage
ORDER BY CASE stage 
  WHEN 'discovery' THEN 1
  WHEN 'demo' THEN 2
  WHEN 'proposal' THEN 3
  WHEN 'negotiation' THEN 4
  ELSE 5 END;
```

---

## SECTION F: API ENDPOINTS FOR EMPLOYEE PANEL

**F.1 Dashboard Endpoints**

```
GET  /api/rep/dashboard
     - Returns: Today's schedule, quota status, call scores, tasks
     
GET  /api/rep/quota
     - Returns: Quota vs closed, forecast, monthly breakdown
     
GET  /api/rep/calls/performance
     - Returns: Avg score, sentiment breakdown, trends
```

**F.2 Activity Endpoints**

```
GET  /api/rep/activities
     - Returns: Activity timeline (calls, emails, meetings, notes)
     
GET  /api/rep/calls
     - Returns: All call recordings with sentiment, score, duration
     
GET  /api/rep/call/{id}/analysis
     - Returns: Full AI analysis, coaching recommendations, transcript
```

**F.3 Pipeline Endpoints**

```
GET  /api/rep/deals
     - Returns: All deals by stage (kanban structure)
     
GET  /api/rep/deals/{id}
     - Returns: Single deal detail + history
     
PUT  /api/rep/deals/{id}/stage
     - Body: { stage: 'demo' }
     - Returns: Updated deal with history entry
```

**F.4 Settings & Coaching Endpoints**

```
GET  /api/rep/coaching/sessions
     - Returns: Upcoming and past coaching sessions
     
GET  /api/rep/coaching/recommendations
     - Returns: AI-generated coaching recommendations
     
GET  /api/rep/skills
     - Returns: Skill assessments and development progress
```

---

## SECTION G: INTEGRATION POINTS

**G.1 Calendar Integrations**
- Microsoft Outlook (OAuth)
- Google Calendar (OAuth)
- Sync meetings from connected calendar
- Auto-add calls to calendar on scheduling
- Show calendar availability in UI

**G.2 CRM Integrations**
- Salesforce (bi-directional sync of deals)
- HubSpot (sync contacts and companies)
- Pipedrive (deal updates)
- Auto-create activities from calls/emails

**G.3 Communication Integrations**
- Zoom (auto-generate meeting links)
- Microsoft Teams (launch from UI)
- Gmail (auto-sync emails)
- Outlook (auto-sync emails & calendar)

**G.4 Analytics Integrations**
- Salesforce Analytics (embed dashboards)
- Tableau (embed reports)
- Power BI (embed visualizations)
- Google Analytics (track system usage)

---

**END OF PART 3 - COMPONENTS, DATABASE & INTEGRATION**

---

## Document Metadata
- Total Pages in Part 3: 3 (Activities, Trackers, ComposeEmail)
- Total Components: 40+
- Database Tables: 20+
- API Endpoints: 15+
- Integration Points: 10+
- Estimated Dev Time: 40-60 hours

---

**SUMMARY: EMPLOYEE PANEL - COMPLETE ARCHITECTURE**

### Total Coverage:
- **Part 1 (Core Rep Pages)**: Dashboard, Pipeline, Performance, Call Details
- **Part 2 (Shared Pages)**: Meetings, Calls, Tasks, Scheduler, Customers, Deals, Coaching, Insights, Revenue, Settings, AI
- **Part 3 (Additional Pages + Components)**: Activities, Trackers, ComposeEmail, Component Library, Database, API, Integrations

### Grand Total:
- **16 Distinct Pages**
- **50+ UI Layouts & Mockups**
- **20+ Database Tables**
- **15+ API Endpoints**
- **40+ Reusable Components**
- **Estimated Development Time: 200-280 hours (4-6 weeks)**

### Status: ✅ COMPLETE & READY FOR DEVELOPMENT

---

**All 3 parts committed and pushed to GitHub**
