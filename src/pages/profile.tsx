import React, { useState, useEffect } from "react";
import {createApi} from "../axios/api"; // Adjust the path to your createApi function

interface User {
    id: number;
    email: string;
    name: string | null;
    role: string | null;
    created_at: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [newName, setNewName] = useState<string>("");
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const api = createApi(); // Initialize your Axios instance

    const fetchUserProfile = async () => {
        try {
            const response = await api.get<User>("/users/me"); // Adjust your API endpoint to fetch the current user's profile
            setUser(response.data);
            setNewName(response.data.name || "");
        } catch (error: any) {
            console.error("Error fetching profile:", error);
            setErrorMessage("Failed to load user profile.");
        }
    };

    const updateUserName = async () => {
        if (!user || newName === user.name) {
            setIsEditingName(false);
            return;
        }

        setSaveStatus("saving");
        setErrorMessage("");

        try {
            const response = await api.patch<User>("/users/me", { name: newName }); // Adjust your API endpoint to update the current user's name
            setUser(response.data);
            setIsEditingName(false);
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 2000);
        } catch (error: any) {
            console.error("Error updating name:", error);
            setErrorMessage(error?.response?.data?.message || error.message);
            setSaveStatus("error");
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleEditNameClick = () => {
        setIsEditingName(true);
    };

    const handleCancelEditName = () => {
        setNewName(user?.name || "");
        setIsEditingName(false);
        setErrorMessage("");
        setSaveStatus("idle");
    };

    const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
        setErrorMessage("");
        setSaveStatus("idle");
    };

    if (errorMessage) {
        return <div className="bg-red-200 p-4 text-red-800">{errorMessage}</div>;
    }

    if (!user) {
        return <div className="bg-gray-100 p-4">Loading profile...</div>;
    }

    return (
        <div className="bg-gray-100 p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                    type="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
                    value={user.email}
                    readOnly
                />
                <p className="text-gray-500 text-xs italic">Email cannot be changed yet.</p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                {isEditingName ? (
                    <div className="flex items-center">
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={newName}
                            onChange={handleNameInputChange}
                        />
                        <button
                            onClick={updateUserName}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                            disabled={saveStatus === "saving"}
                        >
                            {saveStatus === "saving" ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={handleCancelEditName}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                            disabled={saveStatus === "saving"}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
                            value={user.name || "Not set"}
                            readOnly
                        />
                        <button
                            onClick={handleEditNameClick}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                        >
                            Edit
                        </button>
                    </div>
                )}
                {saveStatus === "success" && <p className="text-green-500 text-sm mt-1">Name updated successfully!</p>}
                {saveStatus === "error" && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
                    value={user.role || "N/A"}
                    readOnly
                />
                <p className="text-gray-500 text-xs italic">Role cannot be changed.</p>
            </div>

            <div className="text-gray-600 text-sm">
                Created At: {new Date(user.created_at).toLocaleDateString()}
            </div>
        </div>
    );
};

export default Profile;