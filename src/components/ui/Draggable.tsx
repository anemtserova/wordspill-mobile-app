import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Collection } from '../../types';
import { colors, spacing, borderRadius, shadows } from '../../theme';

interface DraggableProps {
	item: Collection;
	onDrag: (id: string, translationY: number) => void;
	onDrop: (id: string) => void;
}

export default function Draggable({ item, onDrag, onDrop }: DraggableProps) {
	const translateY = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	const panGesture = Gesture.Pan()
		.onUpdate((event) => {
			translateY.value = event.translationY;
			onDrag(item.id, event.translationY);
		})
		.onEnd(() => {
			translateY.value = withTiming(0);
			onDrop(item.id);
		});

	return (
		<GestureDetector gesture={panGesture}>
			<Animated.View style={[styles.draggable, animatedStyle]}>
				<Text style={styles.draggableText}>{item.name}</Text>
			</Animated.View>
		</GestureDetector>
	);
}

const styles = StyleSheet.create({
	draggable: {
		padding: spacing.md,
		backgroundColor: colors.background.secondary,
		marginVertical: spacing.xs,
		borderRadius: borderRadius.md,
		borderWidth: 1,
		borderColor: colors.border.light,
		...shadows.sm,
	},
	draggableText: {
		fontSize: 16,
		color: colors.text.primary,
		fontWeight: '500',
		fontFamily: 'PlayfairDisplay-Medium',
	},
});
