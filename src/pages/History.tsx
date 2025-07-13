import React, { useState, useEffect } from 'react';
import { createApi, createInfluxApi } from "../axios/api";
import { LocationData as LocationDataType, DeviceInfo as DeviceInfoType, sensorInfo } from "../components/location/Props";
import SelectionTree from '../components/history/SelectionTree.tsx';
import DateTimeInputs from '../components/commun/DateTimeInputs.tsx';
import MonitoringDataDisplay from "../components/monitoring/MonitoringDataDisplay.tsx";

interface Sensor {
    sensor_id: string;
    sensor_type: string;
    name?: string;
}

interface Device extends Omit<DeviceInfoType, 'sensors'> {
    sensors: Sensor[];
    name?: string;
}

interface Location extends Omit<LocationDataType, 'devices'> {
    devices: Device[];
}

const History: React.FC = () => {
    // State variables for selections
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [selectedSensorIds, setSelectedSensorIds] = useState<string[]>([]);
    const [selectedSensorTypes, setSelectedSensorTypes] = useState<string[]>([]); // State to hold the selected sensor types
    const [startTime, setStartTime] = useState<string>(''); // State for start time
    const [endTime, setEndTime] = useState<string>(''); // State for end time
    // State variables for data
    const [locations, setLocations] = useState<Location[]>([]);
    const [monitoringData, setMonitoringData] = useState<any>(null); // Placeholder for monitoring data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const api = createApi(); // Use createApi to get the backend API instance
    const [hasFetched, setHasFetched] = useState(false);
    const influxApi = createInfluxApi(); // Use createInfluxApi to get the InfluxDB API instance
    const [influxLoading, setInfluxLoading] = useState(false);
    const [influxError, setInfluxError] = useState<Error | null>(null);
    const [noInfluxData, setNoInfluxData] = useState(false);

    // State for tree expansion
    const [expandedLocationId, setExpandedLocationId] = useState<number | null>(null);
    const [expandedDeviceId, setExpandedDeviceId] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            if (hasFetched) {
                return; // Prevent re-fetching
            }
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<Omit<LocationDataType, 'devices'>[]>('/users/me/locations'); // Fetch locations without devices initially
                const baseLocations = response.data;

                if (!baseLocations || !Array.isArray(baseLocations)) { // Check if baseLocations is null or not an array
                    console.warn("No locations found for the user.");
                    setLocations([]);
                    setHasFetched(true);
                    setLoading(false);
                    return;
                }

                const locationsWithDeviceData: Location[] = await Promise.all(
                    baseLocations.map(async (location) => {
                        try {
                            const devicesResponse = await api.get<DeviceInfoType[]>(`/location/${location.location_id}/devices`); // Fetch devices for each location
                            const devicesData = devicesResponse.data;

                            if (!devicesData || !Array.isArray(devicesData)) { // Check if devicesData is null or not an array
                                console.warn(`No devices found for location ID ${location.location_id}.`);
                                return { ...location, devices: [] };
                            }

                            const devicesWithsensors: Device[] = await Promise.all(
                                devicesData.map(async (device) => {
                                    try {
                                        const sensorsResponse = await api.get<sensorInfo[]>(`/devices/${device.device_id}/sensors`);
                                        const sensorsData = sensorsResponse.data;
                                        const sensors: Sensor[] = sensorsData?.map(sensor => ({
                                            sensor_id: sensor.sensor_id,
                                            sensor_type: sensor.sensor_type,
                                            name: sensor.sensor_id || sensor.sensor_type,
                                        })) || [];
                                        return { ...device, sensors: sensors };
                                    } catch (sensorError: any) {
                                        console.error(`Error fetching sensors for device ID ${device.device_id}:`, sensorError);
                                        return { ...device, sensors: [] }; // Add empty sensors array on error
                                    }
                                })
                            );
                            return { ...location, devices: devicesWithsensors };
                        } catch (deviceError: any) {
                            console.error(`Error fetching devices for location ID ${location.location_id}:`, deviceError);
                            return { ...location, devices: [] };
                        }
                    })
                );
                setLocations(locationsWithDeviceData);
                setHasFetched(true);
            } catch (fetchError: any) {
                setError(fetchError);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [api, hasFetched]); // Added 'api' to the dependency array as it's used in the effect

    const handleLocationClick = (locationId: number) => {
        setExpandedLocationId(prev => prev === locationId ? null : locationId);
        setSelectedLocationId(prev => prev === locationId ? null : locationId);
        setSelectedDeviceId(null);
        setSelectedSensorIds([]);
        setSelectedSensorTypes([]);
        setStartTime('');
        setEndTime('');
    };

    const handleDeviceClick = (deviceId: string) => {
        setExpandedDeviceId(prev => prev === deviceId ? null : deviceId);
        setSelectedDeviceId(prev => prev === deviceId ? null : deviceId);
        setSelectedSensorIds([]);
        setSelectedSensorTypes([]);
        setStartTime('');
        setEndTime('');
    };

    const handleSensorChange = (sensorId: string, sensorType: string) => {
        setSelectedSensorIds(prev =>
            prev.includes(sensorId) ? prev.filter((id) => id !== sensorId) : [...prev, sensorId]
        );
        setSelectedSensorTypes(prev => {
            if (prev.includes(sensorType)) {
                return prev.filter((type) => type !== sensorType);
            } else {
                return [...prev, sensorType];
            }
        });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(event.target.value);
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(event.target.value);
    };

    const handleMonitor = async () => {
        if (!selectedLocationId || !selectedDeviceId || selectedSensorIds.length === 0) {
            alert('Veuillez sélectionner une localisation, un appareil et au moins un capteur.');
            return;
        }

        setInfluxLoading(true);
        setInfluxError(null);
        setMonitoringData(null);
        setNoInfluxData(false);

        try {
            const formattedStartTime = startTime ? new Date(startTime).toISOString() : undefined;
            const formattedEndTime = endTime ? new Date(endTime).toISOString() : undefined;

            const queryParams = {
                locationId: selectedLocationId,
                deviceId: selectedDeviceId,
                sensorType: selectedSensorTypes,
                measurement: "sensor_data",
                timeRangeStart: formattedStartTime,
                timeRangeStop: formattedEndTime,
                windowPeriod: "10s",
            };

            const influxResponse = await influxApi.get('/query', { params: queryParams });
            if (influxResponse.data && Object.keys(influxResponse.data).length > 0) {
                setMonitoringData(influxResponse.data);
                setNoInfluxData(false);
            } else {
                setMonitoringData(null);
                setNoInfluxData(true);
            }
        } catch (influxApiError: any) {
            setInfluxError(influxApiError);
            console.error("Error fetching data from InfluxDB:", influxApiError);
            setNoInfluxData(false); // Reset no data flag on error
        } finally {
            setInfluxLoading(false);
        }
    };

    const selectedLocation = locations.find(loc => loc.location_id === selectedLocationId);
    const selectedDevice = selectedLocation?.devices.find(dev => dev.device_id === selectedDeviceId);
    selectedDevice?.sensors.filter(sensor => selectedSensorIds.includes(sensor.sensor_id));
    if (loading) {
        return <div className="p-5 bg-gray-100 rounded-lg shadow-md">Chargement des lieux, des appareils et des capteurs...</div>;
    }

    if (error) {
        return <div className="p-5 bg-red-100 text-red-800 rounded-lg shadow-md">Erreur lors du chargement des données: {error.message}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Left Sidebar - Tree Structure */}
            <SelectionTree
                locations={locations}
                selectedLocationId={selectedLocationId}
                selectedDeviceId={selectedDeviceId}
                selectedSensorIds={selectedSensorIds}
                expandedLocationId={expandedLocationId}
                expandedDeviceId={expandedDeviceId}
                onLocationClick={handleLocationClick}
                onDeviceClick={handleDeviceClick}
                onSensorChange={handleSensorChange}
            />

            {/* Main Content - Monitoring Data */}
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-semibold mb-4">Historique de Monitoring</h1>

                <DateTimeInputs
                    startTime={startTime}
                    endTime={endTime}
                    onStartTimeChange={handleStartTimeChange}
                    onEndTimeChange={handleEndTimeChange}
                />

                {(selectedLocationId !== null && selectedDeviceId && selectedSensorIds.length > 0) && (
                    <button onClick={handleMonitor} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4" disabled={influxLoading}>
                        {influxLoading ? 'Chargement...' : 'Afficher les Données'}
                    </button>
                )}

                {influxError && (
                    <div className="bg-red-100 text-red-800 rounded-md p-4 mb-4">
                        Erreur lors de la récupération des données d'InfluxDB: {influxError.message}
                    </div>
                )}

                {monitoringData && Object.keys(monitoringData).length > 0 && (
                    <div className="bg-white rounded-md shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">Données de Monitoring</h2>
                        <MonitoringDataDisplay monitoringData={monitoringData} /> {/* Use the new component */}
                    </div>
                )}

                {noInfluxData && (
                    <div className="bg-yellow-100 text-yellow-800 rounded-md p-4 mb-4">
                        Aucune donnée de monitoring trouvée pour la sélection et la période spécifiées.
                    </div>
                )}

                {!monitoringData && !influxLoading && !influxError && !noInfluxData && (selectedLocationId !== null || selectedDeviceId || selectedSensorIds.length > 0) && (
                    <div className="bg-gray-50 rounded-md p-4 text-red-500">
                        Sélection effectuée. Veuillez choisir une date et une heure de début et de fin, puis cliquez sur "Afficher les Données".
                    </div>
                )}

                {!selectedLocationId && !loading && !error && (
                    <div className="bg-gray-50 rounded-md p-4 text-red-500">
                        Veuillez sélectionner une localisation dans l'arbre à gauche.
                    </div>
                )}
                {selectedLocationId !== null && !selectedDeviceId && !loading && !error && (
                    <div className="bg-gray-50 rounded-md p-4 text-red-500">
                        Veuillez sélectionner un appareil dans l'arbre à gauche.
                    </div>
                )}
                {selectedDeviceId && selectedSensorIds.length === 0 && !loading && !error && (
                    <div className="bg-gray-50 rounded-md p-4 text-red-500">
                        Veuillez sélectionner au moins un capteur dans l'arbre à gauche.
                    </div>
                )}
            </main>
        </div>
    );
};

export default History;
