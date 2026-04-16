# HubSpot Connect Edge Function

This function handles HubSpot OAuth for app users.

## Actions

- get_auth_url
- exchange_code
- status
- sync_now
- disconnect

## Required secrets

Set these in Supabase function secrets:

- HUBSPOT_CLIENT_ID
- HUBSPOT_CLIENT_SECRET
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

## Deploy

```bash
supabase functions deploy hubspot-connect
```

## Notes

- This function stores per-user HubSpot tokens in public.crm_integrations.
- sync_now validates token health with a lightweight contacts API request.
