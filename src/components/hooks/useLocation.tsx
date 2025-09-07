import { useState, useCallback, useMemo } from "react";
import { createApi } from "../../axios/api.tsx";
import { LocationsResponse, Location } from "../types/location.ts";
import {Pagination} from "../types/pagination.ts";

export const useLocations = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
    });
    const api = useMemo(() => createApi(), []);

    const fetchMeLocations = useCallback(async () => {
        setLoadingLocations(true);
        setError(null);
        try {
            const response = await api.get<Location[]>(`/users/me/locations`);
            setLocations(response.data || []);
        } catch (err) {
            setError("Erreur lors du chargement des emplacements.");
            setLoadingLocations(false);
        } finally {
            setLoadingLocations(false);
        }
    }, [api]);

    const fetchLocationsBySiteIds = useCallback(
        async (ids: number[], page = 1, limit = pagination.pageSize, query?: string) => {
            if (ids.length === 0) {
                setLocations([]);
                setPagination(prev => ({ ...prev, currentPage: 1, totalPages: 1, totalItems: 0 }));
                setLoadingLocations(false);
                return;
            }

            setLoadingLocations(true);
            setError(null);

            try {
                // Backend API should accept page & limit params and return pagination info
                const response = await api.get<LocationsResponse>(`/locations/sites`, {
                    params: {
                        site_ids: ids.join(","),
                        page,
                        limit,
                        search: query
                    }
                });

                const data = response.data;
                setLocations(data.data || []);
                setPagination(prev => ({
                    ...prev,
                    currentPage: data.currentPage || page,
                    pageSize: data.pageSize || limit,
                    totalItems: data.totalItems || 0,
                    totalPages: data.totalPages || 1
                }));
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des emplacements.");
            } finally {
                setLoadingLocations(false);
            }
        },
        [api, pagination.pageSize]
    );


    const fetchAllLocations = useCallback(async () => {
        setLoadingLocations(true);
        setError(null);
        try {
            const response = await api.get<LocationsResponse>(`/admin/locations`);
            setLocations(response.data.data || []);
        } catch (err) {
            setError("Erreur lors du chargement des emplacements.");
            setLoadingLocations(false);
        } finally {
            setLoadingLocations(false);
        }
    }
    , [api]);

    const addLocation = useCallback(async (siteIds : number[], locationData: Partial<Location>): Promise<string | null> => {
        setLoadingLocations(true);
        setError(null);
        try {
            await api.post<Location>(`/admin/location/create`, locationData);
            // After adding, we refetch to ensure the list is up-to-date.
            await fetchLocationsBySiteIds(siteIds);
            return null;
        } catch (err) {
            const errMsg = "Erreur lors de l'ajout de l'emplacement. Veuillez réessayer.";
            setError(errMsg);
            setLoadingLocations(false);
            return errMsg;
        } finally {
            setLoadingLocations(false);
        }
    }, [api, fetchLocationsBySiteIds]);

    const deleteLocation = useCallback(async (siteIds : number[], id: number): Promise<string | null> => {
        setLoadingLocations(true);
        setError(null);
        try {
            await api.delete(`/admin/location/${id}`);
            await fetchLocationsBySiteIds(siteIds);
            return null;
        } catch (err) {
            console.error("Error deleting location:", err);
            const errMsg = "Erreur lors de la suppression de l'emplacement. Veuillez réessayer.";
            setError(errMsg);
            return errMsg;
        } finally {
            setLoadingLocations(false);
        }
    }, [api, fetchLocationsBySiteIds]);

    const modifyLocation = useCallback(async (siteIds : number[],id: number, locationData: Partial<Location>): Promise<string | null> => {
        setLoadingLocations(true);
        setError(null);
        try {
            await api.put<Location>(`/admin/location/${id}`, locationData);
            await fetchLocationsBySiteIds(siteIds);
            return null;
        } catch (err) {
            console.error("Error modifying location:", err);
            const errMsg = "Erreur lors de la modification de l'emplacement. Veuillez réessayer.";
            setError(errMsg);
            return errMsg;
        } finally {
            setLoadingLocations(false);
        }
    }, [api, fetchLocationsBySiteIds]);

    const goToSitePage = useCallback(
        ( page: number,) => {
            console.log("Go to page:", page, "for site IDs:", setSelectedSiteId(prev => prev));
            if (selectedSiteId !== null) {
                fetchLocationsBySiteIds([selectedSiteId], page);
            }
        },[fetchLocationsBySiteIds, selectedSiteId]
    );



    return {
        locations,
        loadingLocations,
        pagination,
        error,
        addLocation,
        deleteLocation,
        goToSitePage,
        modifyLocation,
        selectedSiteId,
        setSelectedSiteId,
        setError,
        fetchMeLocations,
        fetchLocationsBySiteIds,
        fetchAllLocations
    };
};
