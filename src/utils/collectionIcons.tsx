import React from 'react';
import {
	Fish,
	SeaAndSun,
	EditPencil,
	FavouriteBook,
	Learning,
	BookStack,
	Book,
	Page,
	PageEdit,
	BookLock,
	Journal,
} from 'iconoir-react-native';
import { Flower } from 'iconoir-react-native/regular';

// Type for icon components
export type IconComponent = React.ComponentType<{
	width?: number;
	height?: number;
	color?: string;
	strokeWidth?: number;
}>;

// Default icon for user-created collections
export const DEFAULT_COLLECTION_ICON = 'bookStack';

// Map of icon names to icon components
export const COLLECTION_ICONS: Record<string, IconComponent> = {
	// Default collection icons
	fish: Fish,
	flower: Flower,
	seaAndSun: SeaAndSun,
	editPencil: EditPencil,
	favouriteBook: FavouriteBook,
	learning: Learning,

	// Additional icons available for user collections
	bookStack: BookStack,
	book: Book,
	page: Page,
	pageEdit: PageEdit,
	bookLock: BookLock,
	journal: Journal,
};

/**
 * Get icon component by name
 * Returns default icon if name is not found
 */
export const getCollectionIcon = (iconName?: string | null): IconComponent => {
	if (!iconName) {
		return COLLECTION_ICONS[DEFAULT_COLLECTION_ICON];
	}

	return (
		COLLECTION_ICONS[iconName] || COLLECTION_ICONS[DEFAULT_COLLECTION_ICON]
	);
};

/**
 * Get list of available icon names for collection creation
 */
export const getAvailableIconNames = (): string[] => {
	return Object.keys(COLLECTION_ICONS);
};
