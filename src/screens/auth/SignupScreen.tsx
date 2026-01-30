import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';

export const SignupScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	return (
		<View>
			<Text>Signup Screen</Text>
			<Button
				title="Sign Up"
				onPress={() => {
					navigation.navigate('HomeScreen');
				}}
			/>
		</View>
	);
};
