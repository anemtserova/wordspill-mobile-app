import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingCarousel } from '../screens/onboarding/OnboardingCarousel';

const OnboardingStack = createNativeStackNavigator();

export const OnboardingNavigator = () => {
	return (
		<OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
			<OnboardingStack.Screen
				name="Onboarding"
				component={OnboardingCarousel}
			/>
		</OnboardingStack.Navigator>
	);
};
