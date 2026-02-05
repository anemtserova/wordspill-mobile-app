import React from 'react';
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ViewStyle,
	TextInputProps,
} from 'react-native';
import { Search, Xmark } from 'iconoir-react-native';
import { colors, spacing, borderRadius } from '../../theme';

type SearchBarVariant = 'default' | 'filled';

interface SearchBarProps extends TextInputProps {
	variant?: SearchBarVariant;
	onClear?: () => void;
	containerStyle?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
	variant = 'default',
	value,
	onClear,
	containerStyle,
	placeholder = 'Search...',
	...props
}) => {
	const showClearButton = value && value.length > 0;

	return (
		<View style={[styles.container, styles[variant], containerStyle]}>
			<Search
				width={20}
				height={20}
				color={colors.text.secondary}
				strokeWidth={2}
			/>
			<TextInput
				style={styles.input}
				placeholder={placeholder}
				placeholderTextColor={colors.text.secondary}
				value={value}
				{...props}
			/>
			{showClearButton && onClear && (
				<TouchableOpacity
					onPress={onClear}
					style={styles.clearButton}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
					<Xmark
						width={18}
						height={18}
						color={colors.text.secondary}
						strokeWidth={2}
					/>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: borderRadius.lg,
		gap: spacing.sm,
	},
	default: {
		backgroundColor: colors.neutral.white,
		borderWidth: 1,
		borderColor: colors.neutral.gray300,
	},
	filled: {
		backgroundColor: colors.neutral.gray100,
	},
	input: {
		flex: 1,
		fontSize: 16,
		fontFamily: 'Jost-Regular',
		color: colors.text.primary,
		padding: 0,
	},
	clearButton: {
		padding: spacing.xs,
	},
});
