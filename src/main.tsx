// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // App should already wrap BrowserRouter, AuthProvider, etc.
import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
