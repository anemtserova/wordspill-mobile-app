import { View, StyleSheet } from 'react-native';
import { ScreenHeader, Text } from '../../components/ui';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { ScrollView } from 'react-native-gesture-handler';

export const SettingsScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	return (
		<View style={styles.container}>
			<ScreenHeader title="Settings" onBackPress={() => navigation.goBack()} />
			<ScrollView
				contentContainerStyle={{ padding: 16 }}
				showsVerticalScrollIndicator={false}>
				<Text variant="body" color={colors.text.secondary}>
					Here you can customize your app settings, manage your account, and
					configure your preferences. Explore the options to make Wordspill
					truly yours!
				</Text>
				<Text
					variant="label"
					weight="bold"
					color={colors.text.secondary}
					style={{ margin: 16 }}>
					More settings coming soon...
				</Text>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
});
