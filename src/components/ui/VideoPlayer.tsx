import React, { useState, useRef, useEffect } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	ViewStyle,
	Text as RNText,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Play, Pause } from 'iconoir-react-native';
import { colors, spacing } from '../../theme';

interface VideoPlayerProps {
	uri: string;
	style?: ViewStyle;
	thumbnailUri?: string;
}

export const VideoPlayer = ({ uri, style, thumbnailUri }: VideoPlayerProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const videoRef = useRef(null);

	const player = useVideoPlayer(uri, (player) => {
		player.loop = false;
		player.muted = false;
	});

	useEffect(() => {
		if (!player) return;

		const statusSubscription = player.addListener('statusChange', (status) => {
			if (status.status === 'readyToPlay') {
				setIsLoading(false);
			} else if (status.status === 'error') {
				setHasError(true);
				setIsLoading(false);
			}
		});

		return () => {
			statusSubscription.remove();
		};
	}, [player]);

	const togglePlayPause = () => {
		if (player.playing) {
			player.pause();
		} else {
			player.play();
		}
	};

	return (
		<View style={[styles.container, style]}>
			<VideoView
				ref={videoRef}
				player={player}
				style={styles.video}
				contentFit="cover"
				allowsFullscreen
				allowsPictureInPicture
			/>

			{isLoading && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="large" color={colors.primary.main} />
				</View>
			)}

			{hasError && (
				<View style={styles.errorOverlay}>
					<RNText style={styles.errorText}>Failed to load video</RNText>
				</View>
			)}

			{!isLoading && !hasError && (
				<TouchableOpacity
					style={styles.playPauseButton}
					onPress={togglePlayPause}
					activeOpacity={0.7}>
					<View style={styles.playPauseCircle}>
						{player.playing ? (
							<Pause
								width={24}
								height={24}
								color={colors.neutral.white}
								strokeWidth={2.5}
							/>
						) : (
							<Play
								width={24}
								height={24}
								color={colors.neutral.white}
								strokeWidth={2.5}
							/>
						)}
					</View>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		backgroundColor: colors.neutral.black,
		borderRadius: 8,
		overflow: 'hidden',
	},
	video: {
		width: '100%',
		height: '100%',
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background.secondary,
	},
	errorOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background.secondary,
	},
	errorText: {
		color: colors.semantic.error,
		fontSize: 14,
	},
	playPauseButton: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: [{ translateX: -30 }, { translateY: -30 }],
	},
	playPauseCircle: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
