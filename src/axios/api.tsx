import axios, { AxiosInstance } from 'axios';
const apiUrl = "http://flamware.work/api"
console.log("API URL : ", apiUrl);

// Create an Axios instance
const createApi = (): AxiosInstance => {
    const api = axios.create({
        baseURL: apiUrl,
    });

    // Request Interceptor: Add JWT token to headers
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('customJwt');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor: Handle Unauthorized Errors
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                console.warn("Unauthorized access, redirecting to login...");
                localStorage.removeItem('customJwt'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
            return Promise.reject(error);
        }
    );

    return api;
};

export default createApi;
