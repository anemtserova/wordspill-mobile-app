import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@onboarding_completed';

export const useOnboarding = () => {
	const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
		boolean | null
	>(null);
	const [loading, setLoading] = useState(true);

	// Check if onboarding was completed on mount
	useEffect(() => {
		checkOnboarding();
	}, []);

	const checkOnboarding = async () => {
		try {
			const value = await AsyncStorage.getItem(ONBOARDING_KEY);
			setIsOnboardingCompleted(value === 'true');
		} catch (error) {
			console.error('Error checking onboarding status:', error);
			setIsOnboardingCompleted(false);
		} finally {
			setLoading(false);
		}
	};

	const completeOnboarding = async () => {
		try {
			await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
			setIsOnboardingCompleted(true);
		} catch (error) {
			console.error('Error saving onboarding status:', error);
		}
	};

	const resetOnboarding = async () => {
		try {
			await AsyncStorage.removeItem(ONBOARDING_KEY);
			setIsOnboardingCompleted(false);
		} catch (error) {
			console.error('Error resetting onboarding:', error);
		}
	};

	return {
		isOnboardingCompleted,
		loading,
		completeOnboarding,
		resetOnboarding,
	};
};
