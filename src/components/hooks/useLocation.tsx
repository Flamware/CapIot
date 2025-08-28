import { useState, useEffect, useCallback, useMemo } from "react";
import { createApi } from "../../axios/api.tsx";
import { Pagination } from "../types/pagination.ts";
import { Location, LocationsResponse } from "../types/location.ts";

export const useLocations = () => {
    // --- States for main locations data (from /admin/locations-devices-users) ---
    const [locations, setLocations] = useState<Location[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
    });

    // --- NEW States for available locations (from /admin/locations) ---
    const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
    const [loadingAvailableLocations, setLoadingAvailableLocations] = useState(false);
    const [availableLocationsError, setAvailableLocationsError] = useState<string | null>(null);
    const [availableLocationPagination, setAvailableLocationPagination] = useState<Pagination>({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
    });

    const api = useMemo(() => createApi(), []);

    // --- Fetch function for main locations data ---
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
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    }, [api]);

    // --- NEW Fetch function for available locations data ---
    const fetchAvailableLocations = useCallback(async (page: number, limit: number) => {
        setLoadingAvailableLocations(true);
        setAvailableLocationsError(null);
        try {
            const response = await api.get<LocationsResponse>(
                `/admin/locations`,
                {params: {page: page, limit: limit}}
            );
            setAvailableLocations(response.data.data || []);
            setAvailableLocationPagination({
                currentPage: response.data.currentPage,
                pageSize: response.data.pageSize,
                totalItems: response.data.totalItems,
                totalPages: response.data.totalPages,
            });
        } catch (error) {
            console.error("Error fetching locations:", error);
            setAvailableLocations([]);
        } finally {
            setLoadingAvailableLocations(false);
        }
    }, [api]); // 'api' is a stable dependency

    useEffect(() => {
        fetchLocations(pagination.currentPage, pagination.pageSize, searchTerm);
    }, [pagination.currentPage, pagination.pageSize, searchTerm, fetchLocations]);

    // --- NEW useEffect for available locations ---
    // This effect runs when the pagination for available locations changes
    useEffect(() => {
        fetchAvailableLocations(availableLocationPagination.currentPage, availableLocationPagination.pageSize);
    }, [availableLocationPagination.currentPage, availableLocationPagination.pageSize, fetchAvailableLocations]);


    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, []);

    const goToPage = useCallback((page: number) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    }, []);

    // --- NEW function for available locations pagination ---
    const goToAvailableLocationPage = useCallback((page: number) => {
        setAvailableLocationPagination(prev => ({...prev, currentPage: page}));
    }, []);

    const addLocation = useCallback(async (locationData: Partial<Location>): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            await api.post<Location>(`/admin/location/create`, locationData);
            fetchLocations(1, pagination.pageSize, searchTerm);
            fetchAvailableLocations(availableLocationPagination.currentPage, availableLocationPagination.pageSize); // Also refetch available locations
            return null;
        } catch (error) {
            console.error("Error fetching locations:", error);
            return "Erreur lors de l'ajout de l'emplacement. Veuillez réessayer."
        } finally {
            setLoading(false);
        }
    }, [api, fetchLocations, pagination.pageSize, searchTerm, fetchAvailableLocations, availableLocationPagination.currentPage, availableLocationPagination.pageSize]);

    const deleteLocation = useCallback(async (id: number): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/admin/location/${id}`);
            fetchLocations(pagination.currentPage, pagination.pageSize, searchTerm);
            fetchAvailableLocations(availableLocationPagination.currentPage, availableLocationPagination.pageSize); // Also refetch available locations
            return null;
        } catch (error) {
            console.error("Error fetching locations:", error);
            return "Erreur lors de la suppression de l'emplacement. Veuillez réessayer."
        } finally {
            setLoading(false);
        }
    }, [api, fetchLocations, pagination.currentPage, searchTerm, fetchAvailableLocations, availableLocationPagination.currentPage, availableLocationPagination.pageSize]);

    const modifyLocation = useCallback(async (id: number, locationData: Partial<Location>): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            await api.put<Location>(`/admin/location/${id}`, locationData);
            fetchLocations(pagination.currentPage, pagination.pageSize, searchTerm);
            fetchAvailableLocations(availableLocationPagination.currentPage, availableLocationPagination.pageSize); // Also refetch available locations
            return null;
        } catch (error) {
            console.error("Error fetching locations:", error);
            return "Erreur lors de la modification de l'emplacement. Veuillez réessayer."
        } finally {
            setLoading(false);
        }
    }, [api, fetchLocations, pagination.currentPage, searchTerm, fetchAvailableLocations, availableLocationPagination.currentPage, availableLocationPagination.pageSize]);

    return {
        // Main locations data and handlers
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
        setError,

        // NEW: Available locations data and handlers
        availableLocations,
        loadingAvailableLocations,
        availableLocationsError,
        availableLocationPagination,
        fetchAvailableLocations,
        goToAvailableLocationPage,
    };
};
