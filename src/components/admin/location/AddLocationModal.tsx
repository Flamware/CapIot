import React, { useState, useEffect } from 'react';
import { Location, Site } from '../../types/location';

interface AddLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newLocation: Partial<Location>) => void;
    sites: Site[];
    selectedSiteId: number | null;
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({ isOpen, onClose, onAdd, sites, selectedSiteId }) => {
    const [locationName, setLocationName] = useState('');
    const [locationDescription, setLocationDescription] = useState('');

    useEffect(() => {
        // Reset form fields when modal is opened for a new site
        if (isOpen) {
            setLocationName('');
            setLocationDescription('');
        }
    }, [isOpen]);

    const handleAdd = () => {
        if (locationName && selectedSiteId) {
            onAdd({
                location_name: locationName,
                location_description: locationDescription,
                site_id: Number(selectedSiteId)
            });
            onClose(); // Close the modal after submission
        }
    };

    if (!isOpen) {
        return null;
    }

    // Find the selected site's name to display in the modal
    const selectedSite = sites.find(site => site.site_id === selectedSiteId);

    return (
        <dialog open={isOpen} className="fixed inset-0 w-full max-w-md p-0 rounded-lg shadow-2xl z-50 transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 backdrop-blur-sm bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-2">Ajouter un nouvel emplacement</h2>
                    <p className="text-gray-500 mb-4">
                        Ajoutez un nouvel emplacement au site : {selectedSite?.site_name}.
                    </p>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="add_location_name" className="text-sm font-medium">
                                Nom
                            </label>
                            <input
                                id="add_location_name"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="add_location_description" className="text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="add_location_description"
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
                        disabled={!locationName}
                        className={`px-4 py-2 rounded-md text-white transition-colors ${!locationName ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        Ajouter
                    </button>
                </div>
            </div>
        </dialog>
    );
};