import API from '../api/axios';
import { handleError } from '../utils/handleError';

/**
 * Full search for posts, authors, and tags
 * @param {string} query - search term
 * @param {number} page - page number (default 1)
 * @param {number} limit - results per page (default 10)
 * @returns {Promise<Object>} - { posts, authors, tags }
 */
export const searchAll = async (query, page = 1, limit = 10) => {
    try {
        const response = await API.get('/search', {
            params: { q: query, page, limit }
        });
        return response.data;
    } catch (error) {
        const errorMessage = handleError(error);
        throw new Error(errorMessage);
    }
};


/**
 * Search suggestions / autocomplete
 * @param {string} query - search term
 * @param {number} limit - number of suggestions (default 5)
 * @returns {Promise<Object>} - { posts, authors, tags }
 */
export const searchSuggest = async (query, limit = 5) => {
    try {
        const response = await API.get('/search/suggest', {
            params: { q: query, limit }
        });
        return response.data;
    } catch (error) {
        const errorMessage = handleError(error);
        throw new Error(errorMessage);
    }
};
