// services/postService.js
import API from '../api/axios';
import { handleError } from '../utils/handleError';

/*-------------------------------------------------------
🟢 Create a new post
@route   POST /api/posts
@access  Private
-------------------------------------------------------*/
export const createPost = async (postData) => {
	try {
		const response = await API.post('/posts', postData);
		return response?.data; // { message, post }
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

/*-------------------------------------------------------
📥 Get all approved posts with filters & pagination
@route   GET /api/posts
@access  Public
-------------------------------------------------------*/
export const getAllApprovedPosts = async (params = {}) => {
  try {
    // Rename 'tag' to 'tags' to match backend
    const { tag, ...rest } = params;
    const queryParams = { ...rest };
    if (tag) queryParams.tags = tag; // ✅ backend expects 'tags'

    const response = await API.get('/posts', { params: queryParams });

    const data = response?.data || {};
    return {
      posts: data.posts || [],
      totalPages: data.totalPages || 0,
      totalPosts: data.totalPosts || 0,
      page: data.page || 1,
      limit: data.limit || 10,
      count: data.count || 0,
    };
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};
 
/*-------------------------------------------------------
📝 Get all posts created by current user
@route   GET /api/posts/me
@access  Private
-------------------------------------------------------*/
export const getMyPosts = async (page = 1, limit = 10) => {
	try {
		const response = await API.get('/posts/me', {
			params: { page, limit },
		});
		return response?.data;
	} catch (error) {
		const errorMessage = handleError(error);
		throw new Error(errorMessage);
	}
};


/*-------------------------------------------------------
🟢 Get posts by user
@route   GET /api/users/:userId/posts
@access  Public
-------------------------------------------------------*/
// postService.js

export const getPostsByUsername = async (username, page = 1, limit = 10) => {
	try {
		const response = await API.get(`/posts/user/${username}`, {
			params: { page, limit },
		})
		return response?.data // { page, limit, totalPages, totalPosts, posts }
	} catch (error) {
		const errorMessage = handleError(error)
		throw new Error(errorMessage)
	}
}

/*-------------------------------------------------------
📄 Get a single post by ID
@route   GET /api/posts/:id
@access  Public / Private (if pending or own post)
-------------------------------------------------------*/
export const getPostById = async (postId) => {
	try {
		const response = await API.get(`/posts/${postId}`);
		return response?.data; // post object
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

/*-------------------------------------------------------
❌ Delete a post (author or admin)
@route   DELETE /api/posts/:id
@access  Private
-------------------------------------------------------*/
export const deletePost = async (postId) => {
	try {
		const response = await API.delete(`/posts/${postId}`);
		return response?.data; // { message }
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

/*-------------------------------------------------------
✅ Admin: Approve a post
@route   PUT /api/admin/posts/:id/approve
@access  Admin
-------------------------------------------------------*/
export const approvePost = async (postId) => {
	try {
		const response = await API.put(`/admin/posts/${postId}/approve`);
		return response?.data; // { message, postId }
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

/*-------------------------------------------------------
🚫 Admin: Reject a post
@route   PUT /api/admin/posts/:id/reject
@access  Admin
-------------------------------------------------------*/
export const rejectPost = async (postId, reason = '') => {
	try {
		const response = await API.put(`/admin/posts/${postId}/reject`, { reason });
		return response?.data; // { message, reason }
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

export const getPopularTags = async (params = {}) => {
  try {
    const response = await API.get("/tags/popular", { params });

    const data = response?.data || {};

    return {
      tags: data.tags || [],        // array of { name, totalInteractions }
      totalTags: data.tags?.length || 0,
      limit: data.limit || 10,
    };
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};