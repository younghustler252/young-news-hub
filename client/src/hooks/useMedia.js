import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadMedia, fetchAllMedia, deleteMedia } from '../service/mediaService';

/*-------------------------------------------------------
📥 Fetch all media
-------------------------------------------------------*/
export const useFetchMedia = () => {
	return useQuery({
		queryKey: ['media'],
		queryFn: fetchAllMedia,
	});
};

/*-------------------------------------------------------
📤 Upload media
-------------------------------------------------------*/
export const useUploadMedia = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (formData) => uploadMedia(formData),
		onSuccess: () => {
			// ✅ Refresh the media list after successful upload
			queryClient.invalidateQueries(['media']);
		},
	});
};

/*-------------------------------------------------------
❌ Delete media
-------------------------------------------------------*/
export const useDeleteMedia = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => deleteMedia(id),
		onSuccess: () => {
			// ✅ Refresh the media list after deletion
			queryClient.invalidateQueries(['media']);
		},
	});
};
