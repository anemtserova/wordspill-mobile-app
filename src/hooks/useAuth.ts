import { useEffect, useState } from 'react';
import {
	listenToAuth,
	loginUser,
	logoutUser,
	registerUser,
	resetPassword,
} from '../api/firebase/auth';
import { User } from 'firebase/auth';
import { useGetUser } from '../api/users/queries';
import { reactivateAccount } from '../api/firebase/firestore';

export const useAuth = () => {
	const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);

	const { data: profile, isLoading: profileLoading } = useGetUser(
		firebaseUser?.uid || '',
	);

	const loading = authLoading || (firebaseUser ? profileLoading : false);

	// Listen to Firebase Auth state
	useEffect(() => {
		const unsubscribe = listenToAuth(async (user) => {
			setFirebaseUser(user);
			setAuthLoading(false);
		});

		return unsubscribe;
	}, []);

	// Check if account is deactivated and reactivate on login
	useEffect(() => {
		const checkAndReactivate = async () => {
			if (profile && profile.deactivatedAt && firebaseUser) {
				try {
					await reactivateAccount(firebaseUser.uid);
					console.log('Account reactivated successfully');
				} catch (error) {
					console.error('Failed to reactivate account:', error);
				}
			}
		};

		checkAndReactivate();
	}, [profile, firebaseUser]);

	return {
		user: firebaseUser, // Firebase auth user
		profile, // Firestore user profile (from React Query)
		loading,
		login: loginUser,
		register: registerUser,
		logout: logoutUser,
		resetPassword: resetPassword,
	};
};
