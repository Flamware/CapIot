import React, { useState, useEffect } from 'react';
import {createApi} from '../axios/api';

type Location = {
    id: number;
    location_name: string;
    location_description: string;
};

type User = {
    id: string;
    name: string;
    role: string;
};

type Device = {
    device_id: string;
};

const Admin: React.FC = () => {
    const [locations, setLocations] = useState<Location[] | null>([]);
    const [users, setUsers] = useState<User[] | null>([]);
    const [devices, setDevices] = useState<Device[] | null>([]);
    const [newLocation, setNewLocation] = useState({ location_name: '', location_description: '' });
    const [selectedLocationForAssignment, setSelectedLocationForAssignment] = useState<number | null>(-1);
    const [selectedUserForAssignment, setSelectedUserForAssignment] = useState<string | null>('');
    const [selectedDeviceForAssignment, setSelectedDeviceForAssignment] = useState<string | null>('');
    const [selectedDeviceToDelete, setSelectedDeviceToDelete] = useState<string | null>('');
    const [loading, setLoading] = useState(false);
    const api = createApi();

    useEffect(() => {
        fetchAdminData();
        fetchLocations();
        fetchUsers();
        fetchDevices();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/test');
            console.log('Admin route response:', response.data);
        } catch (error: any) {
            console.error('Error accessing admin route:', error);
            if (error.response && error.response.status === 403) {
                console.error('Unauthorized access to /admin route.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await api.get('/locations');
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setLocations(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const response = await api.get('/devices');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
            setDevices(null);
        } finally {
            setLoading(false);
        }
    };

    const createLocation = async () => {
        const { location_name, location_description } = newLocation;
        setLoading(true);
        try {
            await api.post('/location/create', { location_name, location_description });
            setNewLocation({ location_name: '', location_description: '' });
            fetchLocations();
        } catch (error) {
            console.error('Error creating location:', error);
        } finally {
            setLoading(false);
        }
    };

    const assignUserToLocation = async () => {
        if (selectedUserForAssignment && selectedLocationForAssignment !== null && selectedLocationForAssignment !== -1) {
            setLoading(true);
            try {
                await api.post(`/assign-user/${selectedUserForAssignment}`, { locationID: selectedLocationForAssignment });
                fetchUsers();
            } catch (error) {
                console.error('Error assigning user:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log('Assignment conditions not met.');
        }
    };

    const assignDeviceToLocation = async () => {
        if (selectedDeviceForAssignment && selectedLocationForAssignment !== null && selectedLocationForAssignment !== -1) {
            setLoading(true);
            try {
                await api.post(`/assign-device/${selectedDeviceForAssignment}`, { locationID: selectedLocationForAssignment });
                fetchDevices();
            } catch (error) {
                console.error('Error assigning device:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const unassignDeviceFromLocation = async () => {
        if (selectedLocationForAssignment !== null && selectedLocationForAssignment !== -1 && selectedDeviceForAssignment) {
            setLoading(true);
            try {
                await api.post(`/unassign-device/${selectedDeviceForAssignment}`, { locationID: selectedLocationForAssignment });
                fetchDevices();
            } catch (error) {
                console.error('Error unassigning device:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log('Unassignment conditions not met.');
        }
    };

    const deleteDevice = async () => {
        if (selectedDeviceToDelete) {
            setLoading(true);
            try {
                await api.delete(`/devices/${selectedDeviceToDelete}`);
                fetchDevices();
                setSelectedDeviceToDelete('');
            } catch (error) {
                console.error('Error deleting device:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Location Management Panel */}
                <div className="bg-white shadow-md rounded-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Gestion des Localisations</h2>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-600">Créer une Localisation</h3>
                        <input
                            type="text"
                            placeholder="Nom"
                            value={newLocation.location_name}
                            onChange={(e) =>
                                setNewLocation({ ...newLocation, location_name: e.target.value })
                            }
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newLocation.location_description}
                            onChange={(e) =>
                                setNewLocation({ ...newLocation, location_description: e.target.value })
                            }
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 mb-2"
                        />
                        <button
                            onClick={createLocation}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Création...' : 'Créer'}
                        </button>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-600">Liste des Localisations</h3>
                        <ul className="list-disc list-inside text-gray-700">
                            {locations?.map((loc) => (
                                <li key={loc.id}>{loc.location_name}</li>
                            ))}
                            {!locations && <li className="text-gray-500">Aucune localisation</li>}
                        </ul>
                        <button
                            onClick={fetchLocations}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md py-2 px-4 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Chargement...' : 'Rafraîchir'}
                        </button>
                    </div>
                </div>

                {/* User Assignment Panel */}
                <div className="bg-white shadow-md rounded-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Assigner un Utilisateur</h2>
                    <div className="mb-4">
                        <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-1">Utilisateur:</label>
                        <select
                            id="user-select"
                            value={selectedUserForAssignment ?? ''}
                            onChange={(e) => setSelectedUserForAssignment(e.target.value)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                            disabled={loading || !users}
                        >
                            <option value="">Sélectionner un utilisateur</option>
                            {users?.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                            {!users && <option disabled>Chargement des utilisateurs...</option>}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location-select-user" className="block text-sm font-medium text-gray-700 mb-1">Localisation:</label>
                        <select
                            id="location-select-user"
                            value={selectedLocationForAssignment ?? -1}
                            onChange={(e) => setSelectedLocationForAssignment(Number(e.target.value))}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                            disabled={loading || !locations}
                        >
                            <option value={-1}>Sélectionner une localisation</option>
                            {locations?.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.location_name}
                                </option>
                            ))}
                            {!locations && <option disabled>Chargement des localisations...</option>}
                        </select>
                    </div>
                    <button
                        onClick={assignUserToLocation}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        disabled={loading || !selectedUserForAssignment || selectedLocationForAssignment === -1}
                    >
                        {loading ? 'Assignation...' : 'Assigner'}
                    </button>
                    <button
                        onClick={fetchUsers}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md py-2 px-4 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : 'Rafraîchir Utilisateurs'}
                    </button>
                </div>

                {/* Device Assignment Panel */}
                <div className="bg-white shadow-md rounded-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Gestion des Appareils</h2>
                    <div className="mb-4">
                        <label htmlFor="device-select-assign" className="block text-sm font-medium text-gray-700 mb-1">Appareil à assigner/désassigner:</label>
                        <select
                            id="device-select-assign"
                            value={selectedDeviceForAssignment ?? ''}
                            onChange={(e) => setSelectedDeviceForAssignment(e.target.value)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                            disabled={loading || !devices}
                        >
                            <option value="">Sélectionner un appareil</option>
                            {devices?.map((dev) => (
                                <option key={dev.device_id} value={dev.device_id}>
                                    {dev.device_id}
                                </option>
                            ))}
                            {!devices && <option disabled>Chargement des appareils...</option>}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location-select-device-assign" className="block text-sm font-medium text-gray-700 mb-1">Localisation:</label>
                        <select
                            id="location-select-device-assign"
                            value={selectedLocationForAssignment ?? -1}
                            onChange={(e) => setSelectedLocationForAssignment(Number(e.target.value))}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                            disabled={loading || !locations}
                        >
                            <option value={-1}>Sélectionner une localisation</option>
                            {locations?.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.location_name}
                                </option>
                            ))}
                            {!locations && <option disabled>Chargement des localisations...</option>}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={assignDeviceToLocation}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                            disabled={loading || !selectedDeviceForAssignment || selectedLocationForAssignment === -1}
                        >
                            {loading ? 'Assignation...' : 'Assigner'}
                        </button>
                        <button
                            onClick={unassignDeviceFromLocation}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                            disabled={loading || !selectedDeviceForAssignment || selectedLocationForAssignment === -1}
                        >
                            {loading ? 'Désassigner' : 'Désassigner'}
                        </button>
                    </div>
                    <button
                        onClick={fetchDevices}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md py-2 px-4 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : 'Rafraîchir Appareils'}
                    </button>
                </div>

                {/* Delete Device Panel */}
                <div className="bg-white shadow-md rounded-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Supprimer un Appareil</h2>
                    <div className="mb-4">
                        <label htmlFor="device-select-delete" className="block text-sm font-medium text-gray-700 mb-1">Appareil à supprimer:</label>
                        <select
                            id="device-select-delete"
                            value={selectedDeviceToDelete ?? ''}
                            onChange={(e) => setSelectedDeviceToDelete(e.target.value)}
                            className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                            disabled={loading || !devices}
                        >
                            <option value="">Sélectionner un appareil</option>
                            {devices?.map((dev) => (
                                <option key={dev.device_id} value={dev.device_id}>
                                    {dev.device_id}
                                </option>
                            ))}
                            {!devices && <option disabled>Chargement des appareils...</option>}
                        </select>
                    </div>
                    <button
                        onClick={deleteDevice}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        disabled={loading || !selectedDeviceToDelete}
                    >
                        {loading ? 'Suppression...' : 'Supprimer'}
                    </button>
                    <button
                        onClick={fetchDevices}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md py-2 px-4 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : 'Rafraîchir Appareils'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Admin;