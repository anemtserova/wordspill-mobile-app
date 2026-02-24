import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgottenPasswordScreen } from '../screens/auth/ForgottenPasswordScreen';
import { colors, typography } from '../theme';

const AuthStack = createNativeStackNavigator();

export const AuthNavigator = () => {
	return (
		<AuthStack.Navigator
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
				headerShadowVisible: false,
			}}>
			<AuthStack.Screen
				name="LoginScreen"
				component={LoginScreen}
				options={{ headerShown: false }}
			/>
			<AuthStack.Screen
				name="SignupScreen"
				component={SignupScreen}
				options={{
					headerTitle: 'Create Account',
					headerBackTitle: 'Back',
				}}
			/>
			<AuthStack.Screen
				name="ForgottenPasswordScreen"
				component={ForgottenPasswordScreen}
				options={{
					headerTitle: 'Reset Password',
					headerBackTitle: 'Back',
				}}
			/>
		</AuthStack.Navigator>
	);
};
