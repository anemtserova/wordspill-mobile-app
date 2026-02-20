import {
	IconComponent,
	DEFAULT_COLLECTION_ICON,
	COLLECTION_ICONS,
} from './constants';

// Re-export types for backward compatibility
export type { IconComponent };

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
