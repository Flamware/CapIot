import React, { ReactNode } from 'react';

interface LoadingButtonProps {
    onClick: () => void;
    loading: boolean;
    disabled?: boolean;
    className?: string;
    children: ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
                                                         onClick,
                                                         loading,
                                                         disabled,
                                                         className,
                                                         children,
                                                     }) => {
    return (
        <button
            onClick={onClick}
            className={`${className} ${
                disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={disabled || loading}
        >
            {loading ? 'Chargement...' : children}
        </button>
    );
};

export default LoadingButton;