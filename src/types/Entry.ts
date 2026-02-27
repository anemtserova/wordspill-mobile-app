export interface MediaItem {
	url: string;
	type: 'image' | 'video';
	thumbnailUrl?: string; // For videos
}

export interface Location {
	latitude: number;
	longitude: number;
	address?: string;
}

export interface Entry {
	id: string;
	title: string;
	content: string;
	date: Date;
	collectionId: string | null;
	tags: string[];
	headerImage: string | null;
	media: MediaItem[];
	location: Location | null;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date | null;
}
