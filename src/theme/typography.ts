// Design System - Typography

export const typography = {
	// Font Families
	fonts: {
		heading: 'PlayfairDisplay_700Bold', // Playfair Display for headings
		headingItalic: 'PlayfairDisplay_700Bold_Italic',
		body: 'Jost_400Regular', // Jost for body text
		bodyMedium: 'Jost_500Medium',
		bodySemiBold: 'Jost_600SemiBold',
		bodyBold: 'Jost_700Bold',
	},

	// Font Sizes
	fontSize: {
		xs: 12,
		sm: 14,
		base: 16,
		lg: 18,
		xl: 20,
		'2xl': 24,
		'3xl': 30,
		'4xl': 36,
		'5xl': 48,
		'6xl': 60,
		'7xl': 72,
	},

	// Line Heights
	lineHeight: {
		tight: 1.25,
		normal: 1.5,
		relaxed: 1.75,
		loose: 2,
	},

	// Letter Spacing
	letterSpacing: {
		tighter: -0.05,
		tight: -0.025,
		normal: 0,
		wide: 0.025,
		wider: 0.05,
		widest: 0.1,
	},

	// Font Weights
	fontWeight: {
		regular: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
	},

	// Text Ellipsis Modes (use with truncated prop on Text component)
	ellipsizeModes: {
		tail: 'tail' as const,
		head: 'head' as const,
		middle: 'middle' as const,
		clip: 'clip' as const,
	},
};

export type Typography = typeof typography;
