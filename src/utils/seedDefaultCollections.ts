import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { colors } from '../theme';

// Default collections data matching HomeScreen.tsx
export const DEFAULT_COLLECTIONS = [
	{
		name: 'Fiction',
		color: colors.accent.cream,
		iconUrl: null,
		iconName: 'fish', // Fish icon from iconoir
	},
	{
		name: 'Poetry',
		color: colors.accent.teal,
		iconUrl: null,
		iconName: 'flower', // Flower icon from iconoir
	},
	{
		name: 'Travel',
		color: colors.accent.peach,
		iconUrl: null,
		iconName: 'sea-and-sun', // SeaAndSun icon from iconoir
	},
	{
		name: 'Quick Notes',
		color: colors.accent.gold,
		iconUrl: null,
		iconName: 'edit-pencil', // EditPencil icon from iconoir
	},
	{
		name: 'Diary',
		color: colors.secondary.light,
		iconUrl: null,
		iconName: 'favourite-book', // FavouriteBook icon from iconoir
	},
	{
		name: 'Essay',
		color: colors.primary.light,
		iconUrl: null,
		iconName: 'learning', // Learning icon from iconoir
	},
];

/**
 * Seeds default collections for a new user
 * Called automatically during user registration
 */
export const seedDefaultCollections = async (userId: string): Promise<void> => {
	try {
		const collectionsCol = collection(db, 'users', userId, 'collections');

		// Create all default collections in parallel
		const promises = DEFAULT_COLLECTIONS.map((collectionData) =>
			addDoc(collectionsCol, {
				...collectionData,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				deletedAt: null,
			}),
		);

		await Promise.all(promises);
		console.log(
			`✅ Seeded ${DEFAULT_COLLECTIONS.length} default collections for user ${userId}`,
		);
	} catch (error) {
		console.error('❌ Error seeding default collections:', error);
		throw error;
	}
};
