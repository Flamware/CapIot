import { DevicesWithLocation } from "../../components/types/device.ts";
import { Pagination } from "../../components/types/pagination.ts";
import { DeviceListHeader } from "../../components/admin/device/DeviceListHeader.tsx";
import { ApiErrorModal } from "../../components/ApiErrorModal.tsx";
import { DeviceTable } from "../../components/admin/device/DeviceTable.tsx";
import { PaginationControls } from "../../components/admin/PaginationControls.tsx";
import { useDeviceApi } from "../../components/hooks/useDevice.tsx";
import {useEffect, useState} from "react";
import {Location} from "../../components/types/location.ts";

interface DeviceManagementProps {
    onDeviceDeleted?: (deviceId: string) => void;
    onLocationAssigned?: (deviceId: string, locationId: number) => void;
}

export function DeviceManagement({ onDeviceDeleted, onLocationAssigned }: DeviceManagementProps) {
    const { apiError, fetchDevices, assignLocationToDevice, editDeviceStatus, deleteDevice } = useDeviceApi();
    const [devicesLocations, setDevicesLocations] = useState<DevicesWithLocation[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isApiErrorModalOpen, setIsApiErrorModalOpen] = useState(false);
    const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, pageSize: 5, totalItems: 0, totalPages: 1 });
    const [totalDevicesPages, setTotalDevicesPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Fetch devices and sites on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [devicesResponse] = await Promise.all([
                    fetchDevices(pagination.currentPage, pagination.pageSize, searchTerm),
                ]);
                setDevicesLocations(devicesResponse.devices || []);
                setPagination({
                    currentPage: devicesResponse.pagination.currentPage,
                    pageSize: devicesResponse.pagination.pageSize,
                    totalItems: devicesResponse.pagination.totalItems,
                    totalPages: Math.ceil(devicesResponse.pagination.totalPages),
                });
                setTotalDevicesPages(Math.ceil(devicesResponse.pagination.totalPages));
            } catch (error: any) {
                console.error("Error fetching initial data:", error);
                setIsApiErrorModalOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    const handleDeviceUpdate = async (deviceId: string, newStatus: string, newLocation: Location | null) => {
        try {
            if (newLocation) {
                await assignLocationToDevice(deviceId, newLocation.location_id);
                if (onLocationAssigned) onLocationAssigned(deviceId, newLocation.location_id);
            }
            if (newStatus) {
                await editDeviceStatus(deviceId, newStatus);
            }

            // Update local state after successful update
            setDevicesLocations(prevDevices =>
                prevDevices.map(device =>
                    device.device_id === deviceId
                        ? {
                            ...device,
                            status: newStatus || device.status,
                            location: newLocation || device.location
                        }
                        : device
                )
            );

        } catch (error: any) {
            console.error("Error updating device:", error.message);
            setIsApiErrorModalOpen(true);
        }
    };


    const handleDeleteDevice = async (deviceId: string) => {
        if (window.confirm(`Are you sure you want to delete device with ID: ${deviceId}?`)) {
            try {
                await deleteDevice(deviceId);
                if (onDeviceDeleted) onDeviceDeleted(deviceId);
            } catch (error: any) {
                console.error("Error deleting device:", error.message);
                setIsApiErrorModalOpen(true);
            }
        }
    };

    const handleCloseErrorModal = () => {
        setIsApiErrorModalOpen(false);
    };

    const filteredDevicesLocations = (devicesLocations || []).filter(deviceLocation =>
        deviceLocation?.device_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        deviceLocation?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deviceLocation?.last_seen && new Date(deviceLocation.last_seen).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        deviceLocation?.components?.some(sensor => sensor.component_type?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        deviceLocation?.components?.some(sensor => sensor.component_id?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-4">
            <DeviceListHeader searchTerm={searchTerm} onSearch={handleSearch} />
            <ApiErrorModal
                isOpen={isApiErrorModalOpen}
                error={apiError}
                onClose={handleCloseErrorModal}
            />
            {loading ? (
                <div role="status" className="flex justify-center items-center h-64">
                    <span>Loading...</span>
                </div>
            ) : (
                <div className="rounded-md border">
                    <DeviceTable
                        devices={filteredDevicesLocations}
                        onUpdate={handleDeviceUpdate}
                        onDelete={handleDeleteDevice}
                    />
                </div>
            )}

            <PaginationControls
                pagination={{ ...pagination, totalPages: totalDevicesPages }}
                onGoToPage={goToPage}
                onGoToPreviousPage={goToPreviousPage}
                onGoToNextPage={goToNextPage}
            />
        </div>
    );
}
