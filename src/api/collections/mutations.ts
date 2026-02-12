import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Collection } from '../../types/Collection';
import { createCollection, deleteCollection } from '../firebase/firestore';

export const useCreateCollection = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) =>
			createCollection(data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['collections'] });
		},
	});
};

export const useDeleteCollection = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (collectionId: string) => {
			return await deleteCollection(collectionId);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['collections'] });
		},
	});
};
