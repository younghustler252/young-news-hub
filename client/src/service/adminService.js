import API from "../api/axios";
import { handleError } from "../utils/handleError";

/* ---------------------------------------------------
🟢 Dashboard Stats
--------------------------------------------------- */

// Fetch overview stats
export const fetchOverviewStats = async () => {
  try {
    const response = await API.get("/admin/overview");
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Fetch top liked posts
export const fetchTopPosts = async () => {
  try {
    const response = await API.get("/admin/top-posts");
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Fetch top authors
export const fetchTopAuthors = async () => {
  try {
    const response = await API.get("/admin/top-authors");
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Fetch posts grouped by date
export const fetchPostsByDate = async (days = 7) => {
  try {
    const response = await API.get(`/admin/posts-by-date?days=${days}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};


/* ---------------------------------------------------
🟢 User Management
--------------------------------------------------- */

// Get all users
export const fetchAllUsers = async (params = {}) => {
  try {
    const response = await API.get("/admin/users", { params });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get single user by ID
export const fetchUserById = async (userId) => {
  try {
    const response = await API.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Ban or unban a user
export const toggleUserBan = async (userId, action, reason = "") => {
  try {
    const response = await API.put(`/admin/users/${userId}/ban`, {
      action,
      reason,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Promote or demote admin
export const toggleAdminRole = async (userId, role) => {
  try {
    const response = await API.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};


/* ---------------------------------------------------
🟢 Post Management
--------------------------------------------------- */

// Get all posts
export const fetchAllPosts = async (params = {}) => {
  try {
    const response = await API.get("/admin/posts", { params });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Approve post
export const approvePost = async (postId) => {
  try {
    const response = await API.put(`/admin/posts/${postId}/approve`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Reject post
export const rejectPost = async (postId, reason) => {
  try {
    const response = await API.put(`/admin/posts/${postId}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
