import React, { useState } from 'react';
import {
	Image as RNImage,
	ImageProps as RNImageProps,
	StyleSheet,
	View,
	ViewStyle,
	ImageStyle,
	TouchableOpacity,
	Modal,
	Dimensions,
	Pressable,
} from 'react-native';
import { Xmark } from 'iconoir-react-native';
import { borderRadius, colors } from '../../theme';

type ImageVariant = 'default' | 'rounded' | 'circle' | 'thumbnail';
type ImageSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ImageProps extends RNImageProps {
	variant?: ImageVariant;
	size?: ImageSize;
	borderColor?: string;
	borderWidth?: number;
	clickable?: boolean;
	onPress?: () => void;
}

export const Image: React.FC<ImageProps> = ({
	variant = 'default',
	size = 'md',
	borderColor,
	borderWidth,
	clickable = false,
	onPress,
	style,
	...props
}) => {
	const [modalVisible, setModalVisible] = useState(false);

	const imageStyle: ImageStyle[] = [
		styles.base,
		styles[variant],
		typeof size === 'string' ? styles[`size_${size}`] : null,
		borderColor && { borderColor },
		borderWidth !== undefined && { borderWidth },
	].filter(Boolean) as ImageStyle[];

	const handlePress = () => {
		if (onPress) {
			onPress();
		} else if (clickable) {
			setModalVisible(true);
		}
	};

	const imageElement = <RNImage style={[imageStyle, style]} {...props} />;

	if (clickable || onPress) {
		return (
			<>
				<TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
					{imageElement}
				</TouchableOpacity>

				{clickable && !onPress && (
					<Modal
						visible={modalVisible}
						transparent
						animationType="fade"
						onRequestClose={() => setModalVisible(false)}>
						<View style={styles.modalContainer}>
							<Pressable
								style={styles.modalBackdrop}
								onPress={() => setModalVisible(false)}
							/>
							<View style={styles.modalContent}>
								<RNImage
									source={props.source}
									style={styles.modalImage}
									resizeMode="contain"
								/>
								<TouchableOpacity
									style={styles.closeButton}
									onPress={() => setModalVisible(false)}>
									<Xmark
										width={24}
										height={24}
										color={colors.neutral.white}
										strokeWidth={2.5}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
				)}
			</>
		);
	}

	return imageElement;
};

const styles = StyleSheet.create({
	base: {
		backgroundColor: colors.neutral.gray200,
	},
	default: {
		borderRadius: 0,
	},
	rounded: {
		borderRadius: borderRadius.lg,
	},
	circle: {
		borderRadius: 9999,
	},
	thumbnail: {
		borderRadius: borderRadius.md,
		borderWidth: 1,
		borderColor: colors.neutral.gray300,
	},
	size_sm: {
		width: 64,
		height: 64,
	},
	size_md: {
		width: 128,
		height: 128,
	},
	size_lg: {
		width: 256,
		height: 256,
	},
	size_xl: {
		width: 384,
		height: 384,
	},
	size_full: {
		width: '100%',
		height: '100%',
	},
	modalContainer: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.9)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalBackdrop: {
		...StyleSheet.absoluteFillObject,
	},
	modalContent: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalImage: {
		width: '90%',
		height: '90%',
	},
	closeButton: {
		position: 'absolute',
		top: 50,
		right: 20,
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
