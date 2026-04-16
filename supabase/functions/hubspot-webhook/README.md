# HubSpot Webhook Edge Function

This function receives HubSpot webhook events at:

https://wxconkvfxcsectvbiihb.supabase.co/functions/v1/hubspot-webhook

## What it does

- Validates HubSpot v3 signature using `x-hubspot-signature-v3`
- Enforces timestamp window using `x-hubspot-request-timestamp` (5 minutes)
- Parses event payloads (single or array)
- Logs webhook payloads (optional, if table exists)
- Runs provider-specific event processing stubs

## Required function secrets

Set these in Supabase function secrets:

- `HUBSPOT_CLIENT_SECRET` (recommended) or `HUBSPOT_APP_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Example:

```bash
supabase secrets set HUBSPOT_CLIENT_SECRET=your_hubspot_app_secret
supabase secrets set SUPABASE_URL=https://wxconkvfxcsectvbiihb.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Deploy

```bash
supabase functions deploy hubspot-webhook
```

## Optional webhook log table

If you want payload auditing, create table:

```sql
create table if not exists public.hubspot_webhook_events (
  id uuid primary key default gen_random_uuid(),
  received_at timestamptz not null default now(),
  event_count int not null,
  payload jsonb not null,
  headers jsonb,
  raw_body text
);
```

## Next step

Replace the TODO logic in `processEvent` with your real contact/company/deal upsert flow.
