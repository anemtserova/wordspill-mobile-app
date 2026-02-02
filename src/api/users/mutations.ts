import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../firebase/firestore';
import { UserProfile } from '../../types/User';
import { User } from 'firebase/auth/web-extension';

export const useUpdateUser = (userId: string) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<UserProfile>) => updateUser(userId, data),
		// onSuccess: () => {
		// 	qc.invalidateQueries({ queryKey: ['users', userId] });
		// },
	});
};
