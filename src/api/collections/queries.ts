import { useQuery } from '@tanstack/react-query';
import { getAllCollections } from '../firebase/firestore';

export const useGetAllCollections = () => {
	return useQuery({
		queryKey: ['collections'],
		queryFn: async () => {
			return getAllCollections();
		},
	});
};
