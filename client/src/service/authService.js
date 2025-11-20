import API from "../api/axios";
import { handleError } from "../utils/handleError";

/**
 * Step 1️⃣ — Register new user (email/phone + password)
 * Response: { message, userId, verificationPending }
 */
export const registerUser = async (userData) => {
	try {
		const response = await API.post("/auth/register", userData);
		return response.data; // returns { message, userId, verificationPending }
	} catch (error) {
		throw new Error(handleError(error));
	}
};

/**
 * Step 2️⃣ — Verify user (code verification)
 * Response: { message, verificationComplete, userId, hasUsername, nextStep }
 */
export const verifyUser = async (identifier, code) => {
	try {
		const response = await API.post("/auth/verify", { identifier, code });
		return response.data; // No token yet — just verification status
	} catch (error) {
		throw new Error(handleError(error));
	}
};

/**
 * Step 3️⃣ — Complete profile by setting username
 * Response: { message, user, token }
 */

/**
 * Optional — Login existing user
 */
export const loginUser = async (formData) => {
	try {
		const response = await API.post("/auth/login", formData);
		localStorage.setItem("token", response.data.token);
		return response.data;
	} catch (error) {
		throw new Error(handleError(error));
	}
};

/**
 * Resend verification code
 */
export const resendCode = async (identifier, method = "email") => {
	try {
		const response = await API.post("/auth/resend-code", { identifier, method });
		return response.data;
	} catch (error) {
		throw new Error(handleError(error));
	}
};

/**
 * Check if username is available (before saving)
 */
export const checkUsername = async (username) => {
	try {
		const response = await API.get("/auth/check-username", {
			params: { username },
		});
		return response.data; // { available: true/false }
	} catch (error) {
		throw new Error(handleError(error));
	}
};
