import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';
import { defineString } from 'firebase-functions/params';

admin.initializeApp();

// Define the Resend API key as a secret parameter
const resendApiKey = defineString('RESEND_API_KEY');

// Initialize Resend
const getResend = () => {
	const apiKey = resendApiKey.value();
	if (!apiKey) {
		console.warn('Resend API key not configured. Emails will not be sent.');
		return null;
	}
	return new Resend(apiKey);
};

/**
 * Scheduled function that runs daily at 2 AM UTC to delete accounts
 * that have been deactivated for more than 14 days.
 */
export const deleteExpiredAccounts = functions.pubsub
	.schedule('0 2 * * *')
	.timeZone('UTC')
	.onRun(async (context) => {
		const fourteenDaysAgo = new Date();
		fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

		const usersRef = admin.firestore().collection('users');

		// Find users deactivated more than 14 days ago
		const snapshot = await usersRef
			.where('deactivatedAt', '!=', null)
			.where('deactivatedAt', '<=', fourteenDaysAgo)
			.get();

		console.log(`Found ${snapshot.size} accounts to delete`);

		if (snapshot.empty) {
			console.log('No expired accounts to delete');
			return null;
		}

		const deletionPromises: Promise<any>[] = [];

		for (const userDoc of snapshot.docs) {
			const userId = userDoc.id;
			console.log(`Deleting account for user: ${userId}`);

			try {
				// Delete user's collections
				const collectionsSnapshot = await admin
					.firestore()
					.collection('users')
					.doc(userId)
					.collection('collections')
					.get();

				const batch = admin.firestore().batch();
				collectionsSnapshot.forEach((doc) => {
					batch.delete(doc.ref);
				});

				// Delete user's entries
				const entriesSnapshot = await admin
					.firestore()
					.collection('users')
					.doc(userId)
					.collection('entries')
					.get();

				entriesSnapshot.forEach((doc) => {
					batch.delete(doc.ref);
				});

				// Delete user document
				batch.delete(userDoc.ref);

				// Commit all Firestore deletions
				await batch.commit();

				// Delete Firebase Auth account
				deletionPromises.push(
					admin
						.auth()
						.deleteUser(userId)
						.catch((err) => {
							console.error(`Failed to delete auth user ${userId}:`, err);
						}),
				);

				console.log(`Successfully deleted account for user: ${userId}`);
			} catch (error) {
				console.error(`Error deleting account for user ${userId}:`, error);
			}
		}

		await Promise.all(deletionPromises);

		console.log(
			`Deletion process completed. Processed ${snapshot.size} accounts`,
		);
		return null;
	});

/**
 * Scheduled function that runs daily at 2:30 PM UTC to send reminder emails
 * to users whose accounts are scheduled for deletion.
 *
 * Note: This function includes the logic but requires email service setup
 * (e.g., SendGrid, Resend) to actually send emails. The email sending
 * portion is commented out until you configure an email service.
 */
export const sendDeactivationReminders = functions.pubsub
	.schedule('30 14 * * *') // Run at 2:30 PM UTC every day
	.timeZone('UTC')
	.onRun(async (context) => {
		const now = new Date();

		// Calculate date ranges for reminders
		// 7-day reminder: Accounts deactivated 7-8 days ago (will be deleted in 6-7 days)
		const eightDaysAgo = new Date(now);
		eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
		const sevenDaysAgo = new Date(now);
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		// 1-day reminder: Accounts deactivated 13-14 days ago (will be deleted in 0-1 days)
		const fourteenDaysAgo = new Date(now);
		fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
		const thirteenDaysAgo = new Date(now);
		thirteenDaysAgo.setDate(thirteenDaysAgo.getDate() - 13);

		const usersRef = admin.firestore().collection('users');

		// Find users deactivated 7-8 days ago who haven't received the 7-day reminder
		const sevenDaySnapshot = await usersRef
			.where('deactivatedAt', '!=', null)
			.where('deactivatedAt', '>=', eightDaysAgo)
			.where('deactivatedAt', '<=', sevenDaysAgo)
			.get();

		// Filter out users who already received the 7-day reminder
		const sevenDayUsers = sevenDaySnapshot.docs.filter(
			(doc) => !doc.data().reminderSent7Days,
		);

		// Find users deactivated 13-14 days ago who haven't received the 1-day reminder
		const oneDaySnapshot = await usersRef
			.where('deactivatedAt', '!=', null)
			.where('deactivatedAt', '>=', fourteenDaysAgo)
			.where('deactivatedAt', '<=', thirteenDaysAgo)
			.get();

		// Filter out users who already received the 1-day reminder
		const oneDayUsers = oneDaySnapshot.docs.filter(
			(doc) => !doc.data().reminderSent1Day,
		);

		console.log(`Found ${sevenDayUsers.length} users for 7-day reminders`);
		console.log(`Found ${oneDayUsers.length} users for 1-day reminders`);

		// Update reminder flags
		const batch = admin.firestore().batch();

		const resend = getResend();
		const emailPromises: Promise<void>[] = [];

		// Mark 7-day reminders as sent and send emails
		for (const doc of sevenDayUsers) {
			const user = doc.data();
			console.log(`Sending 7-day reminder to user: ${user.email}`);
			batch.update(doc.ref, { reminderSent7Days: true });

			if (resend) {
				emailPromises.push(
					sendReminderEmail(
						resend,
						user.email,
						user.displayName || user.name,
						7,
					),
				);
			}
		}

		// Mark 1-day reminders as sent and send emails
		for (const doc of oneDayUsers) {
			const user = doc.data();
			console.log(`Sending 1-day reminder to user: ${user.email}`);
			batch.update(doc.ref, { reminderSent1Day: true });

			if (resend) {
				emailPromises.push(
					sendReminderEmail(
						resend,
						user.email,
						user.displayName || user.name,
						1,
					),
				);
			}
		}

		await batch.commit();

		// Wait for all emails to send
		if (emailPromises.length > 0) {
			await Promise.allSettled(emailPromises);
		}

		console.log(
			`Reminder process completed. Sent ${sevenDayUsers.length + oneDayUsers.length} reminders`,
		);
		return null;
	});

/**
 * Helper function to send reminder emails using Resend
 */
async function sendReminderEmail(
	resend: Resend,
	email: string,
	displayName: string,
	daysLeft: number,
): Promise<void> {
	try {
		const { data, error } = await resend.emails.send({
			// For testing: Use Resend's test domain (works immediately, no verification needed)
			// For production: Change to your verified domain (e.g., 'Wordspill <noreply@wordspill.app>')
			from: 'Wordspill <onboarding@resend.dev>',
			to: email,
			subject: `Your Wordspill account will be deleted in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`,
			html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2f2f2f; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2f2f2f; color: #f7f3ea; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #ffffff; padding: 30px; border: 1px solid #e8e5dc; border-radius: 0 0 8px 8px; }
              .warning { background-color: #fff4e6; padding: 15px; border-left: 4px solid #f7c948; margin: 20px 0; }
              .button { display: inline-block; background-color: #2f2f2f; color: #f7f3ea; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; color: #7c7870; font-size: 14px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Wordspill</h1>
              </div>
              <div class="content">
                <h2>Hi ${displayName},</h2>
                <div class="warning">
                  <strong>⚠️ Your account will be deleted in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}</strong>
                </div>
                <p>Your Wordspill account was deactivated and is scheduled to be <strong>permanently deleted</strong>.</p>
                <p>If you'd like to keep your account and all your collections and entries, simply log back into the app. Your account will be restored automatically.</p>
                <p><strong>If you take no action, all your data will be permanently deleted and cannot be recovered.</strong></p>
                <div style="text-align: center;">
                  <p>Open the Wordspill app to reactivate your account</p>
                </div>
                <p style="margin-top: 30px; color: #7c7870;">If you intended to delete your account, you don't need to do anything. It will be automatically deleted after the waiting period.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Wordspill. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
		});

		if (error) {
			console.error(`Failed to send email to ${email}:`, error);
			return;
		}

		console.log(`Email sent successfully to ${email}. ID: ${data?.id}`);
	} catch (error) {
		console.error(`Error sending email to ${email}:`, error);
	}
}

/**
 * HTTP-triggered test versions of scheduled functions
 * These can be called directly for testing in the emulator or via HTTP
 * Remove or comment out before production deployment
 */

// Test function to trigger account deletion manually
export const testDeleteExpiredAccounts = functions.https.onRequest(
	async (req, res) => {
		try {
			const fourteenDaysAgo = new Date();
			fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

			const usersRef = admin.firestore().collection('users');

			const snapshot = await usersRef
				.where('deactivatedAt', '!=', null)
				.where('deactivatedAt', '<=', fourteenDaysAgo)
				.get();

			console.log(`Found ${snapshot.size} accounts to delete`);

			if (snapshot.empty) {
				res.json({
					success: true,
					message: 'No expired accounts to delete',
					deleted: 0,
				});
				return;
			}

			let deletedCount = 0;
			const errors: string[] = [];

			for (const userDoc of snapshot.docs) {
				const userId = userDoc.id;
				console.log(`Deleting account for user: ${userId}`);

				try {
					const collectionsSnapshot = await admin
						.firestore()
						.collection('users')
						.doc(userId)
						.collection('collections')
						.get();

					const batch = admin.firestore().batch();
					collectionsSnapshot.forEach((doc) => {
						batch.delete(doc.ref);
					});

					const entriesSnapshot = await admin
						.firestore()
						.collection('users')
						.doc(userId)
						.collection('entries')
						.get();

					entriesSnapshot.forEach((doc) => {
						batch.delete(doc.ref);
					});

					batch.delete(userDoc.ref);
					await batch.commit();

					await admin
						.auth()
						.deleteUser(userId)
						.catch((err) => {
							console.error(`Failed to delete auth user ${userId}:`, err);
						});

					deletedCount++;
					console.log(`Successfully deleted account for user: ${userId}`);
				} catch (error) {
					console.error(`Error deleting account for user ${userId}:`, error);
					errors.push(`${userId}: ${error}`);
				}
			}

			res.json({
				success: true,
				message: `Deletion process completed`,
				deleted: deletedCount,
				total: snapshot.size,
				errors: errors.length > 0 ? errors : undefined,
			});
		} catch (error) {
			console.error('Error in testDeleteExpiredAccounts:', error);
			res.status(500).json({ success: false, error: String(error) });
		}
	},
);

// Test function to trigger reminder emails manually
export const testSendDeactivationReminders = functions.https.onRequest(
	async (req, res) => {
		try {
			const now = new Date();

			// Calculate date ranges for reminders
			// 7-day reminder: Accounts deactivated 7-8 days ago (will be deleted in 6-7 days)
			const eightDaysAgo = new Date(now);
			eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
			const sevenDaysAgo = new Date(now);
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

			// 1-day reminder: Accounts deactivated 13-14 days ago (will be deleted in 0-1 days)
			const fourteenDaysAgo = new Date(now);
			fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
			const thirteenDaysAgo = new Date(now);
			thirteenDaysAgo.setDate(thirteenDaysAgo.getDate() - 13);

			const usersRef = admin.firestore().collection('users');

			// Find users deactivated 7-8 days ago who haven't received the 7-day reminder
			const sevenDaySnapshot = await usersRef
				.where('deactivatedAt', '!=', null)
				.where('deactivatedAt', '>=', eightDaysAgo)
				.where('deactivatedAt', '<=', sevenDaysAgo)
				.get();

			const sevenDayUsers = sevenDaySnapshot.docs.filter(
				(doc) => !doc.data().reminderSent7Days,
			);

			// Find users deactivated 13-14 days ago who haven't received the 1-day reminder
			const oneDaySnapshot = await usersRef
				.where('deactivatedAt', '!=', null)
				.where('deactivatedAt', '>=', fourteenDaysAgo)
				.where('deactivatedAt', '<=', thirteenDaysAgo)
				.get();

			const oneDayUsers = oneDaySnapshot.docs.filter(
				(doc) => !doc.data().reminderSent1Day,
			);

			console.log(`Found ${sevenDayUsers.length} users for 7-day reminders`);
			console.log(`Found ${oneDayUsers.length} users for 1-day reminders`);

			const batch = admin.firestore().batch();
			const resend = getResend();
			const emailPromises: Promise<void>[] = [];

			for (const doc of sevenDayUsers) {
				const user = doc.data();
				console.log(`Sending 7-day reminder to user: ${user.email}`);
				batch.update(doc.ref, { reminderSent7Days: true });

				if (resend) {
					emailPromises.push(
						sendReminderEmail(
							resend,
							user.email,
							user.displayName || user.name,
							7,
						),
					);
				}
			}

			for (const doc of oneDayUsers) {
				const user = doc.data();
				console.log(`Sending 1-day reminder to user: ${user.email}`);
				batch.update(doc.ref, { reminderSent1Day: true });

				if (resend) {
					emailPromises.push(
						sendReminderEmail(
							resend,
							user.email,
							user.displayName || user.name,
							1,
						),
					);
				}
			}

			await batch.commit();

			if (emailPromises.length > 0) {
				await Promise.allSettled(emailPromises);
			}

			const totalReminders = sevenDayUsers.length + oneDayUsers.length;

			res.json({
				success: true,
				message: `Reminder process completed`,
				sevenDayReminders: sevenDayUsers.length,
				oneDayReminders: oneDayUsers.length,
				totalReminders,
				resendConfigured: resend !== null,
			});
		} catch (error) {
			console.error('Error in testSendDeactivationReminders:', error);
			res.status(500).json({ success: false, error: String(error) });
		}
	},
);

// Debug function to check all deactivated accounts and their status
export const debugDeactivatedAccounts = functions.https.onRequest(
	async (req, res) => {
		try {
			const now = new Date();
			const usersRef = admin.firestore().collection('users');

			// Get all deactivated accounts
			const snapshot = await usersRef.where('deactivatedAt', '!=', null).get();

			const accounts = snapshot.docs.map((doc) => {
				const data = doc.data();
				const deactivatedAt =
					data.deactivatedAt?.toDate?.() || data.deactivatedAt;
				const daysSinceDeactivation = deactivatedAt
					? Math.floor(
							(now.getTime() - deactivatedAt.getTime()) / (1000 * 60 * 60 * 24),
						)
					: null;
				const daysUntilDeletion =
					daysSinceDeactivation !== null ? 14 - daysSinceDeactivation : null;

				return {
					userId: doc.id,
					email: data.email,
					deactivatedAt: deactivatedAt,
					daysSinceDeactivation,
					daysUntilDeletion,
					reminderSent7Days: data.reminderSent7Days || false,
					reminderSent1Day: data.reminderSent1Day || false,
				};
			});

			res.json({
				success: true,
				totalDeactivated: accounts.length,
				accounts,
				currentTime: now,
			});
		} catch (error) {
			console.error('Error in debugDeactivatedAccounts:', error);
			res.status(500).json({ success: false, error: String(error) });
		}
	},
);
