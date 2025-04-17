import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header'; // Assurez-vous que l'extension est correcte (.tsx)
import React from "react";
import Login from "./pages/login"; // Assurez-vous que l'extension est correcte (.tsx)
import Profile from "./pages/profile"; // Assurez-vous que l'extension est correcte (.tsx)
import Dashboard from "./pages/dashboard"; // Assurez-vous que l'extension est correcte (.tsx)
import Admin from "./pages/admin"; // Assurez-vous que l'extension est correcte (.tsx)
import About from "./pages/about"; // Assurez-vous que l'extension est correcte (.tsx)
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/History.tsx"; // Importez le composant ProtectedRoute

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Header />
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/history" element={<History />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRoles={['admin']}>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute> {/* Protéger la route pour les utilisateurs connectés */}
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/unauthorized" element={<div className="text-center mt-10"><h1 className="text-2xl font-semibold text-red-500">Unauthorized</h1><p className="mt-2">You do not have permission to access this page.</p></div>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
};

export default App;