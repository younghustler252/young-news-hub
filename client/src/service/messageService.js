import API from '../api/axios';
import { handleError } from '../utils/handleError';

/**
 * Send a message to a friend
 * @param {string} username
 * @param {string} content
 * @returns {object} message
 */
export const sendMessage = async (username, content, image = null) => {
    try {
        const payload = { content };
        if (image) payload.image = image; // include image if provided

        const response = await API.post(`/messages/${username}`, payload);
        return response.data; // { success, message, data }
    } catch (error) {
        throw new Error(handleError(error));
    }
};


/**
 * Get conversation with a user
 * @param {string} username
 * @param {number} [page=1]
 * @param {number} [limit=50]
 * @returns {object} { messages, page, limit, count }
 */
export const getConversation = async (username, page = 1, limit = 50) => {
    try {
        const response = await API.get(`/messages/${username}`, {
            params: { page, limit },
        });
        return response.data.messages; // return only messages
    } catch (error) {
        throw new Error(handleError(error));
    }
};


/**
 * Get all chat conversations for the logged-in user
 * @returns {object} chats
 */
export const getChatList = async () => {
    try {
        const response = await API.get('/messages');
        return response.data; // { success, chats }
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/**
 * Mark a message as read
 * @param {string} messageId
 * @returns {object} message
 */
export const markAsRead = async (messageId) => {
    try {
        const response = await API.patch(`/messages/${messageId}/read`);
        return response.data; // { success, message, data }
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/**
 * Delete a message (soft delete)
 * @param {string} messageId
 * @returns {object} message
 */
export const deleteMessage = async (messageId) => {
    try {
        const response = await API.delete(`/messages/${messageId}`);
        return response.data; // { success, message }
    } catch (error) {
        throw new Error(handleError(error));
    }
};
