import API from '../api/axios';
import { handleError } from '../utils/handleError';

/**
 * Send a message to a user
 * @param {string} receiverId - ID of the receiver
 * @param {string} content - Message content
 * @returns {Promise<Object>} - Sent message data
 */
export const sendMessage = async (receiverId, content) => {
	try {
		const response = await API.post(`/messages/${receiverId}`, { content });
		return response.data;
	} catch (error) {
		console.error('Send message error:', error.response?.data || error.message);
		const errorMessage = handleError(error);
		throw new Error(errorMessage);
	}
};

/**
 * Get conversation between logged-in user and another user
 * @param {string} userId - ID of the other user
 * @returns {Promise<Array>} - List of messages
 */
export const getConversation = async (userId) => {
	try {
		const response = await API.get(`/messages/${userId}`);
		return response.data.messages;
	} catch (error) {
		console.error('Get conversation error:', error.response?.data || error.message);
		const errorMessage = handleError(error);
		throw new Error(errorMessage);
	}
};

/**
 * Get all chat conversations for logged-in user
 * @returns {Promise<Array>} - List of chats with last message
 */
export const getChatList = async () => {
	try {
		const response = await API.get('/messages');
		return response.data.chats;
	} catch (error) {
		console.error('Get chat list error:', error.response?.data || error.message);
		const errorMessage = handleError(error);
		throw new Error(errorMessage);
	}
};

/**
 * Mark a message as read
 * @param {string} messageId - ID of the message
 * @returns {Promise<Object>} - Updated message data
 */
export const markAsRead = async (messageId) => {
	try {
		const response = await API.patch(`/messages/${messageId}/read`);
		return response.data.data;
	} catch (error) {
		console.error('Mark as read error:', error.response?.data || error.message);
		const errorMessage = handleError(error);
		throw new Error(errorMessage);
	}
};

/**
 * Delete a message
 * @param {string} messageId - ID of the message
 * @returns {Promise<Object>} - Success message
 */
export const deleteMessage = async (messageId) => {
	try {
		const response = await API.delete(`/messages/${messageId}`);
		return response.data;
	} catch (error) {
		console.error('Delete message error:', error.response?.data || error.message);
		const errorMessage = handleError(error);
		throw new Error(errorMessage);
	}
};
