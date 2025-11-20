// services/mediaService.js
import API from '../api/axios';
import { handleError } from '../utils/handleError';

// 📤 Upload media
export const uploadMedia = async (formData) => {
	try {
		const response = await API.post('/media/upload', formData);
		return response.data;
	} catch (error) {
		const errorMessage = handleError(error);
		throw new Error(errorMessage);
	}
};


// 📥 Get all media
export const fetchAllMedia = async () => {
	try {
		const response = await API.get('/media');
		return response.data; // { message, total, media }
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

// ❌ Delete media by ID
export const deleteMedia = async (id) => {
	try {
		const response = await API.delete(`/media/${id}`);
		return response.data; // { message, mediaId }
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};
