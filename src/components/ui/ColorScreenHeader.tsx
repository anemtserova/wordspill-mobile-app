import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { NavArrowLeft } from 'iconoir-react-native';
import { Text } from './Text';
import { colors, spacing } from '../../theme';

interface ColorScreenHeaderProps {
	title: string;
	subtitle?: string;
	icon: React.ReactNode;
	backgroundColor?: string;
	onBackPress: () => void;
	style?: ViewStyle;
}

export const ColorScreenHeader = ({
	title,
	subtitle,
	icon,
	backgroundColor = colors.primary.main,
	onBackPress,
	style,
}: ColorScreenHeaderProps) => {
	return (
		<View style={[styles.header, { backgroundColor }, style]}>
			<View style={styles.headerTop}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={onBackPress}
					activeOpacity={0.7}>
					<NavArrowLeft
						width={24}
						height={24}
						color={colors.neutral.white}
						strokeWidth={2.5}
					/>
				</TouchableOpacity>

				{icon}

				<Text
					variant="h3"
					color={colors.neutral.white}
					style={styles.headerTitle}>
					{title}
				</Text>
			</View>

			{subtitle && (
				<Text
					variant="label"
					color={colors.neutral.white}
					style={styles.subtitle}>
					{subtitle}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		paddingTop: spacing.lg,
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.lg,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
	},
	headerTop: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		marginBottom: spacing.md,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		flex: 1,
	},
	subtitle: {
		opacity: 0.9,
		marginLeft: spacing['2xl'] + spacing.sm,
	},
});
