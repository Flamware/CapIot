import React, { useState, useEffect } from 'react';
import { createApi, createInfluxApi } from "../axios/api";
import { LocationData as LocationDataType, DeviceInfo as DeviceInfoType, CaptorInfo } from "../components/location/Props";
import SelectionTree from '../components/history/SelectionTree.tsx';
import DateTimeInputs from '../components/commun/DateTimeInputs.tsx';
import MonitoringDataDisplay from "../components/monitoring/MonitoringDataDisplay.tsx";

interface Sensor {
    sensor_id: string;
    sensor_type: string;
    name?: string;
}

interface Device extends Omit<DeviceInfoType, 'captors'> {
    captors: Sensor[];
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

                const locationsWithDeviceData: Location[] = await Promise.all(
                    baseLocations.map(async (location) => {
                        try {
                            const devicesResponse = await api.get<DeviceInfoType[]>(`/location/${location.id}/devices`); // Fetch devices for each location
                            const devicesWithCaptors: Device[] = await Promise.all(
                                devicesResponse.data.map(async (device) => {
                                    try {
                                        const captorsResponse = await api.get<CaptorInfo[]>(`/device/${device.device_id}/captors`);
                                        const sensors: Sensor[] = captorsResponse.data.map(captor => ({
                                            sensor_id: captor.captor_id,
                                            sensor_type: captor.captor_type,
                                            name: captor.captor_id || captor.captor_type,
                                        }));
                                        return { ...device, captors: sensors };
                                    } catch (captorError: any) {
                                        console.error(`Error fetching captors for device ID ${device.device_id}:`, captorError);
                                        return { ...device, captors: [] }; // Add empty captors array on error
                                    }
                                })
                            );
                            return { ...location, devices: devicesWithCaptors };
                        } catch (deviceError: any) {
                            console.error(`Error fetching devices for location ID ${location.id}:`, deviceError);
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
    }, [api, hasFetched]);

    const handleLocationClick = (locationId: number) => {
        if (expandedLocationId === locationId) {
            setExpandedLocationId(null);
            setSelectedLocationId(null);
            setSelectedDeviceId(null);
            setSelectedSensorIds([]);
            setSelectedSensorTypes([]);
            setStartTime('');
            setEndTime('');
        } else {
            setExpandedLocationId(locationId);
            setSelectedLocationId(locationId);
            setSelectedDeviceId(null);
            setSelectedSensorIds([]);
            setSelectedSensorTypes([]);
            setStartTime('');
            setEndTime('');
        }
    };

    const handleDeviceClick = (deviceId: string) => {
        if (expandedDeviceId === deviceId) {
            setExpandedDeviceId(null);
            setSelectedDeviceId(null);
            setSelectedSensorIds([]);
            setSelectedSensorTypes([]);
            setStartTime('');
            setEndTime('');
        } else {
            setExpandedDeviceId(deviceId);
            setSelectedDeviceId(deviceId);
            setSelectedSensorIds([]);
            setSelectedSensorTypes([]);
            setStartTime('');
            setEndTime('');
        }
    };

    const handleSensorChange = (sensorId: string, sensorType: string) => {
        if (selectedSensorIds.includes(sensorId)) {
            setSelectedSensorIds(selectedSensorIds.filter((id) => id !== sensorId));
            setSelectedSensorTypes(selectedSensorTypes.filter((type) => type !== sensorType));
        } else {
            setSelectedSensorIds([...selectedSensorIds, sensorId]);
            if (!selectedSensorTypes.includes(sensorType)) {
                setSelectedSensorTypes([...selectedSensorTypes, sensorType]);
            }
        }
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(event.target.value);
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(event.target.value);
    };

    const handleMonitor = async () => {
        if (!selectedLocationId || !selectedDeviceId || selectedSensorIds.length === 0) {
            alert('Veuillez sélectionner une localisation, un device et au moins un capteur.');
            return;
        }

        setInfluxLoading(true);
        setInfluxError(null);
        setMonitoringData(null);

        try {
            let formattedStartTime: string | undefined = undefined;
            if (startTime) {
                formattedStartTime = new Date(startTime).toISOString();
            }

            let formattedEndTime: string | undefined = undefined;
            if (endTime) {
                formattedEndTime = new Date(endTime).toISOString();
            }

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
            setMonitoringData(influxResponse.data);
        } catch (influxApiError: any) {
            setInfluxError(influxApiError);
            console.error("Error fetching data from InfluxDB:", influxApiError);
        } finally {
            setInfluxLoading(false);
        }
    };

    const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
    const selectedDevice = selectedLocation?.devices.find(dev => dev.device_id === selectedDeviceId);
    selectedDevice?.captors.filter(sensor => selectedSensorIds.includes(sensor.sensor_id));
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
                    <button onClick={handleMonitor} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" disabled={influxLoading}>
                        {influxLoading ? 'Chargement...' : 'Afficher les Données'}
                    </button>
                )}

                {influxError && (
                    <div className="bg-red-100 text-red-800 rounded-md p-4 mb-4">
                        Erreur lors de la récupération des données d'InfluxDB: {influxError.message}
                    </div>
                )}

                {monitoringData && (
                    <div className="bg-white rounded-md shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">Données de Monitoring</h2>
                        <MonitoringDataDisplay monitoringData={monitoringData} /> {/* Use the new component */}
                    </div>
                )}

                {!monitoringData && !influxLoading && !influxError && (selectedLocationId !== null || selectedDeviceId || selectedSensorIds.length > 0) && (
                    <div className="bg-gray-50 rounded-md p-4">
                        Sélection effectuée. Veuillez choisir une date et une heure de début et de fin, puis cliquez sur "Afficher les Données".
                    </div>
                )}

                {!selectedLocationId && !loading && !error && (
                    <div className="bg-gray-50 rounded-md p-4">
                        Veuillez sélectionner une localisation dans l'arbre à gauche.
                    </div>
                )}
                {selectedLocationId !== null && !selectedDeviceId && !loading && !error && (
                    <div className="bg-gray-50 rounded-md p-4">
                        Veuillez sélectionner un device dans l'arbre à gauche.
                    </div>
                )}
                {selectedDeviceId && selectedSensorIds.length === 0 && !loading && !error && (
                    <div className="bg-gray-50 rounded-md p-4">
                        Veuillez sélectionner au moins un capteur dans l'arbre à gauche.
                    </div>
                )}
            </main>
        </div>
    );
};

export default History;