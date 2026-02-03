import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme';

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps extends ViewProps {
	variant?: CardVariant;
	padding?: keyof typeof spacing;
	children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
	variant = 'elevated',
	padding = 'md',
	style,
	children,
	...props
}) => {
	const cardStyle: ViewStyle[] = [
		styles.base,
		styles[variant],
		{ padding: spacing[padding] },
	];

	return (
		<View style={[cardStyle, style]} {...props}>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	base: {
		borderRadius: borderRadius.lg,
		backgroundColor: colors.background.primary,
	},
	elevated: {
		...shadows.md,
	},
	outlined: {
		borderWidth: 1,
		borderColor: colors.border.light,
	},
	filled: {
		backgroundColor: colors.background.secondary,
	},
});
