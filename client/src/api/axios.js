import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
	baseURL: BASE_URL ? BASE_URL + '/api' : 'http://localhost:3000/api',
	// withCredentials: true,
});

API.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default API;
