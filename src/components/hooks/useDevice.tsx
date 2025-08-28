import { useState, useCallback } from 'react';
import { createApi } from "../../axios/api.tsx";
import { DevicesLocationsResponse, DevicesWithLocation } from "../types/device.ts";
import { Pagination } from "../types/pagination.ts";
import { LocationsResponse, Location } from "../types/location.ts";

export const useDeviceApi = () => {
    const api = createApi();

    const [loadingDevices, setLoadingDevices] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [apiError, setApiError] = useState<any | null>(null);

    const fetchDevices = useCallback(async (page: number, limit: number, query?: string): Promise<{ devices: DevicesWithLocation[], pagination: Pagination }> => {
        setLoadingDevices(true);
        setApiError(null);
        try {
            const response = await api.get<DevicesLocationsResponse>(`/admin/devices-components-locations`, {
                params: { page, limit, search: query },
            });
            const devices = response.data.data || [];
            const pagination = {
                currentPage: response.data.currentPage,
                pageSize: response.data.pageSize,
                totalItems: response.data.totalItems,
                totalPages: response.data.totalPages,
            };
            return { devices, pagination };
        } catch (error) {
            setApiError(error);
            throw error;
        } finally {
            setLoadingDevices(false);
        }
    }, [api]);

    const fetchAllLocations = useCallback(async (page: number = 1, limit: number = 10): Promise<{ locations: Location[], pagination: Pagination }> => {
        setLoadingLocations(true);
        setApiError(null);
        try {
            const locationsResponse = await api.get<LocationsResponse>(`/admin/locations`, {
                params: { page, limit },
            });
            const locations = locationsResponse.data.data || [];
            const pagination = {
                currentPage: locationsResponse.data.currentPage,
                pageSize: locationsResponse.data.pageSize,
                totalItems: locationsResponse.data.totalItems,
                totalPages: locationsResponse.data.totalPages,
            };
            return { locations, pagination };
        } catch (error) {
            setApiError(error);
            throw error;
        } finally {
            setLoadingLocations(false);
        }
    }, [api]);

    const assignLocationToDevice = useCallback(async (deviceId: string, locationId: number) => {
        setApiError(null);
        try {
            await api.post(`/admin/assign-device`, {
                device_id: deviceId,
                location_id: locationId,
            });
        } catch (error) {
            setApiError(error);
            throw error;
        }
    }, [api]);

    const editDeviceStatus = useCallback(async (deviceId: string, status: string) => {
        setApiError(null);
        try {
            await api.patch(`/admin/devices/${deviceId}`, { status });
        } catch (error) {
            setApiError(error);
            throw error;
        }
    }, [api]);

    const deleteDevice = useCallback(async (deviceId: string) => {
        setApiError(null);
        try {
            await api.delete(`/admin/device/${deviceId}`);
        } catch (error) {
            setApiError(error);
            throw error;
        }
    }, [api]);

    return {
        loadingDevices,
        loadingLocations,
        apiError,
        fetchDevices,
        fetchAllLocations,
        assignLocationToDevice,
        editDeviceStatus,
        deleteDevice,
    };
};