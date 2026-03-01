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

## Testing

The project includes HTTP-triggered test versions of the scheduled functions that you can call directly for testing purposes.

### Available Test Functions

#### `testDeleteExpiredAccounts`

Manually triggers the account deletion process without waiting for the scheduled time.

**What it does:**

- Finds all users deactivated more than 14 days ago
- Deletes their collections, entries, and user document
- Deletes their Firebase Auth account
- Returns a summary of the deletion process

#### `testSendDeactivationReminders`

Manually triggers the reminder email process without waiting for the scheduled time.

**What it does:**

- Finds users deactivated 7-8 days ago (sends 7-day reminder)
- Finds users deactivated 13-14 days ago (sends 1-day reminder)
- Sends reminder emails via Resend
- Marks users as having received reminders
- Returns a summary of emails sent

### How to Use Test Functions

#### 1. Start the Firebase Emulator

```bash
cd functions
npm run serve
```

The emulator will start and display URLs for your functions, typically at:

- `http://127.0.0.1:5001/[your-project-id]/us-central1/testDeleteExpiredAccounts`
- `http://127.0.0.1:5001/[your-project-id]/us-central1/testSendDeactivationReminders`

#### 2. Call the Test Functions

**Using curl:**

```bash
# Test account deletion
curl http://127.0.0.1:5001/[your-project-id]/us-central1/testDeleteExpiredAccounts

# Test reminder emails
curl http://127.0.0.1:5001/[your-project-id]/us-central1/testSendDeactivationReminders
```

**Using your browser:**

Simply navigate to the function URLs shown in the emulator output.

**Using a tool like Postman or Insomnia:**

Create a GET request to the function URLs.

#### 3. Example Responses

**testDeleteExpiredAccounts:**

```json
{
	"success": true,
	"message": "Deletion process completed",
	"deleted": 2,
	"total": 2
}
```

Or if no accounts need deletion:

```json
{
	"success": true,
	"message": "No expired accounts to delete",
	"deleted": 0
}
```

**testSendDeactivationReminders:**

```json
{
	"success": true,
	"message": "Reminder process completed",
	"sevenDayReminders": 3,
	"oneDayReminders": 1,
	"totalReminders": 4,
	"resendConfigured": true
}
```

### Testing in Production

You can also test these functions in production (after deployment):

```bash
# Get your function URL from Firebase Console
curl https://us-central1-[your-project-id].cloudfunctions.net/testDeleteExpiredAccounts
```

**Important:** Consider removing or securing these test functions before going live, or add authentication to prevent unauthorized access.

### Troubleshooting

**"No expired accounts to delete"**

- Make sure you have test users in Firestore with a `deactivatedAt` timestamp older than 14 days
- Check the Firestore emulator UI at `http://127.0.0.1:4000` to verify your data

**"resendConfigured: false"**

- Your Resend API key is not configured
- Create a `.env` file in the `functions` directory with `RESEND_API_KEY=your_key`
- Restart the emulator after adding the `.env` file

**Function returns 500 error**

- Check the emulator logs for detailed error messages
- Verify your Firebase configuration
- Ensure all dependencies are installed (`pnpm install`)

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
