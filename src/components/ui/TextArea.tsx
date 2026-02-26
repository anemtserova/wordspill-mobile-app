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

interface TextAreaProps extends TextInputProps {
	label?: string;
	error?: string;
	hint?: string;
	containerStyle?: ViewStyle;
	minHeight?: number;
	maxLength?: number;
	showCount?: boolean;
}

export const TextArea = ({
	label,
	error,
	hint,
	containerStyle,
	minHeight = 120,
	maxLength,
	showCount = false,
	value,
	style,
	...props
}: TextAreaProps) => {
	const characterCount = value?.length || 0;

	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.labelRow}>
				{label && (
					<Text variant="label" style={styles.label}>
						{label}
					</Text>
				)}
				{showCount && maxLength && (
					<Text variant="caption" style={styles.count}>
						{characterCount}/{maxLength}
					</Text>
				)}
			</View>
			<View
				style={[
					styles.inputContainer,
					{ minHeight },
					error && styles.inputContainerError,
				]}>
				<TextInput
					style={[styles.input, style]}
					placeholderTextColor={colors.text.tertiary}
					multiline
					textAlignVertical="top"
					maxLength={maxLength}
					value={value}
					{...props}
				/>
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
	labelRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.xs,
	},
	label: {
		color: colors.text.primary,
	},
	count: {
		color: colors.text.tertiary,
	},
	inputContainer: {
		backgroundColor: colors.background.secondary,
		borderWidth: 1,
		borderColor: colors.border.medium,
		borderRadius: borderRadius.md,
		padding: spacing.md,
	},
	inputContainerError: {
		borderColor: colors.semantic.error,
	},
	input: {
		fontSize: typography.fontSize.base,
		fontFamily: typography.fonts.body,
		color: colors.text.primary,
		lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
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
