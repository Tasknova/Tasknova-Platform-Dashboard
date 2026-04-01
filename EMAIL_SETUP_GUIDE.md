# Password Reset Email Integration Setup

## Overview
This guide explains how to set up Google Cloud service account-based email sending for the password reset functionality.

## Step 1: Set Up Google Cloud Project

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and select "NEW PROJECT"
3. Enter project name: `Tasknova Email Service`
4. Click "CREATE"

### 1.2 Enable Gmail API
1. In Google Cloud Console, click on "APIs & Services" > "Library"
2. Search for "Gmail API"
3. Click on it and press "ENABLE"

## Step 2: Create Service Account

### 2.1 Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the form:
   - **Service account name**: `tasknova-email-service`
   - **Service account ID**: Auto-filled (leave as is)
   - Click "CREATE AND CONTINUE"
4. On the "Grant this service account access to project" page, skip this step by clicking "CONTINUE"
5. Click "DONE"

### 2.2 Create Service Account JSON Key
1. In "APIs & Services" > "Credentials", find your service account
2. Click on the service account name
3. Go to the "KEYS" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" and click "CREATE"
6. The JSON file will automatically download - **SAVE THIS SECURELY**

### 2.3 Enable Domain-wide Delegation (For Gmail API)
1. In the service account details page, click "Edit"
2. Check the box "Enable Google Workspace Domain-wide Delegation"
3. Fill in "OAuth consent screen redirect URIs" (we'll come back to this)
4. Click "SAVE"

## Step 3: Grant Gmail API Access to Service Account

### 3.1 Configure OAuth Scopes
1. In Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Select "Internal" and click "CREATE"
3. Fill in the form:
   - **App name**: `Tasknova Email Service`
   - **User support email**: `tools@tasknova.io`
   - **Developer contact**: `tools@tasknova.io`
4. Click "SAVE AND CONTINUE"
5. Click "ADD OR REMOVE SCOPES"
6. Add these scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly`
7. Click "SAVE AND CONTINUE", then finish

### 3.2 Create OAuth 2.0 Client ID
1. In "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add to Authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:5173/auth/callback` (for Vite dev)
   - Your production domain callback URL
5. Click "CREATE"
6. Save the Client ID and Client Secret

## Step 4: Extract Service Account Details from JSON

Open the downloaded JSON file and extract these values:

```json
{
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "tasknova-email-service@YOUR_PROJECT_ID.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## Step 5: Configure Environment Variables

### 5.1 If Using Node.js Backend (Express/Fastify/etc.)

Create or update your `.env` file:

```env
# Google Cloud Service Account (Gmail)
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=tasknova-email-service@YOUR_PROJECT_ID.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY_ID=your-private-key-id
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SERVICE_ACCOUNT_CLIENT_ID=your-client-id

# OAuth 2.0 (for token refresh)
GOOGLE_CLIENT_ID=your-oauth-client-id
GOOGLE_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_REDIRECT_URL=http://localhost:3000/auth/callback

# Access Token (obtain via OAuth flow)
GOOGLE_ACCESS_TOKEN=ya29.a0AfH6SMBx...
GOOGLE_REFRESH_TOKEN=1//0gn...

# Email Configuration
SENDER_EMAIL=tools@tasknova.io
RESET_PASSWORD_URL=http://localhost:5173/reset-password
```

**Important:** The `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` should include escaped newlines:
- Replace actual newlines with `\n`
- Or wrap the entire key in quotes and preserve newlines

### 5.2 If Using Supabase Edge Functions

Create `.env.local` with:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Cloud Credentials (will be used in Edge Function)
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=tasknova-email-service@YOUR_PROJECT_ID.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Frontend
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 6: Generate OAuth Tokens (First Time Setup)

You need to generate `GOOGLE_ACCESS_TOKEN` and `GOOGLE_REFRESH_TOKEN` once:

### Option A: Using Google OAuth Playground
1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. In the settings (top right), enable "Use your own OAuth credentials"
3. Enter your OAuth Client ID and Client Secret
4. In Step 1, select Gmail API scopes:
   - `https://www.googleapis.com/auth/gmail.send`
5. Click "Authorize APIs"
6. Grant access to your account
7. In Step 2, click "Exchange authorization code for tokens"
8. Copy the `access_token` and `refresh_token`

### Option B: Using a Script
Create `scripts/generate-tokens.js`:

```javascript
const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const scopes = ['https://www.googleapis.com/auth/gmail.send'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Authorize this app by visiting this url:', authUrl);

rl.question('Enter the code from that page here: ', (code) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error getting token:', err);
    console.log('Your tokens:');
    console.log('GOOGLE_ACCESS_TOKEN=' + token.access_token);
    console.log('GOOGLE_REFRESH_TOKEN=' + token.refresh_token);
    rl.close();
  });
});
```

## Step 7: Install Required Packages

For Node.js backend:
```bash
npm install nodemailer googleapis
```

For TypeScript:
```bash
npm install --save-dev @types/nodemailer
```

## Step 8: Test Email Sending

Create `scripts/test-email.ts`:

```typescript
import { sendResetEmail } from '../src/lib/email';

async function testEmail() {
  try {
    const result = await sendResetEmail({
      email: 'test@example.com',
      resetLink: 'https://your-app.com/reset-password?token=test-token',
      userName: 'Test User',
    });
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

testEmail();
```

Run it:
```bash
npx tsx scripts/test-email.ts
```

## Step 9: Create API Endpoint

### Option A: Express Backend

Create `server/routes/auth.ts`:

```typescript
import express from 'express';
import { sendResetEmail } from '../lib/email';
import { supabase } from '../lib/supabase';
import crypto from 'crypto';

const router = express.Router();

router.post('/send-reset-email', async (req, res) => {
  try {
    const { email, userId, orgId } = req.body;

    if (!email || !userId) {
      return res.status(400).json({ error: 'Email and userId are required' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token hash to database
    const { error: dbError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Generate reset link
    const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${resetToken}`;

    // Send email
    await sendResetEmail({
      email,
      resetLink,
      userName: email.split('@')[0],
    });

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to send reset email',
    });
  }
});

export default router;
```

### Option B: Supabase Edge Function

Create `supabase/functions/send-reset-email/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.101.0'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { email, userId, orgId } = await req.json()

    if (!email || !userId) {
      return new Response(JSON.stringify({ error: 'Email and userId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Generate reset token
    const resetToken = crypto.getRandomValues(new Uint8Array(32))
    const tokenHex = Array.from(resetToken).map(b => b.toString(16).padStart(2, '0')).join('')
    
    // Hash token for storage
    const encoded = new TextEncoder().encode(tokenHex)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
    const tokenHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save to database
    const { error: dbError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
        used: false,
      })

    if (dbError) throw dbError

    const resetLink = `${Deno.env.get('RESET_PASSWORD_URL') || 'http://localhost:5173/reset-password'}?token=${tokenHex}`

    // Send email via Gmail
    const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GOOGLE_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: Buffer.from(`From: ${Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL')}\nTo: ${email}\nSubject: Password Reset Request\n\n${resetLink}`).toString('base64'),
      }),
    })

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.statusText}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

## Step 10: Create Password Reset Token Table

Run this SQL in Supabase:

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES team_members(user_id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(token_hash)
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
```

## Step 11: Create Reset Password Page

Create a reset password page at `/reset-password` to handle the token and allow users to set a new password.

## Troubleshooting

### Email not sending
- Check that Gmail API is enabled in Google Cloud Console
- Verify service account has correct permissions
- Ensure access token is valid and not expired
- Check email headers format

### "Invalid credentials" error
- Refresh the access token
- Verify GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is properly escaped
- Check that all required environment variables are set

### Token expired
- Generate new tokens using OAuth flow
- Update GOOGLE_ACCESS_TOKEN and GOOGLE_REFRESH_TOKEN in .env

## Security Notes
- Never commit `.env` files with real credentials
- Rotate service account keys regularly
- Use `GOOGLE_REFRESH_TOKEN` to automatically refresh access tokens
- Validate all user inputs on the backend
- Rate limit password reset requests
- Add CSRF protection to reset endpoint
