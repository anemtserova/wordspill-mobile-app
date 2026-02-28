import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors, shadows, spacing } from '../../theme';
import { Text } from '../../components/ui';

export const LoadingScreen = () => {
	return (
		<View style={styles.container}>
			<Text
				variant="h2"
				color={colors.primary.main}
				style={styles.logoContainer}>
				Wordspill is Loading ...
			</Text>
			<Image
				source={require('../../../assets/icon.png')}
				style={{
					width: 100,
					height: 100,
					borderRadius: spacing.lg,
					...shadows.md,
				}}
				resizeMode="contain"
			/>
			<ActivityIndicator
				size="large"
				color={colors.primary.main}
				style={styles.loader}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.neutral.cream,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logoContainer: {
		marginBottom: 40,
	},
	loader: {
		marginTop: 20,
	},
});
