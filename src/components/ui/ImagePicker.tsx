import React, { useMemo } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ViewStyle,
	Alert,
} from 'react-native';
import { MediaImage, Plus, Xmark, Play } from 'iconoir-react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Text } from './Text';
import { Image } from './Image';
import { colors, spacing, borderRadius } from '../../theme';

interface MediaItemType {
	uri: string;
	type?: 'image' | 'video';
}

interface ImagePickerProps {
	images: string[] | MediaItemType[];
	onAddImage: () => void;
	onRemoveImage: (index: number) => void;
	maxImages?: number;
	containerStyle?: ViewStyle;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
	images,
	onAddImage,
	onRemoveImage,
	maxImages = 5,
	containerStyle,
}) => {
	const canAddMore = images.length < maxImages;

	const handleAddImage = () => {
		if (!canAddMore) {
			Alert.alert(
				'Maximum Media Reached',
				`You can only add up to ${maxImages} items.`,
			);
			return;
		}
		onAddImage();
	};

	const isVideo = (item: string | MediaItemType): boolean => {
		if (typeof item === 'string') {
			return item.toLowerCase().match(/\\.(mp4|mov|avi|webm)$/i) !== null;
		}
		return item.type === 'video';
	};

	const getUri = (item: string | MediaItemType): string => {
		return typeof item === 'string' ? item : item.uri;
	};

	const VideoPreview: React.FC<{ uri: string }> = ({ uri }) => {
		const player = useVideoPlayer(uri, (player) => {
			player.pause();
			player.muted = true;
		});

		return (
			<View style={styles.videoContainer}>
				<VideoView
					player={player}
					style={styles.video}
					nativeControls={false}
					contentFit="cover"
				/>

				<View style={styles.playOverlay}>
					<Play
						width={32}
						height={32}
						color={colors.neutral.white}
						strokeWidth={2}
					/>
				</View>
			</View>
		);
	};

	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.imagesGrid}>
				{images.map((item, index) => {
					const uri = getUri(item);
					const isVideoItem = isVideo(item);

					return (
						<View key={index} style={styles.imageContainer}>
							{isVideoItem ? (
								<VideoPreview uri={uri} />
							) : (
								<Image
									source={{ uri }}
									variant="rounded"
									size="md"
									resizeMode="cover"
								/>
							)}
							<TouchableOpacity
								style={styles.removeButton}
								onPress={() => onRemoveImage(index)}>
								<Xmark
									width={16}
									height={16}
									color={colors.neutral.white}
									strokeWidth={2.5}
								/>
							</TouchableOpacity>
						</View>
					);
				})}

				{canAddMore && (
					<TouchableOpacity
						style={styles.addButton}
						onPress={handleAddImage}
						activeOpacity={0.7}>
						<Plus
							width={32}
							height={32}
							color={colors.text.secondary}
							strokeWidth={2}
						/>
						<Text variant="bodySmall" color={colors.text.secondary}>
							Add Media
						</Text>
					</TouchableOpacity>
				)}
			</View>

			{images.length > 0 && (
				<Text
					variant="caption"
					color={colors.text.secondary}
					style={styles.imageCount}>
					{images.length} / {maxImages} items
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	imagesGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.md,
	},
	imageContainer: {
		position: 'relative',
	},
	videoContainer: {
		width: 128,
		height: 128,
		borderRadius: borderRadius.lg,
		overflow: 'hidden',
		backgroundColor: colors.neutral.gray800,
		position: 'relative',
	},
	video: {
		width: '100%',
		height: '100%',
	},
	playOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
	},
	removeButton: {
		position: 'absolute',
		top: spacing.xs,
		right: spacing.xs,
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	addButton: {
		width: 128,
		height: 128,
		borderRadius: borderRadius.lg,
		borderWidth: 2,
		borderColor: colors.neutral.gray300,
		borderStyle: 'dashed',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.neutral.gray50,
		gap: spacing.xs,
	},
	imageCount: {
		marginTop: spacing.sm,
	},
});
