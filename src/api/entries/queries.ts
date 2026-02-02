import { useQueries } from '@tanstack/react-query';
import { Entry } from '../../types/Entry';

export const getEntries = async (): Promise<Entry[]> => {
	return useQueries({
		queries: [
			{
				queryKey: ['entries'],
				queryFn: async () => {
					getEntries();
				},
			},
		],
	});
};
