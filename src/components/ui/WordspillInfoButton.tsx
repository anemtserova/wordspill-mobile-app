import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../../theme';
import { Text } from './Text';
import { WSLogo } from './WSLogo';

interface WordspillInfoButtonProps {
	navigation: NativeStackNavigationProp<any>;
}

export const WordspillInfoButton = ({
	navigation,
}: WordspillInfoButtonProps) => {
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate('App Info')}
			style={styles.infoLink}>
			<Text variant="h6" color={colors.text.accent}>
				Learn more about
			</Text>
			<WSLogo width={45} height={45} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	infoLink: {
		alignItems: 'center',
		marginTop: spacing.sm,
	},
});
