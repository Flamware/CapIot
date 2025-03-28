import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header.tsx';
import React from "react";
import Login from "./pages/login.tsx";
import Profile from "./pages/profile.tsx";
import Dashboard from "./pages/dashboard.tsx";



const History: React.FC = () => (
    <div className="p-4">
        <h1 className="text-2xl font-bold">History</h1>
        <p>Historical air quality trends will be displayed here.</p>
    </div>
);

const Settings: React.FC = () => (
    <div className="p-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>Configure your air purifier or app settings here.</p>
    </div>
);

const About: React.FC = () => (
    <div className="p-4">
        <h1 className="text-2xl font-bold">About</h1>
        <p>Learn more about Cap.Iot Monitor.</p>
    </div>
);

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Header />
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile/>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
};

export default App;