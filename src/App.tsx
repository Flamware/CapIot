import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header.tsx';
import React from "react";
import Login from "./pages/login.tsx";
import Profile from "./pages/profile.tsx";
import Dashboard from "./pages/dashboard.tsx";
import Admin from "./pages/admin.tsx";
import About from "./pages/about.tsx";
import {AuthGuard} from "./hooks/AuthGuard.tsx";


const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Header />
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/admin"
                        element={
                            <AuthGuard requiredRoles={['admin']}>
                                <Admin />
                            </AuthGuard>
                        }
                    />
                    <Route path="/profile" element={<Profile />}/>
                    <Route path="/about" element={<About />} />
                    <Route path="/unauthorized" element={<div className="text-center mt-10"><h1 className="text-2xl font-semibold text-red-500">Unauthorized</h1><p className="mt-2">You do not have permission to access this page.</p></div>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
};

export default App;