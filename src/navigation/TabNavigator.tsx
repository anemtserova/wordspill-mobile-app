import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BookStack, UserCircle, HomeAlt } from 'iconoir-react-native';
import { CollectionsScreen } from '../screens/mainApp/CollectionsScreen';
import { HomeScreen } from '../screens/mainApp/HomeScreen';
import { ProfileNavigator } from './ProfileNavigator';
import { colors, spacing } from '../theme';

export const TabNavigator = () => {
	const Tabs = createBottomTabNavigator();

	return (
		<Tabs.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: colors.secondary.main,
				tabBarInactiveTintColor: colors.text.secondary,
				tabBarStyle: {
					backgroundColor: colors.background.primary,
					borderTopColor: colors.neutral.gray200,
					paddingTop: spacing.md,
					paddingBottom: spacing.xs,
				},
			}}>
			<Tabs.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<HomeAlt width={size} height={size} color={color} strokeWidth={2} />
					),
				}}
			/>
			<Tabs.Screen
				name="Collections"
				component={CollectionsScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<BookStack
							width={size}
							height={size}
							color={color}
							strokeWidth={2}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="Profile"
				component={ProfileNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<UserCircle
							width={size}
							height={size}
							color={color}
							strokeWidth={2}
						/>
					),
				}}
			/>
		</Tabs.Navigator>
	);
};
