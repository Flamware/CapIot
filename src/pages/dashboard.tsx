// src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import {createApi} from "../axios/api";
import { LocationData, DeviceInfo } from "../components/location/Props";
import LocationsSection from "../components/location/LocationSection.tsx";

const Dashboard: React.FC = () => {
    const [locationsWithDevicesAndCaptors, setLocationsWithDevicesAndCaptors] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const api = createApi();
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            if (hasFetched) {
                return; // Prevent re-fetching
            }
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<Omit<LocationData, 'devices'>[]>('/users/me/locations'); // Fetch locations without devices initially
                const baseLocations = response.data;

                const locationsWithDeviceData: LocationData[] = [];
                for (const location of baseLocations) {
                    try {
                        const devicesResponse = await api.get<DeviceInfo[]>(`/location/${location.id}/devices`); // Fetch devices for each location
                        const devicesWithCaptors = await Promise.all(
                            devicesResponse.data.map(async (device) => {
                                try {
                                    const captorsResponse = await api.get(`/device/${device.device_id}/captors`);
                                    return { ...device, captors: captorsResponse.data };
                                } catch (captorError: any) {
                                    console.error(`Error fetching captors for device ID ${device.device_id}:`, captorError);
                                    return { ...device, captors: [] }; // Add empty captors array on error
                                }
                            })
                        );
                        locationsWithDeviceData.push({ ...location, devices: devicesWithCaptors });
                    } catch (deviceError: any) {
                        console.error(`Error fetching devices for location ID ${location.id}:`, deviceError);
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
        <div className="p-5 bg-gray-300 rounded-lg shadow-md max-w-7xl mx-auto">
                {loading ? (
                    <p>Chargement des lieux, des appareils et des capteurs...</p>
                ) : error ? (
                    <p>Erreur lors du chargement des données: {error.message}</p>
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