import React from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ViewStyle,
	Alert,
} from 'react-native';
import { MediaImage, Plus, Xmark } from 'iconoir-react-native';
import { Text } from './Text';
import { Image } from './Image';
import { colors, spacing, borderRadius } from '../../theme';

interface ImagePickerProps {
	images: string[];
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
				'Maximum Images Reached',
				`You can only add up to ${maxImages} images.`,
			);
			return;
		}
		onAddImage();
	};

	return (
		<View style={[styles.container, containerStyle]}>
			{/* Image Grid */}
			<View style={styles.imagesGrid}>
				{images.map((imageUri, index) => (
					<View key={index} style={styles.imageContainer}>
						<Image
							source={{ uri: imageUri }}
							variant="rounded"
							size="md"
							resizeMode="cover"
						/>
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
				))}

				{/* Add Image Button */}
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
							Add Image
						</Text>
					</TouchableOpacity>
				)}
			</View>

			{/* Image Count */}
			{images.length > 0 && (
				<Text
					variant="caption"
					color={colors.text.secondary}
					style={styles.imageCount}>
					{images.length} / {maxImages} images
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
