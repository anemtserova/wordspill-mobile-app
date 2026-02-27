import React from 'react';
import {
	Text as RNText,
	TextProps as RNTextProps,
	TextStyle,
} from 'react-native';
import { typography, colors } from '../../theme';

type TextVariant =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'body'
	| 'bodyLarge'
	| 'bodySmall'
	| 'caption'
	| 'label';

interface TextProps extends RNTextProps {
	variant?: TextVariant;
	color?: string;
	align?: 'left' | 'center' | 'right' | 'justify';
	weight?: 'regular' | 'medium' | 'semibold' | 'bold';
	truncated?: boolean;
	ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

const variantStyles: Record<TextVariant, TextStyle> = {
	h1: {
		fontFamily: typography.fonts.heading,
		fontSize: typography.fontSize['5xl'],
		lineHeight: typography.fontSize['5xl'] * typography.lineHeight.tight,
		letterSpacing: typography.letterSpacing.tight,
	},
	h2: {
		fontFamily: typography.fonts.heading,
		fontSize: typography.fontSize['4xl'],
		lineHeight: typography.fontSize['4xl'] * typography.lineHeight.tight,
		letterSpacing: typography.letterSpacing.tight,
	},
	h3: {
		fontFamily: typography.fonts.heading,
		fontSize: typography.fontSize['3xl'],
		lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
	},
	h4: {
		fontFamily: typography.fonts.heading,
		fontSize: typography.fontSize['2xl'],
		lineHeight: typography.fontSize['2xl'] * typography.lineHeight.normal,
	},
	h5: {
		fontFamily: typography.fonts.bodySemiBold,
		fontSize: typography.fontSize['2xl'],
		lineHeight: typography.fontSize['2xl'] * typography.lineHeight.normal,
	},
	h6: {
		fontFamily: typography.fonts.bodySemiBold,
		fontSize: typography.fontSize.xl,
		lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
	},
	body: {
		fontFamily: typography.fonts.body,
		fontSize: typography.fontSize.xl,
		lineHeight: typography.fontSize.xl * typography.lineHeight.relaxed,
	},
	bodyLarge: {
		fontFamily: typography.fonts.body,
		fontSize: typography.fontSize['2xl'],
		lineHeight: typography.fontSize['2xl'] * typography.lineHeight.relaxed,
	},
	bodySmall: {
		fontFamily: typography.fonts.body,
		fontSize: typography.fontSize.lg,
		lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
	},
	caption: {
		fontFamily: typography.fonts.body,
		fontSize: typography.fontSize.xs,
		lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
		color: colors.text.secondary,
	},
	label: {
		fontFamily: typography.fonts.bodyMedium,
		fontSize: typography.fontSize.sm,
		lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
		letterSpacing: typography.letterSpacing.wide,
		textTransform: 'uppercase',
	},
};

export const Text = ({
	variant = 'body',
	color,
	align,
	weight,
	style,
	truncated,
	ellipsizeMode = 'tail',
	children,
	...props
}: TextProps) => {
	const getFontFamily = () => {
		if (weight) {
			switch (weight) {
				case 'medium':
					return typography.fonts.bodyMedium;
				case 'semibold':
					return typography.fonts.bodySemiBold;
				case 'bold':
					return typography.fonts.bodyBold;
				default:
					return typography.fonts.body;
			}
		}
		return undefined;
	};

	const textStyle: TextStyle = {
		...variantStyles[variant],
		...(color && { color }),
		...(align && { textAlign: align }),
		...(getFontFamily() && { fontFamily: getFontFamily() }),
	};

	return (
		<RNText
			style={[textStyle, style]}
			numberOfLines={truncated ? 1 : undefined}
			ellipsizeMode={truncated ? ellipsizeMode : undefined}
			{...props}>
			{children}
		</RNText>
	);
};
