import React, { useState, useEffect } from "react";
import { useAuth } from "../components/hooks/useAuth.tsx";
import { useUsersApi } from "../components/hooks/useUsers.tsx";

const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { updateMe: updateMe } = useUsersApi();
    const [newName, setNewName] = useState<string>(user?.name || "");
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [, setErrorMessage] = useState<string>("");

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
            setErrorMessage(err.response?.data?.message || "Échec de la mise à jour du nom.");
            setSaveStatus("error");
        }
    };



    if (!user) return <div className="bg-gray-100 p-4">Chargement du profil...</div>;

    return (
        <div className="bg-gray-100 p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Votre Profil</h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email :</label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="email"
                    value={user?.email || ''}
                    disabled
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nom :</label>
                <div className="flex items-center gap-2">
                    {isEditingName ? (
                        <>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                value={newName}
                                onChange={handleNameInputChange}
                            />
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleCancelEditName}
                            >
                                Annuler
                            </button>
                            <button
                                className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleSaveName}
                            >
                                Sauvegarder
                            </button>
                        </>
                    ) : (
                        <>
                            <span>{user?.name || 'Nom non défini'}</span>
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleEditNameClick}
                            >
                                Modifier
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
