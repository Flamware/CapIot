import { useState, useCallback, useMemo } from "react";
import { createApi } from "../../axios/api.tsx";
import { Pagination } from "../types/pagination.ts";
import { SitesResponse, Site, LocationsResponse, Location } from "../types/location.ts";
import {AxiosError} from "axios";

export const useSites = () => {
    const [sites, setSites] = useState<Site[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sitePagination, setSitePagination] = useState<Pagination>({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
    });

    const api = useMemo(() => createApi(), []);

    // Function to fetch paginated sites and their locations
    const fetchSitesAndLocations = useCallback(async (page: number, limit: number, query?: string) => {
        setLoading(true);
        setError(null);
        try {
            const sitesResponse = await api.get<SitesResponse>(`/admin/sites`, {
                params: {
                    page: page,
                    limit: limit,
                    search: query,
                },
            });
            const fetchedSites = sitesResponse.data.data || [];
            setSites(fetchedSites);
            setSitePagination({
                currentPage: sitesResponse.data.currentPage,
                pageSize: sitesResponse.data.pageSize,
                totalItems: sitesResponse.data.totalItems,
                totalPages: sitesResponse.data.totalPages,
            });

            const siteIds = fetchedSites.map(site => site.site_id);
            if (siteIds.length > 0) {
                const locationsResponse = await api.get<LocationsResponse>(`/admin/locations`, {
                    params: { site_ids: siteIds.join(',') }
                });
                setLocations(locationsResponse.data.data || []);
            } else {
                setLocations([]);
            }
        } catch (err) {
            console.error("Error fetching sites and locations:", err);
            if (err instanceof AxiosError && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Erreur lors du chargement des sites et emplacements.");
            }
        } finally {
            setLoading(false);
        }
    }, [api]);

    // New: A dedicated function to fetch ALL sites (unpaginated)
    const fetchSites = useCallback(async (page: number, limit: number, query?: string) => {
        setLoading(true);
        setError(null);
        try {
            const sitesResponse = await api.get<SitesResponse>(`/admin/sites`, {
                params: {
                    page: page,
                    limit: limit,
                    search: query,
                },
            });
            setSites(sitesResponse.data.data || []);
        } catch (err) {
            console.error("Error fetching all sites:", err);
            if (err instanceof AxiosError && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Erreur lors du chargement des sites.");
            }
            return [];
        } finally {
            setLoading(false);
        }
    }
    , [api]);
    const fetchMySites = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<Site[]>(`/sites/me`);
            setSites(response.data || []);
        } catch (err) {
            console.error("Error fetching my sites:", err);
            if (err instanceof AxiosError && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Erreur lors du chargement de vos sites.");
            }
            return null;
        } finally {
            setLoading(false);
        }
    }
    , [api]);

    const addSite = useCallback(async (siteData: { site_name: string; site_address: string }): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            await api.post(`/admin/site/create`, siteData);
            await fetchSitesAndLocations(sitePagination.currentPage, sitePagination.pageSize, searchTerm);
            return null;
        } catch (err) {
            console.error("Error adding site:", err);
            const errMsg = "Erreur lors de l'ajout du site. Veuillez réessayer.";
            setError(errMsg);
            return errMsg;
        } finally {
            setLoading(false);
        }
    }, [api, fetchSitesAndLocations, sitePagination.currentPage, sitePagination.pageSize, searchTerm]);

    const deleteSite = useCallback(async (id: number): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/admin/site/${id}`);
            await fetchSitesAndLocations(sitePagination.currentPage, sitePagination.pageSize, searchTerm);
            return null;
        } catch (err) {
            console.error("Error deleting site:", err);
            const errMsg = "Erreur lors de la suppression du site. Assurez-vous qu'aucun emplacement n'y est associé.";
            setError(errMsg);
            return errMsg;
        } finally {
            setLoading(false);
        }
    }, [api, fetchSitesAndLocations, sitePagination.currentPage, sitePagination.pageSize, searchTerm]);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        setSitePagination(prev => ({ ...prev, currentPage: 1 }));
    }, []);

    const goToSitePage = useCallback((page: number) => {
        setSitePagination(prev => ({ ...prev, currentPage: page }));
    }, []);

    const addLocation = useCallback(async (locationData: Partial<Location>): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            await api.post<Location>(`/admin/location/create`, locationData);
            await fetchSitesAndLocations(sitePagination.currentPage, sitePagination.pageSize, searchTerm);
            return null;
        } catch (err) {
            console.error("Error adding location:", err);
            const errMsg = "Erreur lors de l'ajout de l'emplacement. Veuillez réessayer.";
            setError(errMsg);
            return errMsg;
        } finally {
            setLoading(false);
        }
    }, [api, fetchSitesAndLocations, sitePagination.currentPage, sitePagination.pageSize, searchTerm]);

    const deleteLocation = useCallback(async (id: number): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/admin/location/${id}`);
            await fetchSitesAndLocations(sitePagination.currentPage, sitePagination.pageSize, searchTerm);
            return null;
        } catch (err) {
            console.error("Error deleting location:", err);
            const errMsg = "Erreur lors de la suppression de l'emplacement. Veuillez réessayer.";
            setError(errMsg);
            return errMsg;
        } finally {
            setLoading(false);
        }
    }, [api, fetchSitesAndLocations, sitePagination.currentPage, sitePagination.pageSize, searchTerm]);

    const modifyLocation = useCallback(async (id: number, locationData: Partial<Location>): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            await api.put<Location>(`/admin/location/${id}`, locationData);
            await fetchSitesAndLocations(sitePagination.currentPage, sitePagination.pageSize, searchTerm);
            return null;
        } catch (err) {
            console.error("Error modifying location:", err);
            const errMsg = "Erreur lors de la modification de l'emplacement. Veuillez réessayer.";
            setError(errMsg);
            return errMsg;
        } finally {
            setLoading(false);
        }
    }, [api, fetchSitesAndLocations, sitePagination.currentPage, sitePagination.pageSize, searchTerm]);

    return {
        sites,
        locations,
        loading,
        error,
        searchTerm,
        sitePagination,
        addSite,
        deleteSite,
        fetchMySites,
        handleSearch,
        goToSitePage,
        setError,
        addLocation,
        deleteLocation,
        modifyLocation,
        fetchSitesAndLocations,
        fetchSites
    };
};
