import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabNavigator } from './TabNavigator';
import { AddEntryScreen } from '../screens/mainApp/AddEntryScreen';
import { EditEntryScreen } from '../screens/mainApp/EditEntryScreen';
import { EntryDetailsScreen } from '../screens/mainApp/EntryDetailsScreen';

const MainAppStack = createNativeStackNavigator();

export const MainAppNavigator = () => {
	return (
		<MainAppStack.Navigator screenOptions={{ headerShown: false }}>
			<MainAppStack.Screen name="Tabs" component={TabNavigator} />
			<MainAppStack.Screen name="Add" component={AddEntryScreen} />
			<MainAppStack.Screen name="Edit" component={EditEntryScreen} />
			<MainAppStack.Screen name="EntryDetails" component={EntryDetailsScreen} />
		</MainAppStack.Navigator>
	);
};
