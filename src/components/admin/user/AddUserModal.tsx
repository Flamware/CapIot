// src/components/admin/user/AddUserModal.tsx
import React, { useState } from 'react';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (userData: { name: string }) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onAdd({ name });
            setName('');
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <dialog open={isOpen} className="w-full max-w-md p-0 rounded-lg shadow-md">
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-2">Ajouter un nouvel utilisateur</h2>
                    <p className="text-gray-500 mb-4">Ajoutez un nouvel utilisateur au système.</p>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Nom</label>
                            <input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* You can add more fields here if needed */}
                    </div>
                </div>
                <div className="flex justify-end p-4 gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
                    >
                        Ajouter un utilisateur
                    </button>
                </div>
            </div>
        </dialog>
    );
};