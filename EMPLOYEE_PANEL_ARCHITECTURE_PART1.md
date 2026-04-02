# Employee Panel - Complete Architecture
## PART 1: REP-SPECIFIC PAGES & PERSONAL DASHBOARD

---

# TABLE OF CONTENTS

## Quick Navigation
- [Employee Dashboard (Home)](#section-1-employee-dashboard)
- [My Pipeline & Deals](#section-2-my-pipeline--deals-page)
- [My Performance & Metrics](#section-3-my-performance-analytics-page)
- [Call Details & Review](#section-4-call-details--coaching-feedback-page)
- [Database & Queries](#section-5-employee-specific-database-reference)

---

## EXECUTIVE OVERVIEW

This PART 1 documents **4 core Employee (Rep) specific pages**, providing:
- Personal sales dashboard with daily agenda
- Individual pipeline & deal management
- Personal performance metrics & AI coaching
- Call recording review with AI analysis

---

## SECTION 1: EMPLOYEE DASHBOARD

### Route: `/rep/dashboard` or `/rep` (default)

**1.1 Purpose**
- Rep's personal home/dashboard
- View today's agenda and upcoming meetings
- Track daily tasks and priorities
- Quick access to deals & calls
- Personal performance snapshot

**1.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│           YOUR SALES DASHBOARD - ALEX RIVERA             │
│  [Today: Tuesday, March 20, 2026] [Date Picker]        │
│  [Quick Stats] [Notifications: 3] [Help]               │
└─────────────────────────────────────────────────────────┘

TOP PERFORMANCE CARDS (Row 1):
┌────────────────────┬────────────────────┬──────────────┐
│ 📊 QUOTA STATUS    │ 📞 CALLS TODAY     │ 💰 PIPELINE  │
├────────────────────┼────────────────────┼──────────────┤
│ $185K / $250K      │ 3 Completed        │ $720K        │
│ 74% ✓ On Track     │ 2 Scheduled        │ 7 Open Deals │
│                    │ Avg Score: 8.5/10  │ in My Name   │
│ vs Target: $200K   │ All Positive ✓     │              │
│ [View Forecast]    │ [View Calls]       │ [View Deals] │
└────────────────────┴────────────────────┴──────────────┘

TODAY'S AGENDA (Main Content):
┌─ MEETINGS & CALLS TODAY ────────────────────────────┐
│ [Search] [Filter] [Sort: Time | Priority | Deal]  │
│                                                     │
│ 10:00 AM - DISCOVERY CALL (In 2 hours)            │
│ ├─ Company: Acme Corp                             │
│ ├─ Contact: Sarah Johnson, CFO                    │
│ ├─ Deal Value: $85K                               │
│ ├─ Priority: 🔴 HIGH                              │
│ ├─ Duration: 45 mins                              │
│ ├─ Focus Areas: [Budget confirmation] [Timeline] │
│ ├─ [Join Call] [Call Notes] [Deal Page]           │
│ └─ Last Activity: Email sent yesterday            │
│                                                     │
│ 11:30 AM - PRODUCT DEMO (In 3.5 hours)            │
│ ├─ Company: TechStart Inc                         │
│ ├─ Contact: Michael Chen, VP Eng                  │
│ ├─ Deal Value: $125K                              │
│ ├─ Priority: 🟡 MEDIUM                            │
│ ├─ Duration: 60 mins                              │
│ ├─ Focus Areas: [Technical architecture] [APIs]  │
│ ├─ Materials: [Slide deck ready] [Demo env ready]│
│ ├─ [Join Call] [Call Notes] [Deal Page]           │
│ └─ AI Tip: "3 technical stakeholders joining"     │
│                                                     │
│ 2:00 PM - FOLLOW-UP SYNC (In 8 hours)             │
│ ├─ Company: GlobalTech Systems                    │
│ ├─ Contact: Emma Davis, Director Sales            │
│ ├─ Deal Value: $45K                               │
│ ├─ Priority: 🔴 HIGH (Pricing concern)            │
│ ├─ Duration: 30 mins                              │
│ ├─ Focus: [Address pricing] [Competitor compare] │
│ ├─ Materials: [ROI calculator] [Case study]       │
│ ├─ [Join Call] [Call Notes] [Deal Page]           │
│ └─ Status: At Risk ⚠️                             │
│                                                     │
│ 3:30 PM - NEGOTIATION CALL (In 9.5 hours)         │
│ ├─ Company: DataFlow Solutions                    │
│ ├─ Contact: James Wilson, CTO                     │
│ ├─ Deal Value: $210K                              │
│ ├─ Priority: 🟢 GREEN (Ready to close)            │
│ ├─ Duration: 45 mins                              │
│ ├─ Focus Areas: [Contract terms] [Implementation]│
│ ├─ [Join Call] [Call Notes] [Deal Page]           │
│ └─ AI Insight: "85% probability - push for close" │
│                                                     │
└─────────────────────────────────────────────────────┘

TODAY'S TASKS (Sidebar):
┌─ TO DO (5 tasks) ──────────────────────────────────┐
│                                                     │
│ 🔴 HIGH - Send security docs to CloudVista        │
│    Due: 5:00 PM Today                              │
│    ☐ [Complete] [Reschedule] [Details]            │
│                                                     │
│ 🔴 HIGH - Prepare demo environment for TechStart  │
│    Due: 11:00 AM (before demo)                     │
│    ☑ [Complete] [Details]                        │
│                                                     │
│ 🟡 MED - Review pricing objections from GlobalTech │
│    Due: 1:30 PM (before call)                      │
│    ☐ [Complete] [Reschedule] [Details]            │
│                                                     │
│ 🟡 MED - Follow-up email to DataFlow               │
│    Due: End of day (5 PM)                          │
│    ☐ [Complete] [Reschedule] [Details]            │
│                                                     │
│ 🟢 LOW - Update deal statuses in CRM               │
│    Due: Tomorrow                                    │
│    ☐ [Complete] [Details]                         │
│                                                     │
│ [+Add Task] [View All Tasks] [Calendar]            │
│                                                     │
└─────────────────────────────────────────────────────┘

CALL QUALITY INSIGHT (Today):
┌─ YOUR CALLS TODAY ─────────────────────────────────┐
│                                                     │
│ Completed: 3 calls                                  │
│ • Call 1 (10:15 AM): CloudVista - Score: 87/100  │
│   Sentiment: Positive ✓                            │
│   Duration: 14:22 | Talk Ratio: 42% (Great!)      │
│   Topics: Integration, Timeline, Pricing           │
│   Outcome: Proposal stage - Next: Send proposal    │
│                                                     │
│ • Call 2 (12:45 PM): DataFlow - Score: 92/100    │
│   Sentiment: Very Positive ✓✓                      │
│   Duration: 18:56 | Talk Ratio: 38% (Excellent)  │
│   Topics: Implementation, ROI, Timeline            │
│   Outcome: Ready for close - Next: Send contract   │
│                                                     │
│ • Call 3 (3:20 PM): Quantum Inc - Score: 78/100  │
│   Sentiment: Neutral                               │
│   Duration: 9:12 | Talk Ratio: 52% (↑ Talk more) │
│   Topics: Security, Cost, Features                 │
│   AI Recommendation: "Listen more, ask more Qs"   │
│   Outcome: Demo needed - Next: Send proposal       │
│                                                     │
│ [View All Calls] [Get AI Coaching] [Download All] │
│                                                     │
└─────────────────────────────────────────────────────┘

QUICK WINS & REMINDERS:
┌─ AI COACHING ALERTS (Real-time) ──────────────────┐
│                                                     │
│ 💡 Tip: "You're crushing it! 3/3 calls with      │
│    positive sentiment. Keep using the ROI          │
│    approach before discussing price."              │
│                                                     │
│ ⚠️  Alert: GlobalTech showing low engagement.      │
│    Suggest: Personalized video message before      │
│    today's 2 PM call to re-engage sponsor.        │
│                                                     │
│ ✅ Opportunity: TechStart demo at 11:30 AM.       │
│    AI analyzed: 3 technical stakeholders + CFO.    │
│    Prep: [Slide deck] ✓ [Code samples] ✓          │
│    [Launch Practice Mode]                          │
│                                                     │
│ [Dismiss] [Get Coaching]                           │
│                                                     │
└─────────────────────────────────────────────────────┘

BOTTOM STATS (Dashboard Footer):
├─ Week Performance: 42 calls | Avg Score: 8.5/10
├─ Month-to-Date: $185K closed (74% of quota)
├─ Pipeline This Month: $720K (7 deals)
├─ Close Rate: 65% (vs team avg: 60%)
└─ [View Weekly Report] [View Monthly Report]
```

**1.3 Data Model**

```
REP_PERFORMANCE_METRICS (Daily):
├─ user_id (FK)
├─ date
├─ quota_target
├─ revenue_closed_today
├─ meetings_today
├─ calls_today
├─ avg_call_score
├─ overall_sentiment
└─ calls_vs_target

TODAY_ACTIVITIES:
├─ scheduled_meetings (array)
├─ scheduled_calls (array)
├─ today_tasks (array)
├─ today_completed_calls (array)
└─ ai_coaching_alerts (array)

EACH MEETING/CALL:
├─ id
├─ time
├─ duration
├─ company
├─ contact_name
├─ deal_id
├─ deal_value
├─ priority (high/medium/low)
├─ focus_areas (array)
├─ status (scheduled/in-progress/completed)
└─ materials (array of resources)
```

**1.4 Key Queries**

```sql
-- Today's Schedule for Rep
SELECT m.id, m.scheduled_start_time, m.scheduled_end_time,
       c.company_name, c.contact_name, c.title,
       d.deal_name, d.deal_value, m.status
FROM meetings m
LEFT JOIN contacts c ON m.contact_id = c.id
LEFT JOIN deals d ON m.deal_id = d.id
WHERE m.user_id = ? 
  AND DATE(m.scheduled_start_time) = CURRENT_DATE
ORDER BY m.scheduled_start_time ASC;

-- Rep's Daily Stats
SELECT 
  COUNT(*) as total_calls,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_calls,
  ROUND(AVG(engagement_score))::int as avg_score,
  call_sentiment as sentiment
FROM meetings
WHERE user_id = ? 
  AND DATE(scheduled_start_time) = CURRENT_DATE
GROUP BY call_sentiment;

-- Rep's Quota Progress
SELECT 
  (SELECT quota FROM team_targets WHERE user_id = ?) as target,
  SUM(deal_amount) as closed_revenue,
  COUNT(DISTINCT deal_id) as deals_closed
FROM deals
WHERE user_id = ? 
  AND status = 'closed_won'
  AND EXTRACT(MONTH FROM close_date) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM close_date) = EXTRACT(YEAR FROM CURRENT_DATE);
```

---

## SECTION 2: MY PIPELINE & DEALS PAGE

### Route: `/rep/pipeline`

**2.1 Purpose**
- View my personal pipeline
- Manage individual deals in kanban view
- Track deal progress by stage
- Forecast closes and identify at-risk deals

**2.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│         MY PIPELINE - KANBAN VIEW (5 STAGES)            │
│  [Filter: All | At Risk | Push to sell] [View: List]  │
│  [Grouping: Stage] [Pipeline Value: $720K]            │
│  [+New Deal] [Import] [Export]                        │
└─────────────────────────────────────────────────────────┘

KANBAN BOARD (5 Columns):

┌─ DISCOVERY (3 deals / $255K) ──┬─ DEMO (2 deals / $210K) ──┬─ PROPOSAL (1 deal / $210K)
│                                 │                            │
│ ┌─ DEAL CARD ────────────────┐ │ ┌─ DEAL CARD ──────────┐  │ ┌─ DEAL CARD ───────┐
│ │ TechStart - $125K          │ │ │ TechStart - $125K    │  │ │ CloudScale - $210K │
│ │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ │ │ ...continuation    │  │ │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  │
│ │ Contact: Michael Chen      │ │ │                      │  │ │ Contact: VP Sales │
│ │ Close Date: Mar 28, 2026   │ │ │ Demo Status: Booked │  │ │ Close Date: Mar 15│
│ │ Probability: 70%           │ │ │ & Sent Materials    │  │ │ Probability: 50%  │
│ │ Last Activity: 4h ago      │ │ │                      │  │ │ Status: At Risk ⚠️ │
│ │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ │ │ Last Activity:      │  │ │                   │
│ │ Score: 89/100 ✓            │ │ │ Sent proposal attach │  │ │ Tech objection    │
│ │ Engagement: High ✓         │ │ │ & needs CFO approval │  │ │ detected with CFO │
│ │ Next Step: Executive brief │ │ │                      │  │ │                   │
│ │ [View] [Edit] [Close]      │ │ │ [View] [Edit]        │  │ │ [View] [Edit]     │
│ └────────────────────────────┘ │ └──────────────────────┘  │ │ [Reschedule]      │
│                                 │                            │ └───────────────────┘
│ ┌─ DEAL CARD ────────────────┐ │ ┌─ DEAL CARD ──────────┐  │
│ │ Acme Corp - $85K           │ │ │ Nexus Digital - $85K │  │
│ │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ │ │ ...                 │  │
│ │ Contact: Sarah Johnson     │ │ │                      │  │
│ │ Close Date: Mar 22, 2026   │ │ │ Demo Status: Pending│  │
│ │ Probability: 60%           │ │ │ scheduling          │  │
│ │ Last Activity: 1 day ago   │ │ │                      │  │
│ │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ │ │ [View] [Schedule]   │  │
│ │ Score: 82/100 ✓            │ │ │ [Follow-up]          │  │
│ │ Budget: Confirmed          │ │ └──────────────────────┘  │
│ │ Next Step: Tech deep dive  │ │                            │
│ │ [View] [Edit] [Move]       │ │                            │
│ └────────────────────────────┘ │                            │
│                                 │                            │
│ ┌─ DEAL CARD ────────────────┐ │                            │
│ │ DataFlow - $45K            │ │                            │
│ │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ │                            │
│ │ Contact: Emma Davis        │ │                            │
│ │ Close Date: Mar 20, 2026   │ │                            │
│ │ Probability: 50%           │ │                            │
│ │ ⚠️ OVERDUE - Follow up now  │ │                            │
│ │ Status: In Negotiation     │ │                            │
│ │ [View] [Move] [Follow-up]  │ │                            │
│ └────────────────────────────┘ │                            │
│ [+Add Deal]                    │ [+Add Deal]                │ [+Add Deal]
└────────────────────────────────┴────────────────────────────┴─────────────────

─ NEGOTIATION (1 deal / $45K) ──┬─ CLOSED WON (4 deals / $498K) ─┐
                                 │                                │
                                 │ ┌─ DEAL CARD ──────────────┐  │
                                 │ │ Quantum Sys - $125K      │  │
                                 │ │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  │  │
                                 │ │ Closed: Mar 18, 2026     │  │
                                 │ │ Closed Revenue: ✓ $125K │  │
                                 │ │ Implementation Stage: D │  │
                                 │ │ [View] [Upsell]          │  │
                                 │ └──────────────────────────┘  │
                                 │                                │
                                 │ ┌─ DEAL CARD ──────────────┐  │
                                 │ │ ... 3 more closed deals   │  │
                                 │ └──────────────────────────┘  │
                                 │                                │
                                 │ [+Add (Manual)]                │
                                 └────────────────────────────────┘

PIPELINE ANALYTICS:
├─ Total Pipeline: $720K (7 deals)
├─ Weighted Pipeline: $385K (probability-adjusted)
├─ Forecast (This Month): $210K (+ $45K = $255K)
├─ vs Monthly Target: $250K ✓ On Track
├─ Deals at Risk: 1 (GlobalTech) - Action needed
└─ [View Forecast] [What-if Analysis]
```

**2.3 Drag & Drop Functionality**
- Drag deals between stages
- Confirm stage move with modal
- Update close probability automatically
- Trigger alerts for overdue stages

**2.4 Deal Card Detail**

```
ON HOVER OR CLICK - DEAL DETAIL PANEL:
┌─ GlobalTech - $45K Deal ───────────────┐
│ Last Updated: 2 hours ago              │
│                                        │
│ DEAL METRICS:                          │
│ ├─ Value: $45,000                      │
│ ├─ Probability: 50%                    │
│ ├─ Expected Close: Mar 20, 2026        │
│ ├─ Days in Current Stage: 5            │
│ ├─ Avg Days in Stage: 4 (↑ 1 day slow) │
│ └─ Status: ⚠️ At Risk                  │
│                                        │
│ ACTIVITIES:                            │
│ ├─ 3 days ago: Call with Emma Davis   │
│ ├─ 2 days ago: Email objection analysis│
│ └─ [Show More...]                      │
│                                        │
│ RISKS:                                 │
│ ├─ Pricing concern detected in call   │
│ ├─ No response for 2 days              │
│ ├─ Competitor mention in last email    │
│ └─ AI Recommendation: Escalate to CFO │
│                                        │
│ [Schedule Call] [Send Email] [Move]   │
│ [Close] [Mark Lost]                   │
└────────────────────────────────────────┘
```

**2.5 Key Queries**

```sql
-- My Pipeline (All Open Deals)
SELECT d.id, d.deal_name, d.deal_value, d.stage, d.expected_close_date,
       d.probability, d.status, c.contact_name, c.company_name,
       (CURRENT_DATE - d.last_activity_date) as days_since_activity
FROM deals d
LEFT JOIN contacts c ON d.contact_id = c.id
WHERE d.user_id = ? AND d.status != 'closed_lost'
ORDER BY d.expected_close_date ASC;

-- Pipeline by Stage Distribution
SELECT stage, COUNT(*) as deal_count, SUM(deal_value) as total_value
FROM deals
WHERE user_id = ? AND status != 'closed_lost'
GROUP BY stage
ORDER BY CASE stage 
  WHEN 'discovery' THEN 1
  WHEN 'demo' THEN 2
  WHEN 'proposal' THEN 3
  WHEN 'negotiation' THEN 4
  ELSE 5 END;
```

---

## SECTION 3: MY PERFORMANCE & ANALYTICS PAGE

### Route: `/rep/performance`

**3.1 Purpose**
- View individual performance metrics
- Track call quality and improvement
- Review skills breakdown with trends
- Compare to team averages

**3.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│       MY PERFORMANCE - ALEX RIVERA                       │
│  [Period: This Month] [Compare: Team Avg] [Trends]    │
│  [Tabs: Overview | Skills | Calls | Trends]           │
└─────────────────────────────────────────────────────────┘

OVERVIEW TAB - KEY METRICS:

TOP PERFORMANCE CARDS (Row 1):
┌───────────────────┬───────────────────┬───────────────┐
│ 🎯 QUOTA STATUS   │ 📞 CALL AI SCORE  │ 💬 ENGAGEMENT│
├───────────────────┼───────────────────┼───────────────┤
│ $185K / $250K     │ 8.4 / 10          │ 92 / 100      │
│ 74% ✓             │ ↑ +0.3 vs last mo │ ↑ +5 vs mo ago│
│ Mon-to-date goal  │ vs Team Avg: 8.0  │ vs Team: 87   │
│ [Forecast: $240K] │ (Top 20%)         │ (Top 15%)     │
│ [View Forecast]   │ [View Calls]      │ [View Reports]│
└───────────────────┴───────────────────┴───────────────┘

SECONDARY METRICS (Row 2):
┌───────────────────┬────────────────┬───────────────────┐
│ 📊 CLOSING RATE   │ 📈 TRENDING    │ ⏱️ TALK RATIO    │
├───────────────────┼────────────────┼───────────────────┤
│ 65% (This Month)  │ ↑ +8% vs last  │ 42% (Ideal: 40%) │
│ vs Team: 60%      │ +12% vs Q4     │ ↑ Improving ✓   │
│ ↑ TOP PERFORMER   │ Momentum: High │ vs Team Avg: 45% │
│ [View Details]    │ [What's Working]│ [Coaching Tips]  │
└───────────────────┴────────────────┴───────────────────┘

SKILLS BREAKDOWN TAB:

┌─ YOUR TOP 5 SKILLS ────────────────────────────────────┐
│                                                        │
│ Skill 1: Discovery Questioning - 94 / 100            │
│ ├─ Trend: ↑ +35% (Excellent improvement!)            │
│ ├─ Description: Asking more open-ended Qs early      │
│ ├─ Impact: +22% longer prospect talk time            │
│ ├─ Recommendation: "Keep this up! It's driving       │
│ │  strong engagement & discovery insights."          │
│ └─ [Practice] [View Example Calls]                    │
│                                                        │
│ Skill 2: Objection Handling - 88 / 100               │
│ ├─ Trend: ↑ +28% (Great progress!)                   │
│ ├─ Technique: Anchoring with ROI data before price  │
│ ├─ Impact: -28% pricing pushback                     │
│ ├─ Recommendation: "Excellent. Continue ROI anchor   │
│ │  strategy in pricing discussions."                 │
│ └─ [Practice] [View Example Calls]                    │
│                                                        │
│ Skill 3: Active Listening - 72 / 100                 │
│ ├─ Trend: ↓ -58% below ideal (Needs attention!)      │
│ ├─ Issue: Your talk time is 58% vs recommended 42%  │
│ ├─ Impact: Missing prospect pain points             │
│ ├─ Recommendation: "Focus on questions & listening. │
│ │  Aim for 40% talk time. Use pause technique."     │
│ ├─ AI Coach Suggestion: "Practice these 3 question  │
│ │  types more: open-ended, follow-up, clarifying"  │
│ └─ [Practice] [Training Materials] [View Calls]      │
│                                                        │
│ Skill 4: Value Communication - 85 / 100             │
│ ├─ Trend: → Stable (Consistent high performance)     │
│ ├─ Strength: Articulating product value & ROI       │
│ ├─ Improvement Idea: Use more customer success       │
│ │  stories to relate to prospect situations          │
│ └─ [View Example Calls] [Story Library]              │
│                                                        │
│ Skill 5: Closing Technique - 92 / 100               │
│ ├─ Trend: ↑ +18% (Excellent!)                       │
│ ├─ Strength: Trial closes early & trial closes eom  │
│ ├─ Win Rate with your closing: 72% (vs avg: 60%)   │
│ └─ [View Example Calls]                              │
│                                                        │
│ [View All Skills] [Get Coaching] [Practice Mode]     │
│                                                        │
└────────────────────────────────────────────────────────┘

WEEKLY TREND CHART:
┌─ PERFORMANCE TREND (Last 8 Weeks) ───────────────────┐
│                                                      │
│ Line Chart showing:                                  │
│ 1. AI Call Score trend (8.1 → 8.2 → 8.2 → 8.4 ✓)  │
│ 2. Calls per week (8 → 10 → 12 → 12)              │
│ 3. Calls completed on time (95% → 96% → 98% ✓)    │
│                                                      │
│ 📊 Key Insight: "Great momentum! Your scores are   │
│    improving while keeping call volume high."       │
│                                                      │
│ [Export Chart] [Email Report]                       │
│                                                      │
└──────────────────────────────────────────────────────┘

RECENT CALL SCORES:
┌─ LAST 5 CALLS ───────────────────────────────────────┐
│                                                      │
│ 1. CloudVista - 87/100 ✓ (Today 10:15 AM)         │
│    Sentiment: Positive | Talk Ratio: 42%           │
│    Topics: Integration, pricing, timeline           │
│                                                      │
│ 2. DataFlow - 92/100 ✓✓ (Today 12:45 PM)          │
│    Sentiment: Very Positive | Talk Ratio: 38%      │
│    Topics: Implementation, ROI, contract            │
│                                                      │
│ 3. Quantum Inc - 78/100 (Today 3:20 PM)            │
│    Sentiment: Neutral | Talk Ratio: 52%            │
│    AI Tip: "Listen more next time"                 │
│                                                      │
│ 4. Acme Corp - 85/100 ✓ (Yesterday 2 PM)           │
│    Sentiment: Positive | Talk Ratio: 44%           │
│                                                      │
│ 5. TechStart - 88/100 ✓ (Yesterday 4 PM)           │
│    Sentiment: Positive | Talk Ratio: 40%           │
│                                                      │
│ [View All Calls] [Get Coaching] [Get Insights]     │
│                                                      │
└──────────────────────────────────────────────────────┘

COMPARISON TO TEAM:
┌─ HOW YOU COMPARE TO YOUR TEAM ───────────────────────┐
│                                                      │
│ Metric           │ Your Score │ Team Avg │ Rank    │
│ ──────────────────┼────────────┼──────────┼─────────│
│ AI Call Score    │ 8.4        │ 8.0      │ Top 20% │
│ Close Rate       │ 65%        │ 60%      │ Top 15% │
│ Engagement Score │ 92         │ 87       │ Top 25% │
│ Talk Ratio       │ 42%        │ 45%      │ Top 30% │
│ Action Items     │ 85%        │ 78%      │ Top 20% │
│                                                      │
│ Overall: ⭐ Top Performer (Top 20% of team)        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**3.3 Key Queries**

```sql
-- Rep Performance Metrics (This Month)
SELECT 
  u.full_name,
  SUM(CASE WHEN d.status = 'closed_won' THEN d.deal_value ELSE 0 END) as revenue_closed,
  COUNT(CASE WHEN d.status = 'closed_won' THEN 1 END) as deals_closed,
  COUNT(CASE WHEN d.status = 'closed_lost' THEN 1 END) as deals_lost,
  ROUND(AVG(m.engagement_score))::int as avg_engagement,
  ROUND(AVG(m.engagement_score))::int as avg_call_score
FROM users u
LEFT JOIN deals d ON u.id = d.user_id
LEFT JOIN meetings m ON u.id = m.user_id
WHERE u.id = ? 
  AND EXTRACT(MONTH FROM d.close_date) = EXTRACT(MONTH FROM CURRENT_DATE)
GROUP BY u.id, u.full_name;

-- Skill Metrics Over Time
SELECT skill_name, score, trend, week_ending
FROM rep_skill_assessments
WHERE user_id = ?
ORDER BY week_ending DESC
LIMIT 8;
```

---

## SECTION 4: CALL DETAILS & COACHING FEEDBACK PAGE

### Route: `/rep/activity/:id`

**4.1 Purpose**
- Review individual call recordings
- Get AI coaching recommendations
- Compare performance metrics to benchmarks
- Share feedback from manager

**4.2 Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│          CALL REVIEW - DATAFLOW SOLUTIONS               │
│  Call Date: March 20, 2026 | Duration: 18:56 mins    │
│  [Back to Calls] [Share with Manager] [Export]        │
└─────────────────────────────────────────────────────────┘

CALL HEADER:
┌────────────────────────────────────────────────────────┐
│ Contact: James Wilson, CTO                             │
│ Company: DataFlow Solutions (API Platform Vendor)      │
│ Deal: Enterprise License - $210K (Ready to close)      │
│ Sentiment: Very Positive ✓✓ | Score: 92/100 ✓✓       │
│ Outcome: Negotiation stage → Next: Send contract       │
└────────────────────────────────────────────────────────┘

MAIN CONTENT PANEL (Left 65%):

┌─ AUDIO PLAYER & CONTROLS ───────────────────────────┐
│ [Call Recording - DataFlow - Mar 20, 2026]          │
│                                                     │
│ ┌─ AUDIO & TIMELINE ────────────────────────────┐  │
│ │ [▶ Play] [⏸] [⏹] | Vol: [🔊====]             │  │
│ │ Speed: [1x ▼]                                 │  │
│ │ [Download MP3] [Share] [Delete]               │  │
│ │                                                 │  │
│ │ Timeline Waveform: [==●══════════════════]    │  │
│ │ Time: 0:00 → 18:56 | Scrub to position      │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─ FULL TRANSCRIPT (SEARCHABLE) ─────────────────────┐
│ [Search in transcript] [Copy All] [Download TXT]   │
│                                                     │
│ 00:00 - James: "Hi Alex, thanks for carving out   │
│         time. I wanted to dive into implementing   │
│         your platform across three teams."        │
│                                                     │
│ 00:15 - You: "Perfect! I'm excited to explore     │
│        your implementation plan. Tell me, what     │
│        does success look like for your teams      │
│        in the first 90 days?"                     │
│                                                     │
│ 00:45 - James: "Definitely faster API integration,│
│         better testing automation, and reducing    │
│         deployment time from 2 hours to 30 mins."│
│                                                     │
│ 01:10 - You: "That's fantastic - 30 min deployment│
│        would require robust testing. How is your  │
│        current testing framework set up?"         │
│                                                     │
│ [Continue scrolling...] [Show more]                │
│                                                     │
└─────────────────────────────────────────────────────┘

CALL METRICS PANEL (Right Column - 35%):

┌─ CALL PERFORMANCE ────────────────────────────────┐
│                                                   │
│ Overall Score: 92 / 100 ✓✓ (Excellent!)        │
│                                                   │
│ BREAKDOWN:                                        │
│ ├─ Talk Ratio: 38% ✓ (Ideal range: 35-45%)     │
│ ├─ Questions Asked: 22 ✓ (Avg: 15-18)         │
│ ├─ Objection Handling: 95/100 ✓✓               │
│ ├─ Value Communication: 96/100 ✓✓              │
│ ├─ Discovery Depth: 88/100 ✓                   │
│ ├─ Closing Strength: 94/100 ✓✓                 │
│ ├─ Engagement Level: 89/100 ✓                  │
│ └─ Sentiment: Very Positive ✓✓                  │
│                                                   │
└───────────────────────────────────────────────────┘

┌─ KEY METRICS ─────────────────────────────────────┐
│                                                   │
│ Duration: 18:56                                  │
│ Key Topics: [Implementation] [ROI] [Timeline]    │
│            [Technology] [Contract]               │
│                                                   │
│ Prospect Talk Time: 62% (Good engagement)        │
│ Your Talk Time: 38% (Well balanced!)             │
│                                                   │
│ Pauses Taken: 12 (Good listening technique)      │
│ Follow-up Questions: 8 (Excellent depth)         │
│ Trial Closes: 2 (Strong closing)                │
│                                                   │
│ ROI Statements: 5 (Good value focus)             │
│ Competitor Mentions: 0 (Stayed positive)         │
│                                                   │
└───────────────────────────────────────────────────┘

┌─ AI COACHING INSIGHTS ────────────────────────────┐
│                                                   │
│ ✓ STRENGTHS (What went well):                    │
│ ├─ "Great job asking discovery questions early. │
│ │  You uncovered the 90-day implementation      │
│ │  goals which helped frame ROI discussion."   │
│ │                                                │
│ ├─ "Excellent trial close at [12:30]. You      │
│ │  tested their commitment level and got        │
│ │  confirmation to move forward. Well done!"   │
│ │                                                │
│ └─ "Perfect ROI anchoring before pricing       │
│    discussion. This positioning prevented      │
│    objections. Great technique!"                │
│                                                   │
│ ➜ AREAS TO CONSIDER:                            │
│ ├─ "At [6:15] you might have asked about       │
│ │  their specific timeline constraints before   │
│ │  promising 90-day implementation."            │
│                                                   │
│ └─ "Consider mentioning support/training       │
│    during the technical discussion to prevent  │
│    implementation concerns."                    │
│                                                   │
│ 💡 SUCCESS PATTERN:                             │
│    "This call demonstrates your proven pattern:│
│     Discovery → Value align → ROI → Close.     │
│     72% of calls using this pattern close.     │
│     Keep it up!"                                │
│                                                   │
└───────────────────────────────────────────────────┘

└─ NEXT STEPS FOR THIS DEAL ────────────────────────┐
│                                                   │
│ ✅ Action Item 1: Send contract by tomorrow     │
│    Status: [Pending] [Edit] [Complete]          │
│                                                   │
│ ✅ Action Item 2: Coordinate legal review       │
│    Status: [Pending] [Edit] [Complete]          │
│                                                   │
│ ✅ Action Item 3: Prepare implementation plan   │
│    Status: [Pending] [Edit] [Complete]          │
│                                                   │
│ [Save Notes] [Schedule Follow-up]                │
│ [Get Manager Coaching] [Share with Team]         │
│                                                   │
└───────────────────────────────────────────────────┘

MANAGER COACHING SECTION (If manager added notes):
┌─ MANAGER FEEDBACK ────────────────────────────────┐
│ From: Sarah Thompson (Your Manager)              │
│ Date: March 21, 2026, 9:00 AM                    │
│                                                   │
│ "Excellent call, Alex! Your ROI framing was     │
│  perfect for this prospect. I especially loved   │
│  how you uncovered their 90-day goal and tied   │
│  it back to implementation success. This deal   │
│  looks ready to close - let's get the contract  │
│  out today. Great work!"                        │
│                                                   │
│ [Schedule Coaching] [Reply]                      │
└───────────────────────────────────────────────────┘
```

**4.3 Data Model**

```
CALL_METRICS TABLE:
├─ id (meeting_id FK)
├─ user_id (FK)
├─ contact_id (FK)
├─ deal_id (FK)
├─ call_date
├─ duration_seconds
├─ talk_ratio (percentage)
├─ engagement_score (0-100)
├─ AI_score (0-100)
├─ sentiment (positive/neutral/negative)
├─ topics (array)
├─ objections_raised (array)
├─ trial_closes_count
├─ questions_asked
├─ pause_count
├─ outcome (proposal/demo/interested/not-interested)
├─ transcript_text
├─ manager_feedback (text)
└─ created_at

COACHING_NOTES:
├─ id
├─ call_id (FK)
├─ strengths (text array)
├─ improvements (text array)
├─ ai_recommendations (text array)
└─ timestamp
```

---

## SECTION 5: EMPLOYEE-SPECIFIC DATABASE REFERENCE

**5.1 Rep-Specific Tables**

```sql
TABLES:
├── users (user_id, manager_id, role, team_id)
├── user_performance_metrics (daily/weekly/monthly)
├── deals (user_id = rep)
├── meetings (user_id = rep)
├── rep_skill_assessments
├── team_targets (quota per rep)
└── call_metrics (AI analysis per call)
```

**5.2 Common Rep Queries**

```sql
-- Rep Dashboard: Today's Schedule + Stats
SELECT m.id, m.scheduled_start_time, c.company_name, 
       d.deal_name, d.deal_value, m.engagement_score
FROM meetings m
LEFT JOIN contacts c ON m.contact_id = c.id
LEFT JOIN deals d ON m.deal_id = d.id
WHERE m.user_id = ? AND DATE(m.scheduled_start_time) = CURRENT_DATE
ORDER BY m.scheduled_start_time;

-- Rep Pipeline: All deals by stage
SELECT stage, COUNT(*) as count, SUM(deal_value) as value,
       ROUND(AVG(probability))::int as avg_probability
FROM deals
WHERE user_id = ? AND status != 'closed_lost'
GROUP BY stage;

-- Rep Quota Progress (This Month)
SELECT 
  (SELECT quota FROM team_targets WHERE user_id = ?) as target,
  SUM(deal_value) as closed,
  COUNT(*) as deal_count
FROM deals
WHERE user_id = ? AND status = 'closed_won'
  AND EXTRACT(MONTH FROM close_date) = EXTRACT(MONTH FROM CURRENT_DATE);

-- Rep Performance Metrics (Last 8 weeks)
SELECT week_starting, avg_call_score, calls_completed, 
       total_deals_advanced, avg_deal_value
FROM rep_weekly_metrics
WHERE user_id = ?
ORDER BY week_starting DESC
LIMIT 8;
```

---

**END OF PART 1 - REP DASHBOARD & PERSONAL PAGES**

---

## Document Metadata
- Total Pages in Part 1: 4 (Dashboard, Pipeline, Performance, Call Details)
- Total Sections: 5
- UI Layouts: 20+
- SQL Queries: 15+
- Database Tables: 8+
- Estimated Dev Time: 60-80 hours

---

**Next in PART 2:** Shared Feature Pages (Meetings, Calls, Tasks, Scheduler, Customers, Deals, Coaching, Insights, Revenue, Settings, AI, Activities, Trackers, ComposeEmail)
