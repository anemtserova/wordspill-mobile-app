import React from 'react';
import {
	Image as RNImage,
	ImageProps as RNImageProps,
	StyleSheet,
	View,
	ViewStyle,
	ImageStyle,
} from 'react-native';
import { borderRadius, colors } from '../../theme';

type ImageVariant = 'default' | 'rounded' | 'circle' | 'thumbnail';
type ImageSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ImageProps extends RNImageProps {
	variant?: ImageVariant;
	size?: ImageSize;
	aspectRatio?: number;
	borderColor?: string;
	borderWidth?: number;
}

export const Image: React.FC<ImageProps> = ({
	variant = 'default',
	size = 'md',
	aspectRatio,
	borderColor,
	borderWidth,
	style,
	...props
}) => {
	const imageStyle: ImageStyle[] = [
		styles.base,
		styles[variant],
		typeof size === 'string' ? styles[`size_${size}`] : null,
		aspectRatio && { aspectRatio },
		borderColor && { borderColor },
		borderWidth !== undefined && { borderWidth },
	].filter(Boolean) as ImageStyle[];

	return <RNImage style={[imageStyle, style]} {...props} />;
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
});
