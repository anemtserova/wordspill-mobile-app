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

export interface MediaMetadata {
	id?: string;
	url: string;
	storagePath: string;
	userId: string;
	mediaType: 'image' | 'video';
	createdAt: any;
	duration?: number; // For videos, in seconds
	thumbnailUrl?: string; // For videos
}

/**
 * Upload media (image or video) to Firebase Storage
 * @param userId - The user ID who owns the media
 * @param mediaUri - The local URI of the media (from image picker)
 * @param mediaType - Type of media: 'image' or 'video'
 * @param folder - Optional folder name (e.g., 'entries', 'headers')
 * @returns Object with download URL and storage path
 */
/**
 * Uploads a local media file to Firebase Storage and returns its public download URL and storage path.
 *
 * @param userId - The ID of the user, used to namespace uploaded files under `folder/userId/...`.
 * @param mediaUri - The local URI of the media file to upload (fetched and converted to a `Blob`).
 * @param mediaType - Declared media kind (`'image' | 'video'`), used to determine the file extension.
 * @param folder - Top-level storage folder. Defaults to `'media'`.
 * @returns An object containing:
 * - `url`: The Firebase download URL for the uploaded file.
 * - `storagePath`: The full path used in Firebase Storage.
 *
 * @throws Rethrows any error encountered while fetching, uploading, or retrieving the download URL.
 *
 * @remarks
 * The ternary that picks `'mp4'` for video and `'jpg'` otherwise exists because this utility is designed
 * to support both media types. Even if your current call site only uploads videos, the function signature
 * still allows images, so the extension selection remains necessary for correctness and reuse.
 */
export const uploadMedia = async (
	userId: string,
	mediaUri: string,
	mediaType: 'image' | 'video',
	folder: string = 'media',
): Promise<{ url: string; storagePath: string }> => {
	try {
		const response = await fetch(mediaUri);
		const blob = await response.blob();

		const timestamp = Date.now();
		const extension = mediaType === 'video' ? 'mp4' : 'jpg';

		const filename = `${folder}/${userId}/${timestamp}.${extension}`;

		const storageRef = ref(storage, filename);

		await uploadBytes(storageRef, blob);

		const downloadURL = await getDownloadURL(storageRef);

		return {
			url: downloadURL,
			storagePath: filename,
		};
	} catch (error) {
		console.error('Error uploading media:', error);
		throw error;
	}
};

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
		const response = await fetch(imageUri);
		const blob = await response.blob();

		const timestamp = Date.now();
		const filename = `${folder}/${userId}/${timestamp}.jpg`;

		const storageRef = ref(storage, filename);

		await uploadBytes(storageRef, blob);

		const downloadURL = await getDownloadURL(storageRef);

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
		const imagesCol = collection(db, 'users', userId, 'images');
		const q = query(imagesCol, where('url', '==', imageUrl));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			throw new Error('Image metadata not found');
		}

		const imageDoc = querySnapshot.docs[0];
		const imageData = imageDoc.data() as ImageMetadata;
		const storagePath = imageData.storagePath;

		const storageRef = ref(storage, storagePath);
		await deleteObject(storageRef);

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
