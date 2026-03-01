import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	updateUser,
	deactivateAccount,
	reactivateAccount,
} from '../firebase/firestore';
import { UserProfile } from '../../types/User';

export const useUpdateUser = (userId: string) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<UserProfile>) => updateUser(userId, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['users', userId] });
		},
	});
};

export const useDeactivateAccount = (userId: string) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: () => deactivateAccount(userId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['users', userId] });
		},
	});
};

export const useReactivateAccount = (userId: string) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: () => reactivateAccount(userId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['users', userId] });
		},
	});
};
