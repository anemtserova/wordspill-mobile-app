import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddEntryScreen } from '../screens/mainApp/AddEntryScreen';
import { EditEntryScreen } from '../screens/mainApp/EditEntryScreen';
import { EntryDetailsScreen } from '../screens/mainApp/EntryDetailsScreen';
import { SelectedCollectionScreen } from '../screens/mainApp/SelectedCollectionScreen';

export const EntryNavigator = () => {
	const EntryStack = createNativeStackNavigator();

	return (
		<EntryStack.Navigator screenOptions={{ headerShown: false }}>
			<EntryStack.Screen
				name="Collections"
				component={SelectedCollectionScreen}
			/>
			<EntryStack.Screen name="Add Entry" component={AddEntryScreen} />
			<EntryStack.Screen name="Entry Details" component={EntryDetailsScreen} />
			<EntryStack.Screen name="Edit Entry" component={EditEntryScreen} />
		</EntryStack.Navigator>
	);
};
