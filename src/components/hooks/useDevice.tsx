import { useState, useCallback } from 'react';
import { createApi } from "../../axios/api.tsx";
import {ComponentInfo, DevicesLocationsResponse, DevicesWithLocation} from "../types/device.ts";
import { Pagination } from "../types/pagination.ts";
import {DeviceInfo} from "../location/Props.tsx";

export const useDeviceApi = () => {
    const api = createApi();

    const [loadingDevices, setLoadingDevices] = useState(false);
    const [apiError, setApiError] = useState<any | null>(null);

    const fetchDevices = useCallback(async (page: number, limit: number, query?: string): Promise<{ devices: DevicesWithLocation[], pagination: Pagination }> => {
        setLoadingDevices(true);
        setApiError(null);
        try {
            const response = await api.get<DevicesLocationsResponse>(`/devices-components-locations`, {
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
            setLoadingDevices(false);
            throw error;
        } finally {
            setLoadingDevices(false);
        }
    }, [api]);

    const fetchDeviceFromLocation = useCallback(async (locationId: number): Promise<DeviceInfo[]> => {
        setLoadingDevices(true);
        setApiError(null);
        try {
            const response = await api.get<DeviceInfo[]>(`/location/${locationId}/devices`);
            return response.data || [];
        } catch (error) {
            setApiError(error);
            setLoadingDevices(false);
            throw error;
        } finally {
            setLoadingDevices(false);
        }
    }
    , [api]);

    const fetchComponentsFromDevice = useCallback(async (deviceId: string): Promise<ComponentInfo[]> => {
        setLoadingDevices(true);
        setApiError(null);
        try {
            const response = await api.get<ComponentInfo[]>(`/devices/${deviceId}/components`);
            return response.data;
        } catch (error) {
            setApiError(error);
            setLoadingDevices(false);
            throw error;
        } finally {
            setLoadingDevices(false);
        }
    }
    , [api]);

    const assignLocationToDevice = useCallback(async (deviceId: string, locationId: number) => {
        setApiError(null);
        try {
            await api.post(`/assign-device`, {
                device_id: deviceId,
                location_id: locationId,
            });
        } catch (error) {
            setApiError(error);
            setLoadingDevices(false);
            throw error;
        }
        // if successful, update the device's location in state
    }, [api]);

    const editDeviceStatus = useCallback(async (deviceId: string, status: string) => {
        setApiError(null);
        try {
            await api.patch(`/devices/${deviceId}`, { status });
        } catch (error) {
            setApiError(error);
            throw error;
        }
    }, [api]);

    const changeDeviceRange= useCallback(async (deviceId: string, componentInfo: ComponentInfo) => {
        setApiError(null);
        try {
            await api.patch(`/devices/${deviceId}/components/${componentInfo.component_id}/range`,
                { min_threshold: componentInfo.min_threshold, max_threshold: componentInfo.max_threshold });
            // if successful, update the device's component range in state

        } catch (error) {
            setApiError(error);
            throw error;
        }
    }
    , [api]);

    const deleteDevice = useCallback(async (deviceId: string) => {
        setApiError(null);
        try {
            await api.delete(`/device/${deviceId}`);
        } catch (error) {
            setApiError(error);
            throw error;
        }
    }, [api]);

    return {
        loadingDevices,
        apiError,
        setApiError,
        fetchDevices,
        fetchDeviceFromLocation,
        fetchComponentsFromDevice,
        assignLocationToDevice,
        changeDeviceRange,
        editDeviceStatus,
        deleteDevice,
    };
};
