import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddEntryScreen } from '../screens/mainApp/AddEntryScreen';
import { EditEntryScreen } from '../screens/mainApp/EditEntryScreen';
import { EntryDetailsScreen } from '../screens/mainApp/EntryDetailsScreen';
import { SelectedCollectionScreen } from '../screens/mainApp/SelectedCollectionScreen';
import { EntriesByTagScreen } from '../screens/mainApp/EntriesByTagScreen';
import { colors, typography } from '../theme';

export const EntryNavigator = () => {
	const EntryStack = createNativeStackNavigator();

	return (
		<EntryStack.Navigator
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
				headerShadowVisible: true,
			}}>
			<EntryStack.Screen
				name="Collections"
				component={SelectedCollectionScreen}
				options={{ headerShown: false }}
			/>
			<EntryStack.Screen
				name="Add Entry"
				component={AddEntryScreen}
				options={{
					headerShown: false,
					// headerTitle: 'New Entry',
					// headerBackTitle: 'Back',
				}}
			/>
			<EntryStack.Screen
				name="Entry Details"
				component={EntryDetailsScreen}
				options={{
					headerTitle: 'Entry Details',
					headerBackTitle: 'Back',
				}}
			/>
			<EntryStack.Screen
				name="Edit Entry"
				component={EditEntryScreen}
				options={{
					headerTitle: 'Edit Entry',
					headerBackTitle: 'Cancel',
				}}
			/>
			<EntryStack.Screen
				name="Entries By Tag"
				component={EntriesByTagScreen}
				options={{
					headerTitle: 'Tagged Entries',
					headerBackTitle: 'Back',
				}}
			/>
		</EntryStack.Navigator>
	);
};
