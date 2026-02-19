import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Entry } from '../../types/Entry';
import { createEntry, deleteEntry, updateEntry } from '../firebase/firestore';

export const useCreateEntry = (userId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationKey: ['createEntry'],
		mutationFn: async (entryData: Omit<Entry, 'id' | 'createdAt'>) => {
			return await createEntry(userId, entryData);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['entries', userId] });
		},
	});
};

export const useUpdateEntry = (userId: string, entryId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationKey: ['updateEntry', entryId],
		mutationFn: async (data: Partial<Omit<Entry, 'id' | 'createdAt'>>) => {
			return await updateEntry(userId, entryId, data);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['entries', userId] });
		},
	});
};

export const useDeleteEntry = (userId: string, entryId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationKey: ['deleteEntry', entryId],
		mutationFn: async () => {
			return await deleteEntry(userId, entryId);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['entries', userId] });
		},
	});
};
