import API from '../api/axios';
import { handleError } from '../utils/handleError';

/*-------------------------------------------------------
🟢 Create a new tag
@route   POST /api/tags
@access  Private/Admin
-------------------------------------------------------*/
export const createTag = async (tagData) => {
    try {
        const response = await API.post('/tags', tagData);
        return response?.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/*-------------------------------------------------------
🟢 Get all tags
@route   GET /api/tags
@access  Public
@query   ?sortBy=popularity
-------------------------------------------------------*/
export const getAllTags = async (sortBy) => {
    try {
        const response = await API.get('/tags', {
            params: sortBy ? { sortBy } : {}
        });
        return response?.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/*-------------------------------------------------------
🟢 Get a single tag by slug
@route   GET /api/tags/:slug
@access  Public
-------------------------------------------------------*/
export const getTagBySlug = async (slug) => {
    try {
        const response = await API.get(`/tags/${slug}`);
        return response?.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/*-------------------------------------------------------
🟢 Update a tag
@route   PUT /api/tags/:id
@access  Private/Admin
-------------------------------------------------------*/
export const updateTag = async (id, tagData) => {
    try {
        const response = await API.put(`/tags/${id}`, tagData);
        return response?.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/*-------------------------------------------------------
🟢 Delete a tag
@route   DELETE /api/tags/:id
@access  Private/Admin
-------------------------------------------------------*/
export const deleteTag = async (id) => {
    try {
        const response = await API.delete(`/tags/${id}`);
        return response?.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};

/*-------------------------------------------------------
🟢 Get popular/trending tags
@route   GET /api/tags/popular
@access  Public
@query   ?limit=10
-------------------------------------------------------*/
export const getPopularTags = async (limit = 10) => {
    try {
        const response = await API.get('/tags/popular', {
            params: { limit }
        });
        return response?.data;
    } catch (error) {
        throw new Error(handleError(error));
    }
};
