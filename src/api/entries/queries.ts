import { useQuery } from '@tanstack/react-query';
import { getEntries } from '../firebase/firestore';

export const useGetEntries = (userId: string) => {
	return useQuery({
		queryKey: ['entries', userId],
		queryFn: async () => {
			return getEntries(userId);
		},
	});
};
