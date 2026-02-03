import React, { useRef, useState } from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
	StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/ui';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
	id: string;
	video: any;
}

const slides: OnboardingSlide[] = [
	{
		id: 'welcome',
		video: require('../../../assets/onboarding/1.mp4'),
	},
	{
		id: 'travel',
		video: require('../../../assets/onboarding/2.mp4'),
	},
	{
		id: 'diary',
		video: require('../../../assets/onboarding/3.mp4'),
	},
	{
		id: 'fiction',
		video: require('../../../assets/onboarding/4.mp4'),
	},
	{
		id: 'getstarted',
		video: require('../../../assets/onboarding/5.mp4'),
	},
];

export const OnboardingCarousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const flatListRef = useRef<FlatList>(null);
	const { completeOnboarding } = useOnboarding();
	const insets = useSafeAreaInsets();

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetX = event.nativeEvent.contentOffset.x;
		const index = Math.round(offsetX / width);
		setCurrentIndex(index);
	};

	const handleGetStarted = async () => {
		await completeOnboarding();
	};

	const renderItem = ({ item }: { item: OnboardingSlide }) => (
		<View style={styles.slide}>
			<Video
				source={item.video}
				style={[styles.video, { marginTop: -insets.top }]}
				resizeMode={ResizeMode.CONTAIN}
				shouldPlay
				isLooping
				isMuted
			/>
		</View>
	);

	return (
		<View style={styles.container}>
			<FlatList
				ref={flatListRef}
				data={slides}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			/>

			{/* Pagination Dots */}
			<View style={styles.pagination}>
				{slides.map((_, index) => (
					<View
						key={index}
						style={[styles.dot, currentIndex === index && styles.activeDot]}
					/>
				))}
			</View>

			{/* Get Started Button - Only on last slide */}
			{currentIndex === slides.length - 1 && (
				<Animated.View
					entering={FadeInUp.delay(300).duration(1000)}
					style={styles.buttonContainer}>
					<Button variant="secondary" fullWidth onPress={handleGetStarted}>
						Get Started
					</Button>
				</Animated.View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	slide: {
		width: width,
		height: height,
		backgroundColor: '#000',
		justifyContent: 'center',
		alignItems: 'center',
	},
	video: {
		width: width,
		height: height,
	},
	pagination: {
		position: 'absolute',
		bottom: 120,
		flexDirection: 'row',
		alignSelf: 'center',
		gap: 8,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
	},
	activeDot: {
		backgroundColor: '#fff',
		width: 24,
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 60,
		left: 30,
		right: 30,
	},
});
