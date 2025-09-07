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
    } = useDeviceApi();

    const { sites: userSites, fetchMySites } = useSites();

    const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
    const [loadingDevicesAndSensors, setLoadingDevicesAndSensors] = useState(false);
    const [isDeviceInfoModalOpen, setIsDeviceInfoModalOpen] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [locationWithDevices, setLocationWithDevices] = useState<LocationData[]>([]);

    // EFFECT 1: Fetch sites on initial mount
    useEffect(() => {
        fetchMySites();
    }, [fetchMySites]);

    // EFFECT 2: Fetch locations when site is selected
    useEffect(() => {
        const fetchAllDataForSite = async () => {
            await fetchLocationsBySiteIds(selectedSiteId ? [selectedSiteId] : []);
            setLocationWithDevices([]);
        };
        fetchAllDataForSite();
    }, [selectedSiteId ]);

    // EFFECT 3: Fetch devices + sensors after locations load
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
    // FIX: Define handlers for devices
    const handleEditDeviceSettings = (device: DeviceInfo) => {
        console.log("Edit device:", device);
        // open a modal or update state
    };

    const handleInfoDevice = (device: DeviceInfo) => {
        setSelectedDevice(device);
        setIsDeviceInfoModalOpen(true);
    };

    return (
        <div className="p-5 min-h-screen">
            <ApiErrorModal
                isOpen={!!(deviceApiError || locationError || saveError)}
                error={deviceApiError || locationError || saveError}
                onClose={handleCloseApiErrorModal}
            />

            {/* Sites Section */}
            <div className="sites-section mb-10">
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Vos Sites</h1>
                    <p className="text-gray-600">Sélectionnez un site pour gérer ses emplacements et ses appareils.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {userSites.map((site) => (
                        <button
                            key={site.site_id}
                            onClick={() => setSelectedSiteId(site.site_id)}
                            className={`p-4 rounded-lg shadow-md transition-colors duration-300 ${
                                selectedSiteId === site.site_id
                                    ? "bg-green-500 hover:bg-green-700 text-white"
                                    : "bg-gray-100 hover:bg-green-100 text-gray-900"
                            }`}
                        >
                            <h2
                                className={`text-lg font-semibold mb-1 ${
                                    selectedSiteId === site.site_id ? "text-gray-800 " : "text-gray-900"
                                }`}
                            >
                                {site.site_name}
                            </h2>
                            <p
                                className={`text-sm ${
                                    selectedSiteId === site.site_id ? "text-blue-100" : "text-gray-500"
                                }`}
                            >
                                Cliquez pour voir les emplacements
                            </p>
                        </button>
                    ))}
                </div>
            </div>


            {/* Locations Section */}
            <div className="locations-section mt-8">
                {selectedSiteId ? (
                    loadingLocations || loadingDeviceData || loadingDevicesAndSensors ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="animate-spin h-8 w-8 text-gray-500 mb-3" />
                            <p className="text-gray-500">Chargement des lieux, des appareils et des capteurs...</p>
                        </div>
                    ): (
                        <div className="mb-6">
                        <LocationsSection
                            locationsData={locationWithDevices}
                            onEditDeviceSettings={handleEditDeviceSettings}
                            onViewDeviceDetails={handleInfoDevice}
                        />
                            <PaginationControls
                                pagination={pagination}
                                onGoToPage={goToPage}
                                onGoToPreviousPage={() => goToPage(pagination.currentPage - 1)}
                                onGoToNextPage={() => goToPage(pagination.currentPage + 1)}
                            />

                            <p className="text-gray-500 text-sm mt-2">
                                Page {pagination.currentPage} sur {pagination.totalPages} - {pagination.totalItems}{" "}
                                {pagination.totalItems === 1 ? "élément" : "éléments"}
                            </p>
                        </div>
                    )
                ) : (
                    <div className="text-center py-10 text-gray-600 text-lg">
                        <p>Veuillez sélectionner un site ci-dessus pour afficher ses emplacements.</p>
                    </div>
                )}


            </div>

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
        </div>
    );
};

export default Dashboard;
