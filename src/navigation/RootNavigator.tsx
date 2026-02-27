import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingNavigator } from './OnboardingNavigatior';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { MainAppNavigator } from './MainAppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import { LoadingScreen } from '../screens/loading/LoadingScreen';
import { DesignSystemExample } from '../screens/DesignSystemExample';

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
	const { user, loading: authLoading } = useAuth();
	const { isOnboardingCompleted, loading: onboardingLoading } = useOnboarding();

	// Show a loading screen while checking auth state and onboarding
	if (authLoading || onboardingLoading) {
		return <LoadingScreen />;
	}

	// TEMPORARY: Show design system (comment this out to see normal flow)
	// return (
	// 	<RootStack.Navigator screenOptions={{ headerShown: false }}>
	// 		<RootStack.Screen name="DesignSystem" component={DesignSystemExample} />
	// 	</RootStack.Navigator>
	// );

	// /* Uncomment this when you want to see the normal app flow
	return (
		<RootStack.Navigator screenOptions={{ headerShown: false }}>
			{!isOnboardingCompleted ? (
				<RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
			) : user ? (
				<RootStack.Screen name="MainApp" component={MainAppNavigator} />
			) : (
				<RootStack.Screen name="Auth" component={AuthNavigator} />
			)}
		</RootStack.Navigator>
	);
};
