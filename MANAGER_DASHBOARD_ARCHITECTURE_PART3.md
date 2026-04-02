# Manager Dashboard - Complete Architecture
## PART 3: UI COMPONENTS, INTEGRATIONS & REFERENCE MATERIALS

---

# TABLE OF CONTENTS

## Quick Navigation
- [UI Component Library](#section-1-ui-component-library)
- [Reusable Component Patterns](#section-2-reusable-component-patterns)
- [Integration with Admin Dashboard](#section-3-integration-with-admin-dashboard)
- [Real-Time Data & Notifications](#section-4-real-time-notifications)
- [Export & Reporting Features](#section-5-export--reporting-features)
- [Mobile App Considerations](#section-6-mobile-app-specific-features)
- [Accessibility & Compliance](#section-7-accessibility-wcag-compliance)
- [Performance Benchmarks](#section-8-performance-benchmarks--slas)
- [Testing Strategy](#section-9-testing-strategy)
- [Deployment Checklist](#section-10-deployment--launch-checklist)

---

## SECTION 1: UI COMPONENT LIBRARY

**1.1 Core Components Breakdown**

```
MANAGER DASHBOARD UI COMPONENTS INVENTORY:

METRIC CARD COMPONENT:
├─ Props: title, value, unit, trend(↑/↓/→), trendPercent, benchmark, color
├─ Display: Title | Big Number | Unit | Trend Indicator | Benchmark Comparison
├─ States: Default, Loading, Error, Hover (shows tooltip)
├─ Example: <MetricCard title="Team Revenue" value={834} unit="K" trend="↑" 
│           trendPercent={12} benchmark={900} />
├─ Files: src/app/components/MetricCard.tsx
└─ Used on: Dashboard (4x), Performance page (3x), Forecast (2x)

LEADERBOARD TABLE COMPONENT:
├─ Props: data[], columns[], sortable, filterable, paginated, expandable
├─ Features:
│  ├─ Column sorting (click header)
│  ├─ Row filtering (dropdown)
│  ├─ Pagination (5, 10, 20, 50 per page)
│  ├─ Row expansion (click row for detail panel)
│  ├─ Search (global search across all columns)
│  ├─ Bulk actions (select multiple rows, export, etc.)
│  └─ Color coding (status: red/yellow/green)
├─ Files: src/app/components/LeaderboardTable.tsx
└─ Used on: Performance page (main table), Leaderboard (6/12 components)

KANBAN BOARD COMPONENT:
├─ Props: stages[], deals[], onDragEnd(source, dest, deal)
├─ Features:
│  ├─ Drag-drop deal cards between stages
│  ├─ Stage summary (value + count)
│  ├─ Deal card display (quick info)
│  ├─ Stage totals calculation
│  ├─ Add deal button per stage
│  ├─ Filter & search functionality
│  └─ Responsive on mobile (swipe instead of drag)
├─ Library: React DnD or react-beautiful-dnd
├─ Files: src/app/components/KanbanBoard.tsx
└─ Used on: Pipeline page (main component)

CHART COMPONENT (LINE, BAR, PIE):
├─ Library: Recharts or Chart.js
├─ Props: data[], xAxis, yAxis, series[], colors, responsive
├─ Features:
│  ├─ Responsive sizing
│  ├─ Hover tooltips
│  ├─ Download as PNG/SVG
│  ├─ Export data as CSV
│  ├─ Legend & axis labels
│  ├─ Responsive on mobile
│  └─ Accessibility (alt text, keyboard nav)
├─ Variants:
│  ├─ LineChart (Forecast timeline, trends)
│  ├─ BarChart (Stage comparison, metrics)
│  ├─ PieChart (Pipeline composition)
│  └─ AreaChart (Cumulative metrics)
├─ Files: src/app/components/charts/
└─ Used on: Forecast, Performance, Dashboard (multiple)

MODAL DIALOG COMPONENT:
├─ Props: title, children, onClose(), size, backdrop
├─ Features:
│  ├─ Keyboard close (ESC key)
│  ├─ Click outside to close
│  ├─ Fixed height content with scroll
│  ├─ Footer with action buttons
│  ├─ Loading state
│  └─ Confirmation dialogs
├─ Variants:
│  ├─ CoachingSessionModal (Form to schedule coaching)
│  ├─ DealEditorModal (Edit deal details)
│  ├─ ConfirmationModal (Delete/Archive confirmation)
│  └─ ExportModal (Export options)
├─ Files: src/app/components/modals/
└─ Used on: All pages (multiple instances)

FORM COMPONENTS:
├─ InputField (text, email, number)
│  ├─ Props: label, placeholder, value, onChange, error, required
│  ├─ Features: Validation on blur, error message display
│  └─ Files: src/app/components/forms/InputField.tsx
│
├─ SelectField (dropdown)
│  ├─ Props: label, options[], value, onChange, multi-select
│  ├─ Features: Search in dropdown, custom options
│  └─ Files: src/app/components/forms/SelectField.tsx
│
├─ DatePicker
│  ├─ Props: selectedDate, onDateChange, range mode
│  ├─ Library: react-datepicker or date-fns
│  └─ Files: src/app/components/forms/DatePicker.tsx
│
├─ TextArea (multi-line text)
│  ├─ Props: label, value, onChange, rows, maxLength
│  └─ Files: src/app/components/forms/TextArea.tsx
│
└─ FormGroup (wrapper for form sections)
   ├─ Props: title, children, required
   └─ Files: src/app/components/forms/FormGroup.tsx

ALERT/BADGE COMPONENT:
├─ Alert variants:
│  ├─ Success (green): "Operation completed"
│  ├─ Warning (yellow): "This deal is overdue"
│  ├─ Error (red): "Failed to load data"
│  └─ Info (blue): "Forecast updated 2 hours ago"
├─ Badge variants:
│  ├─ Status badges: "Top Performer", "Needs Coaching", "On Track"
│  ├─ Priority badges: "Critical", "High", "Medium", "Low"
│  └─ Stage badges: "Prospecting", "Proposal", "Negotiation"
├─ Files: src/app/components/Alert.tsx, src/app/components/Badge.tsx
└─ Used on: All pages (multiple)

BUTTON COMPONENTS:
├─ Button variants:
│  ├─ Primary (Blue): Main actions, CTAs
│  ├─ Secondary (Gray): Alternative actions
│  ├─ Danger (Red): Delete, Archive
│  ├─ Ghost (Outline): Less prominent
│  └─ Icon Button: For small icon-only buttons
├─ Sizes: Small, Medium, Large
├─ States: Default, Hover, Active, Disabled, Loading
├─ Files: src/app/components/Button.tsx
└─ Used on: All pages (navigation, actions)

CARD COMPONENT:
├─ Props: title, children, footer, hover, clickable, className
├─ Features:
│  ├─ Border & shadow styling
│  ├─ Title/header section
│  ├─ Content area (flexible)
│  ├─ Footer section (for actions)
│  ├─ Hover state (slight lift, shadow increase)
│  └─ Click handler for card selection
├─ Files: src/app/components/Card.tsx
└─ Used on: All pages (summary cards, detail cards)

AVATAR & INITIALS COMPONENT:
├─ Props: name, initials, image, size, color
├─ Features:
│  ├─ Use image if available
│  ├─ Fallback to initials
│  ├─ Color background based on name hash
│  ├─ Tooltip on hover (full name)
│  └─ Click to view profile
├─ Files: src/app/components/Avatar.tsx
└─ Used on: Team Performance, Deal Cards, Coaches, Notes

EMPTY STATE COMPONENT:
├─ Props: icon, title, description, actionButton
├─ Display: Large icon | Title | Description | CTA button
├─ Scenarios:
│  ├─ No calls recorded yet
│  ├─ No coaching sessions
│  ├─ No data available
│  ├─ Error loading data
│  └─ Search results empty
├─ Files: src/app/components/EmptyState.tsx
└─ Used on: All pages (data loading)

LOADING STATE COMPONENT:
├─ Props: loading, children (renders when false), type
├─ Types:
│  ├─ Spinner (rotating icon)
│  ├─ Skeleton (placeholder shapes)
│  ├─ Skeleton table (grid placeholder)
│  └─ Pulse (subtle background pulse)
├─ Files: src/app/components/LoadingState.tsx
└─ Used on: All pages (data fetching)

TOOLTIP COMPONENT:
├─ Props: content, position (top/bottom/left/right), delay
├─ Features:
│  ├─ Show on hover
│  ├─ Show on focus (keyboard)
│  ├─ Position smartly to avoid edge cutoff
│  ├─ Arrow pointing to trigger
│  └─ Accessible (ARIA labels)
├─ Files: src/app/components/Tooltip.tsx
└─ Used on: All pages (info icons, metrics)

BREADCRUMB COMPONENT:
├─ Props: items: [{name, path}]
├─ Display: Home / Dashboard / Performance / Taylor Brooks
├─ Features:
│  ├─ Clickable links
│  ├─ Active state on current
│  ├─ Separator between items
│  └─ Truncate if too long
├─ Files: src/app/components/Breadcrumb.tsx
└─ Used on: Child pages (Performance -> Rep -> Call Details)

PAGINATION COMPONENT:
├─ Props: currentPage, totalPages, onPageChange
├─ Display: [← Prev] [1 2 3 ...] [Next →]
├─ Features:
│  ├─ Show first/last buttons
│  ├─ Show ellipsis for gaps
│  ├─ Disable prev/next at boundaries
│  ├─ Jump to page input
│  └─ Items per page selector
├─ Files: src/app/components/Pagination.tsx
└─ Used on: Tables (Leaderboard, Deals)

FILTER BAR COMPONENT:
├─ Props: filters[], onFilterChange
├─ Features:
│  ├─ Multiple filter dropdowns
│  ├─ Date range picker
│  ├─ Search box
│  ├─ Clear all button
│  ├─ Save filter presets
│  └─ Show active filter count
├─ Files: src/app/components/FilterBar.tsx
└─ Used on: Performance, Pipeline, Forecast pages

SIDEBAR/NAVIGATION COMPONENT:
├─ Props: items[], activeItem, onItemClick
├─ Features:
│  ├─ Expandable/collapsible
│  ├─ Sub-menu support
│  ├─ Active state highlighting
│  ├─ Icons + labels
│  ├─ Responsive (hamburgermenu on mobile)
│  └─ Profile section at top/bottom
├─ Files: src/app/components/Sidebar.tsx
└─ Used on: All pages (main layout)

AUDIO PLAYER COMPONENT:
├─ Props: audioUrl, title, duration, onPlay, onPause
├─ Features:
│  ├─ Play/pause buttons
│  ├─ Progress scrubber bar
│  ├─ Time display (current/total)
│  ├─ Volume control
│  ├─ Playback speed (0.75x, 1x, 1.25x, 1.5x)
│  ├─ Download button
│  └─ Share button
├─ Files: src/app/components/AudioPlayer.tsx
└─ Used on: Call Details page

TRANSCRIPT VIEWER COMPONENT:
├─ Props: transcript, mode (full | timestamped), searchTerm
├─ Features:
│  ├─ Display full text or timestamped
│  ├─ Search highlight
│  ├─ Speaker color coding
│  ├─ Click timestamp to jump in audio
│  ├─ Copy button (full or selected)
│  ├─ Download transcript
│  ├─ Print transcript
│  └─ Export to Word/PDF
├─ Files: src/app/components/TranscriptViewer.tsx
└─ Used on: Call Details page

DEAL STATUS INDICATOR COMPONENT:
├─ Variants:
│  ├─ On Track (Green)
│  ├─ At Risk (Yellow)
│  ├─ Critical Risk (Red)
│  ├─ Closed Won (Blue)
│  ├─ Closed Lost (Dark Gray)
│  └─ On Hold (Light Gray)
├─ Props: stage, probabilityPercentage, daysOverdue
├─ Display: Colored dot + status text + reason
├─ Files: src/app/components/DealStatusIndicator.tsx
└─ Used on: Pipeline page, Forecast page
```

---

## SECTION 2: REUSABLE COMPONENT PATTERNS

**2.1 Component Type Definitions (TypeScript)**

```typescript
// Metric Card
interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  trendPercent?: number;
  benchmark?: number;
  color?: 'success' | 'warning' | 'error' | 'info';
}

// Leaderboard Table
interface LeaderboardTableProps {
  data: Rep[];
  columns: Column[];
  sortable?: boolean;
  filterable?: boolean;
  expandable?: boolean;
  onRowClick?: (rep: Rep) => void;
  loading?: boolean;
}

interface Column {
  key: string;
  label: string;
  width?: string;
  sortKey?: string;
  render?: (value: any, row: Rep) => React.ReactNode;
}

// Kanban Board
interface KanbanBoardProps {
  stages: Stage[];
  deals: Deal[];
  onDragEnd: (source: Stage, dest: Stage, deal: Deal) => void;
  onDealClick?: (deal: Deal) => void;
}

interface Stage {
  id: string;
  name: string;
  deals: Deal[];
  total?: number;
}

// Chart
interface ChartProps {
  data: ChartDataPoint[];
  xAxis?: string;
  yAxis?: string;
  series: SeriesConfig[];
  type: 'line' | 'bar' | 'pie' | 'area';
  colors?: string[];
  responsive?: boolean;
  onDataPointClick?: (data: ChartDataPoint) => void;
}

interface ChartDataPoint {
  [key: string]: any;
}

// Form Input
interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'number' | 'password' | 'date';
  disabled?: boolean;
}

// Modal
interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  footer?: React.ReactNode;
  backdrop?: boolean;
}

// Button
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}
```

**2.2 Component State Management Pattern**

```tsx
// Example: Team Performance Page Component
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export function ManagerPerformance() {
  // UI State
  const [sortBy, setSortBy] = useState('revenue_desc');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRepId, setExpandedRepId] = useState<string | null>(null);

  // Data Fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ['team-performance', sortBy, filterBy, currentPage],
    queryFn: () => fetchTeamPerformance({ sortBy, filterBy, page: currentPage }),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Handlers
  const handleRowExpand = (repId: string) => {
    setExpandedRepId(expandedRepId === repId ? null : repId);
  };

  const handleSort = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page
  };

  const handleFilter = (newFilter: string) => {
    setFilterBy(newFilter);
    setCurrentPage(1); // Reset to first page
  };

  // Render
  return (
    <div className="p-6">
      <FilterBar 
        sortBy={sortBy} 
        filterBy={filterBy} 
        onSortChange={handleSort}
        onFilterChange={handleFilter}
      />
      
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} />}
      {data && (
        <>
          <LeaderboardTable
            data={data.reps}
            expandable={true}
            expandedRowId={expandedRepId}
            onRowClick={handleRowExpand}
          />
          
          <Pagination 
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
```

---

## SECTION 3: INTEGRATION WITH ADMIN DASHBOARD

**3.1 Data Sharing Between Dashboards**

```
ADMIN DASHBOARD ←→ MANAGER DASHBOARD Data Flow:

1. ORGANIZATION DATA (READ-ONLY from Manager)
   ├─ Admin Dashboard: Displays org-wide KPIs
   ├─ Manager Dashboard: Depends on org settings, targets, periods
   └─ Data: Organizations table, Settings
   
2. TEAM DATA (READ-WRITE in both)
   ├─ Admin views: All teams+managers
   ├─ Manager views: Own team only
   ├─ Data: team_performance_metrics, user_performance_metrics
   └─ If manager updates: Updates reflected in admin reports

3. REP DATA (READ-WRITE in both)
   ├─ Admin views: All reps across org
   ├─ Manager views: Only direct reports
   ├─ Data: users, deals, meetings tables
   └─ Both can create/update (with RLS enforcement)

4. COACHING DATA (READ-WRITE, mostly manager)
   ├─ Manager creates coaching records
   ├─ Admin views aggregates (coaching volume metrics)
   ├─ Data: coaching_sessions, coaching_recommendations
   └─ Cross-reference: coaching metrics appear in admin reports

5. CALL DATA (READ-ONLY primarily)
   ├─ Stored centrally: meetings, transcripts tables
   ├─ Both dashboards read same data
   ├─ Manager adds notes to calls: call_coaching_notes
   └─ Admin aggregates for org-wide insights

QUERY FILTERING IMPLEMENTATION:
├─ Manager queries automatically filtered to: manager_id = current_user_id
├─ Admin queries: No filter (full data access)
├─ Implementation: Middleware enforces row-level security
└─ Database: RLS policies prevent cross-access

CACHE INVALIDATION PATTERN:
├─ When Manager updates coaching: Invalidate manager's query cache
├─ When any data updates: May affect admin aggregates
├─ Use: React Query invalidation on mutations
└─ Sub-cache cleanup: 5 minute TTL automatically refreshes
```

**3.2 Shared Utilities & Formatters**

```typescript
// src/app/lib/formatters.ts
export const formatCurrency = (value: number): string => 
  `$${(value / 1000).toFixed(1)}K`; // $125K

export const formatPercentage = (value: number, decimals = 1): string => 
  `${value.toFixed(decimals)}%`;

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatDate = (date: Date): string => 
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const getTrendColor = (trend: 'up' | 'down' | 'stable'): string => ({
  'up': 'text-green-600',
  'down': 'text-red-600',
  'stable': 'text-gray-600',
}[trend]);

export const getStatusColor = (status: string): string => ({
  'top_performer': 'bg-green-100 text-green-800',
  'on_track': 'bg-yellow-100 text-yellow-800',
  'needs_coaching': 'bg-red-100 text-red-800',
  'critical': 'bg-red-500 text-white',
}[status] || 'bg-gray-100 text-gray-800');

// src/app/lib/api-client.ts
export const apiClient = {
  // Endpoints automatically include manager_id if manager role
  get: async (endpoint: string, params?: object) => {
    const url = new URL(`${API_BASE}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },

  post: async (endpoint: string, data: object) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Note: DELETE/PUT operations use same pattern
};
```

---

## SECTION 4: REAL-TIME NOTIFICATIONS

**4.1 Notification System**

```
NOTIFICATION TYPES:

1. DEAL ALERTS
   ├─ Deal moved to new stage
   ├─ Deal becomes overdue
   ├─ Deal at critical risk
   ├─ Deal probability adjusted
   └─ Deal won / lost

2. REP PERFORMANCE ALERTS
   ├─ Rep attainment drops below threshold
   ├─ Rep achieves top performer status
   ├─ Rep needs coaching (skill gap detected)
   ├─ Rep AI score drops
   └─ Rep hasn't logged activity (X days)

3. ACTIVITY ALERTS
   ├─ Call recorded & analyzed (AI insights ready)
   ├─ Coaching session scheduled
   ├─ Coaching session completed
   ├─ Forecast updated
   └─ Report ready for download

4. ADMINISTRATIVE ALERTS
   ├─ New team member added
   ├─ Permission changes
   ├─ Data sync issue
   └─ System maintenance scheduled

NOTIFICATION CHANNELS:

├─ In-App Bell Icon (Real-time, persistent)
│  ├─ Badge showing unread count
│  ├─ Dropdown showing recent 5 notifications
│  ├─ "View All" link to full notification center
│  └─ Click notification to navigate to related page
│
├─ Email Digests (Daily or Weekly)
│  ├─ Daily summary: Key metrics, alerts, deals
│  ├─ Weekly report: Team performance, coaching progress
│  └─ Configurable: Manager can set frequency/content
│
├─ Push Notifications (Mobile App)
│  ├─ Critical alerts (deal at risk, call ready)
│  ├─ Performance milestones (rep hits 100%)
│  └─ Activity reminders (coaching session in 1 hour)
│
└─ Dashboard Alert Banner (Top of page)
   ├─ Show top priority alert
   ├─ Dismiss option
   └─ Link to notification center

IMPLEMENTATION (WebSocket + Server Events):

Frontend:
├─ Connect WebSocket on page load
├─ Listen for notification events
├─ Update notification state (React Context)
├─ Play sound (if enabled) for critical alerts
└─ Show toast notification for important alerts

Backend:
├─ Trigger notification on data changes (deal update, coaching, etc.)
├─ Broadcast to manager's WebSocket connection
├─ Store in notifications table for history
├─ Send email based on frequency settings
└─ Track read/unread status
```

**4.2 Real-Time Data Updates**

```
LIVE DATA UPDATES:

1. DASHBOARD KPI CARDS
   ├─ Update frequency: Every 5 minutes or on-demand
   ├─ Method: WebSocket subscription + polling fallback
   ├─ Show "Last updated: 2 mins ago" timestamp
   └─ User can click "Refresh Now" for immediate update

2. TEAM PERFORMANCE TABLE
   ├─ Update frequency: Every 10 minutes
   ├─ Method: Full re-fetch or partial update
   ├─ Smooth transition (no jarring refresh)
   ├─ Maintain user's sort/filter
   └─ Highlight rows that changed

3. PIPELINE DEALS
   ├─ Update frequency: Real-time (when deal status changes)
   ├─ Method: WebSocket event + optimistic UI update
   ├─ Animate deal card when it moves stages
   ├─ Show "Updated X seconds ago" indicator
   └─ Allow user to undo recent changes

4. CALL QUALITY METRICS
   ├─ Update frequency: Real-time (when call completes)
   ├─ Method: WebSocket + push to refresh charts
   ├─ Re-calculate aggregates (team avg, etc.)
   └─ Show "New call recorded" badge

IMPLEMENTATION:
```typescript
// React Hook for Real-Time Data
export function useRealTimeData(endpoint: string, interval: number = 5000) {
  const [data, setData] = useState(null);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    // WebSocket connection
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.endpoint === endpoint) {
        setData(message.data);
        setIsStale(false);
      }
    };

    // Polling fallback
    const interval = setInterval(() => {
      setIsStale(true);
      fetchData(endpoint).then(setData);
    }, interval);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, [endpoint, interval]);

  return { data, isStale };
}
```

---

## SECTION 5: EXPORT & REPORTING FEATURES

**5.1 Export Options**

```
EXPORT TARGETS:

1. TEAM PERFORMANCE REPORT
   └─ Format options:
      ├─ CSV: Opens in Excel, full data, preserves formulas
      ├─ PDF: Formatted report with charts, professional layout
      ├─ Excel (.xlsx): Multiple sheets (summary, detail, charts)
      └─ Google Sheets: Published link, auto-syncing
   └─ Includes:
      ├─ Title, date, manager name
      ├─ Summary metrics (team KPIs)
      ├─ Rep-by-rep detailed table
      ├─ Embedded charts (revenue trend, attainment)
      ├─ Coaching insights
      └─ Sign-off section for manager

2. PIPELINE EXPORT
   └─ Format options:
      ├─ CSV: Flat deal list
      ├─ Excel: Deal list + stage summary + probability analysis
      └─ PDF: Kanban visualization + summary
   └─ Includes:
      ├─ Deal name, value, stage, days in stage
      ├─ Rep assigned, expected close date
      ├─ Probability & weighted value
      └─ Risk indicators & notes

3. FORECAST REPORT
   └─ Format options:
      ├─ Excel: Detailed forecast workbook
      ├─ PDF: Executive summary + detailed analysis
      └─ PowerPoint: Presentation deck with slides
   └─ Includes:
      ├─ Executive summary (1 page)
      ├─ Forecast vs target
      ├─ Pipeline analysis by stage
      ├─ Risk assessment
      ├─ Deals at risk details
      ├─ Charts & visualizations
      └─ Historical accuracy & assumptions

4. COACHING SUMMARY
   └─ Format options:
      ├─ CSV: Coaching log
      ├─ Excel: Coaching workbook
      └─ PDF: Coaching report
   └─ Includes:
      ├─ Rep, date, focus areas, outcomes
      ├─ Attendance status
      ├─ Progress tracking
      └─ Recommendations

5. CALL DETAILS/TRANSCRIPT
   └─ Format options:
      ├─ MP3: Audio file (download recording)
      ├─ PDF: Transcript + AI metrics
      ├─ DOCX: Full report with transcript, notes, recommendations
      └─ CSV: Metadata for analysis
   └─ Includes:
      ├─ Account name, rep, date/time
      ├─ Full or search-results transcript
      ├─ AI metrics (talk ratio, questions, etc.)
      ├─ Manager notes
      ├─ Coaching recommendations
      └─ Comparison to team average

SCHEDULING:
├─ One-time export (download immediately)
├─ Recurring export (Daily, Weekly, Monthly)
│  ├─ Delivered to email automatically
│  ├─ Stored in manager's dashboard for 90 days
│  └─ Customizable schedule & time
└─ Save template (for recurring exports)

PERMISSIONS:
├─ Manager can export own team data
├─ Manager can schedule auto-export
├─ Admin can export all data
└─ Export includes audit log (who exported, when)
```

---

## SECTION 6: MOBILE APP SPECIFIC FEATURES

**6.1 Mobile-Optimized Views**

```
MOBILE DASHBOARD:
├─ Primary card: Today's key metric (revenue/attainment/etc.)
├─ Quick action buttons: [Coach] [View Pipeline] [Add Deal] [Call Review]
├─ Team summary: 3-4 key metrics in horizontal scroll
├─ Top 5 reps card (swipeable)
├─ Pipeline snapshot (swipeable cards by stage)
├─ Recent calls (swipeable list)
└─ Navigation: Bottom tab bar (Dashboard | Performance | Pipeline | Coaching | Profile)

MOBILE PERFORMANCE TABLE:
├─ Card view (not table) - one rep per card
├─ Swipe left for more details/actions
├─ Card shows: Rep name | Status | Current attainment | Trend
├─ Tap to expand detail panel (full screen)
├─ Sorting: Tap column headers
├─ Filtering: Pinch to access filter drawer
└─ Search: Swipe down to reveal search

MOBILE PIPELINE:
├─ Stage tabs (swipeable)
├─ Deal cards in vertical scroll (not horizontal kanban)
├─ Tap deal card to expand details
├─ Swipe deal card left to move between stages
├─ Long-press deal for quick actions menu
├─ [+] FAB (Floating Action Button) to add deal
└─ Stage summary at top of each tab

MOBILE COACHING:
├─ Calendar view for coaching sessions
├─ Upcoming sessions: Large tap targets
├─ Tap session to view details
├─ [Schedule] button always visible
├─ Coaching history: Scrollable list
└─ Notes: Easy-to-edit text input

OFFLINE CAPABILITY:
├─ Cache recent data (dashboard, last 5 deals, calls)
├─ Show cached data when offline
├─ Queue actions when offline (coaching schedule, notes)
├─ Sync when reconnected
└─ Indicator: "Working offline" banner
```

**6.2 Mobile App Features (Native)**

```
ADDITIONAL NATIVE FEATURES:

1. CAMERA INTEGRATION
   ├─ Snap deal photo (whiteboard notes, contract, etc.)
   ├─ Auto-attach to deal in app
   └─ Send to rep or share

2. VOICE NOTES
   ├─ Record quick coaching notes (audio)
   ├─ Transcribe automatically
   ├─ Add to coaching session record
   └─ Share with rep

3. PUSH NOTIFICATIONS
   ├─ Real-time deal alerts
   ├─ Call ready for review notification
   ├─ Coaching session reminders
   ├─ Rep performance alerts (milestone reached, drop below 80%)
   └─ Custom notification settings

4. GEOLOCATION
   ├─ Track rep location during call
   ├─ See where deals/calls are happening (map view)
   └─ Privacy note: Only with explicit consent

5. HOME SCREEN WIDGET (iOS/Android)
   ├─ Show today's top metric (attainment %)
   ├─ Quick links to main features
   ├─ Updated in background
   └─ Tap to open app to that section

6. SIRI/VOICE ASSISTANT INTEGRATION
   ├─ "Hey Siri, what's my team's attainment?"
   ├─ "Show me overdue deals"
   ├─ "Schedule coaching with Taylor"
   └─ Voice commands for common actions

7. BIOMETRIC AUTHENTICATION
   ├─ Face ID / Touch ID login
   ├─ Fast access, enhanced security
   └─ Optional (users can use password)

8. SHARE EXTENSIONS
   ├─ Share email/attachment to app
   ├─ Create deal from shared content
   ├─ Add note from shared text
   └─ Auto-parse information (date, amount, etc.)
```

---

## SECTION 7: ACCESSIBILITY (WCAG COMPLIANCE)

**7.1 Accessibility Requirements**

```
WCAG 2.1 AA COMPLIANCE:

1. PERCEIVABLE
   ├─ Color not only indicator: Use icons + text for status
   ├─ Contrast ratio: 4.5:1 for normal text, 3:1 for large text
   ├─ Resizable text: Support browser zoom up to 200%
   ├─ Alternative text: All images have alt text, icons have aria-labels
   ├─ Transcripts: All calls have transcripts
   └─ Captions: All video content has captions

2. OPERABLE
   ├─ Keyboard navigation: All features accessible via Tab/Shift+Tab/Enter/Arrows
   ├─ No keyboard traps: Can tab out of any interactive element
   ├─ Sufficient time: No auto-redirects/forms with short timeouts
   ├─ Seizure prevention: No content flashes >3 times per second
   ├─ Navigable: Clear skip links, logical tab order
   └─ Motor control: Touch targets minimum 44x44 pixels

3. UNDERSTANDABLE
   ├─ Language: Clearly indicated language (lang="en")
   ├─ Predictable: Navigation consistent, links go where expected
   ├─ Input assistance: Form errors clearly explained, suggestions offered
   ├─ Reading level: Clear language, avoid jargon
   └─ Abbreviations: Expanded on first use

4. ROBUST
   ├─ Valid HTML: Pass W3C validation
   ├─ ARIA attributes: Proper roles, states, properties
   ├─ Screen reader: Tested with NVDA, JAWS, VoiceOver
   ├─ Mobile accessibility: Tested on screen readers & voice control
   └─ Version compatibility: Support older browsers (graceful degradation)

TESTING:
├─ Automated: axe DevTools, Lighthouse, WAVE
├─ Manual: Keyboard-only navigation, screen reader test
├─ User testing: With actual assistive technology users
└─ CI/CD: Accessibility checks in pipeline

COMMON ISSUES & FIXES:
├─ Missing alt text → Add descriptive alt text to all images
├─ Poor color contrast → Increase contrast, use contrasting colors
├─ Non-keyboard accessible → Add click handlers + keyboard handlers
├─ Missing form labels → Add <label> or aria-label
├─ Insufficient heading hierarchy → Use proper <h1>-<h6> sequence
├─ Non-semantic HTML → Use <button>, <nav>, <main> instead of divs
├─ Missing ARIA roles → Add roles to custom components
└─ Auto-play content → Require user interaction, provide pause control
```

---

## SECTION 8: PERFORMANCE BENCHMARKS & SLAS

**8.1 Performance Targets**

```
PAGE LOAD TIMES:
├─ Dashboard: < 2 seconds (Largest Contentful Paint)
├─ Performance table: < 2 seconds (initial load)
├─ Pipeline: < 1.5 seconds (Kanban rendering)
├─ Forecast: < 2 seconds (with chart rendering)
└─ Call details: < 3 seconds (with audio/transcript)

INTERACTION RESPONSE TIMES:
├─ Button click → Action feedback: < 200ms
├─ Table sort/filter: < 500ms
├─ Deal drag/drop: Immediate (optimistic update)
├─ Expand rep detail: < 300ms (with animation)
├─ Audio playback start: < 500ms
│   └─ Buffering: Background (user can start listening)
└─ Chart hover tooltip: < 100ms

DATA FRESHNESS:
├─ KPI cards: Refresh every 5 minutes
├─ Team table: Refresh every 10 minutes
├─ Pipeline: Refresh on any change + every 15 minutes
├─ Call data: Available within 2 minutes of call end (for transcription)
├─ Forecast: Daily update at 11 PM + on-demand refresh
└─ Maximum data staleness: 15 minutes

AVAILABILITY & UPTIME:
├─ Target: 99.9% uptime (4-5 mins downtime/month)
├─ Planned maintenance: Monthly, Sunday 2-3 AM ET
├─ Emergency maintenance: Alert users 30 mins in advance (if possible)
├─ Rollback plan: < 10 minutes to roll back bad deploy
└─ Disaster recovery: < 1 hour to restore from backup

CONCURRENT USERS:
├─ Support 100% concurrent access without performance degradation
├─ Each manager can have 5 concurrent sessions (dashboard, etc.)
├─ API rate limit: 1000 requests/minute per manager
└─ Database connections: Pooled, 50 concurrent per manager limit

ERROR RATE:
├─ API errors: < 0.1% (1 error per 1000 requests)
├─ Page crashes: < 0.05%
├─ Data inconsistencies: 0% (transactional integrity)
└─ Mobile app crashes: < 0.5%

COST & SCALABILITY:
├─ Database: Scales to 10,000+ managers without optimization
├─ API servers: Auto-scale based on load (CPU threshold 70%)
├─ Cache: Redis on dedicated instance
├─ CDN: CloudFront for static assets
└─ Estimated monthly cost: $5-10K for 10,000 managers
```

---

## SECTION 9: TESTING STRATEGY

**9.1 Test Coverage**

```
UNIT TESTS:
├─ Components: 80% coverage (all major components)
├─ Utilities: 90% coverage (formatters, calculations)
├─ Hooks: 75% coverage (data fetching, state management)
└─ Services: 85% coverage (API client, auth)

INTEGRATION TESTS:
├─ API integration: 70% coverage (all endpoints)
├─ Data flow: 60% coverage (complex data flows)
├─ User flows: 50% coverage (critical paths)
└─ Database: 80% coverage (queries, transactions)

E2E TESTS:
├─ Dashboard flow: Login → View dashboard → Export data
├─ Team performance: View table → Expand rep → Schedule coaching
├─ Pipeline: View kanban → Move deal → View deal details
├─ Forecast: View forecast → Adjust probability → Save
├─ Call review: View call → Play recording → Add notes
└─ Mobile: All above flows on mobile device

PERFORMANCE TESTS:
├─ Load test: 100 concurrent users
├─ Stress test: 1000 concurrent users
├─ Endurance test: 24-hour run at 50% load
├─ Spike test: Sudden 5x load increase
└─ Data volume test: 10,000 deals, 1000 calls

ACCESSIBILITY TESTS:
├─ Automated scanning: axe DevTools (daily CI)
├─ Manual keyboard testing: All pages, full navigation
├─ Screen reader testing: NVDA, JAWS, VoiceOver
├─ Zoom testing: 200% zoom accessibility
└─ Color contrast: Automated + manual verification

SECURITY TESTS:
├─ OWASP Top 10: Penetration testing
├─ SQL injection: Parameterized queries, code review
├─ XSS prevention: Input sanitization, CSP headers
├─ Authentication: Token refresh, session expiry
├─ Authorization: RLS policy enforcement
└─ Data encryption: TLS in transit, encryption at rest

QA SIGN-OFF:
├─ Feature completion: 100% of requirements met
├─ Bug-free: 0 critical bugs before release
├─ Performance: Meets benchmarks from Section 8.1
├─ Accessibility: WCAG 2.1 AA compliance verified
└─ Security: Security review completed
```

---

## SECTION 10: DEPLOYMENT & LAUNCH CHECKLIST

**10.1 Pre-Launch (2 weeks before)**

```
TECHNICAL CHECKLIST:
☐ All tests passing (unit, integration, E2E)
☐ Code review completed (2 reviewers)
☐ Performance tests pass benchmarks
☐ Security review completed
☐ Database migrations tested & reversible
☐ Deploy process documented & tested
☐ Rollback procedure tested
☐ Monitoring & alerting configured
☐ Error tracking (Sentry) configured
☐ Analytics instrumented

STAGING DEPLOYMENT:
☐ Deploy to staging environment
☐ Smoke tests passed on staging
☐ Full regression testing completed
☐ Performance verified on staging
☐ Security validation passed
☐ Data integrity verified
☐ Mobile app tested on staging (if applicable)
☐ Stakeholder sign-off received

DOCUMENTATION:
☐ User guide written & reviewed
☐ API documentation updated
☐ Database schema documented
☐ Architecture diagram updated
☐ Deployment playbook written
☐ Troubleshooting guide created
☐ FAQ compiled

COMMUNICATION:
☐ Manager beta testers identified (5-10 managers)
☐ Beta testing schedule set
☐ Beta feedback process established
☐ Launch date announced
☐ Release notes prepared
☐ Email campaign scheduled
☐ Help documentation linked in app
☐ Support team trained
```

**10.2 Launch Day**

```
DEPLOYMENT STEPS:
1. ☐ Database migration (if needed)
   - Run migration on production
   - Verify schema changes
   - Check row counts haven't changed

2. ☐ API deployment
   - Deploy to 1 server (canary)
   - Monitor logs for errors (15 mins)
   - If OK, deploy to remaining servers
   - Monitor error rate

3. ☐ Frontend deployment
   - Deploy to CDN
   - Invalidate cache
   - Test in browser (incognito)
   - Verify in different devices/browsers

4. ☐ Smoke tests
   - Login (manager account)
   - View dashboard
   - Click through main pages
   - Test key features (export, coaching, etc.)
   - Check mobile version

5. ☐ Monitoring
   - CPU/Memory usage normal
   - Database query times normal
   - Error rate < 0.1%
   - API response times normal
   - No spike in support tickets

ROLLBACK PLAN (if critical issues):
1. Stop API servers
2. Revert code to previous version
3. Revert database migration (if applicable)
4. Run smoke tests
5. Start API servers
6. Monitor error rate

POST-LAUNCH:
☐ Monitor metrics for 24 hours
☐ Respond to support tickets immediately
☐ Track adoption rate
☐ Collect user feedback
☐ Identify bugs (if any)
☐ Plan hotfixes for critical issues
☐ Send launch announcement
☐ Post launch retrospective (within 1 week)
```

---

## DEPLOYMENT SUCCESS CRITERIA

```
✓ Launch succeeds if:
├─ All critical paths working (login, dashboard, performance, pipeline)
├─ No critical bugs reported in first 24 hours
├─ Performance metrics meet targets
├─ Error rate < 0.1%
├─ Uptime > 99.9%
├─ User adoption > 80% within 1 week
└─ Positive feedback from beta testers

⚠ Investigate if:
├─ Usage < 60% within 1 week (engagement issue)
├─ Error rate > 0.5% (potential bugs)
├─ Performance > 3x normal baseline (scaling issue)
├─ Support tickets > 50 in first week (usability issue)
└─ Manager feedback is negative (UX/feature issue)
```

---

**END OF PART 3 - COMPLETE MANAGER DASHBOARD ARCHITECTURE**

---

## EXECUTIVE SUMMARY

This 3-part architecture document provides **complete end-to-end specification** for the Manager Dashboard in Tasknova:

**PART 1:** Pages 1-2 (Dashboard, Performance) with full UI layouts, data models, and queries  
**PART 2:** Pages 3-5 (Pipeline, Forecast, Call Details) + advanced topics  
**PART 3:** Component library, integrations, deployment, and launch guidance

### Total Coverage:
- **5 Manager Pages** (100+ UI elements)
- **50+ Database Queries** (with aggregation logic)
- **30+ Reusable Components** (with TypeScript interfaces)
- **12+ API Endpoints** (REST API specifications)
- **20+ Database Tables** (with relationships)
- **Complete User Flows** (from login to export)
- **Mobile & Accessibility** (WCAG 2.1 AA compliant)
- **Performance Targets & SLAs** (measurable benchmarks)
- **Testing Strategy** (unit, integration, E2E)
- **Deployment & Launch Checklist** (ready-to-use)

### Ready for Sprint Planning:
Each page/component is documented with:
- Visual layout (ASCII mockups)
- Data requirements (fields, types, relationships)
- Backend queries (prepared SQL)
- Frontend components (React + TypeScript)
- Integration points (with Admin Dashboard)
- Performance requirements (load times, cache TTLs)
- Accessibility requirements (WCAG compliance)
- Error handling & edge cases

### Next Steps:
1. Use this doc to create user stories in Jira
2. Assign components to developers
3. Execute sprints following outlined order
4. Reference SQL/queries for backend implementation
5. Follow deployment checklist on launch

---

**Document Metadata**
- Total Pages: 3
- Created: April 2, 2026
- Total Components: 50+
- UI Elements: 100+
- Database Queries: 50+
- Estimated Dev Hours: 200-300 hours (5-6 week project)
- Review Status: Ready for Sprint Planning ✓
