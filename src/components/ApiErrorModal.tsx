import React from 'react';

interface ApiErrorModalProps {
    isOpen: boolean;
    error: any; // Or a more specific error type
    onClose: () => void;
    onRetry?: () => void;
}

export const ApiErrorModal: React.FC<ApiErrorModalProps> = ({ isOpen, error, onClose, onRetry }) => {
    if (!isOpen) {
        return null;
    }

    let errorMessage = 'An unexpected error occurred.';
    let errorCode: string | undefined;
    let errorDetails: any;
    let formattedDetails: React.ReactNode | null = null;

    if (error && typeof error === 'object' && error !== null) {
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
            errorCode = error.response.data.code;
            errorDetails = error.response.data.details;

            // Format specific details for better readability
            if (errorDetails && typeof errorDetails === 'object') {
                const detailItems: React.ReactNode[] = [];
                if (errorDetails.error) {
                    detailItems.push(<p key="error" className="mb-1">
                        <strong className="font-semibold">Error:</strong> {errorDetails.error}
                    </p>);
                }
                if (errorDetails.constraint) {
                    detailItems.push(<p key="constraint" className="mb-1">
                        <strong className="font-semibold">Constraint:</strong> {errorDetails.constraint}
                    </p>);
                }
                // Add more specific detail keys here as needed

                if (detailItems.length > 0) {
                    formattedDetails = <div className="mb-4 border rounded-md p-2 bg-gray-100 text-sm text-gray-800">
                        <p className="font-semibold mb-1">Details:</p>
                        {detailItems}
                    </div>;
                } else if (Object.keys(errorDetails).length > 0) {
                    // Fallback to a more generic display if specific keys aren't found
                    const genericDetails = Object.entries(errorDetails).map(([key, value]) => (
                        <p key={key} className="mb-1">
                            <strong className="font-semibold">{key}:</strong> {String(value)}
                        </p>
                    ));
                    formattedDetails = <div className="mb-4 border rounded-md p-2 bg-gray-100 text-sm text-gray-800">
                        <p className="font-semibold mb-1">Details:</p>
                        {genericDetails}
                    </div>;
                }
            }
        } else if (error.response?.headers['error']) {
            errorMessage = error.response.headers['error'];
        } else if (error.message) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
                <strong className="block text-red-500 text-lg font-bold mb-2">API Error!</strong>
                {errorCode && <p className="text-sm text-gray-600 mb-1">Code: {errorCode}</p>}
                <p className="text-gray-700 mb-2">{errorMessage}</p>
                {formattedDetails}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                        Close
                    </button>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:shadow-outline"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};