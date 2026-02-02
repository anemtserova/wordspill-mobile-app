import { useQuery } from '@tanstack/react-query';
import { getCollection, getAllCollections } from '../firebase/firestore';

export const useGetCollection = (userId: string, collectionId: string) => {
	return useQuery({
		queryKey: ['collection', userId, collectionId],
		queryFn: async () => {
			return getCollection(userId, collectionId);
		},
	});
};

export const useGetAllCollections = (userId: string) => {
	return useQuery({
		queryKey: ['collections', userId],
		queryFn: async () => {
			return getAllCollections(userId);
		},
	});
};
