import React, { useState, useEffect, useCallback } from "react";
import {
    Location,
    LocationsResponse,
} from "../../components/types/location.ts";
import { createApi } from "../../axios/api.tsx";
import { Pagination } from "../../components/types/pagination.ts";
import {AddLocationModal} from "../../components/admin/location/AddLocationModal";
import {LocationListHeader} from "../../components/admin/location/LocationListHeader.tsx";
import LocationTable from "../../components/admin/location/LocationTable.tsx";
import {PaginationControls} from "../../components/admin/PaginationControls.tsx";
import {ApiErrorModal} from "../../components/ApiErrorModal.tsx";

const LocationManagement: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
    const [isEditLocationOpen, setIsEditLocationOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [isApiErrorModalOpen, setIsApiErrorModalOpen] = useState(false);

    const [, setNewLocation] = useState<Partial<Location>>({
        location_name: '',
        location_description: '',
    });
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
    });
    const api = createApi();

    const fetchLocations = useCallback(async (page: number, limit: number, query?: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get<LocationsResponse>(`/admin/locations-devices-users`, {
                params: {
                    page: page,
                    limit: limit,
                    search: query,
                },
            });
            setLocations(response.data.data || []);
            setPagination({
                currentPage: response.data.currentPage,
                pageSize: response.data.pageSize,
                totalItems: response.data.totalItems,
                totalPages: response.data.totalPages,
            });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Impossible de récupérer les emplacements.");
        } finally {
            setLoading(false);
        }
    }, [api]);

    const deleteLocation = useCallback(async (id: number) => {
        setLoading(true);
        setIsAddLocationOpen(false);
        setError(null);
        try {
            await api.delete(`/admin/location/${id}`);
            setLocations(prev => prev.filter(location => location.location_id !== id));
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Impossible de supprimer l'emplacement.");
            setIsApiErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [api]);

    const modifyLocation = useCallback(async (id: number, locationData: Partial<Location>) => {
        setLoading(true);
        setLoading(true);
        setError(null);
        try {
            const response = await api.put<Location>(`/admin/location/${id}`, locationData);
            setLocations(prev => prev.map(location => (location.location_id === id ? response.data : location)));
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Impossible de modifier l'emplacement.");
            setIsApiErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchLocations(pagination.currentPage, pagination.pageSize, searchTerm);
    }, [pagination.currentPage, pagination.pageSize, searchTerm]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const openAddLocationModal = () => {
        setIsAddLocationOpen(true);
    };

    const closeAddLocationModal = () => {
        setIsAddLocationOpen(false);
        setNewLocation({ location_name: '', location_description: '' });
        setError(null); // Clear any previous error on closing
    };

    const handleAddLocation = (locationData: Partial<Location>) => {
        setLoading(true);
        setIsAddLocationOpen(false);
        setError(null);
        api.post<Location>(`/admin/location`, locationData)
            .then(() => {
                closeAddLocationModal();
                fetchLocations(1, pagination.pageSize, searchTerm);
            })
            .catch((err: any) => {
                setError(err.response?.data?.message || err.message || "Impossible d'ajouter l'emplacement.");
                setIsApiErrorModalOpen(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleEditLocation = () => {
        if (!currentLocation) return;
        setLoading(true);
        setError(null);
        setIsEditLocationOpen(false);
        modifyLocation(currentLocation.location_id, {
            location_name: currentLocation.location_name,
            location_description: currentLocation.location_description,
        })
            .then(() => {
                setCurrentLocation(null);
                fetchLocations(pagination.currentPage, pagination.pageSize, searchTerm);
            })
            .catch((err: any) => {
                setError(err.response?.data?.message || err.message || "Impossible de modifier l'emplacement.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteLocation = (id: number) => {
        deleteLocation(id);
    };
    const handleCloseAssignErrorModal = () => {
        setIsApiErrorModalOpen(false);
        setError(null);
    };

    const openEditDialog = (location: Location) => {
        setCurrentLocation(location);
        setIsEditLocationOpen(true);
        setError(null); // Clear any previous error on opening
    };

    const goToPage = (page: number) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentLocation(prev => ({
            ...prev,
            [name]: value,
        } as Location));
    };

    if (loading) {
        return <a className="p-6 max-w-7xl mx-auto">Chargement des emplacements...</a>;
    }

    if (error) {
        return <div className="p-6 max-w-7xl mx-auto text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <LocationListHeader searchTerm={searchTerm} onSearch={handleSearch} onAddLocation={openAddLocationModal} />
            <ApiErrorModal
                isOpen={isApiErrorModalOpen}
                error={error}
                onClose={handleCloseAssignErrorModal}
            />
            <LocationTable
                locations={locations}
                onEdit={openEditDialog}
                onDelete={handleDeleteLocation}
            />

            <PaginationControls
                pagination={pagination}
                onGoToPage={goToPage}
                onGoToPreviousPage={() => goToPage(pagination.currentPage - 1)}
                onGoToNextPage={() => goToPage(pagination.currentPage + 1)}
            />

            <AddLocationModal
                isOpen={isAddLocationOpen}
                onClose={closeAddLocationModal}
                onAdd={handleAddLocation}
            />

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
                                        value={currentLocation.location_name}
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
                                        value={currentLocation.location_description}
                                        onChange={handleEditFormChange}
                                        className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
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
                            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
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