import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header.tsx';
import React from "react";
import Login from "./pages/login.tsx";
import Profile from "./pages/profile.tsx";
import Dashboard from "./pages/dashboard.tsx";
import Admin from "./pages/admin.tsx";


const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Header />
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="/profile" element={<Profile/>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
};

export default App;