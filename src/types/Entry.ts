export interface MediaItem {
	url: string;
	type: 'image' | 'video';
	thumbnailUrl?: string; // For videos
}

export interface Entry {
	id: string;
	title: string;
	content: string;
	date: Date;
	mood: string | null;
	collectionId: string | null;
	tags: string[];
	headerImage: string | null;
	media: MediaItem[];
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date | null;
}
