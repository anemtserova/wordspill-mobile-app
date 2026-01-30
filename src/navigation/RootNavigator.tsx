import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingNavigator } from './OnboardingNavigatior';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { MainAppNavigator } from './MainAppNavigator';

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
	const isOnboardingCompleted = true; // Replace with actual logic
	const isAuthenticated = true; // Replace with actual logic

	return (
		<RootStack.Navigator screenOptions={{ headerShown: false }}>
			{isOnboardingCompleted ? (
				isAuthenticated ? (
					<RootStack.Screen name="MainApp" component={MainAppNavigator} />
				) : (
					<RootStack.Screen name="Auth" component={AuthNavigator} />
				)
			) : (
				<RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
			)}
		</RootStack.Navigator>
	);
};
