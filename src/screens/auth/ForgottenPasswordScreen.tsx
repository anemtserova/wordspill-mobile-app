import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';

export const ForgottenPasswordScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	return (
		<View>
			<Text>Forgotten Password Screen</Text>
			<Button
				title="Reset Password"
				onPress={() => {
					navigation.navigate('HomeScreen');
				}}
			/>
		</View>
	);
};
