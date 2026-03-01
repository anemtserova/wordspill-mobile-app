export interface UserProfile {
	id: string;
	name: string;
	email: string;
	displayName: string | null;
	avatarUrl: string | null;
	createdAt: Date;
	updatedAt: Date;
	settings: {
		theme: 'light' | 'dark';
		fontSize: number;
		fontFamily: string;
	};
	// Account deactivation fields
	deactivatedAt?: Date | null;
	reminderSent7Days?: boolean;
	reminderSent1Day?: boolean;
}
