// Design System - Color Palette

export const colors = {
	// Primary Colors - Graphite
	primary: {
		main: '#2f2f2f', // Graphite
		light: '#4a4a4a',
		dark: '#1a1a1a',
		contrast: '#f7f3ea', // Floral white
	},

	// Secondary Colors - Burnt Peach
	secondary: {
		main: '#e07a5f', // Burnt Peach
		light: '#e99480',
		dark: '#d66149',
		contrast: '#f7f3ea',
	},

	// Accent Colors
	accent: {
		gold: '#f7c948', // Tuscan Sun
		cream: '#f2cc8f', // Apricot Cream
		teal: '#8daa91', // Muted Teal
		peach: '#e07a5f', // Burnt Peach
	},

	// Neutral Colors
	neutral: {
		white: '#FFFFFF',
		cream: '#f7f3ea', // Floral white
		gray50: '#f9f8f5',
		gray100: '#f2f0ea',
		gray200: '#e8e5dc',
		gray300: '#d4d0c5',
		gray400: '#a8a399',
		gray500: '#7c7870',
		gray600: '#5a5650',
		gray700: '#3d3d3d',
		gray800: '#2f2f2f', // Graphite
		gray900: '#1a1a1a',
		black: '#000000',
	},

	// Semantic Colors
	semantic: {
		success: '#8daa91', // Muted Teal
		warning: '#f7c948', // Tuscan Sun
		error: '#e07a5f', // Burnt Peach
		info: '#f2cc8f', // Apricot Cream
	},

	// Background Colors
	background: {
		primary: '#f7f3ea', // Floral white
		secondary: '#FFFFFF',
		tertiary: '#f2f0ea',
		dark: '#2f2f2f', // Graphite
		cream: '#f2cc8f', // Apricot Cream light
	},

	// Text Colors
	text: {
		primary: '#2f2f2f', // Graphite
		secondary: '#5a5650',
		tertiary: '#7c7870',
		inverse: '#f7f3ea', // Floral white
		disabled: '#d4d0c5',
		accent: '#e07a5f', // Burnt Peach
	},

	// Border Colors
	border: {
		light: '#e8e5dc',
		medium: '#d4d0c5',
		dark: '#a8a399',
	},
};

export type ColorPalette = typeof colors;
