import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors } from '../../theme';
import { Text } from '../../components/ui';

const iconImage = require('../../../assets/icon.png');

export const LoadingScreen = () => {
	return (
		<View style={styles.container}>
			<Text
				variant="h2"
				color={colors.primary.main}
				style={styles.logoContainer}>
				Wordspill is Loading
			</Text>
			<ActivityIndicator
				size="large"
				color={colors.primary.main}
				style={styles.loader}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.neutral.cream,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logoContainer: {
		marginBottom: 40,
	},
	loader: {
		marginTop: 20,
	},
});
