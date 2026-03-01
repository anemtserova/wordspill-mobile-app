import { auth, db } from '../../../firebaseConfig';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	sendPasswordResetEmail,
	User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { seedDefaultCollections } from '../../utils/seedDefaultCollections';

export const registerUser = async (
	email: string,
	password: string,
	displayName: string,
) => {
	const result = await createUserWithEmailAndPassword(auth, email, password);
	const user = result.user;

	// Create Firestore profile
	await setDoc(doc(db, 'users', user.uid), {
		displayName: displayName,
		email: user.email,
		avatarUrl: null,
		createdAt: new Date(),
	});

	// Seed default collections for the new user
	await seedDefaultCollections(user.uid);

	return user;
};

export const loginUser = (email: string, password: string) =>
	signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const resetPassword = (email: string) =>
	sendPasswordResetEmail(auth, email);

export const listenToAuth = (callback: (user: User | null) => void) =>
	onAuthStateChanged(auth, callback);
