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
