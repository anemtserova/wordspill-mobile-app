import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

interface IconStyledProps {
	icon: React.ComponentType<{
		width: number;
		height: number;
		color: string;
		strokeWidth?: number;
	}>;
	color?: string;
	width?: number;
	height?: number;
	strokeWidth?: number;
	containerSize?: number;
	backgroundColor?: string;
	marginRight?: number;
	containerStyle?: ViewStyle;
}

export const IconStyled = ({
	icon: Icon,
	color = colors.secondary.contrast,
	width = 24,
	height = 24,
	strokeWidth = 2,
	containerSize = 40,
	backgroundColor = colors.secondary.light,
	marginRight = spacing.md,
	containerStyle,
}: IconStyledProps) => {
	return (
		<View
			style={[
				styles.iconContainer,
				{
					width: containerSize,
					height: containerSize,
					borderRadius: containerSize / 2,
					backgroundColor,
					marginRight,
				},
				containerStyle,
			]}>
			<Icon
				width={width}
				height={height}
				color={color}
				strokeWidth={strokeWidth}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});
