// src/services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const influxdbUrl = import.meta.env.VITE_INFLUXDB_URL;

console.log("API URL : ", apiUrl);
console.log("InfluxDB URL : ", influxdbUrl);

// Update createApi to accept a logout callback
const createApi = (logoutCallback: () => void): AxiosInstance => {
    const api = axios.create({
        baseURL: apiUrl,
    });

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

    api.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            // Check for 401 Unauthorized status
            if (error.response?.status === 401) {
                console.warn("Unauthorized access. The token might be expired. Forcing logout...");
                // Call the provided logout function to update React context and state
                logoutCallback();
            }
            return Promise.reject(error);
        }
    );

    return api;
};

// This function doesn't need the logout callback
const createInfluxApi = (): AxiosInstance => {
    const influxdbApi = axios.create({
        baseURL: influxdbUrl,
    });

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

    influxdbApi.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error("Error from InfluxDB API:", error);
            return Promise.reject(error);
        }
    );

    return influxdbApi;
};

export { createApi, createInfluxApi };