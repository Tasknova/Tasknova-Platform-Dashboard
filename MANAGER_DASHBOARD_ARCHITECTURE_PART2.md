# Manager Dashboard - Complete Architecture
## PART 2: FORECAST & CALL ANALYTICS PAGES

---

# TABLE OF CONTENTS

## Quick Navigation
- [Forecast & Analytics Page](#section-1-forecast--analytics-page)
- [Call Details Page](#section-2-call-details--coaching-page)
- [Advanced Queries](#section-3-advanced-database-queries)
- [Performance Optimization](#section-4-performance-optimization)
- [UI/UX Patterns](#section-5-common-ui-patterns-across-pages)
- [Error Handling](#section-6-error-handling--edge-cases)
- [Mobile Considerations](#section-7-mobile-responsive-design)

---

## SECTION 1: FORECAST & ANALYTICS PAGE

### Route: `/manager/forecast`

**1.1 Purpose**
- Display revenue forecast for the quarter
- Show probability-weighted pipeline
- Identify deals at risk of slipping
- Trend analysis and forecasting accuracy
- Help manager predict quarter outcomes

**1.2 Page Layout & Components**

```
┌─────────────────────────────────────────────────────────────────────┐
│              MANAGER FORECAST & REVENUE PROJECTION                   │
│  [Q1 2026] [Forecast Accuracy: 89%] [Last Updated: 2h ago]          │
│  [Refresh] [Export Forecast] [Settings]                             │
└─────────────────────────────────────────────────────────────────────┘

┌─ TOP SECTION: FORECAST SUMMARY ─────────────────────────────────────┐
│                                                                     │
│  LEFT (50%):                           RIGHT (50%):                │
│  ┌──────────────────────────────┐      ┌──────────────────────────┐│
│  │ FORECAST METRICS              │      │ QUARTER PROJECTION       ││
│  ├──────────────────────────────┤      ├──────────────────────────┤│
│  │ Q1 Target: $900K             │      │ Current Closed: $834K    ││
│  │ Pipeline Value: $1.346M       │      │ Weighted Pipeline: $XXX  ││
│  │ Confidence Level: 79%         │      │ Projected Total: $1.2M  ││
│  │ Probability-Weighted: $542K   │      │ vs Target: 133% 🟢      ││
│  │                              │      │ Confidence: 79%         ││
│  │ Healthy Pipeline? YES ✓       │      │                          ││
│  │ On Track to Close: $XXK more  │      │ Days Remaining: 28 days ││
│  │                              │      │ Deals Needed: 3-5 more  ││
│  │ [View Assumptions]            │      │ [View Details]           ││
│  │ [Edit Forecast]               │      │ [Adjust Forecast]        ││
│  └──────────────────────────────┘      └──────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘

┌─ FORECAST TIMELINE (Interactive Line Chart) ─────────────────────────┐
│                                                                      │
│  Y-Axis: Revenue ($)        Legend:                                │
│  1.4M |                     ----  Target ($900K)                   │
│  1.2M ├─────          ●     ───  Projected (79% conf)             │
│  1.0M │      ╱╲    ╱───╲  ╱                                       │
│        │    ╱    ╲╱       ╲╱    ●                                │
│  600K │  ●                   ╲ ╱   ●  Points: Actual closed      │
│  400K │╱╲                     ●╲   ─  Trend line                 │
│  200K │   ╲                      ╲ ╱   Shaded area: confidence   │
│      └─────┬─────┬─────┬─────┬────────┬                          │
│      Week 1 Week4 Week8 Week12 Week13  (4 weeks = 1M in timeline) │
│      Jan    Feb   Mar   Apr    (Month markers)                    │
│                                                                   │
│  Visualization shows:                                             │
│  • Historical trajectory (what actually closed)                   │
│  • Target line (flat at $900K)                                   │
│  • Projection/trend line (where we're headed)                    │
│  • Confidence band (shaded area around projection)               │
│  • Current position marker (red dot at today)                    │
│                                                                   │
│  [Hover on points for details]                                   │
│  [Download Chart Data] [Share Forecast]                          │
└───────────────────────────────────────────────────────────────────┘

┌─ PIPELINE BY STAGE (Waterfall Analysis) ─────────────────────────────┐
│                                                                      │
│  Stage              Deals   Value    Prob(%)   W.Value   Risk Level │
│  ──────────────────────────────────────────────────────────────────  │
│  [Prospecting]      [34]    [$234K]  [15%]    [$35K]    🟢 Low     │
│  [Needs Analysis]   [28]    [$456K]  [40%]    [$182K]   🟡 Medium  │
│  [Proposal]         [15]    [$389K]  [60%]    [$233K]   🟡 Medium  │
│  [Negotiation]      [8]     [$267K]  [85%]    [$227K]   🟢 High OK │
│  ├─→ LIKELY CLOSE                             [$677K]              │
│                                                                     │
│  Comparison to historical close rates:                             │
│  • Prospecting: Avg close rate 15% (team avg: 18%) - Below by 3%  │
│  • Needs Analysis: 40% (team avg: 42%) - Below by 2%              │
│  • Proposal: 60% (team avg: 61%) - On par                         │
│  • Negotiation: 85% (team avg: 82%) - Above by 3%                │
│                                                                     │
│  [Adjust Probabilities] [Historical Analysis] [Save Assumptions]   │
└───────────────────────────────────────────────────────────────────┘

┌─ DEALS AT RISK (Alerts & Interventions) ────────────────────────────┐
│                                                                     │
│  🔴 CRITICAL RISK (2 deals):                                       │
│  ├─ [Deal: TechStart Inc] - Value: $65K - Days Overdue: 8 days    │
│  │  Expected: Mar 10 | Rep: Alex Rivera | Stage: Needs Analysis   │
│  │  Risk: No activity in 5 days, decision pending                 │
│  │  [Follow Up] [Escalate to Manager] [View Details]              │
│  │                                                                 │
│  └─ [Deal: Global Corp] - Value: $55K - Days Overdue: 3 days      │
│     Expected: Mar 19 | Rep: Jordan Lee | Stage: Proposal          │
│     Risk: Customer has gone dark, waiting for response             │
│     [Follow Up] [Escalate to Manager] [View Details]              │
│                                                                     │
│  🟡 MEDIUM RISK (5 deals):                                         │
│  ├─ [Deal Name] - Value - Days Overdue - Rep - [Details]          │
│  └─ ...                                                             │
│                                                                     │
│  🟢 LOW RISK: All other deals on track                             │
│                                                                     │
│  [View All Deals] [Create Action Plan] [History]                  │
└───────────────────────────────────────────────────────────────────┘

┌─ CONVERSION METRICS (Historical Analysis) ──────────────────────────┐
│                                                                     │
│  Last 4 Quarters Conversion Rates:                                │
│  ├─ Q4 2025: Prospecting→NA: 22% | NA→Prop: 48% | Prop→Neg: 62%  │
│  ├─ Q3 2025: Prospecting→NA: 20% | NA→Prop: 45% | Prop→Neg: 60%  │
│  ├─ Q2 2025: Prospecting→NA: 18% | NA→Prop: 50% | Prop→Neg: 65%  │
│  └─ Q1 2025: Prospecting→NA: 19% | NA→Prop: 46% | Prop→Neg: 63%  │
│                                                                     │
│  Trend: Prospecting conversion improving (+3%), Proposal stable    │
│                                                                     │
│  Average Deal Cycle Time:                                          │
│  ├─ Prospecting: 14 days (avg: 15 days)                           │
│  ├─ Needs Analysis: 18 days (avg: 19 days)                        │
│  ├─ Proposal: 12 days (avg: 13 days)                              │
│  └─ Negotiation: 7 days (avg: 8 days)                             │
│                                                                     │
│  [Analysis Report] [Drill Into Details] [Export Data]             │
└───────────────────────────────────────────────────────────────────┘

┌─ FORECAST ACCURACY & ADJUSTMENTS ──────────────────────────────────┐
│                                                                    │
│  Last 4 Quarters Accuracy:                                        │
│  ├─ Q4 2025: Forecasted $1.8M | Actual $1.75M | Accuracy: 97%    │
│  ├─ Q3 2025: Forecasted $1.6M | Actual $1.58M | Accuracy: 99%    │
│  ├─ Q2 2025: Forecasted $1.9M | Actual $1.75M | Accuracy: 92%    │
│  └─ Q1 2025: Forecasted $1.7M | Actual $1.68M | Accuracy: 99%    │
│                                                                   │
│  Average Forecast Accuracy: 96.75%                                │
│  Current Forecast Confidence: 79% (Room to improve)               │
│                                                                   │
│  Manager Adjustments Allowed:                                    │
│  ├─ [Adjust overall probability: 79% → ?]                       │
│  ├─ [Adjust specific deal probability: Individual deals]         │
│  ├─ [Add assumption notes for audit trail]                       │
│  └─ All adjustments tracked & logged                             │
│                                                                   │
│  [Save Adjustments] [Reset to Baseline] [View Audit Log]         │
└────────────────────────────────────────────────────────────────────┘
```

**1.3 Data Displayed**

```
FORECAST SUMMARY CARDS:
├─ Quarter Target: $900K
├─ Revenue Already Closed: $834K
├─ Total Pipeline Value: $1.346M
├─ Probability-Weighted Pipeline: $542K
├─ Projected Total Revenue: $1.2M (if all goes well)
├─ Confidence Level: 79%
├─ vs Target: 133% (or +$300K)
├─ Days Remaining: 28 days
└─ Status: ON TRACK ✓

FORECAST TIMELINE CHART:
├─ X-axis: Time (Week 1 → Week 13 of quarter)
├─ Y-axis: Revenue ($)
├─ Lines: Target (flat), Actual (historical), Projection (forecast), Confidence band
├─ Markers: Current position, forecast bands
└─ Hover shows detailed values for each week

PIPELINE BY STAGE:
├─ Stage: Prospecting | $234K | 34 deals | 15% prob | $35K weighted
├─ Stage: Needs Analysis | $456K | 28 deals | 40% prob | $182K weighted
├─ Stage: Proposal | $389K | 15 deals | 60% prob | $233K weighted
├─ Stage: Negotiation | $267K | 8 deals | 85% prob | $227K weighted
└─ Total Likely to Close: $677K (+ $834K already closed = $1.511M)

DEALS AT RISK:
├─ Risk Level: Critical (🔴), Medium (🟡), Low (🟢)
├─ Deal Name, Value, Expected Close Date, Days Overdue, Rep, Stage
├─ Risk Reason: (No activity, Decision pending, Customer unresponsive, etc.)
└─ [Follow Up Actions Available]

CONVERSION METRICS (Historical):
├─ Stage-to-stage conversion rates (last 4 quarters)
├─ Average deal cycle time per stage
├─ Variance from 4-quarter average
├─ Trend (improving/declining)
└─ Comparison to rep/department benchmarks

FORECAST ACCURACY:
├─ Last 4 quarters: Forecasted vs Actual
├─ Accuracy percentage (how close the forecast was)
├─ Current model confidence level
├─ Manager adjustments/override options
└─ Audit trail of all adjustments
```

**1.4 Database Queries - Forecast Page**

```sql
-- Forecast Summary
SELECT 
  (SELECT quota_target FROM organizations WHERE id = ?) as quarter_target,
  (SELECT COALESCE(SUM(revenue_closed), 0) FROM user_performance_metrics 
   WHERE manager_id = ? AND period_type = 'quarter' AND period_start_date = '2026-01-01') as revenue_closed,
  (SELECT COALESCE(SUM(deal_value), 0) FROM deals 
   WHERE user_id IN (SELECT id FROM users WHERE manager_id = ?) 
   AND stage IN ('prospecting', 'needs_analysis', 'proposal', 'negotiation')) as pipeline_value,
  (SELECT COALESCE(SUM(deal_value * (probability_rating_score / 100.0)), 0) FROM deals 
   WHERE user_id IN (SELECT id FROM users WHERE manager_id = ?) 
   AND stage IN ('prospecting', 'needs_analysis', 'proposal', 'negotiation')) as weighted_pipeline,
  ((SELECT COALESCE(SUM(deal_value * (probability_rating_score / 100.0)), 0) FROM deals 
    WHERE user_id IN (SELECT id FROM users WHERE manager_id = ?) 
    AND stage IN ('prospecting', 'needs_analysis', 'proposal', 'negotiation')) / 
   (SELECT NULLIF((SELECT quota_target FROM organizations WHERE id = ?), 0))) as forecast_confidence,
  (DATE('2026-03-31') - CURRENT_DATE) as days_remaining_in_quarter;

-- Pipeline by Stage with Probabilities
SELECT 
  d.stage,
  COUNT(*) as deal_count,
  SUM(d.deal_value) as stage_value,
  ROUND(AVG(d.probability_rating_score)::numeric, 2) as avg_probability,
  ROUND(SUM(d.deal_value * (d.probability_rating_score / 100.0))::numeric, 2) as weighted_value,
  MIN(d.expected_close_date) as earliest_close,
  MAX(d.expected_close_date) as latest_close,
  ROUND((MAX(d.expected_close_date) - MIN(d.expected_close_date))::numeric / 7, 1) as weeks_spread
FROM deals d
WHERE d.user_id IN (SELECT id FROM users WHERE manager_id = ?)
  AND d.stage IN ('prospecting', 'needs_analysis', 'proposal', 'negotiation')
  AND d.is_active = TRUE
GROUP BY d.stage
ORDER BY CASE d.stage
  WHEN 'prospecting' THEN 1
  WHEN 'needs_analysis' THEN 2
  WHEN 'proposal' THEN 3
  WHEN 'negotiation' THEN 4
END;

-- Deals at Risk (overdue or stalled)
SELECT 
  d.id,
  d.deal_name,
  d.account_name,
  u.full_name as rep_name,
  d.deal_value,
  d.stage,
  d.expected_close_date,
  CURRENT_DATE - d.expected_close_date as days_overdue,
  MAX(da.created_at) as last_activity_date,
  CURRENT_DATE - MAX(da.created_at) as days_since_activity,
  CASE 
    WHEN CURRENT_DATE - d.expected_close_date > 0 AND CURRENT_DATE - MAX(da.created_at) > 3 THEN 'critical'
    WHEN CURRENT_DATE - d.expected_close_date > 0 THEN 'high'
    WHEN CURRENT_DATE - MAX(da.created_at) > 5 THEN 'medium'
    ELSE 'low'
  END as risk_level,
  d.probability_rating_score
FROM deals d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN deal_activities da ON d.id = da.deal_id
WHERE d.user_id IN (SELECT id FROM users WHERE manager_id = ?)
  AND d.stage IN ('prospecting', 'needs_analysis', 'proposal', 'negotiation')
  AND d.is_active = TRUE
GROUP BY d.id, d.deal_name, d.account_name, u.full_name, d.deal_value, d.stage,
         d.expected_close_date, d.probability_rating_score
HAVING CURRENT_DATE - d.expected_close_date > 0 
  OR (CURRENT_DATE - MAX(da.created_at) > 3)
ORDER BY days_overdue DESC, days_since_activity DESC;

-- Historical Forecast Accuracy
SELECT 
  forecast_period,
  forecasted_revenue,
  actual_revenue,
  ROUND((actual_revenue / NULLIF(forecasted_revenue, 0) * 100)::numeric, 2) as accuracy_percentage,
  CASE 
    WHEN actual_revenue > forecasted_revenue THEN 'exceeded'
    WHEN actual_revenue = forecasted_revenue THEN 'exact'
    ELSE 'missed'
  END as outcome
FROM forecast_history
WHERE manager_id = ? AND forecast_period >= '2025-01-01'
ORDER BY forecast_period DESC
LIMIT 4;
```

---

## SECTION 2: CALL DETAILS & COACHING PAGE

### Route: `/manager/call/:call_id`

**2.1 Purpose**
- Review individual call recording and transcript
- Analyze AI metrics for coaching
- Document coaching notes
- Track coaching outcomes
- Compare to team benchmarks

**2.2 Page Layout & Components**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CALL DETAILS & REVIEW PAGE                       │
│ [Acme Corp Call - Mar 12, 2026 at 2:00 PM] | Rep: Taylor Brooks   │
│ [Back to Dashboard] [Print] [Export Call Data] [Share] [More]      │
└─────────────────────────────────────────────────────────────────────┘

┌─ TOP SECTION: CALL SUMMARY CARD ──────────────────────────────────┐
│                                                                   │
│ [Avatar] Taylor Brooks | Enterprise Team | Rep since Jan 2024    │
│                                                                   │
│ CALL INFO:                         CALL METRICS:                 │
│ ├─ Account: Acme Corp              ├─ Duration: 24:32 minutes   │
│ ├─ Date/Time: Mar 12, 2:00 PM      ├─ Talk Ratio: 44% (vs 40%)  │
│ ├─ Contact: Jane Smith (CFO)       ├─ Questions: 16 (vs avg 14) │
│ ├─ Deal Value: $65K                ├─ Engagement: 89% (↑)      │
│ ├─ Deal Stage: Needs Analysis      ├─ AI Score: 9.1 / 10       │
│ ├─ Next Action: Send proposal      ├─ Quality: Excellent ✓     │
│ └─ Call Status: Completed, Recorded
│                                    └─ Sentiment: Positive
│ ┌─ CALL OUTCOME ──────────────────┐
│ │ Decision: Next step identified   │
│ │ Contact interested: YES ✓        │
│ │ Follow-up needed: Send proposal  │
│ │ Days until follow-up: 2 days     │
│ └─────────────────────────────────┘
└───────────────────────────────────────────────────────────────────┘

┌─ MAIN SECTION: Call Recording & Transcript ───────────────────────┐
│                                                                  │
│  LEFT PANEL (50%):                  RIGHT PANEL (50%):          │
│  ┌─────────────────────────────┐   ┌──────────────────────────┐ │
│  │ CALL RECORDING              │   │ CALL TRANSCRIPT          │ │
│  │                             │   │                          │ │
│  │ [▶ Play] [⏸ Pause] [■ Stop]│   │ [Full Text Mode]         │ │
│  │ [Time: 12:45 / 24:32] [🔊]  │   │ [Timestamped Mode]       │ │
│  │                             │   │ [Search Transcript]      │ │
│  │ ┌─────────────────────────┐ │   │                          │ │
│  │ │                         │ │   │ 00:00 - Jane Smith:      │ │
│  │ │ [Audio waveform]        │ │   │ "Hi Taylor, thanks for   │ │
│  │ │ [Scrubber bar]          │ │   │  calling. How are you?"  │ │
│  │ │                         │ │   │                          │ │
│  │ │ Progress: [=========>--]│ │   │ 00:15 - Taylor Brooks:   │ │
│  │ │ 52% played               │ │   │ "Great, Jane! Thanks    │ │
│  │ │                         │ │   │  for taking the time."   │ │
│  │ │ Download: [MP3] [WebM]   │ │   │                          │ │
│  │ │ Share: [Link] [Email]    │ │   │ 00:28 - Jane Smith:      │ │
│  │ │ Transcription Status: ✓  │ │   │ "Of course. What's new?" │ │
│  │ │ Processed: 100%           │ │   │                          │ │
│  │ │ Quality: HD               │ │   │ [Scroll for more...]     │ │
│  │ │                             │   │                          │ │
│  │ │ [View on Zoom/Teams]        │   │ [Download Transcript]    │ │
│  │ │ [Report Issue]              │   │ [Print Transcript]       │ │
│  │ │                             │   │ [Copy All]               │ │
│  │ └─────────────────────────┘ │   │                          │ │
│  │                             │   │                          │ │
│  │ [Get Recording Link]        │   │ [Sentiment: Positive 🟢] │ │
│  │ [Record Coaching Notes]     │   │ [Translate]              │ │
│  │ [Send to Rep for Review]    │   │                          │ │
│  └─────────────────────────────┘   └──────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌─ AI-POWERED COACHING INSIGHTS ────────────────────────────────────┐
│                                                                  │
│  TALK TIME ANALYSIS:                                            │
│  ├─ Rep Talk Time: 44% (10:44 of 24:32)                        │
│  ├─ Prospect Talk Time: 56% (13:48 of 24:32)                   │
│  ├─ Benchmark: 40% rep, 60% prospect                           │
│  ├─ Status: ✓ Better than benchmark (+4%)                      │
│  ├─ Insight: Excellent listening ratio. Rep let prospect talk. │
│  └─ Recommendation: Maintain this ratio in future calls.       │
│                                                                  │
│  QUESTIONS ANALYSIS:                                            │
│  ├─ Total Questions Asked: 16                                  │
│  ├─ Open-ended Questions: 12 (75%)                            │
│  ├─ Closed Questions: 4 (25%)                                 │
│  ├─ Benchmark: Avg 14 questions / 70% open-ended              │
│  ├─ Status: ✓ Above benchmark (+2 questions, +5% open-ended) │
│  ├─ Key moments (with timestamps):                             │
│  │  • 2:15 - "What's your budget timeline?" [Excellent]       │
│  │  • 5:43 - "How many users will use this?" [Good]           │
│  │  • 18:22 - "Can you implement this quarter?" [Good]        │
│  └─ Recommendation: Continue using discovery questions early. │
│                                                                  │
│  ENGAGEMENT & MOMENTUM ANALYSIS:                                │
│  ├─ Overall Engagement Score: 89% (Excellent)                 │
│  ├─ Engagement by segment:                                     │
│  │  ├─ Opening (0-3 min): 85% [Building rapport]              │
│  │  ├─ Discovery (3-10 min): 92% [Asking discovery questions] │
│  │  ├─ Presentation (10-18 min): 88% [Discussing solution]    │
│  │  └─ Closing (18-24 min): 87% [Handling objections]         │
│  ├─ Sentiment Progress: Started positive → Ended very positive│
│  └─ Recommendation: Excellent throughout. Just maintain energy.│
│                                                                  │
│  CALL FLOW & STRUCTURE:                                         │
│  ├─ Opening: Establish rapport ✓ Complete (1:45)              │
│  ├─ Discovery: Uncover pain points ✓ Complete (6:15)          │
│  ├─ Presentation: Present solution ✓ Complete (8:30)          │
│  ├─ Objection Handling: Address concerns ✓ Complete (5:20)    │
│  ├─ Closing: Advance sale ✓ Complete (2:52)                  │
│  └─ Status: ✓ All phases present & well-balanced              │
│                                                                  │
│  KEYWORDS & THEMES DETECTED:                                    │
│  ├─ Problem mentioned: "Integration complexity", "Training"   │
│  ├─ Budget mentioned: "Q2 budget cycle"                        │
│  ├─ Timeline mentioned: "Need by June"                         │
│  ├─ Competition mentioned: None (positive!)                    │
│  └─ Buying signals: "How quickly can you implement?" (Strong) │
│                                                                  │
│  COMPARISON TO REP'S AVERAGE:                                   │
│  ├─ This call: AI Score 9.1 | Avg: 8.7 | Status: ↑ Above Avg│
│  ├─ This call: Talk Ratio 44% | Avg: 43% | Status: → Stable  │
│  └─ Insight: Rep is performing above average on this call.    │
│              Continue coaching on consistency.                  │
│                                                                  │
│  [View Detailed Analysis] [Compare Calls] [Export Insights]    │
└──────────────────────────────────────────────────────────────────┘

┌─ SKILLS & COACHING RECOMMENDATIONS ───────────────────────────────┐
│                                                                  │
│  STRENGTHS DEMONSTRATED:                                        │
│  ✓ Excellent Listening - Let prospect talk (56% of time)       │
│  ✓ Strong Discovery - Asked 16 questions, mostly open-ended    │
│  ✓ Positive Engagement - 89% engagement throughout             │
│  ✓ Effective Closing - Advanced deal to next stage             │
│  ✓ Professional Tone - Polite, courteous, confident            │
│                                                                  │
│  AREAS FOR IMPROVEMENT:                                         │
│  ⚠ Handling Objections - Took a bit long to address concern    │
│  ⚠ Product Knowledge - Could expand on implementation details   │
│  (Minor - not critical)                                         │
│                                                                  │
│  COACHING RECOMMENDATIONS (AI-Generated):                       │
│  1. [Primary] Maintain current questioning technique - Working! │
│  2. [Optional] Deep dive on objection handling in next session  │
│  3. [Optional] Share product implementation playbook with team  │
│                                                                  │
│  SUGGESTED COACHING FOCUS:                                      │
│  ├─ ✓ This rep is doing very well - Focus on top performer     │
│  ├─ Recommend: Share best practices with junior reps           │
│  ├─ Opportunity: Peer coaching - Have Taylor coach others      │
│  └─ Status: No urgent coaching needed on this skill             │
│                                                                  │
│  [Schedule Coaching Session] [View Recommendation History]     │
└──────────────────────────────────────────────────────────────────┘

┌─ MANAGER COACHING NOTES (Editable) ───────────────────────────────┐
│                                                                  │
│ [Manager Name]: [Your coaching notes here]                     │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ [Textarea for manager notes]                                ││
│ │                                                             ││
│ │ Pre-filled template options:                               ││
│ │ • [Use coaching recommendation above]                       ││
│ │ • [Excellent call - keep up the great work]               ││
│ │ • [Schedule follow-up coaching session]                   ││
│ │ • [Custom note]                                            ││
│ │                                                             ││
│ │ [Save Notes] [Save & Send to Rep] [Cancel]                ││
│ │                                                             ││
│ │ Note saved to database:                                    ││
│ │ "Taylor showed excellent listening and discovery skills.  ││
│ │  Let continue to build on these strengths. No coaching    ││
│ │  needed at this time. Monitor consistency in future calls"││
│ │                                                             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│ Note saved at: Mar 12, 2:45 PM by Manager [Name]              │
│ Visible to: Manager + Rep (on request)                         │
│ [Edit] [Delete] [Share with Rep] [Coaching History]           │
└──────────────────────────────────────────────────────────────────┘

┌─ RELATED CALLS & COMPARISON ──────────────────────────────────────┐
│                                                                  │
│  Taylor's Recent Calls (Last 5):                                │
│  ├─ Call 1 (Today) - Acme Corp - 9.1 AI Score ← [This call]   │
│  ├─ Call 2 (Mar 10) - TechStart - 8.9 AI Score - [View]       │
│  ├─ Call 3 (Mar 8) - GlobalCorp - 9.0 AI Score - [View]       │
│  ├─ Call 4 (Mar 5) - DataFlow Inc - 8.7 AI Score - [View]     │
│  └─ Call 5 (Mar 2) - CloudBase - 8.5 AI Score - [View]        │
│                                                                  │
│  Team Average (Your 18 reps):                                   │
│  ├─ Avg AI Score: 8.6                                          │
│  ├─ Avg Talk Ratio: 43%                                        │
│  ├─ Avg Questions: 14.8                                        │
│  └─ Avg Engagement: 84%                                        │
│                                                                  │
│  This Rep vs Team:                                              │
│  ├─ AI Score: 8.7 avg (vs team 8.6) ✓ Above average (+0.1)   │
│  ├─ Talk Ratio: 43% avg (vs team 43%) → On par                │
│  ├─ Questions: 15.2 avg (vs team 14.8) ✓ Above average (+0.4) │
│  └─ Engagement: 86% avg (vs team 84%) ✓ Above average (+2%)   │
│                                                                  │
│  [Compare to specific rep] [Team comparison chart]             │
└──────────────────────────────────────────────────────────────────┘

┌─ ACTION ITEMS & FOLLOW-UP ────────────────────────────────────────┐
│                                                                  │
│  FROM THIS CALL:                                                │
│  ├─ [ ] Rep needs to: Send proposal to Jane Smith by Mar 14   │
│  ├─ [ ] Manager to: Review proposal before sending            │
│  ├─ [ ] Rep to: Follow up with Jane Mar 19-20                │
│  └─ Follow-up: [Set Reminder] [Add to Calendar]               │
│                                                                  │
│  COACHING ACTION ITEMS:                                         │
│  ├─ [ ] Schedule coaching session (if needed)                  │
│  ├─ [ ] Share call recording with peer (for peer learning)    │
│  ├─ [ ] Add to coaching portfolio (showcase call)             │
│  └─ Priority: Low (Rep performing well)                        │
│                                                                  │
│  [Create Task] [Add to Coaching Plan] [Schedule Meeting]       │
└──────────────────────────────────────────────────────────────────┘
```

**2.3 Data Displayed**

```
CALL SUMMARY:
├─ Call Info: Account name, Date/Time, Contact name, Deal value, Deal stage
├─ Call Metrics: Duration, Talk ratio (%), Questions asked, Engagement score, AI score
├─ Call Outcome: Outcome type, Next action, Follow-up date
├─ Call Status: Completed/In Progress, Recording availability, Transcription status
└─ Rep Performance vs Benchmark

CALL RECORDING & TRANSCRIPT:
├─ Audio playback with waveform visualization
├─ Transcript (full text or timestamped)
├─ Transcript search capability
├─ Download options (MP3, WebM, text)
└─ Transcription status & quality indicator

AI COACHING INSIGHTS:
├─ Talk Time Analysis: Rep % vs Prospect %, Benchmark comparison, Status (✓ or ⚠)
├─ Questions Analysis: Total, Open vs Closed, Benchmark, Key moments with timestamps
├─ Engagement & Momentum: Score by segment (Opening, Discovery, Presentation, etc.)
├─ Call Flow & Structure: Presence of each phase (Opening→Discovery→Presentation→Close)
├─ Keywords & Themes: Problems, budget, timeline, competition, buying signals
├─ Comparison to Rep's Average: This call vs their typical performance
└─ Recommendations: AI-generated coaching areas

SKILLS & COACHING RECOMMENDATIONS:
├─ Strengths Demonstrated: (List of what they did well)
├─ Areas for Improvement: (List of areas to focus on)
├─ Coaching Recommendations: (Prioritized suggestions)
└─ Suggested Focus: (Whether to schedule coaching, peer teach, etc.)

MANAGER COACHING NOTES:
├─ Text area for manager to add notes
├─ Pre-filled templates
├─ Save options: Save || Save & Send to Rep
├─ Saved notes visible to manager + rep (on request)
└─ Edit/Delete/Share options

RELATED CALLS & COMPARISON:
├─ Rep's recent calls (last 5): Name, Score, Links to view
├─ Team average benchmarks: AI score, talk ratio, questions, engagement
├─ This rep vs team comparison: Status (Above/On par/Below average)
└─ Drill-down comparison options

ACTION ITEMS:
├─ From call: Deal follow-ups, proposal sends, etc.
├─ Coaching action items: Schedule coaching, share, etc.
├─ Status tracking: Checkbox for each action item
└─ Reminder/Calendar integration
```

**2.4 Database Queries - Call Details**

```sql
-- Main Call Details Query
SELECT 
  m.id,
  m.call_recording_url,
  m.transcript_text,
  m.transcript_json,
  m.scheduled_start_time,
  m.scheduled_end_time,
  (m.scheduled_end_time - m.scheduled_start_time) as call_duration,
  m.talk_listen_ratio,
  m.questions_asked,
  m.engagement_score,
  m.longest_monologue_seconds,
  m.call_sentiment,
  m.call_outcome,
  
  u.id as rep_id,
  u.full_name as rep_name,
  u.avatar_url,
  u.email,
  
  d.id as deal_id,
  d.deal_name,
  d.account_name,
  d.deal_value,
  d.stage,
  d.expected_close_date,
  
  t.processing_status as transcript_status,
  t.processed_at as transcript_date,
  
  upm.average_ai_call_score as rep_avg_ai_score,
  upm.average_talk_listen_ratio as rep_avg_talk_ratio,
  upm.average_questions_per_call as rep_avg_questions,
  upm.average_engagement_score as rep_avg_engagement
FROM meetings m
LEFT JOIN users u ON m.user_id = u.id
LEFT JOIN deals d ON m.deal_id = d.id
LEFT JOIN transcripts t ON m.id = t.meeting_id
LEFT JOIN user_performance_metrics upm ON u.id = upm.user_id
  AND upm.period_type = 'quarter' AND upm.period_start_date = '2026-01-01'
WHERE m.id = ? AND u.manager_id = ?;

-- Manager Coaching Notes Query
SELECT 
  cn.id,
  cn.note_text,
  cn.note_type,
  cn.created_at,
  cn.updated_at,
  u.full_name as created_by
FROM call_coaching_notes cn
LEFT JOIN users u ON cn.manager_id = u.id
WHERE cn.call_id = ? AND cn.manager_id = ?
ORDER BY cn.created_at DESC;

-- Coaching Recommendations (AI-generated)
SELECT 
  cr.id,
  cr.recommendation_text,
  cr.focus_area,
  cr.priority,
  cr.is_actionable,
  cr.suggested_coaching_type
FROM coaching_recommendations cr
WHERE cr.call_id = ? 
ORDER BY cr.priority ASC;

-- Rep's Recent Calls
SELECT 
  m.id,
  m.scheduled_start_time,
  d.account_name,
  m.engagement_score as ai_score,
  t.processing_status
FROM meetings m
LEFT JOIN deals d ON m.deal_id = d.id
LEFT JOIN transcripts t ON m.id = t.meeting_id
WHERE m.user_id = ?
  AND m.status = 'completed'
ORDER BY m.scheduled_start_time DESC
LIMIT 5;
```

---

## SECTION 3: ADVANCED DATABASE QUERIES

**3.1 Complex Aggregation for Team Performance**

```sql
-- Team Performance with all metrics and trends
WITH current_period AS (
  SELECT 
    user_id,
    SUM(revenue_closed) as revenue_closed,
    SUM(quota_target) as quota_target,
    ROUND(((SUM(revenue_closed) / NULLIF(SUM(quota_target), 0)) * 100)::numeric, 2) as attainment_pct,
    ROUND(AVG(average_ai_call_score)::numeric, 2) as ai_score
  FROM user_performance_metrics
  WHERE manager_id = $1 
    AND period_type = 'quarter'
    AND period_start_date = '2026-01-01'
  GROUP BY user_id
),
previous_period AS (
  SELECT 
    user_id,
    SUM(revenue_closed) as revenue_closed,
    ROUND(((SUM(revenue_closed) / NULLIF(SUM(quota_target), 0)) * 100)::numeric, 2) as attainment_pct,
    ROUND(AVG(average_ai_call_score)::numeric, 2) as ai_score
  FROM user_performance_metrics
  WHERE manager_id = $1 
    AND period_type = 'quarter'
    AND period_start_date = '2025-10-01'
  GROUP BY user_id
)
SELECT 
  u.id,
  u.full_name,
  cp.revenue_closed as current_revenue,
  cp.quota_target,
  cp.attainment_pct,
  ROUND((cp.attainment_pct - pp.attainment_pct)::numeric, 2) as attainment_trend,
  cp.ai_score,
  ROUND((cp.ai_score - pp.ai_score)::numeric, 2) as ai_score_trend,
  CASE 
    WHEN cp.attainment_pct >= 100 THEN 'top_performer'
    WHEN cp.attainment_pct >= 80 THEN 'on_track'
    ELSE 'needs_support'
  END as performance_status
FROM users u
LEFT JOIN current_period cp ON u.id = cp.user_id
LEFT JOIN previous_period pp ON u.id = pp.user_id
WHERE u.manager_id = $1 AND u.role = 'rep'
ORDER BY cp.revenue_closed DESC;
```

---

## SECTION 4: PERFORMANCE OPTIMIZATION

**4.1 Caching Strategy**

```
REAL-TIME CACHE (TTL: 5 minutes):
├─ Team KPI Cards (refreshed every 5 minutes or on-demand)
├─ Team performance table (refreshed every 10 minutes)
└─ Recent activities (refreshed every 2 minutes)

SHORT-TERM CACHE (TTL: 1 hour):
├─ Individual rep profiles
├─ Pipeline summary by stage
├─ Call quality metrics
└─ Forecast summary

MEDIUM-TERM CACHE (TTL: 6 hours):
├─ Conversion metrics (historical)
├─ Forecast accuracy history
└─ Team benchmarks

LONG-TERM CACHE (TTL: 24 hours):
├─ Organization settings
├─ Team structure
└─ Rep historical data
```

**4.2 Query Indexes**

```sql
-- Required indexes for performance
CREATE INDEX idx_user_perf_manager_period 
  ON user_performance_metrics(manager_id, period_type, period_start_date);

CREATE INDEX idx_meetings_user_date 
  ON meetings(user_id, scheduled_start_time DESC);

CREATE INDEX idx_deals_manager_stage 
  ON deals(user_id, stage, is_active);

CREATE INDEX idx_deals_close_date 
  ON deals(expected_close_date) 
  WHERE is_active = TRUE;

CREATE INDEX idx_coaching_manager_date 
  ON coaching_sessions(manager_id, session_date DESC);

CREATE INDEX idx_activities_manager_type 
  ON manager_activities(manager_id, activity_type, activity_date DESC);
```

---

## SECTION 5: COMMON UI PATTERNS ACROSS PAGES

**5.1 Reusable Components**

```
METRIC CARDS:
├─ Title, Value, Unit
├─ Trend indicator (↑ up, ↓ down, → stable)
├─ % change from previous period
├─ Comparison to benchmark
├─ Click for drill-down
└─ Color coding: Green (good), Yellow (warning), Red (alert)

SORTABLE/FILTERABLE TABLES:
├─ Column headers with sort indicators
├─ Search box
├─ Filter dropdown
├─ Pagination
├─ Row expansion for details
└─ Bulk actions

CHART COMPONENTS:
├─ Line charts (trends over time)
├─ Bar charts (comparisons)
├─ Pie/donut (compositions)
├─ Scatter plots (correlations)
└─ All with hover tooltips & export

MODAL DIALOGS:
├─ Coaching session scheduler
├─ Deal editor
├─ Note/comment entry
├─ Confirmation dialogs
└─ Help/documentation modals

ACTION BUTTONS:
├─ Primary: [Blue] Main CTA (e.g., "Schedule Coaching")
├─ Secondary: [Gray] Alternative actions
├─ Danger: [Red] Delete/Archive
├─ Icon buttons: For common actions (Edit, Export, etc.)
└─ Loading states: Show spinner during async operations
```

---

## SECTION 6: ERROR HANDLING & EDGE CASES

**6.1 Common Errors**

```
ERROR: Call recording not available
├─ Scenario: Manager tries to view a call with no recording
├─ Message: "Call recording not available. Rep may not have enabled recording."
├─ Action: [View transcript instead] [Request recording from rep]
└─ UX: Show transcript if available, offer fallback options

ERROR: Forecast data stale
├─ Scenario: Pipeline hasn't been updated in >24 hours
├─ Message: "Pipeline data from [yesterday]. Last deal update: [time]"
├─ Action: [Refresh now] [Settings to auto-refresh]
└─ UX: Warning banner at top of page

ERROR: Insufficient data for AI recommendations
├─ Scenario: Rep has <5 calls recorded
├─ Message: "Not enough call data to generate coaching recommendations."
├─ Action: [Record more calls] [Check back in a few days]
└─ UX: Disabled recommendations section with explanation

ERROR: Rep has no coaching sessions logged
├─ Scenario: Manager clicks on rep with no coaching history
├─ Message: "No coaching sessions recorded for this rep yet."
├─ Action: [Schedule first coaching session]
└─ UX: Empty state with CTA

ERROR: Manager trying to view another manager's data
├─ Scenario: URL tampering or permission issue
├─ Message: "You don't have permission to view this data."
├─ Action: [Go back to your dashboard] [Contact admin]
└─ UX: 403 Forbidden page
```

---

## SECTION 7: MOBILE RESPONSIVE DESIGN

**7.1 Mobile Adaptations**

```
MOBILE LAYOUT (< 768px):
├─ Single-column layout
├─ KPI cards: Vertical stack, swipeable carousel
├─ Tables: Reformat as cards with key metrics
├─ Charts: Responsive sizing, touch-friendly
├─ Modals: Full-screen on mobile
├─ Navigation: Bottom tabs or hamburger menu

TABLET LAYOUT (768px - 1024px):
├─ Two-column layout (main + sidebar)
├─ Reduced padding/margins
├─ Responsive typography
├─ Optimized touch targets (min 44px)

MOBILE INTERACTIONS:
├─ Swipe to navigate between views
├─ Tap to expand/collapse sections
├─ Double-tap for zoom on charts
├─ Bottom sheet for action menus
├─ Voice commands for note-taking (optional)

MOBILE PERFORMANCE:
├─ Lazy-load images and heavy components
├─ Reduce initial payload
├─ Cache aggressively (1 hour minimum)
└─ Optimize for 4G/5G and 3G fallback
```

---

**END OF PART 2**

---

**NEXT: See MANAGER_DASHBOARD_ARCHITECTURE_PART3.md for:**
- UI Component Library (Buttons, Cards, Forms, etc.)
- Integration with Admin Dashboard
- Mobile app specific considerations
- Real-time notification system
- Data export & reporting features
- Analytics & usage tracking

---

**Document Metadata**
- Created: April 2, 2026
- Version: 1.0
- Pages Covered in Part 2: Pages 3-5 (Forecast, Call Details, +Full Pages)
- Database Queries: 15+
- UI Components: 30+
- Reusable Patterns: 20+
