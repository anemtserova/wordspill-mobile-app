import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgottenPasswordScreen } from '../screens/auth/ForgottenPasswordScreen';
import { InfoScreen } from '../screens/mainApp/InfoScreen';
import { colors, typography } from '../theme';

const AuthStack = createNativeStackNavigator();

export const AuthNavigator = () => {
	return (
		<AuthStack.Navigator
			screenOptions={{
				headerShown: false,
				// headerStyle: {
				// 	backgroundColor: colors.background.primary,
				// },
				// headerTintColor: colors.text.primary,
				// headerTitleStyle: {
				// 	fontFamily: typography.fonts.heading,
				// 	fontSize: typography.fontSize.lg,
				// 	color: colors.text.primary,
				// },
				// headerShadowVisible: false,
			}}>
			<AuthStack.Screen
				name="Login"
				component={LoginScreen}
				// options={{ headerShown: false }}
			/>
			<AuthStack.Screen
				name="Sign up"
				component={SignupScreen}
				// options={{
				// 	headerShown: false,
				// }}
			/>
			<AuthStack.Screen
				name="Reset Password"
				component={ForgottenPasswordScreen}
				// options={{ headerShown: false }}
			/>
			<AuthStack.Screen
				name="App Info"
				component={InfoScreen}
				// options={{ headerShown: false }}
			/>
		</AuthStack.Navigator>
	);
};
