import { auth, db } from '../../../firebaseConfig';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const registerUser = async (email: string, password: string) => {
	const result = await createUserWithEmailAndPassword(auth, email, password);
	const user = result.user;

	// Create Firestore profile
	await setDoc(doc(db, 'users', user.uid), {
		displayName: '',
		username: '',
		email: user.email,
		avatarUrl: null,
		createdAt: new Date(),
		settings: {
			theme: 'light',
			fontSize: 16,
			fontFamily: 'System',
		},
	});

	return user;
};

export const loginUser = (email: string, password: string) =>
	signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const listenToAuth = (callback: (user: User | null) => void) =>
	onAuthStateChanged(auth, callback);
