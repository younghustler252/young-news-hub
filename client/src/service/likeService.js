// services/likeService.js or inside postService.js
import API from '../api/axios';
import { handleError } from '../utils/handleError';

// Toggle like on a post
export const togglePostLike = async (postId) => {
	try {
		const response = await API.post(`/like/${postId}`);
		return response.data; // { liked: true/false, likesCount: number }
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

export const getPostLikeStatus = async (postId) => {
  try {
    const response = await API.get(`/like/status/${postId}`);
    return response.data; // { liked: true/false, likesCount: number }
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};
