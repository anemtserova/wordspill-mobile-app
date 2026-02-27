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
import { Text, Button, Input, WordspillInfoButton } from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';

export const LoginScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({ email: '', password: '' });

	const validatePassword = (password: string): string => {
		if (!password) return 'Password is required';
		if (password.length < 8) return 'Password must be at least 8 characters';
		if (!/[a-zA-Z]/.test(password))
			return 'Password must contain at least one letter';
		if (!/[0-9]/.test(password))
			return 'Password must contain at least one number';
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
			return 'Password must contain at least one special character';
		return '';
	};

	const validateForm = () => {
		const newErrors = { email: '', password: '' };
		let isValid = true;

		if (!email) {
			newErrors.email = 'Email is required';
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = 'Please enter a valid email';
			isValid = false;
		}

		const passwordError = validatePassword(password);
		if (passwordError) {
			newErrors.password = passwordError;
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleLogin = async () => {
		if (!validateForm()) return;

		setLoading(true);
		try {
			await login(email, password);
		} catch (error: any) {
			const errorMessage =
				error.code === 'auth/user-not-found'
					? 'No account found with this email'
					: error.code === 'auth/wrong-password'
						? 'Incorrect password'
						: error.code === 'auth/invalid-credential'
							? 'Invalid email or password'
							: 'Failed to sign in. Please try again.';

			Alert.alert('Login Failed', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled">
				<View style={styles.header}>
					<Text variant="h1" style={styles.title}>
						Welcome Back
					</Text>
					<Text variant="body" color={colors.text.secondary}>
						Sign in to continue your journey
					</Text>
				</View>

				<View style={styles.form}>
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
						placeholder="Enter your password"
						value={password}
						onChangeText={(text) => {
							setPassword(text);
							if (errors.password) setErrors({ ...errors, password: '' });
						}}
						secureTextEntry
						error={errors.password}
					/>

					<TouchableOpacity
						onPress={() => navigation.navigate('Reset Password')}
						style={styles.forgotPassword}>
						<Text variant="bodySmall" color={colors.secondary.main}>
							Forgot Password?
						</Text>
					</TouchableOpacity>

					<Button
						variant="primary"
						fullWidth
						onPress={handleLogin}
						loading={loading}
						style={styles.loginButton}>
						Sign In
					</Button>

					<View style={styles.divider}>
						<View style={styles.dividerLine} />
						<Text variant="caption" color={colors.text.secondary}>
							or
						</Text>
						<View style={styles.dividerLine} />
					</View>

					<View style={styles.signupPrompt}>
						<Text variant="body" color={colors.text.secondary}>
							Don't have an account?{' '}
						</Text>
						<TouchableOpacity onPress={() => navigation.navigate('Sign up')}>
							<Text variant="body" color={colors.secondary.main}>
								Sign Up
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
	header: {
		marginBottom: spacing['3xl'],
	},
	title: {
		marginBottom: spacing.sm,
	},
	form: {
		gap: spacing.lg,
	},
	forgotPassword: {
		alignSelf: 'flex-end',
		marginTop: -spacing.sm,
	},
	loginButton: {
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
	signupPrompt: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
