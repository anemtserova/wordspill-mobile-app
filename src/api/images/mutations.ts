import { useMutation } from '@tanstack/react-query';
import { deleteImage, uploadImage } from '../firebase/storage';

export const useUploadImage = () => {
	return useMutation({
		mutationFn: async ({
			userId,
			imageUri,
		}: {
			userId: string;
			imageUri: string;
		}) => {
			return uploadImage(userId, imageUri);
		},
	});
};

export const useDeleteImage = () => {
	return useMutation({
		mutationFn: async ({
			userId,
			imageName,
		}: {
			userId: string;
			imageName: string;
		}) => {
			return deleteImage(userId, imageName);
		},
	});
};
