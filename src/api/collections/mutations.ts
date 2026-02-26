import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Collection } from '../../types/Collection';
import {
	createCollection,
	deleteCollection,
	updateCollection,
} from '../firebase/firestore';

export const useCreateCollection = (userId: string) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) =>
			createCollection(userId, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['collections', userId] });
		},
	});
};

export const useUpdateCollection = (userId: string) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async ({
			collectionId,
			data,
		}: {
			collectionId: string;
			data: Partial<Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>>;
		}) => {
			return await updateCollection(userId, collectionId, data);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['collections', userId] });
		},
	});
};

export const useDeleteCollection = (userId: string) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (collectionId: string) => {
			return await deleteCollection(userId, collectionId);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['collections', userId] });
		},
	});
};
