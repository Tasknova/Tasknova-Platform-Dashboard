# Forgot Password & Email Integration Setup

## Complete Implementation Guide

This document provides a complete overview of the password reset functionality integrated with Google Cloud service account email sending.

---

## 🎯 What Has Been Implemented

### 1. **Frontend Components**
✅ **Landing.tsx** - Updated with "Forgot?" link next to password field
✅ **ForgotPassword.tsx** - Modal component for email entry
✅ **ResetPassword.tsx** - Full reset password form with strength indicator
✅ **Routes** - Added `/reset-password` route

### 2. **Backend Setup**
- Email utility (`src/lib/email.ts`) - nodemailer integration with Google Cloud
- Example Express server (`server-setup.example.ts`) - Complete API implementation
- API endpoints:
  - `POST /api/auth/send-reset-email` - Sends reset email
  - `POST /api/auth/verify-reset-token` - Validates reset token
  - `POST /api/auth/reset-password` - Updates password with token

### 3. **Database Requirements**
Need to create table in Supabase:

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

---

## 📋 Setup Steps

### Step 1: Set Up Google Cloud (Required)
Follow the detailed instructions in [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)

Key points:
- Create Google Cloud Project
- Enable Gmail API
- Create Service Account with JSON credentials
- Extract credentials for .env file
- Generate OAuth tokens (access_token & refresh_token)

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Google Cloud Service Account
GOOGLE_PROJECT_ID=your-gcp-project-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=tasknova-email-service@YOUR-PROJECT.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY_ID=your-private-key-id
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SERVICE_ACCOUNT_CLIENT_ID=your-service-account-client-id

# OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_REDIRECT_URL=http://localhost:5173/auth/callback

# Access Tokens (generate using EMAIL_SETUP_GUIDE.md)
GOOGLE_ACCESS_TOKEN=ya29.a0AfH6SMBx...
GOOGLE_REFRESH_TOKEN=1//0gn...

# Application Settings
SENDER_EMAIL=tools@tasknova.io
RESET_PASSWORD_URL=http://localhost:5173/reset-password
VITE_BACKEND_URL=http://localhost:3000
```

### Step 3: Create Database Table

Execute the SQL above in Supabase SQL editor.

### Step 4: Set Up Backend Server

#### Option A: Using Express (Recommended for Node.js)

1. Install dependencies:
```bash
npm install express cors dotenv @supabase/supabase-js nodemailer googleapis bcryptjs
npm install --save-dev @types/express @types/node typescript ts-node
```

2. Copy `server-setup.example.ts` to `server/index.ts` and update as needed

3. Add to `package.json`:
```json
{
  "scripts": {
    "server": "ts-node server/index.ts",
    "server:dev": "nodemon --exec ts-node server/index.ts"
  }
}
```

4. Create `.env` for server with backend-specific variables

5. Run server:
```bash
npm run server
```

#### Option B: Using Supabase Edge Functions

1. Initialize Supabase (if not already done):
```bash
supabase init
```

2. Create edge function:
```bash
supabase functions new send-reset-email
```

3. Implement the function (see EMAIL_SETUP_GUIDE.md for code)

4. Deploy:
```bash
supabase functions deploy send-reset-email --project-id YOUR_PROJECT_ID
```

### Step 5: Test the Implementation

1. Start your app:
```bash
npm run dev
```

2. Navigate to login page
3. Click "Forgot?" next to password field
4. Enter an email from the team_members table
5. Check the email for reset link
6. Click the reset link
7. Set a new password

---

## 🔄 Flow Diagram

```
User Flow:
1. Click "Forgot?" on login page
   ↓
2. Enter email in modal
   ↓
3. Frontend calls `POST /api/auth/send-reset-email`
   ↓
4. Backend:
   - Validates email exists in team_members
   - Generates 32-byte token
   - Hashes token (SHA-256) for storage
   - Saves token hash to password_reset_tokens table
   - Sends reset link via Gmail
   ↓
5. User receives email with unique reset link
   ↓
6. User clicks link → navigates to `/reset-password?token=XXXXX`
   ↓
7. Frontend validates token via `POST /api/auth/verify-reset-token`
   ↓
8. User enters new password, confirms
   ↓
9. Frontend calls `POST /api/auth/reset-password` with token
   ↓
10. Backend:
    - Verifies token hasn't expired or been used
    - Hashes new password
    - Updates team_members.password_hash
    - Marks token as used
    ↓
11. User redirected to login page
```

---

## 📧 Email Configuration

### Sender Email
- **Default**: `tools@tasknova.io`
- You can use any email address that you have access to via Google Cloud

### Email Template
The email includes:
- Professional HTML template
- Clickable reset button
- Plain text alternative
- Security warning (if not requested by user)
- 1-hour token expiration notice

### Customization
Edit the HTML template in `src/lib/email.ts` in the `sendResetEmail()` function to match your branding.

---

## 🔐 Security Features

✅ **Token Security**
- 32-byte random tokens
- SHA-256 hashing before storage
- Only hash stored in database (tokens never stored plaintext)
- 1-hour expiration

✅ **Password Security**
- Minimum 8 characters required
- Password strength indicator on reset form
- Bcryptjs hashing with salt
- Passwords never logged

✅ **Email Security**
- Service account authentication
- OAuth 2.0 token-based access
- Automatic token refresh

✅ **Rate Limiting** (Recommended to add)
- Limit reset requests per email
- Add CAPTCHA for multiple failed attempts

---

## 🚨 Troubleshooting

### Email Not Received
1. Check Gmail API is enabled in Google Cloud Console
2. Verify service account credentials in .env
3. Check email spam/promotions folder
4. Review server logs for errors
5. Test with `tests/test-email.ts` script

### "User not found" error
- Email doesn't exist in team_members table
- Check email spelling matches database

### "Invalid or expired token"
- Token more than 1 hour old
- Token already used
- Token tampered with
- Request new reset link

### OAuth Token Expired
- Refresh tokens using Google OAuth Playground
- Update GOOGLE_ACCESS_TOKEN in .env
- Use GOOGLE_REFRESH_TOKEN to auto-refresh in production

---

## 📦 Files Created/Modified

### New Files
- `src/lib/email.ts` - Email service with Google Cloud integration
- `src/app/views/auth/ForgotPassword.tsx` - Forgot password modal
- `src/app/views/auth/ResetPassword.tsx` - Reset password form
- `server-setup.example.ts` - Example Express server
- `EMAIL_SETUP_GUIDE.md` - Detailed Google Cloud setup
- `.env.example` - Environment variables template

### Modified Files
- `src/app/views/auth/Landing.tsx` - Added "Forgot?" link
- `src/app/routes.tsx` - Added reset-password route
- `.env.example` - Added email configuration

---

## 🎓 Next Steps

1. Follow EMAIL_SETUP_GUIDE.md to set up Google Cloud
2. Set up Node.js backend or Supabase Edge Function
3. Configure .env variables
4. Create password_reset_tokens table
5. Install dependencies
6. Test the complete flow
7. Deploy to production

---

## 📞 Support

For issues:
1. Check EMAIL_SETUP_GUIDE.md for Google Cloud setup problems
2. Review server logs for API errors
3. Verify all .env variables are set correctly
4. Test email sending with test script
5. Check Supabase logs for database issues

---

## Version Info
- Created: April 1, 2026
- Google Cloud SDK: Latest
- Nodemailer: v6+
- Supabase SDK: v2.101.0
