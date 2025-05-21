import axios, { AxiosInstance } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const influxdbUrl = import.meta.env.VITE_INFLUXDB_URL;

console.log("API URL : ", apiUrl);
console.log("InfluxDB URL : ", influxdbUrl);

// Create an Axios instance for the Backend API
const createApi = (): AxiosInstance => {
    const api = axios.create({
        baseURL: apiUrl,
    });

    // Request Interceptor: Add JWT token to headers for Backend API
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

    // Response Interceptor: Handle Unauthorized Errors for Backend API
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                console.warn("Unauthorized access to Backend API, redirecting to login...");
                localStorage.removeItem('customJwt'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
            return Promise.reject(error);
        }
    );

    return api;
};

// Create an Axios instance for the InfluxDB API
const createInfluxApi = (): AxiosInstance => {
    const influxdbApi = axios.create({
        baseURL: influxdbUrl,
    });

    // Request Interceptor: Add InfluxDB token to headers
    influxdbApi.interceptors.request.use(
        (config) => {
            const influxToken = import.meta.env.VITE_INFLUXDB_TOKEN;
            if (influxToken) {
                config.headers['Authorization'] = `Token ${influxToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor for InfluxDB API (handle errors as needed)
    influxdbApi.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error("Error from InfluxDB API:", error);
            // You might want to handle specific InfluxDB errors differently,
            // for example, not redirecting to the main login page.
            return Promise.reject(error);
        }
    );

    return influxdbApi;
};

export { createApi, createInfluxApi };