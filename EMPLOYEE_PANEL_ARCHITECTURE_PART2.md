# Employee Panel - Complete Architecture
## PART 2: SHARED FEATURE PAGES (MEETINGS, CALLS, TASKS, SCHEDULER)

---

## Section A: MEETINGS MANAGEMENT PAGE

### Route: `/rep/meetings`

**A.1 Purpose**
- View all scheduled and past meetings
- Join calls directly
- Track call outcomes
- Access recordings and transcripts

**A.2 Page Layout** *(Same as Manager PART 4, but filtered to rep's own meetings + team meetings showing reps in calls)*

```
MEETINGS TAB STRUCTURE:
├─ MY MEETINGS (Upcoming & Past)
│  ├─ Upcoming: Scheduled calls with prospects
│  └─ Past: Completed calls with recordings
│
└─ TEAM MEETINGS (Optional: View others' calls)
   ├─ View colleague calls (for learning)
   └─ Request coaching from manager calls
```

**A.3 Key Features for Reps**
- Click "Join Call" to launch Zoom/Teams integration
- Access call transcripts immediately after completion
- Download call recordings for personal coaching
- Flag calls for manager coaching review
- Add personal call notes

**A.4 Key Query**
```sql
-- Rep's Meetings (My meetings only)
SELECT * FROM meetings
WHERE user_id = ? AND scheduled_start_time > CURRENT_TIMESTAMP
ORDER BY scheduled_start_time ASC;
```

---

## Section B: CALLS & CALL RECORDINGS PAGE

### Route: `/rep/calls`

**B.1 Purpose**
- Access all personal call recordings
- Review call AI analysis
- Get coaching recommendations
- Download for personal development

**B.2 Page Layout** *(Identical to Manager, but filtered to rep's own calls)*

```
CALLS PAGE - REP VERSION:
├─ All recorded calls for this rep
├─ Filter: All | Recent | High Score | Coaching Needed
├─ Sort: Latest | Score | Duration
│
└─ FEATURES:
   ├─ One-click audio playback
   ├─ Transcript search
   ├─ AI coaching on each call
   ├─ Share with manager button
   └─ Download recording
```

**B.3 Rep-Specific Actions**
- "Share with Manager" button to request coaching
- "Get Coaching" button to trigger AI recommendations
- "Mark for Learning" to add to personal dev folder
- "Export for Portfolio" for career advancement

**B.4 Key Query**
```sql
-- Rep's Call Recordings
SELECT m.* FROM meetings m
WHERE m.user_id = ? AND m.has_recording = TRUE 
  AND m.status = 'completed'
ORDER BY m.scheduled_start_time DESC;
```

---

## Section C: TASKS & ACTIVITY MANAGEMENT

### Route: `/rep/tasks`

**C.1 Purpose**
- Manage personal daily tasks
- Track action items from calls
- Receive task assignments from manager
- Monitor completion rate

**C.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│              MY TASKS - TASK MANAGEMENT                  │
│  [Filter: All | My Tasks | Assigned to Me | Overdue]  │
│  [Sort: Due Date | Priority | Status]                 │
│  [+Add Task] [View Calendar] [Sort] [Export]          │
└─────────────────────────────────────────────────────────┘

TASK STATUS BOARD:

┌─ TO DO (8 tasks) ─────────────────────────────────────┐
│                                                        │
│ 🔴 HIGH - Discovery call prep for Acme                │
│    Due: TODAY - 10:00 AM (2 hours)                    │
│    Related: Deal - Acme Corp $85K                     │
│    ☐ [Mark Done] [Skip] [Reschedule]                 │
│    Notes: Prepare talking points on ROI              │
│                                                        │
│ 🔴 HIGH - Send security docs to CloudVista            │
│    Due: TODAY - 5:00 PM                               │
│    ☐ [Mark Done] [Skip] [Notes]                      │
│                                                        │
│ 🟡 MED - Follow-up email to GlobalTech                │
│    Due: Tomorrow 9:00 AM                              │
│    Related: Deal - GlobalTech $45K (At Risk)          │
│    ☐ [Mark Done] [Draft Email] [Notes]              │
│    AI Tip: "Coordinate discount approval first"      │
│                                                        │
│ ... 5 more tasks ...                                   │
│                                                        │
│ [+Add Task] [Load More]                               │
│                                                        │
└────────────────────────────────────────────────────────┘

┌─ IN PROGRESS (2 tasks) ───────────────────────────────┐
│                                                        │
│ 🔴 Prepare demo for TechStart                          │
│    Due: 11:00 AM (Demo at 11:30 AM)                  │
│    Progress: ████████░░ 80% Complete                 │
│    ✓ Slide deck prepared                             │
│    ✓ Demo environment verified                       │
│    ☐ Run final walkthrough (pending)                 │
│    [Mark Complete] [Need Help]                       │
│                                                        │
│ 🟡 Review pricing objections                          │
│    Due: 1:30 PM (Call at 2:00 PM)                    │
│    Progress: ██████░░░░ 60% Complete                 │
│    ✓ Reviewed objections list                        │
│    ☐ Prepare rebuttal data (in progress)             │
│    [Mark Complete] [Notes]                           │
│                                                        │
└────────────────────────────────────────────────────────┘

┌─ COMPLETED (12 this week) ────────────────────────────┐
│                                                        │
│ ✓ Sent proposal to Acme Corp - Mar 19                │
│ ✓ Scheduled demo with TechStart - Mar 18             │
│ ✓ Called Quantum Inc - Mar 17                        │
│ ... 9 more completed ...                              │
│ [View All Completed]                                 │
│                                                        │
└────────────────────────────────────────────────────────┘

TASK CREATION:
┌─ NEW TASK ────────────────────────────┐
│ Title: [_________________]             │
│ Description: [_________________]       │
│ Due: [Date] [Time]                     │
│ Priority: [High / Med / Low]           │
│ Related Deal: [Dropdown]               │
│ Related Contact: [Dropdown]            │
│ Remind Me: ☑ 30 mins before           │
│ [Save Task] [Cancel]                  │
└───────────────────────────────────────┘

TASK PERFORMANCE SUMMARY (Bottom):
├─ Tasks Completed This Month: 47 / 50 (94%)
├─ On-Time Completion: 92%
├─ Avg Completion Time: 0.8 days
└─ [View Trends]
```

**C.3 Task Actions**
- Mark tasks complete with checkmark
- Edit task details or reschedule
- Add notes/context to tasks
- Create follow-up tasks from completed items
- Bulk complete multiple tasks

**C.4 Key Query**
```sql
-- Rep's Tasks (All active)
SELECT * FROM tasks
WHERE assigned_to_user_id = ? OR created_by = ?
  AND status != 'completed'
ORDER BY due_date ASC;
```

---

## Section D: SCHEDULER & CALENDAR PAGE

### Route: `/rep/scheduler` or `/rep/calendar`

**D.1 Purpose**
- View personal calendar
- Schedule meetings/calls with prospects
- Check availability for coaching/manager meetings
- Integrate with Outlook/Google Calendar

**D.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│           MY CALENDAR - SCHEDULER                        │
│  [View: Week | Month | Day] [Today]                    │
│  [Calendar: Primary | Coaching | Other]                │
│  [+New Meeting] [Sync Calendar]                        │
└─────────────────────────────────────────────────────────┘

WEEK VIEW (Default):
┌─ Mon 3/20 ─ Tue 3/21 ─ Wed 3/22 ─ Thu 3/23 ─ Fri 3/24 ┐
│                                                         │
│ MON 3/20                                               │
│ 10:00 - [Discovery Call - Acme] (45 mins)            │
│ 11:30 - [Product Demo - TechStart] (60 mins)         │
│ 2:00  - [Follow-up - GlobalTech] (30 mins)           │
│ 3:30  - [Negotiation - DataFlow] (45 mins)           │
│ 5:00  - [Personal Dev Time] (1 hr)                   │
│                                                         │
│ TUE 3/21                                               │
│ 9:00  - [Call Prep] (30 mins)                        │
│ 10:00 - [Customer Demo] (60 mins)                    │
│ 11:30 - [Coaching with Manager] (30 mins)           │
│ 1:00  - [CRM Update Time] (30 mins)                  │
│ 2:30  - [Lunch] (1 hr)                               │
│ 3:30  - [Follow-up calls] (1.5 hrs)                  │
│                                                         │
│ ... more days ...                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘

MONTH VIEW:
[Calendar grid showing all meetings/events for month]
[Color coding: Calls (blue), Coaching (purple), Personal (gray)]

NEW MEETING MODAL:
┌─ SCHEDULE CALL ────────────────────────────────┐
│ Meeting/Call Title: [________________]          │
│ Date: [Date Picker]                            │
│ Start: [Time] - End: [Time]                    │
│ Duration: [45 mins ▼]                         │
│ Contact/Prospect: [Dropdown/Search]           │
│ Related Deal: [Dropdown]                       │
│ Call Type: ◉ Scheduled ○ Follow-up ○ Coaching│
│ Video Link: [Auto-generate Zoom]              │
│ Meeting Materials: [Upload/Attach]            │
│ Send Invite: ☑ to prospect                    │
│ Reminders: [☑ 15 mins] [☑ 1 day]             │
│                                                 │
│ [Schedule] [Cancel]                            │
└────────────────────────────────────────────────┘

CALENDAR ANALYTICS:
├─ Calls Scheduled This Week: 8
├─ Open Time Blocks: 4 hrs
├─ Busiest Day: Mon (4 calls)
└─ [View Availability]
```

**D.3 Calendar Features**
- Drag-drop to reschedule meetings
- View team availability (manager, colleagues)
- One-click Zoom/Teams link generation
- Sync with personal Outlook/Google Calendar
- Set focus time blocks for admin work
- Show available time slots to prospects

---

## Section E: CUSTOMERS & ACCOUNTS PAGE

### Route: `/rep/customers`

**E.1 Purpose** *(Same as Manager, but filtered to rep's own accounts + assigned accounts)*

```
CUSTOMER PAGE FOR REPS:
├─ All my customer/prospect accounts
├─ Sort by: Last Contact, Deal Value, Health Score
├─ View: Grid | List | Map
│
└─ FOR EACH CUSTOMER:
   ├─ Health score & trend
   ├─ Deal pipeline
   ├─ Contact list
   ├─ Engagement history
   └─ Next steps
```

**E.2 Rep-Specific Features**
- "Request manager coaching" on at-risk customers
- "Escalate to manager" button
- Share customer with colleague for collaboration
- Import contacts from LinkedIn
- Access success plans

---

## Section F: DEALS MANAGEMENT PAGE

### Route: `/rep/deals` & `/rep/deal/:id`

**F.1 Purpose** *(Same as Manager, but rep's own deals only)*

```
DEALS PAGE FOR REPS:
├─ List view of my deals (alternative to kanban)
├─ Filter by stage, value, risk status
├─ Quick actions: update stage, add note, follow-up
│
└─ DEAL DETAIL VIEW (/rep/deal/:id):
   ├─ Deal overview
   ├─ Contact info
   ├─ History/timeline
   ├─ Documents/proposals
   ├─ Manager feedback
   └─ Next steps
```

**F.2 Rep Deal Actions**
- Move deal between stages (with confirmation)
- Add deal notes and internal comments
- Upload deal documents (proposals, contracts)
- Set reminders for follow-ups
- Request manager coaching at any stage
- Get AI recommendations for dealing with delays

---

**END OF PART 2A - CORE SHARED PAGES**

---

# EMPLOYEE PANEL - Complete Architecture
## PART 2B: SHARED FEATURE PAGES (COACHING, INSIGHTS, REVENUE, SETTINGS, MORE)

---

## Section G: COACHING PLATFORM

### Route: `/rep/coaching` & `/rep/coaching/:id`

**G.1 Purpose**
- Enroll in team coaching programs
- Review manager coaching feedback
- Track skill development
- Access training materials

**G.2 Page Layout** *(Similar to Manager, but rep enrolls in coaching rather than managing)*

```
┌─────────────────────────────────────────────────────────┐
│       MY COACHING - TEAM DEVELOPMENT PROGRAM            │
│  [Tabs: My Sessions | Skills | Development Plan]      │
└─────────────────────────────────────────────────────────┘

MY COACHING SESSIONS:

┌─ UPCOMING SESSIONS (Scheduled with manager) ────────┐
│                                                      │
│ Tomorrow 2:00 PM - 30 min Coaching Session          │
│ ├─ Manager: Sarah Thompson                          │
│ ├─ Focus: Active Listening & Discovery Questions   │
│ ├─ Prep Materials: [3 recent calls uploaded]        │
│ ├─ [Join Video] [Reschedule] [Cancel]              │
│ └─ AI Tip: "You're showing great improvement in   │
│    this area. Expect positive feedback!"           │
│                                                      │
│ Mar 25, 10:00 AM - 45 min Skills Training           │
│ ├─ Title: "Objection Handling Mastery"             │
│ ├─ Trainer: Sales Trainer (Group session)          │
│ ├─ Attendees: 5 reps                               │
│ ├─ [Join Video] [Details] [Materials Download]    │
│                                                      │
└──────────────────────────────────────────────────────┘

┌─ PAST COACHING SESSIONS ──────────────────────────────┐
│                                                        │
│ Mar 13 - Discovery Questions Coaching                │
│ ├─ Manager: Sarah Thompson (30 mins)                 │
│ ├─ Rating You Gave: ⭐⭐⭐⭐⭐ (5/5 - Excellent)     │
│ ├─ Your Key Takeaway: "Focus on 'why' questions"    │
│ ├─ Session Recording: [Download]                     │
│ ├─ Coaching Notes: [View/Download]                   │
│ │  "Great session! You're asking much deeper questions│
│ │   now. I noticed you increased from 12 to 18      │
│ │   questions average per call. Keep it up!"        │
│ ├─ [Follow-up Exercise] [Practice Mode]             │
│ └─ Impact: +3 questions avg | +8 point score boost  │
│                                                        │
│ Mar 6 - ROI Communication Workshop                   │
│ ├─ Group Training (45 mins)                         │
│ ├─ Completion: ✓ Completed with quiz (95%)         │
│ ├─ Materials: [Slides] [Templates] [Examples]      │
│                                                        │
└────────────────────────────────────────────────────────┘

PERSONAL DEVELOPMENT PLAN:
┌─ YOUR 30-60-90 DAY PLAN ──────────────────────────────┐
│ Goal: Improve Active Listening & Discovery Depth      │
│ Target: Reach top 25% of team in these skills        │
│                                                        │
│ 30 Days (Due: Apr 19): Listen more in calls          │
│ Progress: ✓✓✓░░░ 60% (Target: 40% talk time)        │
│ Current: 42% talk time (↓ from 50%)                  │
│ On track: Yes ✓                                       │
│                                                        │
│ 60 Days (Due: May 19): Master 5 discovery questions  │
│ Progress: ██░░░░ 30% (Take training: Done ✓)        │
│ Exercises Completed: 2/5                             │
│ Next: Complete "Discovery Mastery" module            │
│                                                        │
│ 90 Days (Due: Jun 19): Become team expert            │
│ Progress: ░░░░░░ 0% (Future milestone)              │
│ Next steps: TBD after 60 days                        │
│                                                        │
│ [View Full Plan] [Edit] [Print Plan]                │
│                                                        │
└────────────────────────────────────────────────────────┘

SKILL DEVELOPMENT:
┌─ YOUR SKILL JOURNEY ──────────────────────────────────┐
│                                                        │
│ Discovery Questions: ⭐⭐⭐⭐☆ (4/5)                  │
│ ├─ Score: 94/100 | Trend: ↑ +35%                    │
│ ├─ Your Level: 90th percentile                       │
│ ├─ Resources: [Video Training] [Practice Calls]      │
│ ├─ Coaching Sessions: 2 completed                    │
│ ├─ Next Milestone: 95th percentile                   │
│ └─ [Schedule Coaching]                               │
│                                                        │
│ Objection Handling: ⭐⭐⭐⭐☆ (4/5)                   │
│ ├─ Score: 88/100 | Trend: ↑ +28%                    │
│ ├─ Your Level: 85th percentile                       │
│ ├─ Resources: [Video Training] [Case Studies]        │
│ ├─ Coaching Sessions: 1 completed                    │
│ └─ [Get Coaching]                                    │
│                                                        │
│ Active Listening: ⭐⭐⭐☆☆ (3/5) - Focus Area      │
│ ├─ Score: 72/100 | Trend: ↓ -58%                    │
│ ├─ Your Level: 45th percentile (Needs work)         │
│ ├─ Key Issue: Talk time 52% (should be ~40%)        │
│ ├─ Resources: [Intensive Training] [Practice]       │
│ ├─ [Schedule Coaching] - PRIORITY                    │
│ └─ Expected improvement: 4-week program              │
│                                                        │
│ [View All Skills] [Get Personalized Plan]            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**G.3 Rep Coaching Features**
- View upcoming coaching sessions scheduled by manager
- Submit past calls for coaching review
- Download coaching materials and training videos
- Track progress on skill development
- View personal development plan
- Rate coaching sessions and provide feedback
- Access skill assessment results

---

## Section H: INSIGHTS & ANALYTICS

### Route: `/rep/insights`

**H.1 Purpose**
- Analyze personal call patterns
- Get AI coaching on conversation techniques
- Compare to team benchmarks
- Learn from top performers

**H.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│    MY INSIGHTS - CONVERSATION INTELLIGENCE             │
│  [Time Period: This Month] [Compare: Team Avg]        │
│  [Tabs: Conversations | Topics | Objections | Trends] │
└─────────────────────────────────────────────────────────┘

MY CONVERSATION PATTERNS:

┌─ MY TOP CONVERSATION TOPICS ──────────────────────────┐
│                                                        │
│ Topic          │ Mentions │ My Avg │ Team Avg │ Notes│
│────────────────┼──────────┼────────┼──────────┼──────│
│ ROI/Business   │ 28       │ 3.5/call│ 2.8/call │ ✓  │
│ Implementation │ 18       │ 2.3/call│ 1.9/call │ ✓  │
│ Security       │ 12       │ 1.5/call│ 0.8/call │ ✓  │
│ Pricing        │ 15       │ 1.9/call│ 2.1/call │ okay│
│ Timeline       │ 10       │ 1.3/call│ 1.4/call │ okay│
│                                                        │
│ 💡 Insight: "You focus MORE on ROI and implementation│
│    than average. This is why your close rate is 65%. │
│    Team average is 60%. Keep this balance!"          │
│                                                        │
└────────────────────────────────────────────────────────┘

OBJECTION PATTERN ANALYSIS:
┌─ HOW YOU HANDLE OBJECTIONS ───────────────────────────┐
│                                                        │
│ Objection      │ My Wins │ My Loss │ Team Win % │    │
│────────────────┼─────────┼─────────┼────────────┼────│
│ Price Too High │ 8/12    │ 4/12    │ 62%       │ 67%│
│ Need ROI Proof │ 7/8     │ 1/8     │ 65%       │ 88% │
│ Timeline Issue │ 5/6     │ 1/6     │ 55%       │ 83%│
│ Competitor     │ 6/8     │ 2/8     │ 71%       │ 75%│
│ Budget Approval│ 4/5     │ 1/5     │ 84%       │ 80%│
│                                                        │
│ 📊 Analysis: You're above average on most objections, │
│    especially ROI proof (88% vs team 65%). Great job!│
│                                                        │
│ 💡 Opportunity: "Timeline concerns" - Try proactive  │
│    timeline discussion early to prevent objections.  │
│                                                        │
└────────────────────────────────────────────────────────┘

YOUR CALL SENTIMENT TREND:
┌─ CALL SENTIMENT (Last 8 weeks) ───────────────────────┐
│                                                        │
│ Positive:   ████████████░░ 72% (↑ 3% vs 2 wks ago)  │
│ Neutral:    ██████░░░░░░░░ 18% (→ 0%)                │
│ Negative:   ██░░░░░░░░░░░░ 10% (↓ 3%)                │
│                                                        │
│ Your Positive Close Rate: 68%                        │
│ Team Positive Close Rate: 65%                        │
│                                                        │
│ 💡 Insight: When you have positive calls (72%), your │
│    close rate is 3 points higher than team average.  │
│    Action: Maintain this positive tone!              │
│                                                        │
└────────────────────────────────────────────────────────┘

COMPARISON TO TOP PERFORMERS:
┌─ HOW YOU COMPARE TO TOP PERFORMERS ───────────────────┐
│                                                        │
│ Top Performer: Emily Rodriguez                         │
│ • Her Avg Score: 8.9/10 | Your Avg: 8.4/10          │
│ • Her Close Rate: 68% | Your Close Rate: 65%         │
│ • What she does better:                              │
│   - More follow-up questions (5 more per call)       │
│   - Shorter talk time (35% vs your 42%)              │
│   - More trial closes (3 vs your 2)                  │
│                                                        │
│ 💡 Coaching Suggestion: "Review Emily's calls on     │
│    discovery questions and trial close techniques.   │
│    Book a peer coaching session with her?"           │
│                                                        │
│ [View Emily's Calls] [Request Peer Coaching]         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**H.3 Rep Insights Features**
- View personal conversation patterns
- Get AI coaching on weak areas
- See which topics drive closes
- Learn which objections are hardest
- Compare to team benchmarks
- Identify peers to learn from
- Request peer coaching

---

## Section I: REVENUE & QUOTA TRACKING

### Route: `/rep/revenue`

**I.1 Purpose**
- Track personal revenue attainment
- Monitor quota progress
- See forecast vs target
- Identify at-risk deals

**I.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│        MY REVENUE - QUOTA TRACKING                      │
│  [Period: This Quarter] [Monthly View]                │
│  [Forecast | Closed | Pipeline]                       │
└─────────────────────────────────────────────────────────┘

QUOTA STATUS CARDS:
┌─────────────────┬──────────────┬─────────────────────┐
│ 📊 QUOTA STATUS │ 💰 PIPELINE  │ 📈 FORECAST         │
├─────────────────┼──────────────┼─────────────────────┤
│ $185K / $250K   │ $720K        │ Projected: $260K    │
│ 74% ✓ On Track  │ 7 Open Deals │ vs Target: $250K    │
│ Trend: ↑ +2%    │ Weighted:    │ Confidence: 79%     │
│ vs Last Mo: 71% │ $385K        │ Status: ON TRACK ✓  │
│ [View Details]  │ [View Deals] │ [Detailed Forecast] │
└─────────────────┴──────────────┴─────────────────────┘

REP'S REVENUE BREAKDOWN:
┌─ REVENUE CLOSED THIS MONTH ───────────────────────────┐
│                                                        │
│ Total Closed: $185K                                   │
│ vs Monthly Target: $250K (74%)                        │
│ Collections Expected through end of month: $75K      │
│ Projected Month Total: $260K (+4% vs target) ✓       │
│                                                        │
│ CLOSED DEALS (YTD):                                   │
│ • CloudVista - $125K (Mar 18)                        │
│ • Quantum Systems - $110K (Mar 10)                   │
│ • DataFlow Pilot - $35K (Mar 5)                      │
│ • RollingDown API - $25K (Feb 28)                    │
│ • ... 6 more deals YTD ...                           │
│                                                        │
└────────────────────────────────────────────────────────┘

PIPELINE FORECAST:
┌─ EXPECTED CLOSES (Next 30 days) ──────────────────────┐
│                                                        │
│ Deal Name         │ Value  │ Stage │ Close Date │ Prob│
│───────────────────┼────────┼───────┼────────────┼─────│
│ DataFlow Contract │ $210K  │ Negot │ Mar 20     │ 85% │
│ GlobalTech Prop   │ $45K   │ Prop  │ Mar 25     │ 50% │
│ Acme Next Phase   │ $75K   │ Demo  │ Apr 5      │ 60% │
│ ... more deals ... │ ...    │ ...   │ ...        │ ... │
│                                                        │
│ IF ALL CLOSE: $330K (✓ $80K over target)             │
│ WEIGHTED (by probability): $185K expected             │
│                                                        │
│ ⚠️ At-Risk Deals: GlobalTech ($45K) - Pricing       │
│ 💡 Opportunity: TechStart expansion ($125K potential)│
│                                                        │
└────────────────────────────────────────────────────────┘

WEEKLY/MONTHLY TREND:
┌─ REVENUE TREND (Last 12 weeks) ───────────────────────┐
│                                                        │
│ Week 1: $28K | Week 5: $45K  | Week 9:  $62K        │
│ Week 2: $35K | Week 6: $52K  | Week 10: $58K        │
│ Week 3: $41K | Week 7: $48K  | Week 11: $65K ← Now  │
│ Week 4: $38K | Week 8: $55K  | Week 12: (forecast)  │
│                                                        │
│ Trend: Strong month, heading to exceed target ✓      │
│                                                        │
└────────────────────────────────────────────────────────┘

COMPARISON TO TEAM:
├─ Your Revenue YTD: $185K
├─ Team Avg YTD: $170K
├─ Your Rank: #3 out of 9 reps (↑ from #5 last month)
└─ [View Full Leaderboard]
```

**I.3 Rep Revenue Features**
- Track personal quota vs actuals
- See forecasted vs closed revenue
- Monitor top deals approaching close
- Get alerts on at-risk deals
- Compare to team performance
- View historical quota attainment
- Access commission/incentive info

---

## Section J: SETTINGS & ACCOUNT PREFERENCES

### Route: `/rep/settings`

**J.1 Purpose**
- Manage personal preferences
- Configure notifications
- Sync personal calendar
- View performance data

**J.2 Rep Settings Tabs**

```
┌─ ACCOUNT TAB ─────────────────────────────────────────┐
│ Profile name, email, title                           │
│ Manager: Sarah Thompson                              │
│ Team: Enterprise Sales Team                          │
│ Territory: West Region                               │
│ [Edit Profile] [Change Password] [2-FA Settings]     │
└───────────────────────────────────────────────────────┘

┌─ NOTIFICATIONS & ALERTS ─────────────────────────────┐
│ ☑ Email notifications enabled                        │
│ ☑ In-app notifications enabled                       │
│ ☑ Push mobile notifications                          │
│                                                       │
│ ALERT PREFERENCES:                                    │
│ ☑ Deal at risk (immediate)                          │
│ ☑ Call score results (within 1 hour)                │
│ ☑ Manager feedback (immediate)                       │
│ ☑ Coaching session reminders (15 mins before)       │
│ ☑ Task overdue alerts (1 hour after due)            │
│ ☑ Following up needed (end of day)                   │
│                                                       │
│ Email Digest: ◉ Daily ○ Weekly ○ Never             │
│ Time: [9:00 AM ▼]                                   │
│                                                       │
│ [Save]                                                │
└───────────────────────────────────────────────────────┘

┌─ CALENDAR & INTEGRATIONS ──────────────────────────────┐
│ Connected Calendar: Microsoft Outlook                  │
│ Auto-sync: ☑ Enabled                                  │
│ Last Sync: 10 minutes ago                             │
│ Sync Meetings: ☑ Calls ☑ Coaching ☑ Reminders      │
│ [Disconnect] [Sync Now]                              │
│                                                        │
│ Video Call Platform: Zoom                             │
│ Auto-generate meeting links: ☑ Enabled               │
│ [Configure Zoom] [Test Connection]                    │
│                                                        │
│ CRM Integration: Salesforce                           │
│ Auto-sync deal updates: ☑ Enabled                    │
│ [Configure Salesforce]                               │
│                                                        │
│ [+Add Integration]                                    │
│                                                        │
└───────────────────────────────────────────────────────┘

┌─ PERFORMANCE & COACHING ──────────────────────────────┐
│ Manager Visibility: [Can see all my calls] ☑         │
│ Coaching Visibility: [Allow peer to see my calls]    │
│ Data Sharing: Allow team learning from my calls      │
│                                                        │
│ Career Development:                                   │
│ □ Open to coaching from top performers               │
│ ☑ Interested in team lead opportunities              │
│ ☑ Want monthly 1:1 coaching sessions                │
│                                                        │
│ [Save]                                                │
│                                                        │
└───────────────────────────────────────────────────────┘
```

---

## Section K: AI FEATURES & AUTOMATION

### Route: `/rep/ai`

**K.1 Purpose**
- Access AI coaching recommendations
- Get call preparation tips
- Get post-call suggestions
- Learn from AI insights

**K.2 AI Features for Reps**

```
┌─────────────────────────────────────────────────────────┐
│      MY AI COACH - REAL-TIME SUGGESTIONS              │
│  [Feature: Pre-Call | Post-Call | General Tips]      │
└─────────────────────────────────────────────────────────┘

PRE-CALL COACHING TAB:
┌─ BEFORE YOUR CALL WITH ACME CORP ─────────────────────┐
│                                                        │
│ CALL DETAILS:                                         │
│ Contact: Sarah Johnson, CFO | Company: Acme Corp     │
│ Deal Value: $85K | Call Type: Discovery              │
│ Deal Stage: Discovery | Call In: 2 hours             │
│                                                        │
│ AI RECOMMENDATIONS:                                   │
│                                                        │
│ ✓ FOCUS AREAS (Suggested by AI):                      │
│   1. Budget confirmation (high priority)             │
│   2. Timeline needs                                   │
│   3. Executive team involvement                      │
│                                                        │
│ ✓ DISCOVER QUESTIONS TO ASK:                          │
│   1. "What does success look like in 90 days?"      │
│   2. "Who else is involved in this decision?"        │
│   3. "What's your current solution costing you?"    │
│                                                        │
│ ✓ KEY TALKING POINTS:                                │
│   • ROI for financial services industry              │
│   • Security compliance solutions                    │
│   • Implementation timeline (2 weeks)                │
│   • Reference customer: Similar industry             │
│                                                        │
│ ✓ MATERIALS TO PREPARE:                              │
│   ✓ [ROI calculator] - Acme-sized customer          │
│   ✓ [Case study] - Financial Services industry      │
│   ☐ [Technical FAQ] - security & compliance          │
│   ☐ [Pricing tiers] - overview doc                   │
│                                                        │
│ ✓ WHAT TO AVOID:                                      │
│   • Don't mention competitor (stay positive)         │
│   • Don't overwhelm with features early              │
│   • Ask about budget early (be direct)               │
│                                                        │
│ 📊 SIMILAR DEALS AI ANALYZED:                         │
│   • This contact type closes 68% with CFO focus     │
│   • Budget discovery increases close rate by 12%    │
│                                                        │
│ [Practice Call] [Launch Prep Mode] [Get Coaching]   │
│                                                        │
└────────────────────────────────────────────────────────┘

POST-CALL COACHING TAB:
┌─ YOUR CALL WITH DATAFLOW - AI ANALYSIS ─────────────┐
│ (See CALL DETAILS section for full AI coaching)     │
│                                                      │
│ QUICK SUMMARY:                                       │
│ ✓ Excellent call! 92/100 score                      │
│ ✓ Great ROI and timeline focus                      │
│ ✓ Strong trial close technique                      │
│ → Next: Send contract within 24 hours              │
│                                                      │
│ [View Full Coaching] [Share with Manager]          │
│ [Get Practice Recommendations] [Schedule Coaching] │
│                                                      │
└──────────────────────────────────────────────────────┘

PRACTICE MODE:
┌─ PRACTICE YOUR SKILLS ────────────────────────────────┐
│ AI-powered call simulation to practice skills        │
│                                                       │
│ 1. Choose Scenario:                                  │
│    [Discovery Call] [Demo] [Objection Handling]     │
│    [Closing] [Negotiation]                          │
│                                                       │
│ 2. AI asks you questions as prospect                │
│ 3. AI scores your responses in real-time            │
│ 4. Get feedback and tips                            │
│ 5. Practice again to improve                        │
│                                                       │
│ [Start Practice Session]                            │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

**END OF PART 2 - SHARED PAGES FOR EMPLOYEE PANEL**

---

## Document Metadata
- Total Pages in Part 2: 11 (all shared pages from Meetings to AI)
- Total Sections: 11 (A-K)
- UI Layouts: 15+
- Key Features: 50+
- Estimated Dev Time: 80-120 hours

---

**Continuation:** PART 3 will cover remaining shared pages (Activities, Trackers, ComposeEmail) + Component Library + Integration guide
