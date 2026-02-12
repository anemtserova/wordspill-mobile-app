import { useQuery } from '@tanstack/react-query';
import {
	getEntries,
	getEntriesByTag,
	getEntriesByCollection,
} from '../firebase/firestore';

export const useGetEntries = (userId: string) => {
	return useQuery({
		queryKey: ['entries', userId],
		queryFn: async () => {
			return getEntries(userId);
		},
	});
};

export const useGetEntriesByTag = (userId: string, tag: string) => {
	return useQuery({
		queryKey: ['entries', userId, 'tag', tag],
		queryFn: () => getEntriesByTag(userId, tag),
		enabled: !!tag,
	});
};

export const useGetEntriesByCollection = (
	userId: string,
	collectionId: string,
) => {
	return useQuery({
		queryKey: ['entries', userId, 'collection', collectionId],
		queryFn: async () => {
			return getEntriesByCollection(userId, collectionId);
		},
	});
};
