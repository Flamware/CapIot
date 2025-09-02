import { DevicesWithLocation } from "../../components/types/device.ts";
import { Pagination } from "../../components/types/pagination.ts";
import { DeviceListHeader } from "../../components/admin/device/DeviceListHeader.tsx";
import { ApiErrorModal } from "../../components/ApiErrorModal.tsx";
import { DeviceTable } from "../../components/admin/device/DeviceTable.tsx";
import { PaginationControls } from "../../components/admin/PaginationControls.tsx";
import { Location as ApiLocation, Site } from "../../components/types/location.ts";
import {useEffect, useState} from "react";
import {useDeviceApi} from "../../components/hooks/useDevice.tsx";

interface DeviceManagementProps {
    onDeviceDeleted?: (deviceId: string) => void;
    onLocationAssigned?: (deviceId: string, locationId: number) => void;
}

export function DeviceManagement({ onDeviceDeleted, onLocationAssigned }: DeviceManagementProps) {
    const {
        apiError,
        fetchDevices,
        fetchAllLocations,
        fetchSites,
        assignLocationToDevice,
        editDeviceStatus,
        deleteDevice,
    } = useDeviceApi();

    const [devicesLocations, setDevicesLocations] = useState<DevicesWithLocation[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isApiErrorModalOpen, setIsApiErrorModalOpen] = useState(false);
    const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
    const [availableLocations, setAvailableLocations] = useState<ApiLocation[]>([]);
    const [availableSites, setAvailableSites] = useState<Site[]>([]);
    const [totalDevicesPages, setTotalDevicesPages] = useState(1);
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [devicesResponse, locationsResponse, sitesResponse] = await Promise.all([
                    fetchDevices(pagination.currentPage, pagination.pageSize, searchTerm),
                    fetchAllLocations(),
                    fetchSites(),
                ]);

                setDevicesLocations(devicesResponse.devices || []);
                setPagination({
                    currentPage: devicesResponse.pagination.currentPage,
                    pageSize: devicesResponse.pagination.pageSize,
                    totalItems: devicesResponse.pagination.totalItems,
                    totalPages: Math.ceil(devicesResponse.pagination.totalPages),
                });
                setTotalDevicesPages(Math.ceil(devicesResponse.pagination.totalPages));
                setAvailableLocations(locationsResponse.locations || []);
                setAvailableSites(sitesResponse || []);
            } catch (error: any) {
                // The hook already sets the error, but we need to open the modal here.
                setIsApiErrorModalOpen(true);
            }
            setLoading(false);

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

    const handleDeviceUpdate = async (deviceId: string, newStatus: string, newLocationId: number | null) => {
        try {
            if (newLocationId) {
                await assignLocationToDevice(deviceId, newLocationId);
                if (onLocationAssigned) {
                    onLocationAssigned(deviceId, newLocationId);
                }
            }
            if (newStatus) {
                await editDeviceStatus(deviceId, newStatus);
            }
        } catch (error: any) {
            console.error("Error updating device:", error.message);
            setIsApiErrorModalOpen(true);
        }
    };

    const handleDeleteDevice = async (deviceId: string) => {
        if (window.confirm(`Are you sure you want to delete device with ID: ${deviceId}?`)) {
            try {
                await deleteDevice(deviceId);
                if (onDeviceDeleted) {
                    onDeviceDeleted(deviceId);
                }
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
        new Date(deviceLocation?.last_seen).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                        <svg aria-hidden="true"
                             className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>

                ) : (
                <div className="rounded-md border">
                <DeviceTable
                    devices={filteredDevicesLocations}
                    locations={availableLocations}
                    sites={availableSites}
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