import React, { useState } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text } from '../../components/ui';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { colors, shadows, spacing } from '../../theme';

export const OnboardingScreen = () => {
	const insets = useSafeAreaInsets();
	const { completeOnboarding } = useOnboarding();
	const [imageError, setImageError] = useState(false);

	const handleGetStarted = async () => {
		await completeOnboarding();
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<StatusBar barStyle="dark-content" />

			<View style={styles.content}>
				<View style={styles.imageContainer}>
					<Image
						source={require('../../../assets/icon.png')}
						style={styles.image}
						resizeMode="contain"
						onError={(error) => {
							console.error('Image load error:', error.nativeEvent);
							setImageError(true);
						}}
						onLoad={() => {
							console.log('Image loaded successfully');
						}}
					/>
					{imageError && (
						<Text variant="body" color={colors.semantic.error}>
							Failed to load icon
						</Text>
					)}
				</View>

				<View
					style={[
						styles.buttonContainer,
						{ paddingBottom: insets.bottom + 24 },
					]}>
					<Button variant="accent" size="lg" onPress={handleGetStarted}>
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
		width: '100%',
	},
	image: {
		width: 380,
		height: 380,
		borderRadius: 100,
		...shadows.lg,
	},
	buttonContainer: {
		width: '100%',
		paddingHorizontal: 24,
		paddingTop: 24,
	},
});
