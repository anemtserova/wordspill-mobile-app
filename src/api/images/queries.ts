import { useQuery } from '@tanstack/react-query';
import { getImages } from '../firebase/storage';

export const useGetAllImages = (userId: string) => {
	return useQuery({
		queryKey: ['images', userId],
		queryFn: async () => {
			return getImages(userId);
		},
	});
};
