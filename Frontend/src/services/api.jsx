import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8090';

console.log('baseURL:', API_BASE_URL);

const api = axios.create({

    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;