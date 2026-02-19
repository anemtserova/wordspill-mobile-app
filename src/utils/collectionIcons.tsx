import React from 'react';
import {
	Fish,
	Globe,
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

export type IconComponent = React.ComponentType<{
	width?: number;
	height?: number;
	color?: string;
	strokeWidth?: number;
}>;

export const DEFAULT_COLLECTION_ICON = 'bookStack';

export const COLLECTION_ICONS: Record<string, IconComponent> = {
	fish: Fish,
	flower: Flower,
	globe: Globe,
	editPencil: EditPencil,
	favouriteBook: FavouriteBook,
	learning: Learning,

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

	const normalizedName = iconName.charAt(0).toLowerCase() + iconName.slice(1);

	return (
		COLLECTION_ICONS[normalizedName] ||
		COLLECTION_ICONS[DEFAULT_COLLECTION_ICON]
	);
};

/**
 * Get list of available icon names for collection creation
 */
export const getAvailableIconNames = (): string[] => {
	return Object.keys(COLLECTION_ICONS);
};
