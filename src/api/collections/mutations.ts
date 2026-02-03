import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Collection } from '../../types/Collection';
import { createCollection, deleteCollection } from '../firebase/firestore';

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

export const useDeleteCollection = (userId: string, collectionId: string) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			return await deleteCollection(userId, collectionId);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['collections', userId] });
		},
	});
};
