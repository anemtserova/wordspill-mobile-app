import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export const GetStartedScreen = () => {
	const navigation = useNavigation();

	const swipeGesture = Gesture.Pan().onEnd((event) => {
		if (event.translationX > 50) {
			navigation.goBack();
		}
	});

	return (
		<GestureDetector gesture={swipeGesture}>
			<View style={styles.container}>
				<Video
					source={require('../../../assets/onboarding/lets_start_onboarding.mp4')}
					style={styles.video}
					resizeMode={ResizeMode.COVER}
					shouldPlay
					isLooping
					isMuted
				/>
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
		width: width,
		height: height,
	},
});
