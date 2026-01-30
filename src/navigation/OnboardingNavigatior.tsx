import { createNativeStackNavigator } from '@react-navigation/native-stack';

const OnboardingStack = createNativeStackNavigator();

import { GetStartedScreen } from '../screens/onboarding/GetStartedScreen';
import { FictionPoetryScreen } from '../screens/onboarding/FictionPoetryScreen';
import { TravelScreen } from '../screens/onboarding/TravelScreen';
import { DiaryScreen } from '../screens/onboarding/DiaryScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';

export const OnboardingNavigator = () => {
	return (
		<OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
			<OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
			<OnboardingStack.Screen
				name="FictionPoetry"
				component={FictionPoetryScreen}
			/>
			<OnboardingStack.Screen name="Travel" component={TravelScreen} />
			<OnboardingStack.Screen name="Diary" component={DiaryScreen} />
			<OnboardingStack.Screen name="Get Started" component={GetStartedScreen} />
		</OnboardingStack.Navigator>
	);
};
