import React, { useState } from 'react';
import {Location} from "../../types/location.ts";

interface AddLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newLocation: Partial<Location>) => void;
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [locationName, setLocationName] = useState('');
    const [locationDescription, setLocationDescription] = useState('');

    const handleAdd = () => {
        onAdd({ location_name: locationName, location_description: locationDescription });
        setLocationName('');
        setLocationDescription('');
    };

    if (!isOpen) {
        return null;
    }

    return (
        <dialog open={isOpen} className="w-full max-w-md p-0 rounded-lg shadow-md">
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-2">Ajouter un nouvel emplacement</h2>
                    <p className="text-gray-500 mb-4">
                        Ajoutez un nouvel emplacement au système.
                    </p>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="location_name" className="text-sm font-medium">
                                Nom
                            </label>
                            <input
                                id="location_name"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="location_description" className="text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="location_description"
                                value={locationDescription}
                                onChange={(e) => setLocationDescription(e.target.value)}
                                className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
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
                        onClick={handleAdd}
                        className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
                    >
                        Ajouter
                    </button>
                </div>
            </div>
        </dialog>
    );
};