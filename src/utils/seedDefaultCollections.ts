import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { colors } from '../theme';

export const DEFAULT_COLLECTIONS = [
	{
		name: 'In Limbo',
		color: colors.neutral.gray400,
		iconUrl: null,
		iconName: 'suitcase',
	},
	{
		name: 'Fiction',
		color: colors.accent.cream,
		iconUrl: null,
		iconName: 'fish',
	},
	{
		name: 'Poetry',
		color: colors.accent.teal,
		iconUrl: null,
		iconName: 'flower',
	},
	{
		name: 'Travel',
		color: colors.accent.peach,
		iconUrl: null,
		iconName: 'globe',
	},
	{
		name: 'Quick Notes',
		color: colors.accent.gold,
		iconUrl: null,
		iconName: 'editPencil',
	},
	{
		name: 'Diary',
		color: colors.secondary.light,
		iconUrl: null,
		iconName: 'favouriteBook',
	},
	{
		name: 'Essay',
		color: colors.primary.light,
		iconUrl: null,
		iconName: 'learning',
	},
];

/**
 * Seeds default collections for a new user
 * Called automatically during user registration
 */
export const seedDefaultCollections = async (userId: string): Promise<void> => {
	try {
		const collectionsCol = collection(db, 'users', userId, 'collections');

		const promises = DEFAULT_COLLECTIONS.map((collectionData) =>
			addDoc(collectionsCol, {
				...collectionData,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				deletedAt: null,
			}),
		);

		await Promise.all(promises);
	} catch (error) {
		console.error('❌ Error seeding default collections:', error);
		throw error;
	}
};
