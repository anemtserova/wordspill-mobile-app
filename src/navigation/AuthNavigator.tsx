import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgottenPasswordScreen } from '../screens/auth/ForgottenPasswordScreen';

const AuthStack = createNativeStackNavigator();

export const AuthNavigator = () => {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name="LoginScreen" component={LoginScreen} />
			<AuthStack.Screen name="SignupScreen" component={SignupScreen} />
			<AuthStack.Screen
				name="ForgottenPasswordScreen"
				component={ForgottenPasswordScreen}
			/>
		</AuthStack.Navigator>
	);
};
