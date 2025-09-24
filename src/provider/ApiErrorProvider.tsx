import { createContext, useEffect, useState } from "react";
import { registerApiErrorHandler } from "../axios/api.tsx";
import { ApiErrorModal } from "../components/ApiErrorModal.tsx";
import { ApiErrorType } from "../components/types/ApiError.ts";

const ApiErrorContext = createContext<{
    error: ApiErrorType | null;
    dismissError: () => void;
} | null>(null);

export const ApiErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [error, setError] = useState<ApiErrorType | null>(null);

    useEffect(() => {
        registerApiErrorHandler((err) => {
            let apiError: ApiErrorType = {
                code: "internal_server_error",
                message: "An unknown error occurred",
            };

            // Prefer backend structured error
            if (err?.response?.data) {
                const data = err.response.data;
                apiError = {
                    code: data.code || "internal_server_error",
                    message: data.message || "An unknown error occurred",
                    details: data.details,
                };
            }
            // Fallback for network / Axios error
            else if (err?.message) {
                apiError = {
                    code: err.code || "internal_server_error",
                    message: err.message,
                };
            }

            console.log("ApiErrorProvider current error state:", apiError);
            setError(apiError);
        });
    }, []);

    const dismissError = () => setError(null);

    return (
        <ApiErrorContext.Provider value={{ error, dismissError }}>
            {children}
            <ApiErrorModal
                isOpen={!!error}
                error={error}
                onClose={dismissError}
            />
        </ApiErrorContext.Provider>
    );
};
