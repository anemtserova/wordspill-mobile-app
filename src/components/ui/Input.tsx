import React from 'react';
import {
	TextInput,
	TextInputProps,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface InputProps extends TextInputProps {
	label?: string;
	error?: string;
	hint?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
	label,
	error,
	hint,
	leftIcon,
	rightIcon,
	containerStyle,
	style,
	...props
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			{label && (
				<Text variant="label" style={styles.label}>
					{label}
				</Text>
			)}
			<View
				style={[
					styles.inputContainer,
					error && styles.inputContainerError,
					props.editable === false && styles.inputContainerDisabled,
				]}>
				{leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
				<TextInput
					style={[
						styles.input,
						leftIcon ? styles.inputWithLeftIcon : undefined,
						rightIcon ? styles.inputWithRightIcon : undefined,
						style,
					]}
					placeholderTextColor={colors.text.tertiary}
					{...props}
				/>
				{rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
			</View>
			{error && (
				<Text variant="caption" style={styles.error}>
					{error}
				</Text>
			)}
			{hint && !error && (
				<Text variant="caption" style={styles.hint}>
					{hint}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.md,
	},
	label: {
		marginBottom: spacing.xs,
		color: colors.text.primary,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.background.primary,
		borderWidth: 1,
		borderColor: colors.border.medium,
		borderRadius: borderRadius.md,
		overflow: 'hidden',
	},
	inputContainerError: {
		borderColor: colors.semantic.error,
	},
	inputContainerDisabled: {
		backgroundColor: colors.background.secondary,
	},
	input: {
		flex: 1,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		fontSize: typography.fontSize.base,
		fontFamily: typography.fonts.body,
		color: colors.text.primary,
		minHeight: 48,
	},
	inputWithLeftIcon: {
		paddingLeft: spacing.sm,
	},
	inputWithRightIcon: {
		paddingRight: spacing.sm,
	},
	iconLeft: {
		paddingLeft: spacing.md,
	},
	iconRight: {
		paddingRight: spacing.md,
	},
	error: {
		marginTop: spacing.xs,
		color: colors.semantic.error,
	},
	hint: {
		marginTop: spacing.xs,
		color: colors.text.secondary,
	},
});
