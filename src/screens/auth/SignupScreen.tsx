import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
	Text,
	Button,
	Input,
	ScreenHeader,
	WordspillInfoButton,
} from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';

export const SignupScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	const { register } = useAuth();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const validateForm = () => {
		const newErrors = {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		};
		let isValid = true;

		if (!name.trim()) {
			newErrors.name = 'Name is required';
			isValid = false;
		}

		if (!email) {
			newErrors.email = 'Email is required';
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = 'Please enter a valid email';
			isValid = false;
		}

		if (!password) {
			newErrors.password = 'Password is required';
			isValid = false;
		} else if (password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
			isValid = false;
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your password';
			isValid = false;
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSignup = async () => {
		if (!validateForm()) return;

		setLoading(true);
		try {
			await register(email, password, name);
		} catch (error: any) {
			const errorMessage =
				error.code === 'auth/email-already-in-use'
					? 'An account with this email already exists'
					: error.code === 'auth/weak-password'
						? 'Password is too weak'
						: error.code === 'auth/invalid-email'
							? 'Invalid email address'
							: 'Failed to create account. Please try again.';

			Alert.alert('Signup Failed', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<ScreenHeader
				title="Create Account"
				onBackPress={() => navigation.goBack()}
			/>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled">
				<View style={styles.form}>
					<Input
						label="Display Name"
						placeholder="Enter your display name"
						value={name}
						onChangeText={(text) => {
							setName(text);
							if (errors.name) setErrors({ ...errors, name: '' });
						}}
						autoCapitalize="words"
						error={errors.name}
					/>

					<Input
						label="Email"
						placeholder="Enter your email"
						value={email}
						onChangeText={(text) => {
							setEmail(text);
							if (errors.email) setErrors({ ...errors, email: '' });
						}}
						keyboardType="email-address"
						autoCapitalize="none"
						error={errors.email}
					/>

					<Input
						label="Password"
						placeholder="Create a password"
						value={password}
						onChangeText={(text) => {
							setPassword(text);
							if (errors.password) setErrors({ ...errors, password: '' });
						}}
						secureTextEntry
						error={errors.password}
					/>

					<Input
						label="Confirm Password"
						placeholder="Re-enter your password"
						value={confirmPassword}
						onChangeText={(text) => {
							setConfirmPassword(text);
							if (errors.confirmPassword)
								setErrors({ ...errors, confirmPassword: '' });
						}}
						secureTextEntry
						error={errors.confirmPassword}
					/>

					<Button
						variant="primary"
						fullWidth
						onPress={handleSignup}
						loading={loading}
						style={styles.signupButton}>
						Create Account
					</Button>

					<View style={styles.divider}>
						<View style={styles.dividerLine} />
						<Text variant="caption" color={colors.text.secondary}>
							or
						</Text>
						<View style={styles.dividerLine} />
					</View>

					<View style={styles.loginPrompt}>
						<Text variant="body" color={colors.text.secondary}>
							Already have an account?{' '}
						</Text>
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Text variant="body" color={colors.secondary.main}>
								Sign In
							</Text>
						</TouchableOpacity>
					</View>

					<WordspillInfoButton navigation={navigation} />
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.xl,
		paddingBottom: spacing.xl,
	},
	form: {
		gap: spacing.lg,
	},
	signupButton: {
		marginTop: spacing.md,
	},
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
		marginVertical: spacing.md,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: colors.neutral.gray300,
	},
	loginPrompt: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
