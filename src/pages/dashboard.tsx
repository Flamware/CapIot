import { Loader2 } from "lucide-react";
import { useLocations } from "../components/hooks/useLocation.tsx";
import { useDeviceApi } from "../components/hooks/useDevice.tsx";
import DeviceInfoModal from "../components/dashboard/DeviceInfoModal.tsx";
import { useSites } from "../components/hooks/useSite.tsx";
import { useEffect, useState } from "react";
import { LocationData } from "../components/location/Props.tsx";
import { PaginationControls } from "../components/admin/PaginationControls.tsx";
import { Component, Device } from "../components/types/device.ts";
import DeviceSettingsModal from "../components/dashboard/DeviceSettingModal.tsx";
import DeviceScheduleSettingModal from "../components/dashboard/DeviceScheduleSettingModal.tsx";
import { RecurringSchedule } from "../components/types/schedule.tsx";
import { useScheduleApi } from "../components/hooks/useSchedule.tsx";
import LocationCard from "../components/location/locationCard.tsx";

const Dashboard = () => {
    // Hooks and state
    const {
        loadingLocations,
        locations: baseLocations,
        pagination,
        goToSitePage: goToPage,
        fetchLocationsBySiteIds,
        setSelectedSiteId,
        selectedSiteId
    } = useLocations();

    const {
        loadingDevices: loadingDeviceData,
        fetchDeviceFromLocation,
        fetchComponentsFromDevice,
        commandDevice,
        commandComponent,
        changeDeviceConfig
    } = useDeviceApi();

    const {
        loading: loadingSchedule,
        createRecurringSchedule,
    } = useScheduleApi();

    const { sites: userSites, fetchMySites } = useSites();

    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [loadingDevicesAndSensors, setLoadingDevicesAndSensors] = useState(true);
    const [isDeviceInfoModalOpen, setIsDeviceInfoModalOpen] = useState(false);
    const [isDeviceSettingsModalOpen, setIsDeviceSettingsModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

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
                setLocationWithDevices([]);
            }
        };
        fetchAllDataForSite();
    }, [selectedSiteId, fetchLocationsBySiteIds]);

    // EFFECT 4: Fetch devices + sensors after locations load
    useEffect(() => {
        const fetchDevicesAndSensors = async () => {
            if (loadingLocations || !baseLocations.length) {
                setLoadingDevicesAndSensors(loadingLocations);
                if (!loadingLocations && !baseLocations.length) {
                    setLocationWithDevices([]);
                }
                return;
            }

            setLoadingDevicesAndSensors(true);

            const locationPromises = baseLocations.map(async (location) => {
                try {
                    const devices = await fetchDeviceFromLocation(location.location_id);

                    const deviceWithComponentsPromises = devices.map(async (device) => {
                        try {
                            const components = await fetchComponentsFromDevice(device.device_id);
                            return { ...device, components };
                        } catch (error) {
                            console.error(`Failed to fetch components for device ${device.device_id}:`, error);
                            return { ...device, components: [] };
                        }
                    });

                    const devicesWithComponents = await Promise.all(deviceWithComponentsPromises);
                    return { ...location, devices: devicesWithComponents };
                } catch (error) {
                    console.error(`Failed to fetch devices for location ${location.location_id}:`, error);
                    return { ...location, devices: [] };
                }
            });

            const newLocationsWithDevices = await Promise.all(locationPromises);
            setLocationWithDevices(newLocationsWithDevices);
            setLoadingDevicesAndSensors(false);
        };

        fetchDevicesAndSensors();
    }, [baseLocations, fetchDeviceFromLocation, fetchComponentsFromDevice, loadingLocations]);


    const handleSaveDeviceSettings = async (updatedComponent: Component, deviceID: string) => {
        try {
            await changeDeviceConfig(deviceID, updatedComponent)
            if (selectedDevice) {
                setLocationWithDevices((prevLocations) =>
                    prevLocations.map((loc) => ({
                        ...loc,
                        devices: loc.devices.map((dev) =>
                            dev.device_id === deviceID
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
        } catch (error) {
            console.error("Failed to save device settings:", error);
        }
    }

    const handleEditDeviceSettings = (device: Device) => {
        setSelectedDevice(device);
        setIsDeviceSettingsModalOpen(true);
    };

    const handleScheduleSettings = (device: Device) => {
        setSelectedDevice(device);
        setIsScheduleModalOpen(true);
    }

    const handleInfoDevice = (device: Device) => {
        setSelectedDevice(device);
        setIsDeviceInfoModalOpen(true);
    };

    const handleDeviceCommand = async (device: Device, command: string) => {
        try {
            await commandDevice(device.device_id, command);
            setLocationWithDevices((prevLocations) =>
                prevLocations.map((loc) => ({
                    ...loc,
                    devices: loc.devices.map((dev) =>
                        dev.device_id === device.device_id
                            ? {
                                ...dev, status: command === 'Start' ? 'Running' : command === 'Stop' ? 'Online'
                                    : dev.status
                            }
                            : dev
                    ),
                }))
            );
        } catch (error) {
            console.error("Error sending command to device:", error);
        }
    }

    const handleCommandComponent = (device: Device, command: string, componentInfo: Component) => {
        commandComponent(device.device_id, componentInfo.component_id, command);
        if (command === 'reset' && selectedDevice) {
            setSelectedDevice({
                ...selectedDevice,
                components: selectedDevice.components?.map((comp) =>
                    comp.component_id === componentInfo.component_id
                        ? { ...comp, current_running_hours: 0 }
                        : comp
                ),
            });
        }
    };

    const handleResetComponent = async (component: Component) => {
        try {
            await handleCommandComponent(selectedDevice as Device, 'reset', component);
        } catch (error) {
            console.error("Failed to reset component:", error);
        }
    }

    const handleSaveSchedule = async (schedules: Partial<RecurringSchedule>[], deviceID: string) => {
        try {
            for (const schedule of schedules) {
                await createRecurringSchedule(deviceID, schedule);
            }
        } catch (error) {
            console.error("Failed to save schedule:", error);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans antialiased">
            {/* Sites Section */}
            <div className="sites-section mb-12">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Vos Sites</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Sélectionnez un site pour gérer ses
                        emplacements et ses appareils.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userSites.map((site) => (
                        <button
                            key={site.site_id}
                            onClick={() => setSelectedSiteId(site.site_id)}
                            className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 ${selectedSiteId === site.site_id
                                ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-700"
                                : "bg-white text-gray-900 border-gray-200 hover:bg-green-50"
                            }`}
                        >
                            <h2
                                className={`text-xl font-bold mb-1 truncate ${selectedSiteId === site.site_id ? "text-white" : "text-gray-900"
                                }`}
                            >
                                {site.site_name}
                            </h2>
                            <p
                                className={`text-sm ${selectedSiteId === site.site_id ? "text-green-100" : "text-gray-500"
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
                    loadingLocations || loadingDeviceData || loadingDevicesAndSensors || loadingSchedule ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg">
                            <Loader2 className="animate-spin h-10 w-10 text-green-500 mb-4" />
                            <p className="text-gray-500 text-lg font-medium">Chargement des lieux, des appareils et des
                                capteurs...</p>
                        </div>
                    ) : (
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Emplacements du Site</h2>
                            {locationWithDevices.length > 0 ? (
                                <p className="text-lg text-gray-600">
                                    Affichage de {locationWithDevices.length}{" "}
                                    {locationWithDevices.length === 1 ? "emplacement" : "emplacements"} pour ce site.
                                </p>
                            ) : (
                                <p className="text-lg text-gray-600">Aucun emplacement trouvé pour ce site.</p>
                            )}

                            {locationWithDevices.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                    {locationWithDevices.map((location) => (
                                        <LocationCard
                                            key={location.location_id}
                                            location_name={location.location_name}
                                            devices={location.devices}
                                            description={location.location_description}
                                            onEditDeviceSettings={handleEditDeviceSettings}
                                            onViewDeviceDetails={handleInfoDevice}
                                            onDeviceCommandSend={handleDeviceCommand}
                                            onDeviceScheduleSettings={handleScheduleSettings}
                                        />
                                    ))}
                                </div>
                            )}
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
                <div
                    className="flex flex-col sm:flex-row h-b justify-between items-center mt-8 p-4 bg-white rounded-xl shadow-lg">
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
                    onResetComponent={handleResetComponent}
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
                        onReset={handleResetComponent}
                    />
                )
            }
            {selectedDevice && (
                <DeviceScheduleSettingModal
                    isOpen={isScheduleModalOpen}
                    device={selectedDevice}
                    onClose={() => {
                        setIsScheduleModalOpen(false);
                        setSelectedDevice(null);
                    }}
                    onSaveSchedule={handleSaveSchedule}
                />
            )}
        </div>
    );
};

export default Dashboard;