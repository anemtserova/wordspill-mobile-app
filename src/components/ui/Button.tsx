import React from 'react';
import {
	TouchableOpacity,
	TouchableOpacityProps,
	StyleSheet,
	ActivityIndicator,
	ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	children: React.ReactNode;
}

export const Button = ({
	variant = 'primary',
	size = 'md',
	loading = false,
	fullWidth = false,
	leftIcon,
	rightIcon,
	disabled,
	style,
	children,
	...props
}: ButtonProps) => {
	const buttonStyle: ViewStyle[] = [
		styles.base,
		styles[variant],
		styles[`size_${size}`],
		fullWidth && styles.fullWidth,
		disabled && styles.disabled,
	].filter(Boolean) as ViewStyle[];

	const textColor = getTextColor(variant);

	return (
		<TouchableOpacity
			style={[buttonStyle, style]}
			disabled={disabled || loading}
			activeOpacity={0.7}
			{...props}>
			{loading ? (
				<ActivityIndicator color={textColor} />
			) : (
				<>
					{leftIcon && <>{leftIcon}</>}
					<Text
						style={[styles.text, styles[`text_${size}`], { color: textColor }]}>
						{children}
					</Text>
					{rightIcon && <>{rightIcon}</>}
				</>
			)}
		</TouchableOpacity>
	);
};

const getTextColor = (variant: ButtonVariant): string => {
	switch (variant) {
		case 'primary':
			return colors.primary.contrast;
		case 'secondary':
			return colors.secondary.contrast;
		case 'outline':
			return colors.primary.main;
		case 'ghost':
			return colors.primary.main;
		case 'accent':
			return colors.neutral.white;
		default:
			return colors.neutral.white;
	}
};

const styles = StyleSheet.create({
	base: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: borderRadius.lg,
		gap: spacing.sm,
	},
	primary: {
		backgroundColor: colors.primary.main,
		...shadows.md,
	},
	secondary: {
		backgroundColor: colors.secondary.main,
		...shadows.md,
	},
	outline: {
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: colors.primary.main,
	},
	ghost: {
		backgroundColor: 'transparent',
	},
	accent: {
		backgroundColor: colors.accent.gold,
		...shadows.md,
	},
	disabled: {
		opacity: 0.5,
	},
	size_sm: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		minHeight: 36,
	},
	size_md: {
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		minHeight: 48,
	},
	size_lg: {
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.lg,
		minHeight: 56,
	},
	fullWidth: {
		width: '100%',
	},
	text: {
		fontWeight: '600',
	},
	text_sm: {
		fontSize: 14,
	},
	text_md: {
		fontSize: 16,
	},
	text_lg: {
		fontSize: 18,
	},
});
