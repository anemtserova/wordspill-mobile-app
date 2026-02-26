import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'iconoir-react-native';
import { Text } from './Text';
import { colors, spacing } from '../../theme';

interface ScreenHeaderProps {
	title: string;
	onBackPress?: () => void;
	showBackButton?: boolean;
	rightComponent?: React.ReactNode;
	style?: ViewStyle;
}

export const ScreenHeader = ({
	title,
	onBackPress,
	showBackButton = true,
	rightComponent,
	style,
}: ScreenHeaderProps) => {
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.header, { paddingTop: spacing.sm }, style]}>
			{showBackButton ? (
				<TouchableOpacity
					onPress={onBackPress}
					style={styles.backButton}
					activeOpacity={0.7}>
					<ArrowLeft
						width={24}
						height={24}
						color={colors.text.primary}
						strokeWidth={2}
					/>
				</TouchableOpacity>
			) : (
				<View style={styles.leftSpacer} />
			)}

			<Text variant="h5" numberOfLines={1} style={styles.title}>
				{title}
			</Text>

			{rightComponent ? (
				<View style={styles.rightContainer}>{rightComponent}</View>
			) : (
				<View style={styles.rightSpacer} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.sm,
		backgroundColor: colors.background.secondary,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.medium,
		borderBottomLeftRadius: 36,
		borderBottomRightRadius: 36,
	},
	backButton: {
		padding: spacing.xs,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	leftSpacer: {
		width: 40,
	},
	title: {
		flex: 1,
		textAlign: 'center',
		marginHorizontal: spacing.sm,
	},
	rightContainer: {
		width: 40,
		alignItems: 'flex-end',
	},
	rightSpacer: {
		width: 40,
	},
});
