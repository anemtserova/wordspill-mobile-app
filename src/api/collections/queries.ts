import { useQuery } from '@tanstack/react-query';
import { getCollection } from '../firebase/firestore';

export const useGetCollection = (userId: string, collectionId: string) => {
	return useQuery({
		queryKey: ['collections', userId, collectionId],
		queryFn: async () => {
			return getCollection(userId, collectionId);
		},
	});
};

export const getAllCollections = () => {
	return useQuery({
		queryKey: ['collections'],
		queryFn: async () => {
			getAllCollections();
		},
	});
};
