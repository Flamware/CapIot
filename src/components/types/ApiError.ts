// src/models/apiError.ts

interface ApiError {
    code: string;
    message: string;
    statusCode?: number; // Optional, if you included it in your Go model
    timestamp?: string; // Optional, if you included it in your Go model (might want to parse to Date)
    details?: Record<string, any>; // Or a more specific type if you know the structure
    internal?: string; // You likely won't include this in your frontend model
}

export type ApiErrorType = ApiError;