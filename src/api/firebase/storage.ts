import { storage, db } from '../../../firebaseConfig';
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
	listAll,
} from 'firebase/storage';
import {
	collection,
	addDoc,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
	serverTimestamp,
} from 'firebase/firestore';

interface ImageMetadata {
	id: string;
	url: string;
	storagePath: string;
	userId: string;
	createdAt: any;
}

/**
 * Upload an image to Firebase Storage and save metadata to Firestore
 * @param userId - The user ID who owns the image
 * @param imageUri - The local URI of the image (from image picker)
 * @param folder - Optional folder name (e.g., 'profile', 'entries', 'collections')
 * @returns The download URL of the uploaded image
 */
export const uploadImage = async (
	userId: string,
	imageUri: string,
	folder: string = 'images',
): Promise<string> => {
	try {
		// Fetch the image as a blob
		const response = await fetch(imageUri);
		const blob = await response.blob();

		// Create a unique filename
		const timestamp = Date.now();
		const filename = `${folder}/${userId}/${timestamp}.jpg`;

		// Create a storage reference
		const storageRef = ref(storage, filename);

		// Upload the image
		await uploadBytes(storageRef, blob);

		// Get the download URL
		const downloadURL = await getDownloadURL(storageRef);

		// Save metadata to Firestore
		const imagesCol = collection(db, 'users', userId, 'images');
		await addDoc(imagesCol, {
			url: downloadURL,
			storagePath: filename,
			userId: userId,
			createdAt: serverTimestamp(),
		});

		return downloadURL;
	} catch (error) {
		console.error('Error uploading image:', error);
		throw error;
	}
};

/**
 * Delete an image from both Storage and Firestore
 * @param userId - The user ID who owns the image
 * @param imageUrl - The download URL of the image to delete
 */
export const deleteImage = async (
	userId: string,
	imageUrl: string,
): Promise<void> => {
	try {
		// Find the image metadata in Firestore
		const imagesCol = collection(db, 'users', userId, 'images');
		const q = query(imagesCol, where('url', '==', imageUrl));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			throw new Error('Image metadata not found');
		}

		// Get the storage path and document ID
		const imageDoc = querySnapshot.docs[0];
		const imageData = imageDoc.data() as ImageMetadata;
		const storagePath = imageData.storagePath;

		// Delete from Storage
		const storageRef = ref(storage, storagePath);
		await deleteObject(storageRef);

		// Delete metadata from Firestore
		await deleteDoc(doc(db, 'users', userId, 'images', imageDoc.id));
	} catch (error) {
		console.error('Error deleting image:', error);
		throw error;
	}
};

/**
 * Get all images for a specific user
 * @param userId - The user ID
 * @returns Array of image metadata
 */
export const getImages = async (userId: string): Promise<ImageMetadata[]> => {
	try {
		const imagesCol = collection(db, 'users', userId, 'images');
		const querySnapshot = await getDocs(imagesCol);

		const images = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as ImageMetadata[];

		return images;
	} catch (error) {
		console.error('Error fetching images:', error);
		throw error;
	}
};
