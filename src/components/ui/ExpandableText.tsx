import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '../../theme';

interface ExpandableTextProps {
	children: string;
	numberOfLines?: number;
	variant?:
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
	color?: string;
	style?: any;
	expandText?: string;
	collapseText?: string;
	expandable?: boolean;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({
	children,
	numberOfLines = 4,
	variant = 'body',
	color,
	style,
	expandText = 'Read more',
	collapseText = 'Show less',
	expandable = true,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showButton, setShowButton] = useState(false);

	const handleTextLayout = (e: any) => {
		if (!expandable) return;

		const { lines } = e.nativeEvent;
		if (lines && lines.length > numberOfLines) {
			setShowButton(true);
		}
	};

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<View style={styles.container}>
			<Text
				variant={variant}
				color={color}
				align="justify"
				style={style}
				numberOfLines={!isExpanded && showButton ? numberOfLines : undefined}
				onTextLayout={handleTextLayout}>
				{children}
			</Text>

			{showButton && (
				<TouchableOpacity
					onPress={toggleExpanded}
					style={styles.button}
					activeOpacity={0.7}>
					<Text
						variant="bodySmall"
						color={colors.accent.teal}
						weight="semibold">
						{isExpanded ? collapseText : expandText}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	button: {
		marginTop: spacing.xs,
		alignSelf: 'flex-start',
	},
});
