import { useQuery } from '@tanstack/react-query';
import { getAllCollections } from '../firebase/firestore';

export const useGetAllCollections = (userId: string) => {
	return useQuery({
		queryKey: ['collections', userId],
		queryFn: async () => {
			return getAllCollections(userId);
		},
	});
};
