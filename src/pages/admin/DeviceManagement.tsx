import { useState, useEffect } from 'react';
import {DevicesLocationsResponse, DevicesWithLocation} from "../../components/types/device.ts";
import {Pagination} from "../../components/types/pagination.ts";
import {createApi} from "../../axios/api.tsx";
import {DeviceListHeader} from "../../components/admin/device/DeviceListHeader.tsx";
import {ApiErrorModal} from "../../components/ApiErrorModal.tsx";
import {DeviceTable} from "../../components/admin/device/DeviceTable.tsx";
import {PaginationControls} from "../../components/admin/PaginationControls.tsx";
import {AssignLocationModal} from "../../components/admin/AsignLocationModal.tsx";
import {EditDeviceDialog} from "../../components/admin/device/EditDeviceDialogProps.tsx";
import {Location, LocationsResponse} from "../../components/types/location.ts";

interface DeviceManagementProps {
    onDeviceDeleted?: (deviceId: string) => void;
    onLocationAssigned?: (deviceId: string, locationId: string) => void;
}

export function DeviceManagement({ onDeviceDeleted, onLocationAssigned }: DeviceManagementProps) {
    const [devicesLocations, setDevicesLocations] = useState<DevicesWithLocation[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingDevices, setLoadingDevices] = useState(true);
    const [apiError, setApiError] = useState<any | null>(null);
    const [isApiErrorModalOpen, setIsApiErrorModalOpen] = useState(false);
    const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
    const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [errorLocations, setApiErrorLocations] = useState<any | null>(null);
    const [locationPagination, setLocationPagination] = useState<Pagination>({ currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
    const api = createApi();
    const [selectedDeviceForAction, setSelectedDeviceForAction] = useState<string | null>(null);
    const [showAssignLocationModal, setShowAssignLocationModal] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [isEditDeviceOpen, setIsEditDeviceOpen] = useState(false);
    const [currentDevice, setCurrentDevice] = useState<DevicesWithLocation | null>(null);
    const [editedDeviceStatus, setEditedDeviceStatus] = useState('');
    const [totalDevicesPages, setTotalDevicesPages] = useState(1);
    const [totalLocationPages, setTotalLocationPages] = useState(1);

    const fetchDevicesData = async (page: number, limit: number, query?: string) => {
        setLoadingDevices(true);
        setApiError(null);
        setIsApiErrorModalOpen(false);
        try {
            const response = await api.get<DevicesLocationsResponse>(`/admin/devices-sensors-locations`, {
                params: { page, limit, search: query },
            });
            // Handle null data by setting an empty array
            setDevicesLocations(response.data.data || []);
            setPagination({
                currentPage: response.data.currentPage,
                pageSize: response.data.pageSize,
                totalItems: response.data.totalItems,
                totalPages: Math.ceil(response.data.totalPages),
            });
            setTotalDevicesPages(Math.ceil(response.data.totalPages));
        } catch (error: any) {
            setApiError(error);
            setIsApiErrorModalOpen(true);
        } finally {
            setLoadingDevices(false);
        }
    };

    const fetchAllLocationsData = async (page: number = 1, limit: number = 10) => {
        setLoadingLocations(true);
        setApiErrorLocations(null);
        setIsApiErrorModalOpen(false);
        try {
            const locationsResponse = await api.get<LocationsResponse>(`/admin/locations`, {
                params: { page, limit },
            });
            // Handle null data by setting an empty array
            setAvailableLocations(locationsResponse.data.data || []);
            setLocationPagination({
                currentPage: locationsResponse.data.currentPage,
                pageSize: locationsResponse.data.pageSize,
                totalItems: locationsResponse.data.totalItems,
                totalPages: Math.ceil(locationsResponse.data.totalPages),
            });
            setTotalLocationPages(Math.ceil(locationsResponse.data.totalPages));
        } catch (error: any) {
            console.error("Failed to fetch available locations:", error.message);
            setApiErrorLocations(error);
            setIsApiErrorModalOpen(true);
        } finally {
            setLoadingLocations(false);
        }
    };

    useEffect(() => {
        fetchDevicesData(pagination.currentPage, pagination.pageSize, searchTerm);
    }, [pagination.currentPage, pagination.pageSize, searchTerm]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalDevicesPages) {
            setPagination(prev => ({ ...prev, currentPage: page }));
        }
    };

    const goToPreviousPage = () => goToPage(pagination.currentPage - 1);
    const goToNextPage = () => goToPage(pagination.currentPage + 1);

    const openAssignLocationModal = (deviceId: string) => {
        setSelectedDeviceForAction(deviceId);
        setShowAssignLocationModal(true);
        setLocationPagination({ ...locationPagination, currentPage: 1 });
        fetchAllLocationsData(1, locationPagination.pageSize);
    };

    const closeAssignLocationModal = () => {
        setShowAssignLocationModal(false);
        setSelectedDeviceForAction(null);
        setSelectedLocationId(null);
    };

    const handleAssignLocation = async () => {
        console.log("Assigning location...");
        if (selectedDeviceForAction && selectedLocationId) {
            try {
                await api.post(`/admin/assign-device`, {
                    device_id: selectedDeviceForAction,
                    location_id: selectedLocationId,
                });
                fetchDevicesData(pagination.currentPage, pagination.pageSize, searchTerm);
                if (onLocationAssigned) {
                    onLocationAssigned(selectedDeviceForAction, selectedLocationId.toString());
                }
            } catch (error: any) {
                console.error("Error assigning location:", error.message);
                setApiError(error);
                setIsApiErrorModalOpen(true);
            } finally {
                closeAssignLocationModal();
            }
        }
    };

    const closeEditDeviceDialog = () => {
        setIsEditDeviceOpen(false);
        setCurrentDevice(null);
    };

    const handleEditDevice = async () => {
        if (currentDevice) {
            try {
                console.log("Editing device...");
                // Ensure the status is in lowercase
                console.log("Edited device status:", editedDeviceStatus);
                await api.patch(`/admin/devices/${currentDevice.device_id}`, { status: editedDeviceStatus });
                fetchDevicesData(pagination.currentPage, pagination.pageSize, searchTerm);
                setIsEditDeviceOpen(false);
                setCurrentDevice(null);
            } catch (error: any) {
                console.error("Error editing device:", error.message);
                setApiError(error);
            }
        }
    };

    const handleDeleteDevice = async (deviceId: string) => {
        if (window.confirm(`Are you sure you want to delete device with ID: ${deviceId}?`)) {
            try {
                await api.delete(`/admin/device/${deviceId}`);
                fetchDevicesData(pagination.currentPage, pagination.pageSize, searchTerm);
                if (onDeviceDeleted) {
                    onDeviceDeleted(deviceId);
                }
            } catch (error: any) {
                console.error("Error deleting device:", error.message);
                setApiError(error);
            }
        }
    };

    const filteredDevicesLocations = (devicesLocations || []).filter(deviceLocation =>
        deviceLocation?.device_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        deviceLocation?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(deviceLocation?.last_seen).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        deviceLocation?.sensors?.some(sensor => sensor.sensor_type?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        deviceLocation?.sensors?.some(sensor => sensor.sensor_id?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const goToLocationPage = (page: number) => {
        if (page >= 1 && page <= totalLocationPages) {
            setLocationPagination(prev => ({ ...prev, currentPage: page }));
            fetchAllLocationsData(page, locationPagination.pageSize);
        }
    };

    const goToPreviousLocationPage = () => goToLocationPage(locationPagination.currentPage - 1);
    const handleCloseAssignErrorModal = () => {
        setIsApiErrorModalOpen(false);
        setApiError(null);
    };



    if (loadingDevices) {
        return <div className="p-4">Loading devices locations...</div>;
    }

    return (
        <div className="space-y-4">
            <DeviceListHeader searchTerm={searchTerm} onSearch={handleSearch} />
            <ApiErrorModal
                isOpen={isApiErrorModalOpen}
                error={apiError}
                onClose={handleCloseAssignErrorModal}
            />
            <div className="rounded-md border">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Last Active</th>
                        <th className="p-2">Locations</th>
                        <th className="p-2">sensors</th>
                        <th className="p-2 text-right">Actions</th>
                    </tr>
                    </thead>
                    <DeviceTable
                        devices={filteredDevicesLocations}
                        onDelete={handleDeleteDevice}
                        onAssignLocation={openAssignLocationModal}
                        onEdit={(device) => {
                            setCurrentDevice(device);
                            setEditedDeviceStatus("");
                            setIsEditDeviceOpen(true);
                        }}
                    />
                </table>
            </div>

            <PaginationControls
                pagination={{ ...pagination, totalPages: totalDevicesPages }}
                onGoToPage={goToPage}
                onGoToPreviousPage={goToPreviousPage}
                onGoToNextPage={goToNextPage}
            />

            <AssignLocationModal
                isOpen={showAssignLocationModal}
                deviceId={selectedDeviceForAction}
                availableLocations={availableLocations}
                selectedLocationId={selectedLocationId}
                onLocationSelected={setSelectedLocationId}
                onAssign={handleAssignLocation}
                onCancel={closeAssignLocationModal}
                loadingLocations={loadingLocations}
                errorLocations={errorLocations}
                locationPagination={{ ...locationPagination, totalPages: totalLocationPages }}
                onGoToLocationPage={goToLocationPage}
                onGoToPreviousLocationPage={goToPreviousLocationPage}
                onGoToNextLocationPage={goToNextPage}
            />

            <EditDeviceDialog
                isOpen={isEditDeviceOpen}
                device={currentDevice}
                onClose={closeEditDeviceDialog}
                onSave={handleEditDevice}
                onStatusChange={setEditedDeviceStatus}
            />
        </div>
    );
}