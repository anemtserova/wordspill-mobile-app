import { spacing, shadows } from '../../theme';
import { Image } from 'react-native';

export const WSLogo = ({
	width,
	height,
}: {
	width?: number;
	height?: number;
}) => {
	return (
		<Image
			source={require('../../../assets/icon.png')}
			style={{
				width: width || 80,
				height: height || 80,
				borderRadius: width ? width / 3.3 : 24,
				...shadows.sm,
				marginBottom: spacing.sm,
			}}
			resizeMode="contain"
		/>
	);
};
