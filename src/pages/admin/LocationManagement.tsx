import React, { useState, useMemo } from "react";
import { Globe } from 'lucide-react';
import { AddLocationModal } from "../../components/admin/location/AddLocationModal";
import { LocationListHeader } from "../../components/admin/location/LocationListHeader.tsx";
import LocationTable from "../../components/admin/location/LocationTable.tsx";
import { ApiErrorModal } from "../../components/ApiErrorModal.tsx";
import {useLocations} from "../../components/hooks/useLocation.tsx";
import {Site,Location} from "../../components/types/location.ts";

const LocationManagement: React.FC = () => {
    // Destructure all necessary states and functions from the custom hook
    const {
        locations,
        searchTerm,
        loading,
        error,
        pagination,
        handleSearch,
        goToPage,
        addLocation,
        deleteLocation,
        modifyLocation,
        setError, // Exposed from the hook to allow clearing errors from modals
        availableLocations, // We will use this to get the unique sites
    } = useLocations();

    // UI-specific states remain in the component
    const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
    const [isEditLocationOpen, setIsEditLocationOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [isApiErrorModalOpen, setIsApiErrorModalOpen] = useState(false);

    // Use useMemo to get a unique list of sites from the locations data
    const sites = useMemo(() => {
        const uniqueSites = new Map<number, Site>();
        locations.forEach(loc => {
            if (loc.site_id && !uniqueSites.has(loc.site_id)) {
                uniqueSites.set(loc.site_id, {
                    site_id: loc.site_id,
                    site_name: loc.site_name,
                    site_address: loc.site_address, // Assuming site_address is available on the location object
                });
            }
        });
        return Array.from(uniqueSites.values());
    }, [locations]);

    // --- Modal Control Functions ---
    const openAddLocationModal = () => {
        setIsAddLocationOpen(true);
    };

    const closeAddLocationModal = () => {
        setIsAddLocationOpen(false);
        setError(null); // Clear any previous error on closing the modal
    };

    const handleCloseApiErrorModal = () => {
        setIsApiErrorModalOpen(false);
        setError(null); // Clear the error when closing the API error modal
    };

    const openEditDialog = (location: Location) => {
        setCurrentLocation(location);
        setIsEditLocationOpen(true);
        setError(null); // Clear any previous error on opening the edit dialog
    };

    // --- Data Manipulation Handlers (calling hook functions) ---
    const handleAddLocation = async (locationData: Partial<Location>) => {
        const errorMessage = await addLocation(locationData);
        if (errorMessage) {
            setIsApiErrorModalOpen(true); // Show API error modal if there's an error
        } else {
            closeAddLocationModal(); // Close add modal on success
        }
    };

    const handleEditLocation = async () => {
        if (!currentLocation) return; // Guard clause if no location is selected

        const errorMessage = await modifyLocation(currentLocation.location_id, {
            location_name: currentLocation.location_name,
            location_description: currentLocation.location_description,
            site_id: currentLocation.site_id, // Pass site_id to the API call
        });

        if (errorMessage) {
            setIsApiErrorModalOpen(true); // Show API error modal if there's an error
        } else {
            setIsEditLocationOpen(false); // Close edit modal on success
            setCurrentLocation(null); // Clear current location
        }
    };

    const handleDeleteLocation = async (id: number) => {
        const errorMessage = await deleteLocation(id);
        if (errorMessage) {
            setIsApiErrorModalOpen(true); // Show API error modal if there's an error
        }
    };

    // --- Form Change Handler for Edit Dialog ---
    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentLocation(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: name === "site_id" ? Number(value) : value,
            };
        });
    };

    // --- Render Logic ---
    if (loading) {
        return <a className="p-6 max-w-7xl mx-auto">Chargement des emplacements...</a>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <LocationListHeader searchTerm={searchTerm} onSearch={handleSearch} onAddLocation={openAddLocationModal} />

            <ApiErrorModal
                isOpen={isApiErrorModalOpen}
                error={error} // Error state comes from the hook
                onClose={handleCloseApiErrorModal}
            />

            {sites.map(site => (
                <div key={site.site_id} className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <Globe className="w-5 h-5 mr-2 text-gray-500" />
                        {site.site_name}
                    </h2>
                    <LocationTable
                        locations={locations.filter(loc => loc.site_id === site.site_id)}
                        onEdit={openEditDialog}
                        onDelete={handleDeleteLocation}
                    />
                </div>
            ))}

            {isAddLocationOpen && (
                <AddLocationModal
                    isOpen={isAddLocationOpen}
                    onClose={closeAddLocationModal}
                    onAdd={handleAddLocation}
                    sites={sites} // Pass the derived sites list to the modal
                />
            )}

            {/* Edit Location Dialog */}
            <dialog
                open={isEditLocationOpen}
                className="w-full max-w-md p-0 rounded-lg shadow-md"
            >
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-2">Modifier l'emplacement</h2>
                        <p className="text-gray-500 mb-4">
                            Mettez à jour les informations de l'emplacement.
                        </p>
                        {currentLocation && (
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="edit_location_name" className="text-sm font-medium">
                                        Nom
                                    </label>
                                    <input
                                        id="edit_location_name"
                                        name="location_name"
                                        value={currentLocation.location_name || ''} // Handle potential null/undefined
                                        onChange={handleEditFormChange}
                                        className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="edit_location_description" className="text-sm font-medium">
                                        Description
                                    </label>
                                    <textarea
                                        id="edit_location_description"
                                        name="location_description"
                                        value={currentLocation.location_description || ''} // Handle potential null/undefined
                                        onChange={handleEditFormChange}
                                        className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="edit_site_id" className="text-sm font-medium flex items-center">
                                        <Globe className="w-4 h-4 mr-2" /> Site
                                    </label>
                                    <select
                                        id="edit_site_id"
                                        name="site_id"
                                        value={currentLocation.site_id || ''}
                                        onChange={handleEditFormChange}
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
                        )}
                    </div>
                    <div className="flex justify-end p-4 gap-2">
                        <button
                            onClick={() => {
                                setIsEditLocationOpen(false);
                                setCurrentLocation(null);
                                setError(null); // Clear any previous error on closing
                            }}
                            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleEditLocation}
                            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
                        >
                            Enregistrer les modifications
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default LocationManagement;
