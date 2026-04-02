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
