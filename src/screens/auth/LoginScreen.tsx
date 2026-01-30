import { Text, View, Button, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const LoginScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	return (
		<View>
			<Text>Login Screen</Text>
			<Button
				title="Login"
				onPress={() => {
					navigation.navigate('HomeScreen');
				}}
			/>
			<TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
				<Text>Don't have an account? Sign Up</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => navigation.navigate('ForgottenPasswordScreen')}>
				<Text>Forgot Password?</Text>
			</TouchableOpacity>
		</View>
	);
};
