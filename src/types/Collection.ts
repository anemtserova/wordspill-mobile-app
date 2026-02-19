export interface Collection {
	id: string;
	name: string;
	createdAt: Date;
	iconUrl: string | null;
	iconName: string; // Icon identifier (e.g., 'fish', 'flower', 'book')
	updatedAt: Date;
	color: string | null;
	deletedAt?: Date | null;
}
