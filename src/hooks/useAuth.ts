import { useEffect, useState } from 'react';
import {
	listenToAuth,
	loginUser,
	logoutUser,
	registerUser,
} from '../api/firebase/auth';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

export const useAuth = () => {
	const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	// Listen to Firebase Auth state
	useEffect(() => {
		const unsubscribe = listenToAuth(async (user) => {
			setFirebaseUser(user);

			if (user) {
				// Check if Firestore profile exists
				const ref = doc(db, 'users', user.uid);
				const snap = await getDoc(ref);

				if (snap.exists()) {
					setProfile({ id: snap.id, ...snap.data() });
				} else {
					setProfile(null);
				}
			} else {
				setProfile(null);
			}

			setLoading(false);
		});

		return unsubscribe;
	}, []);

	return {
		user: firebaseUser, // Firebase auth user
		profile, // Firestore user profile
		loading, // true while checking auth state
		login: loginUser,
		register: registerUser,
		logout: logoutUser,
	};
};
