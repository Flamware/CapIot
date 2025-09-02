import { useState, useEffect, useCallback, useMemo } from "react";
import { createApi } from "../../axios/api.tsx";
import { LocationsResponse, Location } from "../types/location.ts";

export const useLocations = (siteIds: number[]) => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const api = useMemo(() => createApi(), []);

    const fetchLocationsBySiteIds = useCallback(async (ids: number[]) => {
        if (ids.length === 0) {
            setLocations([]);
            setLoadingLocations(false);
            return;
        }

        setLoadingLocations(true);
        setError(null);

        try {
            // Adjust API endpoint to get locations by site IDs
            const response = await api.get<LocationsResponse>(`/admin/locations`, {
                params: { site_ids: ids.join(',') }
            });
            setLocations(response.data.data || []);
        } catch (err) {
            console.error("Error fetching locations by site IDs:", err);
            setError("Erreur lors du chargement des emplacements.");
        } finally {
            setLoadingLocations(false);
        }
    }, [api]);

    // Use this effect to trigger fetching locations whenever the siteIds change
    useEffect(() => {
        fetchLocationsBySiteIds(siteIds);
    }, [siteIds]); // These are the correct dependencies


    const addLocation = useCallback(async (locationData: Partial<Location>): Promise<string | null> => {
        setLoadingLocations(true);
        setError(null);
        try {
            await api.post<Location>(`/admin/location/create`, locationData);
            await fetchLocationsBySiteIds(siteIds);
            return null;
        } catch (err) {
            console.error("Error adding location:", err);
            const errMsg = "Erreur lors de l'ajout de l'emplacement. Veuillez réessayer.";
            setError(errMsg);
            return errMsg;
        } finally {
            setLoadingLocations(false);
        }
    }, [api, siteIds, fetchLocationsBySiteIds]);

    const deleteLocation = useCallback(async (id: number): Promise<string | null> => {
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
    }, [api, siteIds, fetchLocationsBySiteIds]);

    const modifyLocation = useCallback(async (id: number, locationData: Partial<Location>): Promise<string | null> => {
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
    }, [api, siteIds, fetchLocationsBySiteIds]);

    return {
        locations,
        loadingLocations,
        error,
        addLocation,
        deleteLocation,
        modifyLocation,
        setError,
    };
};