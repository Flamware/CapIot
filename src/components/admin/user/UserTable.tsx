// src/components/admin/user/UserTable.tsx
import React, {useState, useEffect} from 'react';
import {Trash2, Pencil, Save, X} from 'lucide-react';
import {createApi} from '../../../axios/api.tsx';
import {Pagination} from '../../types/pagination.ts';
import {PaginationControls} from '../PaginationControls.tsx';
import {UserWithLocations} from "../../types/user.ts";
import {Location} from "../../types/location.ts"; // Assuming you have this

interface UserTableProps {
    users: UserWithLocations[];
    onDelete: (id: string) => void;
    onUserUpdated: (id: string, name: string, locations: number[]) => void; // Callback for saving edits
}



export const UserTable: React.FC<UserTableProps> = ({users, onDelete, onUserUpdated}) => {
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedLocations, setEditedLocations] = useState<number[]>([]);
    const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [locationsError, setLocationsError] = useState<string | null>(null);
    const [locationPagination, setLocationPagination] = useState<Pagination>({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
    });
    const api = createApi();

    useEffect(() => {
        const fetchLocations = async () => {
            setLoadingLocations(true);
            setLocationsError(null);
            try {
                const response = await api.get<{
                    data: Location[];
                    totalPages: number;
                    totalItems: number;
                    currentPage: number;
                    pageSize: number
                }>(
                    `/admin/locations`, // Adjust endpoint for pagination if needed
                    {params: {page: locationPagination.currentPage, limit: locationPagination.pageSize}}
                );
                setAvailableLocations(response.data.data || []);
                setLocationPagination({
                    currentPage: response.data.currentPage,
                    pageSize: response.data.pageSize,
                    totalItems: response.data.totalItems,
                    totalPages: response.data.totalPages,
                });
            } catch (error: any) {
                console.error('Failed to fetch locations:', error);
                setLocationsError(error.response?.data?.message || error.message || 'Impossible de récupérer les emplacements.');
                setAvailableLocations([]);
            } finally {
                setLoadingLocations(false);
            }
        };

        if (editingUserId !== null) {
            fetchLocations();
        } else {
        }
    }, [editingUserId]);

    const startEdit = (user: UserWithLocations) => {
        setEditingUserId(user.id);
        setEditedName(user.name);
        setEditedLocations(user.locations?.map(loc => loc.location_id));
    };

    const cancelEdit = () => {
        setEditingUserId(null);
    };

    const handleSave = (id: string) => {
        onUserUpdated(id, editedName, editedLocations);
        setEditingUserId(null);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedName(e.target.value);
    };

    const handleLocationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setEditedLocations(selectedIds);
    };

    const goToLocationPage = (page: number) => {
        setLocationPagination(prev => ({...prev, currentPage: page}));
    };

    const renderLocationOptions = () => {
        if (loadingLocations) {
            return <option disabled>Chargement...</option>;
        }
        if (locationsError) {
            return <option disabled className="text-red-500">{locationsError}</option>;
        }
        return availableLocations.map(location => (
            <option key={location.location_id} value={location.location_id}>
                {location.location_name}
            </option>
        ));
    };

    return (
        <tbody className="bg-white divide-y divide-gray-200">
        {users.length > 0 ? (
            users.map((userWithLocation) => (
                <tr key={userWithLocation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingUserId === userWithLocation.id ? (
                            <input
                                type="text"
                                value={editedName}
                                onChange={handleNameChange}
                                className="px-2 py-1 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        ) : (
                            userWithLocation.name
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {userWithLocation.roles.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingUserId === userWithLocation.id ? (
                            <select
                                multiple
                                onChange={handleLocationSelect}
                                className="px-2 py-1 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                style={{minWidth: '150px', maxHeight: '80px'}}
                            >
                                {renderLocationOptions()}
                            </select>
                        ) : (
                            userWithLocation?.locations?.map((location) => (
                                <div key={location.location_id}>{location.location_name}</div>
                            ))
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {editingUserId === userWithLocation.id ? (
                            <div className="flex items-center justify-end space-x-2">
                                <button
                                    onClick={() => handleSave(userWithLocation.id)}
                                    className="p-2 rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <Save className="h-4 w-4"/>
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="p-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    <X className="h-4 w-4"/>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-end space-x-2">
                                <button
                                    onClick={() => startEdit(userWithLocation)}
                                    className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <Pencil className="h-4 w-4 text-gray-500"/>
                                </button>
                                <button
                                    onClick={() => onDelete(userWithLocation.id)}
                                    className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <Trash2 className="h-4 w-4 text-red-500"/>
                                </button>
                            </div>
                        )}
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    Aucun utilisateur trouvé.
                </td>
            </tr>
        )}
        {editingUserId !== null && (
            <tr>
                <td colSpan={4}>
                    <PaginationControls
                        pagination={locationPagination}
                        onGoToPage={goToLocationPage}
                        onGoToPreviousPage={() => goToLocationPage(locationPagination.currentPage - 1)}
                        onGoToNextPage={() => goToLocationPage(locationPagination.currentPage + 1)}
                    />
                </td>
            </tr>
        )}
        </tbody>
    );
};