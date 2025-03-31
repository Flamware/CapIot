import axios, { AxiosInstance } from 'axios';

// Create a function to return the axios instance
const createApi = (): AxiosInstance => {
    // Create an Axios instance with an Authorization header if the JWT is in localStorage
    const api = axios.create({
        baseURL: 'http://localhost:8080', // Replace with your backend API base URL
    });

    // Interceptor to add JWT to the Authorization header for all requests
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('customJwt');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return api;
};

export default createApi;
