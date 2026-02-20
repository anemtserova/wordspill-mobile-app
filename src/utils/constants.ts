import React from 'react';
import {
	Fish,
	Globe,
	EditPencil,
	FavouriteBook,
	Learning,
	BookStack,
	Book,
	BookLock,
	Journal,
	SunLight,
	SeaAndSun,
	Tree,
	Yoga,
	Suitcase,
} from 'iconoir-react-native';
import { Flower } from 'iconoir-react-native/regular';
import { colors } from '../theme';

export type IconComponent = React.ComponentType<{
	width?: number;
	height?: number;
	color?: string;
	strokeWidth?: number;
}>;

// Available colors for collections
export const COLLECTION_COLORS = [
	{ name: 'Graphite', color: colors.primary.main },
	{ name: 'Burnt Peach', color: colors.secondary.main },
	{ name: 'Tuscan Sun', color: colors.accent.gold },
	{ name: 'Apricot Cream', color: colors.accent.cream },
	{ name: 'Muted Teal', color: colors.accent.teal },
	{ name: 'Light Graphite', color: colors.neutral.gray500 },
	{ name: 'Soft Peach', color: colors.secondary.light },
	{ name: 'Gentle Crimson', color: colors.secondary.dark },
];

// Default icon for collections
export const DEFAULT_COLLECTION_ICON = 'bookStack';

// Available icons for collections
export const COLLECTION_ICONS: Record<string, IconComponent> = {
	fish: Fish,
	flower: Flower,
	globe: Globe,
	editPencil: EditPencil,
	favouriteBook: FavouriteBook,
	learning: Learning,
	bookStack: BookStack,
	book: Book,
	tree: Tree,
	yoga: Yoga,
	bookLock: BookLock,
	journal: Journal,
	sunLight: SunLight,
	seaAndSun: SeaAndSun,
	suitcase: Suitcase,
};

// Available icon names for collections
export const COLLECTION_ICON_OPTIONS = Object.keys(COLLECTION_ICONS);
