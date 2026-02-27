import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';

const OnboardingStack = createNativeStackNavigator();

export const OnboardingNavigator = () => {
	return (
		<OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
			<OnboardingStack.Screen
				name="OnboardingScreen"
				component={OnboardingScreen}
			/>
		</OnboardingStack.Navigator>
	);
};
