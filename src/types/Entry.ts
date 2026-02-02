export interface Entry {
	id: string;
	title: string;
	content: string;
	date: Date;
	mood: string | null;
	collectionId: string | null;
	tags: string[];
	headerImage: string | null;
	mediaUrls: string[];
	createdAt: Date;
	updatedAt: Date;
}
