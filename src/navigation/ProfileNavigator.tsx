import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '../screens/mainApp/SettingsScreen';
import { EditProfileScreen } from '../screens/mainApp/EditProfileScreen';
import { ProfileScreen } from '../screens/mainApp/ProfileScreen';
import { colors, typography } from '../theme';

export const ProfileNavigator = () => {
	const ProfileStack = createNativeStackNavigator();

	return (
		<ProfileStack.Navigator
			screenOptions={{
				headerShown: true,
				headerStyle: {
					backgroundColor: colors.background.primary,
				},
				headerTintColor: colors.text.primary,
				headerTitleStyle: {
					fontFamily: typography.fonts.heading,
					fontSize: typography.fontSize.lg,
					color: colors.text.primary,
				},
				headerShadowVisible: false,
			}}>
			<ProfileStack.Screen
				name="Profile"
				component={ProfileScreen}
				options={{ headerShown: false }}
			/>
			<ProfileStack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					headerTitle: 'Settings',
					headerBackTitle: 'Profile',
				}}
			/>
			<ProfileStack.Screen
				name="Edit Profile"
				component={EditProfileScreen}
				options={{
					headerTitle: 'Edit Profile',
					headerBackTitle: 'Cancel',
				}}
			/>
		</ProfileStack.Navigator>
	);
};
