import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import About from "./pages/about";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/history";
import { SideBar } from "./components/SideBar";
import ContentHeader from "./components/header";
import { DeviceManagement } from "./pages/admin/DeviceManagement";
import LocationManagement from "./pages/admin/LocationManagement";
import { UserManagement } from "./pages/admin/UserManagement";
import { useAuth } from "./components/hooks/useAuth";
import NoRolePage from "./pages/norole";
import { AuthProvider } from "./AuthContext";
import { useState } from "react";
import Notifications from "./pages/notifications";
import { useIsMobile } from "./components/hooks/useIsMobile";
import { ApiErrorProvider } from "./provider/ApiErrorProvider";

const App = () => {
    const { isAuthenticated } = useAuth(); // ✅ works now, since App is wrapped below
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isMobile = useIsMobile(1100);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="relative flex flex-row h-screen bg-gray-50 overflow-hidden">
            {isAuthenticated && (
                <SideBar
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                    isMobile={isMobile}
                />
            )}

            <div className="flex-1 overflow-y-auto">
                <ContentHeader
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                    onCloseSidebar={closeSidebar}
                    isMobile={isMobile}
                />
                <main className="container mx-auto p-4">
                    <Routes>
                        <Route path="/no-role" element={<NoRolePage />} />
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/dashboard" replace />
                                ) : (
                                    <Login />
                                )
                            }
                        />

                        {/* User routes */}
                        <Route
                            element={
                                <ProtectedRoute
                                    requiredRoles={["user", "admin", "operateur", "gestionnaire"]}
                                />
                            }
                        >
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/notifications" element={<Notifications />} />

                            <Route path="/notifications/device/:deviceId" element={<Notifications />} />                        </Route>

                        {/* Admin/operateur routes */}
                        <Route
                            element={
                                <ProtectedRoute requiredRoles={["admin", "operateur"]} />
                            }
                        >
                            <Route path="/admin/users" element={<UserManagement />} />
                            <Route path="/admin/devices" element={<DeviceManagement />} />
                            <Route path="/admin/locations" element={<LocationManagement />} />
                        </Route>

                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/unauthorized" element={<NoRolePage />} />

                        {/* Catch-all */}
                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to={isAuthenticated ? "/dashboard" : "/login"}
                                    replace
                                />
                            }
                        />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

const AppWithProviders = () => (
    <BrowserRouter>
        <AuthProvider>
            <ApiErrorProvider>
                <App />
            </ApiErrorProvider>
        </AuthProvider>
    </BrowserRouter>
);

export default AppWithProviders;
