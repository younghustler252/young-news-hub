import API from '../api/axios';
import { handleError } from "../utils/handleError";

// Get current user profile
export const getCurrentUser = async () => {
	try {
		const response = await API.get('/users/me');
		return response.data.user; // 👈 extract the user object directly
	} catch (error) {
		const errorMessage = handleError(error);
		throw new Error(errorMessage);
	}
};

// **
//  * Step 3️⃣ — Complete profile by setting username
//  * Response: { message, user, token }
//  */
export const completeProfile = async (userData) => {
	try {
		const response = await API.post("/users/complete-profile", userData);
		// Save token after profile completion
		localStorage.setItem("token", response.data.token);
		return response.data; // { user, token }
	} catch (error) {
		throw new Error(handleError(error));
	}
};


// Update user profile
export const updateProfile = async (profileData) => {
	try {
		const response = await API.put('/users/me', profileData);
		return response.data;
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

// Follow or unfollow a user
export const toggleFollow = async (userId) => {
	try {
		const response = await API.post(`/users/${userId}/follow`);
		return response.data;
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

// Admin: Ban or unban a user
export const banUser = async (userId, action, reason = '') => {
	try {
		const response = await API.put(`/admin/users/${userId}/ban`, {
			action,
			reason,
		});
		return response.data;
	} catch (error) {
		const errorMessage = handleError(error);
        throw new Error(errorMessage)
	}
};

// 🧩 Get user by username
export const getUserByUsername = async (username) => {
	try {
		const response = await API.get(`/users/${username}`);
		return response.data.user; // Return the user object directly
	} catch (error) {
		const errorMessage = handleError(error);
		throw new Error(errorMessage);
	}
};

