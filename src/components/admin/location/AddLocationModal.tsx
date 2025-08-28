
// File: ../../components/admin/location/AddLocationModal.tsx
import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { Location, Site } from "../../types/location.ts";

interface AddLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newLocation: Partial<Location>) => void;
    sites: Site[];
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({ isOpen, onClose, onAdd, sites }) => {
    const [locationName, setLocationName] = useState('');
    const [locationDescription, setLocationDescription] = useState('');
    const [siteId, setSiteId] = useState<number | ''>('');

    const handleAdd = () => {
        if (locationName && siteId) {
            onAdd({ location_name: locationName, location_description: locationDescription, site_id: Number(siteId) });
            // Reset state
            setLocationName('');
            setLocationDescription('');
            setSiteId('');
            onClose();
        }
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
                        <div className="grid gap-2">
                            <label htmlFor="add_site_id" className="text-sm font-medium flex items-center">
                                <Globe className="w-4 h-4 mr-2" /> Site
                            </label>
                            <select
                                id="add_site_id"
                                value={siteId}
                                onChange={(e) => setSiteId(Number(e.target.value) || '')}
                                className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner un site</option>
                                {sites.map(site => (
                                    <option key={site.site_id} value={site.site_id}>
                                        {site.site_name}
                                    </option>
                                ))}
                            </select>
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
                        disabled={!locationName || !siteId}
                        className={`px-4 py-2 rounded-md text-white ${!locationName || !siteId ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        Ajouter
                    </button>
                </div>
            </div>
        </dialog>
    );
};
