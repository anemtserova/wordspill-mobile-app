import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabNavigator } from './TabNavigator';

import { EntryNavigator } from './EntryNavigator';

const MainAppStack = createNativeStackNavigator();

export const MainAppNavigator = () => {
	return (
		<MainAppStack.Navigator screenOptions={{ headerShown: false }}>
			<MainAppStack.Screen name="Tabs" component={TabNavigator} />
			<MainAppStack.Screen name="Entries" component={EntryNavigator} />
		</MainAppStack.Navigator>
	);
};
