import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '../screens/mainApp/SettingsScreen';
import { EditProfileScreen } from '../screens/mainApp/EditProfileScreen';
import { ProfileScreen } from '../screens/mainApp/ProfileScreen';

export const ProfileNavigator = () => {
	const ProfileStack = createNativeStackNavigator();

	return (
		<ProfileStack.Navigator screenOptions={{ headerShown: false }}>
			<ProfileStack.Screen name="Profile" component={ProfileScreen} />
			<ProfileStack.Screen name="Settings" component={SettingsScreen} />
			<ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
		</ProfileStack.Navigator>
	);
};
