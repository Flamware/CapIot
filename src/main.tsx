import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Auth0Provider
            domain="dev-o6cd4ntq3e4xav4u.eu.auth0.com"
            clientId="O1pj5JHPscyPXP5svwOVnXbG6vxXYCdH"
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: 'http://localhost:8080/api/'
            }}
            useRefreshTokens={true} // Enable refresh tokens
            cacheLocation="localstorage" // Persist tokens in localStorage
        >
            <App />
        </Auth0Provider>
    </StrictMode>
);
