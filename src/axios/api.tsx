// src/services/api.ts
import axios, { AxiosInstance, AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const influxdbUrl = import.meta.env.VITE_INFLUXDB_URL;

console.log("API URL : ", apiUrl);
console.log("InfluxDB URL : ", influxdbUrl);

/**
 * 🔑 Trick: Because interceptors run outside React,
 * we can’t use `useApiError` directly here.
 * Instead, we register a global handler once (inside your AppWithProviders).
 */
let globalApiErrorHandler: ((error: any, message?: string) => void) | null =
    null;

export const registerApiErrorHandler = (
    handler: (error: any, message?: string) => void
) => {
    globalApiErrorHandler = handler;
};

// Update createApi to accept a logout callback
const createApi = (logoutCallback: () => void): AxiosInstance => {
    const api = axios.create({
        baseURL: apiUrl,
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("customJwt");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            // handle 401
            if (error.response?.status === 401) {
                console.warn("Unauthorized access. Token expired → logout");
                logoutCallback();
            }

            if (!error.response) {
                // Network error (server down, CORS issue, etc.)
                console.error("Network error:", error.message);
                globalApiErrorHandler?.(error, "Unable to connect to server. Please try again later.");
                return Promise.reject(error);
            }

            // Forward other errors to global error modal
            globalApiErrorHandler?.(error);
            return Promise.reject(error);
        }
    );

    return api;
};

const createInfluxApi = (): AxiosInstance => {
    const influxdbApi = axios.create({
        baseURL: influxdbUrl,
    });

    influxdbApi.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("customJwt");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    influxdbApi.interceptors.response.use(
        (response) => response,
        (error) => {
            globalApiErrorHandler?.(error);
            return Promise.reject(error);
        }
    );

    return influxdbApi;
};

export { createApi, createInfluxApi };
