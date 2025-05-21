import React, {useEffect, useState} from "react";
import {Loader2} from "lucide-react";
import LocationsSection from "../components/location/LocationSection.tsx";
import {CaptorInfo, DeviceInfo, LocationData} from "../components/location/Props.tsx";
import {createApi} from "../axios/api.tsx";

const Dashboard: React.FC = () => {
    const [locationsWithDevicesAndCaptors, setLocationsWithDevicesAndCaptors] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [hasFetched, setHasFetched] = useState(false);
    const api = createApi();

    useEffect(() => {
        const fetchAllData = async () => {
            if (hasFetched) {
                return; // Prevent re-fetching
            }
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<Omit<LocationData, 'devices'>[]>('/users/me/locations'); // Fetch locations without devices initially
                const baseLocations = response.data ?? [];

                const locationsWithDeviceData: LocationData[] = [];
                for (const location of baseLocations) {
                    try {
                        const devicesResponse = await api.get<DeviceInfo[]>(`/location/${location.location_id}/devices`); // Fetch devices for each location
                        const devices = devicesResponse?.data ?? [];  // changed this line
                        if (devices && devices.length > 0) {
                            const devicesWithCaptors = await Promise.all(
                                devices.map(async (device) => {
                                    try {
                                        const captorsResponse = await api.get<CaptorInfo[]>(`/device/${device.device_id}/captors`);
                                        return { ...device, captors: captorsResponse.data };
                                    } catch (captorError: any) {
                                        console.error(`Error fetching captors for device ID ${device.device_id}:`, captorError);
                                        return { ...device, captors: [] }; // Add empty captors array on error
                                    }
                                })
                            );
                            locationsWithDeviceData.push({ ...location, devices: devicesWithCaptors });
                        }
                        else {
                            locationsWithDeviceData.push({ ...location, devices: [] });
                        }
                    } catch (deviceError: any) {
                        console.error(`Error fetching devices for location ID ${location.location_id}:`, deviceError);
                        locationsWithDeviceData.push({ ...location, devices: [] });
                    }
                }
                setLocationsWithDevicesAndCaptors(locationsWithDeviceData);
                setHasFetched(true);
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []); // Empty dependency array means this runs only once on mount

    const handleViewDetails = (locationName: string) => {
        console.log(`View details for ${locationName}`);
        // Implement your logic
    };

    const handleToggleNotifications = (locationName: string) => {
        console.log(`Toggle notifications for ${locationName}`);
        // Implement your logic
    };

    const handleViewChart = (locationName: string) => {
        console.log(`View chart for ${locationName}`);
        // Implement your logic
    };

    const handleSetupNewLocation = () => {
        console.log("Setup new location");
        // Implement your logic to navigate to a setup page or open a modal.
    };

    return (
        <div className="p-5 bg-gray-100 rounded-lg shadow-md max-w-7xl mx-auto">
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin h-8 w-8 text-gray-500 mr-3" />
                    <p className="text-gray-500">Chargement des lieux, des appareils et des capteurs...</p>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erreur: </strong>
                    <span className="block sm:inline">{error.message}</span>
                </div>
            ) : locationsWithDevicesAndCaptors.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                    <p>Aucun lieu trouvé. Vous pouvez commencer par configurer un nouveau lieu.</p>
                    <button
                        onClick={handleSetupNewLocation}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Configurer un nouveau lieu
                    </button>
                </div>
            ) : (
                <LocationsSection
                    locationsData={locationsWithDevicesAndCaptors}
                    onViewDetails={handleViewDetails}
                    onToggleNotifications={handleToggleNotifications}
                    onViewChart={handleViewChart}
                    onSetupNewLocation={handleSetupNewLocation}
                />
            )}

        </div>
    );
};

export default Dashboard;
