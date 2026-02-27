import React from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { colors } from '../../theme';

export const OnboardingScreen = () => {
	const insets = useSafeAreaInsets();
	const { completeOnboarding } = useOnboarding();

	const handleGetStarted = async () => {
		await completeOnboarding();
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<StatusBar barStyle="dark-content" />

			<View style={styles.content}>
				{/* Image container - you can replace the source with your own image */}
				<View style={styles.imageContainer}>
					<Image
						source={require('../../../assets/icon.png')}
						style={styles.image}
						resizeMode="contain"
					/>
				</View>

				{/* Get Started button at the bottom */}
				<View
					style={[
						styles.buttonContainer,
						{ paddingBottom: insets.bottom + 24 },
					]}>
					<Button variant="primary" size="lg" onPress={handleGetStarted}>
						Get Started
					</Button>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.neutral.cream,
	},
	content: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	imageContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 32,
		paddingTop: 60,
	},
	image: {
		width: '100%',
		height: '100%',
		maxWidth: 400,
		maxHeight: 400,
	},
	buttonContainer: {
		width: '100%',
		paddingHorizontal: 24,
		paddingTop: 24,
	},
});
