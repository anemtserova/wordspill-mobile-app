import React from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	ViewStyle,
} from 'react-native';
import { MediaImage } from 'iconoir-react-native';
import { Text } from './Text';
import { Image } from './Image';
import { colors, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 200;

interface HeaderImagePickerProps {
	imageUri?: string | null;
	onPress: () => void;
	placeholder?: string;
	height?: number;
	containerStyle?: ViewStyle;
}

export const HeaderImagePicker = ({
	imageUri,
	onPress,
	placeholder = 'Add a header image',
	height = HEADER_HEIGHT,
	containerStyle,
}: HeaderImagePickerProps) => {
	return (
		<TouchableOpacity
			style={[styles.container, { height }, containerStyle]}
			onPress={onPress}
			activeOpacity={0.8}>
			{imageUri ? (
				<>
					<Image
						source={{ uri: imageUri }}
						style={styles.image}
						resizeMode="cover"
					/>
					{/* Overlay to indicate it's tappable */}
					<View style={styles.overlay}>
						<MediaImage
							width={24}
							height={24}
							color={colors.neutral.white}
							strokeWidth={2}
						/>
						<Text
							variant="bodySmall"
							color={colors.neutral.white}
							style={styles.overlayText}>
							Tap to change
						</Text>
					</View>
				</>
			) : (
				<View style={styles.emptyState}>
					<MediaImage
						width={48}
						height={48}
						color={colors.text.secondary}
						strokeWidth={2}
					/>
					<Text
						variant="body"
						color={colors.text.secondary}
						style={styles.placeholderText}>
						{placeholder}
					</Text>
					<Text variant="caption" color={colors.text.tertiary}>
						Tap to add image
					</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: colors.background.secondary,
		borderRadius: borderRadius.lg,
		overflow: 'hidden',
		position: 'relative',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		opacity: 0,
	},
	overlayText: {
		marginTop: spacing.xs,
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: spacing.sm,
	},
	placeholderText: {
		marginTop: spacing.xs,
	},
});
