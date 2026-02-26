import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme';

type CardVariant = 'elevated' | 'outlined' | 'filled';
type CardOrientation = 'vertical' | 'horizontal';

interface CardProps extends ViewProps {
	variant?: CardVariant;
	orientation?: CardOrientation;
	padding?: keyof typeof spacing;
	children: React.ReactNode;
}

export const Card = ({
	variant = 'elevated',
	orientation = 'vertical',
	padding = 'md',
	style,
	children,
	...props
}: CardProps) => {
	const cardStyle: ViewStyle[] = [
		styles.base,
		styles[variant],
		orientation === 'horizontal' ? styles.horizontal : undefined,
		{ padding: spacing[padding] },
	].filter(Boolean) as ViewStyle[];

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
	horizontal: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});
