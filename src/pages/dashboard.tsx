import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import LocationsSection from "../components/location/LocationSection.tsx";
import { sensorInfo, DeviceInfo, LocationData } from "../components/location/Props.tsx";
import { createApi } from "../axios/api.tsx";
import DeviceSettingsModal from "../components/dashboard/DeviceSettingModal.tsx";

const Dashboard: React.FC = () => {
    const [locationsWithDevicesAndsensors, setLocationsWithDevicesAndsensors] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);

    const api = createApi();

    useEffect(() => {
        const fetchAllData = async () => {
            if (hasFetched) return;

            setLoading(true);
            setError(null);

            try {
                const response = await api.get<Omit<LocationData, "devices">[]>("/users/me/locations");
                const baseLocations = response.data ?? [];
                const locationsWithDeviceData: LocationData[] = [];

                for (const location of baseLocations) {
                    try {
                        const devicesResponse = await api.get<DeviceInfo[]>(`/location/${location.location_id}/devices`);
                        const devices = devicesResponse?.data ?? [];

                        const devicesWithsensors = await Promise.all(
                            devices.map(async (device) => {
                                try {
                                    const sensorsResponse = await api.get<sensorInfo[]>(`/devices/${device.device_id}/sensors`);
                                    return { ...device, sensors: sensorsResponse.data };
                                } catch {
                                    return { ...device, sensors: [] };
                                }
                            })
                        );

                        locationsWithDeviceData.push({ ...location, devices: devicesWithsensors });
                    } catch {
                        locationsWithDeviceData.push({ ...location, devices: [] });
                    }
                }

                setLocationsWithDevicesAndsensors(locationsWithDeviceData);
                setHasFetched(true);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [hasFetched]);

    const handleEditDeviceSettings = (device: DeviceInfo) => {
        setSelectedDevice(device);
        setIsSettingModalOpen(true);
    };

    const handleSavesensorsettings = async (updatedsensor: sensorInfo, deviceId: string) => {
        try {
            await api.put(`/admin/devices/${deviceId}/sensors/${updatedsensor.sensor_id}/range`, {
                sensor_id: updatedsensor.sensor_id,
                min_threshold: updatedsensor.min_threshold,
                max_threshold: updatedsensor.max_threshold,
            });

            // Update local state
            const updatedLocations = locationsWithDevicesAndsensors.map((location) => ({
                ...location,
                devices: location.devices.map((device) => {
                    if (device.device_id !== deviceId) return device;

                    const updatedsensors = device.sensors?.map((sensor) =>
                        sensor.sensor_id === updatedsensor.sensor_id ? updatedsensor : sensor
                    );

                    return { ...device, sensors: updatedsensors };
                }),
            }));

            setLocationsWithDevicesAndsensors(updatedLocations);
        } catch (err) {
            console.error("Failed to update sensor:", err);
            // Optional: show toast or error message
        }
    };

    return (
        <div className="p-5 bg-gray-100 rounded-lg shadow-md max-w-7xl mx-auto">
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin h-8 w-8 text-gray-500 mr-3" />
                    <p className="text-gray-500">Chargement des lieux, des appareils et des capteurs...</p>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Erreur: </strong>
                    <span className="block sm:inline">{error.message}</span>
                </div>
            ) : locationsWithDevicesAndsensors.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                    <p>Aucun lieu trouvé. Vous pouvez commencer par configurer un nouveau lieu.</p>
                    <button
                        onClick={() => console.log("Setup new location")}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        Configurer un nouveau lieu
                    </button>
                </div>
            ) : (
                <LocationsSection
                    locationsData={locationsWithDevicesAndsensors}
                    onViewDetails={(name) => console.log(`View details for ${name}`)}
                    onToggleNotifications={(name) => console.log(`Toggle notifications for ${name}`)}
                    onViewChart={(name) => console.log(`View chart for ${name}`)}
                    onSetupNewLocation={() => console.log("Setup new location")}
                    onEditDeviceSettings={handleEditDeviceSettings}
                />
            )}

            {selectedDevice && (
                <DeviceSettingsModal
                    isOpen={isSettingModalOpen}
                    device={selectedDevice}
                    onClose={() => {
                        setIsSettingModalOpen(false);
                        setSelectedDevice(null);
                    }}
                    onSave={handleSavesensorsettings}
                />
            )}
        </div>
    );
};

export default Dashboard;
