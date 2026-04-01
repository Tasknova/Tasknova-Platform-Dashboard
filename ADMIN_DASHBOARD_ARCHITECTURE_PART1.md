# Admin Dashboard - Complete Backend Architecture
## PART 1: COMPONENT BREAKDOWN & DATA MAPPING

---

# TABLE OF CONTENTS

## Quick Navigation
- [Executive Summary](#executive-summary)
- [Component Inventory](#section-1-component-inventory)
- [Components 1-5](#section-2-detailed-component-breakdown---components-1-5)
- [Components 6-8](#section-4-remaining-component-breakdown---components-6-8)
- [Components 9-12](#section-5-remaining-components---components-9-12)
- [Database Schema](#section-6-complete-database-schema---critical-tables)
- [API Endpoints](#section-7-key-api-endpoints-for-admin-dashboard)
- [Data Architecture](#section-3-data-architecture-summary---part-1)
- [Aggregation Schedule](#section-8-data-aggregation-schedule)
- [Dependencies](#section-9-summary-table-dependencies)
- [Business Logic](#section-10-critical-business-logic)

---

## EXECUTIVE SUMMARY

**Tasknova** is an AI-powered revenue intelligence platform. The **Admin Dashboard** is the highest-level organizational view providing:
- Real-time performance metrics and KPIs
- Team intelligence & coaching effectiveness
- Strategic decision-making data
- Infrastructure health monitoring
- Administrative workflow management

This document completely reverse-engineers the backend architecture across all 12 dashboard components with:
- Database schemas for each component
- SQL query logic and patterns
- Data ingestion flows
- Critical business calculations
- API endpoint mapping

---

## SECTION 1: COMPONENT INVENTORY

### 1.1 Dashboard Components Identified

| Component | Purpose | Location |
|-----------|---------|----------|
| **1. KPI Cards (Organization Overview)** | High-level org metrics snapshot | Header section |
| **2. Department Performance Table** | Department-by-department revenue & quota | Main grid |
| **3. Conversation Analytics Panel** | Call quality & engagement metrics | Right sidebar |
| **4. Top Performers Leaderboard** | Best performing reps ranked | Secondary panel |
| **5. Coaching Opportunities Matrix** | Skills gaps across organization | Lower section |
| **6. Manager Performance Grid** | Manager coaching effectiveness | Manager dashboard |
| **7. Manager Deals Deep Dive** | Active deals by manager & stage | Deal management view |
| **8. Call Details Viewer** | Individual call recording + analysis | Call analytics page |
| **9. Reports & Export Hub** | Scheduled reports & data export | Reports page |
| **10. System Health Monitor** | Infrastructure uptime & performance | System health page |
| **11. Platform Usage Intelligence** | Feature adoption & user activity | Usage page |
| **12. Team Management Interface** | User CRUD operations | Team management page |

---

### 1.2 Component Grouping by Functional Layer

```
┌─ CORE ANALYTICS LAYER (Components 1-4)
│  ├─ Component 1: KPI Cards → Organization snapshot
│  ├─ Component 2: Department Performance → Team breakdown  
│  ├─ Component 3: Conversation Analytics → Call quality metrics
│  └─ Component 4: Top Performers → Rep leaderboard
│
├─ ADVANCED ANALYTICS LAYER (Components 5-8)
│  ├─ Component 5: Coaching Opportunities → Skills gap detection
│  ├─ Component 6: Manager Performance → Manager effectiveness
│  ├─ Component 7: Manager Deals → Deal by stage view
│  └─ Component 8: Call Details → Individual call analysis
│
└─ OPERATIONS & SYSTEM LAYER (Components 9-12)
   ├─ Component 9: Reports & Export → Scheduled reporting
   ├─ Component 10: System Health → Infrastructure monitoring
   ├─ Component 11: Platform Usage → Feature adoption tracking
   └─ Component 12: Team Management → User management
```

---

## SECTION 2: DETAILED COMPONENT BREAKDOWN - COMPONENTS 1-5

### Component 1: KPI Cards (Organization Overview)

**1. Purpose**
- Display aggregate organization metrics at a glance
- Show performance against targets
- Display trends and key health indicators

**2. Data Displayed**

```
- Total Revenue (Q1 2026): $14.0M
- Target: $15M (93% attainment)
- Total Reps: 134 across 5 departments
- Total Conversations: 24.3K this quarter
- Avg Quota Attainment: 94%
- Avg AI Performance Score: 87%
- System Health: 99.98% uptime
- Reps Above 100%: 42 reps
- Reps Below 80%: 8 reps
- Platform Adoption: 89% (119 active, 15 inactive)
```

**3. Backend Source**
- **Primary Service:** Analytics Service
- **Sub-services:** 
  - Organization Analytics Engine
  - User Performance Aggregator
  - System Health Monitor
  - Platform Usage Tracker

**4. Database Tables**

```
Main Tables:
├── organizations
│   ├── id (PK)
│   ├── quarterly_revenue_target
│   ├── current_quarter_start
│   └── billing_status
├── users
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── role ('admin', 'manager', 'rep')
│   └── is_active
├── user_performance_metrics
│   ├── user_id (FK)
│   ├── period_type ('quarter')
│   ├── revenue_closed
│   ├── quota_attainment_percentage
│   └── period_start_date
├── team_performance_metrics
│   ├── organization_id (FK)
│   ├── team_revenue_closed
│   ├── team_quota_attainment
│   └── period_type
└── platform_usage_logs
    ├── organization_id (FK)
    ├── user_id (FK)
    ├── event_type
    └── created_at

Relationships:
- organizations (1) → (N) users
- organizations (1) → (N) user_performance_metrics  
- organizations (1) → (N) team_performance_metrics
- organizations (1) → (N) platform_usage_logs
```

**5. Query Logic**

```sql
-- Total Revenue (Current Quarter)
SELECT 
  COALESCE(SUM(revenue_closed), 0) as total_revenue,
  COALESCE(SUM(quota_target), 0) as total_quota,
  ROUND(
    (COALESCE(SUM(revenue_closed), 0) / NULLIF(COALESCE(SUM(quota_target), 1), 0) * 100)::numeric, 
    2
  ) as attainment_percentage
FROM user_performance_metrics
WHERE organization_id = ? 
  AND period_type = 'quarter'
  AND period_start_date = '2026-01-01';

-- Total Reps
SELECT COUNT(DISTINCT id) as total_reps
FROM users
WHERE organization_id = ? AND role = 'rep' AND is_active = TRUE;

-- Total Conversations
SELECT COUNT(*) as total_conversations
FROM meetings
WHERE organization_id = ? 
  AND scheduled_start_time BETWEEN '2026-01-01' AND '2026-03-31'
  AND has_recording = TRUE;

-- Avg Quota Attainment
SELECT 
  ROUND(AVG(quota_attainment_percentage)::numeric, 2) as avg_attainment
FROM user_performance_metrics
WHERE organization_id = ?
  AND period_type = 'quarter'
  AND period_start_date = '2026-01-01'
  AND user_id IN (
    SELECT id FROM users 
    WHERE organization_id = ? AND role = 'rep'
  );

-- Avg AI Performance Score
SELECT 
  ROUND(AVG(average_ai_call_score)::numeric, 2) as avg_score
FROM user_performance_metrics
WHERE organization_id = ?
  AND period_type = 'quarter'
  AND user_id IN (
    SELECT id FROM users WHERE organization_id = ?
  );

-- System Health (from external monitoring)
SELECT 
  ROUND(AVG(uptime_percentage)::numeric, 2) as system_uptime
FROM system_health_metrics
WHERE organization_id = ? AND measured_date >= CURRENT_DATE - INTERVAL '7 days';

-- Reps Above 100%
SELECT COUNT(DISTINCT user_id) as above_100_percent
FROM user_performance_metrics
WHERE organization_id = ?
  AND period_type = 'quarter'
  AND quota_attainment_percentage > 100;

-- Reps Below 80%
SELECT COUNT(DISTINCT user_id) as below_80_percent
FROM user_performance_metrics
WHERE organization_id = ?
  AND period_type = 'quarter'
  AND quota_attainment_percentage < 80;

-- Platform Adoption
SELECT
  COUNT(DISTINCT CASE WHEN last_login_at >= CURRENT_DATE - INTERVAL '7 days' THEN id END) as active_users,
  COUNT(DISTINCT CASE WHEN last_login_at < CURRENT_DATE - INTERVAL '7 days' THEN id END) as inactive_users,
  COUNT(DISTINCT id) as total_users,
  ROUND(
    (COUNT(DISTINCT CASE WHEN last_login_at >= CURRENT_DATE - INTERVAL '7 days' THEN id END)::numeric 
     / NULLIF(COUNT(DISTINCT id), 0) * 100)::numeric, 
    2
  ) as adoption_rate
FROM users
WHERE organization_id = ? AND is_active = TRUE;
```

**6. Data Ingestion Flow**

```
FLOW: How data reaches the database for KPI Cards
│
├─ USER ACTIVITY TRACKING
│  ├─ On every user login/action
│  │  └─ Platform updates users.last_login_at
│  └─ Used for adoption rate calculation
│
├─ REVENUE DATA COLLECTION
│  ├─ Source: deals table (closed_won deals)
│  ├─ Trigger: Daily batch job (11 PM ET)
│  └─ Process:
│     1. Query all deals WHERE stage = 'closed_won' AND actual_close_date IN current_quarter
│     2. Aggregate by user_id and department_id
│     3. Calculate attainment vs quota_target
│     4. Insert/Update user_performance_metrics table
│
├─ MEETING/CALL DATA COLLECTION
│  ├─ Source: meetings table
│  ├─ Trigger: Continuous (as meetings complete)
│  └─ Process:
│     1. Record meeting completion
│     2. If has_recording = TRUE, increment conversation count
│     3. Calculate AI metrics (talk_listen_ratio, questions, engagement)
│
├─ USAGE LOGGING
│  ├─ Source: platform_usage_logs table
│  ├─ Trigger: On every user action
│  └─ Process:
│     1. Log event_type, user_id, timestamp
│     2. Calculate last_login_at in users table
│     3. Aggregate for adoption metrics
│
└─ SYSTEM MONITORING
   ├─ Source: External monitoring service (Datadog/New Relic)
   ├─ Trigger: Every 5 minutes
   └─ Process:
      1. Poll API uptime & latency metrics
      2. Store in system_health_metrics table
      3. Calculate 99.98% uptime metric
```

---

### Component 2: Department Performance Table

**1. Purpose**
- Show revenue performance by department
- Compare departments side-by-side
- Identify underperforming departments

**2. Data Displayed**

```
For each department (5 departments):
- Department name
- Manager name
- Rep count (24, 42, 35, 18, 15)
- Revenue closed
- Quota target
- Attainment % (112, 78, 97, 104, 106)
- Avg AI score (9.2, 7.4, 8.5, 9.0, 8.8)
- Trend (up/down)
```

**3. Backend Source**
- **Primary Service:** Team Analytics Service
- **Secondary Service:** Department Management Service

**4. Database Tables**

```
Main Tables:
├── departments
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── name
│   ├── manager_id (FK → users.id)
│   └── quota_target
├── users
│   ├── id (PK)
│   ├── department_id (FK)
│   ├── role
│   └── manager_id (FK)
├── team_performance_metrics
│   ├── department_id (FK)
│   ├── manager_id (FK)
│   ├── team_revenue_closed
│   ├── team_quota_target
│   ├── team_quota_attainment
│   ├── average_ai_call_score
│   └── period_type
└── user_performance_metrics
    ├── user_id (FK)
    ├── revenue_closed
    └── quota_attainment_percentage

Relationships:
- organizations (1) → (N) departments
- departments (1) → (N) users
- departments (1) → (N) team_performance_metrics
- users (1) → (N) user_performance_metrics
- departments (1) → (1) users (via manager_id)
```

**5. Query Logic**

```sql
-- Department Performance Summary
SELECT 
  d.id,
  d.name as department_name,
  u_mgr.full_name as manager_name,
  COUNT(DISTINCT CASE WHEN u.role = 'rep' THEN u.id END) as rep_count,
  COALESCE(tpm.team_revenue_closed, 0) as revenue_closed,
  COALESCE(tpm.team_quota_target, 0) as quota_target,
  COALESCE(tpm.team_quota_attainment, 0) as attainment_percentage,
  COALESCE(tpm.average_ai_call_score, 0) as avg_ai_score,
  CASE 
    WHEN (tpm.team_revenue_closed / NULLIF(tpm.team_quota_target, 0) * 100) > 
         LAG(tpm.team_revenue_closed / NULLIF(tpm.team_quota_target, 0) * 100) 
         OVER (PARTITION BY d.id ORDER BY tpm.period_start_date)
    THEN 'up' 
    ELSE 'down' 
  END as trend
FROM departments d
LEFT JOIN users u_mgr ON d.manager_id = u_mgr.id
LEFT JOIN users u ON d.id = u.department_id
LEFT JOIN team_performance_metrics tpm ON d.id = tpm.department_id
  AND tpm.period_type = 'quarter'
  AND tpm.period_start_date = '2026-01-01'
WHERE d.organization_id = ?
GROUP BY d.id, d.name, u_mgr.full_name, tpm.team_revenue_closed, 
         tpm.team_quota_target, tpm.team_quota_attainment, tpm.average_ai_call_score,
         tpm.period_start_date
ORDER BY tpm.team_quota_attainment DESC;
```

**6. Data Ingestion Flow**

```
FLOW: Department Performance Data Collection
│
├─ DAILY AGGREGATION JOB (11 PM ET)
│  ├─ For each department:
│  │  ├─ Aggregate all reps' revenue_closed → team_revenue_closed
│  │  ├─ Sum all quota targets → team_quota_target
│  │  ├─ Calculate attainment % → team_quota_attainment
│  │  ├─ Average all AI scores → average_ai_call_score
│  │  └─ Insert into team_performance_metrics
│  
├─ SOURCE DATA
│  ├─ user_performance_metrics (daily records)
│  ├─ departments (configuration)
│  ├─ users (rep-department mapping)
│  └─ meetings (AI call scores)
│
└─ TREND CALCULATION
   ├─ Compare current quarter vs previous quarter
   ├─ Update trend field (up/down/stable)
   └─ Store in team_performance_metrics
```

---

### Component 3: Conversation Analytics Panel

**1. Purpose**
- Display organization-wide call quality metrics
- Show conversation patterns across team
- Track engagement effectiveness

**2. Data Displayed**

```
- Total Calls: 24,300
- Avg Talk Ratio: 43%
- Avg Questions Per Call: 15
- Avg Engagement: 85%
- Avg Monologue: 2:20
- Recorded Calls: 23,100 (95%)
- Analyzed Calls: 22,800 (94%)
```

**3. Backend Source**
- **Primary Service:** Conversation Intelligence Service
- **Sub-services:**
  - Call Recording Service
  - Transcription Service
  - AI Analysis Engine
  - Engagement Scorer

**4. Database Tables**

```
Main Tables:
├── meetings
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── has_recording
│   ├── has_transcript
│   ├── talk_listen_ratio
│   ├── questions_asked
│   ├── longest_monologue_seconds
│   ├── engagement_score
│   └── scheduled_start_time
├── transcripts
│   ├── id (PK)
│   ├── meeting_id (FK)
│   ├── processing_status
│   ├── processed_at
│   └── language
├── user_performance_metrics
│   ├── user_id (FK)
│   ├── average_talk_listen_ratio
│   ├── average_questions_per_call
│   ├── average_engagement_score
│   └── period_type
└── team_performance_metrics
    ├── average_talk_listen_ratio
    ├── average_questions_per_call
    └── average_engagement_score

Relationships:
- organizations (1) → (N) meetings
- meetings (1) → (1) transcripts
- meetings (N) ← → users (one-to-many)
```

**5. Query Logic**

```sql
-- Conversation Analytics Summary
SELECT 
  COUNT(DISTINCT m.id) as total_calls,
  ROUND(AVG(m.talk_listen_ratio)::numeric, 2) as avg_talk_ratio,
  ROUND(AVG(m.questions_asked)::numeric, 2) as avg_questions_per_call,
  ROUND(AVG(m.engagement_score)::numeric, 2) as avg_engagement,
  ROUND((AVG(m.longest_monologue_seconds) / 60)::numeric, 2) || ':' ||
  LPAD(ROUND((AVG(m.longest_monologue_seconds) % 60))::text, 2, '0') as avg_monologue,
  COUNT(DISTINCT CASE WHEN m.has_recording = TRUE THEN m.id END) as recorded_calls,
  COUNT(DISTINCT CASE WHEN t.processing_status = 'completed' THEN t.meeting_id END) as analyzed_calls
FROM meetings m
LEFT JOIN transcripts t ON m.id = t.meeting_id
WHERE m.organization_id = ?
  AND m.status = 'completed'
  AND m.scheduled_start_time BETWEEN '2026-01-01' AND '2026-03-31';

-- Org-level quality metrics (from team_performance_metrics)
SELECT 
  ROUND(AVG(average_talk_listen_ratio)::numeric, 2) as org_avg_talk_ratio,
  ROUND(AVG(average_questions_per_call)::numeric, 2) as org_avg_questions,
  ROUND(AVG(average_engagement_score)::numeric, 2) as org_avg_engagement
FROM team_performance_metrics
WHERE organization_id = ?
  AND period_type = 'quarter'
  AND period_start_date = '2026-01-01';
```

**6. Data Ingestion Flow**

```
FLOW: Call Analytics Data Pipeline
│
├─ CALL RECORDING & TRANSCRIPTION
│  ├─ Step 1: Call concludes
│  │  └─ meeting.scheduled_end_time reached
│  │
│  ├─ Step 2: Recording uploaded
│  │  ├─ S3 bucket: /recordings/{org_id}/{meeting_id}.webm
│  │  └─ Update meetings.has_recording = TRUE
│  │
│  ├─ Step 3: Transcription queued
│  │  ├─ Message to SQS/Pub-Sub queue
│  │  ├─ transcripts.processing_status = 'processing'
│  │  └─ Payload: { meeting_id, recording_url }
│  │
│  └─ Step 4: Transcription service processes
│     ├─ Call Speech-to-Text API (Google Cloud, AWS Transcribe, etc.)
│     ├─ Generate full_transcript & transcript_json
│     ├─ Store in transcripts table
│     └─ Update transcripts.processing_status = 'completed'
│
├─ AI ANALYSIS (Parallel to transcription)
│  ├─ Step 1: Extract call audio metadata
│  │  ├─ Calculate talk_listen_ratio (rep % vs prospect %)
│  │  ├─ Count questions_asked by rep
│  │  ├─ Identify longest_monologue_seconds
│  │  └─ Calculate engagement_score (0-100)
│  │
│  ├─ Step 2: Update meetings table
│  │  ├─ meetings.talk_listen_ratio = 43
│  │  ├─ meetings.questions_asked = 15
│  │  ├─ meetings.longest_monologue_seconds = 140
│  │  └─ meetings.engagement_score = 85
│  │
│  └─ Step 3: Aggregate daily into user_performance_metrics
│     ├─ Calculate average_talk_listen_ratio per user per day
│     ├─ Calculate average_questions_per_call per user
│     └─ Calculate average_engagement_score
│
├─ DATA SOURCES
│  ├─ meetings table (raw metadata)
│  ├─ Zoom/Teams/Google Meet API (call recordings)
│  ├─ Whisper API / Google Cloud Speech (transcription)
│  └─ Custom NLP models (engagement, sentiment)
│
└─ AGGREGATION (Nightly 11 PM ET)
   ├─ Roll up to team_performance_metrics
   ├─ Calculate org averages
   └─ Update conversation analytics dashboard
```

---

### Component 4: Top Performers Leaderboard

**1. Purpose**
- Highlight best-performing reps
- Show revenue & attainment leaders
- Display AI performance scores

**2. Data Displayed**

```
Top 5 Reps:
1. Taylor Brooks (Enterprise) - $498K, 124% attainment, 9.4 AI score
2. Alex Rivera (SMB) - $480K, 118% attainment, 8.9 AI score
3. Jordan Lee (Strategic) - $465K, 115% attainment, 8.6 AI score
4. Riley Chen (Enterprise) - $445K, 110% attainment, 8.5 AI score
5. Sam Taylor (Channel) - $425K, 106% attainment, 8.2 AI score
```

**3. Backend Source**
- **Primary Service:** Performance Analytics Service
- **Secondary Service:** User Management Service

**4. Database Tables**

```
Main Tables:
├── users
│   ├── id (PK)
│   ├── full_name
│   ├── organization_id (FK)
│   ├── department_id (FK)
│   └── is_active
├── user_performance_metrics
│   ├── user_id (FK)
│   ├── revenue_closed
│   ├── quota_attainment_percentage
│   ├── average_ai_call_score
│   ├── period_type
│   ├── period_start_date
│   └── period_end_date
├── departments
│   ├── id (PK)
│   └── name
└── organizations
    └── id (PK)

Relationships:
- organizations (1) → (N) users
- departments (1) → (N) users
- users (1) → (N) user_performance_metrics
```

**5. Query Logic**

```sql
-- Top Performers Leaderboard
SELECT 
  u.id,
  u.full_name,
  d.name as department,
  COALESCE(upm.revenue_closed, 0) as revenue,
  COALESCE(upm.quota_attainment_percentage, 0) as attainment,
  COALESCE(upm.average_ai_call_score, 0) as ai_score
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN user_performance_metrics upm ON u.id = upm.user_id
  AND upm.period_type = 'quarter'
  AND upm.period_start_date = '2026-01-01'
WHERE u.organization_id = ?
  AND u.role = 'rep'
  AND u.is_active = TRUE
ORDER BY COALESCE(upm.revenue_closed, 0) DESC
LIMIT 5;
```

**6. Data Ingestion Flow**

```
FLOW: Top Performer Data Collection
│
├─ DAILY UPDATE TRIGGER
│  ├─ Time: 11 PM ET every day
│  └─ Duration: ~15 minutes
│
├─ DATA SOURCE
│  ├─ user_performance_metrics (daily aggregated)
│  ├─ users (profile info)
│  └─ departments (department name)
│
├─ CALCULATION
│  ├─ For each rep with role = 'rep' and is_active = TRUE:
│  │  ├─ Fetch user_performance_metrics for current quarter
│  │  ├─ Get revenue_closed (sum of all closed deals)
│  │  ├─ Get quota_attainment_percentage (revenue / quota * 100)
│  │  └─ Get average_ai_call_score (avg of all meetings)
│  │
│  └─ Rank by revenue_closed DESC, take top 5
│
└─ CACHE
   ├─ Store top 5 reps in Redis cache (TTL: 24 hours)
   ├─ Key: org:{org_id}:top_performers:quarter:2026-q1
   └─ Use for fast dashboard load
```

---

### Component 5: Coaching Opportunities Matrix

**1. Purpose**
- Identify skill gaps across organization
- Track coaching impact
- Recommend training focus areas

**2. Data Displayed**

```
Coaching Opportunities:
1. Discovery Qualification
   - Affected Reps: 42
   - Department: Inside Sales
   - Impact: High
   - Issue: Missing SPICED criteria in 45% of deals

2. Active Listening
   - Affected Reps: 28
   - Department: Multiple
   - Impact: Medium
   - Issue: Talk-time ratio above 50%

3. Objection Handling
   - Affected Reps: 19
   - Department: SMB Sales
   - Impact: Medium
   - Issue: Pricing objections not addressed with ROI
```

**3. Backend Source**
- **Primary Service:** Coaching Intelligence Service
- **Sub-services:**
  - Call Analysis Engine
  - Trend Detection
  - Skill Gap Analyzer

**4. Database Tables**

```
Main Tables:
├── coaching_insights
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── user_id (FK)
│   ├── insight_category ('discovery', 'objection_handling', etc.)
│   ├── insight_type ('strength', 'improvement_area')
│   ├── title
│   ├── description
│   ├── current_value
│   ├── target_value
│   ├── trend ('improving', 'declining', 'stable')
│   ├── based_on_meetings
│   └── created_at
├── meetings
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── owner_id (FK)
│   ├── questions_asked
│   ├── talk_listen_ratio
│   ├── objections (JSONB)
│   ├── key_topics (JSONB)
│   └── pain_points (JSONB)
├── transcript_moments
│   ├── id (PK)
│   ├── transcript_id (FK)
│   ├── meeting_id (FK)
│   ├── moment_type ('objection', 'pain_point', 'missing_discovery')
│   ├── importance_score
│   └── content
├── users
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── department_id (FK)
│   └── full_name
├── departments
│   ├── id (PK)
│   └── name
└── deals
    ├── id (PK)
    ├── owner_id (FK)
    ├── spiced_situation
    ├── spiced_pain
    ├── spiced_impact
    ├── spiced_critical_event
    ├── spiced_decision_process
    ├── spiced_decision_criteria
    └── spiced_score

Relationships:
- organizations (1) → (N) coaching_insights
- organizations (1) → (N) meetings
- organizations (1) → (N) transcript_moments
- users (1) → (N) coaching_insights
- departments (1) → (N) users
```

**5. Query Logic**

```sql
-- Coaching Opportunities Summary (Aggregate view)
WITH coaching_agg AS (
  SELECT 
    'Discovery Qualification' as opportunity,
    COUNT(DISTINCT CASE 
      WHEN ci.insight_category = 'discovery' 
      AND ci.insight_type = 'improvement_area' 
      THEN ci.user_id 
    END) as affected_reps,
    d.name as department,
    'High' as impact,
    'Missing SPICED criteria in 45% of deals' as description,
    COUNT(DISTINCT CASE 
      WHEN d.spiced_score < 70 THEN d.owner_id 
    END) as reps_with_issue
  FROM coaching_insights ci
  LEFT JOIN users u ON ci.user_id = u.id
  LEFT JOIN departments d ON u.department_id = d.id
  LEFT JOIN deals d ON u.id = d.owner_id
  WHERE ci.organization_id = ?
    AND ci.insight_category IN ('discovery', 'objection_handling', 'active_listening')
  GROUP BY d.name
)
SELECT * FROM coaching_agg
ORDER BY reps_with_issue DESC
LIMIT 5;

-- Detailed Coaching Opportunities (by department)
SELECT 
  'Discovery Qualification' as coaching_area,
  COUNT(DISTINCT u.id) as affected_reps,
  d.name as department,
  'High' as impact_level,
  ROUND(
    (COUNT(DISTINCT CASE WHEN d.spiced_score < 70 THEN d.owner_id END)::numeric / 
     COUNT(DISTINCT u.id) * 100)::numeric, 
    0
  ) as percentage_affected
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN deals deal ON u.id = deal.owner_id
WHERE u.organization_id = ?
  AND u.role = 'rep'
  AND (d.spiced_situation = FALSE OR d.spiced_pain = FALSE 
       OR d.spiced_impact = FALSE OR d.spiced_critical_event = FALSE
       OR d.spiced_decision_process = FALSE OR d.spiced_decision_criteria = FALSE)
GROUP BY d.name
ORDER BY affected_reps DESC;
```

**6. Data Ingestion Flow**

```
FLOW: Coaching Opportunities Detection
│
├─ CONTINUOUS MONITORING (Real-time)
│  ├─ On every meeting completion:
│  │  ├─ Extract transcript_moments
│  │  ├─ Identify objections → transcript_moments.moment_type = 'objection'
│  │  ├─ Identify pain points → moment_type = 'pain_point'
│  │  ├─ Check SPICED framework → deals.spiced_* fields
│  │  └─ Analyze talk_listen_ratio
│  │
│  └─ Run AI analysis:
│     ├─ NLP model: Detect missing discovery questions
│     ├─ Pattern match: Identify objections not addressed
│     └─ Flag: talk_listen_ratio > 50% indicates low listening
│
├─ DAILY AGGREGATION (11 PM ET)
│  ├─ For each department:
│  │  ├─ Count reps with <70% SPICED score
│  │  ├─ Count reps with avg questions_per_call < threshold
│  │  ├─ Count reps with talk_listen_ratio > 50%
│  │  ├─ Aggregate metrics
│  │  └─ Create coaching_insights records
│  │
│  └─ Create summary coaching opportunities:
│     ├─ 'Discovery Qualification' (SPICED score gap)
│     ├─ 'Active Listening' (talk_listen_ratio issue)
│     └─ 'Objection Handling' (no objection resolution)
│
├─ DATA SOURCES
│  ├─ transcript_moments (call analysis)
│  ├─ meetings (quality metrics)
│  ├─ deals (SPICED framework tracking)
│  └─ users + departments (organization structure)
│
└─ IMPACT ASSESSMENT
   ├─ Compare coaching_insights.trend:
   │  ├─ improving = positive coaching effect
   │  ├─ declining = need intervention
   │  └─ stable = monitoring needed
   │
   └─ Store coaching_impact_score:
      ├─ Track rep improvement over time
      ├─ Correlate to revenue impact
      └─ Calculate ROI of coaching
```

---

## SECTION 3: DATA ARCHITECTURE SUMMARY - PART 1

### Key Findings

1. **Multi-tier Aggregation Model**
   - Real-time: Individual activities logged (meetings, calls, deals)
   - Daily: User-level aggregation (user_performance_metrics)
   - Daily: Team-level aggregation (team_performance_metrics)
   - Real-time: Organization-level rollup (via SQL aggregations)

2. **Critical Calculation Points**
   - Quota attainment = revenue_closed / quota_target * 100
   - Team metrics = SUM(user_metrics) grouped by department
   - Org metrics = SUM(team_metrics) or AVG(user_metrics)

3. **AI Scoring Pipeline**
   - Call-level: AI score calculated during/after meeting
   - User-level: Average of all user calls
   - Team-level: Average of all team members
   - Org-level: Average of all team averages

4. **Performance Period Granularity**
   - day: Daily snapshots
   - week: Monday-Sunday
   - quarter: Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec
   - year: Jan-Dec

---

**END OF PART 1**

Next document: **ADMIN_DASHBOARD_ARCHITECTURE_PART2.md** (Database Design, Query Logic, API Endpoints, Data Flows)
# Admin Dashboard - Complete Backend Architecture Reverse Engineering
## PART 2: DATABASE DESIGN, QUERIES, & DATA FLOWS

---

## SECTION 4: REMAINING COMPONENT BREAKDOWN - COMPONENTS 6-8

### Component 6: Manager Performance Grid

**1. Purpose**
- Display manager effectiveness across coaching dimensions
- Track team productivity metrics
- Compare manager performance side-by-side

**2. Data Displayed (5 Managers)**

```
For each manager:
- Manager name & department
- Team size (8-18 reps)
- Team calls made (184-892)
- Team calls answered (142-723)
- Team answer rate (77-83%)
- Team meetings scheduled (56-147)
- Team emails sent (423-1,342)
- Team deals advanced (22-94)
- Team talk time (97.2-318.7 hrs)

Revenue Metrics:
- Team quota attainment (76-94%)
- Team pipeline ($2.4M-$8.9M)
- Active deals (18-112)
- Team revenue ($4.1M-$11.4M)
- Quota target ($4.6M-$15.0M)

Coaching Metrics:
- 1-on-1 sessions (18-42/period)
- Avg coaching frequency (2-2.5x/week)
- Coaching impact score (79-92)
- Rep improvement rate (24-58%)
- At-risk reps (1-3)
- Top performers (2-5)

Quality Metrics:
- Avg talk:listen ratio (38-44%)
- Avg questions/call (14-18)
- Avg engagement score (79-91%)

Status: exceeding/on-target/below-target
```

**3. Backend Source**
- **Primary Service:** Manager Performance Analytics
- **Secondary Services:** Coaching Metrics, Team Analytics

**4. Database Tables**

```
Main Tables:
├── users
│   ├── id (PK)
│   ├── full_name
│   ├── organization_id (FK)
│   ├── department_id (FK)
│   ├── role ('manager', 'rep')
│   └── manager_id (FK - used only for reps)
│
├── departments
│   ├── id (PK)
│   ├── manager_id (FK)
│   └── name
│
├── user_performance_metrics
│   ├── user_id (FK)
│   ├── calls_made
│   ├── calls_answered
│   ├── calls_not_answered
│   ├── call_answer_rate
│   ├── emails_sent
│   ├── meetings_held
│   ├── meetings_scheduled
│   ├── total_talk_time_seconds
│   ├── average_talk_listen_ratio
│   ├── average_questions_per_call
│   ├── average_engagement_score
│   ├── deals_advanced
│   └── period_type
│
├── team_performance_metrics
│   ├── manager_id (FK)
│   ├── team_size
│   ├── active_reps
│   ├── total_calls_made
│   ├── total_calls_answered
│   ├── team_call_answer_rate
│   ├── total_meetings_held
│   ├── coaching_sessions_held
│   ├── coaching_impact_score
│   ├── average_talk_listen_ratio
│   ├── average_questions_per_call
│   ├── average_engagement_score
│   ├── team_revenue_closed
│   ├── team_quota_attainment
│   ├── team_pipeline_value
│   ├── total_deals_won
│   ├── total_deals_lost
│   ├── team_win_rate
│   ├── average_deal_size
│   ├── average_sales_cycle_days
│   ├── period_type
│   └── period_start_date
│
├── coaching_sessions
│   ├── manager_id (FK)
│   ├── rep_id (FK)
│   ├── scheduled_date
│   ├── actual_date
│   ├── duration_minutes
│   ├── status ('scheduled', 'completed', 'cancelled')
│   └── period_start_date
│
└── user_performance_metrics (via manager filter)
    └── Based on users WHERE manager_id = ? AND role = 'rep'
```

**5. Query Logic**

```sql
-- Manager Performance Summary
SELECT 
  u_mgr.id as manager_id,
  u_mgr.full_name as manager_name,
  d.name as department,
  COUNT(DISTINCT u_rep.id) as team_size,
  COUNT(DISTINCT CASE WHEN u_rep.is_active THEN u_rep.id END) as active_reps,
  
  -- Activity Metrics (summed from all team members)
  COALESCE(SUM(upm.calls_made), 0) as team_calls_made,
  COALESCE(SUM(upm.calls_answered), 0) as team_calls_answered,
  COALESCE(SUM(upm.calls_not_answered), 0) as team_calls_not_answered,
  ROUND(
    (COALESCE(SUM(upm.calls_answered), 0)::numeric / 
     NULLIF(COALESCE(SUM(upm.calls_made), 1), 0) * 100)::numeric, 
    2
  ) as team_answer_rate,
  COALESCE(SUM(upm.emails_sent), 0) as team_emails_sent,
  COALESCE(SUM(upm.meetings_held), 0) as team_meetings_held,
  COALESCE(SUM(upm.meetings_scheduled), 0) as team_meetings_scheduled,
  COALESCE(SUM(upm.deals_advanced), 0) as team_deals_advanced,
  ROUND((COALESCE(SUM(upm.total_talk_time_seconds), 0) / 3600.0)::numeric, 1) as team_talk_time_hours,
  
  -- Revenue Metrics
  COALESCE(tpm.team_revenue_closed, 0) as team_revenue,
  COALESCE(tpm.team_quota_target, 0) as quota_target,
  COALESCE(tpm.team_quota_attainment, 0) as quota_attainment,
  COALESCE(tpm.team_pipeline_value, 0) as team_pipeline,
  COALESCE(tpm.total_deals_won, 0) as deals_won,
  COALESCE(tpm.total_deals_lost, 0) as deals_lost,
  COALESCE(tpm.team_win_rate, 0) as win_rate,
  COALESCE(tpm.average_deal_size, 0) as avg_deal_size,
  COALESCE(tpm.average_sales_cycle_days, 0) as avg_sales_cycle,
  
  -- Quality Metrics
  ROUND(AVG(upm.average_talk_listen_ratio)::numeric, 2) as avg_talk_listen_ratio,
  ROUND(AVG(upm.average_questions_per_call)::numeric, 2) as avg_questions_per_call,
  ROUND(AVG(upm.average_engagement_score)::numeric, 2) as avg_engagement_score,
  
  -- Coaching Metrics
  COUNT(DISTINCT CASE WHEN cs.status = 'completed' THEN cs.id END) as coaching_sessions_held,
  ROUND(
    (COUNT(DISTINCT CASE WHEN cs.status = 'completed' THEN cs.id END)::numeric / 
     (EXTRACT(DAY FROM 
       (SELECT MAX(period_end_date) FROM user_performance_metrics 
        WHERE organization_id = u_mgr.organization_id) - 
       (SELECT MIN(period_start_date) FROM user_performance_metrics 
        WHERE organization_id = u_mgr.organization_id)
     ) / 7.0))::numeric, 
    2
  ) as sessions_per_week,
  COALESCE(tpm.coaching_impact_score, 0) as coaching_impact_score,
  
  -- At-Risk and Top Performer Counts
  COUNT(DISTINCT CASE WHEN upm.quota_attainment_percentage < 80 THEN u_rep.id END) as at_risk_reps,
  COUNT(DISTINCT CASE WHEN upm.quota_attainment_percentage > 100 THEN u_rep.id END) as top_performers,
  
  -- Status Determination
  CASE 
    WHEN COALESCE(tpm.team_quota_attainment, 0) > 100 THEN 'exceeding'
    WHEN COALESCE(tpm.team_quota_attainment, 0) >= 80 THEN 'on-target'
    ELSE 'below-target'
  END as status,
  
  CASE 
    WHEN COALESCE(tpm.team_quota_attainment, 0) > 
         LAG(COALESCE(tpm.team_quota_attainment, 0)) 
         OVER (PARTITION BY u_mgr.id ORDER BY tpm.period_start_date)
    THEN 'up'
    ELSE 'down'
  END as trend

FROM users u_mgr
LEFT JOIN users u_rep ON u_mgr.id = u_rep.manager_id AND u_rep.role = 'rep'
LEFT JOIN departments d ON u_mgr.department_id = d.id
LEFT JOIN user_performance_metrics upm ON u_rep.id = upm.user_id
  AND upm.period_type = 'quarter'
  AND upm.period_start_date = '2026-01-01'
LEFT JOIN team_performance_metrics tpm ON u_mgr.id = tpm.manager_id
  AND tpm.period_type = 'quarter'
  AND tpm.period_start_date = '2026-01-01'
LEFT JOIN coaching_sessions cs ON u_mgr.id = cs.manager_id
  AND EXTRACT(MONTH FROM cs.scheduled_date) IN (1, 2, 3)

WHERE u_mgr.organization_id = ?
  AND u_mgr.role = 'manager'
  
GROUP BY u_mgr.id, u_mgr.full_name, d.name, tpm.team_revenue_closed, 
         tpm.team_quota_target, tpm.team_quota_attainment, tpm.team_pipeline_value,
         tpm.total_deals_won, tpm.total_deals_lost, tpm.team_win_rate,
         tpm.average_deal_size, tpm.average_sales_cycle_days,
         tpm.coaching_impact_score, tpm.period_start_date

ORDER BY COALESCE(tpm.team_quota_attainment, 0) DESC;
```

**6. Data Ingestion Flow**

```
FLOW: Manager Performance Calculation
│
├─ HOURLY AGGREGATION (Every hour for real-time dashboard)
│  ├─ For each manager:
│  │  ├─ Fetch all reps reporting to manager_id
│  │  ├─ Aggregate user_performance_metrics for this hour
│  │  ├─ Calculate team totals (SUM all reps)
│  │  ├─ Calculate team averages (AVG all rep metrics)
│  │  └─ Update team_performance_metrics (hourly snapshot)
│  │
│  └─ Metrics calculated:
│     ├─ team_calls_made = SUM(upm.calls_made)
│     ├─ team_answer_rate = SUM(answered) / SUM(made) * 100
│     ├─ team_revenue_closed = SUM(revenue_closed)
│     ├─ avg_talk_listen_ratio = AVG(average_talk_listen_ratio)
│     └─ coaching_impact_score (see coaching flow below)
│
├─ COACHING SESSION TRACKING
│  ├─ When manager schedules coaching session:
│  │  ├─ Insert into coaching_sessions
│  │  ├─ Set status = 'scheduled'
│  │  └─ Link rep_id to affected rep
│  │
│  └─ After coaching session completes:
│     ├─ Update coaching_sessions.status = 'completed'
│     ├─ Store action_items and focus_areas
│     ├─ AI analyzes rep's post-coaching calls
│     └─ Calculate improvement percentage
│
│        coaching_impact_score = 
│         (avg_score_after_coaching - avg_score_before_coaching) / avg_score_before * 100
│
├─ DATA SOURCES
│  ├─ user_performance_metrics (individual rep metrics)
│  ├─ coaching_sessions (coaching records)
│  ├─ team_performance_metrics (previous team metrics)
│  └─ Real-time activities (calls, emails, meetings)
│
└─ DAILY FINALIZATION (11 PM ET)
   ├─ Calculate final daily team_performance_metrics
   ├─ Determine status (exceeding/on-target/below-target)
   ├─ Compare to previous day for trend
   ├─ Calculate rep_improvement_rate:
   │  └─ Count reps improving from previous week
   └─ Store in database for dashboard query
```

---

### Component 7: Manager Deals Deep Dive

**1. Purpose**
- Show deals by manager and stage
- Track deal health and momentum
- Display deal specifics and AI insights

**2. Data Displayed**

```
For each manager - Active deals organized by stage:

Negotiation (8 deals):
- DataFlow Systems: $725K, 85% prob, 8 days in stage
- TechVision Inc: $485K, 70% prob, 12 days in stage
- [+ 6 more deals]

Proposal (10 deals):
- GlobalTech Solutions: $1.2M, 80% prob, 18 days in stage
- [+ 9 more deals]

Discovery (various):
- [Deal list]

For each deal shown:
- Deal name
- Deal value ($XXK)
- Stage
- Win probability (%)
- Days in stage
- Rep owner
- Next step
- AI insights (3-5 bullet points)
- Risk factors
- Competitor mentions
- Stakeholders involved
- Stage history (timeline of progression)
```

**3. Backend Source**
- **Primary Service:** Deal Management Service
- **Secondary Services:** AI Deal Scoring, Pipeline Analytics

**4. Database Tables**

```
Main Tables:
├── deals
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── account_id (FK)
│   ├── name
│   ├── amount
│   ├── stage
│   ├── probability
│   ├── owner_id (FK → users.id / rep)
│   ├── expected_close_date
│   ├── days_in_stage
│   ├── ai_deal_score
│   ├── ai_win_probability
│   ├── ai_insights (JSONB)
│   ├── risk_level
│   ├── risk_factors (JSONB)
│   ├── spiced_score
│   ├── competitors (JSONB)
│   ├── last_activity_at
│   ├── next_step
│   ├── next_step_due_date
│   └── is_active
│
├── accounts
│   ├── id (PK)
│   ├── name
│   ├── industry
│   ├── owner_id
│   └── health_score
│
├── users
│   ├── id (PK)
│   ├── full_name
│   ├── manager_id (FK)
│   ├── role
│   └── avatar_url
│
├── deal_stage_history
│   ├── id (PK)
│   ├── deal_id (FK)
│   ├── from_stage
│   ├── to_stage
│   ├── duration_days
│   ├── changed_by (FK → users.id)
│   ├── notes
│   └── created_at
│
├── deal_stakeholders
│   ├── id (PK)
│   ├── deal_id (FK)
│   ├── contact_id (FK)
│   ├── role ('champion', 'decision_maker', etc.)
│   ├── influence_level
│   └── engagement_level
│
├── contacts
│   ├── id (PK)
│   ├── account_id (FK)
│   ├── full_name
│   ├── title
│   ├── email
│   ├── role_type ('champion', 'decision_maker')
│   └── engagement_score
│
└── meetings
    ├── id (PK)
    ├── deal_id (FK)
    ├── owner_id (FK)
    ├── sentiment
    ├── objections (JSONB)
    ├── competitors_mentioned (JSONB)
    └── key_topics (JSONB)
```

**5. Query Logic**

```sql
-- Manager Deals by Stage
SELECT 
  d.id,
  d.name,
  a.name as account_name,
  d.amount as deal_value,
  d.stage,
  d.probability,
  u_rep.full_name as rep_owner,
  d.days_in_stage,
  d.expected_close_date,
  d.next_step,
  d.ai_deal_score,
  d.ai_win_probability,
  d.ai_insights,
  d.risk_level,
  d.risk_factors,
  d.spiced_score,
  d.competitors,
  d.last_activity_at,
  COUNT(DISTINCT ds.contact_id) as stakeholder_count,
  STRING_AGG(DISTINCT c.full_name, ', ') as stakeholders,
  STRING_AGG(DISTINCT m.sentiment, ', ') as recent_sentiments
  
FROM deals d
JOIN accounts a ON d.account_id = a.id
JOIN users u_rep ON d.owner_id = u_rep.id
LEFT JOIN deal_stakeholders ds ON d.id = ds.deal_id
LEFT JOIN contacts c ON ds.contact_id = c.id
LEFT JOIN meetings m ON d.id = m.deal_id 
  AND m.scheduled_start_time >= CURRENT_DATE - INTERVAL '7 days'

WHERE d.organization_id = ?
  AND u_rep.manager_id = ?  -- Filter by manager
  AND d.is_active = TRUE
  AND d.stage NOT IN ('closed_won', 'closed_lost')

GROUP BY d.id, d.name, a.name, d.amount, d.stage, d.probability, 
         u_rep.full_name, d.days_in_stage, d.expected_close_date,
         d.next_step, d.ai_deal_score, d.ai_win_probability,
         d.ai_insights, d.risk_level, d.risk_factors, d.spiced_score,
         d.competitors, d.last_activity_at

ORDER BY d.stage ASC, d.expected_close_date ASC;

-- Deal Stage History (for timeline view)
SELECT 
  dsh.id,
  dsh.from_stage,
  dsh.to_stage,
  dsh.duration_days,
  dsh.created_at,
  u_changed.full_name as changed_by,
  dsh.notes

FROM deal_stage_history dsh
LEFT JOIN users u_changed ON dsh.changed_by = u_changed.id

WHERE dsh.deal_id = ?

ORDER BY dsh.created_at ASC;
```

**6. Data Ingestion Flow**

```
FLOW: Deal Management & AI Scoring Pipeline
│
├─ DEAL CREATION
│  ├─ Rep creates deal (API: POST /api/deals)
│  ├─ Store in deals table with stage = 'prospecting'
│  ├─ Record in deal_stage_history: NULL → prospecting
│  └─ Initialize ai_deal_score = NULL (pending analysis)
│
├─ STAGE PROGRESSION
│  ├─ When rep moves deal to new stage (API: PATCH /api/deals/:id)
│  ├─ Update deals.stage = new_stage
│  ├─ Record in deal_stage_history:
│  │  ├─ from_stage = old_stage
│  │  ├─ to_stage = new_stage
│  │  ├─ duration_days = days since last stage change
│  │  ├─ changed_by = current_user
│  │  └─ created_at = NOW()
│  │
│  └─ Reset days_in_stage to 0
│
├─ AI DEAL SCORING (Near Real-time)
│  ├─ Trigger: On deal creation or update
│  ├─ AI Engine analyzes:
│  │  ├─ Deal size vs. rep's avg deal size → deal_score component
│  │  ├─ Stage progression speed → velocity component
│  │  ├─ Stakeholder count & engagement → multi-threading component
│  │  ├─ Meeting frequency & recency → engagement component
│  │  ├─ SPICED framework completeness → qualification component
│  │  └─ Language sentiment in calls → buying signal component
│  │
│  ├─ Calculate ai_win_probability:
│  │   win_probability = f(
│  │     stage_probability,
│  │     deal_score,
│  │     velocity_score,
│  │     stakeholder_engagement,
│  │     sales_cycle_days / avg_sales_cycle
│  │   )
│  │
│  ├─ Detect risk_factors:
│  │   ├─ IF no contact in 7+ days → 'no_recent_activity'
│  │   ├─ IF stakeholder_count < 2 → 'lack_multi_threading'
│  │   ├─ IF deal in stage > median_days_in_stage → 'stalled'
│  │   ├─ IF competitor_mentioned AND no_response_to_concerns → 'competitor_pressure'
│  │   └─ IF probability declining → 'momentum_loss'
│  │
│  └─ Update deals table:
│     ├─ ai_deal_score
│     ├─ ai_win_probability
│     ├─ ai_insights (JSON array of 3-5 insights)
│     ├─ risk_level ('low', 'medium', 'high', 'critical')
│     └─ risk_factors (JSON array)
│
├─ MEETING INTEGRATION
│  ├─ When meeting linked to deal:
│  │  ├─ Extract sentiment from transcript
│  │  ├─ Identify objections → store in meetings.objections
│  │  ├─ Identify competitors mentioned → store in meetings.competitors_mentioned
│  │  ├─ Detect buying signals → add to ai_insights
│  │  └─ Update deals.last_activity_at = meeting.scheduled_end_time
│  │
│  └─ Re-calculate ai_deal_score with new meeting data
│
├─ SPICED FRAMEWORK TRACKING
│  ├─ On every deal meeting:
│  │  ├─ Analyze transcript for SPICED components
│  │  ├─ Update deals.spiced_situation = TRUE|FALSE
│  │  ├─ Update deals.spiced_pain = TRUE|FALSE
│  │  ├─ Update deals.spiced_impact = TRUE|FALSE
│  │  ├─ Update deals.spiced_critical_event = TRUE|FALSE
│  │  ├─ Update deals.spiced_decision_process = TRUE|FALSE
│  │  ├─ Update deals.spiced_decision_criteria = TRUE|FALSE
│  │  └─ Calculate spiced_score = (completed_components / 6) * 100
│  │
│  └─ Add to ai_insights:
│     └─ "Discovery incomplete - missing [component names]"
│
├─ STAKEHOLDER TRACKING
│  ├─ When new contact added to deal:
│  │  ├─ Create deal_stakeholder record
│  │  ├─ Identify role (champion, decision_maker, influencer, blocker, user)
│  │  ├─ Track engagement_level based on meeting participation
│  │  └─ Calculate deal multi-threading depth
│  │
│  └─ AI alert if < 2 stakeholders:
│     └─ Add to ai_insights: "Low engagement depth - multi-thread to [role]"
│
├─ DAILY MAINTENANCE (11 PM ET)
│  ├─ For each open deal:
│  │  ├─ Increment days_in_stage
│  │  ├─ Check if expected_close_date approaching
│  │  ├─ Recalculate ai_win_probability
│  │  ├─ Update risk_factors if conditions change
│  │  └─ Generate ai_insights
│  │
│  └─ Create ai_recommendations for:
│     ├─ At-risk deals (risk_level = 'high' or 'critical')
│     ├─ Stalled deals (days_in_stage > median for that stage)
│     ├─ Deals needing multi-threading (stakeholder_count < 2)
│     └─ Deals with unaddressed objections
│
└─ DATA SOURCES
   ├─ deals table (primary)
   ├─ meetings (call records & sentiment)
   ├─ transcripts (SPICED detection, objection analysis)
   ├─ deal_stakeholders (relationship tracking)
   ├─ contacts (stakeholder info)
   └─ AI/ML models (NLP for insights, scoring)
```

---

### Component 8: Call Details Viewer

**1. Purpose**
- Admin view of individual call with full analytics
- Call playback & transcript
- AI analysis & compliance checks
- Export & sharing capabilities

**2. Data Displayed**

```
Call Metadata:
- Title/Deal name
- Rep name
- Contact name
- Company
- Date & time
- Duration
- Deal value & stage
- Recording: Available/Unavailable

Analytics Tabs:
├─ Insights:
│  ├─ AI summary
│  ├─ Call outcome
│  ├─ Key moments
│  ├─ Objections identified
│  ├─ Buying signals
│  ├─ Next steps
│  └─ Recommended follow-ups
│
├─ Quality:
│  ├─ Audio quality: 95% (excellent)
│  ├─ Transcript accuracy: 92%
│  ├─ Recording stability: 100%
│  ├─ Engagement score: 8.7/10
│  └─ Talk listen ratio: 42:58
│
├─ Sentiment:
│  ├─ Overall sentiment
│  ├─ Sentiment timeline
│  ├─ Tone analysis
│  └─ Engagement trends
│
├─ Keywords:
│  ├─ Most mentioned terms
│  ├─ Competitor mentions
│  ├─ Budget indicators
│  ├─ Timeline clues
│  └─ Pain point keywords
│
├─ Benchmarks:
│  ├─ vs rep average
│  ├─ vs department average
│  ├─ vs organization average
│  ├─ vs industry standards
│  └─ Improvement suggestions
│
├─ Transcript:
│  ├─ Full transcript
│  ├─ Editable subtitles
│  └─ Speaker identification
│
├─ Notes:
│  ├─ Admin notes
│  ├─ Coaching points
│  ├─ Action items
│  └─ Deal stage updates
│
├─ Export:
│  ├─ Download transcript
│  ├─ Export call summary
│  ├─ Sync to CRM
│  └─ Share call insights
│
└─ Chat:
    ├─ AI chatbot
    ├─ Ask questions about call
    ├─ Get recommendations
    └─ Generate follow-up content
```

**3. Backend Source**
- **Primary Service:** Call Analytics Service
- **Secondary Services:** Transcription, AI Analysis, CRM Integration

**4. Database Tables**

```
Main Tables:
├── meetings
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── title
│   ├── owner_id (FK → users.id / rep)
│   ├── account_id (FK)
│   ├── deal_id (FK)
│   ├── recording_url
│   ├── has_recording
│   ├── has_transcript
│   ├── transcript_id (FK)
│   ├── scheduled_start_time
│   ├── actual_start_time
│   ├── actual_end_time
│   ├── duration_minutes
│   ├── ai_score
│   ├── sentiment
│   ├── engagement_score
│   ├── talk_listen_ratio
│   ├── questions_asked
│   ├── longest_monologue_seconds
│   ├── key_topics (JSONB)
│   ├── action_items (JSONB)
│   ├── pain_points (JSONB)
│   ├── buying_signals (JSONB)
│   ├── objections (JSONB)
│   ├── competitors_mentioned (JSONB)
│   ├── next_steps
│   ├── status ('scheduled', 'completed', 'cancelled', 'no_show')
│   └── outcome ('positive', 'neutral', 'negative', 'unclear')
│
├── transcripts
│   ├── id (PK)
│   ├── meeting_id (FK)
│   ├── organization_id (FK)
│   ├── full_transcript
│   ├── transcript_json (JSONB - timestamped segments)
│   ├── processing_status ('pending', 'processing', 'completed', 'failed')
│   ├── language
│   ├── confidence_score
│   ├── ai_summary
│   ├── executive_summary
│   ├── processed_at
│   ├── processing_duration_seconds
│   ├── word_count
│   └── created_at
│
├── transcript_moments
│   ├── id (PK)
│   ├── transcript_id (FK)
│   ├── meeting_id (FK)
│   ├── moment_type ('objection', 'buying_signal', 'pain_point', etc.)
│   ├── title
│   ├── content
│   ├── start_time_seconds
│   ├── end_time_seconds
│   ├── speaker_name
│   ├── speaker_type ('rep', 'prospect')
│   ├── sentiment
│   ├── importance_score
│   └── created_at
│
├── users
│   ├── id (PK)
│   ├── full_name
│   ├── email
│   ├── avatar_url
│   └── role
│
├── contacts
│   ├── id (PK)
│   ├── full_name
│   ├── title
│   ├── email
│   └── phone
│
├── accounts
│   ├── id (PK)
│   ├── name
│   ├── industry
│   └── website
│
├── deals
│   ├── id (PK)
│   ├── name
│   ├── amount
│   ├── stage
│   └── probability
│
├── meeting_quality_metrics
│   ├── id (PK)
│   ├── meeting_id (FK)
│   ├── audio_quality_score
│   ├── transcript_accuracy_score
│   ├── recording_stability_score
│   ├── engagement_score
│   ├── calculated_at
│   └── created_at
│
└── call_compliance
    ├── id (PK)
    ├── meeting_id (FK)
    ├── compliance_status ('compliant', 'warning', 'violation')
    ├── recording_consent
    ├── data_handling_compliant
    ├── regulatory_flags
    ├── notes
    └── checked_at
```

**5. Query Logic**

```sql
-- Call Details Full View
SELECT 
  m.id,
  m.title,
  u_rep.full_name as rep_name,
  u_rep.email as rep_email,
  c.full_name as contact_name,
  c.title as contact_title,
  c.email as contact_email,
  a.name as account_name,
  a.industry,
  d.name as deal_name,
  d.amount as deal_value,
  d.stage as deal_stage,
  d.probability as deal_probability,
  m.scheduled_start_time,
  m.actual_start_time,
  m.actual_end_time,
  m.duration_minutes,
  m.recording_url,
  m.has_recording,
  m.has_transcript,
  m.ai_score,
  m.sentiment,
  m.engagement_score,
  m.talk_listen_ratio,
  m.questions_asked,
  m.longest_monologue_seconds,
  m.key_topics,
  m.action_items,
  m.pain_points,
  m.buying_signals,
  m.objections,
  m.competitors_mentioned,
  m.next_steps,
  m.status,
  m.outcome,
  
  -- Quality Metrics
  COALESCE((SELECT audio_quality_score FROM meeting_quality_metrics 
    WHERE meeting_id = m.id LIMIT 1), 0) as audio_quality,
  COALESCE((SELECT transcript_accuracy_score FROM meeting_quality_metrics 
    WHERE meeting_id = m.id LIMIT 1), 0) as transcript_accuracy,
  COALESCE((SELECT recording_stability_score FROM meeting_quality_metrics 
    WHERE meeting_id = m.id LIMIT 1), 0) as recording_stability,
    
  -- Transcript Data
  t.full_transcript,
  t.transcript_json,
  t.ai_summary,
  t.executive_summary,
  
  -- Compliance
  cc.compliance_status,
  cc.regulatory_flags

FROM meetings m
LEFT JOIN users u_rep ON m.owner_id = u_rep.id
LEFT JOIN contacts c ON EXISTS (
  SELECT 1 FROM meeting_participants mp 
  WHERE mp.meeting_id = m.id AND mp.contact_id = c.id LIMIT 1
)
LEFT JOIN accounts a ON m.account_id = a.id
LEFT JOIN deals d ON m.deal_id = d.id
LEFT JOIN transcripts t ON m.transcript_id = t.id
LEFT JOIN call_compliance cc ON m.id = cc.meeting_id

WHERE m.id = ? AND m.organization_id = ?;

-- Transcript Moments (for highlighting segments)
SELECT 
  id,
  moment_type,
  title,
  content,
  start_time_seconds,
  end_time_seconds,
  speaker_name,
  sentiment,
  importance_score

FROM transcript_moments

WHERE meeting_id = ?

ORDER BY start_time_seconds ASC;
```

**6. Data Ingestion Flow**

```
FLOW: Call Recording & Analytics Pipeline
│
├─ CALL INITIATION
│  ├─ Meeting scheduled (API: POST /api/meetings)
│  ├─ Zoom/Teams/Google Meet integration detects meeting
│  ├─ Store in meetings table with status = 'scheduled'
│  └─ Generate meeting_url if not already set
│
├─ CALL COMPLETION
│  ├─ Meeting ends (actual_end_time recorded)
│  ├─ AI detects meeting conclusion from Zoom/Teams webhooks
│  └─ Trigger recording upload process
│
├─ RECORDING CAPTURE & UPLOAD
│  ├─ Step 1: Recording saved by conferencing platform
│  ├─ Step 2: Webhook notifies Tasknova backend
│  ├─ Step 3: Download recording from Zoom/Teams/Google
│  ├─ Step 4: Upload to S3:
│  │  └─ Path: s3://tasknova-calls/{org_id}/{meeting_id}/{timestamp}.webm
│  ├─ Step 5: Update meetings.recording_url
│  ├─ Step 6: Update meetings.has_recording = TRUE
│  └─ Step 7: Trigger transcription & analysis
│
├─ TRANSCRIPTION PIPELINE (Parallel jobs)
│  ├─ Job 1: Speech-to-Text
│  │  ├─ Service: Google Cloud Speech-to-Text OR AWS Transcribe
│  │  ├─ Input: Recording from S3
│  │  ├─ Output: full_transcript (text), transcript_json (timestamped)
│  │  ├─ Processing time: ~1-2x call duration (depends on length)
│  │  ├─ Update transcripts.processing_status = 'processing'
│  │  └─ Store result in transcripts.full_transcript & transcript_json
│  │
│  ├─ Job 2: Speaker Identification
│  │  ├─ Identify who is speaking (rep vs prospect)
│  │  ├─ Extract speaker names from context or detection
│  │  ├─ Segment transcript_json by speaker
│  │  └─ Store meeting_participants data
│  │
│  ├─ Job 3: Call Quality Analysis
│  │  ├─ Analyze audio quality metrics
│  │  ├─ Calculate audio_quality_score (0-100)
│  │  ├─ Calculate transcript_accuracy_score (0-100)
│  │  ├─ Calculate recording_stability_score (0-100)
│  │  ├─ Create meeting_quality_metrics record
│  │  └─ Update meetings.engagement_score
│  │
│  └─ Job 4: Moment Detection & Extraction
│     ├─ Run transcript through keyword detection models
│     ├─ Identify moments:
│     │  ├─ Objections: "That's expensive", "We need to evaluate", etc.
│     │  ├─ Buying signals: "We're ready to move forward", budget confirmed, etc.
│     │  ├─ Pain points: "Our current system...", "We're struggling with..."
│     │  ├─ Competitor mentions: "vs Salesforce", "unlike HubSpot"
│     │  ├─ Timeline indicators: "Next quarter", "By end of month"
│     │  └─ Budget indicators: "We've allocated $X"
│     │
│     ├─ Create transcript_moments records:
│     │  ├─ moment_type, title, content
│     │  ├─ start_time_seconds, end_time_seconds
│     │  ├─ speaker_name, speaker_type
│     │  ├─ sentiment analysis
│     │  └─ importance_score
│     │
│     └─ Store highlighted segments for UI display
│
├─ AI ANALYSIS (Core insights)
│  ├─ NLP Analysis:
│  │  ├─ Overall sentiment: positive/neutral/negative
│  │  ├─ Engagement assessment (talk patterns, questions, interruptions)
│  │  ├─ Pain point extraction
│  │  ├─ Budget mentions & financial discussion
│  │  ├─ Timeline expectations
│  │  └─ Decision-maker identification
│  │
│  ├─ Conversation Metrics:
│  │  ├─ Calculate talk_listen_ratio:
│  │  │   └─ talk_listen_ratio = (rep_talk_time / total_call_time) * 100
│  │  ├─ Count questions_asked by rep
│  │  ├─ Identify longest_monologue_seconds
│  │  ├─ Calculate engagement_score based on:
│  │  │   ├─ Question frequency & quality
│  │  │   ├─ Listening ratio (58% listen = good)
│  │  │   ├─ Prospect engagement level
│  │  │   └─ Objection handling effectiveness
│  │  │
│  │  └─ Engagement formula:
│  │      engagement_score = 
│  │        (0.4 * listening_score + 
│  │         0.3 * question_quality +
│  │         0.2 * prospect_engagement +
│  │         0.1 * lack_of_sales_pitch) * 100
│  │
│  ├─ Deal Insights:
│  │  ├─ Buying readiness assessment
│  │  ├─ Stakeholder identification
│  │  ├─ Next steps clarity
│  │  ├─ Risk factors identified
│  │  └─ Recommended follow-ups
│  │
│  └─ Create ai_summary & action_items
│
├─ COMPLIANCE CHECKING
│  ├─ Record consent verification
│  ├─ Data handling compliance check
│  ├─ Regulatory flag detection
│  ├─ GDPR/CCPA compliance scan
│  ├─ Store in call_compliance table
│  └─ Update meetings.compliance_status
│
├─ BENCHMARKING & COMPARISON
│  ├─ Compare against:
│  │  ├─ Rep's own average (all reps)
│  │  ├─ Department average (same department)
│  │  ├─ Organization average (all orgs)
│  │  └─ Industry standards (anonymized data)
│  │
│  └─ Calculate:
│     ├─ How rep performed vs averages
│     ├─ Coaching recommendations based on gaps
│     └─ Store in benchmarking data for UI display
│
├─ FINALIZATION
│  ├─ Update meetings table:
│  │  ├─ meetings.has_transcript = TRUE
│  │  ├─ meetings.ai_score = calculated value
│  │  ├─ meetings.sentiment = sentiment result
│  │  ├─ meetings.engagement_score = score
│  │  ├─ meetings.key_topics = extracted topics
│  │  ├─ meetings.action_items = generated action items
│  │  ├─ meetings.objections = JSONB array
│  │  ├─ meetings.buying_signals = JSONB array
│  │  └─ meetings.outcome = determined outcome
│  │
│  ├─ Update transcripts table:
│  │  ├─ transcripts.processing_status = 'completed'
│  │  ├─ transcripts.processed_at = NOW()
│  │  └─ transcripts.processing_duration_seconds = duration
│  │
│  └─ Generate ai_recommendations for rep/manager
│     ├─ Areas of strength
│     ├─ Coaching opportunities
│     ├─ Next steps for deal
│     └─ Follow-up content suggestions
│
├─ NOTIFICATION & CONTEXT MANAGEMENT
│  ├─ If meeting outcome = positive:
│  │  ├─ Notify manager of high-performing call
│  │  └─ Add talking point to coaching insights
│  │
│  ├─ If objections detected:
│  │  ├─ Create ai_recommendation: "Address [objection]"
│  │  ├─ Suggest follow-up content
│  │  └─ Flag for manager review
│  │
│  └─ If no buying signals:
│     ├─ Create ai_recommendation: "Reassess fit or persistence strategy"
│     ├─ Flag deal as at-risk
│     └─ Suggest next meeting content
│
└─ DATA SOURCES
   ├─ meetings table (primary)
   ├─ Zoom/Teams recording storage
   ├─ Speech-to-Text APIs
   ├─ Transcript analysis (custom NLP models)
   ├─ Compliance checking systems
   └── CRM integration (for context)
```

---

## SECTION 5: REMAINING COMPONENTS - COMPONENTS 9-12

### Component 9: Reports & Export Hub

**Data Sources:** All aggregated tables  
**API Endpoints:** GET /api/reports, POST /api/reports/generate, POST /api/reports/email, GET /api/reports/download  
**Triggers:** On-demand or scheduled (cron jobs)

### Component 10: System Health Monitor

**Data Sources:** system_health_metrics, monitoring services (Datadog, New Relic)  
**Update Frequency:** Every 5 minutes  
**API Endpoints:** GET /api/system/health, GET /api/system/services

### Component 11: Platform Usage Intelligence

**Data Sources:** platform_usage_logs, ai_feature_adoption  
**Update Frequency:** Real-time logging, hourly aggregation  
**API Endpoints:** GET /api/usage/adoption, GET /api/usage/active-users

### Component 12: Team Management Interface

**Data Sources:** users table, departments table  
**Triggers:** CRUD operations  
**API Endpoints:** GET/POST/PATCH/DELETE /api/users, GET /api/departments

---

## SECTION 6: COMPLETE DATABASE SCHEMA - CRITICAL TABLES

```sql
-- Essential Relationships Diagram
organizations
├─ departments
│  ├─ users (reps)
│  ├─ users (manager)
│  └─ team_performance_metrics
├─ users (all)
│  ├─ user_performance_metrics
│  ├─ deals (as owner)
│  ├─ meetings (as owner)
│  ├─ coaching_sessions (as manager or rep)
│  └─ activities
├─ accounts
│  ├─ contacts
│  ├─ deals
│  └─ meetings
├─ deals
│  ├─ deal_stakeholders
│  ├─ deal_stage_history
│  ├─ meetings
│  ├─ transcript_moments
│  └─ ai_recommendations
├─ meetings
│  ├─ transcripts
│  ├─ transcript_moments
│  ├─ meeting_participants
│  ├─ meeting_quality_metrics
│  ├─ call_compliance
│  └─ ai_recommendations
├─ transcripts
│  └─ transcript_moments
├─ coaching_sessions
│  ├─ coaching_insights
│  └─ ai_recommendations
├─ platform_usage_logs
│  └─ platform_usage_logs (daily rollup)
└─ ai_feature_adoption
```

---

## SECTION 7: KEY API ENDPOINTS FOR ADMIN DASHBOARD

```
AUTHENTICATION
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

ORGANIZATION METRICS
GET    /api/org/overview              (KPI Cards data)
GET    /api/org/metrics/quarter       (Period-specific metrics)
GET    /api/org/departments           (Department Performance)
GET    /api/org/conversation-analytics (Call Insights)
GET    /api/org/top-performers        (Leaderboard)
GET    /api/org/coaching-opportunities

TEAM MANAGEMENT
GET    /api/managers                  (All managers)
GET    /api/managers/:id              (Manager Performance)
GET    /api/managers/:id/deals        (Manager Deals)
GET    /api/managers/:id/team         (Manager's team members)
POST   /api/users                     (Create user)
PATCH  /api/users/:id                (Update user)
DELETE /api/users/:id               (Delete user)

DEALS
GET    /api/deals                     (All deals by filters)
GET    /api/deals/:id                (Deal details)
PATCH  /api/deals/:id                (Update deal)
GET    /api/deals/stages/:stage      (Deals by stage)
POST   /api/deals/:id/stakeholders   (Add stakeholder)

CALLS & MEETINGS
GET    /api/calls                     (All calls with analytic)
GET    /api/calls/:id               (Call details)
GET    /api/calls/:id/transcript    (Get transcript)
GET    /api/calls/:id/moments       (Get key moments)
POST   /api/calls/:id/notes         (Add call notes)
POST   /api/calls/:id/export        (Export call data)

REPORTS
GET    /api/reports                  (Available reports)
POST   /api/reports/generate         (Generate custom report)
POST   /api/reports/:id/email        (Email report)
GET    /api/reports/:id/download    (Download report)

ANALYTICS
GET    /api/analytics/org-overview
GET    /api/analytics/department/:id
GET    /api/analytics/user/:id
GET    /api/analytics/forecast
GET    /api/analytics/pipeline
GET    /api/analytics/coaching-impact

SYSTEM
GET    /api/system/health           (System health)
GET    /api/system/services         (Service status)
GET    /api/usage/adoption          (Platform adoption)
GET    /api/usage/active-users      (Active user stats)
```

---

## SECTION 8: DATA AGGREGATION SCHEDULE

```
REAL-TIME (Continuous)
├─ User login/logout → updates users.last_login_at
├─ Activity creation → updates activities table
├─ Meeting completion → triggers transcription & AI analysis
├─ Deal stage change → updates deals + deal_stage_history
└─ Call recording upload → starts processing

HOURLY (Every hour)
├─ Aggregate user activities to hourly snapshot
├─ Calculate rolling team metrics
├─ Update platform_usage_logs summary
└─ Check system health metrics

DAILY (11 PM ET)
├─ Calculate daily user_performance_metrics
├─ Aggregate to team_performance_metrics
├─ Aggregate to organization level
├─ Detect coaching opportunities
├─ Final reconciliation of all metrics
├─ Update forecast_snapshots
└─ Generate daily alerts & recommendations

WEEKLY (Sunday 11 PM ET)
├─ Calculate week-to-date metrics
├─ Generate coaching insights
├─ Identify top performers
├─ Calculate team trends
└─ Prepare weekly reports

MONTHLY (Last day  11 PM ET)
├─ Finalize monthly user_performance_metrics
├─ Complete monthly reporting
├─ Calculate month-over-month trends
└─ Archive old data to cold storage

QUARTERLY (Q1/Q2/Q3/Q4 last day 11 PM ET)
├─ Calculate quarterly user_performance_metrics
├─ Final quota attainment calculations
├─ Calculate quarterly forecast accuracy
├─ Generate board-level reports
└─ Reset period-based metrics for next quarter

ON-DEMAND
├─ Generate custom reports
├─ Export dashboards
├─ Email reports
└─ Bulk data operations
```

---

## SECTION 9: SUMMARY TABLE DEPENDENCIES

| Dashboard Component | Primary Tables | Secondary Tables | Update Frequency | Critical for |
|-------------------|---|---|---|---|
| KPI Cards | user_performance_metrics, team_performance_metrics, users, platform_usage_logs | organizations, system_health_metrics | Daily | Exec view |
| Department Performance | team_performance_metrics, departments, users | user_performance_metrics | Daily | Manager accountability |
| Conversation Analytics | meetings, transcripts, user_performance_metrics | transcript_moments, teams | Real-time | Quality tracking |
| Top Performers | user_performance_metrics, users, departments | deals | Daily | Motivation & rewards |
| Coaching Opportunities | coaching_insights, meetings, deals, transcript_moments | users, departments, transcripts | Real-time | Improvement |
| Manager Performance | team_performance_metrics, user_performance_metrics, coaching_sessions | users, deals, meetings | Hourly | Manager evaluation |
| Manager Deals | deals, accounts, deal_stakeholders, deal_stage_history | contacts, meetings, users, deals_ai_insights | Real-time | Pipeline health |
| Call Details | meetings, transcripts, transcript_moments, meeting_quality_metrics | users, contacts, accounts, deals, call_compliance | Real-time | Call analysis |
| Reports | All aggregation tables | All transaction tables | On-demand | Executive reporting |
| System Health | system_health_metrics, monitoring services | All tables (for system load) | Every 5 min | Infrastructure |
| Platform Usage | platform_usage_logs, ai_feature_adoption | users, organizations | Real-time | Adoption tracking |
| Team Management | users, departments | organizations, user_roles | Real-time | Team setup |

---

## SECTION 10: CRITICAL BUSINESS LOGIC

```
QUOTA ATTAINMENT CALCULATION (Most important metric)
├─ Source deal value: deals.amount WHERE stage = 'closed_won' AND actual_close_date IN current_period
├─ Sum by user_id
├─ Compare to users.quota_target for that period
├─ Calculate: (SUM(deal_amount) / quota_target) * 100
├─ Store in: user_performance_metrics.quota_attainment_percentage
└─ Aggregate to: team_performance_metrics.team_quota_attainment

AI CALL SCORE CALCULATION
├─ Inputs:
│  ├─ talk_listen_ratio (target: 42% talk, 58% listen)
│  ├─ questions_asked (target: 15+ questions per hour)
│  ├─ longest_monologue_seconds (target: < 3 mins)
│  ├─ engagement_score (target: > 85%)
│  ├─ sentiment_positive_ratio
│  └─ objection_handling_effectiveness
├─ Weighted formula:
│   ai_call_score = (0.25 * questions_quality + 
│                    0.25 * listening_score + 
│                    0.20 * engagement +
│                    0.15 * sentiment +
│                    0.10 * objection_handling +
│                    0.05 * deal_advancement) * 100
└─ Store in: meetings.ai_score

FORECAST ACCURACY CALCULATION
├─ At quarter start: capture forecast_snapshots (commit, best_case, pipeline)
├─ At quarter end: compare to actual_closed from deals table
├─ Formula: forecast_accuracy = (deals_matching_forecast / total_forecast_deals) * 100
└─ Store in: forecast_snapshots.forecast_accuracy_percentage

COACHING IMPACT SCORE
├─ Pre-coaching: avg_ai_call_score for 30 days before coaching session
├─ Post-coaching: avg_ai_call_score for 30 days after coaching session
├─ Formula: coaching_impact = ((post_avg - pre_avg) / pre_avg) * 100
├─ Store in: coaching_sessions, team_performance_metrics.coaching_impact_score
└─ Used for: manager effectiveness evaluation

RISK FACTOR DETECTION (Deal-level)
├─ Stalled: days_in_stage > PERCENTILE(days_in_stage) for that stage
├─ No activity: last_activity_at < (TODAY - 7 days)
├─ Weak multi-threading: COUNT(stakeholders) < 2
├─ Unaddressed objections: objections identified but no response in next 2 meetings
├─ Competitor pressure: competitors_mentioned AND deal_probability declining
└─ Formula: risk_level = COUNT(risk_factors) maps to (low|medium|high|critical)
```

---

## SECTION 11: HOW TO USE THIS DOCUMENT

### For Developers
- Use **Section 2 & 4**: Understand component data flows
- Use **Section 6**: Reference database schemas
- Use **Section 7**: Find API endpoints to implement
- Use **Section 8**: Understand aggregation timing

### For Data Engineers
- Use **Section 8**: Data aggregation schedule (real-time, hourly, daily, etc.)
- Use **Section 3 & 9**: Table dependencies and relationships
- Use **Section 10**: Business calculations for pipeline design
- Use **Section 6**: Schema structure

### For DevOps/Infrastructure
- Use **Section 8**: Aggregation schedule for capacity planning
- Use **Section 9**: Understand data volume by component
- Use **Component 10 (Section 5)**: System health monitoring requirements

### For Product/Leadership
- Use **Section 1**: Component overview (what dashboard shows)
- Use **Component grouping (Section 1.2)**: Understand functional layers
- Use **Section 3**: Key metrics and calculations
- Use **Section 10**: Understanding critical business logic

### For Data Scientists
- Use **Section 10**: AI/ML algorithms (call scoring, risk detection, coaching impact)
- Use **Section 4 (Component 8)**: Call analysis pipeline
- Use **Section 8**: Training data requirements (daily aggregations)

---

**END OF PART 1**

---

## NEXT STEPS FOR BACKEND ENGINEERS

1. **Database Setup**
   - Execute all SQL schemas from BACKEND_ARCHITECTURE.md
   - Set up indexes for performance
   - Configure RLS policies for multi-tenant security

2. **API Development**
   - Implement REST/GraphQL endpoints from Section 7
   - Add authentication & authorization
   - Implement pagination & filtering

3. **Data Pipeline**
   - Set up scheduled jobs (hourly, daily aggregations)
   - Configure message queues for async processing
   - Implement transcription & AI analysis pipelines

4. **AI/ML Integration**
   - Integrate Speech-to-Text service
   - Train NLP models for call analysis
   - Implement deal scoring models

5. **Monitoring & Observability**
   - Set up system health monitoring
   - Configure logging & metrics collection
   - Create alerting for critical issues

6. **Performance Optimization**
   - Cache heavily-used aggregations (Redis/Memcached)
   - Optimize queries with proper indexing
   - Partition large tables by date/organization

7. **Testing**
   - Unit tests for all calculations
   - Integration tests for data pipelines
   - Load testing for dashboard queries

# Admin Dashboard - MISSING COMPONENTS
## Complete Coverage of Today's Schedule, Tasks, Follow-ups, AI Adoption, Sentiment & System Health

---

## SECTION 13: TODAY'S SCHEDULE (Admin Agenda)

### 1. Purpose
- Display admin's scheduled meetings for today
- Provide quick access to upcoming meetings
- Show meeting context (attendees, topics, deal value)
- Enable rapid meeting navigation

### 2. Data Displayed

```
Example Today's Agenda (4 meetings):

1. 9:30 AM - 60 min | Executive Leadership Meeting
   Type: Leadership
   Attendees: CEO, CRO, CFO, COO
   Deal Value: None
   Focus Areas: Q1 performance review, Q2 strategic planning

2. 11:00 AM - 45 min | Revenue Operations Review
   Type: Operations
   Attendees: All Sales Managers, RevOps Team
   Deal Value: $14.0M
   Focus Areas: Pipeline health, Forecast accuracy

3. 1:30 PM - 30 min | Platform Performance Sync
   Type: Technical
   Attendees: Engineering Lead, Product Manager
   Deal Value: None
   Focus Areas: System health, Feature roadmap

4. 3:00 PM - 45 min | Board Preparation Meeting
   Type: Strategic
   Attendees: CEO, CFO, CRO
   Deal Value: None
   Focus Areas: Q1 metrics package, Growth trajectory
```

### 3. Backend Source
- **Primary Service:** Calendar Integration Service
- **Secondary Services:** Meeting Management, User Profile Service

### 4. Database Tables

```
Main Tables:
├── meetings
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── title
│   ├── meeting_type ('leadership', 'operations', 'technical', 'strategic')
│   ├── owner_id (FK → users.id / admin)
│   ├── scheduled_start_time
│   ├── scheduled_end_time
│   ├── duration_minutes
│   ├── meeting_url
│   ├── deal_id (FK) [optional - for revenue-related meetings]
│   ├── is_internal_meeting
│   └── status ('scheduled', 'completed', 'cancelled')
│
├── meeting_participants
│   ├── id (PK)
│   ├── meeting_id (FK)
│   ├── user_id (FK) [for internal attendees]
│   ├── name (for external attendees)
│   ├── email
│   ├── participant_type ('organizer', 'required', 'optional')
│   └── attendance_status
│
└── deals (optional link)
    ├── id (PK)
    ├── amount (for deal_value)
    └── name
```

### 5. Query Logic

```sql
-- Admin Today's Schedule
SELECT 
  m.id,
  m.title,
  m.meeting_type,
  m.scheduled_start_time,
  m.scheduled_end_time,
  m.duration_minutes,
  m.meeting_url,
  COALESCE(d.amount, 0) as deal_value,
  d.name as deal_name,
  STRING_AGG(
    CASE 
      WHEN mp.user_id IS NOT NULL THEN u.full_name
      ELSE mp.name
    END, 
    ', '
  ) as attendees,
  -- Meeting focus areas would be stored in a custom field or metadata
  m.notes as focus_areas

FROM meetings m
LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id
LEFT JOIN users u ON mp.user_id = u.id
LEFT JOIN deals d ON m.deal_id = d.id

WHERE m.owner_id = ?  -- Admin user ID
  AND DATE(m.scheduled_start_time) = CURRENT_DATE
  AND m.status IN ('scheduled', 'in_progress')
  AND m.organization_id = ?

GROUP BY m.id, m.title, m.meeting_type, m.scheduled_start_time, 
         m.scheduled_end_time, m.duration_minutes, m.meeting_url,
         d.amount, d.name, m.notes

ORDER BY m.scheduled_start_time ASC;
```

### 6. Data Ingestion Flow

```
FLOW: Calendar Sync & Meeting Creation
│
├─ CALENDAR INTEGRATION
│  ├─ Source: Google Calendar API / Microsoft Outlook API / Zoom Webhooks
│  ├─ Sync trigger: Real-time webhooks + hourly reconciliation
│  ├─ Process:
│  │  ├─ Detect when meetings are created/updated/deleted
│  │  ├─ Extract meeting metadata:
│  │  │  ├─ title, time, attendees, location/URL, description
│  │  │  └─ Store in meetings table
│  │  ├─ Extract attendee list:
│  │  │  ├─ Query calendar attendee data
│  │  │  ├─ Match to users table (if internal)
│  │  │  └─ Create meeting_participants records
│  │  └─ Link to deals if meeting context mentions deal
│  │
│  └─ Trigger: Calendar webhook (real-time) or sync job (hourly)
│
├─ ADMIN MEETING CREATION (Manual)
│  ├─ Admin creates meeting via Tasknova OR external calendar
│  ├─ If created in Tasknova:
│  │  ├─ Insert into meetings table with owner_id = admin
│  │  └─ Sync to Google Calendar / Outlook via API
│  │
│  └─ If created in external calendar:
│     ├─ Calendar integration detects new event
│     ├─ Automatically syncs to meetings table
│     └─ Associates with admin user
│
├─ MEETING FOCUS AREAS
│  ├─ Extracted from:
│  │  ├─ Meeting title/description
│  │  ├─ Meeting type classification (leadership, operations, etc.)
│  │  ├─ Linked deal properties
│  │  └─ Attendee roles (if CRO = revenue focus, etc.)
│  │
│  └─ AI parsing:
│     ├─ NLP extraction of key topics from meeting description
│     ├─ Suggest focus areas based on attendees & context
│     └─ Store in meetings.notes or custom metadata JSONB field
│
├─ MEETING DEAL LINKING
│  ├─ Automatic detection:
│  │  ├─ IF meeting attendees include deal contacts → link to deal
│  │  ├─ IF meeting title mentions deal name → link to deal
│  │  ├─ IF meeting description mentions revenue → likely revenue meeting
│  │  └─ Suggest deal_id for admin confirmation
│  │
│  └─ Manual override: Admin can manually select deal
│
├─ DATA SOURCES
│  ├─ Google Calendar API
│  ├─ Microsoft Outlook API
│  ├─ Zoom API (for scheduled Zoom meetings)
│  ├─ meetings table (Tasknova internal)
│  └─ Users table (for attendee matching)
│
└─ DISPLAY ON DASHBOARD
   ├─ Filter: DATE(scheduled_start_time) = CURRENT_DATE
   ├─ Filter: owner_id = current_admin_user
   ├─ Sort: scheduled_start_time ASC
   └─ Show: title, time, duration, attendees, deal_value, focus_areas
```

---

## SECTION 14: TODAY'S TASKS (Admin Task List)

### 1. Purpose
- Display admin's task list for today
- Prioritize critical action items
- Show task status and due times
- Enable quick task completion

### 2. Data Displayed

```
Example Today's Tasks (5 tasks):

1. PRIORITY: HIGH, STATUS: IN-PROGRESS, DUE: Before 3:00 PM
   "Review Q1 performance package for board meeting"
   Department: None
   
2. PRIORITY: HIGH, STATUS: TODO, DUE: 12:00 PM
   "Approve Enterprise Sales budget increase request"
   Department: Enterprise Sales
   
3. PRIORITY: HIGH, STATUS: TODO, DUE: 2:00 PM
   "Review system uptime report and scaling plan"
   Department: Engineering
   
4. PRIORITY: MEDIUM, STATUS: IN-PROGRESS, DUE: EOD
   "Finalize Q2 territory assignments for all departments"
   Department: None
   
5. PRIORITY: MEDIUM, STATUS: TODO, DUE: EOD
   "Sign off on new pricing structure for SMB segment"
   Department: SMB Sales
```

### 3. Backend Source
- **Primary Service:** Task Management Service
- **Secondary Services:** Assignment Engine, Notification Service

### 4. Database Tables

```
Main Tables:
├── tasks
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── title
│   ├── description
│   ├── assigned_to (FK → users.id / admin)
│   ├── created_by (FK → users.id)
│   ├── department_id (FK) [optional - for department-specific tasks]
│   ├── priority ('high', 'medium', 'low')
│   ├── status ('todo', 'in_progress', 'completed', 'cancelled')
│   ├── due_date
│   ├── due_time (varchar - 'EOD', '12:00 PM', '3:00 PM', etc.)
│   ├── completed_at
│   ├── created_at
│   └── updated_at
│
├── users
│   ├── id (PK)
│   └── full_name
│
└── departments
    ├── id (PK)
    └── name
```

### 5. Query Logic

```sql
-- Admin Today's Task List
SELECT 
  t.id,
  t.title,
  t.description,
  t.priority,
  t.status,
  t.due_date,
  t.due_time,
  d.name as department_name,
  u_creator.full_name as created_by,
  CASE 
    WHEN t.due_time = 'EOD' THEN '17:00'
    WHEN t.due_time LIKE '%:00 %' THEN t.due_time
    ELSE NULL
  END as due_time_24h,
  CASE
    WHEN t.due_time = 'EOD' AND CURRENT_TIME > '17:00:00' THEN 'OVERDUE'
    WHEN t.due_date = CURRENT_DATE AND CURRENT_TIME > CAST(t.due_time AS TIME) THEN 'OVERDUE'
    WHEN t.due_date = CURRENT_DATE THEN 'DUE_TODAY'
    ELSE 'ON_TRACK'
  END as due_status

FROM tasks t
LEFT JOIN departments d ON t.department_id = d.id
LEFT JOIN users u_creator ON t.created_by = u_creator.id

WHERE t.assigned_to = ?  -- Admin user ID
  AND DATE(t.due_date) = CURRENT_DATE
  AND t.status IN ('todo', 'in_progress')
  AND t.organization_id = ?

ORDER BY 
  CASE t.priority
    WHEN 'high' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'low' THEN 3
  END ASC,
  t.due_date ASC,
  CASE WHEN t.due_time = 'EOD' THEN '23:59' ELSE t.due_time END ASC;
```

### 6. Data Ingestion Flow

```
FLOW: Task Creation & Assignment
│
├─ TASK CREATION SOURCES
│  ├─ Manual: Admin creates task in Tasknova UI
│  ├─ AI-Generated: System creates recommendations (e.g., at-risk reps)
│  └─ System-Generated: Auto-create from triggers (e.g., budget approvals)
│
├─ TASK ASSIGNMENT
│  ├─ Assign directly to admin user
│  ├─ Create from user workflow:
│  │  ├─ Manager requests approval → auto-create task for admin
│  │  ├─ Budget change needs sign-off → auto-create task
│  │  └─ Deal needs final approval → auto-create task
│  │
│  └─ Link optional department for context
│
├─ PRIORITY CALCULATION
│  ├─ AI-determined based on:
│  │  ├─ Task type (approvals = high, planning = medium)
│  │  ├─ Business impact (revenue impact = high)
│  │  ├─ Deadline proximity (EOD = high urgency)
│  │  └─ Number of stakeholders affected
│  │
│  └─ Can be manually overridden by creator
│
├─ DUE TIME HANDLING
│  ├─ Parse natural language due times:
│  │  ├─ "EOD" → 17:00 (5 PM)
│  │  ├─ "12:00 PM" → 12:00
│  │  ├─ "Before 3:00 PM" → extract 15:00 as deadline
│  │  └─ "2 hours" → CURRENT_TIME + 2 hours
│  │
│  └─ Calculate due_status for display:
│     ├─ OVERDUE: If current time > due_time today
│     ├─ DUE_TODAY: If due_date = today and not overdue
│     └─ ON_TRACK: Otherwise
│
├─ NOTIFICATIONS
│  ├─ Send when task assigned:
│  │  ├─ In-app notification
│  │  ├─ Email notification
│  │  └─ Critical tasks → SMS alert
│  │
│  ├─ Pre-deadline reminders:
│  │  ├─ 1 hour before due time
│  │  ├─ 30 minutes before critical tasks
│  │  └─ At due time if not completed
│  │
│  └─ Task completion notifications:
│     └─ Notify task creator of completion
│
├─ STATUS TRANSITIONS
│  ├─ When admin starts task:
│  │  └─ Update status: todo → in_progress
│  │
│  ├─ When admin completes task:
│  │  ├─ Update status: in_progress → completed
│  │  ├─ Set completed_at = NOW()
│  │  └─ Remove from today's task list
│  │
│  └─ When task cannot be completed:
│     └─ Update status: todo/in_progress → cancelled
│
├─ DATA SOURCES
│  ├─ Manual task creation (UI)
│  ├─ System task generators (workflows)
│  ├─ AI recommendation engine
│  └─ Calendar integration (if meeting creates task)
│
└─ DISPLAY RULES
   ├─ Show: status IN ('todo', 'in_progress')
   ├─ Filter: assigned_to = current_admin AND due_date = TODAY
   ├─ Sort by: priority DESC, due_time ASC
   └─ Highlight: OVERDUE or HIGH priority tasks
```

---

## SECTION 15: FOLLOW-UPS NEEDED (Critical Action Items)

### 1. Purpose
- Display high-priority follow-ups requiring admin action
- Track department-level interventions
- Show business impact of each follow-up
- Enable rapid approvals/decisions

### 2. Data Displayed

```
Example Follow-ups (3 critical items):

1. PRIORITY: URGENT | DUE: Today | Department: Inside Sales | Manager: David Thompson
   Task: "Inside Sales at 78% quota with 2 weeks left in quarter. Schedule intervention meeting to review pipeline and coaching plan."
   Business Value: $400K gap
   Action Button: "Schedule Meeting"

2. PRIORITY: HIGH | DUE: Tomorrow | Department: Strategic Accounts | Manager: Emily Rodriguez
   Task: "Approve $2.9M enterprise deal with custom contract terms. Legal review completed, awaiting final sign-off."
   Business Value: $2.9M
   Action Button: "Review & Approve"

3. PRIORITY: MEDIUM | DUE: Mon, Mar 2 | Department: All Departments | Manager: None
   Task: "Finalize Q2 territory planning and quota assignments. Coordinate with all 5 department managers for alignment."
   Business Value: $16M Q2 target
   Action Button: "Review Planning"
```

### 3. Backend Source
- **Primary Service:** Action Item Management Service
- **Secondary Services:** Alert Engine, Notification Service, Workflow Engine

### 4. Database Tables

```
Main Tables:
├── action_items (new table)
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── title
│   ├── description
│   ├── action_type ('approval', 'scheduling', 'coordination', 'review', 'decision')
│   ├── priority ('urgent', 'high', 'medium', 'low')
│   ├── assigned_to (FK → users.id / admin)
│   ├── created_by (FK → users.id / manager or system)
│   ├── department_id (FK)
│   ├── associated_deal_id (FK) [optional]
│   ├── business_value (DECIMAL) [in dollars]
│   ├── due_date
│   ├── status ('pending', 'in_progress', 'completed', 'dismissed')
│   ├── action_required VARCHAR (button text - 'Schedule Meeting', 'Review & Approve', etc.)
│   ├── context_url TEXT [link to related resource]
│   ├── created_at
│   └── updated_at
│
├── departments
│   ├── id (PK)
│   ├── name
│   └── manager_id (FK)
│
├── deals
│   ├── id (PK)
│   ├── amount (for business_value if deal-related)
│   └── name
│
└── users
    ├── id (PK)
    ├── full_name
    └── role
```

### 5. Query Logic

```sql
-- Critical Follow-ups for Admin
SELECT 
  ai.id,
  ai.title,
  ai.description,
  ai.priority,
  ai.action_type,
  ai.business_value,
  ai.due_date,
  ai.action_required,
  ai.status,
  CASE 
    WHEN ai.due_date < CURRENT_DATE THEN 'OVERDUE'
    WHEN ai.due_date = CURRENT_DATE THEN 'DUE_TODAY'
    WHEN ai.due_date <= CURRENT_DATE + INTERVAL '1 day' THEN 'DUE_TOMORROW'
    ELSE DATE_PART('day', ai.due_date - CURRENT_DATE) || ' days'
  END as due_in,
  d.name as department_name,
  u_manager.full_name as manager_name,
  u_manager.id as manager_id,
  deal.amount as deal_value,
  ai.context_url

FROM action_items ai
LEFT JOIN departments d ON ai.department_id = d.id
LEFT JOIN users u_manager ON d.manager_id = u_manager.id
LEFT JOIN deals deal ON ai.associated_deal_id = deal.id

WHERE ai.assigned_to = ?  -- Admin user ID
  AND ai.status IN ('pending', 'in_progress')
  AND ai.organization_id = ?
  AND ai.priority IN ('urgent', 'high')  -- Show critical items

ORDER BY 
  CASE ai.priority
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    ELSE 3
  END ASC,
  ai.due_date ASC,
  ai.business_value DESC;
```

### 6. Data Ingestion Flow

```
FLOW: Action Item Detection & Generation
│
├─ PERFORMANCE MONITORING (Continuous)
│  ├─ System monitors key metrics:
│  │  ├─ Department quota attainment
│  │  ├─ Reps falling below 80% → at-risk flag
│  │  ├─ Deal probability changes (declining)
│  │  ├─ Pipeline health metrics
│  │  └─ System health alerts
│  │
│  └─ When threshold reached:
│     ├─ Trigger: "Inside Sales quota dropped to 78%"
│     ├─ Create action_item: "Intervention meeting needed"
│     ├─ Priority: URGENT (affects Q2 close)
│     ├─ Due: TODAY (2 weeks left in quarter)
│     ├─ Business Value: $400K (quota gap)
│     └─ Action: "Schedule Meeting"
│
├─ DEAL-RELATED ACTION ITEMS
│  ├─ When deal reaches certain stage & meets criteria:
│  │  ├─ IF stage = 'negotiation' AND amount > $1M THEN
│  │  ├─ IF legal_review_completed = TRUE THEN
│  │  └─ Create action_item: "Approve $XM enterprise deal"
│  │
│  └─ Escalation rules:
│     ├─ IF amount > $2M → approve by admin
│     ├─ IF amount > $5M → approve by CRO + admin
│     └─ IF amount < $500K → approve by manager
│
├─ STRATEGIC COORDINATION
│  ├─ When new business period starts:
│  │  ├─ Create action_item: "Finalize Q2 territory planning"
│  │  ├─ Due: Start of quarter
│  │  ├─ All departments need coordination
│  │  └─ Wait for all manager inputs
│  │
│  └─ Dependency tracking:
│     ├─ IF all manager inputs received THEN
│     └─ Change status to "ready_for_review"
│
├─ MANAGER ESCALATIONS
│  ├─ Manager can create action_item requesting admin intervention:
│  │  ├─ Approval needed for staffing/budget
│  │  ├─ Strategic decision required
│  │  ├─ Conflict resolution needed
│  │  └─ Exception case handling
│  │
│  └─ Route to admin.assigned_to
│
├─ NOTIFICATION CASCADE
│  ├─ When action_item created:
│  │  ├─ Priority URGENT: Email + SMS + in-app
│  │  ├─ Priority HIGH: Email + in-app
│  │  ├─ Priority MEDIUM: In-app
│  │  └─ Send to admin with context URL
│  │
│  ├─ When due_date approaching:
│  │  ├─ 24 hours before: Reminder notification
│  │  ├─ 6 hours before: Alert notification
│  │  └─ At due_date: Final alert
│  │
│  └─ When overdue:
│     ├─ Daily reminders
│     └─ Escalate to CRO if admin doesn't respond
│
├─ ACTION EXECUTION
│  ├─ Admin clicks action button:
│  │  ├─ "Schedule Meeting" → Opens calendar with manager
│  │  ├─ "Review & Approve" → Opens deal details with approval form
│  │  ├─ "Review Planning" → Opens territory planning dashboard
│  │  └─ After action: Update status → in_progress or completed
│  │
│  └─ System tracks completion:
│     ├─ Update status when action completed
│     ├─ Log who completed it and when
│     └─ Remove from follow-ups list
│
├─ DATA SOURCES
│  ├─ user_performance_metrics (quota tracking)
│  ├─ deals table (deal pipeline)
│  ├─ system_alerts (technical issues)
│  ├─ manager_requests (escalations)
│  └─ AI recommendations (pattern detection)
│
└─ DISPLAY ON DASHBOARD
   ├─ Show: status IN ('pending', 'in_progress')
   ├─ Filter: assigned_to = current_admin
   ├─ Sort by: priority DESC, due_date ASC, business_value DESC
   └─ Highlight: URGENT or OVERDUE items
```

---

## SECTION 16: AI FEATURE ADOPTION (Platform Intelligence Heatmap)

### 1. Purpose
- Display adoption rates of AI features
- Track which teams use which features
- Identify lagging adoption areas
- Drive overall platform engagement

### 2. Data Displayed

```
5 AI Feature Categories with Adoption Rates:

1. Conversation Intelligence: 94% adoption
   - 126 active users using call analysis, transcription
   - Sentiment tracking, objection detection

2. Revenue Intelligence: 89% adoption
   - 119 active users using deal scoring, forecasting
   - Pipeline analytics, revenue attribution

3. Coaching Intelligence: 76% adoption
   - 102 active users using rep feedback, improvement tracking
   - Manager coaching recommendations

4. Performance Automation: 82% adoption
   - 110 active users using automated workflows
   - Task generation, alert systems

5. Customer Intelligence: 91% adoption
   - 122 active users using account insights
   - Stakeholder mapping, engagement scoring
```

### 3. Backend Source
- **Primary Service:** Feature Adoption Tracking Service
- **Secondary Services:** Usage Analytics, Feature Engagement

### 4. Database Tables

```
Main Tables:
├── ai_feature_adoption
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── feature_name VARCHAR(100) -- 'conversation_intelligence', 'revenue_intelligence', etc.
│   ├── period_date DATE
│   ├── total_users_in_org INTEGER
│   ├── users_using_feature INTEGER
│   ├── adoption_rate DECIMAL(5,2) -- percentage
│   ├── total_feature_uses INTEGER
│   ├── avg_uses_per_user DECIMAL(8,2)
│   ├── value_generated DECIMAL(12,2) -- revenue attributed to feature
│   ├── trend VARCHAR(20) -- 'improving', 'stable', 'declining'
│   ├── created_at TIMESTAMPTZ
│   └── UNIQUE(organization_id, feature_name, period_date)
│
├── platform_usage_logs
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── user_id (FK)
│   ├── event_type ('feature_used', 'page_view', 'export', etc.)
│   ├── feature_name VARCHAR(100) -- which AI feature
│   ├── action VARCHAR(100) -- 'view', 'create', 'export'
│   ├── session_id UUID
│   ├── created_at TIMESTAMPTZ
│   └── metadata JSONB
│
├── users
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── is_active
│   └── created_at
│
└── deals (for value calculation)
    ├── id (PK)
    ├── amount (revenue)
    ├── created_by (link to feature that helped close)
    └── actual_close_date
```

### 5. Query Logic

```sql
-- AI Feature Adoption Dashboard
SELECT 
  'Conversation Intelligence' as feature_name,
  ROUND(
    (COUNT(DISTINCT CASE WHEN pul.feature_name = 'call_analysis' 
                        OR pul.feature_name = 'transcription'
                        OR pul.feature_name = 'sentiment_analysis'
                        THEN pul.user_id END)::numeric / 
     COUNT(DISTINCT u.id) * 100)::numeric, 
    0
  ) as adoption_rate,
  COUNT(DISTINCT CASE WHEN pul.feature_name IN ('call_analysis', 'transcription', 'sentiment_analysis') 
                      THEN pul.user_id END) as active_users,
  COUNT(DISTINCT u.id) as total_users,
  COUNT(CASE WHEN pul.feature_name IN ('call_analysis', 'transcription', 'sentiment_analysis') 
             THEN pul.id END) as total_uses

FROM users u
LEFT JOIN platform_usage_logs pul ON u.id = pul.user_id
  AND pul.feature_name IN ('call_analysis', 'transcription', 'sentiment_analysis')
  AND pul.created_at >= CURRENT_DATE - INTERVAL '30 days'

WHERE u.organization_id = ? AND u.is_active = TRUE

UNION ALL-- Repeat for other features

-- Aggregate adoption view
SELECT 
  afa.feature_name,
  afa.adoption_rate,
  afa.users_using_feature as active_users,
  afa.total_users_in_org as total_users,
  afa.total_feature_uses as total_uses,
  afa.trend,
  ROUND(((afa.adoption_rate - 
          LAG(afa.adoption_rate) OVER (PARTITION BY afa.feature_name ORDER BY afa.period_date))::numeric), 2) as adoption_change

FROM ai_feature_adoption afa

WHERE afa.organization_id = ?
  AND afa.period_date = CURRENT_DATE - INTERVAL '1 day'

ORDER BY afa.adoption_rate DESC;
```

### 6. Data Ingestion Flow

```
FLOW: Feature Adoption Tracking
│
├─ REAL-TIME LOGGING
│  ├─ Every user action logged to platform_usage_logs:
│  │  ├─ When user accesses call_analysis feature
│  │  ├─ Record: platform_usage_logs
│  │  │  ├─ event_type = 'feature_used'
│  │  │  ├─ feature_name = 'call_analysis'
│  │  │  ├─ user_id = current_user
│  │  │  └─ created_at = NOW()
│  │  │
│  │  ├─ Similarly for:
│  │  │  ├─ transcription usage
│  │  │  ├─ deal_scoring usage
│  │  │  ├─ revenue_forecasting usage
│  │  │  ├─ coaching_recommendations usage
│  │  │  └─ account_insights usage
│  │  │
│  │  └─ Used for real-time usage tracking
│  │
│  └─ No aggregation at log time (raw events)
│
├─ DAILY AGGREGATION (11 PM ET)
│  ├─ Calculate adoption metrics for each feature:
│  │  ├─ Query platform_usage_logs for last 30 days
│  │  ├─ For each feature_name:
│  │  │  ├─ COUNT(DISTINCT users) using feature = active_users
│  │  │  ├─ COUNT(DISTINCT users - all) = total_users
│  │  │  ├─ adoption_rate = (active_users / total_users) * 100
│  │  │  ├─ total_feature_uses = COUNT(all logs for feature)
│  │  │  ├─ avg_uses_per_user = total_uses / active_users
│  │  │  └─ Insert into ai_feature_adoption table
│  │  │
│  │  └─ Repeat for 5 features
│  │
│  ├─ FEATURE DEFINITIONS
│  │  ├─ Conversation Intelligence:
│  │  │  └─ feature_name IN ('call_analysis', 'transcription', 'sentiment_analysis', 'objection_detection')
│  │  │
│  │  ├─ Revenue Intelligence:
│  │  │  └─ feature_name IN ('deal_scoring', 'revenue_forecast', 'pipeline_analytics')
│  │  │
│  │  ├─ Coaching Intelligence:
│  │  │  └─ feature_name IN ('coaching_recommendations', 'rep_improvement_tracking', 'manager_insights')
│  │  │
│  │  ├─ Performance Automation:
│  │  │  └─ feature_name IN ('automated_tasks', 'workflow_engine', 'alert_system')
│  │  │
│  │  └─ Customer Intelligence:
│  │      └─ feature_name IN ('account_insights', 'stakeholder_mapping', 'engagement_scoring')
│  │
│  └─ TREND CALCULATION
│     ├─ Compare adoption_rate:
│     │  ├─ Today vs 7 days ago
│     │  ├─ IF (today > 7d_ago) THEN trend = 'improving'
│     │  ├─ IF (today = 7d_ago) THEN trend = 'stable'
│     │  ├─ IF (today < 7d_ago) THEN trend = 'declining'
│     │  └─ Store trend in ai_feature_adoption
│     │
│     └─ Alert if trend = 'declining' for high-value features
│
├─ VALUE ATTRIBUTION (Revenue impact)
│  ├─ For each deal closed in period:
│  │  ├─ Identify which AI features were used during deal lifecycle
│  │  ├─ Query platform_usage_logs for deal.owner_id during deal duration
│  │  ├─ IF call_analysis used → attribute revenue
│  │  ├─ IF deal_scoring used → attribute revenue
│  │  └─ SUM attributed revenue for each feature
│  │
│  └─ Store value_generated in ai_feature_adoption
│
├─ DATA SOURCES
│  ├─ platform_usage_logs (real-time events)
│  ├─ users (active user count)
│  ├─ Feature flags (define active features)
│  └─ deals (for value calculation)
│
└─ DISPLAY ON DASHBOARD
   ├─ Show adoption rate % for each feature
   ├─ Show active user count
   ├─ Show trend (improving/stable/declining)
   ├─ Color-code: >90% = green, 80-90% = yellow, <80% = red
   └─ Allow drill-down to individual user adoption
```

---

## SECTION 17: ORGANIZATION-WIDE SENTIMENT (Customer Interaction Sentiment)

### 1. Purpose
- Track overall customer sentiment across all calls
- Monitor sentiment trends month-over-month
- Identify sentiment issues early
- Drive conversation quality improvements

### 2. Data Displayed

```
Organization Sentiment Breakdown:

Positive: 71% (+6% vs last month)
- Buying enthusiasm, agreement, satisfaction

Neutral: 23% (Stable)
- Informational calls, factual discussions

Negative: 6% (-3% improvement)
- Objections, concerns, dissatisfaction

Overall Trend: Positive Trend (badge)
```

### 3. Backend Source
- **Primary Service:** Sentiment Analysis Service
- **Secondary Services:** NLP Engine, Call Analytics

### 4. Database Tables

```
Main Tables:
├── meetings
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── owner_id (FK)
│   ├── sentiment ('very_positive', 'positive', 'neutral', 'negative', 'very_negative')
│   ├── scheduled_start_time
│   ├── status ('completed', 'scheduled', 'cancelled')
│   └── has_recording
│
├── transcripts
│   ├── id (PK)
│   ├── meeting_id (FK)
│   ├── sentiment_score DECIMAL(5,2) -- 0-100 scale
│   ├── sentiment_breakdown JSONB -- {'positive': 71, 'neutral': 23, 'negative': 6}
│   ├── processed_at
│   └── language
│
├── sentiment_snapshots (new table - for historical tracking)
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── snapshot_date DATE (YYYYMM)
│   ├── positive_percentage DECIMAL(5,2)
│   ├── neutral_percentage DECIMAL(5,2)
│   ├── negative_percentage DECIMAL(5,2)
│   ├── total_calls_analyzed INTEGER
│   ├── trend VARCHAR(20) -- 'improving', 'stable', 'declining'
│   ├── vs_previous_month_change DECIMAL(5,2)
│   └── created_at TIMESTAMPTZ
│
└── transcript_moments (for storing sentiment moments)
    ├── id (PK)
    ├── meeting_id (FK)
    ├── moment_type ('positive_sentiment', 'negative_sentiment', 'objection', 'buying_signal')
    ├── sentiment VARCHAR(50)
    └── importance_score
```

### 5. Query Logic

```sql
-- Organization-Wide Sentiment Summary
SELECT 
  ROUND(
    (COUNT(CASE WHEN m.sentiment IN ('positive', 'very_positive') THEN m.id END)::numeric / 
     COUNT(DISTINCT m.id) * 100)::numeric, 
    0
  ) as positive_percentage,
  ROUND(
    (COUNT(CASE WHEN m.sentiment = 'neutral' THEN m.id END)::numeric /
     COUNT(DISTINCT m.id) * 100)::numeric,
    0
  ) as neutral_percentage,
  ROUND(
    (COUNT(CASE WHEN m.sentiment IN ('negative', 'very_negative') THEN m.id END)::numeric /
     COUNT(DISTINCT m.id) * 100)::numeric,
    0
  ) as negative_percentage,
  COUNT(DISTINCT m.id) as total_calls,
  
  -- Trend comparison to previous month
  ROUND(
    ((COUNT(CASE WHEN m.sentiment IN ('positive', 'very_positive') THEN m.id END)::numeric / 
      COUNT(DISTINCT m.id) * 100) -
     COALESCE(
       (SELECT positive_percentage FROM sentiment_snapshots 
        WHERE organization_id = ?
          AND snapshot_date = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')),
       0
     )
    )::numeric, 
    1
  ) as positive_change_vs_last_month,
  
  CASE 
    WHEN (COUNT(CASE WHEN m.sentiment IN ('positive', 'very_positive') THEN m.id END)::numeric / 
          COUNT(DISTINCT m.id) * 100) > 
         COALESCE(
           (SELECT positive_percentage FROM sentiment_snapshots 
            WHERE organization_id = ?
              AND snapshot_date = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')),
           0
         )
    THEN 'improving'
    WHEN (COUNT(CASE WHEN m.sentiment IN ('positive', 'very_positive') THEN m.id END)::numeric / 
          COUNT(DISTINCT m.id) * 100) = 
         COALESCE(
           (SELECT positive_percentage FROM sentiment_snapshots 
            WHERE organization_id = ?
              AND snapshot_date = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')),
           0
         )
    THEN 'stable'
    ELSE 'declining'
  END as trend

FROM meetings m

WHERE m.organization_id = ?
  AND m.status = 'completed'
  AND m.has_recording = TRUE
  AND m.scheduled_start_time >= DATE_TRUNC('month', CURRENT_DATE);

-- Historical sentiment tracking (month-over-month)
SELECT 
  ss.snapshot_date,
  ss.positive_percentage,
  ss.neutral_percentage,
  ss.negative_percentage,
  ss.total_calls_analyzed,
  ss.trend,
  ss.vs_previous_month_change

FROM sentiment_snapshots ss

WHERE ss.organization_id = ?
  AND ss.snapshot_date >= CURRENT_DATE - INTERVAL '12 months'

ORDER BY ss.snapshot_date DESC;
```

### 6. Data Ingestion Flow

```
FLOW: Sentiment Analysis Pipeline
│
├─ CALL COMPLETION & TRANSCRIPTION
│  ├─ Call ends → meeting.status = 'completed'
│  ├─ Recording uploaded to S3
│  ├─ Transcription service processes audio
│  └─ Result stored in transcripts.full_transcript
│
├─ SENTIMENT ANALYSIS (Real-time, ~2-3 min after call)
│  ├─ Input: Full transcript from transcripts table
│  ├─ AI Service: Use NLP model (Hugging Face, Google Cloud, AWS)
│  │
│  ├─ Analysis:
│  │  ├─ Overall sentiment classification:
│  │  │  ├─ very_positive (enthusiastic, buying signals)
│  │  │  ├─ positive (interested, agreed)
│  │  │  ├─ neutral (informational, factual)
│  │  │  ├─ negative (concerns, objections)
│  │  │  └─ very_negative (frustrated, angry)
│  │  │
│  │  ├─ Segment-by-segment sentiment:
│  │  │  ├─ Analyze each speaker turn
│  │  │  ├─ Track sentiment timeline during call
│  │  │  ├─ Identify sentiment shifts
│  │  │  └─ Detect objection/resolution patterns
│  │  │
│  │  ├─ Sentiment breakdown:
│  │  │  ├─ Count positive segments / total = positive %
│  │  │  ├─ Count neutral segments / total = neutral %
│  │  │  └─ Count negative segments / total = negative %
│  │  │
│  │  └─ Extract key sentiment moments:
│  │     ├─ Identify turning points (positive/negative)
│  │     ├─ Extract quotes demonstrating sentiment
│  │     └─ Create transcript_moments for highlighting
│  │
│  ├─ Store results:
│  │  ├─ meetings.sentiment = 'positive' (or neutral/negative)
│  │  ├─ transcripts.sentiment_score = 71.5 (0-100 scale)
│  │  ├─ transcripts.sentiment_breakdown = JSON
│  │  │  └─ {'positive': 71, 'neutral': 23, 'negative': 6}
│  │  └─ Create transcript_moments records for each key moment
│  │
│  └─ Assign sentiment model: Can use multiple models:
│     ├─ Google Cloud Natural Language API
│     ├─ AWS Comprehend
│     ├─ Hugging Face transformer model
│     ├─ Custom fine-tuned sentiment model
│     └─ Ensemble of multiple models for better accuracy
│
├─ DAILY AGGREGATION (11 PM ET)
│  ├─ For calls completed in current month:
│  │  ├─ COUNT meetings WHERE sentiment = 'positive'
│  │  ├─ COUNT meetings WHERE sentiment = 'neutral'
│  │  ├─ COUNT meetings WHERE sentiment = 'negative'
│  │  ├─ Calculate percentages
│  │  ├─ Compare to previous month
│  │  ├─ Determine trend
│  │  └─ Create sentiment_snapshots record
│  │
│  └─ Store snapshot for historical tracking
│
├─ TREND DETECTION
│  ├─ Compare current month sentiment to previous month:
│  │  ├─ IF positive % increased → trend = 'improving'
│  │  ├─ IF positive % stayed same → trend = 'stable'
│  │  ├─ IF positive % decreased → trend = 'declining'
│  │  └─ Calculate absolute vs % change
│  │
│  └─ Alert thresholds:
│     ├─ IF negative % > 15% → Alert manager
│     ├─ IF declining trend for 2+ months → Escalate to admin
│     └─ IF improvement trend → Celebrate & share best practices
│
├─ DEPARTMENT-LEVEL SENTIMENT
│  ├─ Can also track sentiment by department:
│  │  ├─ WITH dept_sentiment AS (
│  │  │   SELECT d.id, d.name,
│  │  │     ROUND(AVG(
│  │  │       CASE WHEN m.sentiment IN ('positive', 'very_positive') THEN 100 
│  │  │            ELSE 0 END
│  │  │     )::numeric, 2) as positive_pct
│  │  │   FROM departments d
│  │  │   JOIN users u ON d.id = u.department_id
│  │  │   JOIN meetings m ON u.id = m.owner_id
│  │  │   WHERE m.scheduled_start_time >= DATE_TRUNC('month', CURRENT_DATE)
│  │  │   GROUP BY d.id, d.name
│  │  │ )
│  │  └─ Identify which departments excel/struggle in engagement
│  │
│  └─ Use for coaching targeting
│
├─ COMPETITOR MENTIONS (Part of sentiment context)
│  ├─ While analyzing sentiment, extract:
│  │  ├─ Competitor names mentioned
│  │  ├─ Context (positive, neutral, negative)
│  │  └─ Frequency of mentions
│  │
│  └─ Track calls with negative competitor mentions
│
├─ OBJECTION TRACKING (Within sentiment analysis)
│  ├─ Sentiment service also classifies negative segments:
│  │  ├─ Objection: "That's too expensive"
│  │  ├─ Concern: "Can you handle our volume?"
│  │  ├─ Requirement: "We need X capability"
│  │  └─ Competitive: "We're evaluating Competitor Y"
│  │
│  └─ Create transcript_moments for coaching
│
├─ DATA SOURCES
│  ├─ transcripts.full_transcript (input)
│  ├─ meetings table (metadata)
│  ├─ NLP sentiment model (analysis)
│  └─ Historical sentiment_snapshots (comparison)
│
└─ DISPLAY ON DASHBOARD
   ├─ Show: 71% positive, 23% neutral, 6% negative
   ├─ Show trend: +6% vs last month (improving badge)
   ├─ Color visualization:
   │  ├─ Green bar: 71%
   │  ├─ Gray bar: 23%
   │  └─ Red bar: 6%
   └─ Enable drill-down to calls by sentiment
```

---

## SECTION 18: SYSTEM HEALTH (Infrastructure Monitoring)

### 1. Purpose
- Display real-time system uptime & performance
- Show service status (API, database, recording, etc.)
- Alert to infrastructure issues
- Provide system reliability metrics

### 2. Data Displayed

```
System Health Dashboard:

Overall Uptime: 99.98% (All Systems Operational - GREEN badge)

Service Status (6 services):
├─ API Gateway: 99.99% uptime, 98ms response time, Last incident: 12 days ago
├─ Authentication Service: 99.98% uptime, 45ms response time, Last incident: 5 days ago
├─ Database Cluster: 99.97% uptime, 12ms response time, Last incident: 8 days ago
├─ AI Processing: 99.95% uptime, 450ms response time, Last incident: 3 days ago
├─ Recording Service: 99.99% uptime, 120ms response time, Last incident: 18 days ago
└─ Email Service: 99.96% uptime, 850ms response time, Last incident: 6 days ago

Additional Metrics:
- Active Sessions: 89
- Error Rate: 0.02%
- Storage Used: 48%
- API Latency: 124ms
- Database Performance: 98.5%
```

### 3. Backend Source
- **Primary Service:** System Monitoring & Observability Service
- **Secondary Services:** External monitoring providers (Datadog, New Relic, PagerDuty)

### 4. Database Tables

```
Main Tables:
├── system_health_metrics
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── metric_name ('api_latency', 'db_performance', 'error_rate', etc.)
│   ├── metric_value DECIMAL(10,2)
│   ├── unit VARCHAR(50) ('ms', '%', 'count', etc.)
│   ├── status ('healthy', 'warning', 'error')
│   ├── measured_at TIMESTAMPTZ
│   ├── threshold_warning DECIMAL(10,2)
│   ├── threshold_error DECIMAL(10,2)
│   └── created_at TIMESTAMPTZ
│
├── service_status
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── service_name ('api_gateway', 'auth_service', 'database', 'ai_processing', etc.)
│   ├── status ('operational', 'degraded', 'outage')
│   ├── uptime_percentage DECIMAL(5,2)
│   ├── last_incident_at TIMESTAMPTZ
│   ├── response_time_ms INTEGER
│   ├── error_count_last_hour INTEGER
│   ├── last_checked_at TIMESTAMPTZ
│   └── next_check_at TIMESTAMPTZ
│
├── incidents
│   ├── id (PK)
│   ├── organization_id (FK)
│   ├── service_id (FK → service_status)
│   ├── incident_type ('outage', 'degradation', 'error_spike')
│   ├── severity ('low', 'medium', 'high', 'critical')
│   ├── status ('detected', 'acknowledged', 'resolved')
│   ├── started_at TIMESTAMPTZ
│   ├── resolved_at TIMESTAMPTZ
│   ├── duration_minutes INTEGER
│   ├── impact_description TEXT
│   └── root_cause TEXT (when available)
│
└── uptime_history
    ├── id (PK)
    ├── service_id (FK)
    ├── date DATE
    ├── uptime_percentage DECIMAL(5,2)
    ├── incident_count INTEGER
    ├── avg_response_time_ms INTEGER
    └── total_errors INTEGER
```

### 5. Query Logic

```sql
-- Overall System Health
SELECT 
  ROUND(AVG(ss.uptime_percentage)::numeric, 2) as overall_uptime,
  CASE 
    WHEN ROUND(AVG(ss.uptime_percentage)::numeric, 2) >= 99.9 THEN 'healthy'
    WHEN ROUND(AVG(ss.uptime_percentage)::numeric, 2) >= 99.0 THEN 'warning'
    ELSE 'error'
  END as overall_status,
  COUNT(DISTINCT CASE WHEN ss.status = 'operational' THEN ss.id END) as operational_services,
  COUNT(DISTINCT ss.id) as total_services,
  COUNT(DISTINCT CASE WHEN ss.status != 'operational' THEN ss.id END) as affected_services

FROM service_status ss

WHERE ss.organization_id = ?;

-- Individual Service Status
SELECT 
  ss.id,
  ss.service_name,
  ss.status,
  ss.uptime_percentage,
  ss.response_time_ms,
  ss.error_count_last_hour,
  ss.last_incident_at,
  CASE 
    WHEN ss.last_incident_at IS NOT NULL 
    THEN DATEDIFF(DAY, ss.last_incident_at, CURRENT_TIMESTAMP)
    ELSE NULL
  END as days_since_last_incident

FROM service_status ss

WHERE ss.organization_id = ?

ORDER BY ss.uptime_percentage ASC;

-- System Metrics (key performance indicators)
SELECT 
  metric_name,
  ROUND(AVG(metric_value)::numeric, 2) as current_value,
  unit,
  status,
  threshold_warning,
  threshold_error,
  CASE 
    WHEN metric_value > threshold_error THEN 'error'
    WHEN metric_value > threshold_warning THEN 'warning'
    ELSE 'healthy'
  END as health_status

FROM system_health_metrics

WHERE organization_id = ?
  AND measured_at >= CURRENT_TIMESTAMP - INTERVAL '1 hour'

GROUP BY metric_name, unit, status, threshold_warning, threshold_error

ORDER BY health_status DESC;
```

### 6. Data Ingestion Flow

```
FLOW: System Health Monitoring
│
├─ CONTINUOUS MONITORING (Every 5 minutes)
│  ├─ Monitoring service pings each service:
│  │  ├─ API Gateway → GET /health
│  │  ├─ Authentication Service → GET /health
│  │  ├─ Database → SELECT 1 (ping)
│  │  ├─ AI Processing Queue → Check queue depth & worker health
│  │  ├─ Recording Service → Check S3/storage status
│  │  └─ Email Service → Check email queue & sent rate
│  │
│  ├─ Collect metrics:
│  │  ├─ Response time (latency)
│  │  ├─ Status code (200, 500, timeout, etc.)
│  │  ├─ Error rate
│  │  └─ Resource utilization (CPU, memory)
│  │
│  ├─ Store in system_health_metrics:
│  │  ├─ metric_value = latency (ms) or error_rate (%) or storage (%)
│  │  ├─ status = 'healthy' / 'warning' / 'error' (based on thresholds)
│  │  ├─ measured_at = NOW()
│  │  └─ One record per metric per interval
│  │
│  └─ Update service_status table:
│     ├─ Aggregate last 12 measurements (1 hour)
│     ├─ Calculate uptime % for period
│     ├─ Calculate avg response_time
│     ├─ Count errors in last hour
│     └─ Determine service.status:
│        ├─ IF all checks passed → operational
│        ├─ IF some checks failed/slow → degraded
│        ├─ IF most checks failed → outage
│        └─ Update service_status table
│
├─ THRESHOLD DEFINITIONS
│  ├─ API Latency:
│  │  ├─ healthy < 150ms
│  │  ├─ warning 150-300ms
│  │  └─ error > 300ms
│  │
│  ├─ Database:
│  │  ├─ healthy < 15ms
│  │  ├─ warning 15-50ms
│  │  └─ error > 50ms
│  │
│  ├─ Error Rate:
│  │  ├─ healthy < 0.1%
│  │  ├─ warning 0.1-1%
│  │  └─ error > 1%
│  │
│  ├─ AI Processing:
│  │  ├─ healthy < 500ms (for transcription initiation)
│  │  ├─ warning 500-1000ms
│  │  └─ error > 1000ms (stalled processing)
│  │
│  ├─ Storage:
│  │  ├─ healthy < 70%
│  │  ├─ warning 70-85%
│  │  └─ error > 85%
│  │
│  └─ Uptime target:
│     ├─ healthy >= 99.9%
│     ├─ warning 99-99.9%
│     └─ error < 99%
│
├─ INCIDENT DETECTION
│  ├─ When status changes from 'operational' to 'degraded' or 'outage':
│  │  ├─ Create incidents record
│  │  ├─ Determine severity:
│  │  │  ├─ critical: API or database down (affects all users)
│  │  │  ├─ high: Recording or AI service down
│  │  │  ├─ medium: Single service degraded
│  │  │  └─ low: Latency warning only
│  │  │
│  │  ├─ Store incident:
│  │  │  ├─ service_id = affected service
│  │  │  ├─ incident_type = 'outage' or 'degradation'
│  │  │  ├─ severity = determined above
│  │  │  ├─ status = 'detected'
│  │  │  └─ started_at = NOW()
│  │  │
│  │  └─ Alert escalation:
│  │     ├─ If critical → immediate notification to on-call
│  │     ├─ If high → notification to engineering team
│  │     └─ If medium/low → log for review
│  │
│  └─ When status returns to 'operational':
│     ├─ Update incidents.status = 'resolved'
│     ├─ Set resolved_at = NOW()
│     ├─ Calculate duration_minutes
│     └─ Calculate uptime impact
│
├─ UPTIME CALCULATION
│  ├─ Daily (11 PM ET):
│  │  ├─ For each service:
│  │  │  ├─ SUM(uptime_minutes) / TOTAL_MINUTES_IN_DAY
│  │  │  ├─ Example: 1436 up minutes / 1440 total = 99.72%
│  │  │  └─ Store in uptime_history
│  │  │
│  │  └─ Calculate overall org uptime:
│  │     └─ AVG(all_service_uptime_percentages)
│  │
│  └─ Monthly (end of month):
│     └─ SUM(daily uptime) / number_of_days
│
├─ EXTERNAL MONITORING INTEGRATION
│  ├─ Pull status from Datadog / New Relic / PagerDuty:
│  │  ├─ Query Datadog API for infrastructure metrics
│  │  ├─ Combine with internal health checks
│  │  └─ Provide holistic view
│  │
│  └─ Sync frequency: Every 5 minutes
│
├─ HISTORICAL TRACKING
│  ├─ Store detailed service status history:
│  │  ├─ Track uptime_history per service per day
│  │  ├─ Calculate SLA compliance (target: 99.9%)
│  │  ├─ Generate monthly reports
│  │  └─ Support root cause analysis
│  │
│  └─ Archives old data (>90 days) to cold storage
│
└─ DISPLAY ON DASHBOARD
   ├─ Overall uptime: 99.98% (rounded to 2 decimals)
   ├─ Status badge: "All Systems Operational" (GREEN)
   ├─ Service list: Show each service with:
   │  ├─ Status icon (green/yellow/red)
   │  ├─ Uptime %
   │  ├─ Response time
   │  ├─ Last incident date
   │  └─ Trend (↑/→/↓)
   │
   ├─ Metrics dashboard:
   │  ├─ API Latency: 124ms
   │  ├─ Database: 98.5%
   │  ├─ Error Rate: 0.02%
   │  ├─ Active Sessions: 89
   │  └─ Storage: 48%
   │
   └─ Refresh: Real-time (WebSocket) or every 30 seconds
```

---

## CRITICAL BUSINESS LOGIC SUMMARY

All 6 missing components follow the same paradigm:

1. **Real-time data collection** → Immediate storage
2. **Hourly/daily aggregation** → Summary metrics
3. **Threshold-based alerts** → Notifications
4. **Historical tracking** → Trend analysis
5. **Display on dashboard** → Admin visibility

These complement the original 12 components to provide **complete admin dashboard visibility**.

---

**END OF MISSING COMPONENTS DOCUMENTATION**

All 18 components now documented with:
- ✅ Purpose & goals
- ✅ Data structures
- ✅ Database schemas
- ✅ SQL queries
- ✅ Data ingestion flows
- ✅ Display logic

# Meetings, Calls & Tasks Pages - Complete Architecture
## Detailed Backend, Database & API Design for All Components

---

# PART A: MEETINGS PAGE

## SECTION 1: PAGE OVERVIEW

### Purpose
- Display user's scheduled meetings (upcoming) and completed meetings (past)
- Switch between "My Meetings", "Team Meetings", and "All Meetings"
- View call recordings and AI analysis post-meeting
- Filter meetings by date range, type, and outcome

### Data Structure
```
MEETINGS PAGE LAYOUT:
├─ Header
│  ├─ Title: "Meetings"
│  ├─ Subtitle: "Manage all your conversations and recordings"
│  └─ Buttons: (future actions)
│
├─ Tabs (3 levels)
│  ├─ My Meetings
│  ├─ Team Meetings
│  ├─ All Meetings
│  └─ Shared with Me
│
├─ Time Filter (2 options)
│  ├─ Upcoming
│  └─ Past
│
├─ Smart Filters
│  ├─ Date Range picker
│  ├─ Meeting Type dropdown
│  ├─ Outcome status filter
│  └─ More Filters button
│
└─ Meeting Cards List (for each meeting)
   ├─ Meeting Icon (Video for upcoming, Phone for past)
   ├─ Title + Type Badge
   ├─ Outcome/Status Badge (with sentiment color)
   ├─ Meeting metadata:
   │  ├─ Date & Time
   │  ├─ Duration
   │  ├─ Participant/Contact name
   │  ├─ Deal Value
   │  └─ Rep name (for team meetings)
   │
   ├─ Quality Score (for past meetings)
   │  ├─ Numeric score (45-91 range)
   │  └─ Progress bar
   │
   ├─ Recording Controls (for past meetings)
   │  ├─ Play Recording button
   │  ├─ Download button
   │  └─ Info: "AI Summary • Topics • Transcript available"
   │
   └─ Action Button
      ├─ "Join Call" (for upcoming)
      └─ "Review Details" (for past)
```

### Example Meeting Card Data
```javascript
// UPCOMING MEETING
{
  id: "1",
  date: "Feb 27",
  time: "10:00 AM",
  title: "Discovery - Acme Corp",
  participant: "Sarah Johnson, CFO",
  duration: "45 mins",
  type: "Discovery",
  dealValue: "$85K",
  priority: "high",
  hasRecording: false,
  upcoming: true
}

// PAST MEETING (with AI analysis)
{
  id: "4",
  date: "Feb 26",
  time: "3:00 PM",
  title: "Sales Pitch - Beta Corp",
  participant: "Robert Taylor",
  duration: "42 mins",
  outcome: "Qualified",
  score: 87,  // AI quality score
  sentiment: "positive",  // positional analysis
  dealValue: "$95K",
  hasRecording: true,
  recordingUrl: "s3://...",
  transcriptUrl: "s3://...",
  aiSummaryUrl: "s3://...",
  topicsUrl: "s3://..."
}
```

---

## SECTION 2: MEETINGS - DATABASE SCHEMA & QUERIES

### Database Tables

```sql
-- Core Tables
Table: meetings
├─ id (PK) UUID
├─ organization_id (FK)
├─ owner_id (FK → users) -- the rep who conducted meeting
├─ contact_id (FK → contacts) -- person they spoke with
├─ account_id (FK → accounts) -- company
├─ deal_id (FK → deals) [optional]
├─ title VARCHAR
├─ meeting_type ENUM ('Discovery', 'Demo', 'Follow-up', 'Proposal', 'Negotiation', 'Internal', 'Cold Call')
├─ scheduled_start_time TIMESTAMPTZ
├─ scheduled_end_time TIMESTAMPTZ
├─ actual_duration_seconds INTEGER
├─ priority ENUM ('high', 'medium', 'low')
├─ status ENUM ('scheduled', 'in_progress', 'completed', 'cancelled')
├─ outcome ENUM ('Qualified', 'Interested', 'Not Interested', 'Proposal Sent', 'Negotiating', null) [for past]
├─ sentiment ENUM ('very_positive', 'positive', 'neutral', 'negative', 'very_negative') [for past]
├─ ai_quality_score DECIMAL(5,2) [0-100, null if no recording]
├─ recording_url TEXT [S3 path to recording]
├─ transcript_url TEXT
├─ ai_summary_url TEXT
├─ topics JSONB [array of topics extracted by AI]
├─ created_at TIMESTAMPTZ
├─ updated_at TIMESTAMPTZ
└─ INDEXES: (owner_id, status, scheduled_start_time), (organization_id, status)

Table: contacts
├─ id (PK) UUID
├─ organization_id (FK)
├─ account_id (FK → accounts)
├─ full_name VARCHAR
├─ email
├─ phone
├─ title VARCHAR
├─ created_at TIMESTAMPTZ
└─ INDEXES: (organization_id, account_id)

Table: accounts
├─ id (PK) UUID
├─ organization_id (FK)
├─ name VARCHAR
├─ industry VARCHAR
├─ website
├─ created_at TIMESTAMPTZ
└─ INDEXES: (organization_id)

Table: deals
├─ id (PK) UUID
├─ organization_id (FK)
├─ account_id (FK)
├─ owner_id (FK → users)
├─ title VARCHAR
├─ amount DECIMAL(12,2)
├─ stage VARCHAR
├─ created_at TIMESTAMPTZ
└─ INDEXES: (organization_id, owner_id, stage)

Table: meeting_participants
├─ id (PK) UUID
├─ meeting_id (FK)
├─ user_id (FK → users) [if internal]
├─ contact_id (FK → contacts) [if customer]
├─ participant_type ENUM ('organizer', 'required', 'optional')
├─ attendance_status ENUM ('accepted', 'declined', 'tentative', 'no_response')
└─ INDEXES: (meeting_id)
```

### Query Logic

```sql
-- UPCOMING MEETINGS (for logged-in rep)
SELECT 
  m.id,
  m.title,
  m.meeting_type as type,
  m.scheduled_start_time as date,
  TO_CHAR(m.scheduled_start_time, 'Mon DD, YYYY') as formatted_date,
  TO_CHAR(m.scheduled_start_time, 'HH:MI AM') as time,
  CONCAT(
    FLOOR(EXTRACT(EPOCH FROM (m.scheduled_end_time - m.scheduled_start_time)) / 60),
    ' mins'
  ) as duration,
  c.full_name as participant,
  CONCAT(c.full_name, ', ', c.title) as participant_with_title,
  COALESCE(d.amount, 0) as dealValue,
  m.priority,
  m.status,
  false as isPast

FROM meetings m
LEFT JOIN contacts c ON m.contact_id = c.id
LEFT JOIN deals d ON m.deal_id = d.id
LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id

WHERE m.owner_id = ?  -- current user
  AND m.organization_id = ?
  AND m.status IN ('scheduled', 'in_progress')
  AND m.scheduled_start_time > NOW()

ORDER BY m.scheduled_start_time ASC;

-- PAST MEETINGS (with AI Analysis)
SELECT 
  m.id,
  m.title,
  m.meeting_type as type,
  TO_CHAR(m.scheduled_start_time, 'Mon DD, YYYY') as date,
  TO_CHAR(m.scheduled_start_time, 'HH:MI AM') as time,
  CONCAT(
    LPAD(EXTRACT(HOUR FROM (m.scheduled_end_time - m.scheduled_start_time))::text, 2, '0'),
    ':',
    LPAD(FLOOR(EXTRACT(MINUTE FROM (m.scheduled_end_time - m.scheduled_start_time)))::text, 2, '0')
  ) as duration,
  c.full_name as participant,
  m.outcome,
  m.ai_quality_score as score,
  m.sentiment,
  COALESCE(d.amount, 0) as dealValue,
  m.recording_url as hasRecording,
  m.recording_url,
  m.transcript_url,
  m.ai_summary_url,
  m.topics

FROM meetings m
LEFT JOIN contacts c ON m.contact_id = c.id
LEFT JOIN deals d ON m.deal_id = d.id

WHERE m.owner_id = ?
  AND m.organization_id = ?
  AND m.status = 'completed'
  AND m.scheduled_start_time < NOW()

ORDER BY m.scheduled_start_time DESC;

-- TEAM MEETINGS (with rep name)
SELECT 
  m.id,
  m.title,
  m.meeting_type as type,
  TO_CHAR(m.scheduled_start_time, 'Mon DD, YYYY') as date,
  TO_CHAR(m.scheduled_start_time, 'HH:MI AM') as time,
  CONCAT(
    FLOOR(EXTRACT(EPOCH FROM (m.scheduled_end_time - m.scheduled_start_time)) / 60),
    ' mins'
  ) as duration,
  c.full_name as participant,
  u.full_name as rep,
  u.id as rep_id,
  m.meeting_type,
  m.outcome,
  m.ai_quality_score as score,
  m.sentiment,
  COALESCE(d.amount, 0) as dealValue,
  m.recording_url as hasRecording

FROM meetings m
LEFT JOIN contacts c ON m.contact_id = c.id
LEFT JOIN users u ON m.owner_id = u.id
LEFT JOIN deals d ON m.deal_id = d.id

WHERE u.department_id = (
  SELECT department_id FROM users WHERE id = ? -- current user's dept
)
  AND m.organization_id = ?
  AND m.scheduled_start_time >= (NOW() - INTERVAL '90 days')

ORDER BY CASE 
  WHEN m.scheduled_start_time > NOW() THEN 1
  ELSE 2
END ASC,
m.scheduled_start_time DESC;
```

### Data Ingestion Flow for Meetings

```
FLOW: Meeting Lifecycle
│
├─ MEETING CREATION
│  ├─ Source 1: Calendar Integration
│  │  ├─ Google Calendar / Outlook sync
│  │  ├─ Extract: title, start_time, end_time, attendees
│  │  ├─ Match attendees to contacts table
│  │  ├─ Link to deals if mentioned in title/description
│  │  └─ Insert into meetings table
│  │
│  ├─ Source 2: Manual Creation (UI)
│  │  ├─ Rep creates meeting in Tasknova
│  │  ├─ Fill: title, type, time, contact, deal
│  │  ├─ Sync to calendar (Google/Outlook API)
│  │  └─ Insert into meetings table
│  │
│  └─ Source 3: Automatic (Call Recording Start)
│     ├─ When call recording starts
│     ├─ Extract: phone number → match contact
│     ├─ Create meeting record
│     ├─ Type = infer from call pattern
│     └─ Set status = 'in_progress'
│
├─ MEETING IN PROGRESS
│  ├─ Update status: 'scheduled' → 'in_progress' when starts
│  ├─ Begin recording (if enabled)
│  ├─ Record: microphone input + screen (optional)
│  └─ Stream to S3 bucket with temporary ID
│
├─ MEETING COMPLETION
│  ├─ Call ends → status = 'completed'
│  ├─ Calculate actual_duration_seconds
│  ├─ Finalize recording (S3 move to permanent path)
│  ├─ Add metadata: end_time, duration
│  └─ Trigger transcription pipeline (async)
│
├─ TRANSCRIPTION PROCESSING (~2-3 minutes)
│  ├─ Input: Recording audio from S3
│  ├─ Service: Google Cloud Speech-to-Text or AWS Transcribe
│  ├─ Output:
│  │  ├─ Full transcript with timestamps
│  │  └─ Speaker identification (rep vs customer)
│  │
│  ├─ Store: transcript_url in S3
│  └─ Update meetings table:
│     └─ transcript_url = "s3://..."
│
├─ AI ANALYSIS (in parallel)
│  ├─ SENTIMENT ANALYSIS
│  │  ├─ Input: Transcript
│  │  ├─ Analyze customer sentiment per segment
│  │  ├─ Use NLP model to classify:
│  │  │  ├─ very_positive: enthusiastic, buying signals
│  │  │  ├─ positive: interested, agreed
│  │  │  ├─ neutral: informational
│  │  │  ├─ negative: concerns, objections
│  │  │  └─ very_negative: frustrated, angry
│  │  │
│  │  ├─ Store: m.sentiment = classification
│  │  └─ Output: sentiment_analysis.json
│  │
│  ├─ QUALITY SCORING (80+ metrics)
│  │  ├─ Questions asked (count, quality, relevance)
│  │  ├─ Talk/listen ratio (target 50/50)
│  │  ├─ Engagement level (pauses, interruptions)
│  │  ├─ Objection handling
│  │  ├─ Buying signals detected
│  │  ├─ ROI focus vs features focus
│  │  ├─ Pain point discovery
│  │  └─ Outcome alignment
│  │
│  │  ├─ Formula:
│  │  │  score = (questions_score * 0.25 + 
│  │  │           talk_ratio_score * 0.20 + 
│  │  │           engagement_score * 0.20 +
│  │  │           objection_handling * 0.15 +
│  │  │           buying_signals * 0.10 +
│  │  │           pain_discovery * 0.10) / 100
│  │  │
│  │  └─ Store: m.ai_quality_score
│  │
│  ├─ TOPIC EXTRACTION
│  │  ├─ Use NER (Named Entity Recognition) to extract:
│  │  │  ├─ Products mentioned
│  │  │  ├─ Competitors discussed
│  │  │  ├─ Decision criteria
│  │  │  ├─ Implementation timeline
│  │  │  ├─ Budget indicators
│  │  │  └─ Authority level
│  │  │
│  │  ├─ Classify into predefined topics:
│  │  │  ├─ "Pricing"
│  │  │  ├─ "Demo"
│  │  │  ├─ "ROI"
│  │  │  ├─ "Integration"
│  │  │  ├─ "Timeline"
│  │  │  ├─ "Support"
│  │  │  ├─ "Security"
│  │  │  └─ "Features"
│  │  │
│  │  └─ Store: m.topics = ["Pricing", "ROI", "Timeline"]
│  │
│  ├─ AI SUMMARY GENERATION
│  │  ├─ Generate in-meeting summary:
│  │  │  ├─ Key decisions made
│  │  │  ├─ Next steps identified
│  │  │  ├─ Objections raised & handled
│  │  │  ├─ Budget indicators
│  │  │  └─ Timeline
│  │  │
│  │  └─ Generate coaching highlights:
│  │     ├─ What the rep did well
│  │     ├─ Improvement opportunities
│  │     ├─ Best practices demonstrated
│  │     └─ Personalized coaching tips
│  │
│  └─ Store: ai_summary_url in S3
│
├─ OUTCOME CLASSIFICATION
│  ├─ AI determines from meeting:
│  │  ├─ Customer said "yes, let's move forward" → 'Qualified'
│  │  ├─ Expression of interest → 'Interested'
│  │  ├─ Clear rejection → 'Not Interested'
│  │  ├─ Rep sent proposal after → 'Proposal Sent'
│  │  ├─ Ongoing negotiation → 'Negotiating'
│  │  └─ Uncertain → null (manual override)
│  │
│  ├─ Can check for keywords/phrases:
│  │  ├─ Positive: "love it", "definitely", "let's do it", "when can we start"
│  │  ├─ Negative: "not interested", "too expensive", "not a fit"
│  │  └─ Neutral: "let me think", "interesting", "send info"
│  │
│  └─ Update: m.outcome = 'Qualified'
│
├─ DEAL LINKING (Auto-suggest)
│  ├─ Check if contact mentioned is associated with deal
│  ├─ If deal_id matched → already linked
│  ├─ If no deal:
│  │  ├─ Look for open deals for same account
│  │  ├─ Suggest top 3 most likely deals
│  │  └─ Allow manual selection
│  │
│  └─ Update: m.deal_id = selected_deal_id
│
├─ DATA SOURCES
│  ├─ Calendar integration APIs (Google, Outlook)
│  ├─ Call recording stream
│  ├─ Transcription service (Google Speech or AWS)
│  ├─ AI/NLP models (sentiment, scoring)
│  ├─ CRM data (contacts, deals)
│  └─ Meeting user interactions
│
└─ DISPLAY ON MEETINGS PAGE
   ├─ Fetch meetings WHERE owner_id = current_user
   ├─ Split: scheduled_start_time > NOW() → Upcoming tab
   ├─ Split: scheduled_start_time <= NOW() and status = 'completed' → Past tab
   ├─ Sort by: scheduled_start_time (ASC for upcoming, DESC for past)
   ├─ Show: title, type, date, time, duration, participant, deal value
   ├─ For past: show outcome, score, sentiment, recording buttons
   └─ Allow: click to view full details (drill-down)
```

---

# PART B: CALLS PAGE

## SECTION 3: PAGE OVERVIEW

### Purpose
- Display all call records with metadata
- Filter by call type (incoming/outgoing/missed)
- Search by contact, company, or topic
- View call analytics (sentiment, score, topics)
- Access call recordings

### Page Structure
```
CALLS PAGE LAYOUT:
├─ Header
│  ├─ Title: "Calls"
│  ├─ Subtitle: "View and manage all call recordings"
│  ├─ Export button
│  └─ "Make Call" button
│
├─ Search Bar
│  └─ Searchable by: contact, company, topic
│
├─ Filter Buttons (4 options)
│  ├─ All (default)
│  ├─ Incoming (with icon)
│  ├─ Outgoing (with icon)
│  ├─ Missed (with icon)
│  └─ More Filters button
│
└─ Calls Table (rows sorted by date DESC)
   └─ For each call row:
      ├─ Type icon (phone in/out/missed with color coding)
      ├─ Contact name (with avatar)
      ├─ Company name (with icon)
      ├─ Date & Time
      ├─ Duration (MM:SS format)
      ├─ Sentiment (color-coded)
      ├─ Topics (badges with +more indicator)
      ├─ Score (numeric + progress bar)
      └─ Actions (Play, Star, More menu)

Pagination at bottom with page numbers
```

### Example Call Data
```javascript
{
  id: "1",
  type: "outgoing",  // or "incoming", "missed"
  contact: "Sarah Johnson",
  company: "Acme Corp",
  duration: "12:34",  // MM:SS format
  date: "Mar 20, 2026",
  time: "10:45 AM",
  status: "completed",
  recorded: true,
  sentiment: "Positive",
  topics: ["Pricing", "Demo", "Next Steps"],
  score: 85,
  recordingUrl: "s3://..."
}
```

---

## SECTION 4: CALLS - DATABASE SCHEMA & QUERIES

### Database Tables

```sql
Table: meetings (reused from Meetings section)
├─ id (PK) UUID
├─ meeting_type ENUM('call', 'video_meeting', 'email', 'lunch_and_learn', 'conference', 'webinar')
├─ call_direction ENUM('incoming', 'outgoing', 'missed', 'conference')
├─ contact_id (FK → contacts)
├─ account_id (FK → accounts)
├─ duration_ms INTEGER
├─ recording_url TEXT [for recorded calls]
├─ sentiment ENUM('very_positive', 'positive', 'neutral', 'negative', 'very_negative')
├─ ai_quality_score DECIMAL(5,2)
├─ topics JSONB [array of topic strings]
├─ is_missed_call BOOLEAN
├─ transcription_text TEXT [full call transcript]
├─ call_timestamp TIMESTAMPTZ
└─ INDEXES: (organization_id, owner_id, call_timestamp)

Table: call_metrics (NEW - detailed call analytics)
├─ id (PK) UUID
├─ meeting_id (FK)
├─ organization_id (FK)
├─ questions_count INTEGER
├─ talk_ratio_rep DECIMAL(5,2)  -- % rep was talking
├─ talk_ratio_customer DECIMAL(5,2)  -- % customer was talking
├─ silence_duration_seconds INTEGER
├─ engagement_score DECIMAL(5,2)
├─ objections_detected INTEGER
├─ buying_signals_count INTEGER
├─ competitor_mentions_count INTEGER
├─ created_at TIMESTAMPTZ
└─ INDEXES: (meeting_id, organization_id)

Table: call_topics (NEW - extracted topics)
├─ id (PK) UUID
├─ meeting_id (FK)
├─ topic_name VARCHAR (e.g., "Pricing", "Demo", "ROI")
├─ confidence_score DECIMAL(5,2)
├─ mentions_count INTEGER
├─ timestamp_start INTEGER [when topic was mentioned]
├─ created_at TIMESTAMPTZ
└─ INDEXES: (meeting_id, topic_name)
```

### Query Logic

```sql
-- ALL CALLS (filtered, sorted, paginated)
SELECT 
  m.id,
  CASE m.call_direction
    WHEN 'incoming' THEN 'incoming'
    WHEN 'outgoing' THEN 'outgoing'
    WHEN 'missed' THEN 'missed'
    ELSE 'outgoing'
  END as type,
  c.full_name as contact,
  a.name as company,
  LPAD(FLOOR(m.duration_ms / 1000 / 60)::text, 2, '0') || ':' ||
  LPAD(MOD(FLOOR(m.duration_ms / 1000), 60)::text, 2, '0') as duration,
  TO_CHAR(m.call_timestamp, 'Mon DD, YYYY') as date,
  TO_CHAR(m.call_timestamp, 'HH:MI AM') as time,
  'completed' as status,
  COALESCE(m.recording_url IS NOT NULL, FALSE) as recorded,
  m.sentiment,
  -- Topics as array
  ARRAY(
    SELECT topic_name 
    FROM call_topics 
    WHERE meeting_id = m.id 
    ORDER BY mentions_count DESC
    LIMIT 5
  ) as topics,
  m.ai_quality_score as score,
  m.recording_url

FROM meetings m
LEFT JOIN contacts c ON m.contact_id = c.id
LEFT JOIN accounts a ON m.account_id = a.id

WHERE m.organization_id = ?
  AND m.owner_id = ?
  AND m.meeting_type = 'call'
  AND m.status = 'completed'
  AND (
    -- Search filter
    c.full_name ILIKE ? OR 
    a.name ILIKE ? OR 
    EXISTS (
      SELECT 1 FROM call_topics ct 
      WHERE ct.meeting_id = m.id 
      AND ct.topic_name ILIKE ?
    )
  )
  -- Call type filter
  AND (
    ? = 'all' OR 
    m.call_direction = ?
  )

ORDER BY m.call_timestamp DESC

LIMIT 20 OFFSET ?;  -- Pagination: 20 per page

-- GET CALL DETAILS (for drill-down)
SELECT 
  m.*,
  c.full_name as contact,
  c.email,
  c.phone,
  a.name as company,
  a.industry,
  d.id as deal_id,
  d.title as deal_name,
  d.stage as deal_stage,
  cm.questions_count,
  cm.talk_ratio_rep,
  cm.talk_ratio_customer,
  cm.engagement_score,
  cm.objections_detected,
  cm.competitor_mentions_count

FROM meetings m
LEFT JOIN contacts c ON m.contact_id = c.id
LEFT JOIN accounts a ON m.account_id = a.id
LEFT JOIN deals d ON m.deal_id = d.id
LEFT JOIN call_metrics cm ON m.id = cm.meeting_id

WHERE m.id = ? AND m.organization_id = ?;
```

### Data Ingestion Flow for Calls

```
FLOW: Call Recording & Analysis
│
├─ CALL INITIATION
│  ├─ Source 1: Dial from Tasknova (outgoing)
│  │  ├─ Rep clicks "Make Call" or dials number
│  │  ├─ System: lookup contact by phone number
│  │  ├─ Create meetings record:
│  │  │  ├─ call_direction = 'outgoing'
│  │  │  ├─ contact_id = matched contact
│  │  │  ├─ account_id = contact's company
│  │  │  ├─ status = 'in_progress'
│  │  │  └─ initiated_at = NOW()
│  │  │
│  │  └─ Begin recording (if enabled)
│  │
│  ├─ Source 2: Inbound call via PBX/Twilio
│  │  ├─ Incoming call arrives at organization's phone number
│  │  ├─ PBX/Twilio webhook sent to Tasknova
│  │  ├─ Extract: caller phone number, timestamp
│  │  ├─ Lookup contact by phone
│  │  ├─ Create meetings record:
│  │  │  ├─ call_direction = 'incoming'
│  │  │  ├─ contact_id = matched or 'unknown'
│  │  │  ├─ status = 'in_progress'
│  │  │  └─ initiated_at = NOW()
│  │  │
│  │  ├─ Alert assigned rep:
│  │  │  ├─ In-app notification
│  │  │  ├─ Ringtone
│  │  │  └─ Show contact card
│  │  │
│  │  └─ Rep answers call (or routed to voicemail)
│  │
│  └─ Source 3: Missed call
│     ├─ Incoming call not answered
│     ├─ Create meetings record:
│     │  ├─ call_direction = 'missed'
│     │  ├─ status = 'completed'
│     │  ├─ is_missed_call = TRUE
│     │  ├─ sentiment = null
│     │  ├─ duration_ms = 0
│     │  └─ recording = null
│     │
│     └─ Trigger voicemail capture (if available)
│
├─ CALL RECORDING
│  ├─ Record microphone input during call
│  ├─ Stream to temporary S3 bucket location
│  ├─ Use Twilio recording or browser WebRTC
│  └─ Continue until call ends or manually stopped
│
├─ CALL COMPLETION
│  ├─ Rep ends call or call disconnects
│  ├─ Calculate: duration_ms = end_time - start_time
│  ├─ Update meetings.status = 'completed'
│  ├─ Stop recording, finalize audio file
│  ├─ Move recording to permanent S3 path
│  └─ Update meetings.recording_url
│
├─ TRANSCRIPTION
│  ├─ Async job: transcribe recording via:
│  │  ├─ Google Cloud Speech-to-Text
│  │  ├─ AWS Transcribe
│  │  └─ Custom speech model
│  │
│  ├─ Output:
│  │  ├─ Full transcript with timestamps
│  │  ├─ Speaker identification (rep vs customer)
│  │  ├─ Confidence scores per segment
│  │  └─ Words spoken (for indexing)
│  │
│  └─ Store: transcription_text in meetings table
│
├─ SENTIMENT ANALYSIS
│  ├─ Input: Transcript + audio emotional analysis
│  ├─ Classify overall sentiment: very_positive → very_negative
│  ├─ Segment-by-segment sentiment detection
│  ├─ Store: m.sentiment = classification
│  └─ Average customer sentiment extraction
│
├─ QUALITY SCORING
│  ├─ Analyze call metrics:
│  │  ├─ Questions asked (quality + quantity)
│  │  ├─ Talk/listen ratio (target 40/60 for sales)
│  │  ├─ Engagement level (no long silences)
│  │  ├─ Objections raised and how handled
│  │  ├─ Buying signals + buying indicators present
│  │  ├─ ROI discussion vs feature focus
│  │  ├─ Timeline / urgency
│  │  └─ Next steps clarity
│  │
│  ├─ Formula (custom weights per organization):
│  │  score = (
│  │    questions * 0.25 +
│  │    talk_ratio * 0.20 +
│  │    engagement * 0.20 +
│  │    objections * 0.15 +
│  │    buying_signals * 0.10 +
│  │    next_steps * 0.10
│  │  )
│  │
│  ├─ Create call_metrics record
│  └─ Store: m.ai_quality_score
│
├─ TOPIC EXTRACTION
│  ├─ Use NER to identify:
│  │  ├─ Products mentioned
│  │  ├─ Solutions discussed
│  │  ├─ Competitors named
│  │  ├─ Technical terms
│  │  ├─ Timeline indicators
│  │  ├─ Budget discussions
│  │  └─ Authority levels
│  │
│  ├─ Classify into standard topics:
│  │  ├─ "Pricing", "Demo", "ROI", "Integration", "Security"
│  │  ├─ "Timeline", "Support", "Feature Request"
│  │  └─ Custom topics per organization
│  │
│  ├─ For each topic:
│  │  ├─ Record: mention count, timestamps, confidence
│  │  └─ Create call_topics records
│  │
│  └─ Store array: m.topics = ["Pricing", "Timeline", "ROI"]
│
├─ COMPETITOR TRACKING
│  ├─ Extract competitor names mentioned
│  ├─ Determine sentiment about competitor:
│  │  ├─ Positive ("Competitor X is also good but...")
│  │  ├─ Neutral ("We're also evaluating Competitor X")
│  │  └─ Negative ("Competitor X has this issue")
│  │
│  ├─ Store competitor_mentions_count
│  └─ Create intelligence for competitive analysis
│
├─ OBJECTION DETECTION
│  ├─ Identify when customer raised concerns:
│  │  ├─ "That's too expensive"
│  │  ├─ "We need to check with IT first"
│  │  ├─ "Let me think about it"
│  │  ├─ "How do I know this will work?"
│  │  └─ etc.
│  │
│  ├─ Track: objections_detected count
│  └─ Note: if each objection was handled or not
│
├─ BUYING SIGNALS
│  ├─ Identify positive indicators:
│  │  ├─ "Let's move forward"
│  │  ├─ "When can we start?"
│  │  ├─ Budget mentioned + affirmative
│  │  ├─ "Can we do this by [date]?"
│  │  └─ Decision maker confirmed
│  │
│  └─ Store: buying_signals_count
│
├─ AUTO-OUTCOME DETECTION
│  ├─ Based on signals + sentiment analyze:
│  │  ├─ IF buying_signals > 0 AND sentiment positive → 'Qualified'
│  │  ├─ IF high interest + further evaluation → 'Interested'
│  │  ├─ IF clear rejection → 'Not Interested'
│  │  └─ Else → null (manual override)
│  │
│  └─ Update: m.outcome
│
├─ DEAL LINKING
│  ├─ Auto-link to matching open deal:
│  │  ├─ If contact on call → check their deals
│  │  ├─ Suggest top deal by probability
│  │  └─ Allow manual selection
│  │
│  └─ Update: m.deal_id
│
├─ COACHING RECOMMENDATIONS
│  ├─ Generate personalized coaching:
│  │  ├─ "Great job asking discovery questions (12 asked)"
│  │  ├─ "Try to listen more (58% talk ratio, target 40%)"
│  │  ├─ "Good objection handling on pricing concern"
│  │  └─ "Remember to confirm next steps"
│  │
│  └─ Display on call review page
│
├─ DATA SOURCES
│  ├─ Twilio / WebRTC call recording stream
│  ├─ PBX system (for inbound calls)
│  ├─ Speech-to-text service (transcription)
│  ├─ NLP models (sentiment, topics, entities)
│  ├─ Contact database (caller matching)
│  └─ Deal pipeline (outcome inference)
│
└─ DISPLAY ON CALLS PAGE
   ├─ Query: SELECT calls WHERE owner_id = current_user
   ├─ Filter: call_direction = selected_type
   ├─ Search: By contact, company, or topics
   ├─ Sort: call_timestamp DESC (most recent first)
   ├─ Show per row:
   │  ├─ Type icon (incoming/outgoing/missed)
   │  ├─ Contact name + avatar
   │  ├─ Company name
   │  ├─ Date & time
   │  ├─ Duration MM:SS
   │  ├─ Sentiment (color-coded)
   │  ├─ Topics (max 3 with +X)
   │  ├─ Quality score + bar
   │  └─ Actions: Play, Star (favorite), More
   │
   └─ Pagination: 20 calls per page
```

---

# PART C: TASKS PAGE

## SECTION 5: PAGE OVERVIEW

### Purpose
- Display all user's tasks (to-do items, action items)
- Filter by status (To Do / In Progress / Done)
- Filter by priority (High / Medium / Low)
- Search tasks by title, description, or company
- Track task completion and assignment
- Show summary stats

### Page Structure
```
TASKS PAGE LAYOUT:
├─ Header
│  ├─ Title: "Tasks"
│  ├─ Subtitle: "Manage your tasks and action items"
│  └─ "+ New Task" button
│
├─ Search Bar
│  └─ Searchable by: title, description, company
│
├─ Filter Dropdowns
│  ├─ Status filter (All/To Do/In Progress/Done)
│  ├─ Priority filter (All/High/Medium/Low)
│  └─ "More" filters button
│
├─ Tasks Table (sortable columns)
│  ├─ Checkbox column (mark as done)
│  └─ For each task row:
│     ├─ Task name (linked) + description
│     ├─ Company (if applicable)
│     ├─ Priority (flag icon + badge)
│     ├─ Status (badge with color)
│     ├─ Due date (calendar icon)
│     ├─ Assignee (avatar + name)
│     ├─ Tags (badges)
│     └─ Actions menu (...)
│
└─ Summary Stats (4 cards)
   ├─ To Do count
   ├─ In Progress count (blue)
   ├─ Done count (green)
   └─ High Priority count (red)
```

### Example Task Data
```javascript
{
  id: "1",
  title: "Follow up with Acme Corp on pricing proposal",
  description: "Send updated pricing based on their enterprise requirements",
  priority: "high",
  status: "todo",
  dueDate: "Mar 22, 2026",
  assignee: "Sarah Johnson",  // or "You"
  company: "Acme Corp",
  tags: ["Proposal", "Pricing"],
  createdAt: "2026-03-20"
}
```

---

## SECTION 6: TASKS - DATABASE SCHEMA & QUERIES

### Database Tables

```sql
Table: tasks
├─ id (PK) UUID
├─ organization_id (FK)
├─ assigned_to (FK → users)
├─ created_by (FK → users)
├─ title VARCHAR(255)
├─ description TEXT
├─ priority ENUM('high', 'medium', 'low')
├─ status ENUM('todo', 'in-progress', 'done', 'cancelled')
├─ due_date DATE
├─ due_time TIME [optional - specific time]
├─ account_id (FK → accounts) [optional - company link]
├─ contact_id (FK → contacts) [optional - contact link]
├─ deal_id (FK → deals) [optional - deal link]
├─ meeting_id (FK → meetings) [optional - from meeting follow-up]
├─ completed_at TIMESTAMPTZ [populated when marked done]
├─ created_at TIMESTAMPTZ
├─ updated_at TIMESTAMPTZ
└─ INDEXES: (assigned_to, status, due_date), (organization_id, status)

Table: task_tags
├─ id (PK) UUID
├─ task_id (FK)
├─ tag_name VARCHAR (e.g., "Proposal", "Pricing", "Follow-up")
├─ created_at TIMESTAMPTZ
└─ INDEXES: (task_id, tag_name)

Table: task_comments
├─ id (PK) UUID
├─ task_id (FK)
├─ user_id (FK)
├─ comment_text TEXT
├─ created_at TIMESTAMPTZ
├─ updated_at TIMESTAMPTZ
└─ INDEXES: (task_id, created_at)

Table: task_history (audit trail)
├─ id (PK) UUID
├─ task_id (FK)
├─ changed_by (FK → users)
├─ field_name VARCHAR (e.g., 'status', 'priority', 'assignee')
├─ old_value TEXT
├─ new_value TEXT
├─ changed_at TIMESTAMPTZ
└─ INDEXES: (task_id, changed_at)
```

### Query Logic

```sql
-- ALL TASKS (filtered, searchable, paginated)
SELECT 
  t.id,
  t.title,
  t.description,
  t.priority,
  t.status,
  t.due_date,
  TO_CHAR(t.due_date, 'Mon DD, YYYY') as formatted_due_date,
  CASE 
    WHEN t.due_date < CURRENT_DATE AND t.status != 'done' THEN 'OVERDUE'
    WHEN t.due_date = CURRENT_DATE THEN 'DUE_TODAY'
    WHEN t.status = 'done' THEN 'COMPLETED'
    ELSE NULL
  END as due_status,
  u_assigned.full_name as assignee,
  u_assigned.id as assignee_id,
  COALESCE(a.name, '') as company,
  a.id as account_id,
  ARRAY(
    SELECT tag_name FROM task_tags 
    WHERE task_id = t.id
  ) as tags,
  t.created_at

FROM tasks t
LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
LEFT JOIN accounts a ON t.account_id = a.id

WHERE t.organization_id = ?
  AND t.assigned_to = ?  -- current user
  AND (
    -- Search filter
    t.title ILIKE ? OR 
    t.description ILIKE ? OR 
    a.name ILIKE ?
  )
  -- Status filter
  AND (? = 'all' OR t.status = ?)
  -- Priority filter
  AND (? = 'all' OR t.priority = ?)
  -- Don't show cancelled tasks by default
  AND t.status != 'cancelled'

ORDER BY 
  CASE 
    WHEN t.status = 'in-progress' THEN 1
    WHEN t.status = 'todo' THEN 2
    WHEN t.status = 'done' THEN 3
  END ASC,
  CASE 
    WHEN t.priority = 'high' THEN 1
    WHEN t.priority = 'medium' THEN 2
    ELSE 3
  END ASC,
  t.due_date ASC;

-- SUMMARY STATS
SELECT 
  COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo_count,
  COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_count,
  COUNT(CASE WHEN status = 'done' THEN 1 END) as done_count,
  COUNT(CASE WHEN status IN ('todo', 'in-progress') AND priority = 'high' THEN 1 END) as high_priority_count

FROM tasks

WHERE assigned_to = ?
  AND organization_id = ?
  AND status != 'cancelled';

-- OVERDUE TASKS
SELECT *
FROM tasks
WHERE assigned_to = ?
  AND organization_id = ?
  AND due_date < CURRENT_DATE
  AND status IN ('todo', 'in-progress')
ORDER BY due_date ASC;
```

### Data Ingestion Flow for Tasks

```
FLOW: Task Creation & Management
│
├─ TASK CREATION SOURCES
│  ├─ Source 1: Manual Creation
│  │  ├─ User clicks "+ New Task"
│  │  ├─ Fill form:
│  │  │  ├─ Title
│  │  │  ├─ Description
│  │  │  ├─ Due Date
│  │  │  ├─ Priority
│  │  │  ├─ Assign to (self or others)
│  │  │  ├─ Link to company/contact/deal
│  │  │  └─ Add tags
│  │  │
│  │  ├─ Validation:
│  │  │  ├─ Title required
│  │  │  ├─ Due date >= today
│  │  │  └─ Priority defaults to 'medium'
│  │  │
│  │  ├─ Insert into tasks table
│  │  ├─ Insert tags into task_tags
│  │  └─ Send notifications to assignee (if not self)
│  │
│  ├─ Source 2: From Meeting Follow-up
│  │  ├─ In meeting detail view, create task:
│  │  │  ├─ "Follow up on proposal" → auto-link meeting
│  │  │  ├─ Set due_date = meeting_date + 3 days
│  │  │  ├─ Set priority = infer from meeting outcome
│  │  │  ├─ Link to deal + contact
│  │  │  └─ Auto-tag with meeting type
│  │  │
│  │  └─ Create tasks record with meeting_id FK
│  │
│  ├─ Source 3: From Deal Pipeline
│  │  ├─ Deal stage change triggers task creation:
│  │  │  ├─ When deal → 'Proposal' stage:
│  │  │  │  ├─ Create task: "Send proposal to [account]"
│  │  │  │  ├─ Due: in 1 day
│  │  │  │  ├─ Priority: high (if deal > $100K)
│  │  │  │  └─ Assign to deal owner
│  │  │  │
│  │  │  ├─ When deal → 'Negotiation' stage:
│  │  │  │  ├─ Create task: "Follow up on contract negotiation"
│  │  │  │  └─ Due: in 2 days
│  │  │  │
│  │  │  └─ When deal → 'Closing' stage:
│  │  │      ├─ Create task: "Final approval needed"
│  │  │      ├─ Due: TODAY
│  │  │      └─ Priority: high
│  │  │
│  │  └─ Create tasks record with deal_id FK
│  │
│  ├─ Source 4: From CRM Auto-Rules
│  │  ├─ Admin sets up automatic task creation:
│  │  │  ├─ "When contact not contacted in 30 days → create task"
│  │  │  ├─ "When deal in stage X for > 2 weeks → create task"
│  │  │  └─ "Daily: create task for each overdue follow-up"
│  │  │
│  │  └─ Scheduled job at N:00 UTC creates batch tasks
│  │
│  └─ Source 5: Manager Assignment
│     ├─ Manager assigns tasks to team members:
│     │  ├─ Create task with assigned_to = rep_id
│     │  ├─ created_by = manager_id
│     │  ├─ Includes context (email, Slack notification)
│     │  └─ Rep gets notification
│     │
│     └─ Insert tasks record
│
├─ TASK ASSIGNMENT NOTIFICATIONS
│  ├─ When task created/assigned to someone:
│  │  ├─ In-app notification
│  │  ├─ Email notification (if enabled)
│  │  ├─ Slack notification (if integrated)
│  │  └─ SMS for high-priority tasks (optional)
│  │
│  └─ Include: task title, due date, link to open
│
├─ TASK STATUS TRANSITIONS
│  ├─ When user clicks checkbox:
│  │  ├─ IF task.status = 'todo' THEN → 'in-progress'
│  │  ├─ IF task.status = 'in-progress' THEN → 'done'
│  │  ├─ Update: status, updated_at
│  │  ├─ Create task_history record
│  │  ├─ Set: completed_at = NOW() (if done)
│  │  └─ Notify created_by (if assigned by manager)
│  │
│  ├─ User can manually change status via dropdown:
│  │  ├─ 'todo' → 'in-progress'
│  │  ├─ 'todo' → 'done' (skip in-progress)
│  │  ├─ 'in-progress' → 'todo' (reopen)
│  │  ├─ 'in-progress' → 'done'
│  │  ├─ Any → 'cancelled' (soft delete)
│  │  └─ Log each transition in task_history
│  │
│  └─ Manager can reassign tasks:
│     ├─ Change assigned_to to different user
│     ├─ Create task_history record
│     └─ Notify new assignee
│
├─ PRIORITY UPDATES
│  ├─ When due_date <= TODAY and task not done:
│  │  ├─ Flag as OVERDUE in UI (red)
│  │  ├─ Optionally auto-bump priority to 'high'
│  │  ├─ Send daily reminder to assignee
│  │  └─ Alert manager if task is unowned
│  │
│  └─ High priority tasks get extra visibility
│
├─ TASK LINKING & CONTEXT
│  ├─ When task created from deal/contact/meeting:
│  │  ├─ Set: account_id, contact_id, deal_id, or meeting_id FK
│  │  ├─ Show context in task detail:
│  │  │  ├─ "Related to: [Deal Name]"
│  │  │  ├─ "Contact: [Contact Name]"
│  │  │  ├─ "From meeting: [Meeting Title]"
│  │  │  └─ Link to open original record
│  │  │
│  │  └─ For search/filtering: include context fields
│  │
├─ TAGGING SYSTEM
│  ├─ Predefined tags (organization setup):
│  │  ├─ "Follow-up", "Proposal", "Pricing", "Demo"
│  │  ├─ "Legal", "Technical", "Internal", "Urgent"
│  │  ├─ "Admin", "CRM", "Reporting", "Onboarding"
│  │  └─ "Success", "Support", "Research", "Strategy"
│  │
│  ├─ Auto-tagging based on source:
│  │  ├─ If from meeting → auto-tag with meeting.type
│  │  ├─ If from deal proposal → auto-tag "Proposal"
│  │  └─ If high priority & no deal → auto-tag "Urgent"
│  │
│  └─ User can add/remove tags from task
│
├─ COMMENTS & COLLABORATION
│  ├─ Users can comment on tasks:
│  │  ├─ Add notes, status updates, blockers
│  │  ├─ @mention other team members
│  │  ├─ Attach files (screenshots, docs)
│  │  └─ Comments stored in task_comments table
│  │
│  ├─ Mentions trigger notifications
│  └─ Thread-style comments visible in task detail
│
├─ RECURRING TASKS
│  ├─ System can create recurring tasks:
│  │  ├─ "Weekly: Update CRM" → creates on Monday
│  │  ├─ "Monthly: Prepare reports" → creates on 1st
│  │  ├─ After completion, create next instance
│  │  └─ Linked via parent_task_id
│  │
│  └─ Option to convert one-time task to recurring
│
├─ TASK COMPLETION METRICS
│  ├─ Track completion rate:
│  │  ├─ Avg time to complete (due_date to completed_at)
│  │  ├─ % of tasks completed on time
│  │  ├─ % of overdue tasks
│  │  └─ Burndown: tasks completed per day
│  │
│  └─ Display in summary stats for team
│
├─ DATA SOURCES
│  ├─ Manual task creation (UI)
│  ├─ Meetings table (follow-ups)
│  ├─ Deals table (stage changes)
│  ├─ CRM automation rules
│  ├─ Manager assignments
│  ├─ User interactions (status updates)
│  └─ Historical task_history records
│
└─ DISPLAY ON TASKS PAGE
   ├─ Query: SELECT tasks WHERE assigned_to = current_user
   ├─ Filter: status (dropdown)
   ├─ Filter: priority (dropdown)
   ├─ Search: by title, description, company
   ├─ Sort by:
   │  ├─ Primary: status (todo → in_progress → done)
   │  ├─ Secondary: priority (high → medium → low)
   │  └─ Tertiary: due_date (earliest first)
   │
   ├─ Display columns:
   │  ├─ Checkbox (to mark done)
   │  ├─ Title + description + company link
   │  ├─ Priority flag + badge
   │  ├─ Status badge (color-coded)
   │  ├─ Due date with calendar icon
   │  ├─ Assignee avatar + name
   │  ├─ Tags (multiple badges)
   │  └─ Actions (edit, delete, more)
   │
   ├─ Summary stats at bottom:
   │  ├─ To Do count
   │  ├─ In Progress count
   │  ├─ Done count
   │  └─ High Priority count
   │
   └─ Highlight:
      ├─ OVERDUE tasks in RED
      ├─ DUE TODAY in ORANGE
      ├─ and HIGH PRIORITY always visible
```

---

## SECTION 7: COMPREHENSIVE INTEGRATION ARCHITECTURE

### Data Relationships & Flows

```
CROSS-PAGE DATA FLOW:

Dashboard
    ↓
    ├─→ Meetings Page
    │   ├─ All meetings (scheduled/completed/past)
    │   ├─ + Recording playback
    │   ├─ + AI analysis (sentiment, score, topics)
    │   │
    │   └─ Drill-down to Meeting Detail Page
    │       ├─ Full transcript
    │       ├─ Call quality breakdown
    │       ├─ Coaching recommendations
    │       └─ Auto-create follow-up task button
    │
    ├─→ Calls Page
    │   ├─ All call records (Type/Sentiment/Topics/Score)
    │   ├─ Search & Filter (contact, company, topic)
    │   ├─ Call Scoring (45-92 range)
    │   │
    │   └─ Drill-down to Call Detail Page
    │       ├─ Full transcript (timestamped)
    │       ├─ Call metrics (talk ratio, questions, etc.)
    │       ├─ Sentiment timeline
    │       ├─ Topic timeline
    │       ├─ Competitor mentions
    │       └─ Objection handling review
    │
    └─→ Tasks Page
        ├─ All tasks (To Do/In Progress/Done)
        ├─ Search & Filter (status, priority, title)
        ├─ Summary stats (counts by status/priority)
        │
        ├─ Task Creation Sources:
        │  ├─ Manual creation
        │  ├─ From Meeting (follow-up)
        │  › From Deal stage (e.g., "Send proposal")
        │  ├─ From automation rules
        │  └─ Manager assignment
        │
        └─ Drill-down to Task Detail Page
            ├─ Full description
            ├─ Comments thread
            ├─ Related record links
            │  ├─ Associated deal
            │  ├─ Contact
            │  ├─ Company
            │  ├─ Linked meeting
            │  └─ Created by (manager)
            │
            └─ Task Actions:
               ├─ Change status
               ├─ Change priority
               ├─ Reassign
               ├─ Add comments
               ├─ Add tags
               └─ Delete/archive
```

### Real-Time Updates & Notifications

```
NOTIFICATION FLOW:

MEETINGS:
├─ Incoming meeting scheduled → notification (24h, 1h, 15m before)
├─ Upcoming meeting reminder → send 15 min before
├─ Meeting started by manager → team notification
└─ Recording ready after meeting → notification with play button

CALLS:
├─ Inbound call arriving → popup + audio alert
├─ Call recording complete → notification
├─ Transcription ready → notification
├─ Call scored (high score: 85+) → positive notification
└─ Call scored low (< 60) → coaching opportunity alert

TASKS:
├─ Task assigned to me → immediate notification
├─ Task due today → morning notification
├─ Task overdue → daily escalating alerts
├─ Task assigned to me by manager → priority notification
├─ Comment on my task → mention notification
├─ Subtask status change → parent task notification
└─ Task completion → celebratory notification
```

---

## SECTION 8: SUMMARY OF ALL REQUIRED TABLES

```
COMPLETE DATABASE SCHEMA FOR MEETINGS, CALLS & TASKS:

├─ meetings (core - shared across all three pages)
├─ meeting_participants
├─ contacts
├─ accounts
├─ deals
├─ call_metrics (call-specific)
├─ call_topics (call-specific)
├─ tasks (task-specific)
├─ task_tags (task-specific)
├─ task_comments (task-specific)
├─ task_history (audit trail)
├─ users
└─ organizations
```

All configured with:
- Proper foreign keys
- Row-Level Security (RLS) for multi-tenant isolation
- Appropriate indexes for query performance
- Audit trails (created_at, updated_at, task_history)
- Pagination support (offsets, limits)
- Search & filter optimization

---

**END OF MEETINGS, CALLS & TASKS ARCHITECTURE DOCUMENTATION**

# Scheduler, Customers, Deals & Coaching - Complete Architecture
## Detailed Backend, Database & API Design for All Components

---

# PART A: SCHEDULER PAGE

## SECTION 1: PAGE OVERVIEW

### Purpose
- Schedule and manage coaching sessions (1:1, Performance Reviews, Team Syncs)
- Choose between List and Calendar views
- Display upcoming/scheduled sessions with topics and notes
- Track coaching session types and participation
- Quick stats on session distribution

### Page Structure
```
SCHEDULER PAGE LAYOUT:

├─ Header
│  ├─ Title: "Scheduler"
│  ├─ Subtitle: "Schedule and manage 1:1 coaching sessions"
│  ├─ View Toggle (List/Calendar)
│  └─ "+ Schedule Session" button
│
├─ Search Bar
│  └─ Searchable by: participant name, session type
│
├─ Filter Button
│  └─ More Filters
│
├─ CONTENT AREA (Two Views)
│
│  ├─ LIST VIEW (Default)
│  │  ├─ "Upcoming Sessions" header
│  │  └─ For each session card:
│  │     ├─ Session type badge (1:1 Coaching/Performance Review/Team Sync)
│  │     ├─ "with [Participant]" name
│  │     ├─ Date, Time, Duration metadata
│  │     ├─ Role (if applicable)
│  │     ├─ Topics (badges)
│  │     ├─ Notes (if applicable)
│  │     ├─ "Join" button (video)
│  │     └─ More actions menu
│  │
│  │  ├─ Quick Stats (4 cards below):
│  │  │  ├─ Total Sessions count
│  │  │  ├─ 1:1 Coaching count (blue)
│  │  │  ├─ Performance Reviews count (purple)
│  │  │  └─ Team Meetings count (green)
│  │
│  └─ CALENDAR VIEW (Week grid)
│     ├─ Header: "March 2026" with navigation
│     ├─ Buttons: Previous, Today, Next
│     └─ Grid (8 columns: Time + 7 days)
│        ├─ Time slots from 9:00 AM to 5:00 PM
│        ├─ Days: Mon 17 - Sun 23
│        └─ Color-coded session blocks
│           ├─ Blue: 1:1 Coaching
│           ├─ Purple: Performance Review
│           ├─ Green: Team Sync
```

### Example Session Data
```javascript
{
  id: "1",
  type: "1:1 Coaching",  // or "Performance Review", "Team Sync"
  participant: "Casey Johnson",
  role: "Sales Rep",
  date: "Mar 21, 2026",
  time: "10:00 AM",
  duration: "30 min",
  status: "scheduled",
  topics: ["Quota Recovery", "Discovery Skills"],
  notes: "Focus on improving question framework",
  meetingUrl: "https://zoom.us/..."
}
```

---

## SECTION 2: SCHEDULER - DATABASE SCHEMA & QUERIES

### Database Tables

```sql
Table: coaching_sessions
├─ id (PK) UUID
├─ organization_id (FK)
├─ manager_id (FK → users)
├─ rep_id (FK → users)
├─ session_type ENUM('1:1_coaching', 'performance_review', 'team_sync', 'training', 'skip_level')
├─ title VARCHAR
├─ scheduled_start_time TIMESTAMPTZ
├─ scheduled_end_time TIMESTAMPTZ
├─ actual_start_time TIMESTAMPTZ [when session started]
├─ actual_end_time TIMESTAMPTZ [when session ended]
├─ status ENUM('scheduled', 'in_progress', 'completed', 'cancelled')
├─ meeting_url TEXT [Zoom/Teams link]
├─ recording_url TEXT [if recorded]
├─ notes TEXT
├─ created_at TIMESTAMPTZ
├─ updated_at TIMESTAMPTZ
└─ INDEXES: (manager_id, scheduled_start_time), (rep_id, scheduled_start_time)

Table: coaching_topics
├─ id (PK) UUID
├─ session_id (FK)
├─ topic_name VARCHAR (e.g., "Quota Recovery", "Discovery Skills")
├─ priority ENUM('high', 'medium', 'low')
├─ created_at
└─ INDEXES: (session_id)

Table: coaching_session_attendees
├─ id (PK) UUID
├─ session_id (FK)
├─ user_id (FK)
├─ attendance_status ENUM('confirmed', 'declined', 'no_response', 'attended', 'absent')
├─ created_at
└─ INDEXES: (session_id, user_id)

Table: coaching_session_feedback
├─ id (PK) UUID
├─ session_id (FK)
├─ provided_by (FK → users / manager or rep)
├─ rating INT (1-5 stars)
├─ feedback_text TEXT
├─ key_takeaways JSONB [array of strings]
├─ action_items JSONB [array of {title, due_date}]
├─ created_at
├─ updated_at
└─ INDEXES: (session_id)
```

### Query Logic

```sql
-- UPCOMING SESSIONS (for manager/rep)
SELECT 
  cs.id,
  cs.session_type,
  COALESCE(u_rep.full_name, u_manager.full_name) as participant,
  u_rep.title as role,
  TO_CHAR(cs.scheduled_start_time, 'Mon DD, YYYY') as date,
  TO_CHAR(cs.scheduled_start_time, 'HH:MI AM') as time,
  CONCAT(
    LPAD(EXTRACT(MINUTE FROM (cs.scheduled_end_time - cs.scheduled_start_time))::text, 2, '0'),
    ' mins'
  ) as duration,
  cs.notes,
  cs.meeting_url,
  ARRAY(
    SELECT topic_name 
    FROM coaching_topics 
    WHERE session_id = cs.id
    ORDER BY priority ASC
  ) as topics,
  cs.status

FROM coaching_sessions cs
LEFT JOIN users u_rep ON cs.rep_id = u_rep.id
LEFT JOIN users u_manager ON cs.manager_id = u_manager.id

WHERE (cs.manager_id = ? OR cs.rep_id = ?)  -- current user can be either
  AND cs.organization_id = ?
  AND cs.status IN ('scheduled', 'in_progress')
  AND cs.scheduled_start_time >= NOW()

ORDER BY cs.scheduled_start_time ASC;

-- CALENDAR VIEW (week of specific date)
SELECT 
  cs.id,
  TO_CHAR(cs.scheduled_start_time, 'HH:MI AM') as time_slot,
  EXTRACT(DOW FROM cs.scheduled_start_time) as day_of_week,
  cs.session_type,
  COALESCE(u_rep.full_name, u_manager.full_name) as participant,
  cs.meeting_url

FROM coaching_sessions cs
LEFT JOIN users u_rep ON cs.rep_id = u_rep.id
LEFT JOIN users u_manager ON cs.manager_id = u_manager.id

WHERE (cs.manager_id = ? OR cs.rep_id = ?)
  AND cs.organization_id = ?
  AND DATE(cs.scheduled_start_time) >= ? -- week start
  AND DATE(cs.scheduled_start_time) <= ? -- week end

ORDER BY cs.scheduled_start_time ASC;
```

### Data Ingestion Flow

```
FLOW: Coaching Session Lifecycle
│
├─ SESSION CREATION
│  ├─ Manager/admin creates session:
│  │  ├─ Select rep (or team)
│  │  ├─ Choose session type
│  │  ├─ Pick date/time
│  │  ├─ Add topics to discuss
│  │  ├─ Add notes/agenda
│  │  └─ Generate meeting link (Zoom/Teams)
│  │
│  ├─ Insert into coaching_sessions table
│  ├─ Insert topics into coaching_topics table
│  ├─ Add attendees to coaching_session_attendees
│  │
│  └─ SEND INVITATIONS
│     ├─ Email invite to rep
│     ├─ Calendar invite (.ics file)
│     ├─ In-app notification
│     └─ Include meeting link
│
├─ PRE-SESSION PREPARATION
│  ├─ Manager optionally prepares:
│  │  ├─ Review rep's recent call quality scores
│  │  ├─ Lookup improvement opportunities
│  │  ├─ Retrieve recent meeting transcripts for discussion
│  │  └─ Prepare coaching materials
│  │
│  └─ Rep optionally:
│     ├─ Review agenda/topics in advance
│     ├─ Prepare notes/questions
│     └─ Accept/confirm attendance
│
├─ SESSION EXECUTION
│  ├─ Rep joins meeting (clicks "Join" button)
│  ├─ Meeting starts (triggers meeting_url opening)
│  ├─ Update status: 'scheduled' → 'in_progress'
│  ├─ Optional: Record session (if enabled)
│  │
│  └─ During meeting:
│     ├─ Discuss identified topics
│     ├─ Review call recordings/transcripts
│     ├─ Discuss strengths and improvements
│     ├─ Set goals/action items
│     └─ Record notes
│
├─ SESSION COMPLETION
│  ├─ Meeting ends
│  ├─ Update status: 'in_progress' → 'completed'
│  ├─ Record: actual_start_time, actual_end_time
│  ├─ Stop recording (if enabled)
│  │
│  └─ POST-SESSION
│     ├─ Manager completes feedback form:
│     │  ├─ Rate session (1-5 stars)
│     │  ├─ Write feedback summary
│     │  ├─ Document key takeaways
│     │  ├─ Set follow-up action items
│     │  └─ Insert into coaching_session_feedback
│     │
│     ├─ Rep receives notification:
│     │  ├─ Session feedback summary
│     │  ├─ Action items assigned
│     │  ├─ Next session scheduled (if applicable)
│     │  └─ Link to recording (if available)
│     │
│     └─ Coaching impact captured:
│        ├─ Link session to rep's coaching_improvements
│        ├─ Track progress vs previous sessions
│        ├─ Update coaching recommendations
│        └─ Trigger follow-up coaching if needed
│
├─ RECURRING SESSIONS
│  ├─ Option to create recurring sessions:
│  │  ├─ "Every Monday at 10:00 AM"
│  │  ├─ "Bi-weekly on Thursdays"
│  │  ├─ "Monthly performance review"
│  │  └─ Create instances from pattern
│  │
│  └─ Automatically create next instances
│
├─ CALENDAR SYNC
│  ├─ Sync to Google Calendar / Outlook:
│  │  ├─ Send calendar invite
│  │  ├─ Add meeting URL to calendar event
│  │  ├─ Update if rescheduled
│  │  └─ Mark completed in calendar
│  │
│  └─ Track RSVP (accepted/declined/tentative)
│
├─ DATA SOURCES
│  ├─ Manager scheduling input
│  ├─ Rep calendar availability
│  ├─ Meeting platform (Zoom/Teams)
│  ├─ Coaching curriculum (topics)
│  ├─ Call quality data (for improvement targeting)
│  └─ Session feedback & notes
│
└─ DISPLAY ON SCHEDULER PAGE
   ├─ Fetch: coaching_sessions WHERE (manager_id = ? OR rep_id = ?)
   ├─ Filter: status IN ('scheduled', 'in_progress')
   ├─ Sort: scheduled_start_time ASC
   │
   ├─ LIST VIEW displays:
   │  ├─ Session type (color-coded badge)
   │  ├─ Participant name
   │  ├─ Role (if applicable)
   │  ├─ Date, time, duration
   │  ├─ Topics (badges)
   │  ├─ Notes
   │  ├─ Join button
   │  └─ More actions
   │
   ├─ CALENDAR VIEW displays:
   │  ├─ Grid of days/times
   │  ├─ Color-coded session blocks
   │  ├─ Participant name in each block
   │  ├─ Time slot info
   │  └─ Enable filtering by session type
   │
   └─ STATS show:
      ├─ Total upcoming sessions
      ├─ By session type breakdown
      └─ Upcoming this week/month
```

---

# PART B: CUSTOMERS PAGE

## SECTION 3: PAGE OVERVIEW

### Purpose
- Display comprehensive customer database with health scores
- Track customer engagement, contacts, and deal progress
- View customer intelligence (industry, size, sentiment)
- Monitor health trends and risk factors
- Filter by deal status, health, industry, company size

### Page Structure
```
CUSTOMERS PAGE LAYOUT:

├─ Header
│  ├─ Title: "Customer Intelligence"
│  ├─ Subtitle: "AI-powered insights across your customer base"
│  ├─ Filter button
│  └─ "+ Add Customer" button
│
├─ Stats Grid (4 cards)
│  ├─ Total Customers (142, +8 this month ↑)
│  ├─ Active Deals (68, +12 this week ↑)
│  ├─ Avg Health Score (81, +3 points ↑)
│  └─ At Risk (7, -2 vs last week ↓)
│
├─ Tabs (4 views)
│  ├─ My Customers (count)
│  ├─ Team Customers (count)
│  ├─ Ongoing Deals (count)
│  └─ Closed Deals (count)
│
├─ Smart Filters (4 dropdowns)
│  ├─ Health Score
│  ├─ Industry
│  ├─ Company Size
│  └─ Deal Stage
│
└─ Customer Cards (repeating for each customer)
   ├─ Logo (company initials avatar)
   ├─ Company name (linked)
   ├─ Badges: Company Size, Industry
   ├─ Quick stats row:
   │  ├─ Contacts count
   │  ├─ Total conversations (calls)
   │  ├─ Active deals count
   │  └─ Deal status badge
   │
   ├─ Health score (numeric with progress bar)
   ├─ Health trend (↑ or ↔)
   ├─ Last contact time
   ├─ Next meeting date/time
   ├─ Sentiment (color: positive/neutral/negative)
   ├─ Key topics (pills)
   ├─ Champions count
   ├─ Revenue metrics
   └─ Action buttons (View Details, etc.)
```

### Example Customer Data
```javascript
{
  id: "1",
  name: "Acme Corp",
  logo: "AC",
  industry: "Financial Services",
  size: "250-500",
  dealValue: "$850K",
  stage: "Negotiation",
  dealStatus: "Ongoing",
  health: 85,
  healthTrend: "up",
  lastContact: "2 hours ago",
  nextMeeting: "Today, 3:00 PM",
  contacts: 4,
  openDeals: 2,
  totalCalls: 12,
  sentiment: "positive",  // "very positive", "positive", "neutral", "negative"
  riskFactors: [],
  keyTopics: ["Integration", "Pricing", "Timeline"],
  championsCount: 2,
  revenue: "$425K",
  engagement: 92,
  owner: "Alex Rivera"
}
```

---

## SECTION 4: CUSTOMERS - DATABASE SCHEMA & QUERIES

### Database Tables

```sql
Table: accounts (customers)
├─ id (PK) UUID
├─ organization_id (FK)
├─ name VARCHAR
├─ industry VARCHAR
├─ website URL
├─ company_size ENUM('1-50', '50-100', '100-250', '250-500', '500-1000', '1000-5000', '5000+')
├─ headquarters_country VARCHAR
├─ headquarters_state VARCHAR
├─ annual_revenue CURRENCY [optional]
├─ founded_year INT [optional]
├─ created_at TIMESTAMPTZ
└─ INDEXES: (organization_id, industry, company_size)

Table: account_health_scores
├─ id (PK) UUID
├─ account_id (FK)
├─ organization_id (FK)
├─ health_score INT (0-100)
├─ health_trend ENUM('up', 'down', 'stable')
├─ last_contact_date TIMESTAMPTZ
├─ last_activity_date TIMESTAMPTZ
├─ days_since_contact INT
├─ risk_factors JSONB [array of risk strings]
├─ engagement_score INT (0-100)
├─ sentiment_score INT (0-100)
├─ recorded_date DATE
├─ created_at TIMESTAMPTZ
└─ INDEXES: (account_id, health_score, recorded_date DESC)

Table: account_contacts (people at customer)
├─ id (PK) UUID
├─ account_id (FK)
├─ full_name VARCHAR
├─ title VARCHAR (role/job title)
├─ email
├─ phone
├─ is_champion BOOLEAN [true if champion/influencer]
├─ level ENUM('executive', 'manager', 'user', 'other')
├─ created_at
└─ INDEXES: (account_id)

Table: account_metrics
├─ id (PK) UUID
├─ account_id (FK)
├─ organization_id (FK)
├─ total_deals INT
├─ open_deals INT
├─ closed_won INT
├─ closed_lost INT
├─ total_revenue CURRENCY
├─ open_deal_value CURRENCY
├─ total_calls INT
├─ total_emails INT
├─ total_meetings INT
├─ conversion_rate DECIMAL(5,2) [%]
├─ win_rate DECIMAL(5,2) [%]
├─ period_date DATE
├─ created_at
└─ INDEXES: (account_id, period_date DESC)

Table: account_sentiment  
├─ id (PK) UUID
├─ account_id (FK)
├─ sentiment_type ENUM('very_positive', 'positive', 'neutral', 'negative', 'very_negative')
├─ meeting_id (FK) [which meeting generated sentiment]
├─ recorded_date TIMESTAMPTZ
└─ INDEXES: (account_id, recorded_date DESC)
```

### Query Logic

```sql
-- ALL CUSTOMERS (based on tab + filters)
SELECT 
  a.id,
  a.name,
  a.slug,
  a.industry,
  a.company_size as size,
  u.full_name as owner,
  ahs.health_score as health,
  ahs.health_trend,
  ahs.last_contact_date,
  ahs.risk_factors,
  ahs.engagement_score as engagement,
  ahs.sentiment_score,
  (SELECT COUNT(*) FROM account_contacts WHERE account_id = a.id) as contacts,
  (SELECT COUNT(*) FROM deals WHERE account_id = a.id AND stage != 'Closed Lost' AND stage != 'Closed Won') as openDeals,
  (SELECT COUNT(*) FROM meetings WHERE account_id = a.id) as totalCalls,
  COALESCE(
    (SELECT AVG(CASE 
      WHEN m.sentiment IN ('very_positive', 'positive') THEN 'positive'
      WHEN m.sentiment = 'neutral' THEN 'neutral'
      ELSE 'negative'
    END)
    FROM meetings m 
    WHERE m.account_id = a.id 
    LIMIT 1),
    'neutral'
  ) as sentiment,
  ARRAY(
    SELECT DISTINCT topic_name
    FROM call_topics ct
    JOIN meetings m ON ct.meeting_id = m.id
    WHERE m.account_id = a.id
    LIMIT 5
  ) as keyTopics,
  (SELECT COUNT(*) FROM account_contacts WHERE account_id = a.id AND is_champion = TRUE) as championsCount,
  (SELECT SUM(amount) FROM deals WHERE account_id = a.id AND stage = 'Closed Won') as revenue,
  d.stage as dealStage,
  CASE WHEN EXISTS(SELECT 1 FROM deals WHERE account_id = a.id AND stage IN ('Closed Won', 'Closed Lost')) THEN 'Closed' ELSE 'Ongoing' END as dealStatus

FROM accounts a
LEFT JOIN users u ON a.owner_id = u.id
LEFT JOIN account_health_scores ahs ON a.id = ahs.account_id
LEFT JOIN deals d ON a.id = d.account_id AND d.stage IN ('Negotiation', 'Proposal', 'Discovery', 'Demo', 'Qualified')

WHERE a.organization_id = ?
  AND (? = 'all' OR deals.stage = ?)  -- filter by tab
  AND (? = 'all' OR ahs.health_score::INT >= ?)  -- filter by health
  AND (? = 'all' OR a.industry = ?)
  AND (? = 'all' OR a.company_size = ?)

GROUP BY a.id

ORDER BY ahs.health_score DESC;
```

### Data Ingestion Flow

```
FLOW: Customer Lifecycle & Intelligence
│
├─ CUSTOMER CREATION
│  ├─ Manual entry: Rep adds new account
│  ├─ Import: Bulk upload from CSV
│  ├─ Enrichment: Auto-lookup company data
│  │  ├─ Size, industry, revenue from APIs
│  │  ├─ Website, headquarters info
│  │  └─ LinkedIn employee count
│  │
│  └─ Insert into accounts table
│
├─ CONTACT MANAGEMENT
│  ├─ Add contacts (people) to account:
│  │  ├─ Name, title, email, phone
│  │  ├─ Manually entered by rep
│  │  ├─ Or auto-discovered from email domain
│  │  └─ LinkedIn enrichment (optional)
│  │
│  ├─ Mark as "Champion" if influencer/decision maker
│  ├─ Track level (executive/manager/user)
│  └─ Insert into account_contacts table
│
├─ ENGAGEMENT TRACKING (Real-time)
│  ├─ Every interaction logged:
│  │  ├─ Call with contact → +1 total_calls
│  │  ├─ Email sent → +1 total_emails
│  │  ├─ Meeting scheduled → +1 total_meetings
│  │  └─ Update: last_activity_date
│  │
│  └─ Update account_metrics real-time
│
├─ HEALTH SCORE CALCULATION (Daily, 11 PM ET)
│  ├─ Input factors:
│  │  ├─ Recency: Days since last contact (lower = healthier)
│  │  ├─ Frequency: Interactions per week
│  │  ├─ Depth: Multiple contacts engaged
│  │  ├─ Sentiment: Recent call/meeting sentiment
│  │  ├─ Deal progress: Deals moving forward or stalled
│  │  ├─ Revenue: Open deal value
│  │  ├─ Win rate: Historical close rate
│  │  └─ Champions: # of champions/influencers
│  │
│  ├─ Scoring formula (0-100):
│  │  health_score = (
│  │    recency_score * 0.20 +
│  │    frequency_score * 0.20 +
│  │    depth_score * 0.15 +
│  │    sentiment_score * 0.15 +
│  │    deal_progress * 0.15 +
│  │    revenue_score * 0.10 +
│  │    win_rate_score * 0.05
│  │  )
│  │
│  ├─ Compare vs yesterday:
│  │  ├─ IF health_score > yesterday THEN trend = 'up'
│  │  ├─ IF health_score < yesterday THEN trend = 'down'
│  │  └─ ELSE trend = 'stable'
│  │
│  └─ Insert into account_health_scores
│
├─ SENTIMENT ANALYSIS (per interaction)
│  ├─ After each call/meeting:
│  │  ├─ Transcription analyzed for sentiment
│  │  ├─ Customer sentiment determined
│  │  ├─ Store in account_sentiment
│  │  └─ Update average sentiment for account
│  │
│  └─ Used in health score + display
│
├─ RISK FACTOR DETECTION (continuous)
│  ├─ Automatic flagging:
│  │  ├─ No contact in 30+ days → "Dormant"
│  │  ├─ Deal stalled in stage X for 2+ weeks → "Deal Stalled"
│  │  ├─ Negative sentiment in last meeting → "Sentiment Concern"
│  │  ├─ Competitor mentioned recently → "Competing"
│  │  ├─ Budget concerns expressed → "Budget Concerns"
│  │  ├─ Contacts left company → "Contact Lost"
│  │  └─ No champions identified → "No Champion"
│  │
│  ├─ Store in account_health_scores.risk_factors
│  └─ Alert if critical risk appears
│
├─ DEAL METRICS AGGREGATION (Daily)
│  ├─ For each account, calculate:
│  │  ├─ total_deals = COUNT(all deals for account)
│  │  ├─ open_deals = COUNT(open deals)
│  │  ├─ closed_won = COUNT(won deals)
│  │  ├─ closed_lost = COUNT(lost deals)
│  │  ├─ total_revenue = SUM(all closed won deals)
│  │  ├─ open_deal_value = SUM(open deals)
│  │  ├─ conversion_rate = (closed_won / total_deals) * 100
│  │  └─ win_rate = (closed_won / (closed_won + closed_lost)) * 100
│  │
│  └─ Insert into account_metrics
│
├─ ENGAGEMENT SCORE (Weekly)
│  ├─ Measure interaction patterns:
│  │  ├─ Count meetings this week
│  │  ├─ Count calls this week
│  │  ├─ Count emails this week
│  │  ├─ # of unique contacts engaged
│  │  ├─ Trend: increasing/stable/decreasing
│  │  └─ Score 0-100: higher = more engaged
│  │
│  └─ Store in account_health_scores
│
├─ TOPIC EXTRACTION (from meetings)
│  ├─ Pull topics from recent calls:
│  │  ├─ Query call_topics for meetings with this account
│  │  ├─ Group by topic_name
│  │  ├─ Sort by frequency
│  │  ├─ Take top 5 topics
│  │  └─ Display as "Key Topics"
│  │
│  └─ Used for account insights
│
├─ DATA SOURCES
│  ├─ Accounts table (company info)
│  ├─ Contacts/account_contacts (people)
│  ├─ Deals (opportunity tracking)
│  ├─ Meetings (calls/interactions)
│  ├─ Call sentiment analysis
│  ├─ Account metrics aggregation
│  ├─ External data enrichment APIs
│  └─ User activity logs
│
└─ DISPLAY ON CUSTOMERS PAGE
   ├─ Filter: owner = current_user or team
   ├─ Sort by: health_score DESC
   ├─ Group by: tab selection (My/Team/Ongoing/Closed)
   │
   ├─ Display cards with:
   │  ├─ Company logo/avatar
   │  ├─ Name + size + industry badges
   │  ├─ Quick stats: contacts, calls, deals, status
   │  ├─ Health score + trend indicator
   │  ├─ Last contact & next meeting
   │  ├─ Sentiment (color-coded)
   │  ├─ Key topics (pills)
   │  ├─ Champions count
   │  ├─ Revenue generated
   │  └─ Action buttons
   │
   └─ Stats at top showing:
      ├─ Total customers (count)
      ├─ Active deals (count)
      ├─ Avg health score (numeric)
      └─ At risk count
```

---

# PART C: DEALS PAGE

## SECTION 5: PAGE OVERVIEW

### Purpose
- Visualize complete sales pipeline across all deal stages
- Track deal value, health, and momentum
- Filter by deal status (All/Open/Won/Lost/At Risk/etc)
- Support List and Grid views
- AI-powered deal analysis and recommendations
- Drill-down to detailed deal view with chat

### Page Structure
```
DEALS PAGE LAYOUT:

├─ Header
│  ├─ Title: "Deals"
│  ├─ Subtitle: "Manage your sales pipeline and track progress"
│  ├─ "Advanced Filters" button
│  ├─ "Export" button
│  └─ "+ New Deal" button
│
├─ Stats Cards (4 KPIs at top)
│  ├─ Total Pipeline ($XXM, with trend ↑)
│  ├─ Open Deals (count, avg deal value)
│  ├─ Closed Won ($XXM, count, win rate %)
│  └─ At Risk (count, total value)
│
├─ Deal View Tabs (7 options with counts)
│  ├─ All Deals
│  ├─ Open Deals
│  ├─ Closed Won
│  ├─ Closed Lost
│  ├─ Commit (Negotiation stage)
│  ├─ Pipeline (early stages)
│  └─ At Risk
│
├─ Controls Row
│  ├─ Search bar (search deals)
│  ├─ View mode toggle (List/Grid)
│  └─ Filters/Sort options
│
└─ DEALS LIST/GRID
   └─ For each deal row/card:
      ├─ Deal name (linked)
      ├─ Company name
      ├─ Stage badge (color-coded)
      ├─ Value ($XXK)
      ├─ Close date (with overdue indicator ⚠️)
      ├─ Health % (progress bar)
      ├─ Engagement dots (colored by type)
      ├─ Momentum indicator (↑/→/↓)
      ├─ Probability %
      └─ Click to open details panel
```

### Example Deal Data
```javascript
{
  id: "1",
  name: "Enterprise License Deal",
  company: "Acme Corp",
  value: 250000,
  stage: "Negotiation",  // Qualified, Discovery, Demo, Proposal, Negotiation, Closed Won, Closed Lost
  closeDate: "Mar 28, 2026",
  health: 82,  // 0-100 health score
  probability: 75,
  momentum: "positive",  // positive, neutral, stalled
  owner: "Alex Rivera",
  account_id: "1",
  created_at: "2026-02-01",
  lastActivity: "2026-03-20",
  meetings: 5,
  contacts: 3,
  dealValue: "$250K",
  aiInsights: "Deal momentum is positive, buyer budget confirmed, contract under review"
}
```

---

## SECTION 6: DEALS - DATABASE SCHEMA & QUERIES

### Database Tables

```sql
Table: deals
├─ id (PK) UUID
├─ organization_id (FK)
├─ account_id (FK)
├─ owner_id (FK → users)
├─ name VARCHAR
├─ description TEXT
├─ stage ENUM('Lead', 'Qualified', 'Discovery', 'Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost')
├─ value CURRENCY (amount)
├─ probability INT (0-100, adjusted by stage)
├─ expected_close_date DATE
├─ actual_close_date DATE [only if closed]
├─ health INT (0-100)
├─ momentum ENUM('positive', 'neutral', 'stalled')
├─ deal_color VARCHAR [custom color for kanban]
├─ created_at TIMESTAMPTZ
├─ updated_at TIMESTAMPTZ
├─ stage_entered_at TIMESTAMPTZ [when entered current stage]
└─ INDEXES: (organization_id, owner_id, stage), (account_id, stage)

Table: deal_stage_history
├─ id (PK) UUID
├─ deal_id (FK)
├─ previous_stage VARCHAR
├─ new_stage VARCHAR
├─ changed_by (FK → users)
├─ changed_reason TEXT
├─ changed_at TIMESTAMPTZ
└─ INDEXES: (deal_id, changed_at DESC)

Table: deal_metrics
├─ id (PK) UUID
├─ deal_id (FK)
├─ meetings_count INT
├─ contacts_engaged INT
├─ calls_count INT
├─ emails_count INT
├─ days_in_current_stage INT
├─ stage_duration_average INT [avg days in similar deals]
├─ proposal_count INT
├─ follow_up_pending BOOLEAN
├─ last_activity_date TIMESTAMPTZ
├─ calculated_at TIMESTAMPTZ
└─ INDEXES: (deal_id)

Table: deal_stakeholders
├─ id (PK) UUID
├─ deal_id (FK)
├─ contact_id (FK)
├─ role VARCHAR (decision_maker, user, influencer, other)
├─ engagement_level ENUM('high', 'medium', 'low')
├─ is_champion BOOLEAN
└─ added_at TIMESTAMPTZ

Table: deal_activities
├─ id (PK) UUID
├─ deal_id (FK)
├─ activity_type ENUM('call', 'email', 'meeting', 'proposal_sent', 'contract_sent', 'note')
├─ description TEXT
├─ created_by (FK → users)
├─ created_at TIMESTAMPTZ
└─ INDEXES: (deal_id, created_at DESC)

Table: deal_products
├─ id (PK) UUID
├─ deal_id (FK)
├─ product_name VARCHAR
├─ quantity INT
├─ unit_price CURRENCY
├─ discount_percent DECIMAL(5,2)
├─ total_price CURRENCY
├─ added_by (FK → users)
├─ added_at TIMESTAMPTZ
└─ INDEXES: (deal_id)
```

### Query Logic

```sql
-- ALL DEALS (filtered by stage/tab)
SELECT 
  d.id,
  d.name,
  a.name as company,
  d.stage,
  d.value as dealValue,
  TO_CHAR(d.expected_close_date, 'Mon DD, YYYY') as closeDate,
  d.health,
  d.probability,
  d.momentum,
  u.full_name as owner,
  dm.meetings_count as meetings,
  (SELECT COUNT(DISTINCT contact_id) FROM deal_stakeholders WHERE deal_id = d.id) as contacts,
  (SELECT COUNT(*) FROM meetings WHERE deal_id = d.id) as totalCalls,
  (SELECT COUNT(*) FROM deal_activities WHERE deal_id = d.id) as activities

FROM deals d
LEFT JOIN accounts a ON d.account_id = a.id
LEFT JOIN users u ON d.owner_id = u.id
LEFT JOIN deal_metrics dm ON d.id = dm.deal_id

WHERE d.organization_id = ?
  AND d.owner_id = ?
  AND (? = 'all' OR d.stage = ? OR ? LIKE ?)  -- filter by tab
  AND (d.expected_close_date >= DATE_SUB(NOW(), INTERVAL 30 days))  -- exclude very old closed deals

ORDER BY d.expected_close_date ASC;

-- DEAL STAGE SUMMARY
SELECT 
  stage,
  COUNT(*) as deal_count,
  SUM(value) as total_value,
  AVG(health) as avg_health,
  AVG(probability) as avg_probability

FROM deals

WHERE organization_id = ?
  AND owner_id = ?
  AND stage IN ('Qualified', 'Discovery', 'Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost')

GROUP BY stage

ORDER BY CASE stage
  WHEN 'Lead' THEN 1
  WHEN 'Qualified' THEN 2
  WHEN 'Discovery' THEN 3
  WHEN 'Demo' THEN 4
  WHEN 'Proposal' THEN 5
  WHEN 'Negotiation' THEN 6
  WHEN 'Closed Won' THEN 7
  WHEN 'Closed Lost' THEN 8
END;
```

### Data Ingestion Flow

```
FLOW: Deal Lifecycle & Pipeline Management
│
├─ DEAL CREATION
│  ├─ Rep creates new deal:
│  │  ├─ Link to account (company)
│  │  ├─ Deal name + description
│  │  ├─ Initial value estimate
│  │  ├─ Expected close date
│  │  ├─ Stage (typically starts at "Lead" or "Qualified")
│  │  │
│  │  └─ Add stakeholders (contacts):
│  │     ├─ Decision maker
│  │     ├─ Users/influencers
│  │     ├─ Champions if identified
│  │     └─ Mark roles
│  │
│  ├─ Insert into deals table
│  ├─ Create deal_metrics record
│  └─ Create deal_stakeholders entries
│
├─ DEAL PROGRESSION
│  ├─ As deal moves through stages:
│  │  ├─ Rep logs calls/emails/meetings
│  │  ├─ Activities recorded in deal_activities
│  │  ├─ Stakeholder engagement tracked
│  │  ├─ Products/pricing added to deal
│  │  └─ Proposals/contracts sent
│  │
│  ├─ Update deal metrics (real-time):
│  │  ├─ meetings_count
│  │  ├─ contacts_engaged
│  │  ├─ days_in_current_stage
│  │  └─ last_activity_date
│  │
│  └─ Create deal_activities entries for each step
│
├─ STAGE TRANSITIONS
│  ├─ When rep moves deal to new stage:
│  │  ├─ Record old stage → new stage in deal_stage_history
│  │  ├─ Update stage_entered_at
│  │  ├─ Update probability (recompute based on stage)
│  │  │  - Lead: 10%
│  │  │  - Qualified: 25%
│  │  │  - Discovery: 40%
│  │  │  - Demo: 60%
│  │  │  - Proposal: 75%
│  │  │  - Negotiation: 85%
│  │  │  - (override with custom probability)
│  │  │
│  │  └─ Alert if stage move is unusual
│
├─ HEALTH SCORE CALCULATION (per deal)
│  ├─ Input factors:
│  │  ├─ Stage progression speed (within norms?)
│  │  ├─ Stakeholder engagement level
│  │  ├─ Days since last activity
│  │  ├─ Contact sentiment (from recent calls)
│  │  ├─ Buying signals detected
│  │  ├─ Competitor mentions (negative)
│  │  ├─ Budget confirmed (positive)
│  │  ├─ Timeline alignment with close date
│  │  └─ Decision maker involvement
│  │
│  ├─ Scoring (0-100):
│  │  health = (
│  │    stage_health * 0.20 +
│  │    engagement * 0.25 +
│  │    activity_recency * 0.20 +
│  │    sentiment * 0.15 +
│  │    momentum * 0.20
│  │  )
│  │
│  └─ Update d.health (daily)
│
├─ MOMENTUM DETECTION
│  ├─ Analyze activity patterns:
│  │  ├─ IF calls/meetings increasing → momentum = 'positive'
│  │  ├─ IF deals accelerating through stages → positive
│  │  ├─ IF budget approved + timeline set → positive
│  │  │
│  │  ├─ IF stalled in stage > 2 weeks → momentum = 'stalled'
│  │  ├─ IF no recent activity (7+ days) → stalled
│  │  ├─ IF decision maker disengaged → stalled
│  │  ├─ IF competitor mentioned → stalled
│  │  │
│  │  └─ ELSE neutral
│  │
│  └─ Update d.momentum
│
├─ ENGAGEMENT DOTS (for visual)
│  ├─ Blue dots: # of meetings (max 5)
│  ├─ Orange dots: # of calls (max 3)
│  ├─ Cyan dots: # of emails (max 3)
│  ├─ Yellow dot: if proposal/contract sent
│  └─ Display on deal row for quick insight
│
├─ AT-RISK DETECTION
│  ├─ Flag deal as "at risk" if:
│  │  ├─ health < 60
│  │  ├─ momentum = "stalled"
│  │  ├─ overdue close date (closeDate < TODAY)
│  │  ├─ no activity > 14 days
│  │  ├─ decision maker changed
│  │  ├─ budget cut/delayed
│  │  ├─ competitor win mention
│  │  └─ stakeholder disengagement all drop
│  │
│  ├─ Alert manager/admin if at-risk
│  └─ Track in separate at-risk cohort
│
├─ CLOSED WON FLOW
│  ├─ Rep marks deal "Closed Won":
│  │  ├─ Record actual_close_date
│  │  ├─ Set value = final signed amount
│  │  ├─ Mark stakeholders with their roles/influence
│  │  └─ Capture lessons learned
│  │
│  ├─ Trigger post-sale:
│  │  ├─ Move customer to "Active" status
│  │  ├─ Alert success team (onboarding)
│  │  ├─ Update account health score (boost)
│  │  ├─ Create "renewal" task (12-months out)
│  │  └─ Log to forecasting/pipeline
│  │
│  └─ Update aggregated metrics
│
├─ CLOSED LOST FLOW
│  ├─ Rep marks deal "Closed Lost":
│  │  ├─ Record closure reason:
│  │  │  ├─ "Budget", "Chose Competitor", "No Use Case"
│  │  │  ├─ "Timeline Postponed", "Internal Issues"
│  │  │  └─ "Other"
│  │  │
│  │  ├─ Record lost_reason
│  │  ├─ Optionally assign to competitor (if lost to competitor)
│  │  └─ Set actual_close_date
│  │
│  ├─ Run analysis:
│  │  ├─ What went wrong? (sentiment, engagement drop)
│  │  ├─ When did momentum shift? (detect stage)
│  │  ├─ Who was decision maker?
│  │  └─ What could we improve? (coaching feedback)
│  │
│  └─ Store insights for coaching/learning
│
├─ DATA SOURCES
│  ├─ Rep deal input (creation + updates)
│  ├─ Call/email/meeting logs
│  ├─ Sentiments from call analysis
│  ├─ Contact engagement tracking
│  ├─ Stakeholder activities
│  ├─ Competitor mentions from calls
│  ├─ Deal activity logs
│  └─ Historical deal performance
│
└─ DISPLAY ON DEALS PAGE
   ├─ Query: SELECT deals WHERE owner = current_user
   ├─ Organize by: stage (column headers in kanban or tab)
   ├─ Sort: expected_close_date ASC (closest first)
   ├─ Search: by deal name or company
   │
   ├─ Display each deal with:
   │  ├─ Name (linked to details)
   │  ├─ Company
   │  ├─ Stage badge (color-coded)
   │  ├─ Value ($XXK)
   │  ├─ Close date (red if overdue)
   │  ├─ Health % + bar
   │  ├─ Engagement dots
   │  ├─ Probability %
   │  ├─ Momentum arrow
   │  └─ Click to open side panel
   │
   │  SIDE PANEL shows:
   │  ├─ Deal details (name, value, stage, close date)
   │  ├─ Tab: Brief (overview)
   │  ├─ Tab: Details (stakeholders, products, history)
   │  ├─ Tab: Activities (calls, emails, meetings)
   │  ├─ Tab: AI Chat (ask questions about deal)
   │  └─ Close button
   │
   └─ Stats cards at top:
      ├─ Total pipeline $ + trend
      ├─ Open deals count + avg value
      ├─ Closed won $ + count + win rate
      └─ At risk count + value
```

---

# PART D: COACHING PAGE

## SECTION 7: PAGE OVERVIEW

### Purpose
- Track team member coaching progress and performance
- Display individual team member score cards with metrics
- Identify coaching opportunities and improvements needed
- Schedule coaching sessions
- Monitor strength/improvement areas

### Page Structure
```
COACHING PAGE LAYOUT:

├─ Header
│  ├─ Title: "Coaching Intelligence"
│  ├─ Subtitle: "Track team performance and coaching progress"
│  ├─ "Export" button
│  └─ "Schedule Session" button
│
├─ Search Bar
│  └─ Search by: team member name
│
├─ Status Filter Dropdown
│  ├─ All Status
│  ├─ Excellent (score 85+)
│  ├─ On Track (70-84)
│  ├─ Needs Attention (60-69)
│  └─ Developing (<60)
│
├─ "More" Filters button
│
├─ Stats Grid (4 cards)
│  ├─ Team Members (count)
│  ├─ Avg Team Score (numeric, +X% this week trend ↑)
│  ├─ High Performers (count, score 85+)
│  └─ Need Support (count, combining "needs-attention" + "developing")
│
└─ Team Member Cards Grid (2 columns)
   └─ For each team member card:
      ├─ Avatar + Name + Role
      ├─ More actions menu (...)
      │
      ├─ Performance Score (large numeric, color-coded)
      │  ├─ Green: 85+
      │  ├─ Blue: 70-84
      │  ├─ Yellow: 60-69
      │  └─ Red: <60
      │
      ├─ Score change (↑ +X or ↓ -X)
      │
      ├─ 4 Metrics mini grid:
      │  ├─ Calls Completed (count)
      │  ├─ Avg Duration (HH:MM)
      │  ├─ Conversion Rate (%)
      │  └─ Quota Attainment (%)
      │
      ├─ Status badge (Excellent/On Track/Needs Attention/Developing)
      │
      ├─ Strengths section (check mark icon)
      │  └─ List of 3-4 strength badges
      │
      ├─ Areas for Improvement section (alert icon)
      │  └─ List of improvement badges
      │
      ├─ Last Session date & Next Session date
      │
      └─ Buttons:
         ├─ "View Details" link
         └─ "Schedule" coaching button
```

### Example Team Member Data
```javascript
{
  id: "1",
  name: "Sarah Chen",
  role: "Senior Sales Rep",
  avatar: "SC",
  score: 87,  // performance score (0-100)
  change: +5,  // change from previous week
  metrics: {
    callsCompleted: 42,
    avgDuration: "12:45",
    conversionRate: 34,  // percent
    quotaAttainment: 112  // percent
  },
  strengths: ["Discovery", "Closing", "Objection Handling"],
  improvements: ["Follow-up Timing"],
  lastSession: "Mar 18, 2026",
  nextSession: "Mar 25, 2026",
  status: "on-track"  // excellent/on-track/needs-attention/developing
}
```

---

## SECTION 8: COACHING - DATABASE SCHEMA & QUERIES

### Database Tables

```sql
Table: rep_performance_metrics (already covered in main arch, but key fields):
├─ id (PK) UUID
├─ user_id (FK)
├─ organization_id (FK)
├─ period_date DATE (typically daily, weekly, monthly)
├─ call_quality_score INT (0-100)
├─ conversation_quality INT (0-100)
├─ total_calls INT
├─ total_calls_this_period INT
├─ avg_call_duration_seconds INT
├─ questions_asked_avg INT
├─ talk_listen_ratio DECIMAL(5,2) [talk % vs listen %]
├─ objection_handling_score INT
├─ closing_score INT
├─ discovery_score INT
├─ conversion_rate DECIMAL(5,2) [percentage]
├─ quota_attainment DECIMAL(5,2) [percentage]
├─ revenue_closed CURRENCY
├─ coaching_impact_score INT
├─ created_at TIMESTAMPTZ
└─ INDEXES: (user_id, period_date DESC)

Table: coaching_recommendations
├─ id (PK) UUID
├─ user_id (FK)
├─ organization_id (FK)
├─ recommendation_type ENUM('strength', 'improvement', 'skill_gap', 'opportunity')
├─ recommendation TEXT
├─ priority ENUM('high', 'medium', 'low')
├─ linked_metric VARCHAR [which metric this addresses]
├─ created_at TIMESTAMPTZ
├─ status ENUM('open', 'in_progress', 'completed')
└─ INDEXES: (user_id)

Table: coaching_improvements
├─ id (PK) UUID
├─ user_id (FK)
├─ skill_area VARCHAR (e.g., 'Discovery', 'Closing', 'Objection Handling')
├─ previous_baseline INT [metric before coaching]
├─ current_value INT [metric after coaching]
├─ improvement_percent DECIMAL(5,2)
├─ coached_by (FK → users / manager)
├─ coaching_sessions_count INT
├─ started_date DATE
├─ completed_date DATE [when improvement goal reached]
├─ created_at TIMESTAMPTZ
└─ INDEXES: (user_id)
```

### Query Logic

```sql
-- TEAM MEMBER COACHING SCORES
SELECT 
  u.id,
  u.full_name as name,
  u.job_title as role,
  rpm.call_quality_score as score,
  LAG(rpm.call_quality_score) OVER (PARTITION BY u.id ORDER BY rpm.period_date) as previous_score,
  (rpm.call_quality_score - LAG(rpm.call_quality_score) OVER (PARTITION BY u.id ORDER BY rpm.period_date)) as change,
  rpm.total_calls_this_period as callsCompleted,
  npm.avg_call_duration_seconds as avgDurationSeconds,
  npm.conversion_rate as conversionRate,
  npm.quota_attainment as quotaAttainment,
  CASE 
    WHEN rpm.call_quality_score >= 85 THEN 'excellent'
    WHEN rpm.call_quality_score >= 70 THEN 'on-track'
    WHEN rpm.call_quality_score >= 60 THEN 'needs-attention'
    ELSE 'developing'
  END as status,
  ARRAY(
    SELECT cr.recommendation
    FROM coaching_recommendations cr
    WHERE cr.user_id = u.id 
    AND cr.recommendation_type = 'strength'
    LIMIT 4
  ) as strengths,
  ARRAY(
    SELECT cr.recommendation
    FROM coaching_recommendations cr
    WHERE cr.user_id = u.id 
    AND cr.recommendation_type = 'improvement'
    LIMIT 4
  ) as improvements

FROM users u
LEFT JOIN rep_performance_metrics rpm ON u.id = rpm.user_id AND rpm.period_date = CURRENT_DATE - INTERVAL '1 day'
LEFT JOIN rep_performance_metrics npm ON u.id = npm.user_id AND npm.period_date = CURRENT_DATE

WHERE u.organization_id = ?
  AND u.role = 'rep'
  AND u.department_id = ? -- manager's department

ORDER BY rpm.call_quality_score DESC;

-- COACHING IMPACT ANALYSIS
SELECT 
  ct.skill_area,
  COUNT(*) as reps_coached,
  AVG(ct.improvement_percent) as avg_improvement_percent,
  MAX(ct.improvement_percent) as best_improvement,
  AVG(DATEDIFF(DAY, ct.started_date, ct.completed_date)) as avg_days_to_improvement

FROM coaching_improvements ct

WHERE ct.coached_by = ?
  AND ct.completed_date IS NOT NULL

GROUP BY ct.skill_area

ORDER BY avg_improvement_percent DESC;
```

### Data Ingestion Flow

```
FLOW: Team Member Coaching & Development
│
├─ PERFORMANCE SCORE CALCULATION (Daily, 11 PM ET)
│  ├─ For each team member, calculate:
│  │  ├─ Recent calls analysis (last 7 days)
│  │  ├─ Quality metrics from call analysis:
│  │  │  ├─ Discovery questions asked (target: 5+)
│  │  │  ├─ Talk/listen ratio (target: 40/60)
│  │  │  ├─ Objection handling effectiveness
│  │  │  ├─ Closing technique execution
│  │  │  ├─ ROI focus vs feature focus
│  │  │  └─ Buying signal recognition
│  │  │
│  │  ├─ Activity metrics:
│  │  │  ├─ Total calls this week
│  │  │  ├─ Total emails sent
│  │  │  ├─ Total meetings
│  │  │  ├─ Average call duration
│  │  │  └─ Response time to inbound
│  │  │
│  │  └─ Business metrics:
│  │     ├─ Conversion rate (opportunities won / calls)
│  │     ├─ Average deal size
│  │     ├─ Quota attainment %
│  │     ├─ Revenue closed
│  │     └─ Pipeline value
│  │
│  ├─ Coaching score formula:
│  │  score = (
│  │    call_quality * 0.30 +
│  │    activity_level * 0.20 +
│  │    conversion_rate * 0.25 +
│  │    quota_attainment * 0.15 +
│  │    skill_demonstration * 0.10
│  │  ) / 100
│  │
│  ├─ Assign status:
│  │  ├─ score >= 85: 'excellent'
│  │  ├─ 70-84: 'on-track'
│  │  ├─ 60-69: 'needs-attention'
│  │  └─ <60: 'developing'
│  │
│  ├─ Calculate change vs previous period
│  └─ Insert into rep_performance_metrics
│
├─ STRENGTH DETECTION (Weekly)
│  ├─ Analyze rep's recent calls:
│  │  ├─ Great discovery: "Asks 7+ discovery questions per call"
│  │  ├─ Strong closing: "82% closing rate on proposals"
│  │  ├─ Objection handling: "Addresses 90% of customer objections"
│  │  ├─ Relationship: "Multiple champions at each account"
│  │  └─ Product knowledge: "Cites ROI + features correctly"
│  │
│  ├─ Store as coaching_recommendations (strength)
│  └─ Display on card
│
├─ IMPROVEMENT IDENTIFICATION (Weekly)
│  ├─ AI analyzes gaps vs high performers:
│  │  ├─ Gap: "Discovery: 2 questions vs peer avg 6"
│  │  ├─ Gap: "Talk ratio too high: 65% vs target 40%"
│  │  ├─ Gap: "Closing: only 65% successful closes"
│  │  ├─ Gap: "Follow-up timing: 3+ days delay vs 24h standard"
│  │  ├─ Gap: "Objection: struggles with price objections"
│  │  └─ Gap: "ROI focus: leads with features not value"
│  │
│  ├─ Prioritize gaps:
│  │  ├─ High: directly impacts conversion/revenue
│  │  ├─ Medium: affects efficiency
│  │  └─ Low: refinement
│  │
│  ├─ Store as coaching_recommendations (improvement)
│  └─ Display on card
│
├─ RECOMMENDED COACHING ACTIONS
│  ├─ For each improvement area, suggest:
│  │  ├─ 1:1 coaching session (with topic suggestions)
│  │  ├─ Call recording review with manager
│  │  ├─ Shadow a top performer
│  │  ├─ Role-play exercise
│  │  ├─ Training video/module
│  │  └─ Peer feedback session
│  │
│  └─ Manager uses for Scheduler planning
│
├─ COACHING SESSION IMPACT TRACKING
│  ├─ After coaching session completed:
│  │  ├─ Baseline: metric before coaching
│  │  ├─ Set improvement goal (e.g., "improve questions from 2 → 5")
│  │  ├─ Schedule follow-up check-in (e.g., in 2 weeks)
│  │  └─ Create coaching_improvements record
│  │
│  ├─ Track improvement:
│  │  ├─ Monitor rep's calls in following weeks
│  │  ├─ When improvement achieved:
│  │  │  ├─ Calculate: improvement_percent = (new - baseline) / baseline
│  │  │  ├─ Mark completed_date
│  │  │  └─ Celebrate win
│  │  │
│  │  └─ If no improvement after 2 weeks:
│  │     ├─ Schedule follow-up session
│  │     ├─ Adjust coaching approach
│  │     └─ Track why no progress
│  │
│  └─ Store all tracking in coaching_improvements
│
├─ TEAM TRENDS
│  ├─ Weekly calculate:
│  │  ├─ Avg team score (all reps)
│  │  ├─ Trend (improving/stable/declining)
│  │  ├─ High performers count (score 85+)
│  │  ├─ Needs support count (<70)
│  │  ├─ Most common improvement needs
│  │  └─ Most common strengths
│  │
│  └─ Identify:
│     ├─ Top 3 skills best performers demonstrate
│     ├─ Top 3 gaps across team
│     └─ Best rep (for modeling/mentoring)
│
├─ COACHING EFFECTIVENESS
│  ├─ Track manager's coaching impact:
│  │  ├─ # of team members coached
│  │  ├─ Avg improvement in coached areas
│  │  ├─ Conversion rate improvement
│  │  ├─ Quota attainment improvement
│  │  ├─ Rep satisfaction with coaching
│  │  └─ Retention of team members
│  │
│  └─ Provide coaching ROI metrics to manager
│
├─ DATA SOURCES
│  ├─ Call quality analysis (meetings + transcripts)
│  ├─ Activity logs (calls, emails, meetings)
│  ├─ Deal/revenue data (conversion, quota)
│  ├─ Coaching session records
│  ├─ Session feedback + notes
│  ├─ Rep historical performance
│  └─ Peer benchmarking data
│
└─ DISPLAY ON COACHING PAGE
   ├─ Filter: department_manager = current_user
   ├─ Sort: score DESC (best performers first)
   ├─ Search: by rep name
   │
   ├─ Show team member cards with:
   │  ├─ Avatar + name + role
   │  ├─ Performance score (large, color-coded 0-100)
   │  ├─ Change vs last week (↑ or ↓)
   │  ├─ Metrics grid: calls, duration, conversion, quota %
   │  ├─ Status badge
   │  ├─ Strengths (3-4 badges)
   │  ├─ Improvements (3-4 badges)
   │  ├─ Last session date
   │  ├─ Next session date
   │  ├─ "View Details" button (drill-down)
   │  └─ "Schedule" coaching button
   │
   ├─ Stats summary:
   │  ├─ Total team members
   │  ├─ Avg team score + trend
   │  ├─ High performers (85+)
   │  └─ Need support (<70)
   │
   └─ Enable:
      ├─ Status filtering (excellence/on-track/needs-att/developing)
      ├─ Search by name
      ├─ Export team performance
      └─ Schedule new sessions
```

---

## SECTION 9: CROSS-PAGE INTEGRATION

```
RELATIONSHIPS & FLOWS:

SCHEDULER <→ COACHING:
├─ Schedule Session button opens Scheduler
├─ Sessions created automatically from Coaching recommendations
└─ Coaching card shows next scheduled session date

CUSTOMERS <→ DEALS:
├─ Click customer → view all their deals
├─ Deals grouped by customer
├─ Customer health tied to deal health
└─ Customer sentiment tied to deal sentiment

DEALS <→ CALLS/MEETINGS:
├─ Calls/meetings auto-linked to relevant deals
├─ Deal activities list shows all interactions
├─ Call quality scores contribute to deal health
└─ Engagement dots reflect recent call/meeting activity

COACHING <→ CALLS:
├─ Call quality scores feed into coaching scores
├─ Coaching recommendations based on call analysis
├─ Coaching sessions discuss specific calls
└─ Post-coaching, track improvement in new calls

DEALS <→ COACHING:
├─ Deal closing rate: coaching effectiveness metric
├─ Rep who closes more deals scores higher
├─ Coaching gaps directly linked to deal losses
└─ Improvement areas prioritized by revenue impact
```

---

# PART E: REVENUE PAGE

## SECTION 10: PAGE OVERVIEW

### Purpose
- Executive-level revenue forecasting and pipeline tracking
- Quarterly revenue targets vs actuals analysis
- Deal pipeline by stage with conversion rates
- Real-time forecasting (Committed + Best Case + Pipeline)
- Revenue alerts and at-risk deal detection
- Deal risk/qualification scoring

### Page Structure
```
REVENUE PAGE LAYOUT:

├─ Header
│  ├─ Title: "Revenue Intelligence"
│  ├─ Subtitle: "Real-time Pipeline & Forecast Analytics"
│  ├─ Filter Period dropdown (Q1 2026, Q4 2025, etc)
│  └─ Export Report button
│
├─ QUARTER SELECTOR
│  ├─ Current Quarter: "Q1 2026" (active, highlighted)
│  └─ Previous Quarters: Q4 2025, Q3 2025, Q2 2025, Q1 2025 (tabs)
│
├─ FORECAST OVERVIEW (for selected quarter)
│  ├─ Target: $3.5M
│  ├─ Forecast: $2.95M (84% of target)
│  ├─ Gap: -$550K (red warning)
│  ├─ Attainment %: 53%
│  └─ Days Left: 46 days
│
├─ FORECAST CATEGORIES (4 cards)
│  ├─ Closed Won
│  │  ├─ Amount: $1.85M (63% of target)
│  │  ├─ Count: 15 deals
│  │  ├─ Probability: 100%
│  │
│  ├─ Commit (Negotiation stage)
│  │  ├─ Amount: $950K (27% of target)
│  │  ├─ Count: 8 deals
│  │  ├─ Probability: 90%
│  │
│  ├─ Best Case
│  │  ├─ Amount: $400K (11% of target)
│  │  ├─ Count: 5 deals
│  │  ├─ Probability: 70%
│  │
│  └─ Pipeline (early stages)
│     ├─ Amount: $1.25M
│     ├─ Count: 23 deals
│     ├─ Probability: 40%
│     └─ "Further out" label
│
├─ REVENUE ALERTS (4 banner cards)
│  ├─ Alert 1: "Forecast Gap: $550K"
│  ├─ Alert 2: "Strong Commit Category ($950K, 90% win prob)"
│  ├─ Alert 3: "3 Deals Stalled Over 30 Days"
│  └─ Alert 4: "On Track for 84% Attainment"
│
├─ PIPELINE BY STAGE (table)
│  ├─ Columns: Stage, Count, Value, Avg Age, Conversion Rate
│  ├─ Discovery: 12 deals, $480K, 15 days, 35% conversion
│  ├─ Demo: 8 deals, $340K, 22 days, 45% conversion
│  ├─ Proposal: 6 deals, $520K, 18 days, 55% conversion
│  ├─ Negotiation: 4 deals, $780K, 30 days, 68% conversion
│  └─ Color-coded by stage
│
├─ KEY METRICS (4 KPI boxes)
│  ├─ Avg Deal Size: $125K
│  ├─ Win Rate: 42%
│  ├─ Avg Sales Cycle: 38 days
│  └─ Pipeline Coverage: 3.2x
│
└─ DEALS TABLE (detailed grid)
   ├─ Columns: Name, Stage, Value, Owner, Progress
   ├─ Risk score indicator
   ├─ Qualification score
   ├─ Methodology flags (SPICED)
   └─ Click to drill-down
```

### Example Deal Forecast Data
```javascript
{
  forecasts: {
    "Q1 2026": {
      target: 3500000,
      committed: 950000,      // Negotiation stage, 90% prob
      bestCase: 400000,       // Proposal stage, 70% prob
      pipeline: 1250000,      // Early stages, 40% prob
      closed: 1850000,        // Won deals
      forecast: 2950000,      // Total predictable revenue
      attainment: 53,         // % of target
      averageDealSize: 125000,
      winRate: 42,
      avgSalesCycle: 38
    }
  },
  dealsByStage: [
    { stage: "Discovery", count: 12, value: 480000, avgAge: 15, conversionRate: 35 },
    { stage: "Demo", count: 8, value: 340000, avgAge: 22, conversionRate: 45 },
    { stage: "Proposal", count: 6, value: 520000, avgAge: 18, conversionRate: 55 },
    { stage: "Negotiation", count: 4, value: 780000, avgAge: 30, conversionRate: 68 }
  ]
}
```

---

## SECTION 11: REVENUE - DATABASE SCHEMA & QUERIES

### Database Tables

```sql
Table: revenue_forecast (daily snapshot)
├─ id (PK) UUID
├─ organization_id (FK)
├─ quarter VARCHAR (e.g., "Q1 2026")
├─ forecast_date DATE (when forecasted)
├─ target_revenue CURRENCY
├─ committed_revenue CURRENCY [negotiation stage]
├─ bestcase_revenue CURRENCY [proposal stage]
├─ pipeline_revenue CURRENCY [early stages]
├─ closed_revenue CURRENCY [closed won only]
├─ predicted_revenue CURRENCY [committed + (bestcase * 0.7) + (pipeline * 0.4)]
├─ forecast_accuracy INT (0-100)
├─ created_at TIMESTAMPTZ
└─ INDEXES: (organization_id, quarter, forecast_date DESC)

Table: deal_risk_assessment
├─ id (PK) UUID
├─ deal_id (FK)
├─ organization_id (FK)
├─ risk_score INT (0-100, higher = more risk)
├─ qualification_score INT (0-100, SPICED methodology)
├─ risk_factors JSONB [array of risk factors]
├─ warning_level ENUM('green', 'yellow', 'red')
├─ assessed_date TIMESTAMPTZ
├─ created_at TIMESTAMPTZ
└─ INDEXES: (deal_id, risk_score DESC)

Table: pipeline_velocity
├─ id (PK) UUID
├─ organization_id (FK)
├─ quarter VARCHAR
├─ stage VARCHAR
├─ avg_days_in_stage INT
├─ advancement_rate DECIMAL(5,2) [% moving to next stage]
├─ conversion_rate INT [% converting to won]
├─ calculated_date DATE
└─ INDEXES: (organization_id, quarter, stage)
```

### Query Logic

```sql
-- REVENUE FORECAST (quarterly)
SELECT 
  rf.quarter,
  rf.target_revenue as target,
  SUM(CASE WHEN d.stage = 'Closed Won' THEN d.value ELSE 0 END) as closed,
  SUM(CASE WHEN d.stage = 'Negotiation' THEN d.value ELSE 0 END) as committed,
  SUM(CASE WHEN d.stage = 'Proposal' THEN d.value ELSE 0 END) as bestcase,
  SUM(CASE WHEN d.stage IN ('Discovery', 'Demo', 'Qualified') THEN d.value ELSE 0 END) as pipeline,
  
  -- Predicted = closed + (committed * 0.9) + (proposal * 0.7) + (early * 0.4)
  ROUND(
    COALESCE(SUM(CASE WHEN d.stage = 'Closed Won' THEN d.value ELSE 0 END), 0) +
    (COALESCE(SUM(CASE WHEN d.stage = 'Negotiation' THEN d.value ELSE 0 END), 0) * 0.9) +
    (COALESCE(SUM(CASE WHEN d.stage = 'Proposal' THEN d.value ELSE 0 END), 0) * 0.7) +
    (COALESCE(SUM(CASE WHEN d.stage IN ('Discovery', 'Demo', 'Qualified') THEN d.value ELSE 0 END), 0) * 0.4)
  ) as forecast,
  
  ROUND(
    COALESCE(SUM(CASE WHEN d.stage = 'Closed Won' THEN d.value ELSE 0 END), 0) / rf.target_revenue * 100
  ) as attainment

FROM revenue_forecast rf
LEFT JOIN deals d ON d.organization_id = rf.organization_id
  AND YEAR_QUARTER(d.expected_close_date) = rf.quarter

WHERE rf.organization_id = ?
  AND rf.quarter = ?

GROUP BY rf.quarter, rf.target_revenue;

-- PIPELINE BY STAGE with conversion rates
SELECT 
  d.stage,
  COUNT(*) as count,
  SUM(d.value) as value,
  AVG(DATEDIFF(DAY, d.stage_entered_at, NOW())) as avg_age,
  
  -- Calculate conversion rate: deals moving from this stage to next / deals in stage
  ROUND(
    (SELECT COUNT(*) FROM deal_stage_history 
     WHERE new_stage > d.stage AND changed_at >= DATE_SUB(NOW(), INTERVAL 90 days))
    / COUNT(*) * 100
  ) as conversion_rate

FROM deals d

WHERE d.organization_id = ?
  AND d.owner_id = ?
  AND d.stage NOT IN ('Closed Won', 'Closed Lost')

GROUP BY d.stage

ORDER BY CASE d.stage
  WHEN 'Lead' THEN 1
  WHEN 'Qualified' THEN 2
  WHEN 'Discovery' THEN 3
  WHEN 'Demo' THEN 4
  WHEN 'Proposal' THEN 5
  WHEN 'Negotiation' THEN 6
END;
```

### Data Ingestion Flow

```
FLOW: Revenue Forecasting & Pipeline Analytics
│
├─ DEAL CREATION & STAGE TRACKING
│  ├─ When deal created: initialize in "Lead" stage
│  ├─ When deal moved to stage: update stage_entered_at
│  ├─ Record stage change in deal_stage_history
│  └─ Trigger risk assessment algorithm
│
├─ RISK SCORING (per deal, real-time)
│  ├─ Calculate risk factors:
│  │  ├─ Days in stage (vs. average for that stage)
│  │  ├─ No activity > 7 days: +20 risk points
│  │  ├─ Decision maker disengaged: +25 risk points
│  │  ├─ Competitor mentioned recently: +15 risk points
│  │  ├─ Objection unresolved: +10 risk points
│  │  ├─ Budget concerns: +20 risk points
│  │  └─ Timeline mismatch: +15 risk points
│  │
│  ├─ Risk score = SUM(all factors, capped at 100)
│  │  ├─ <25: Low risk (green)
│  │  ├─ 25-60: Medium risk (yellow)
│  │  └─ >60: High risk (red)
│  │
│  └─ Store in deal_risk_assessment
│
├─ QUALIFICATION SCORING (SPICED methodology)
│  ├─ S: Situation - current state of prospect's business
│  ├─ P: Problem - specific pain points or challenges
│  ├─ I: Implication - consequences of not solving problem
│  ├─ C: Need-Payoff: Value/outcome from solving
│  ├─ E: Establish Plan - decision process & timeline
│  ├─ D: Decision Process - who, what, when
│  │
│  ├─ Score 0-100:
│  │  ├─ Each of 6 components: 0-20 points
│  │  ├─ Total qualification_score = sum / 6 * 100
│  │  └─ Store in deal_risk_assessment
│  │
│  └─ Update whenever deal notes show progress on SPICED criteria
│
├─ FORECAST CALCULATION (Daily, 9 AM ET)
│  ├─ For each quarter:
│  │  ├─ Closed Won = SUM(deals.value WHERE stage = 'Closed Won')
│  │  ├─ Committed = SUM(deals.value WHERE stage = 'Negotiation')
│  │  ├─ Best Case = SUM(deals.value WHERE stage = 'Proposal')
│  │  ├─ Pipeline = SUM(deals.value WHERE stage IN early stages)
│  │  │
│  │  ├─ Forecast = 
│  │  │    Closed Won +
│  │  │    (Committed × 0.9) +
│  │  │    (Best Case × 0.7) +
│  │  │    (Pipeline × 0.4)
│  │  │
│  │  ├─ Attainment = (Closed Won / Target) × 100
│  │  │
│  │  └─ Compare to target, calculate gap
│  │
│  └─ Store in revenue_forecast table
│
├─ PIPELINE VELOCITY TRACKING (Weekly)
│  ├─ For each stage:
│  │  ├─ Average days deals stay in stage
│  │  ├─ Percentage moving to next stage
│  │  ├─ Conversion rate to closed won
│  │  └─ Compare vs historical baseline
│  │
│  └─ Alert if velocity down (deals slowing down)
│
├─ ALERTS & NOTIFICATIONS (real-time)
│  ├─ Forecast Gap Alert:
│  │  ├─ IF (forecast < target) THEN alert manager
│  │  ├─ Suggest: "Add $XXK to pipeline to hit target"
│  │  └─ Show: "Need X deals at avg price Y"
│  │
│  ├─ Stalled Deal Alert:
│  │  ├─ IF (days_in_stage > avg + 14 days) THEN flag
│  │  ├─ Show: "Re-engagement required"
│  │  └─ Suggest: "Schedule call with decision maker"
│  │
│  ├─ Risk Escalation:
│  │  ├─ IF (risk_score > 60) THEN high risk alert
│  │  ├─ IF (no activity > 14 days) THEN critical
│  │  └─ Suggest: "Reassign or close deal"
│  │
│  └─ Opportunity Alert:
│     ├─ IF (deal ready to close) THEN alert
│     ├─ Show: "3 deals ready for negotiation"
│     └─ Value: "$425K"
│
├─ DATA SOURCES
│  ├─ Deal data (stage, value, dates)
│  ├─ Call/email activity logs
│  ├─ Sentiment analysis for objections/concerns
│  ├─ Contact engagement tracking
│  ├─ Historical pipeline velocity
│  ├─ Quarterly targets (org settings)
│  └─ Deal quality indicators
│
└─ DISPLAY ON REVENUE PAGE
   ├─ Show selected quarter (tab selection)
   ├─ Display forecast summary (Target vs Forecast vs Actual)
   ├─ Show 4 categories (Closed, Commit, Best Case, Pipeline)
   ├─ Alert cards with actionable insights
   ├─ Pipeline by stage table (conversion rates)
   ├─ Key metrics (deal size, win rate, cycle)
   └─ Deal details with risk/qualification scores
```

---

# PART F: INSIGHTS PAGE

## SECTION 12: PAGE OVERVIEW

### Purpose
- Conversation intelligence across entire org
- Topic/buying signal/objection analysis
- Competitor intelligence tracking
- Performance by deal stage
- AI recommendations for reps

### Page Structure
```
INSIGHTS PAGE LAYOUT:

├─ Header
│  ├─ Title: "Conversation Insights"
│  ├─ Subtitle: "AI-powered analytics across your conversations"
│  ├─ Filter Period button
│  └─ Export Report button
│
├─ 5 TABS
│  ├─ Overview (default)
│  ├─ Conversation Analysis
│  ├─ Topics & Themes
│  ├─ Objections
│  └─ Competitive Intel
│
├─ TAB: OVERVIEW
│  ├─ Conversation Metrics (4 cards)
│  │  ├─ Avg Talk-to-Listen: 43:57 (ideal 40:60)
│  │  ├─ Avg Call Duration: 38 min (ideal 35-45)
│  │  ├─ Question Rate: 12/call (ideal 10-15)
│  │  └─ Engagement Score: 84 (ideal 80+)
│  │
│  ├─ AI Recommendations (grid of cards)
│  │  ├─ Discovery Coaching: "Add 2-3 more discovery questions"
│  │  ├─ Talk Ratio Improvement: "Reduce your talk time to 40%"
│  │  ├─ Closing Technique: "Practice assumptive close"
│  │  └─ Objection Handling: "Prepare ROI calculator for price objections"
│  │
│  └─ Performance by Stage table
│     ├─ Lead: Avg Score, Conversion %
│     ├─ Qualified: Avg Score, Conversion %
│     ├─ Discovery: Avg Score, Conversion %
│     └─ etc.
│
├─ TAB: TOPICS & THEMES
│  ├─ Top Topics (6 cards, clickable)
│  │  ├─ Pricing (156 mentions, 65% positive sentiment)
│  │  ├─ Implementation Timeline (142 mentions, 82% sentiment)
│  │  ├─ Integration Capabilities (128 mentions, 78% sentiment)
│  │  ├─ ROI & Value (115 mentions, 88% sentiment)
│  │  ├─ Competitor Comparison (94 mentions, 55% sentiment)
│  │  └─ Support & Training (87 mentions, 92% sentiment)
│  │
│  ├─ SIDE PANEL (when topic clicked)
│  │  ├─ Topic: "Pricing"
│  │  ├─ Mentions: 156 total
│  │  ├─ Sentiment: 65% positive
│  │  ├─ Trend: +12% vs last week
│  │  └─ List of 5 calls mentioning topic
│  │     ├─ Company, Contact, Timestamp
│  │     ├─ Quote from transcript
│  │     └─ Sentiment indicator
│
├─ TAB: OBJECTIONS
│  ├─ Objection Types (4 cards, clickable)
│  │  ├─ Price too high (42 freq, 68% resolution, 8 min avg)
│  │  ├─ Need more features (31 freq, 75% resolution, 12 min avg)
│  │  ├─ Implementation concerns (28 freq, 82% resolution, 15 min avg)
│  │  └─ Timing not right (24 freq, 45% resolution, 6 min avg)
│  │
│  └─ SIDE PANEL (when objection clicked)
│     ├─ Objection: "Price too high"
│     ├─ Frequency: 42 times
│     ├─ Avg Resolution Time: 8 min
│     ├─ Success Rate: 68%
│     ├─ Top Response: "ROI calculator & payment terms"
│     └─ List of 3 calls with objection
│
├─ TAB: COMPETITIVE INTEL
│  ├─ Competitor Mentions (4 cards, clickable)
│  │  ├─ Competitor A (67 mentions)
│  │  ├─ Competitor B (54 mentions)
│  │  ├─ Competitor C (42 mentions)
│  │  └─ Competitor D (31 mentions)
│  │
│  └─ SIDE PANEL (when competitor clicked)
│     ├─ Competitor: "Competitor A"
│     ├─ Total mentions: 67
│     ├─ vs us mentions: (comparison)
│     ├─ Sentiment: 55% positive
│     └─ List of 3 calls mentioning competitor
│        ├─ What they like: better pricing, UI
│        ├─ Pain point: missing features
│        └─ Our differentiator opportunity
│
└─ BUYING SIGNAL INDICATORS
   ├─ Positive Verbal Cues: 47 (95% sentiment)
   ├─ Negative Verbal Cues: 8 (25% sentiment)
   ├─ Questions from Prospect: 23 (82% sentiment)
   └─ Agreement Markers: 34 (88% sentiment)
```

### Example Insights Data
```javascript
{
  conversationMetrics: [
    { label: "Avg Talk-to-Listen", value: "43:57", change: "+5%", trend: "up", ideal: "40:60" },
    { label: "Avg Call Duration", value: "38 min", change: "+3 min", trend: "up", ideal: "35-45 min" }
  ],
  topTopics: [
    { topic: "Pricing", mentions: 156, sentiment: 0.65, trend: "up", change: "+12%" },
    { topic: "Competitor Comparison", mentions: 94, sentiment: 0.55, trend: "down", change: "-5%" }
  ],
  objections: [
    { objection: "Price too high", frequency: 42, successRate: 68, avgResolutionTime: "8 min" }
  ]
}
```

---

## SECTION 13: INSIGHTS - DATABASE SCHEMA

```sql
Table: conversation_topics (extracted from calls)
├─ id (PK) UUID
├─ organization_id (FK)
├─ meeting_id (FK)
├─ topic_name VARCHAR
├─ mention_count INT
├─ sentiment_score DECIMAL(3,2) [0-1]
├─ timestamp INT [seconds into call]
├─ frequency_rank INT
├─ extracted_date TIMESTAMPTZ
└─ INDEXES: (organization_id, topic_name)

Table: objection_tracking
├─ id (PK) UUID
├─ organization_id (FK)
├─ meeting_id (FK)
├─ objection_type VARCHAR
├─ frequency INT
├─ resolution_time INT [seconds]
├─ resolution_success BOOLEAN
├─ common_response TEXT
├─ detected_at TIMESTAMPTZ
└─ INDEXES: (organization_id, objection_type)

Table: competitor_mentions
├─ id (PK) UUID
├─ organization_id (FK)
├─ meeting_id (FK)
├─ competitor_name VARCHAR
├─ context TEXT [what they said]
├─ sentiment_score DECIMAL(3,2)
├─ detected_at TIMESTAMPTZ
└─ INDEXES: (organization_id, competitor_name)

Table: buying_signals
├─ id (PK) UUID
├─ organization_id (FK)
├─ meeting_id (FK)
├─ signal_type VARCHAR (positive_cues, questions, agreement, etc)
├─ signal_text TEXT
├─ timestamp INT [seconds in call]
├─ confidence INT [0-100]
├─ detected_at TIMESTAMPTZ
└─ INDEXES: (organization_id, meeting_id)
```

---

# PART G: ACTIVITIES PAGE

## SECTION 14: PAGE OVERVIEW

### Purpose
- Complete log of all user activities (calls, emails, meetings, tasks, notes)
- Filter and search across all interaction types
- Export activity data
- Drill-down on individual activities

### Page Structure
```
ACTIVITIES PAGE LAYOUT:

├─ Header with Back arrow
│  ├─ Title: "Activity Intelligence"
│  ├─ Subtitle: "Complete communication history across all customers"
│  └─ Export button
│
├─ Stats Grid (4 cards)
│  ├─ Total Activities: 156 (+23 this week)
│  ├─ Calls Completed: 47 (+8 this week)
│  ├─ Meetings Held: 28 (+5 this week)
│  └─ Emails Sent: 81 (+10 this week)
│
├─ FILTERS Row
│  ├─ Search bar (by title, company, contact)
│  ├─ Filter by Type (dropdown):
│  │  ├─ All Activities (156)
│  │  ├─ Calls (47)
│  │  ├─ Emails (81)
│  │  ├─ Meetings (28)
│  │  ├─ Notes (12)
│  │  └─ Tasks (34)
│  │
│  ├─ Status Filter (checkboxes):
│  │  ├─ ☑ Completed
│  │  ├─ ☑ Scheduled
│  │  ├─ ☐ Cancelled
│  │  └─ ☐ No-show
│  │
│  └─ Sentiment Filter (checkboxes):
│     ├─ ☐ Positive
│     ├─ ☐ Neutral
│     └─ ☐ Negative
│
├─ ACTIVITIES LIST (table, paginated 20 per page)
│  └─ For each activity row:
│     ├─ Type icon & badge (Call/Email/Meeting/Note/Task)
│     ├─ Date & time
│     ├─ Title/Subject
│     ├─ Contact name
│     ├─ Contact title
│     ├─ Company
│     ├─ Duration (if applicable)
│     ├─ Status badge
│     ├─ Sentiment indicator (if call/meeting)
│     └─ Click to view details
│
└─ DETAILS PANEL (when row clicked)
   ├─ Full activity details
   ├─ Transcript (if call/meeting)
   ├─ Sentiment analysis
   ├─ Key takeaways
   ├─ Next steps
   ├─ Related deals
   └─ Linked CRM data
```

---

# PART H: SETTINGS PAGE

## SECTION 15: PAGE OVERVIEW

### Purpose
- Organization-wide configuration
- User, team, and billing management
- Integration setup and API configuration
- Privacy, security, and compliance policies
- Notification preferences
- Template management (answer cards, scorecards, etc)

### Settings Sections (by Role)

```
SETTINGS SIDEBAR (18 sections, role-based)

ALL USERS can see:
├─ General (org name, language preferences, security)
├─ Recording Policies (auto-record, transcription, consent)
├─ Privacy Policies (encryption, GDPR, data retention)
├─ Consent Policies (legal, compliance)
├─ Notification Policies (when to notify users)
├─ Purposes & Outcomes (config)
├─ Templates (email, call templates)
├─ Answer Cards (pre-built responses)
├─ Smart Topics (topic detection)
├─ Scorecards (call quality criteria)
├─ Prompt Library (AI prompt templates)
├─ Integrations (Salesforce, HubSpot, Gmail, etc)
└─ Automations (workflow rules)

MANAGERS & ADMINS can also see:
├─ Scheduler (calendar integration settings)
├─ Developer (API keys, webhooks)
├─ Teams (org structure, departments)
├─ Members (user management, roles)
└─ Billing (subscription, payment method)

ADMIN ONLY:
├─ System-wide security settings
├─ Data deletion options (nuclear)
└─ Advanced compliance settings
```

---

# PART I: UI COMPONENTS & GLOBAL FEATURES

## SECTION 16: SIDEBAR COLLAPSE BUTTON

```
COLLAPSE BUTTON FEATURE:

Location: Bottom of left sidebar
Behavior: Toggle sidebar between collapsed (64px) and expanded (208px)

When Expanded:
├─ Shows full navigation labels
├─ Shows "Collapse" button with ChevronLeft icon
├─ Width: 208px (w-52)
├─ Logo: Full Tasknova logo shown
├─ User menu: Full name + role shown

When Collapsed:
├─ Shows only icons (centered)
├─ Shows "Expand" button with ChevronRight icon (centered)
├─ Width: 64px (w-16)
├─ Logo: Icon-only logo shown
├─ User menu: Only avatar shown
├─ All nav items center-aligned (icons only)
├─ Tooltips show on hover

Animation: Smooth 300ms transition
State: Persisted in localStorage
```

---

## SECTION 17: ASK TASKNOVA AI BUTTON

```
ASK TASKNOVA AI FEATURE:

Location: Bottom of sidebar (above user menu)
Button Style: 
├─ Purple background (bg-purple-600)
├─ White text
├─ Sparkles icon (⨯ Sparkles)
├─ Full-width of sidebar

Behavior:
├─ Clicking navigates to /{role}/ai page
├─ Opens AI Command Center (chat interface)
├─ Can ask about deals, forecasts, recommendations
├─ Uses NLP to understand queries
└─ Provides instant insights & suggestions

When Collapsed:
├─ Shows only Sparkles icon (centered)
├─ Tooltip: "Ask Tasknova AI"

AI Command Center Page (/ai):
├─ Chat interface
├─ Conversation history
├─ Quick suggestion buttons (below input)
│  ├─ "Show overdue deals"
│  ├─ "What's my forecast?"
│  ├─ "Coaching recommendations"
│  ├─ "Top competitors mentioned"
│  └─ "Risk alerts"
├─ AI responses with data cards
└─ Full-page chat history
```

---

## SECTION 18: PROFILE & USER MENU

```
PROFILE BUTTON:

Location: Bottom of sidebar (when expanded)
Components:
├─ Avatar circle (7×7, user initials, blue background)
├─ User name (text-xs, font-medium)
├─ Role (text-xs, text-gray-500, capitalized)
├─ ChevronDown dropdown icon

Avatar Details:
├─ Initials: 2 characters from user's full name
├─ Background: Blue (#3B82F6)
├─ Text: White, bold, small caps
├─ When collapsed: Only avatar shown (centered)

User Menu Dropdown:

Displays on click:
├─ Position: Absolute, bottom-full left-0 right-0 mb-2
├─ Background: White rounded-lg with shadow
├─ Items:
│  ├─ Logout option
│  │  ├─ Icon: LogOut (red)
│  │  ├─ Text: "Logout"
│  │  ├─ Color: Red text hover:bg-red-50
│  │  └─ Triggers logout confirmation modal
│  └─ More options (Settings, Profile, Help, etc)
│
└─ Closes on: Click outside, Escape key, navigation
```

---

## SECTION 19: NOTIFICATIONS PANEL

```
NOTIFICATIONS DROPDOWN:

Location: Top right of header (Bell icon)
Badge:
├─ Shows unread count (small circle, top-right)
├─ Background: Blue (#2563EB)
├─ Red badge if critical alerts

Panel Style:
├─ Position: Absolute right-0 top-full mt-2
├─ Width: 384px (w-96)
├─ Max height: 600px
├─ Background: White rounded-lg shadow-xl
├─ Scrollable list

HEADER (in panel):
├─ Title: "Notifications"
├─ Subtitle showing unread count or "All caught up!"
├─ "Mark all read" link (if unread > 0)
├─ Close button (X icon)

NOTIFICATION ITEMS (in scrollable list):

For each notification:
├─ Background: Blue-ish if unread, white if read
├─ Structure:
│  ├─ Icon (8×8, colored bg, emoji-style)
│  │  ├─ Purple: AI Insights (Lightbulb)
│  │  ├─ Blue: Calendar reminders
│  │  ├─ Green: Task assigned
│  │  ├─ Emerald: Deal updates
│  │  ├─ Gray: System updates
│  │  ├─ Orange: Alerts
│  │  └─ Red: Critical issues
│  │
│  ├─ Title (text-sm, font-medium)
│  ├─ Message (text-xs, line-clamp-2)
│  ├─ Time (text-xs, text-gray-500)
│  ├─ Blue dot indicator if unread
│  └─ Delete button (shows on hover)
│
├─ Click action: Mark as read, navigate to related page
├─ Hover: bg-gray-50 transition
└─ Swipe/delete: Delete notification

Types of Notifications:
├─ AI Insights (improvement recommendations)
├─ Meeting Reminders (15 mins before)
├─ Task Assignments (1 hour after)
├─ Deal Updates (stage changes, closes)
├─ System Updates (new features)
├─ Customer Activity (proposal views, etc)
├─ Alerts (action required, conflicts)
└─ Success messages (call recorded, etc)

Max Notifications: 8-10 recent ones shown
Pagination: "View all" link at bottom

Interaction:
├─ Click notification: navigate to relevant page
├─ "Mark all read": batch update
├─ Delete (X): remove from list
├─ Auto-dismiss: After 5 seconds if action taken
└─ Stay open: Until dismissed by user
```

---

## SECTION 20: LOGOUT CONFIRMATION

```
LOGOUT CONFIRMATION MODAL:

Trigger: Click "Logout" in user menu

Modal Structure:
├─ Title: "Confirm Logout"
├─ Message: "Are you sure you want to log out? You'll need to log back in to access your account."
│
├─ Buttons:
│  ├─ "Cancel" (gray outline button)
│  └─ "Logout" (red button)
│
├─ On Logout:
│  ├─ Clear: userRole
│  ├─ Clear: userEmail
│  ├─ Clear: userName
│  ├─ Clear: userId
│  ├─ Clear: onboardingData
│  ├─ Clear: onboardingStep
│  ├─ Clear: onboardingCompleted
│  └─ Navigate to: "/" (login page)
│
└─ On Cancel:
   └─ Modal closes, stay on current page
```

---

## SECTION 21: SEARCH PANEL

```
SEARCH FUNCTIONALITY:

Location: Top center of header (Search input)
Keyboard shortcut: ⌘K (Cmd+K) or Ctrl+K

Search Input:
├─ Placeholder: "Search for anything in Tasknova (⌘K)"
├─ Search icon (left side)
├─ Read-only (onClick opens search panel)
├─ Background: White, border-gray-200

Full Search Panel (modal):
├─ Opens on click or ⌘K press
├─ Position: Full overlay modal
├─ Centered on screen

Search Features:
├─ Search across:
│  ├─ Deals (by name, company)
│  ├─ Customers (by name, industry)
│  ├─ Meetings (by title, contact)
│  ├─ People (by name, company)
│  ├─ Tasks (by title, description)
│  └─ Pages (navigation items)
│
├─ Results grouped by type:
│  ├─ Deals (show as cards)
│  ├─ Customers (show as cards)
│  ├─ Other results (show as list)
│  └─ "See all" link for each type
│
├─ Keyboard navigation:
│  ├─ Arrow up/down: Navigate results
│  ├─ Enter: Open selected result
│  └─ Escape: Close search panel
│
└─ Recent searches (show on open if no query)

Result Cards:
├─ Icon + Title + Subtitle
├─ On click: Navigate to detail page
├─ Highlight on hover
└─ Show keyboard shortcut (⌘ + letter)
```

---

## GLOBAL KEYBOARD SHORTCUTS

```
KEYBOARD SHORTCUTS:

⌘K or Ctrl+K: Open global search
Escape: Close any open panel (notifications, search, etc)
↑/↓: Navigate search results
Enter: Open selected result
Cmd/Ctrl+S: Save (in forms/settings)
Cmd/Ctrl+E: Export (if on page with export)
Cmd/Ctrl+P: Print current page
? : Show keyboard shortcuts help (future)
```

---

## SECTION 22: FLOATING ACTION BUTTON (FAB)

```
FLOATING ACTION BUTTON:

Location: Bottom right of screen
Shows on: Overlay when modals open or needed

Button Features:
├─ Plus icon (white on colored bg)
├─ By page context:
│  ├─ /deals: "+ New Deal"
│  ├─ /customers: "+ Add Customer"
│  ├─ /meetings: "+ Schedule Meeting"
│  ├─ /tasks: "+ Create Task"
│  ├─ /scheduler: "+ Schedule Session"
│  └─ etc.
│
├─ On click: Open creation/addition dialog
├─ Icon: Lucide Plus icon
├─ Circular button: 56×56 (h-14 w-14)
├─ Animation: Pulse on hover
└─ Shadow: Subtle drop shadow
```

---

## SECTION 23: NOTIFICATION SYSTEM (Backend)

```
NOTIFICATION GENERATION RULES:

Real-time triggers:
├─ Call completed → "Meeting recorded" notification
├─ Stage change → "Deal updated to [stage]" notification
├─ Task assigned → "New task assigned" notification
├─ 15 min before meeting → "Meeting starting soon"
├─ Deal closed → "Deal closed won/lost!"
├─ Coaching insight → "New AI recommendation"
├─ @mention → "You were mentioned by [name]"
├─ Approval needed → "Approval request: [item]"
└─ System update → "New feature available: [name]"

Notification Storage:

Table: notifications
├─ id (PK) UUID
├─ user_id (FK)
├─ type ENUM
├─ title VARCHAR
├─ message TEXT
├─ icon_type VARCHAR
├─ action_url VARCHAR
├─ read BOOLEAN (default false)
├─ dismissed_at TIMESTAMPTZ
├─ created_at TIMESTAMPTZ
└─ INDEXES: (user_id, read, created_at DESC)

Delivery Channels:
├─ In-app (always)
├─ Email (for critical/summary)
├─ Browser push (if enabled)
├─ Slack (if integrated)
└─ SMS (for urgent only)

Retention Policy:
├─ Keep: All notifications 30 days
├─ Archive: Older than 30 days
├─ Delete: After 90 days (permanent)
```

---

## SECTION 24: CROSS-PAGE NAVIGATION MAP

```
COMPLETE NAVIGATION FLOW:

SIDEBAR NAVIGATION (13 main pages):
├─ Dashboard → /dashboard (admin/manager/rep)
├─ Meetings → /meetings (all)
├─ Calls → /calls (all)
├─ Tasks → /tasks (all)
├─ Scheduler → /scheduler (manager/admin only)
├─ Customers → /customers (all)
├─ Deals → /deals (all)
├─ Coaching → /coaching (manager/admin only)
├─ Insights → /insights (all)
├─ Revenue → /revenue (manager/admin only)
├─ Automation → /automation (admin only)
├─ Team → /team (admin only)
└─ Settings → /settings (all)

HEADER ACTIONS:
├─ Search (⌘K) → Search panel modal
├─ Notifications (Bell) → Notifications dropdown
└─ User Profile → User menu dropdown

SPECIAL PAGES:
├─ /ai → Ask Tasknova AI (AI Command Center)
├─ /{page}/export → Export report modals
├─ /{record}/details → Drill-down panels
├─ /login → Authentication page
└─ /onboarding → Setup checklist (new users)

CONTEXT-AWARE NAVIGATION:
├─ From Deal: "View Customer" → /customers/{id}
├─ From Customer: "View Deals" → /deals?customer={id}
├─ From Meeting: "View Deal" → /deals/{id}
├─ From Task: "View Deal" → /deals/{id}
└─ From Coaching: "Schedule Session" → /scheduler?create=1
```

---

**END OF COMPLETE TASKNOVA ARCHITECTURE DOCUMENTATION**

✅ PART A: Scheduler Page (Sessions + Calendar)
✅ PART B: Customers Page (Intelligence + Health Scoring)  
✅ PART C: Deals Page (Pipeline + Forecasting)
✅ PART D: Coaching Page (Performance Tracking)
✅ PART E: Revenue Page (Quarterly Forecasts + Alerts)
✅ PART F: Insights Page (Conversation Analytics)
✅ PART G: Activities Page (Complete History)
✅ PART H: Settings Page (Configuration)
✅ PART I: UI Components & Global Features

**TOTAL DOCUMENTATION:**
- 24 Comprehensive Sections
- 15+ Database Tables with Schemas & Indexes
- 20+ SQL Query Examples
- Complete Data Ingestion Flows
- Real-time Calculations & Aggregations
- AI/NLP Integration Points
- User Interaction Workflows
- Keyboard Shortcuts & UX Patterns
- Role-based Access Controls
- Cross-page Navigation Maps

**READY FOR:**
- Backend Engineers (API design)
- Database Architects (schema implementation)
- Data Engineers (data pipeline setup)
- Frontend Integration Teams
- DevOps/Infrastructure Planning

# Detail Pages & Drill-Down Architecture
## Complete Documentation for All Secondary & Tertiary Pages

---

# SECTION 1: CUSTOMER DETAIL PAGE

## 1.1 Page Overview & URL Structure

```
Route: /{role}/customers/{customerId}
Route: /{role}/customers/{customerSlug}

Navigation Flow:
├─ Customers List Page
│  └─ Click on customer card → navigates to /customers/{customerId}
│
└─ Customer Detail Page (this page)
   ├─ Shows full customer profile
   ├─ All related calls, emails, meetings
   ├─ Deals associated with customer
   ├─ Contact management
   └─ Allows clicking individual activities to drill-down further
```

## 1.2 Page Layout & Structure

```
CUSTOMER DETAIL PAGE LAYOUT:

┌─────────────────────────────────────────────────────────────┐
│ [← Back Button]  Customer Profile                           │
│                  Detailed intelligence and interaction history│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ HEADER SECTION                                              │
│ ├─ Company Logo/Avatar                                      │
│ ├─ Company Name: "Acme Corp"                                │
│ ├─ Badges: Industry, Size                                   │
│ ├─ Quick Actions: Email, Call, Meeting buttons              │
│ └─ Tabs: Overview | Calls | Meetings | Emails | Deals       │
│                                                              │
│ OVERVIEW TAB (default)                                      │
│ ├─ Health Score Card                                        │
│ │  ├─ Score: 85/100 (progress bar)                         │
│ │  ├─ Trend: ↑ +3 points vs last week                      │
│ │  ├─ Risk Factors: None / Dormant / Stalled               │
│ │  └─ Last Updated: 2 hours ago                            │
│ │                                                           │
│ ├─ Engagement Metrics (4 cards)                             │
│ │  ├─ Last Contact: 2 days ago                             │
│ │  ├─ Total Calls: 12 (↑ +3 this week)                    │
│ │  ├─ Total Emails: 18 (↑ +5 this week)                   │
│ │  └─ Next Meeting: Today, 3:00 PM                         │
│ │                                                           │
│ ├─ Sentiment Trend (chart)                                  │
│ │  ├─ Current: Positive (70%)                              │
│ │  ├─ Week trend: improving                                │
│ │  └─ Last 5 interactions sentiment breakdown               │
│ │                                                           │
│ ├─ Key Information Section                                  │
│ │  ├─ Owner: Alex Rivera                                    │
│ │  ├─ Industry: Financial Services                          │
│ │  ├─ Company Size: 250-500                                 │
│ │  ├─ Website: acme.com                                     │
│ │  ├─ Headquarters: San Francisco, CA                       │
│ │  ├─ Annual Revenue: $25M                                  │
│ │  └─ Founded: 2015                                         │
│ │                                                           │
│ ├─ Contacts at Company                                      │
│ │  ├─ Contact grid/list:                                    │
│ │  │  ├─ Contact 1: Name, Title, Email, Phone              │
│ │  │  │  └─ Star if champion/influencer                    │
│ │  │  ├─ Contact 2: ...                                     │
│ │  │  └─ "+ Add Contact" button                             │
│ │                                                           │
│ ├─ Active Deals                                             │
│ │  ├─ Deal 1: Name, Stage, Value, Close Date               │
│ │  ├─ Deal 2: ...                                           │
│ │  └─ "+ New Deal" button                                   │
│ │                                                           │
│ └─ Topics & Notes                                           │
│    ├─ Key Topics: Integration, Pricing, Timeline            │
│    └─ Recent Notes: (editable text)                         │
│                                                              │
│ CALLS TAB                                                    │
│ ├─ Filter: Date range, Type (inbound/outbound/missed)      │
│ ├─ Sort: Latest first                                       │
│ ├─ List of calls:                                           │
│ │  ├─ Call 1: Date, Duration, Contact, Sentiment, Score    │
│ │  │  ├─ On click: Open call detail panel                  │
│ │  │  └─ "View Full Transcript" link                       │
│ │  ├─ Call 2: ...                                           │
│ │  └─ Pagination: 10 per page                               │
│ │                                                           │
│ └─ "View All Calls" link → /calls?customer={id}            │
│                                                              │
│ MEETINGS TAB                                                │
│ ├─ Similar structure to Calls tab                           │
│ ├─ Shows: Date, Duration, Type, Attendees, Topics          │
│ ├─ Actions: Watch Recording, View Transcript                │
│ └─ "View All Meetings" link → /meetings?customer={id}      │
│                                                              │
│ EMAILS TAB                                                  │
│ ├─ List of emails with customer contacts                   │
│ ├─ Date, From/To, Subject, Sentiment                       │
│ └─ "View All Emails" link → /emails?customer={id}          │
│                                                              │
│ DEALS TAB                                                   │
│ ├─ All deals associated with this customer                 │
│ ├─ Stage, Value, Owner, Close Date, Health                │
│ └─ Click deal → navigate to /deals/{dealId}                │
│                                                              │
│ BOTTOM ACTION BUTTONS                                       │
│ ├─ Edit Customer                                            │
│ ├─ Schedule Call                                            │
│ ├─ Create Task                                              │
│ └─ Add Note                                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 1.3 Database Queries for Customer Detail

```sql
-- MAIN CUSTOMER DATA
SELECT 
  a.id,
  a.name,
  a.industry,
  a.company_size,
  a.website,
  a.headquarters_country,
  a.headquarters_state,
  a.annual_revenue,
  a.founded_year,
  u.full_name as owner,
  ahs.health_score,
  ahs.health_trend,
  ahs.last_contact_date,
  ahs.risk_factors,
  ahs.engagement_score,
  ahs.sentiment_score,
  ARRAY(SELECT topic_name FROM call_topics ct 
        JOIN meetings m ON ct.meeting_id = m.id 
        WHERE m.account_id = a.id LIMIT 5) as key_topics

FROM accounts a
LEFT JOIN users u ON a.owner_id = u.id
LEFT JOIN account_health_scores ahs ON a.id = ahs.account_id

WHERE a.id = ? AND a.organization_id = ?;

-- CONTACTS AT THIS COMPANY
SELECT 
  id, full_name, title, email, phone,
  is_champion, level, created_at

FROM account_contacts

WHERE account_id = ?
ORDER BY is_champion DESC, created_at DESC;

-- RECENT CALLS
SELECT 
  m.id, m.meeting_title, m.started_at, 
  m.duration_seconds, m.sentiment,
  mc.full_name as contact_name,
  ROUND(m.quality_score::numeric, 0)::int as score

FROM meetings m
LEFT JOIN users mc ON m.contact_id = mc.id

WHERE m.account_id = ? AND m.type IN ('call', 'phone_call')
ORDER BY m.started_at DESC
LIMIT 10;

-- RECENT MEETINGS
SELECT 
  m.id, m.meeting_title, m.scheduled_start_time,
  m.duration_seconds, m.status,
  ARRAY_AGG(DISTINCT u.full_name) as attendees,
  m.has_recording, m.transcript_available

FROM meetings m
LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id
LEFT JOIN users u ON mp.user_id = u.id

WHERE m.account_id = ? AND m.type = 'meeting'
GROUP BY m.id
ORDER BY m.scheduled_start_time DESC
LIMIT 10;

-- ACTIVE DEALS
SELECT 
  id, name, stage, value, 
  expected_close_date, health,
  probability, momentum

FROM deals

WHERE account_id = ? AND stage NOT IN ('Closed Won', 'Closed Lost')
ORDER BY expected_close_date ASC;
```

---

# SECTION 2: DEAL DETAIL PAGE

## 2.1 Page Overview & URL Structure

```
Route: /{role}/deals/{dealId}

Navigation Flow:
├─ Deals List/Grid → Click deal card
├─ Customer Detail → Click deal link
├─ Revenue Forecast → Click deal in table
│
└─ Deal Detail Page (this page)
   ├─ Full deal information
   ├─ Stage timeline & history
   ├─ Stakeholders & contacts
   ├─ Activities (calls, emails, meetings related to deal)
   └─ AI recommendations for closing
```

## 2.2 Page Layout & Structure

```
DEAL DETAIL PAGE LAYOUT:

┌──────────────────────────────────────────────────────────────┐
│ [← Back]  Deal Detail - Enterprise License Deal              │
│           Value: $250K | Stage: Negotiation | Owner: Alex Chen│
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ TABS: Overview | Timeline | Stakeholders | Activities | Chat │
│                                                               │
│ OVERVIEW TAB (default)                                       │
│ ├─ Deal Header Card                                          │
│ │  ├─ Deal Name: "Enterprise License Deal"                  │
│ │  ├─ Company: "Acme Corp" (clickable → Customer Detail)    │
│ │  ├─ Value: $250,000                                        │
│ │  ├─ Stage: Negotiation (color badge)                      │
│ │  ├─ Health: 82% (progress bar - green)                    │
│ │  ├─ Probability: 75%                                       │
│ │  ├─ Momentum: ↑ Positive                                   │
│ │  └─ Owner: Alex Chen                                       │
│ │                                                            │
│ ├─ Stage Progress Bar                                        │
│ │  ├─ Visual pipeline stages:                                │
│ │  │  Lead → Qualified → Discovery → Demo → Proposal →      │
│ │  │  Negotiation (●) → Closed Won ○ → Closed Lost ○       │
│ │  │                                                         │
│ │  └─ Days in current stage: 30 days                         │
│ │                                                            │
│ ├─ Key Metrics (grid cards)                                  │
│ │  ├─ Expected Close: Mar 28, 2026 (⚠️ 5 days away)         │
│ │  ├─ Meetings: 5 completed                                  │
│ │  ├─ Calls: 12 completed                                    │
│ │  ├─ Emails: 23 sent                                        │
│ │  ├─ Engagement Score: 88/100                               │
│ │  ├─ Qualification Score: 72/100                            │
│ │  ├─ Risk Score: 22/100 (low risk - green)                 │
│ │  └─ Multi-threading: 3 champions engaged                   │
│ │                                                            │
│ ├─ Deal Details Section                                      │
│ │  ├─ Deal Description                                       │
│ │  ├─ Business Case / Opportunity                            │
│ │  ├─ Required Budget                                        │
│ │  ├─ Approval Process                                       │
│ │  └─ Expected Implementation Date                           │
│ │                                                            │
│ ├─ AI Insights & Recommendations                             │
│ │  ├─ Card 1: "Strong buyer engagement detected"            │
│ │  │  └─ "Schedule final negotiation call this week"        │
│ │  ├─ Card 2: "Decision maker aligned on ROI"               │
│ │  │  └─ "Get signature on contract"                        │
│ │  ├─ Card 3: "Budget confirmed: $250K"                     │
│ │  │  └─ "Timeline: should close by March 28"               │
│ │  └─ Card 4: "Competitor not mentioned in recent calls"    │
│ │     └─ "Confidence level: High"                           │
│ │                                                            │
│ ├─ Stakeholders Summary                                      │
│ │  ├─ Decision Maker: Jane Smith (CFO)                       │
│ │  ├─ Champions: 3 users engaged                             │
│ │  ├─ Users: 5+ end users                                    │
│ │  └─ "View All" link → Stakeholders Tab                     │
│ │                                                            │
│ ├─ Recent Activity Feed                                      │
│ │  ├─ Activity 1: Call completed with Decision Maker        │
│ │  │  └─ 2 days ago | Score: 85                             │
│ │  ├─ Activity 2: Proposal sent to 3 stakeholders           │
│ │  │  └─ 5 days ago                                          │
│ │  ├─ Activity 3: Demo held with end users                  │
│ │  │  └─ 1 week ago | 25 attendees                          │
│ │  └─ "View All Activities" link                             │
│ │                                                            │
│ └─ Documents / Files                                         │
│    ├─ SOW_Deal_Acme_2026.pdf                                 │
│    ├─ Proposal_Enterprise_License.docx                       │
│    ├─ ROI_Calculator_Acme.xlsx                               │
│    └─ "+ Upload Document"                                    │
│                                                               │
│ TIMELINE TAB                                                  │
│ ├─ Visual timeline of deal progression                       │
│ ├─ Stage entries with dates and durations                    │
│ ├─ Stage: Lead → Qualified → Discovery → Demo → Proposal     │
│ │        → Negotiation (current)                             │
│ ├─ For each stage:                                           │
│ │  ├─ Entry date                                             │
│ │  ├─ Duration in stage                                      │
│ │  ├─ Stage owner                                            │
│ │  ├─ Key activity in that stage                             │
│ │  └─ Health at time of transition                           │
│ │                                                            │
│ └─ Edit button to update stage                               │
│                                                               │
│ STAKEHOLDERS TAB                                              │
│ ├─ Grid/List of all contacts at company involved in deal    │
│ ├─ For each stakeholder:                                     │
│ │  ├─ Contact name, title, email, phone                      │
│ │  ├─ Role in deal: Decision Maker / Champion / User         │
│ │  ├─ Engagement level: High / Medium / Low                  │
│ │  ├─ Last interaction: Date & type                          │
│ │  ├─ Calls with this person: # count                        │
│ │  └─ Email interactions: # count                            │
│ │                                                            │
│ ├─ "+ Add Stakeholder" button                                │
│ └─ "Remove" button (if not needed)                           │
│                                                               │
│ ACTIVITIES TAB                                                │
│ ├─ Filter: All / Calls / Meetings / Emails                   │
│ ├─ Date range filter                                         │
│ ├─ List of all deal-related activities:                      │
│ │  ├─ Activity 1: Call with Jane Smith                       │
│ │  │  ├─ Date, Duration, Quality Score                      │
│ │  │  ├─ On click: "View Call Detail" → CallDetail page     │
│ │  │  └─ Transcript preview                                  │
│ │  ├─ Activity 2: Proposal sent                              │
│ │  │  ├─ Date, Recipient, Status                            │
│ │  │  └─ "View Email" → Email detail                        │
│ │  ├─ Activity 3: Meeting held                               │
│ │  │  ├─ Date, Duration, Attendees                          │
│ │  │  ├─ Recording available                                │
│ │  │  └─ "View Meeting" → MeetingDetail page                │
│ │  └─ ...                                                    │
│ │                                                            │
│ └─ Pagination: 15 per page                                   │
│                                                               │
│ AI CHAT TAB                                                   │
│ ├─ Chat interface for deal questions                         │
│ ├─ Ask about closing strategy, risks, next steps             │
│ ├─ AI responses reference actual deal data                   │
│ ├─ Examples:                                                 │
│ │  ├─ "How confident are we in closing?"                    │
│ │  ├─ "What are the top risks?"                             │
│ │  ├─ "Who should we call next?"                             │
│ │  └─ "What's holding back the close?"                       │
│ │                                                            │
│ └─ AI can suggest actions & set reminders                    │
│                                                               │
│ BOTTOM ACTION BUTTONS                                         │
│ ├─ Update Stage (dropdown to select new stage)               │
│ ├─ Add Activity (call/email/meeting)                         │
│ ├─ Add Stakeholder                                           │
│ ├─ Schedule Call                                              │
│ ├─ Send Proposal                                              │
│ ├─ Set Reminder                                               │
│ └─ Edit Deal Details                                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## 2.3 Database Queries for Deal Detail

```sql
-- MAIN DEAL DATA
SELECT 
  d.id, d.name, d.value, d.stage, d.probability,
  d.health, d.momentum, d.expected_close_date,
  d.description, d.created_at, d.stage_entered_at,
  u.full_name as owner,
  a.name as company,
  dra.risk_score, dra.qualification_score,
  dm.meetings_count, dm.contacts_engaged,
  dm.calls_count, dm.emails_count

FROM deals d
LEFT JOIN users u ON d.owner_id = u.id
LEFT JOIN accounts a ON d.account_id = a.id
LEFT JOIN deal_risk_assessment dra ON d.id = dra.deal_id
LEFT JOIN deal_metrics dm ON d.id = dm.deal_id

WHERE d.id = ? AND d.organization_id = ?;

-- DEAL STAGE HISTORY
SELECT 
  previous_stage, new_stage, changed_by,
  changed_at, changed_reason,
  DATEDIFF(DAY, changed_at, NOW()) as days_ago

FROM deal_stage_history

WHERE deal_id = ?
ORDER BY changed_at DESC;

-- STAKEHOLDERS FOR DEAL
SELECT 
  ds.id, ac.full_name, ac.title, ac.email, ac.phone,
  ds.role, ds.engagement_level, ds.is_champion,
  (SELECT COUNT(*) FROM meetings WHERE 
   deal_id = ? AND contact_id = ac.id) as call_count,
  (SELECT MAX(started_at) FROM meetings WHERE 
   deal_id = ? AND contact_id = ac.id) as last_contact

FROM deal_stakeholders ds
LEFT JOIN account_contacts ac ON ds.contact_id = ac.id

WHERE ds.deal_id = ?
ORDER BY ds.engagement_level DESC;

-- ALL DEAL ACTIVITIES
SELECT 
  id, activity_type, description,
  CASE activity_type
    WHEN 'call' THEN (SELECT quality_score FROM meetings WHERE id = deal_activities.meeting_id)
    WHEN 'email' THEN NULL
    ELSE NULL
  END as score,
  created_at, created_by

FROM deal_activities

WHERE deal_id = ?
ORDER BY created_at DESC
LIMIT 25;
```

---

# SECTION 3: CALL/MEETING DETAIL PAGE

## 3.1 Page Overview & URL Structure

```
Route: /{role}/calls/{callId}  OR  /{role}/meetings/{meetingId}

Navigation Flow:
├─ Calls/Meetings List → Click meeting
├─ Customer Detail → Calls Tab → Click specific call
├─ Deal Detail → Activities Tab → Click call
├─ Insights → Topic/Objection drilldown → Click call mention
│
└─ Call/Meeting Detail Page (this page)
   ├─ Full meeting transcript
   ├─ AI analysis (sentiment, topics, buying signals, objections)
   ├─ Recording (if available)
   ├─ AI summary & key takeaways
   └─ Related records (deal, customer, participants)
```

## 3.2 Page Layout & Structure

```
CALL DETAIL PAGE LAYOUT:

┌──────────────────────────────────────────────────────────────┐
│ [← Back]  Call Detail - Discovery Call with John Smith       │
│           Feb 25, 2026 | 28:52 | Quality Score: 85          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ HEADER SECTION                                               │
│ ├─ Call Info Card                                            │
│ │  ├─ Type: Outbound (phone icon)                            │
│ │  ├─ Duration: 28 minutes 52 seconds                        │
│ │  ├─ Contact: John Smith (CTO)                              │
│ │  ├─ Company: Acme Corp (clickable)                         │
│ │  ├─ Date & Time: Feb 25, 2026 at 2:00 PM                  │
│ │  ├─ Rep: Sarah Chen                                        │
│ │  ├─ Deal: Enterprise License Deal (clickable)              │
│ │  ├─ Sentiment: Positive (green badge)                      │
│ │  ├─ Quality Score: 85/100 (progress bar)                   │
│ │  ├─ Recording: Available (▶ Play button)                   │
│ │  └─ Transcript: Available (📄 View)                        │
│ │                                                            │
│ └─ TABS: Summary | Transcript | Analysis | Recording         │
│                                                               │
│ SUMMARY TAB (default)                                        │
│ ├─ AI Generated Summary                                      │
│ │  ├─ Overview: (1-2 paragraph AI summary)                  │
│ │  ├─ "John called to discuss timeline and budget concerns" │
│ │  ├─ "Decision is expected by end of month"                │
│ │  └─ "Budget confirmed at $250K"                           │
│ │                                                            │
│ ├─ Key Takeaways (3-5 bullet points)                         │
│ │  ├─ ✓ Budget approved for purchase                         │
│ │  ├─ ✓ Implementation timeline: 30 days                     │
│ │  ✗ Concerned about timeline for Q1 close                  │
│ │  └─ ? Need to confirm with CFO + 2 more approvals         │
│ │                                                            │
│ ├─ Topics Discussed (pills/badges)                           │
│ │  ├─ Implementation Timeline                                │
│ │  ├─ Budget & ROI                                           │
│ │  ├─ Technical Integration                                  │
│ │  └─ + 2 more (expand to see all)                           │
│ │                                                            │
│ ├─ Buying Signals Detected (green cards)                     │
│ │  ├─ ✓ "That's exactly what we need"                       │
│ │  ├─ ✓ "Let's move forward with this"                      │
│ │  ├─ ✓ Decision maker confirmed timeline                   │
│ │  └─ ✓ Agreement markers: 5 detected                        │
│ │                                                            │
│ ├─ Objections Encountered (orange cards)                     │
│ │  ├─ "Implementation timeline is aggressive"                │
│ │  │  └─ Status: Addressed ✓                                │
│ │  └─ "Need final approval from CFO"                         │
│ │     └─ Status: Pending (action item)                       │
│ │                                                            │
│ ├─ Competitors Mentioned (if any)                            │
│ │  └─ No competitors mentioned                               │
│ │                                                            │
│ ├─ Call Metrics (grid)                                       │
│ │  ├─ Talk-Listen Ratio: 40%-60% (ideal) ✓                  │
│ │  ├─ Questions Asked: 12 (ideal 10-15) ✓                   │
│ │  ├─ Objection Handling: 2/2 resolved (100%) ✓              │
│ │  ├─ ROI Mentioned: Yes ✓                                   │
│ │  └─ Closing Attempted: Yes ✓                               │
│ │                                                            │
│ ├─ Next Steps (from AI or manual entry)                      │
│ │  ├─ 1. Send implementation timeline document               │
│ │  │   └─ Due: Feb 26                                        │
│ │  ├─ 2. Schedule call with CFO for final approval           │
│ │  │   └─ Due: Feb 27                                        │
│ │  └─ 3. Prepare contract for signature                      │
│ │      └─ Due: Feb 28                                        │
│ │                                                            │
│ └─ AI Coaching Tips (purple cards)                           │
│    ├─ "Tip: You're doing well with questions. Keep it up!"   │
│    └─ "Opportunity: Earlier talk/listen ratio was 45%-55%" │
│                                                               │
│ TRANSCRIPT TAB                                                │
│ ├─ Full transcript with speaker identification               │
│ ├─ Format:                                                   │
│ │  ├─ [00:15] Sarah: "Hi John, thanks for taking the call"   │
│ │  ├─ [00:22] John: "Of course, good to talk to you"        │
│ │  ├─ [00:35] Sarah: "I wanted to discuss the timeline..."   │
│ │  └─ ...                                                    │
│ │                                                            │
│ ├─ Timestamp links: Click time → Jump in recording           │
│ ├─ Highlight topics: Color-code important topics             │
│ ├─ Highlight objections: Highlight objections text           │
│ ├─ Highlight buying signals: Highlight positive cues         │
│ │                                                            │
│ └─ Copy/Export buttons                                       │
│                                                               │
│ ANALYSIS TAB                                                  │
│ ├─ Detailed AI Analysis Breakdown                            │
│ │                                                            │
│ ├─ Sentiment Analysis                                        │
│ │  ├─ Overall: Positive (78%) - green                       │
│ │  ├─ Timeline (in minutes):                                 │
│ │  │  ├─ 0-5 min: Neutral (50%)                             │
│ │  │  ├─ 5-15 min: Positive (82%)                           │
│ │  │  └─ 15-28 min: Very Positive (92%)                     │
│ │  └─ Sentiment trend: ↑ Improving throughout call           │
│ │                                                            │
│ ├─ Topics Mentioned (with importance ranking)                │
│ │  ├─ Implementation Timeline (35 mentions)                  │
│ │  ├─ Budget Discussion (28 mentions)                        │
│ │  ├─ Technical Integration (22 mentions)                    │
│ │  ├─ ROI & Value (18 mentions)                              │
│ │  └─ Support & Training (12 mentions)                       │
│ │                                                            │
│ ├─ Objections & Resolution                                   │
│ │  ├─ Objection 1: "Timeline too aggressive"                 │
│ │  │  ├─ Time mentioned: 12:30                               │
│ │  │  ├─ Resolution: "We can start parallel workstreams"     │
│ │  │  ├─ Resolved: Yes ✓                                     │
│ │  │  └─ Effectiveness: 85%                                  │
│ │  │                                                         │
│ │  └─ Objection 2: "Need CFO approval"                       │
│ │     ├─ Time mentioned: 20:15                               │
│ │     ├─ Status: Acknowledged, action item set               │
│ │     └─ Rep to follow up and get approval                   │
│ │                                                            │
│ ├─ Buying Signals & Willingness to Buy                       │
│ │  ├─ Agreement Markers: 5 (e.g., "Yes", "Absolutely")      │
│ │  ├─ Positive Verbal Cues: 3 (e.g., "Great", "Perfect")    │
│ │  ├─ Questions Asked by Prospect: 4 (high interest)         │
│ │  └─ Decision Timeline Confirmed: Yes ✓                     │
│ │                                                            │
│ ├─ Competitor Mentions (if any)                              │
│ │  └─ No competitors mentioned                               │
│ │                                                            │
│ ├─ Rep Performance Metrics                                   │
│ │  ├─ Discovery Questions: 8/10 (could ask 2 more)           │
│ │  ├─ Objection Handling: 2/2 (100% success)                 │
│ │  ├─ Value messaging: Strong ✓                              │
│ │  ├─ Closing attempt: Yes ✓                                 │
│ │  └─ Overall Score: 85/100                                  │
│ │                                                            │
│ └─ Coaching Recommendations (AI generated)                   │
│    ├─ "Continue the strong discovery questioning"            │
│    ├─ "Consider earlier trial close attempts"                │
│    └─ "Practice addressing budget objections faster"         │
│                                                               │
│ RECORDING TAB (if recording exists)                           │
│ ├─ Video player with playback controls                       │
│ ├─ Timeline markers for:                                     │
│ │  ├─ Topic changes                                          │
│ │  ├─ Objections raised                                      │
│ │  ├─ Buying signals                                         │
│ │  └─ Key moments                                            │
│ ├─ Click marker → Jump to that timestamp                     │
│ └─ Download button (if allowed)                              │
│                                                               │
│ BOTTOM ACTION BUTTONS                                         │
│ ├─ Add to Deal (link to deal)                                │
│ ├─ Create Task (from next steps)                             │
│ ├─ Schedule Follow-up Call                                   │
│ ├─ Download Transcript                                        │
│ ├─ Share with Manager                                         │
│ └─ Add to Coaching Plan                                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## 3.3 Database Queries for Call Detail

```sql
-- MEETING/CALL DATA
SELECT 
  m.id, m.meeting_title, m.type, m.duration_seconds,
  m.started_at, m.ended_at, m.sentiment,
  m.quality_score, m.transcript_available,
  m.recording_url, m.has_recording,
  u_rep.full_name as rep_name,
  u_contact.full_name as contact_name,
  ac.id as account_id, ac.name as company,
  d.id as deal_id, d.name as deal_name,
  ARRAY_AGG(DISTINCT ct.topic_name) as topics

FROM meetings m
LEFT JOIN users u_rep ON m.rep_id = u_rep.id
LEFT JOIN users u_contact ON m.contact_id = u_contact.id
LEFT JOIN accounts ac ON m.account_id = ac.id
LEFT JOIN deals d ON m.deal_id = d.id
LEFT JOIN call_topics ct ON m.id = ct.meeting_id

WHERE m.id = ? AND m.organization_id = ?

GROUP BY m.id;

-- TRANSCRIPT WITH SPEAKER IDENTIFICATION
SELECT 
  ct.timestamp_seconds,
  ct.speaker,
  ct.text,
  ct.sentiment_score

FROM call_transcripts ct

WHERE ct.meeting_id = ?
ORDER BY ct.timestamp_seconds ASC;

-- EXTRACTED TOPICS/OBJECTIONS/SIGNALS FROM MEETING
SELECT 
  'topic' as type,
  topic_name as name,
  timestamp_seconds,
  NULL as resolved

FROM call_topics
WHERE meeting_id = ?

UNION ALL

SELECT 
  'objection' as type,
  objection_type as name,
  timestamp_seconds,
  resolution_success as resolved

FROM call_objections
WHERE meeting_id = ?

UNION ALL

SELECT 
  'signal' as type,
  signal_type as name,
  timestamp_seconds,
  NULL as resolved

FROM call_buying_signals
WHERE meeting_id = ?

ORDER BY timestamp_seconds ASC;
```

---

# SECTION 4: INSIGHTS DETAIL PAGES (DRILL-DOWN)

## 4.1 Topic Detail View

```
Route: /{role}/insights/topics/{topicName}

Navigation Flow:
├─ Insights Page → Topics Tab
│  └─ Click topic card (e.g., "Pricing")
│
└─ Topic Detail Page

PAGE LAYOUT:

┌─────────────────────────────────────────────────────────┐
│ [← Back]  Topic: "Pricing"                              │
│           156 mentions | 65% positive sentiment          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Topic Overview                                          │
│ ├─ Topic Name: "Pricing"                                │
│ ├─ Total Mentions: 156 (↑ +12% vs last week)           │
│ ├─ Sentiment Score: 65% positive (green)               │
│ ├─ Sentiment Trend: ↑ Improving                         │
│ ├─ Associated Deals: 23                                 │
│ ├─ Related Topics: Budget, ROI, Value, Implementation   │
│ └─ First mentioned: 3 months ago                        │
│                                                         │
│ Calls Mentioning This Topic (list, 5 shown per page)   │
│ │                                                       │
│ ├─ Call 1: "Discovery Call with Postmedia Health"      │
│ │  ├─ Contact: Cam Brenner                              │
│ │  ├─ Date: Feb 25, 2026                                │
│ │  ├─ Duration: 28:52                                   │
│ │  ├─ Mention Time: 51:03                               │
│ │  ├─ Quote: "...pricing structure makes sense for our  │
│ │  │         use case..."                               │
│ │  ├─ Sentiment: Positive (green)                       │
│ │  ├─ Deal: Enterprise Deal                             │
│ │  └─ [View Call] → Call Detail Page                    │
│ │                                                       │
│ ├─ Call 2: "Pricing Discussion with TechCorp"          │
│ │  ├─ Contact: Sarah Mitchell                           │
│ │  ├─ Date: Feb 24, 2026                                │
│ │  └─ ...                                               │
│ │                                                       │
│ └─ [Pagination] [View All Calls (156 total)]           │
│                                                         │
│ Sentiment Breakdown Chart                              │
│ ├─ Last 4 weeks sentiment trend                         │
│ ├─ Week 1: 58% positive                                 │
│ ├─ Week 2: 62% positive                                 │
│ ├─ Week 3: 67% positive                                 │
│ └─ Week 4: 65% positive                                 │
│                                                         │
│ Key Phrases Related to This Topic                       │
│ ├─ "pricing structure": 28 mentions                     │
│ ├─ "pricing competitive": 22 mentions                   │
│ ├─ "pricing concerns": 18 mentions                      │
│ ├─ "pricing transparency": 12 mentions                  │
│ └─ + more...                                            │
│                                                         │
│ Most Common Responses                                   │
│ ├─ "ROI calculator & payment terms": 12x used           │
│ ├─ "Volume discount for 50+ users": 8x used             │
│ ├─ "Flexible payment options": 15x used                 │
│ └─ ...                                                  │
│                                                         │
│ Top Performers Discussing This Topic                    │
│ ├─ Alex Chen: 23 calls mentioning pricing               │
│ │  └─ Success Rate: 85%                                 │
│ ├─ Sarah Kim: 18 calls mentioning pricing               │
│ │  └─ Success Rate: 72%                                 │
│ └─ ...                                                  │
│                                                         │
│ AI Recommendations                                      │
│ ├─ "Pricing sensitivity is increasing - 5% week-over-week"
│ ├─ "Create pricing objection handling playbook"         │
│ ├─ "Share ROI calculator in every first call"           │
│ └─ "Update deal strategy to emphasize value over price" │
│                                                         │
│ [View All Calls] [Export Report] [Schedule Coaching]   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 4.2 Objection Detail View

```
Route: /{role}/insights/objections/{objectionType}

Navigation Flow:
├─ Insights Page → Objections Tab
│  └─ Click objection card (e.g., "Price too high")
│
└─ Objection Detail Page

PAGE LAYOUT:

┌──────────────────────────────────────────────────────┐
│ [← Back]  Objection: "Price too high"                │
│           42 frequency | 68% resolution rate          │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Objection Overview                                   │
│ ├─ Objection Type: "Price too high"                  │
│ ├─ Frequency: 42 times                               │
│ ├─ Resolution Success Rate: 68%                      │
│ ├─ Avg Resolution Time: 8 minutes                    │
│ ├─ Top Response Used: "ROI calculator & payment terms"
│ ├─ Trend: Stable (no significant change)             │
│ └─ Last 90 days data                                 │
│                                                      │
│ Calls with This Objection                            │
│ ├─ Call 1: Enterprise Demo - CloudScale              │
│ │  ├─ Contact: Robert Kim (CFO)                      │
│ │  ├─ Date: Feb 23, 2026                             │
│ │  ├─ When raised: 35:02 into call                   │
│ │  ├─ Quote: "...the price is significantly higher..." │
│ │  ├─ Response Given: "ROI calculator demo"           │
│ │  ├─ Resolved: Yes ✓ (resulted in deal)             │
│ │  ├─ Deal Value: $168K                               │
│ │  └─ [View Call]                                     │
│ │                                                    │
│ ├─ Call 2: Budget Discussion - TechStart Labs        │
│ │  ├─ Contact: Emily Rodriguez                        │
│ │  ├─ Date: Feb 22, 2026                              │
│ │  ├─ When raised: 22:18                              │
│ │  ├─ Quote: "...the price point is a concern..."     │
│ │  ├─ Response Given: "Startup discount option"       │
│ │  ├─ Resolved: No ✗ (lost deal)                      │
│ │  ├─ Deal Value: $45K (not won)                      │
│ │  └─ [View Call]                                     │
│ │                                                    │
│ └─ ...                                                │
│                                                      │
│ Success Rate by Response Type                        │
│ ├─ ROI Calculator Demo: 73% success                  │
│ ├─ Payment Terms Flexibility: 68% success            │
│ ├─ Volume Discount: 62% success                      │
│ ├─ Competitor Comparison: 58% success                │
│ └─ Total Addressable Market: 45% success             │
│                                                      │
│ Top Performers Handling This Objection               │
│ ├─ Sarah Chen: 12 objections, 91% resolution rate    │
│ ├─ Alex Rivera: 9 objections, 79% resolution rate    │
│ └─ ...                                                │
│                                                      │
│ Most Effective Responses (by frequency)              │
│ ├─ "ROI calculator + payment terms": 12x used, 83%   │
│ ├─ "Flexible payment options": 9x used, 67%          │
│ ├─ "Volume discount for large teams": 7x used, 71%   │
│ └─ ...                                                │
│                                                      │
│ AI Recommendations & Coaching                        │
│ ├─ "Price objection handling playbook created"       │
│ ├─ "Recommended top 3 responses: [...]"               │
│ ├─ "Schedule 1:1 coaching on ROI positioning"        │
│ └─ "This is your biggest objection - prioritize"     │
│                                                      │
│ [Export Report] [Create Coaching] [Share Practice]   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# SECTION 5: COACHING DETAIL PAGE

## 5.1 Team Member Performance Detail

```
Route: /{role}/coaching/{memberId}

Navigation Flow:
├─ Coaching Page → Member Grid
│  └─ Click member card
│
└─ Member Performance Detail Page

PAGE LAYOUT:

┌──────────────────────────────────────────────────────────┐
│ [← Back]  Performance Profile - Sarah Chen               │
│           Senior Sales Rep | Score: 87/100 (+5 vs week)  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Member Header                                            │
│ ├─ Avatar + Name + Role                                  │
│ ├─ Performance Score: 87/100 (green)                     │
│ ├─ Change: +5 points vs last week ↑                      │
│ ├─ Status: On-track ✓                                    │
│ ├─ Team: Enterprise Sales                                │
│ ├─ Manager: Michael Thompson                             │
│ └─ Email: sarah.chen@company.com                         │
│                                                          │
│ TABS: Overview | Metrics | Calls | Coaching | History    │
│                                                          │
│ OVERVIEW TAB (default)                                  │
│ │                                                       │
│ ├─ Key Metrics (grid)                                   │
│ │  ├─ Calls Completed: 42 (↑ +5 this week)             │
│ │  ├─ Avg Call Duration: 12:45                          │
│ │  ├─ Conversion Rate: 34% (target: 30%) ✓              │
│ │  ├─ Quota Attainment: 112% (↑ +8% this week) ✓        │
│ │  ├─ Deals Closed: 8 ($425K revenue)                   │
│ │  └─ Revenue per Deal: $53K                            │
│ │                                                       │
│ ├─ Performance Trend (line chart)                        │
│ │  ├─ Last 8 weeks scoring trend                        │
│ │  ├─ Week 1: 82 → Week 2: 81 → Week 3: 83             │
│ │  ├─ Week 4: 82 → Week 5: 85 → Week 6: 86             │
│ │  ├─ Week 7: 87 → Week 8: 87 (current)                │
│ │  └─ Trend: ↑ Improving (+5 points over 8 weeks)       │
│ │                                                       │
│ ├─ Strengths (demonstrated skills)                      │
│ │  ├─ ✓ Discovery (asks 8+ questions per call)         │
│ │  ├─ ✓ Closing (82% close rate on proposals)           │
│ │  ├─ ✓ Objection Handling (90% resolution)             │
│ │  ├─ ✓ Multi-threading (avg 3+ champions per deal)     │
│ │  └─ ✓ ROI Messaging (focuses on value)                │
│ │                                                       │
│ ├─ Areas for Improvement                                │
│ │  ├─ Talk Ratio (currently 45%, target 40%)            │
│ │  ├─ Pipeline Management (needs 30% more)              │
│ │  ├─ Proposal Response Time (avg 4 days, target 2)     │
│ │  └─ Follow-up Timing (some 7+ day gaps)               │
│ │                                                       │
│ ├─ Recent Coaching Sessions                             │
│ │  ├─ Session 1: "Discovery Skills"                     │
│ │  │  ├─ Date: 2 weeks ago                              │
│ │  │  ├─ Improvement: Questions increased from 6→8      │
│ │  │  └─ Status: ✓ Goal achieved                        │
│ │  │                                                    │
│ │  ├─ Session 2: "Objection Handling"                   │
│ │  │  ├─ Date: 1 week ago                               │
│ │  │  ├─ Improvement: Resolution rate 75%→90%           │
│ │  │  └─ Status: ✓ Goal achieved                        │
│ │  │                                                    │
│ │  └─ Last Session: 3 days ago                          │
│ │     └─ Next Session Scheduled: Mar 24, 2026            │
│ │                                                       │
│ └─ Recommended Next Coaching Action                     │
│    ├─ Focus: "Proposal Response Time"                   │
│    ├─ Target: Reduce from 4 days to 2 days              │
│    ├─ Expected Impact: +8% win rate improvement          │
│    └─ [Schedule Coaching Session]                       │
│                                                          │
│ METRICS TAB                                              │
│ ├─ Complete call quality breakdown                      │
│ ├─ Talk-Listen Ratio graph (weekly)                     │
│ ├─ Question Rate per Call (trend)                       │
│ ├─ Objection Resolution Rate (% of success)             │
│ ├─ Closing Rate (proposals → won)                       │
│ ├─ Deal Cycle Duration (avg days)                       │
│ ├─ Quote-to-Close Ratio                                 │
│ └─ Pipeline Coverage Ratio                              │
│                                                          │
│ CALLS TAB                                                │
│ ├─ List of all calls (last 30 days)                     │
│ ├─ For each call:                                        │
│ │  ├─ Date, Duration, Contact, Company                  │
│ │  ├─ Quality Score with breakdown                      │
│ │  ├─ Deal associated (if any)                          │
│ │  └─ [View Transcript]                                 │
│ │                                                       │
│ ├─ Filter: By date range, by company, by type           │
│ └─ Sort: Latest first, by score, by duration             │
│                                                          │
│ COACHING TAB                                             │
│ ├─ All coaching sessions related to this member         │
│ ├─ For each session:                                     │
│ │  ├─ Date, Topic, Coach (manager name)                 │
│ │  ├─ Improvement goal                                   │
│ │  ├─ Status: In Progress / Achieved / Ongoing           │
│ │  ├─ Baseline metric vs current metric                 │
│ │  └─ [View Session Notes]                              │
│ │                                                       │
│ ├─ Coaching Plan (if active)                            │
│ │  ├─ Current focus: [topic]                            │
│ │  ├─ Target: [metric improvement]                      │
│ │  ├─ Timeline: [duration]                              │
│ │  └─ Next session: [date]                              │
│ │                                                       │
│ └─ [Schedule New Session]                               │
│                                                          │
│ HISTORY TAB                                              │
│ ├─ Timeline of all improvements over time                │
│ ├─ Each entry shows:                                     │
│ │  ├─ Date range                                        │
│ │  ├─ Metric tracked                                    │
│ │  ├─ Baseline value                                    │
│ │  ├─ Final value                                       │
│ │  ├─ Improvement %                                     │
│ │  └─ Status (Achieved / In Progress / Failed)           │
│ │                                                       │
│ └─ Growth summary over months                            │
│                                                          │
│ BOTTOM ACTION BUTTONS                                    │
│ ├─ Schedule Coaching Session                             │
│ ├─ View Recent Calls                                     │
│ ├─ Export Performance Report                             │
│ ├─ Send Feedback                                         │
│ └─ Review with Manager                                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

# SECTION 6: DATABASE SCHEMA FOR DETAIL PAGES

```sql
Table: activity_logs (general activity tracking)
├─ id (PK) UUID
├─ user_id (FK)
├─ organization_id (FK)
├─ entity_type VARCHAR (deal, customer, meeting, etc)
├─ entity_id UUID
├─ action VARCHAR (viewed, updated, created, deleted)
├─ changes JSONB [what changed]
├─ created_at TIMESTAMPTZ
└─ INDEXES: (entity_type, entity_id, created_at DESC)

Table: page_navigation_tracking
├─ id (PK) UUID
├─ user_id (FK)
├─ from_page VARCHAR (source page)
├─ to_page VARCHAR (destination page)
├─ record_id UUID [if navigating to specific record]
├─ timestamp TIMESTAMPTZ
└─ INDEXES: (user_id, timestamp DESC)
```

---

# SECTION 7: NAVIGATION WORKFLOW MAP

```
COMPLETE DRILL-DOWN NAVIGATION FLOW:

CUSTOMERS PAGE (List)
│
├─ Click Customer Card
│  ├─ Navigate to: /customers/{customerId} (CustomerDetail)
│  │
│  ├─ On CustomerDetail:
│  │  ├─ Calls Tab → Click specific call
│  │  │  └─ Navigate to: /calls/{callId} (CallDetail)
│  │  │
│  │  ├─ Meetings Tab → Click specific meeting
│  │  │  └─ Navigate to: /meetings/{meetingId} (MeetingDetail)
│  │  │
│  │  ├─ Deals Tab → Click deal
│  │  │  └─ Navigate to: /deals/{dealId} (DealDetail)
│  │  │
│  │  └─ "View All Calls" → /calls?customer={id}
│  │
│  └─ CallDetail Page
│     ├─ View Full Transcript
│     ├─ View Analysis
│     ├─ [Link to Customer] → Back to /customers/{customerId}
│     ├─ [Link to Deal] → Navigate to: /deals/{dealId}
│     └─ [Create Task] → /tasks/new?linkedCall={callId}

DEALS PAGE (List)
│
├─ Click Deal Card
│  ├─ Navigate to: /deals/{dealId} (DealDetail)
│  │
│  ├─ On DealDetail:
│  │  ├─ Click Company Name → /customers/{customerId}
│  │  │  └─ CustomerDetail pages
│  │  │
│  │  ├─ Activities Tab → Click activity
│  │  │  ├─ If Call → /calls/{callId}
│  │  │  ├─ If Meeting → /meetings/{meetingId}
│  │  │  └─ If Email → /emails/{emailId}
│  │  │
│  │  ├─ Stakeholders Tab → Click Contact
│  │  │  └─ Navigate to: /contacts/{contactId}
│  │  │
│  │  └─ Chat Tab → Ask questions about deal
│  │
│  └─ DealDetail Page
│     ├─ All nested drill-downs available

INSIGHTS PAGE (Topics/Objections/Competitors)
│
├─ Topics Tab
│  └─ Click Topic Card (e.g., "Pricing")
│     ├─ Navigate to: /insights/topics/{topicName}
│     │
│     ├─ On Topic Detail:
│     │  ├─ Click Call Mention
│     │  │  └─ Navigate to: /calls/{callId}
│     │  │
│     │  └─ Top Performers Section
│     │     ├─ Click Rep Name
│     │     └─ Navigate to: /coaching/{memberId}
│     │
│     └─ Topic Detail Page
│        └─ Drill-down to calls
│
├─ Objections Tab
│  └─ Click Objection Card (e.g., "Price too high")
│     ├─ Navigate to: /insights/objections/{objectionType}
│     │
│     ├─ On Objection Detail:
│     │  └─ Click Call Mention
│     │     └─ Navigate to: /calls/{callId}
│     │
│     └─ Objection Detail Page
│        └─ Drill-down to calls
│
└─ Competitors Tab
   └─ Click Competitor Card (e.g., "Competitor A")
      ├─ Navigate to: /insights/competitors/{competitorName}
      │
      ├─ On Competitor Detail:
      │  └─ Click Call Mention
      │     └─ Navigate to: /calls/{callId}
      │
      └─ Competitor Detail Page
         └─ Drill-down to calls

COACHING PAGE (Team Members)
│
├─ Click Member Card
│  ├─ Navigate to: /coaching/{memberId}
│  │
│  ├─ On Member Detail:
│  │  ├─ Calls Tab → Click call
│  │  │  └─ Navigate to: /calls/{callId}
│  │  │
│  │  ├─ Coaching Tab → View sessions
│  │  │  └─ Click session
│  │  │     └─ Navigate to: /coaching/sessions/{sessionId}
│  │  │
│  │  └─ History Tab → View improvements
│  │     └─ Click improvement
│  │        └─ Show coaching impact & related calls
│  │
│  └─ Member Detail Page
│     ├─ All activity drill-downs
└─ Coaching Detail Page (full member history)
```

---

**END OF DETAIL PAGES & DRILL-DOWN ARCHITECTURE DOCUMENTATION**

✅ All detail pages documented
✅ Complete navigation flows
✅ Database queries for each page
✅ UI layouts and data structures
✅ Cross-page linking patterns
✅ User interaction workflows


# Account Setup Progress & Integrations Architecture
## Complete Documentation for Setup Panel & Integration Features

---

# SECTION 1: ACCOUNT SETUP PROGRESS SIDE PANEL

## 1.1 Panel Overview

```
Location: Fixed sidebar on right side
Display: Appears below main navigation (top-20)
Width: 320px (w-80)
Behavior: 
  - Minimize to compact tab on right edge (shows progress %)
  - Re-expand from compact tab
  - Scrollable checklist area
  - Always-visible progress bar
```

## 1.2 Side Panel Visual Layout

```
┌──────────────────────────────────────────┐
│                                          │
│  ACCOUNT SETUP PROGRESS SIDE PANEL       │
│  (Fixed Right Sidebar - 320px wide)      │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  HEADER SECTION                          │
│  ├─ Title: "Account Setup Progress"      │
│  ├─ Subtitle: "Complete these steps..."  │
│  ├─ Minimize Button [>] (top right)      │
│  │                                       │
│  └─ Progress Summary                     │
│     ├─ "1 of 7 completed"                │
│     ├─ Progress %, blue color: "14%"     │
│     └─ Progress Bar (blue #2563EB)       │
│        └─ Visual bar showing 14% width   │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  CHECKLIST ITEMS (scrollable)            │
│  │                                       │
│  ├─ Item 1 (NOT COMPLETED)               │
│  │  ├─ Icon: Blue circle with "1"        │
│  │  ├─ Icon: Calendar (gray)             │
│  │  ├─ Label: "Connect Calendar"         │
│  │  ├─ Description: "Sync your meetings" │
│  │  ├─ Chevron Right (gray) ─────────────┤
│  │  └─ Background: white, border-gray    │
│  │     Hover: blue-50, border-blue-300   │
│  │                                       │
│  ├─ Item 2 (NOT COMPLETED)               │
│  │  ├─ Icon: Blue circle with "2"        │
│  │  ├─ Icon: Database (gray)             │
│  │  ├─ Label: "Connect CRM"              │
│  │  ├─ Description: "HubSpot or SF"      │
│  │  ├─ Chevron Right (gray)              │
│  │  └─ Background: white, border-gray    │
│  │                                       │
│  ├─ Item 3 (NOT COMPLETED)               │
│  │  ├─ Icon: Blue circle with "3"        │
│  │  ├─ Icon: FileText (gray)             │
│  │  ├─ Label: "Customize Notes Template" │
│  │  ├─ Description: "Define your format" │
│  │  └─ ...                               │
│  │                                       │
│  ├─ Item 4 (NOT COMPLETED)               │
│  │  ├─ Icon: Blue circle with "4"        │
│  │  ├─ Icon: Target (gray)               │
│  │  ├─ Label: "Set Up Scorecards"        │
│  │  ├─ Description: "Call quality metrics"│
│  │  └─ ...                               │
│  │                                       │
│  ├─ Item 5 (NOT COMPLETED)               │
│  │  ├─ Icon: Blue circle with "5"        │
│  │  ├─ Icon: Tag (gray)                  │
│  │  ├─ Label: "Define Trackers"          │
│  │  ├─ Description: "Track keywords..."  │
│  │  └─ ...                               │
│  │                                       │
│  ├─ Item 6 (COMPLETED ✓)                 │
│  │  ├─ Icon: Green checkmark circle      │
│  │  ├─ Icon: Users (green)               │
│  │  ├─ Label: "Invite Team" (green text) │
│  │  ├─ Description: "Add your reps"      │
│  │  ├─ Chevron Right (green)             │
│  │  └─ Background: green-50, green text  │
│  │     Hover: green-100                  │
│  │                                       │
│  ├─ Item 7 (NOT COMPLETED)               │
│  │  ├─ Icon: Blue circle with "7"        │
│  │  ├─ Icon: GitBranch (gray)            │
│  │  ├─ Label: "Configure Routing Rules"  │
│  │  ├─ Description: "Auto-assign leads"  │
│  │  └─ ...                               │
│  │                                       │
│  └─ [Scroll area - shows 3-4 items]      │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  FOOTER SECTION                          │
│  ├─ Text: "Need help getting started?"   │
│  ├─ Button: "Watch Setup Video"          │
│  │  └─ Size: small, Variant: outline     │
│  │  └─ Width: 100%                       │
│  └─ Background: gray-50                  │
│                                          │
├──────────────────────────────────────────┤
│ MINIMIZED STATE (Compact Tab)            │
│ ├─ Position: Right edge, middle          │
│ ├─ Button size: 56px x 112px            │
│ ├─ Content:                              │
│ │  ├─ Chevron Left icon                  │
│ │  └─ Progress %: "14%"                  │
│ ├─ Background: blue-600 (#2563EB)        │
│ ├─ Hover: blue-700                       │
│ └─ Click to expand panel                 │
│                                          │
└──────────────────────────────────────────┘
```

## 1.3 Checklist Items - Complete Breakdown

```
ITEM 1: CONNECT CALENDAR
├─ Icon: Calendar (lucide-react)
├─ Label: "Connect Calendar"
├─ Description: "Sync your meetings"
├─ Status: NOT COMPLETED (default)
├─ Path to Navigate: /settings/integrations
├─ Purpose: 
│  ├─ Sync calendar events (Google Calendar, Outlook)
│  ├─ Auto-populate meetings in system
│  ├─ Prevent double-booking
│  ├─ Show meeting free/busy times
│  └─ Pull in attendee info from calendar
│
└─ On Click: Navigate to Integrations page → Calendar section

ITEM 2: CONNECT CRM
├─ Icon: Database (lucide-react)
├─ Label: "Connect CRM"
├─ Description: "HubSpot or Salesforce"
├─ Status: NOT COMPLETED (default)
├─ Path to Navigate: /settings/integrations
├─ Purpose:
│  ├─ Sync with HubSpot or Salesforce
│  ├─ Pull in account/contact/deal data
│  ├─ Push call/meeting notes back to CRM
│  ├─ Real-time two-way sync
│  └─ Update deal status from calls
│
└─ On Click: Navigate to Integrations page → CRM section

ITEM 3: CUSTOMIZE NOTES TEMPLATE
├─ Icon: FileText (lucide-react)
├─ Label: "Customize Notes Template"
├─ Description: "Define your format"
├─ Status: NOT COMPLETED (default)
├─ Path to Navigate: /settings/templates
├─ Purpose:
│  ├─ Create standard note-taking template
│  ├─ Define required fields for call notes
│  ├─ Set note structure/format
│  ├─ Standardize CRM updates
│  └─ Auto-populate sections from meeting AI
│
└─ On Click: Navigate to Settings → Templates page

ITEM 4: SET UP SCORECARDS
├─ Icon: Target (lucide-react)
├─ Label: "Set Up Scorecards"
├─ Description: "Create call quality metrics"
├─ Status: NOT COMPLETED (default)
├─ Path to Navigate: /settings/scorecards
├─ Purpose:
│  ├─ Define call quality evaluation criteria
│  ├─ Set up 1-5 or 1-10 scoring system
│  ├─ Define specific scoring criteria
│  ├─ Auto-score calls using AI
│  ├─ Manager review & calibration
│  └─ Generate coaching recommendations
│
└─ On Click: Navigate to Settings → Scorecards page

ITEM 5: DEFINE TRACKERS
├─ Icon: Tag (lucide-react)
├─ Label: "Define Trackers"
├─ Description: "Track keywords & topics"
├─ Status: NOT COMPLETED (default)
├─ Path to Navigate: /settings/smart-topics
├─ Purpose:
│  ├─ Define topics to track in calls
│  ├─ Set up objection keywords
│  ├─ Track competitor mentions
│  ├─ Auto-detect in call transcripts
│  ├─ Dashboard visibility in Insights
│  └─ AI recommendations based on trackers
│
└─ On Click: Navigate to Settings → Smart Topics page

ITEM 6: INVITE TEAM (PRE-COMPLETED ✓)
├─ Icon: Users (lucide-react)
├─ Label: "Invite Team"
├─ Description: "Add your reps"
├─ Status: COMPLETED (default in demo)
├─ Path to Navigate: /settings/members
├─ Purpose:
│  ├─ Already completed during onboarding
│  ├─ Invite sales reps to platform
│  ├─ Set permissions/roles
│  ├─ Assign team members to managers
│  └─ Enable call recording
│
├─ Visual State:
│  ├─ Checkmark circle (green) instead of number
│  ├─ Green text for label
│  ├─ Green icon
│  ├─ Green hover state
│  └─ Green-50 background
│
└─ On Click: Navigate to Settings → Members page

ITEM 7: CONFIGURE ROUTING RULES
├─ Icon: GitBranch (lucide-react)
├─ Label: "Configure Routing Rules"
├─ Description: "Auto-assign leads"
├─ Status: NOT COMPLETED (default)
├─ Path to Navigate: /settings/automations
├─ Purpose:
│  ├─ Define auto-assignment rules
│  ├─ Route inbound calls to reps
│  ├─ Round-robin vs skill-based routing
│  ├─ Lead scoring & distribution
│  ├─ Fallback rules for busy reps
│  └─ Smart call transfer logic
│
└─ On Click: Navigate to Settings → Automations page
```

## 1.4 Interactions & Behavior

```
CLICK BEHAVIOR (on checklist item):
├─ Item clicked
├─ Card animates (hover state activates)
├─ Navigate to corresponding page using path
│  └─ Using React Router: navigate(item.path)
├─ Panel remains visible (sidebar on right)
│ └─ User can scroll through both main view and panel
└─ When completed on settings page:
   ├─ Return to dashboard
   ├─ Item checkmark updates in panel
   ├─ Progress % increases
   └─ Progress bar advances

MINIMIZE/COLLAPSE BEHAVIOR:
├─ Click minimize button [>]
├─ Panel collapses to compact tab
├─ Tab shows:
│  ├─ [<] Chevron Left
│  ├─ Current progress % 
│  └─ Fixed on right edge, middle of screen
├─ Same tab shows when panel minimized
├─ Click tab to re-expand panel

PROGRESS BAR UPDATE:
├─ Completion % calculated: (completedCount / totalCount) * 100
├─ Currently: 1/7 = 14%
├─ Updates in real-time as items marked complete
├─ Animated transition when % changes (500ms duration)

SCROLLING:
├─ Panel content scrollable when items exceed viewport
├─ Header & footer fixed (progress bar at top, CTA at bottom)
├─ Checklist area (flex-1 overflow-y-auto)
├─ Smooth scrolling in checklist

STYLING:
├─ Completed items:
│  ├─ Background: green-50
│  ├─ Border: green-200
│  ├─ Text: green-900
│  ├─ Hover: green-100
│  ├─ Icon: Green checkmark + green icons
│  └─ Chevron: Green
│
├─ Incomplete items:
│  ├─ Background: white
│  ├─ Border: gray-200
│  ├─ Text: gray-900
│  ├─ Hover: blue-50, border-blue-300
│  ├─ Icon: Blue circle with number
│  └─ Chevron: gray-400
│
└─ Always visible:
   ├─ Progress bar: blue-600
   ├─ Progress %: blue-600 font-semibold
   ├─ Text: gray-600 (description), gray-900 (label)
```

---

# SECTION 2: INTEGRATIONS PAGE (NEW PAGE TO CREATE)

## 2.1 Page Overview & URL Structure

```
Route: /{role}/settings/integrations  OR  /settings/integrations

Navigation Flow:
├─ From Setup Panel
│  ├─ Click "Connect Calendar" → /settings/integrations (Calendar section)
│  └─ Click "Connect CRM" → /settings/integrations (CRM section)
│
├─ From Settings Page
│  ├─ Click "Integrations" in settings menu
│  └─ Navigate to /settings/integrations
│
└─ Direct navigation
   └─ User types URL directly

Page Purpose:
├─ Configure all third-party integrations
├─ Connect to APIs (Calendar, CRM, etc)
├─ Manage API keys & credentials
├─ Test connections
├─ Enable/disable integrations
└─ Set sync frequency & options
```

## 2.2 Page Layout & Structure

```
INTEGRATIONS SETTINGS PAGE LAYOUT:

┌────────────────────────────────────────────────────────┐
│ Settings / Integrations                                │
│ Manage your integrations and connections               │
├────────────────────────────────────────────────────────┤
│                                                        │
│ TAB NAVIGATION                                         │
│ [Active] | [Inactive] | [All]                          │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│ SECTION 1: CALENDAR INTEGRATIONS                        │
│ ├─ Header with expand/collapse                         │
│ ├─ Connection Status Badge                             │
│ │                                                      │
│ │ ┌─ GOOGLE CALENDAR ─────────────────────────────┐   │
│ │ │ [NOT CONNECTED] (red badge)                   │   │
│ │ │                                                │   │
│ │ │ Description: Sync your Google Calendar to    │   │
│ │ │ automatically pull in meetings and available │   │
│ │ │ times. All events will appear in your call   │   │
│ │ │ history.                                      │   │
│ │ │                                                │   │
│ │ │ Features:                                      │   │
│ │ │ ├─ ✓ Auto-sync meetings (real-time)          │   │
│ │ │ ├─ ✓ Show free/busy times                    │   │
│ │ │ ├─ ✓ Prevent double-booking                  │   │
│ │ │ ├─ ✓ Pull attendee information               │   │
│ │ │ ├─ ✓ Webhook for new events                  │   │
│ │ │ └─ ✓ Two-way sync with updates               │   │
│ │ │                                                │   │
│ │ │ Permissions Needed:                            │   │
│ │ │ ├─ calendar.readonly                          │   │
│ │ │ ├─ calendar.events.readonly                   │   │
│ │ │ └─ calendar.calendarlist.readonly             │   │
│ │ │                                                │   │
│ │ │ [Connect with Google] [Learn More] [Docs]     │   │
│ │ │                                                │   │
│ │ └─ OR IF ALREADY CONNECTED ────────────────────┘   │
│ │    [CONNECTED] (green badge)                        │
│ │    Connected as: john.doe@gmail.com                │
│ │    Last sync: 2 minutes ago                        │
│ │    Sync frequency: Every 5 minutes ▼               │
│ │    [Edit] [Test Connection] [Disconnect]          │
│ │                                                      │
│ │ ┌─ MICROSOFT OUTLOOK ────────────────────────────┐  │
│ │ │ [NOT CONNECTED] (red badge)                    │  │
│ │ │ Description: Sync your Outlook calendar...    │  │
│ │ │ [Connect with Microsoft] [Learn More] [Docs]  │  │
│ │ └────────────────────────────────────────────────┘  │
│ │                                                      │
│ │ ┌─ APPLE CALENDAR ──────────────────────────────┐   │
│ │ │ [NOT CONNECTED]                               │   │
│ │ │ [Connect with Apple] [Learn More] [Docs]      │   │
│ │ └──────────────────────────────────────────────┘    │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│ SECTION 2: CRM INTEGRATIONS                            │
│ ├─ Header with expand/collapse                        │
│ │                                                     │
│ │ ┌─ HUBSPOT ────────────────────────────────────┐   │
│ │ │ [NOT CONNECTED] (red badge)                  │   │
│ │ │                                               │   │
│ │ │ Description: Sync your HubSpot CRM data.    │   │
│ │ │ Pull in accounts, contacts, deals, and push │   │
│ │ │ call summaries back to HubSpot.              │   │
│ │ │                                               │   │
│ │ │ Features:                                     │   │
│ │ │ ├─ ✓ 2-way sync (accounts, contacts, deals) │   │
│ │ │ ├─ ✓ Auto-create activities from calls      │   │
│ │ │ ├─ ✓ Update deal stage from call outcomes  │   │
│ │ │ ├─ ✓ Real-time syncing                      │   │
│ │ │ ├─ ✓ Field mapping & customization          │   │
│ │ │ ├─ ✓ Conversation intelligence              │   │
│ │ │ └─ ✓ API rate limit: [current usage]        │   │
│ │ │                                               │   │
│ │ │ Permissions Needed:                           │   │
│ │ │ ├─ contacts        (read/write)              │   │
│ │ │ ├─ companies       (read/write)              │   │
│ │ │ ├─ deals           (read/write)              │   │
│ │ │ ├─ engagements     (create/read)             │   │
│ │ │ ├─ engagement_notes (create/read)            │   │
│ │ │ └─ crm.objects.contacts (write)              │   │
│ │ │                                               │   │
│ │ │ [Connect with HubSpot] [Preview] [Docs]     │   │
│ │ │                                               │   │
│ │ └──────────────────────────────────────────────┘   │
│ │                                                      │
│ │ ┌─ SALESFORCE ─────────────────────────────────┐   │
│ │ │ [CONNECTED] (green badge)                    │   │
│ │ │ Connected as: Acme Corp (Production)         │   │
│ │ │ Instance: na14.salesforce.com                │   │
│ │ │ Last sync: 30 seconds ago                    │   │
│ │ │ Sync frequency: Real-time with 5min batches │   │
│ │ │ Objects synced: Accounts (150), Contacts    │   │
│ │ │                 (450), Opportunities (80)    │   │
│ │ │ Fields synced: [50 custom fields]            │   │
│ │ │                                               │   │
│ │ │ Sync Settings:                                │   │
│ │ │ □ Sync Accounts                              │   │
│ │ │ ☑ Sync Contacts                              │   │
│ │ │ ☑ Sync Opportunities                         │   │
│ │ │ ☑ Create activities from calls               │   │
│ │ │ ☑ Update Opp stage from call sentiment       │   │
│ │ │ □ Update Opp next step field                 │   │
│ │ │                                               │   │
│ │ │ [Edit] [Test Connection] [View Logs]        │   │
│ │ │ [Repair Sync] [Disconnect]                   │   │
│ │ │                                               │   │
│ │ └──────────────────────────────────────────────┘   │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│ SECTION 3: COMMUNICATION INTEGRATIONS                  │
│ ├─ Header with expand/collapse                        │
│ │                                                     │
│ │ ┌─ EMAIL (Gmail / Outlook)─────────────────────┐  │
│ │ │ [NOT CONNECTED]                              │  │
│ │ │ Features: Pull in emails, threads, sentiment │  │
│ │ │ [Connect Email] [Learn More]                 │  │
│ │ └────────────────────────────────────────────┘   │
│ │                                                    │
│ │ ┌─ SLACK ───────────────────────────────────────┐ │
│ │ │ [NOT CONNECTED]                              │ │
│ │ │ Features: Get insights in Slack, alerts,     │ │
│ │ │ team notifications                           │ │
│ │ │ [Connect Slack] [Learn More]                 │ │
│ │ └────────────────────────────────────────────┘   │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│ SECTION 4: CUSTOM INTEGRATIONS / API                   │
│ ├─ Header with expand/collapse                        │
│ │                                                     │
│ │ ┌─ API KEYS ─────────────────────────────────────┐ │
│ │ │ Your API key for integrations:                │ │
│ │ │                                               │ │
│ │ │ Key: pk_live_xxxxxxxxxxx [copy]  [regenerate]│ │
│ │ │ Environments: Production | Sandbox ▼          │ │
│ │ │                                               │ │
│ │ │ Usage this month: 547,200 / 1,000,000 calls  │ │
│ │ │ Webhook endpoints registered: 3               │ │
│ │ │ Rate limit: 500 req/min                       │ │
│ │ │                                               │ │
│ │ │ [View Documentation] [Create New Key]         │ │
│ │ │ [Manage Webhooks] [View API Logs]             │ │
│ │ │                                               │ │
│ │ └─────────────────────────────────────────────┘  │
│ │                                                    │
│ │ ┌─ WEBHOOKS ─────────────────────────────────────┐│
│ │ │ Webhook 1: https://api.example.com/webhook   ││
│ │ │ Event: meeting.completed                      ││
│ │ │ Status: Active (200) [edit] [test] [delete]  ││
│ │ │ Last triggered: 2 minutes ago                 ││
│ │ │                                               ││
│ │ │ Webhook 2: ...                                ││
│ │ │                                               ││
│ │ │ [+ Add Webhook]                               ││
│ │ │                                               ││
│ │ └─────────────────────────────────────────────┘  │
│                                                        │
│ BOTTOM SECTION                                        │
│ ├─ Status: All integrations working ✓                │
│ ├─ Last synced: 2 minutes ago                        │
│ ├─ Data last updated: Feb 25, 2026, 2:30 PM        │
│ └─ [Sync Now] [Export Config] [Get Help]            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## 2.3 Integration Details - Calendar

```
GOOGLE CALENDAR CONNECTION:

Connection Flow:
1. User clicks "Connect with Google"
2. OAuth popup opens (Google authorization)
3. User grants permissions:
   - calendar.readonly
   - calendar.events.readonly
   - calendar.calendarlist.readonly
4. System receives access token
5. System stores encrypted token in DB
6. Test connection automatically runs
7. Starts syncing calendar events
8. Displays success message

After Connection:
├─ Status: CONNECTED (green badge)
├─ Display: Connected as: {email}
├─ Last sync: {timestamp}
├─ Sync frequency: Every 5 minutes (configurable)
├─ Actions:
│  ├─ [Edit] - Change sync options
│  ├─ [Test Connection] - Verify still working
│  └─ [Disconnect] - Remove integration
│
└─ Sync Details:
   ├─ Pull all events from primary calendar
   ├─ Fields synced:
   │  ├─ Event title
   │  ├─ Start/end time
   │  ├─ Description
   │  ├─ Attendees (names, emails)
   │  ├─ Location
   │  ├─ Video conference link (if Zoom/Teams)
   │  └─ Calendar color
   │
   └─ Database:
      └─ Store in meetings table with:
         - source: 'google_calendar'
         - external_id: google_event_id
         - sync_timestamp
         - last_updated

MICROSOFT OUTLOOK CONNECTION:

Connection Flow:
1. User clicks "Connect with Microsoft"
2. OAuth popup opens (Microsoft authorization)
3. User grants permissions:
   - Calendars.Read
   - Calendars.Read.Shared
   - Calendars.ReadWrite
4. System receives access token
5. Same flow as Google

Similar configuration to Google Calendar
```

## 2.4 Integration Details - CRM (HubSpot & Salesforce)

```
HUBSPOT CONNECTION:

Connection Flow:
1. User clicks "Connect with HubSpot"
2. OAuth popup opens (HubSpot authorization)
3. User selects HubSpot account
4. Authorize API access (scopes):
   - contacts (read/write)
   - companies (read/write)
   - deals (read/write)
   - engagements (create/read)
   - engagement_notes (create/read)
   - crm.objects.contacts (write)
5. System receives refresh token & access token
6. Stores encrypted tokens in DB
7. Initiates full sync
8. Shows mapping/configuration page

Field Mapping:
├─ Accounts → Companies
│  ├─ Account.name → Company.name
│  ├─ Account.industry → Company.industry
│  ├─ Account.website → Company.website
│  └─ Account.headquarters → Company.location
│
├─ Contacts → Contacts
│  ├─ Contact.name → Contact.firstname + lastname
│  ├─ Contact.email → Contact.email
│  ├─ Contact.phone → Contact.phone
│  └─ Contact.title → Contact.jobtitle
│
├─ Deals → Deals
│  ├─ Deal.name → Deal.dealname
│  ├─ Deal.value → Deal.amount
│  ├─ Deal.stage → Deal.dealstage
│  └─ Deal.expected_close_date → Deal.closedate
│
└─ Activities (from calls):
   ├─ Create engagement with type 'CALL'
   ├─ Associate with:
   │  ├─ Contact (call participant)
   │  ├─ Company (account)
   │  └─ Deal (if applicable)
   ├─ Add engagement_note (transcript summary)
   └─ Update deal stage (if needed)

Real-time Sync:
├─ Webhook listener for HubSpot events
├─ Listen for:
│  ├─ contact.propertyChange
│  ├─ company.propertyChange
│  ├─ deal.propertyChange
│  └─ Pull full object every 5 minutes (safety)
│
└─ On our end:
   ├─ New call completed
   ├─ AI generates summary & sentiment
   ├─ Create engagement in HubSpot
   ├─ Log call duration & quality score
   ├─ Push sentiment to custom field
   └─ Update deal stage if applicable

SALESFORCE CONNECTION:

Connection Flow:
1. User clicks "Connect with Salesforce"
2. OAuth popup opens (Salesforce authorization)
3. User selects Salesforce instance (Production/Sandbox)
4. Authorize API access (OAuth scopes):
   - api
   - refresh_token
   - web
   - chatter_api
   - custom_permissions
5. System receives auth token
6. Stores encrypted token in DB
7. Tests connection (query small dataset)
8. Shows field mapping page

Field Mapping:
├─ Accounts → Accounts (sobject)
│  ├─ Account.name → Account.Name
│  ├─ Account.industry → Account.Industry
│  ├─ Account.revenue → Account.AnnualRevenue
│  └─ Account.custom_health → Account.Health__c (custom)
│
├─ Contacts → Contacts (sobject)
│  ├─ Contact.name → Contact.Name (FirstName + LastName)
│  ├─ Contact.email → Contact.Email
│  ├─ Contact.phone → Contact.Phone
│  └─ Contact.title → Contact.Title
│
├─ Deals → Opportunities (sobject)
│  ├─ Deal.name → Opportunity.Name
│  ├─ Deal.value → Opportunity.Amount
│  ├─ Deal.stage → Opportunity.StageName
│  └─ Deal.close_date → Opportunity.CloseDate
│
└─ Activities:
   ├─ Create Task or Event in Salesforce
   ├─ Link to:
   │  ├─ WhoId: Contact ID (meeting with contact)
   │  ├─ WhatId: Opportunity/Account ID
   │  └─ ActivityDate: Call date
   ├─ Store:
   │  ├─ Subject: "Call - call.meeting_title"
   │  ├─ Description: Call summary from AI
   │  ├─ Duration: call.duration_seconds
   │  └─ Custom field: call.quality_score
   │
   └─ Create TaskIf it includes a follow-up
      ├─ Subject: "Follow-up: [topic]"
      ├─ DueDate: [from call analysis]
      └─ OwnerId: Call rep's Salesforce user ID

Real-time Sync:
├─ Batch sync every 5 minutes (Salesforce API best practice)
├─ Change detection:
│  ├─ Query updated records since last sync
│  ├─ Pull only changed fields
│  └─ Update our database
│
├─ Push on our side:
│  ├─ After call completed
│  ├─ Generate AI summary
│  ├─ Create Activity record in SF
│  ├─ Update Opportunity (if stage changed)
│  └─ Link to Account & Contact
│
└─ Error handling:
   ├─ Rate limit exceeded → queue for next batch
   ├─ Field not found → log & skip
   ├─ Connection failed → notification to admin
   └─ Keep local copy until synced

Sync Status Display:
├─ Last sync: {timestamp}
├─ Objects synced:
│  ├─ Accounts: 150 records
│  ├─ Contacts: 450 records
│  ├─ Opportunities: 80 records
│  └─ Activities: 45 created this month
│
├─ Sync frequency options:
│  ├─ Real-time (with 5 min batches)
│  ├─ Every 5 minutes
│  ├─ Every 15 minutes
│  ├─ Every hour
│  └─ Manual only
│
└─ Checkboxes:
   ├─ ☑ Sync Accounts
   ├─ ☑ Sync Contacts
   ├─ ☑ Sync Opportunities
   ├─ ☑ Create activities from calls
   ├─ ☑ Update Opportunity stage from sentiment
   ├─ □ Update Opportunity next step field
   ├─ □ Create tasks from follow-up items
   └─ □ Update contact record types
```

## 2.5 Database Schema for Integrations

```sql
Table: integrations
├─ id (PK) UUID
├─ organization_id (FK)
├─ integration_type VARCHAR (google_calendar, hubspot, salesforce, etc)
├─ display_name VARCHAR (Google Calendar, HubSpot, Salesforce)
├─ status VARCHAR (connected, failed, pending, inactive)
├─ connection_config JSONB (encrypted)
│  ├─ access_token (encrypted)
│  ├─ refresh_token (encrypted)
│  ├─ instance_url (for SFDC)
│  ├─ hubspot_portal_id
│  └─ expires_at
│
├─ sync_config JSONB
│  ├─ sync_frequency (every_5_min, every_hour, manual)
│  ├─ enabled_objects (which entities to sync)
│  ├─ field_mappings (custom field mappings)
│  ├─ last_sync_at TIMESTAMPTZ
│  ├─ last_error_message VARCHAR
│  └─ is_test_connection_ok BOOLEAN
│
├─ permissions JSONB (array of required scopes)
├─ created_at TIMESTAMPTZ
├─ updated_at TIMESTAMPTZ
├─ connected_by (FK to users)
├─ connected_at TIMESTAMPTZ
├─ last_tested_at TIMESTAMPTZ
└─ INDEXES: (organization_id, integration_type)

Table: integration_sync_logs
├─ id (PK) UUID
├─ integration_id (FK)
├─ sync_type VARCHAR (full, incremental, fetch, push)
├─ direction VARCHAR (inbound, outbound, both)
├─ status VARCHAR (success, failed, partial, in_progress)
├─ records_synced INT
├─ records_created INT
├─ records_updated INT
├─ records_deleted INT
├─ errors JSONB (array of error objects)
├─ started_at TIMESTAMPTZ
├─ completed_at TIMESTAMPTZ
├─ duration_ms INT
└─ INDEXES: (integration_id, started_at DESC)

Table: integration_field_mappings
├─ id (PK) UUID
├─ integration_id (FK)
├─ source_entity VARCHAR (account, contact, deal, etc)
├─ source_field VARCHAR
├─ target_entity VARCHAR (Company, Contact, Opportunity, etc)
├─ target_field VARCHAR
├─ transformation_rule JSONB (if complex mapping)
├─ is_bidirectional BOOLEAN
├─ priority INT
└─ INDEXES: (integration_id, source_entity)

Table: api_keys
├─ id (PK) UUID
├─ organization_id (FK)
├─ name VARCHAR (e.g., "Production API Key")
├─ key_hash VARCHAR (bcrypt hashed)
├─ environment VARCHAR (production, sandbox)
├─ is_active BOOLEAN
├─ permissions JSONB (array of scopes)
├─ last_used_at TIMESTAMPTZ
├─ rate_limit INT (requests per minute)
├─ created_by (FK to users)
├─ created_at TIMESTAMPTZ
├─ expires_at TIMESTAMPTZ (nullable - no expiration if null)
└─ INDEXES: (organization_id, key_hash, is_active)

Table: api_usage
├─ id (PK) UUID
├─ api_key_id (FK)
├─ organization_id (FK)
├─ endpoint VARCHAR
├─ method VARCHAR (GET, POST, PUT, PATCH, DELETE)
├─ status_code INT
├─ response_time_ms INT
├─ timestamp TIMESTAMPTZ
├─ user_id (FK, nullable - for logging)
└─ INDEXES: (api_key_id, timestamp DESC), (organization_id, timestamp DESC)

Table: webhooks
├─ id (PK) UUID
├─ organization_id (FK)
├─ integration_id (FK, nullable - for integration-specific webhooks)
├─ url VARCHAR (encrypted)
├─ event_types JSONB (array of events: ['meeting.completed', 'deal.updated'])
├─ is_active BOOLEAN
├─ secret_key VARCHAR (for signature verification, encrypted)
├─ last_triggered_at TIMESTAMPTZ
├─ failed_attempts INT (for retry logic)
├─ created_at TIMESTAMPTZ
├─ updated_at TIMESTAMPTZ
└─ INDEXES: (organization_id, is_active)

Table: webhook_logs
├─ id (PK) UUID
├─ webhook_id (FK)
├─ event_type VARCHAR
├─ payload JSONB (encrypted if sensitive)
├─ response_status_code INT
├─ response_body TEXT
├─ retry_count INT
├─ sent_at TIMESTAMPTZ
├─ delivered_at TIMESTAMPTZ
├─ error_message VARCHAR
└─ INDEXES: (webhook_id, sent_at DESC)
```

## 2.6 Integrations Page Features & Interactions

```
MAIN FEATURES:

1. Active Tab View
   ├─ Show only connected integrations
   ├─ Display status as CONNECTED (green)
   ├─ Show last sync time & frequency
   ├─ Enable test connection & disconnect buttons
   └─ List any sync issues/errors

2. Inactive Tab View
   ├─ Show only not-connected integrations
   ├─ Display status as "NOT CONNECTED" (gray)
   ├─ Show "Connect with [Service]" buttons
   ├─ Display permissions needed
   └─ Show feature preview

3. All Tab View
   ├─ Show all integrations (connected & not)
   ├─ Filter/search capability
   └─ Sortable by status, last sync, etc.

ACTIONS:

Connect Button:
├─ On click: Redirect to OAuth flow
├─ Show authorization popup
├─ After auth: Display success message
├─ Automatically start initial full sync
└─ Display new sync status

Edit Connection:
├─ Change sync frequency
├─ Select which objects to sync
├─ Modify field mappings
├─ Update permissions
└─ Save changes

Test Connection:
├─ Ping integration API
├─ Verify access token is still valid
├─ Show result: "Connection OK ✓" or error
├─ Log test attempt
└─ Auto-fix if token refresh needed

Sync Now:
├─ Manually trigger sync (not waiting for scheduled)
├─ Show progress bar while syncing
├─ Display sync results:
│  ├─ Records created/updated/deleted
│  ├─ Any errors encountered
│  └─ Time taken
└─ Update "Last synced" timestamp

Disconnect:
├─ Show confirmation dialog:
│  ├─ "Are you sure? This will stop syncing."
│  ├─ "All connected data will remain in place"
│  └─ [Cancel] [Disconnect] buttons
│
├─ On confirm:
│  ├─ Revoke access token with service
│  ├─ Mark integration as disconnected in DB
│  ├─ Clear sync config
│  ├─ Keep historical sync logs
│  └─ Show "Integration disconnected" message

View Logs:
├─ Open modal showing sync logs
├─ Filter by:
│  ├─ Date range
│  ├─ Sync type (full, incremental)
│  ├─ Status (success, failed)
│  └─ Direction (inbound, outbound)
│
├─ For each log entry show:
│  ├─ Timestamp
│  ├─ Sync type & direction
│  ├─ Status + result count
│  ├─ Duration
│  └─ Any error messages

Repair Sync:
├─ For Salesforce if fields changed
├─ Re-fetch object structure from SF
├─ Re-map fields automatically
├─ Test connection to verify
└─ Resume syncing
```

## 2.7 API Integration Examples

```python
# EXAMPLE: POST Call to HubSpot on meeting completion

POST /hubspot/create-engagement
├─ Body:
│  {
│    "meeting_id": "uuid",
│    "contact_id": "hubspot_contact_id",
│    "company_id": "hubspot_company_id",
│    "deal_id": "hubspot_deal_id",  # optional
│
│    "engagement": {
│      "type": "CALL",
│      "timestamp": 1708873200000,  # unix ms
│      "duration_ms": 1732000,
│      "notes": "Call summary from AI",
│      "body": "Full transcript or summary"
│    },
│
│    "field_updates": {
│      "sentiment": "positive",  # custom field
│      "quality_score": 85,      # custom field
│      "topics": ["Pricing", "Implementation"],
│      "next_step": "Send proposal"
│    },
│
│    "deal_updates": {
│      "dealstage": "negotiation",  # if changed
│      "amount_updated": false
│    }
│  }
│
├─ Response (200 OK):
│  {
│    "engagement_id": "hubspot_engagement_id",
│    "created": true,
│    "created_at": "2026-02-25T14:30:00Z",
│    "deal_stage_updated": false
│  }
│
└─ Retry on 429 (rate limit)

# EXAMPLE: GET Salesforce Opportunities since last sync

GET /salesforce/query
├─ Params:
│  ├─ query: "SELECT Id, Name, Amount, StageName FROM Opportunity WHERE LastModifiedDate > 2026-02-25T14:00:00Z"
│  └─ limit: 1000
│
├─ Authentication:
│  ├─ use: OAuth token (auto-refresh if expired)
│  └─ instance_url: https://na14.salesforce.com
│
├─ Response (200 OK):
│  {
│    "records": [
│      {
│        "Id": "0064100001...",
│        "Name": "Enterprise License Deal",
│        "Amount": 250000,
│        "StageName": "Negotiation"
│      },
│      ...
│    ],
│    "totalSize": 42,
│    "done": true
│  }
│
└─ On success:
   ├─ Extract deals
   ├─ Update local database
   ├─ Store LastModifiedDate for next query
   ├─ Log sync completion
   └─ Mark as success in sync_logs

# EXAMPLE: Webhook - Incoming from HubSpot

POST /webhooks/hubspot/events
├─ Signature verified using: X-HubSpot-Request-Signature
├─ Payload:
│  {
│    "subscriptionType": "contact.propertyChange",
│    "portalId": 123456,
│    "occurredAt": 1708873200000,
│    "changes": [
│      {
│        "propertyName": "email",
│        "propertyValue": "john.doe@acmecorp.com",
│        "changeSource": "CRM_UI",
│        "changeSourceId": null,
│        "changedByUser": null,
│        "timestamp": 1708873200000
│      }
│    ],
│    "portal": {
│      "portalId": 123456
│    },
│    "object": {
│      "id": 456,
│      "portalId": 123456
│    }
│  }
│
├─ On receive:
│  ├─ Verify signature
│  ├─ Parse event type
│  ├─ Fetch full object from HubSpot (not just delta)
│  └─ Update local database
│
└─ Response (200 OK): {}
```

---

# SECTION 3: INTEGRATION WITH SETUP PANEL

## 3.1 Complete User Flow

```
SETUP PANEL → INTEGRATIONS PAGE FLOW:

1. USER VIEWS SETUP PANEL
   └─ Panel shows 7 setup items
      ├─ Connect Calendar (NOT COMPLETED)
      ├─ Connect CRM (NOT COMPLETED)
      └─ ... 5 more items

2. USER CLICKS "Connect Calendar"
   ├─ Navigate to: /settings/integrations
   ├─ Load Integrations Page
   └─ Scroll to: SECTION 1 - CALENDAR INTEGRATIONS
      ├─ Page opens with Calendar section visible
      ├─ Google Calendar card visible
      └─ User can see "Connect with Google" button

3. USER CLICKS "Connect with Google"
   ├─ OAuth popup opens
   ├─ User authorizes
   ├─ System receives token
   ├─ Full sync starts
   ├─ Success message displayed
   └─ After sync completes:
      ├─ Status updates to CONNECTED (green)
      ├─ Dashboard redirects or stays on settings
      └─ Setup Panel item #1 marked as COMPLETED ✓

4. USER CLICKS "Connect CRM"
   ├─ Navigate to: /settings/integrations
   ├─ Load Integrations Page
   └─ Scroll to: SECTION 2 - CRM INTEGRATIONS
      ├─ Show HubSpot and Salesforce options
      ├─ User selects HubSpot
      └─ Shows "Connect with HubSpot" button

5. USER COMPLETES INTEGRATION
   ├─ After authorization:
   ├─ Setup Panel automatically updates
   ├─ Item #2 marked as COMPLETED ✓
   ├─ Progress bar advances
   └─ "2 of 7 completed" - 28%

ONGOING SYNC:
├─ Every 5-15 minutes (based on config)
├─ Check for new records in CRM
├─ Push call data to CRM
├─ Update meeting/activity records
└─ Error handling & retry logic
```

## 3.2 Navigation Between Pages

```
From Setup Panel:
├─ Click item with path
├─ Call: navigate(item.path)
├─ Options:
│  ├─ /settings/integrations (Calendar & CRM)
│  ├─ /settings/templates (Notes Template)
│  ├─ /settings/scorecards (Scorecards)
│  ├─ /settings/smart-topics (Trackers)
│  ├─ /settings/members (Team)
│  └─ /settings/automations (Routing Rules)
│
└─ Panel remains visible on right side

From Integrations Page:
├─ Can view all integration sections
├─ Each section is clickable/expandable
├─ Connect buttons are always visible
├─ After connecting:
│  ├─ Stay on page or redirect to dashboard
│  ├─ Show success toast notification
│  ├─ Update item status in Setup Panel
│  └─ Auto-scroll to newly connected integration
│
└─ User can manually sync or edit

Back Navigation:
├─ Breadcrumb: Settings / Integrations
├─ Back button: [<] Returns to Settings page
├─ Or navigate to dashboard
├─ Setup Panel remains refreshed
```

---

**END OF ACCOUNT SETUP & INTEGRATIONS DOCUMENTATION**

✅ Account Setup Progress panel fully documented
✅ All 7 checklist items detailed
✅ Complete Integrations page design (new page)
✅ Calendar, CRM, Email, Slack, API integrations
✅ Database schema for integrations & sync
✅ Real-time sync flows for HubSpot & Salesforce
✅ Navigation flows from Setup Panel to Integrations
✅ Webhook handling & API examples
