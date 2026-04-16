# Microsoft Calendar and Teams Meetings Integration Plan

## Objective
Integrate Microsoft 365 Calendar into the existing meetings flow, including:
- Connect and disconnect Microsoft account
- Sync Outlook calendar events into dashboard meetings
- Support Teams join links from synced events
- Delete meetings from both dashboard and Microsoft calendar
- Reuse existing meetings UI sections and filters

This document is a deferred implementation plan so the team can execute it later without re-discovery.

---

## Scope

### In scope
- Microsoft OAuth connection flow
- Microsoft Graph event sync (read and write)
- Teams meeting links through calendar events
- Existing actions parity with Google flow:
  - Connect
  - Sync now
  - Auto sync polling
  - Delete meeting
  - Disconnect and purge

### Out of scope (for first pass)
- Full two-way editing of all event fields
- Multi-calendar picker UX
- Deep enterprise policy handling per tenant
- Webhook subscriptions for push sync (can be phase 2)

---

## Architecture Approach

Use Microsoft Graph as the single API surface:
- Calendar events: Outlook via Graph
- Teams meeting links: event.onlineMeeting.joinUrl from Graph events

For standard scheduling use-cases, a separate Teams Meetings API is not required.
Create or sync events from Graph and use the Teams join URL if available.

---

## Azure App Registration Setup

1. Create app registration
- Azure Portal -> App registrations -> New registration
- Name: Tasknova Calendar Integration
- Account type:
  - Single tenant for internal-only org
  - Multitenant if external customers connect their tenants

2. Configure redirect URIs (Web)
- Local: http://localhost:5173/calendar/callback
- Production callback URL (exact match to deployed app)

3. Create client secret
- Certificates and secrets -> New client secret
- Save secret value securely

4. API permissions (Delegated)
- openid
- profile
- email
- offline_access
- User.Read
- Calendars.ReadWrite
- Optional: Calendars.Read.Shared (if shared calendars are required)
- Optional: OnlineMeetings.ReadWrite (only if direct online meetings endpoints are planned)

5. Admin consent
- Grant tenant admin consent for required delegated permissions

---

## Environment and Secret Management

### Frontend env variables
- VITE_MICROSOFT_CLIENT_ID
- VITE_MICROSOFT_TENANT_ID
- VITE_MICROSOFT_REDIRECT_URI

### Supabase Edge Function secrets
- MICROSOFT_CLIENT_ID
- MICROSOFT_CLIENT_SECRET
- MICROSOFT_TENANT_ID

### Security rule
- Never expose client secret, refresh tokens, or access tokens in frontend env
- Store private credentials only in backend secrets

---

## OAuth Flow (Microsoft)

### Authorization URL
Base:
- https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize

Parameters:
- client_id
- response_type=code
- redirect_uri
- response_mode=query
- scope=openid profile email offline_access User.Read Calendars.ReadWrite
- state containing encoded organizationId, userId, provider=microsoft
- prompt=select_account (optional)

### Token exchange endpoint
- POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
- grant_type=authorization_code
- Inputs: code, client_id, client_secret, redirect_uri

### Refresh token endpoint
- Same token endpoint
- grant_type=refresh_token

### Callback behavior requirement
Callback must be accepted even when no active integration row exists.
This supports reconnect-after-disconnect without returning a false "not connected" error.

---

## Graph API Endpoints to Use

### Sync events (recommended)
- GET /me/calendarView?startDateTime=...&endDateTime=...
- Use calendarView to expand recurrence reliably

### Delete event
- DELETE /me/events/{event-id}

### Teams meeting creation (future phase)
- POST /me/events
- Include:
  - isOnlineMeeting: true
  - onlineMeetingProvider: teamsForBusiness
- Use onlineMeeting.joinUrl from response

---

## Data Mapping to Existing Schema

Map Graph event fields into meetings tables as follows:
- event.id -> calendar_sync_events.external_event_id (scoped with organization)
- event.subject -> meetings.title
- event.bodyPreview or event.body.content -> meetings.description
- event.start / event.end -> meetings.scheduled_start_time / meetings.scheduled_end_time
- event.location.displayName -> meetings.location
- event.onlineMeeting.joinUrl (fallback webLink) -> meetings.meeting_url
- event.attendees -> meeting_participants rows
- event.isAllDay -> all-day handling in UI duration label

Meeting platform detection:
- Teams URL -> teams
- Other URL types -> external

---

## Database Considerations

### integrations table
Support provider=microsoft with existing integration_type=calendar structure:
- provider: microsoft
- access_token_encrypted
- refresh_token_encrypted
- token_expires_at
- is_active
- sync_status
- sync_error
- config JSON:
  - tenant
  - selected_calendar_id (if needed later)
  - delta_link (for incremental sync)

### calendar_sync_events table
- Store scoped external_event_id
- Optional future fields: etag/changeKey for concurrency checks

No immediate schema migration is strictly required if current columns are generic enough.

---

## Backend Implementation Plan (Supabase Edge Function)

Preferred strategy:
- Keep one unified function and add provider-aware routing
- Or add separate function for Microsoft and keep shared sync helpers

Actions to support (same pattern as Google):
1. get_auth_url (provider=microsoft)
2. callback exchange and integration upsert
3. get_meetings
4. sync_now
5. delete_meeting
6. disconnect_calendar

Behavior notes:
- Token refresh should happen automatically for active Microsoft integration
- delete_meeting must remove from Graph first, then local DB rows
- disconnect_calendar must purge synced meeting rows and deactivate integration

---

## Frontend Implementation Plan

### Meetings page
File to update:
- src/app/views/shared/Meetings.tsx

Changes:
- Add Connect Microsoft button beside existing provider connect UI
- Pass provider in auth URL request payload
- Show connected provider badge/state
- Reuse existing tabs and filters unchanged

### Callback page
File to update:
- src/app/views/shared/CalendarCallback.tsx

Changes:
- Parse provider from state
- Invoke backend callback with provider context
- Show provider-specific error messages

### Routes
File to check:
- src/app/routes.tsx

Changes:
- Existing callback route can be reused
- No separate Microsoft callback route required if provider is in state

---

## Sync Strategy

### Phase 1 (simple and stable)
- Full window sync:
  - Past: 60 days
  - Future: 365 days
- Run on:
  - callback completion
  - sync now click
  - periodic polling

### Phase 2 (optimization)
- Use Graph delta sync
- Persist deltaLink in integration config
- Apply added, updated, and removed changes incrementally

---

## Edge Cases and Pitfalls

1. Redirect URI mismatch
- Exact URI string must match app registration

2. Missing offline_access
- No refresh token returned, causing reconnect churn

3. Tenant endpoint mismatch
- Inconsistent common vs tenant-specific endpoint use can fail auth

4. Consent not granted
- Enterprise tenants may require admin consent before OAuth works

5. Time zone conversion
- Graph date-time and timezone fields must be normalized before save

6. Shared calendar visibility
- Additional permissions may be needed for non-primary calendars

---

## Security Checklist

- Keep JWT verification enabled for edge functions unless there is a strict, documented reason not to
- Validate OAuth state payload and user/org context
- Store secrets server-side only
- Encrypt or securely store access and refresh tokens
- Rotate any credentials that were exposed in local files or logs

---

## Testing Checklist

### Connect flow
- Connect Microsoft redirects correctly
- Callback succeeds and stores integration
- Meetings appear after initial sync

### Sync flow
- Sync now updates meeting list
- Auto sync reflects newly added Outlook events
- Recurring events are handled correctly

### Delete flow
- Delete removes event in Graph
- Local meeting and participant rows are removed

### Disconnect flow
- Integration marked inactive
- Synced meeting rows are purged
- Reconnect works from disconnected state

### Teams link behavior
- Teams events show join URL
- Join button opens correct URL

---

## Suggested Implementation Sequence

1. Azure app registration and permissions
2. Add Microsoft env variables and backend secrets
3. Implement provider-aware auth URL and callback exchange
4. Implement Microsoft get_meetings and sync_now
5. Implement delete_meeting and disconnect_calendar for Microsoft
6. Add Connect Microsoft in meetings UI
7. End-to-end validation on local and production callback URLs
8. Add delta sync optimization (optional phase 2)

---

## Done Criteria

Integration is complete when:
- User can connect Microsoft account from Meetings page
- Callback completes without manual intervention
- Synced meetings appear in all existing sections and filters
- Delete and disconnect behaviors match Google integration parity
- Teams meeting links are available and usable when present
- Reconnect after disconnect works consistently
