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
import { Text, Button, Input, Card, ScreenHeader } from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';

export const ForgottenPasswordScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	const { resetPassword } = useAuth();
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState('');

	const validateEmail = () => {
		if (!email) {
			setError('Email is required');
			return false;
		}
		if (!/\S+@\S+\.\S+/.test(email)) {
			setError('Please enter a valid email');
			return false;
		}
		return true;
	};

	const handleResetPassword = async () => {
		if (!validateEmail()) return;

		setLoading(true);
		try {
			await resetPassword(email);
			setSubmitted(true);
		} catch (error: any) {
			const errorMessage =
				error.code === 'auth/user-not-found'
					? 'No account found with this email'
					: error.code === 'auth/invalid-email'
						? 'Invalid email address'
						: 'Failed to send reset email. Please try again.';

			Alert.alert('Reset Failed', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleBackToLogin = () => {
		navigation.navigate('Login');
	};

	if (submitted) {
		return (
			<View style={styles.container}>
				<ScreenHeader title="Password Reset" onBackPress={handleBackToLogin} />
				<View style={styles.content}>
					<View style={styles.successContent}>
						<View style={styles.iconContainer}>
							<Text style={styles.iconText}>✓</Text>
						</View>

						<Text variant="h2" style={styles.successTitle}>
							Check Your Email
						</Text>

						<Text
							variant="body"
							color={colors.text.secondary}
							style={styles.successMessage}>
							We've sent password reset instructions to
						</Text>

						<Text variant="bodyLarge" color={colors.text.primary}>
							{email}
						</Text>

						<Text
							variant="bodySmall"
							color={colors.text.secondary}
							style={styles.hint}>
							Please check your inbox and follow the link to reset your
							password.
						</Text>

						<Button
							variant="primary"
							fullWidth
							onPress={handleBackToLogin}
							style={styles.backButton}>
							Back to Login
						</Button>

						<TouchableOpacity onPress={handleResetPassword}>
							<Text variant="body" color={colors.secondary.main}>
								Resend Email
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<ScreenHeader title="Reset Password" onBackPress={handleBackToLogin} />
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled">
				<View style={styles.form}>
					<Input
						label="Email"
						placeholder="Enter your email"
						value={email}
						onChangeText={(text) => {
							setEmail(text);
							if (error) setError('');
						}}
						keyboardType="email-address"
						autoCapitalize="none"
						error={error}
					/>

					<Button
						variant="primary"
						fullWidth
						onPress={handleResetPassword}
						loading={loading}
						style={styles.resetButton}>
						Send Reset Link
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
							Remembered your password?{' '}
						</Text>
						<TouchableOpacity onPress={handleBackToLogin}>
							<Text variant="body" color={colors.secondary.main}>
								Sign In
							</Text>
						</TouchableOpacity>
					</View>
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
	content: {
		flex: 1,
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.xl,
	},
	form: {
		gap: spacing.lg,
	},
	resetButton: {
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
	successContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: spacing.lg,
	},
	iconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: colors.semantic.success,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.xl,
	},
	iconText: {
		fontSize: 48,
		color: colors.neutral.white,
	},
	successTitle: {
		marginBottom: spacing.md,
		textAlign: 'center',
	},
	successMessage: {
		marginBottom: spacing.sm,
		textAlign: 'center',
	},
	hint: {
		marginTop: spacing.lg,
		marginBottom: spacing.xl,
		textAlign: 'center',
	},
	backButton: {
		marginBottom: spacing.md,
	},
});
