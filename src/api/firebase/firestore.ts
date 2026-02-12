import { db } from '../../../firebaseConfig';
import {
	doc,
	getDoc,
	updateDoc,
	collection,
	serverTimestamp,
	addDoc,
	query,
	orderBy,
	getDocs,
	where,
	writeBatch,
} from 'firebase/firestore';
import { Collection } from '../../types/Collection';
import { Entry } from '../../types/Entry';
import { UserProfile } from '../../types/User';

// Fetch entries by collection ID
export const getEntriesByCollection = async (
	userId: string,
	collectionId: string,
) => {
	const ref = collection(db, 'users', userId, 'entries');
	const q = query(ref, where('collectionId', '==', collectionId));
	const snap = await getDocs(q);
	return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Create a new collection of entries
export const createCollection = async (
	collectionData: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> => {
	const collectionsCol = collection(db, 'collections');
	const newCollection = {
		...collectionData,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	};
	const docRef = await addDoc(collectionsCol, newCollection);
	return docRef.id;
};

// Update an existing collection of entries
export const updateCollection = async (
	collectionId: string,
	updatedData: Partial<Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<void> => {
	const collectionDocRef = doc(db, 'collections', collectionId);
	await updateDoc(collectionDocRef, {
		...updatedData,
		updatedAt: serverTimestamp(),
	});
};

// Soft delete a collection and reassign its entries to a default collection
export const deleteCollection = async (collectionId: string): Promise<void> => {
	const collectionDocRef = doc(db, 'collections', collectionId);
	await updateDoc(collectionDocRef, { deletedAt: serverTimestamp() });
};

// Fetch all collections ordered by creation date descending
export const getAllCollections = async (): Promise<Collection[]> => {
	const collectionsCol = collection(db, 'collections');
	const q = query(collectionsCol, orderBy('createdAt', 'desc'));
	const collectionsSnapshot = await getDocs(q);
	const collectionsList = collectionsSnapshot.docs
		.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))
		.filter((collection) => !collection.deletedAt) as Collection[];
	return collectionsList;
};

// Create a new entry
export const createEntry = async (
	userId: string,
	entryData: Omit<Entry, 'id' | 'createdAt'>,
): Promise<string> => {
	const entriesCol = collection(db, 'users', userId, 'entries');
	const newEntry = {
		...entryData,
		createdAt: serverTimestamp(),
	};
	const docRef = await addDoc(entriesCol, newEntry);
	return docRef.id;
};

// Update an existing entry
export const updateEntry = async (
	userId: string,
	entryId: string,
	updatedData: Partial<Omit<Entry, 'id' | 'createdAt'>>,
): Promise<void> => {
	const entryDocRef = doc(db, 'users', userId, 'entries', entryId);
	await updateDoc(entryDocRef, updatedData);
};

export const getEntriesByTag = async (
	userId: string,
	tag: string,
): Promise<Entry[]> => {
	const entriesCol = collection(db, 'users', userId, 'entries');
	const q = query(
		entriesCol,
		where('tags', 'array-contains', tag),
		orderBy('createdAt', 'desc'),
	);
	const snapshot = await getDocs(q);
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Entry[];
};

// Soft delete an entry by setting a deletedAt timestamp
export const deleteEntry = async (
	userId: string,
	entryId: string,
): Promise<void> => {
	const entryDocRef = doc(db, 'users', userId, 'entries', entryId);
	await updateDoc(entryDocRef, { deletedAt: serverTimestamp() });
};

// Fetch all entries ordered by creation date descending
export const getEntries = async (userId: string): Promise<Entry[]> => {
	const entriesCol = collection(db, 'users', userId, 'entries');
	const q = query(entriesCol, orderBy('createdAt', 'desc'));
	const entriesSnapshot = await getDocs(q);
	const entriesList = entriesSnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	})) as Entry[];
	return entriesList;
};

export const getUser = async (userId: string): Promise<UserProfile | null> => {
	const userDocRef = doc(db, 'users', userId);
	const userDoc = await getDoc(userDocRef);
	if (userDoc.exists()) {
		return {
			id: userDoc.id,
			...userDoc.data(),
		} as UserProfile;
	} else {
		return null;
	}
};

export const updateUser = async (
	userId: string,
	updatedData: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<void> => {
	const userDocRef = doc(db, 'users', userId);
	await updateDoc(userDocRef, updatedData);
};
