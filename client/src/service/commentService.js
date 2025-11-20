import API from '../api/axios';
import { handleError } from "../utils/handleError";


// Add a new comment (top-level or reply)
export const addComment = async (postId, content, parentComment = null) => {
	try {
		const response = await API.post(`/comments/${postId}`, {
			content,
			parentComment,
		});
		return response.data;
	} catch (error) {
		console.error('Add comment error:', error.response?.data || error.message);
		const errorMessage = handleError(error);
		throw new Error(errorMessage);
	}
};


// Get all comments for a post
export const getCommentsByPost = async (postId) => {
	try {
		const response = await API.get(`/comments/${postId}`);
		return response.data;
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

// Soft delete a comment (author, post owner, or admin)
export const deleteComment = async (commentId) => {
	try {
		const response = await API.delete(`/comments/${commentId}`);
		return response.data;
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

// Admin: Flag a comment for review
export const flagComment = async (commentId) => {
	try {
		const response = await API.put(`/comments/${commentId}/flag`);
		return response.data;
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};
