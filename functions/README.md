# Wordspill Cloud Functions

This directory contains Firebase Cloud Functions for background tasks like scheduled account deletion.

## Setup

1. **Install Firebase CLI** (if not already installed):

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not already done for the project):

   ```bash
   # From project root
   firebase init functions
   ```

   - Select your Firebase project
   - Choose TypeScript
   - Install dependencies

4. **Install dependencies**:
   ```bash
   cd functions
   npm install
   ```

## Functions

### `deleteExpiredAccounts`

Scheduled function that runs daily at 2 AM UTC to permanently delete accounts that have been deactivated for more than 14 days.

**What it deletes:**

- User's collections
- User's entries
- User document in Firestore
- Firebase Auth account

### `sendDeactivationReminders`

Scheduled function that runs daily at 10 AM UTC to send email reminders to users whose accounts are approaching deletion.

**Reminder schedule:**

- 7 days before deletion
- 1 day before deletion

**Email service:** Uses Resend API to send styled HTML emails. Requires API key configuration (see Email Setup section below).

## Development

### Test functions locally:

```bash
npm run serve
```

This starts the Firebase emulator suite.

### View function logs:

```bash
npm run logs
```

### Build TypeScript:

```bash
npm run build
```

## Deployment

### Deploy all functions:

```bash
npm run deploy
```

Or from project root:

```bash
firebase deploy --only functions
```

### Deploy specific function:

```bash
firebase deploy --only functions:deleteExpiredAccounts
firebase deploy --only functions:sendDeactivationReminders
```

## Requirements

- **Firebase Blaze Plan** (pay-as-you-go) is required for Cloud Functions
- Estimated costs: ~$1-5/month for typical usage

## Email Setup with Resend

Email reminders are integrated and ready to use with Resend. Follow these steps to enable:

### 1. Create a Resend account

- Sign up at [resend.com](https://resend.com/)
- Free tier: 100 emails/day, 3,000/month

### 2. Get your API key

- Go to [API Keys](https://resend.com/api-keys) in the Resend dashboard
- Create a new API key
- Copy the key (starts with `re_`)

### 3. Domain setup

**For testing (recommended to start):**

- No domain setup needed!
- Code is configured to use `onboarding@resend.dev` (Resend's test domain)
- Works immediately with your API key
- Perfect for development and testing

**For production (when ready):**

1. Purchase a domain (e.g., `wordspill.app`, `wordspill.com`)
2. Go to [Domains](https://resend.com/domains) in Resend dashboard
3. Add your domain
4. Add the DNS records they provide to your domain registrar
5. Wait for verification (usually a few minutes)
6. Update `src/index.ts` line 243:
   ```typescript
   from: 'Wordspill <noreply@wordspill.app>';
   ```

For testing directly: Use the test domain that's already configured (`onboarding@resend.dev`).

### 4. Configure API key as environment variable

Create a `.env` file in the `functions` directory (already in .gitignore):

```bash
# functions/.env
RESEND_API_KEY=re_your_api_key_here
```

**Important:** This file is for both local testing AND deployment. Firebase will prompt you for the value during deployment if not set.

### 5. Deploy functions

```bash
cd functions
npm install
npm run deploy
```

### Test locally with emulator

The `.env` file you created is automatically loaded by the Firebase emulator:

```bash
npm run serve
```

This starts the Firebase Functions emulator with your local environment variables.

## Monitoring

View function execution in Firebase Console:

- Go to Firebase Console → Functions
- Click on a function to see invocations, logs, and errors
