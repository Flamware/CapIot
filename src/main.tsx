// index.tsx (or your main entry point)
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './AuthContext'; // Importez votre AuthProvider
import React from 'react';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <AuthProvider> {/* Enveloppez votre App avec l'AuthProvider */}
            <App />
        </AuthProvider>
    </React.StrictMode>
);