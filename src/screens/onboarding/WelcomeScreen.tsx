import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/ui';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = () => {
	const navigation = useNavigation();

	const swipeGesture = Gesture.Pan().onEnd((event) => {
		if (event.translationX < -50) {
			navigation.navigate('Travel' as never);
		}
	});

	return (
		<GestureDetector gesture={swipeGesture}>
			<View style={styles.container}>
				{/* Background Video */}
				<Video
					source={require('../../../assets/onboarding/Wordspill_onboarding.mp4')}
					style={styles.video}
					resizeMode={ResizeMode.COVER}
					shouldPlay
					isLooping
					isMuted
				/>

				{/* Get Started Button */}
				<Animated.View
					entering={FadeInUp.delay(600).duration(1000)}
					style={styles.buttonContainer}>
					<Button
						variant="secondary"
						fullWidth
						onPress={() => navigation.navigate('Travel' as never)}>
						Get Started
					</Button>
				</Animated.View>
			</View>
		</GestureDetector>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	video: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: width,
		height: height,
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 60,
		left: 30,
		right: 30,
	},
});
