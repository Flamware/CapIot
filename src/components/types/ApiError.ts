// src/models/apiError.ts

interface ApiError {
    code: string;
    message: string;
    details?: any;
}

export type ApiErrorType = ApiError;