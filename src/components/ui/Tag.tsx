import React from 'react';
import {
	View,
	TouchableOpacity,
	StyleSheet,
	ViewStyle,
	TextStyle,
} from 'react-native';
import { Xmark } from 'iconoir-react-native';
import { Text } from './Text';
import { colors, spacing } from '../../theme';

type TagVariant =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'accent'
	| 'success'
	| 'warning'
	| 'error';
type TagSize = 'sm' | 'md' | 'lg';

interface TagProps {
	variant?: TagVariant;
	size?: TagSize;
	outlined?: boolean;
	removable?: boolean;
	onRemove?: () => void;
	onPress?: () => void;
	style?: ViewStyle;
	children: React.ReactNode;
}

export const Tag = ({
	variant = 'default',
	size = 'md',
	outlined = false,
	removable = false,
	onRemove,
	onPress,
	style,
	children,
}: TagProps) => {
	const tagStyle: ViewStyle[] = [
		styles.base,
		outlined ? styles[`outlined_${variant}`] : styles[`filled_${variant}`],
		styles[`size_${size}`],
	].filter(Boolean) as ViewStyle[];

	const textColor = outlined
		? getOutlinedTextColor(variant)
		: getFilledTextColor(variant);

	const content = (
		<>
			<Text
				style={
					[styles.text, styles[`text_${size}`], { color: textColor }].filter(
						Boolean,
					) as TextStyle[]
				}>
				{children}
			</Text>
			{removable && (
				<TouchableOpacity
					onPress={onRemove}
					style={styles.removeButton}
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
					<Xmark width={14} height={14} color={textColor} strokeWidth={2.5} />
				</TouchableOpacity>
			)}
		</>
	);

	if (onPress && !removable) {
		return (
			<TouchableOpacity
				style={[tagStyle, style]}
				onPress={onPress}
				activeOpacity={0.7}>
				{content}
			</TouchableOpacity>
		);
	}

	return <View style={[tagStyle, style]}>{content}</View>;
};

const getFilledTextColor = (variant: TagVariant): string => {
	switch (variant) {
		case 'primary':
			return colors.primary.contrast;
		case 'secondary':
			return colors.secondary.contrast;
		case 'accent':
			return colors.primary.main;
		case 'success':
			return colors.neutral.white;
		case 'warning':
			return colors.primary.main;
		case 'error':
			return colors.neutral.white;
		case 'default':
		default:
			return colors.text.primary;
	}
};

const getOutlinedTextColor = (variant: TagVariant): string => {
	switch (variant) {
		case 'primary':
			return colors.primary.main;
		case 'secondary':
			return colors.secondary.main;
		case 'accent':
			return colors.accent.gold;
		case 'success':
			return colors.semantic.success;
		case 'warning':
			return colors.semantic.warning;
		case 'error':
			return colors.semantic.error;
		case 'default':
		default:
			return colors.text.primary;
	}
};

const styles = StyleSheet.create({
	base: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		borderRadius: 100, // Pill shape
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
	},

	// Filled variants
	filled_default: {
		backgroundColor: colors.neutral.gray200,
	},
	filled_primary: {
		backgroundColor: colors.primary.main,
	},
	filled_secondary: {
		backgroundColor: colors.secondary.main,
	},
	filled_accent: {
		backgroundColor: colors.accent.gold,
	},
	filled_success: {
		backgroundColor: colors.semantic.success,
	},
	filled_warning: {
		backgroundColor: colors.semantic.warning,
	},
	filled_error: {
		backgroundColor: colors.semantic.error,
	},

	// Outlined variants
	outlined_default: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.neutral.gray300,
	},
	outlined_primary: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.primary.main,
	},
	outlined_secondary: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.secondary.main,
	},
	outlined_accent: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.accent.gold,
	},
	outlined_success: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.semantic.success,
	},
	outlined_warning: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.semantic.warning,
	},
	outlined_error: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.semantic.error,
	},

	// Sizes
	size_sm: {
		paddingHorizontal: spacing.xs,
		paddingVertical: 2,
	},
	size_md: {
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
	},
	size_lg: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
	},

	// Text styles
	text: {
		fontFamily: 'Jost-Medium',
	},
	text_sm: {
		fontSize: 12,
		lineHeight: 16,
	},
	text_md: {
		fontSize: 14,
		lineHeight: 18,
	},
	text_lg: {
		fontSize: 16,
		lineHeight: 20,
	},

	// Remove button
	removeButton: {
		marginLeft: spacing.xs,
		width: 16,
		height: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
