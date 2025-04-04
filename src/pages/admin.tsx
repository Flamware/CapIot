import React, { useState, useEffect } from 'react';
import createApi from '../axios/api';

type Location = {
    id: string;
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
    const [locations, setLocations] = useState<Location[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [newLocation, setNewLocation] = useState({ location_name: '', location_description: '' });
    const [selectedLocationForAssignment, setSelectedLocationForAssignment] = useState('');
    const [selectedUserForAssignment, setSelectedUserForAssignment] = useState('');
    const [selectedDevice, setSelectedDevice] = useState('');
    const [selectedUserForRole, setSelectedUserForRole] = useState('');
    const [newUserRole, setNewUserRole] = useState('');
    const [loading, setLoading] = useState(false);
    const api = createApi();

    useEffect(() => {
        fetchAdminData(); // Call the new function to fetch admin-protected data
        fetchLocations();
        fetchUsers();
        fetchDevices();
    }, []);

    // New function to specifically call an admin-protected route
    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/test'); // Assuming '/admin' is your protected route
            console.log('Admin route response:', response.data);
            // You might want to do something with this response,
            // like setting a state variable to indicate admin access is confirmed.
        } catch (error: any) {
            console.error('Error accessing admin route:', error);
            // Handle unauthorized access or other errors
            if (error.response && error.response.status === 403) {
                console.error('Unauthorized access to /admin route.');
                // Optionally redirect or display an error
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch locations
    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await api.get('/locations');
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch devices
    const fetchDevices = async () => {
        setLoading(true);
        try {
            const response = await api.get('/devices');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
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
        if (selectedUserForAssignment && selectedLocationForAssignment) {
            setLoading(true);
            try {
                await api.post('/assign-user', { userName: selectedUserForAssignment, locationName: selectedLocationForAssignment });
                fetchUsers();
            } catch (error) {
                console.error('Error assigning user:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const assignDeviceToLocation = async () => {
        if (selectedDevice && selectedLocationForAssignment) {
            const location = locations.find(loc => loc.location_name === selectedLocationForAssignment);
            if (location) {
                setLoading(true);
                try {
                    await api.post('/assign-device', { device_id: selectedDevice, location_id: location.id });
                    fetchDevices();
                } catch (error) {
                    console.error('Error assigning device:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    const updateUserRole = async () => {
        if (selectedUserForRole && newUserRole) {
            setLoading(true);
            try {
                await api.post('/users/role', { userId: selectedUserForRole, role: newUserRole });
                fetchUsers(); // Refresh users to see updated role
                setNewUserRole(''); // Clear role input
                setSelectedUserForRole(''); // Clear selected user
            } catch (error) {
                console.error('Error updating user role:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {/* Location Management Panel */}
            <div className="p-6 border bg-mint-500 border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Gestion des Localisations</h2>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Créer une Localisation</h3>
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
                        disabled={loading}
                    >
                        {loading ? 'Création...' : 'Créer'}
                    </button>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Liste des Localisations</h3>
                    <ul className="list-disc list-inside">
                        {locations.map((loc) => (
                            <li key={loc.id}>{loc.location_name}</li>
                        ))}
                    </ul>
                    <button
                        onClick={fetchLocations}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md mt-2"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : 'Rafraîchir les Localisations'}
                    </button>
                </div>
            </div>

            {/* User Assignment Panel */}
            <div className="p-6 border bg-mint-500 border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Assigner un Utilisateur à une Localisation</h2>
                <select
                    value={selectedUserForAssignment}
                    onChange={(e) => setSelectedUserForAssignment(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2"
                    disabled={loading}
                >
                    <option value="">Sélectionner un utilisateur</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.name}>
                            {user.name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedLocationForAssignment}
                    onChange={(e) => setSelectedLocationForAssignment(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2"
                    disabled={loading}
                >
                    <option value="">Sélectionner une localisation</option>
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.location_name}>
                            {loc.location_name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={assignUserToLocation}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                    disabled={loading}
                >
                    {loading ? 'Chargement...' : 'Assigner'}
                </button>
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mt-2"
                    disabled={loading}
                >
                    {loading ? 'Chargement...' : 'Rafraîchir les Utilisateurs'}
                </button>
            </div>

            {/* Device Assignment Panel */}
            <div className="p-6 border bg-mint-500 border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Assigner un Appareil à une Localisation</h2>
                <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2"
                    disabled={loading}
                >
                    <option value="">Sélectionner un appareil</option>
                    {devices?.map((dev) => (
                        <option key={dev.device_id} value={dev.device_id}>
                            {dev.device_id}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedLocationForAssignment}
                    onChange={(e) => setSelectedLocationForAssignment(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2"
                    disabled={loading}
                >
                    <option value="">Sélectionner une localisation</option>
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.location_name}>
                            {loc.location_name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={assignDeviceToLocation}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    disabled={loading}
                >
                    {loading ? 'Chargement...' : 'Assigner'}
                </button>
                <button
                    onClick={fetchDevices}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mt-2"
                    disabled={loading}
                >
                    {loading ? 'Chargement...' : 'Rafraîchir les Appareils'}
                </button>
            </div>

            {/* User Role Management Panel */}
            <div className="p-6 border bg-mint-500 border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Gestion des Rôles Utilisateur</h2>
                <select
                    value={selectedUserForRole}
                    onChange={(e) => setSelectedUserForRole(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2"
                    disabled={loading}
                >
                    <option value="">Sélectionner un utilisateur</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name} (Rôle actuel: {user.role || 'Non défini'})
                        </option>
                    ))}
                </select>
                <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2"
                    disabled={loading}
                >
                    <option value="">Sélectionner un rôle</option>
                    <option value="administrateur">Administrateur</option>
                    <option value="gestionnaire de site">Gestionnaire de site</option>
                    <option value="installateur">Installateur</option>
                </select>
                <button
                    onClick={updateUserRole}
                    className="px-4 py-2 bg-purple-500 text-white rounded-md"
                    disabled={loading || !selectedUserForRole || !newUserRole}
                >
                    {loading ? 'Mise à jour...' : 'Mettre à jour le Rôle'}
                </button>
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mt-2"
                    disabled={loading}
                >
                    {loading ? 'Chargement...' : 'Rafraîchir les Utilisateurs'}
                </button>
            </div>
        </div>
    );
};

export default Admin;