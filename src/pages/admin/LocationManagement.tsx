import React, {useState, useEffect} from "react";
import { Globe, MapPin, Plus, Trash2 } from 'lucide-react';
import { AddLocationModal } from "../../components/admin/location/AddLocationModal";
import LocationTable from "../../components/admin/location/LocationTable.tsx";
import { ApiErrorModal } from "../../components/ApiErrorModal.tsx";
import { Site, Location } from "../../components/types/location.ts";
import LocationListHeader from "../../components/admin/location/LocationListHeader.tsx";
import { AddSiteModal } from "../../components/admin/location/AddSiteModal.tsx";
import {useSites} from "../../components/hooks/useSite.tsx";
import {PaginationControls} from "../../components/admin/PaginationControls.tsx";

const LocationManagement: React.FC = () => {
    // UI-specific states
    const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
    const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
    const [currentSiteIdForModal, setCurrentSiteIdForModal] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const {
        sites,
        locations,
        error,
        searchTerm,
        sitePagination,
        addSite,
        deleteSite,
        handleSearch,
        goToSitePage,
        addLocation,
        deleteLocation,
        modifyLocation,
        setError, // We will use this to clear the error state
        fetchSitesAndLocations // We need this to fetch the data
    } = useSites();

    // Fetch initial data on component mount and on pagination/search changes
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            await fetchSitesAndLocations(sitePagination.currentPage, sitePagination.pageSize, searchTerm);
            setLoading(false);
        }
        fetchAllData();
    }, [fetchSitesAndLocations, sitePagination.currentPage, sitePagination.pageSize, searchTerm]);

    const openAddLocationModal = (siteId: number) => {
        setIsAddLocationOpen(true);
        setCurrentSiteIdForModal(siteId);
    };

    const closeAddLocationModal = () => {
        setIsAddLocationOpen(false);
        setCurrentSiteIdForModal(null);
    };

    const openAddSiteModal = () => {
        setIsAddSiteOpen(true);
    };

    const closeAddSiteModal = () => {
        setIsAddSiteOpen(false);
    };

    // New handler to directly clear the error state from the hook
    const handleCloseApiErrorModal = () => {
        setError(null);
    };

    const handleAddLocation = async (locationData: Partial<Location>) => {
        await addLocation(locationData);
        closeAddLocationModal(); // The hook will handle the error and the component will re-render
    };

    const handleAddSite = async (siteData: Site) => {
        await addSite(siteData);
        closeAddSiteModal();
    };

    const handleEditLocation = async (location: Location) => {
        await modifyLocation(location.location_id, {
            location_name: location.location_name,
            location_description: location.location_description,
            site_id: location.site_id,
        });
    };

    const handleDeleteLocation = async (id: number) => {
        await deleteLocation(id);
    };

    const handleDeleteSite = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce site et tous les emplacements associés ?")) {
            await deleteSite(id);
        }
    };

    // Group locations by site_id for easier rendering
    const groupedLocations = sites.reduce((acc, site) => {
        acc[site.site_id] = locations.filter(loc => loc.site_id === site.site_id);
        return acc;
    }, {} as {[key: number]: Location[]});

    return (
        <div className="p-6 max-w-7xl mx-auto font-sans">
            <LocationListHeader
                searchTerm={searchTerm}
                onSearch={handleSearch}
                onAddLocation={() => {}}
                onAddSite={openAddSiteModal}
            />

            <ApiErrorModal
                isOpen={!!error}
                error={error}
                onClose={handleCloseApiErrorModal}
            />
            {loading ? (

                <div role="status" className="flex justify-center items-center h-64">
                    <svg aria-hidden="true"
                         className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>

            ) : (
            sites.length > 0 ? (
                <>
                    {sites.map(site => (
                        <div key={site.site_id} className="mb-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold flex items-center text-gray-800">
                                    <Globe className="w-6 h-6 mr-2 text-gray-500"/>
                                    {site.site_name}
                                    <span className="text-base text-gray-500 font-normal ml-4">({site.site_address})</span>
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => openAddLocationModal(site.site_id)}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
                                    >
                                        <MapPin className="w-4 h-4"/>
                                        Ajouter un Emplacement
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSite(site.site_id)}
                                        className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                                        title="Supprimer le site"
                                    >
                                        <Trash2 className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                            <LocationTable
                                locations={groupedLocations[site.site_id] || []}
                                onSaveEdit={handleEditLocation}
                                onDelete={handleDeleteLocation}
                            />
                        </div>
                    ))}
                    <div className="mt-8 flex justify-center">
                        <PaginationControls
                            pagination={sitePagination}
                            onGoToPage={goToSitePage}
                            onGoToPreviousPage={() => goToSitePage(sitePagination.currentPage - 1)}
                            onGoToNextPage={() => goToSitePage(sitePagination.currentPage + 1)}
                        />
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg">
                    <p className="text-gray-500 text-lg mb-4">Aucun site n'a encore été créé.</p>
                    <button
                        onClick={openAddSiteModal}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Commencez par ajouter un site
                    </button>
                </div>
            ))}

            <AddLocationModal
                isOpen={isAddLocationOpen}
                onClose={closeAddLocationModal}
                onAdd={handleAddLocation}
                sites={sites}
                selectedSiteId={currentSiteIdForModal}
            />

            <AddSiteModal
                isOpen={isAddSiteOpen}
                onClose={closeAddSiteModal}
                onAdd={handleAddSite}
            />
        </div>
    );
};

export default LocationManagement;
