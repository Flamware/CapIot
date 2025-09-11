import { Loader2 } from "lucide-react";
import { useLocations } from "../components/hooks/useLocation.tsx";
import { useDeviceApi } from "../components/hooks/useDevice.tsx";
import { ApiErrorModal } from "../components/ApiErrorModal.tsx";
import LocationsSection from "../components/location/LocationSection.tsx";
import DeviceInfoModal from "../components/dashboard/DeviceInfoModal.tsx";
import { useSites } from "../components/hooks/useSite.tsx";
import {useEffect, useState} from "react";
import { DeviceInfo, LocationData } from "../components/location/Props.tsx";
import {PaginationControls} from "../components/admin/PaginationControls.tsx";
import DeviceSettingsModal from "../components/dashboard/DeviceSettingModal.tsx";
import {ComponentInfo} from "../components/types/device.ts";

const Dashboard = () => {
    // Hooks and state
    const {
        loadingLocations,
        locations: baseLocations,
        pagination,
        goToSitePage: goToPage,
        error: locationError,
        fetchLocationsBySiteIds,
        setError: setLocationError,
        setSelectedSiteId,
        selectedSiteId
    } = useLocations();

    const {
        loadingDevices: loadingDeviceData,
        apiError: deviceApiError,
        fetchDeviceFromLocation,
        fetchComponentsFromDevice,
        setApiError: setDeviceApiError,
        changeDeviceRange,
        commandDevice,
    } = useDeviceApi();

    const { sites: userSites, fetchMySites } = useSites();

    const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
    const [loadingDevicesAndSensors, setLoadingDevicesAndSensors] = useState(false);
    const [isDeviceInfoModalOpen, setIsDeviceInfoModalOpen] = useState(false);
    const [isDeviceSettingsModalOpen, setIsDeviceSettingsModalOpen] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [locationWithDevices, setLocationWithDevices] = useState<LocationData[]>([]);
    pagination.pageSize = 3; // Set page size to 3 for locations

    // EFFECT 1: Fetch sites on initial mount
    useEffect(() => {
        fetchMySites();
    }, [fetchMySites]);

    // EFFECT 2: Automatically select the first site when userSites are loaded
    useEffect(() => {
        if (userSites.length > 0 && !selectedSiteId) {
            setSelectedSiteId(userSites[0].site_id);
        }
    }, [userSites, selectedSiteId, setSelectedSiteId]);


    // EFFECT 3: Fetch locations when site is selected
    useEffect(() => {
        const fetchAllDataForSite = async () => {
            if (selectedSiteId) {
                await fetchLocationsBySiteIds([selectedSiteId]);
            } else {
                // Clear locations if no site is selected, or initial state
                setLocationWithDevices([]);
            }
        };
        fetchAllDataForSite();
    }, [selectedSiteId]);

    // EFFECT 4: Fetch devices + sensors after locations load
    useEffect(() => {
        const fetchDevicesAndSensors = async () => {
            if (loadingLocations) {
                setLoadingDevicesAndSensors(true);
                return;
            }

            if (baseLocations.length === 0) {
                setLoadingDevicesAndSensors(false);
                return;
            }

            setLoadingDevicesAndSensors(true);
            const locationsWithDeviceData: LocationData[] = [];

            for (const location of baseLocations) {
                try {
                    const devices = await fetchDeviceFromLocation(location.location_id);
                    const devicesWithSensors = [];
                    for (const device of devices) {
                        try {
                            const sensors = await fetchComponentsFromDevice(device.device_id);
                            devicesWithSensors.push({ ...device, components: sensors });
                        } catch {
                            devicesWithSensors.push({ ...device, components: [] });
                        }
                    }
                    locationsWithDeviceData.push({ ...location, devices: devicesWithSensors });
                } catch {
                    locationsWithDeviceData.push({ ...location, devices: [] });
                }
            }
            setLocationWithDevices(locationsWithDeviceData);
            setLoadingDevicesAndSensors(false);
        };

        fetchDevicesAndSensors();
    }, [baseLocations]);

    const handleCloseApiErrorModal = () => {
        setSaveError(null);
        setLocationError(null);
        setDeviceApiError(null);
    };

    const handleSaveDeviceSettings = async (updatedComponent: ComponentInfo, deviceId: string, ) => {
        try {
            // Assume we have an API function to save component settings
            await changeDeviceRange(deviceId, updatedComponent);
            // update local state to reflect changes
            if (selectedDevice) {
                setLocationWithDevices((prevLocations) =>
                    prevLocations.map((loc) => ({
                        ...loc,
                        devices: loc.devices.map((dev) =>
                            dev.device_id === deviceId
                                ? {
                                    ...dev,
                                    components: dev.components?.map((comp) =>
                                        comp.component_id === updatedComponent.component_id
                                            ? { ...comp, ...updatedComponent }
                                            : comp
                                    ),
                                }
                                : dev
                        ),
                    }))
                );
            }
            setIsDeviceSettingsModalOpen(false);
            setSelectedDevice(null);
        } catch (error) {
            setSaveError("Failed to save device settings. Please try again.");
        }
    }
    // FIX: Define handlers for devices
    const handleEditDeviceSettings = (device: DeviceInfo) => {
        setSelectedDevice(device);
        setIsDeviceSettingsModalOpen(true);
    };

    const handleInfoDevice = (device: DeviceInfo) => {
        setSelectedDevice(device);
        setIsDeviceInfoModalOpen(true);
    };
    const handleDeviceCommand = (device: DeviceInfo, command: string) => {
        // Corrected logic to update state based on command
        const newStatus = command === 'Start' ? 'Running' : 'Online';
        commandDevice(device.device_id, command);
        setLocationWithDevices((prevLocations) =>
            prevLocations.map((loc) => ({
                ...loc,
                devices: loc.devices.map((dev) =>
                    dev.device_id === device.device_id
                        ? { ...dev, status: newStatus }
                        : dev
                ),
            }))
        );
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans antialiased">
            <ApiErrorModal
                isOpen={!!(deviceApiError || locationError || saveError)}
                error={deviceApiError || locationError || saveError}
                onClose={handleCloseApiErrorModal}
            />

            {/* Sites Section */}
            <div className="sites-section mb-12">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Vos Sites</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Sélectionnez un site pour gérer ses emplacements et ses appareils.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userSites.map((site) => (
                        <button
                            key={site.site_id}
                            onClick={() => setSelectedSiteId(site.site_id)}
                            className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 ${
                                selectedSiteId === site.site_id
                                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-700"
                                    : "bg-white text-gray-900 border-gray-200 hover:bg-green-50"
                            }`}
                        >
                            <h2
                                className={`text-xl font-bold mb-1 truncate ${
                                    selectedSiteId === site.site_id ? "text-white" : "text-gray-900"
                                }`}
                            >
                                {site.site_name}
                            </h2>
                            <p
                                className={`text-sm ${
                                    selectedSiteId === site.site_id ? "text-green-100" : "text-gray-500"
                                }`}
                            >
                                Cliquez pour voir les emplacements
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            <hr className="my-10 border-gray-200" />

            {/* Locations Section */}
            <div className="locations-section mt-12">
                {selectedSiteId ? (
                    loadingLocations || loadingDeviceData || loadingDevicesAndSensors ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg">
                            <Loader2 className="animate-spin h-10 w-10 text-green-500 mb-4" />
                            <p className="text-gray-500 text-lg font-medium">Chargement des lieux, des appareils et des capteurs...</p>
                        </div>
                    ): (
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Emplacements du Site</h2>
                            <LocationsSection
                                locationsData={locationWithDevices}
                                onEditDeviceSettings={handleEditDeviceSettings}
                                onViewDeviceDetails={handleInfoDevice}
                                onDeviceCommandSend={handleDeviceCommand}
                            />
                        </div>
                    )
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                        <p className="text-gray-600 text-lg">
                            Veuillez sélectionner un site ci-dessus pour afficher ses emplacements.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination at the bottom */}
            {selectedSiteId && !loadingLocations && !loadingDeviceData && !loadingDevicesAndSensors && baseLocations.length > 0 && (
                <div className="flex flex-col sm:flex-row h-b justify-between items-center mt-8 p-4 bg-white rounded-xl shadow-lg">
                    <PaginationControls
                        pagination={pagination}
                        onGoToPage={goToPage}
                        onGoToPreviousPage={() => goToPage(pagination.currentPage - 1)}
                        onGoToNextPage={() => goToPage(pagination.currentPage + 1)}
                    />

                    <p className="text-gray-500 text-sm mt-4 sm:mt-0">
                        Page {pagination.currentPage} sur {pagination.totalPages} - {pagination.totalItems}{" "}
                        {pagination.totalItems === 1 ? "élément" : "éléments"}
                    </p>
                </div>
            )}

            {/* Device Info Modal */}
            {selectedDevice && (
                <DeviceInfoModal
                    isOpen={isDeviceInfoModalOpen}
                    device={selectedDevice}
                    onClose={() => {
                        setIsDeviceInfoModalOpen(false);
                        setSelectedDevice(null);
                    }}
                />
            )}
            {
                selectedDevice && (
                    <DeviceSettingsModal
                        isOpen={isDeviceSettingsModalOpen}
                        device={selectedDevice}
                        onSave={
                            (updatedComponent) => handleSaveDeviceSettings(updatedComponent, selectedDevice.device_id)
                        }
                        onClose={() => {
                            setIsDeviceSettingsModalOpen(false);
                            setSelectedDevice(null);
                        }}
                    />
                )
            }
        </div>
    );
};

export default Dashboard;