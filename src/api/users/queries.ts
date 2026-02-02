import { useQuery } from '@tanstack/react-query';
import { getUser } from '../firebase/firestore';

export const useGetUser = (userId: string) => {
	return useQuery({
		queryKey: ['users', userId],
		queryFn: async () => {
			return getUser(userId);
		},
	});
};
