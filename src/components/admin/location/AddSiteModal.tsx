

// File: src/components/admin/location/AddSiteModal.tsx
import React, { useState } from 'react';
import { Site } from '../../types/location';

interface AddSiteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newSite: Site) => void;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [siteName, setSiteName] = useState('');
    const [siteAddress, setSiteAddress] = useState('');

    const handleAdd = () => {
        if (siteName) {
            onAdd({
                site_name: siteName, site_address: siteAddress,
                site_id: 0 // Temporary ID, should be replaced by backend ID
            });
            setSiteName('');
            setSiteAddress('');
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <dialog open={isOpen} className="fixed inset-0 w-full max-w-md p-0 rounded-lg shadow-2xl z-50 transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 backdrop-blur-sm bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-2">Ajouter un nouveau site</h2>
                    <p className="text-gray-500 mb-4">
                        Ajoutez un nouveau site à l'entreprise.
                    </p>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="add_site_name" className="text-sm font-medium text-gray-500">
                                Nom du site
                            </label>
                            <input
                                id="add_site_name"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="add_site_address" className="text-sm font-medium text-gray-500">
                                Adresse du site
                            </label>
                            <input
                                id="add_site_address"
                                value={siteAddress}
                                onChange={(e) => setSiteAddress(e.target.value)}
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
                        disabled={!siteName}
                        className={`px-4 py-2 rounded-md text-white transition-colors ${!siteName ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        Ajouter
                    </button>
                </div>
            </div>
        </dialog>
    );
};
