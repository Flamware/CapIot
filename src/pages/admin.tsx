import React, { useState } from 'react';
import createApi from '../../axios/api';

type Location = {
    id: string;
    location_name: string;
    location_description: string;
};

type User = {
    name: string;
};

type Device = {
    device_id: string;
};

const Admin: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [newLocation, setNewLocation] = useState({ location_name: '', location_description: '' });
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedDevice, setSelectedDevice] = useState('');
    const api = createApi();

    // Function to fetch locations
    const fetchLocations = async () => {
        try {
            const response = await api.get('/locations');
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    // Function to fetch users
    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Function to fetch devices
    const fetchDevices = async () => {
        try {
            const response = await api.get('/devices');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const createLocation = async () => {
        const { location_name, location_description } = newLocation;
        try {
            await api.post('/location/create', { location_name, location_description });
            setNewLocation({ location_name: '', location_description: '' }); // Reset fields
        } catch (error) {
            console.error('Error creating location:', error);
        }
    };

    const assignUserToLocation = async () => {
        if (selectedUser && selectedLocation) {
            await api.post('/assign-user', { userName: selectedUser, locationName: selectedLocation });
        }
    };

    const assignDeviceToLocation = async () => {
        if (selectedDevice && selectedLocation) {
            const location = locations.find(loc => loc.location_name === selectedLocation);
            if (location) {
                await api.post('/assign-device', { device_id: selectedDevice, location_id: location.id });
            }
        }
    };

    return (
        <div className="grid grid-cols-3 gap-4 p-6">
            {/* Localisation Panel */}
            <div className="p-6 border bg-mint-500 border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Créer une Localisation</h2>
                <input
                    type="text"
                    placeholder="Nom"
                    value={newLocation.location_name}
                    onChange={(e) =>
                        setNewLocation({ ...newLocation, location_name: e.target.value })
                    }
                    className="p-2 border rounded-md w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newLocation.location_description}
                    onChange={(e) =>
                        setNewLocation({ ...newLocation, location_description: e.target.value })
                    }
                    className="p-2 border rounded-md w-full mb-2"
                />
                <button
                    onClick={createLocation}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Créer
                </button>
                {/* Refresh Button */}
                <button
                    onClick={fetchLocations}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mt-2"
                >
                    Refresh Locations
                </button>
            </div>

            {/* Utilisateur Panel */}
            <div className="p-6 border bg-mint-500 border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Assigner un Utilisateur</h2>
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2"
                >
                    <option value="">Sélectionner un utilisateur</option>
                    {users.map((user) => (
                        <option key={user.name} value={user.name}>
                            {user.name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2"
                >
                    <option value="">Sélectionner une localisation</option>
                    {locations.map((loc) => (
                        <option key={loc.location_name} value={loc.location_name}>
                            {loc.location_name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={assignUserToLocation}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                    Assigner
                </button>
                {/* Refresh Button */}
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mt-2"
                >
                    Refresh Users
                </button>
            </div>

            {/* Device Panel */}
            <div className="p-6 border border-gray-300 bg-mint-500 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Assigner un Appareil</h2>
                <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2"
                >
                    <option value="">Sélectionner un appareil</option>
                    {devices.map((dev) => (
                        <option key={dev.device_id} value={dev.device_id}>
                            {dev.device_id}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2"
                >
                    <option value="">Sélectionner une localisation</option>
                    {locations.map((loc) => (
                        <option key={loc.location_name} value={loc.location_name}>
                            {loc.location_name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={assignDeviceToLocation}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                    Assigner
                </button>
                {/* Refresh Button */}
                <button
                    onClick={fetchDevices}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mt-2"
                >
                    Refresh Devices
                </button>
            </div>
        </div>
    );
};

export default Admin;