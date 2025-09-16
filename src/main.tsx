// index.tsx (or your main entry point)
import ReactDOM from 'react-dom/client';
import App from './App'; // The App component that already includes BrowserRouter and AuthProvider
import './index.css';
import React from 'react';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        {/* Only render your top-level App component here */}
        <App />
    </React.StrictMode>
);