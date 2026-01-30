import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CategoriesScreen } from '../screens/mainApp/CategoriesScreen';
import { HomeScreen } from '../screens/mainApp/HomeScreen';
import { ProfileNavigator } from './ProfileNavigator';

export const TabNavigator = () => {
	const Tabs = createBottomTabNavigator();

	return (
		<Tabs.Navigator>
			<Tabs.Screen name="Home" component={HomeScreen} />
			<Tabs.Screen name="Categories" component={CategoriesScreen} />
			<Tabs.Screen name="Profile" component={ProfileNavigator} />
		</Tabs.Navigator>
	);
};
