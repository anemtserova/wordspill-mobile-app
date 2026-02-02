import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Entry } from '../../types/Entry';
import { createEntry, deleteEntry, updateEntry } from '../firebase/firestore';

export const useCreateEntry = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationKey: ['createEntry'],
		mutationFn: async (data: Omit<Entry, 'id' | 'createdAt'>) => {
			return await createEntry(data);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['entries'] });
		},
	});
};

export const useUpdateEntry = (entryId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationKey: ['updateEntry', entryId],
		mutationFn: async (data: Partial<Omit<Entry, 'id' | 'createdAt'>>) => {
			return await updateEntry(entryId, data);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['entries'] });
		},
	});
};

export const useDeleteEntry = (entryId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationKey: ['deleteEntry', entryId],
		mutationFn: async () => {
			return await deleteEntry(entryId);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['entries'] });
		},
	});
};
