import React, { useState, useEffect } from "react";
import { useAuth } from "../components/hooks/useAuth.tsx";
import { useUsersApi } from "../components/hooks/useUsers.tsx";

const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { updateMe: updateMe } = useUsersApi();
    const [newName, setNewName] = useState<string>(user?.name || "");
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Sync newName with context user when user changes
    useEffect(() => {
        setNewName(user?.name || "");
    }, [user]);

    const handleEditNameClick = () => setIsEditingName(true);

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

    const handleSaveName = async () => {
        if (!user || !updateUser) return;

        try {
            setSaveStatus("saving");

            // Call API, will throw if it fails
            const updatedUser = await updateMe({ name: newName });

            // Update local context only if API call succeeded
            updateUser({ name: updatedUser.name });

            setSaveStatus("success");
            setIsEditingName(false);
        } catch (err: any) {
            setErrorMessage(err.response?.data?.message || "Failed to update name.");
            setSaveStatus("error");
        }
    };



    if (!user) return <div className="bg-gray-100 p-4">Loading profile...</div>;

    return (
        <div className="bg-gray-100 p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

            {/* Email */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full px-3 py-2 rounded bg-gray-200 cursor-not-allowed"
                />
            </div>

            {/* Name */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                {isEditingName ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newName}
                            onChange={handleNameInputChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                        <button
                            onClick={handleSaveName}
                            disabled={saveStatus === "saving"}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                            {saveStatus === "saving" ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={handleCancelEditName}
                            className="bg-gray-300 px-3 py-1 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={user.name || "Not set"}
                            readOnly
                            className="w-full px-3 py-2 rounded bg-gray-200 cursor-not-allowed"
                        />
                        <button
                            onClick={handleEditNameClick}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>
                    </div>
                )}
                {saveStatus === "success" && (
                    <p className="text-green-500 text-sm mt-1">Name updated!</p>
                )}
                {saveStatus === "error" && (
                    <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                )}
            </div>

            {/* Role */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                <input
                    type="text"
                    value={Array.isArray(user.roles) ? user.roles.join(", ") : user.roles || "N/A"}
                    readOnly
                    className="w-full px-3 py-2 rounded bg-gray-200 cursor-not-allowed"
                />
            </div>
        </div>
    );
};

export default Profile;
