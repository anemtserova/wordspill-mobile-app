import React, { useState } from 'react';
import {
	TextInput,
	TextInputProps,
	StyleSheet,
	View,
	ViewStyle,
	TouchableOpacity,
} from 'react-native';

import { Text } from './Text';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { Eye, EyeClosed } from 'iconoir-react-native';

interface InputProps extends TextInputProps {
	label?: string;
	error?: string;
	hint?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	containerStyle?: ViewStyle;
}

export const Input = ({
	label,
	error,
	hint,
	leftIcon,
	rightIcon,
	containerStyle,
	style,
	...props
}: InputProps) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const isPasswordField = props.secureTextEntry;

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};

	const actualRightIcon = isPasswordField ? (
		<TouchableOpacity
			onPress={togglePasswordVisibility}
			hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
			{isPasswordVisible ? (
				<Eye width={20} height={20} color={colors.text.secondary} />
			) : (
				<EyeClosed width={20} height={20} color={colors.text.secondary} />
			)}
		</TouchableOpacity>
	) : (
		rightIcon
	);
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
						actualRightIcon ? styles.inputWithRightIcon : undefined,
						style,
					]}
					placeholderTextColor={colors.text.tertiary}
					{...props}
					secureTextEntry={isPasswordField && !isPasswordVisible}
				/>
				{actualRightIcon && (
					<View style={styles.iconRight}>{actualRightIcon}</View>
				)}
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
		backgroundColor: colors.background.secondary,
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
