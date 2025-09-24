import { useState, useCallback } from 'react';
import {Component, Device, DevicesLocationsResponse, DevicesWithLocation} from "../types/device.ts";
import { Pagination } from "../types/pagination.ts";
import {useApi} from "./useApi.tsx";

export const useDeviceApi = () => {
    const api = useApi();

    const [loadingDevices, setLoadingDevices] = useState(false);
    const [apiError, setApiError] = useState<any | null>(null);

    const fetchDevices = useCallback(async (page: number, limit: number, query?: string): Promise<{ devices: DevicesWithLocation[], pagination: Pagination }> => {
        setLoadingDevices(true);
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

    const fetchDeviceFromLocation = useCallback(async (locationID: number): Promise<Device[]> => {
            setLoadingDevices(true);
            setApiError(null);
            try {
                const response = await api.get<Device[]>(`/location/${locationID}/devices`);
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

    const fetchComponentsFromDevice = useCallback(async (deviceID: string): Promise<Component[]> => {
            setLoadingDevices(true);
            setApiError(null);
            try {
                const response = await api.get<Component[]>(`/devices/${deviceID}/components`);
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

    const assignLocationToDevice = useCallback(async (deviceID: string, locationID: number) => {
        setApiError(null);
        try {
            await api.post(`/assign-device`, {
                device_id: deviceID,
                location_id: locationID,
            });
        } catch (error) {
            setApiError(error);
            setLoadingDevices(false);
            throw error;
        }
    }, [api]);

    // This function handles sending configuration updates, including min/max thresholds and running hours.
    const changeDeviceConfig = useCallback(async (deviceID: string, componentInfo: Component) => {
            setApiError(null);
            try {
                await api.patch(`/devices/${deviceID}/components/${componentInfo.component_id}`,
                    {
                        min_threshold: componentInfo.min_threshold,
                        max_threshold: componentInfo.max_threshold,
                        max_running_hours: componentInfo.max_running_hours
                    });

            } catch (error) {
                setApiError(error);
                throw error;
            }
        }
        , [api]);


    const deleteDevice = useCallback(async (deviceID: string) => {
        setApiError(null);
        try {
            await api.delete(`/device/${deviceID}`);
        } catch (error) {
            setApiError(error);
            throw error;
        }
    }, [api]);

    const commandDevice = useCallback(async (deviceID: string, command: string) => {
        setApiError(null);
        try {
            await api.post(`/devices/${deviceID}/command`, { command });
        } catch (error) {
            setApiError(error);
            throw error;
        }
    }, [api]);

    const commandComponent = useCallback(async (deviceID: string, componentId: string, command: string) => {
        setApiError(null);
        try {
            await api.post(`/devices/${deviceID}/components/${componentId}/command`, { command });
        } catch (error) {
            setApiError(error);
            throw error;
        }
    }, [api]);

    const fetchDeviceSensors = useCallback(async (deviceID: string) => {
            setLoadingDevices(true);
            setApiError(null);
            try {
                const response = await api.get<Component[]>(`/devices/${deviceID}/sensors`);
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

    return {
        loadingDevices,
        apiError,
        fetchDevices,
        fetchDeviceFromLocation,
        fetchComponentsFromDevice,
        fetchDeviceSensors,
        assignLocationToDevice,
        changeDeviceConfig,
        commandDevice,
        commandComponent,
        deleteDevice,
    };
};
