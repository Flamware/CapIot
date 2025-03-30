import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

interface Location {
    id: string;
    name: string;
}

interface Device {
    id: string;
    name: string;
}

const Admin: React.FC = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [locations, setLocations] = useState<Location[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDevice, setSelectedDevice] = useState('');
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_INFLUXDB_API;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tokenApi1 = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: 'http://localhost:8081/',
                        scope: 'openid profile email offline_access read:influx',
                    },
                });
                const authHeader = {
                    headers: {
                        Authorization: `Bearer ${tokenApi1}`,
                    },
                };
                const locationsResponse = await axios.get(`${apiUrl}/locations`, authHeader);

                const transformedLocations: Location[] = locationsResponse.data.map((locationId: string) => ({
                    id: locationId,
                    name: locationId, // Use the ID as the name for now
                }));

                setLocations(transformedLocations);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchDevices = async () => {
            if (selectedLocation) {
                try {
                    const tokenApi1 = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: 'http://localhost:8081/',
                            scope: 'openid profile email offline_access read:influx',
                        },
                    });
                    const authHeader = {
                        headers: {
                            Authorization: `Bearer ${tokenApi1}`,
                        },
                    };
                    const devicesResponse = await axios.get(`${apiUrl}/devices/${selectedLocation}`, authHeader);
                    setDevices(
                        Array.isArray(devicesResponse.data)
                            ? devicesResponse.data.map((deviceId: string) => ({
                                id: deviceId,
                                name: deviceId, // Use the device ID as the name
                            }))
                            : []
                    );
                } catch (error) {
                    console.error('Error fetching devices:', error);
                    setDevices([]);
                }
            } else {
                setDevices([]);
            }
        };

        fetchDevices();
    }, [selectedLocation, getAccessTokenSilently, apiUrl]);

    const handleBindDevice = async () => {
        try {
            // Implement your binding logic here
            console.log(`Binding device ${selectedDevice} to location ${selectedLocation}`);
            alert('Device bound successfully!');
        } catch (error) {
            console.error('Error binding device:', error);
            alert('Failed to bind device.');
        }
    };

    if (!isAuthenticated) {
        return <p>Please log in to access the admin panel.</p>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="font-sans p-6">
            <h1 className="text-center text-3xl font-semibold mb-8">Admin Panel</h1>

            <div className="mb-6 p-6 border border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Bind Device to Location</h2>
                <div className="flex flex-col gap-4">
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md"
                    >
                        <option value="">Select Location</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedDevice}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md"
                        disabled={!selectedLocation}
                    >
                        <option value="">Select Device</option>
                        {devices.map((device) => (
                            <option key={device.id} value={device.id}>
                                {device.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleBindDevice}
                        disabled={!selectedLocation || !selectedDevice}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        Bind Device
                    </button>
                </div>
            </div>

            <div className="flex justify-between">
                <div className="flex-1 p-6 border border-gray-300 rounded-md mr-4">
                    <h2 className="text-xl font-semibold mb-4">Location List</h2>
                    <ul className="list-none p-0">
                        {locations.map((location) => (
                            <li key={location.id} className="p-3 border-b border-gray-200">
                                {location.name} (ID: {location.id})
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-1 p-6 border border-gray-300 rounded-md">
                    <h2 className="text-xl font-semibold mb-4">Device List</h2>
                    <ul className="list-none p-0">
                        {devices.map((device) => (
                            <li key={device.id} className="p-3 border-b border-gray-200">
                                {device.name} (ID: {device.id})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Admin;
