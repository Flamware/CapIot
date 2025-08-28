import React, { useState, useEffect } from 'react';
import { Trash2, Pencil, Save, X } from 'lucide-react';
import { PaginationControls } from '../PaginationControls.tsx';
import { UserWithLocations } from "../../types/user.ts";
import {useLocations} from "../../hooks/useLocation.tsx";

interface UserTableProps {
    users: UserWithLocations[];
    onDelete: (id: string) => void;
    onUserUpdated: (id: string, name: string, locations: number[]) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onDelete, onUserUpdated }) => {
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedLocations, setEditedLocations] = useState<number[]>([]);

    // Use the custom hook to manage locations data
    const {
        availableLocations,
        loadingAvailableLocations,
        availableLocationsError,
        availableLocationPagination,
        goToAvailableLocationPage,
        fetchAvailableLocations,
    } = useLocations();

    // Fetch locations when a user starts editing
    useEffect(() => {
        if (editingUserId) {
            // Fetch available locations whenever we enter edit mode
            fetchAvailableLocations(availableLocationPagination.currentPage, availableLocationPagination.pageSize);
        }
    }, [editingUserId, availableLocationPagination.currentPage, availableLocationPagination.pageSize, fetchAvailableLocations]);

    const startEdit = (user: UserWithLocations) => {
        setEditingUserId(user.id);
        setEditedName(user.name);
        setEditedLocations(user.locations?.map(loc => loc.location_id) || []);
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

    const renderLocationOptions = () => {
        if (loadingAvailableLocations) {
            return <option disabled>Chargement...</option>;
        }
        if (availableLocationsError) {
            return <option disabled className="text-red-500">{availableLocationsError}</option>;
        }
        return availableLocations.map(location => (
            <option key={location.location_id} value={location.location_id}>
                {location.location_name}
            </option>
        ));
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-100 grid grid-cols-4 items-center px-6 py-3 font-semibold text-gray-700 text-sm border-b border-gray-200">
                <span>Nom de l'utilisateur</span>
                <span>Rôles</span>
                <span>Lieux assignés</span>
                <span className="text-right">Actions</span>
            </div>

            {/* Table Body */}
            {users.length === 0 ? (
                <div className="p-6 text-center text-gray-500 bg-white">
                    <Trash2 className="inline-block text-4xl text-gray-300 mb-3" />
                    <p className="text-lg font-medium">Aucun utilisateur trouvé.</p>
                    <p className="text-sm">Commencez par ajouter de nouveaux utilisateurs.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {users.map((userWithLocation) => (
                        <div key={userWithLocation.id} className="grid grid-cols-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                            {/* User Name */}
                            <div className="font-medium text-gray-900 truncate" title={userWithLocation.name}>
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
                            </div>

                            {/* Roles */}
                            <div className="flex flex-wrap gap-1">
                                {userWithLocation.roles && userWithLocation.roles.length > 0 ? (
                                    userWithLocation.roles.map((role, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full font-medium">
                                            {role}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-xs italic">Aucun rôle</span>
                                )}
                            </div>

                            {/* Locations */}
                            <div className="flex flex-wrap gap-1">
                                {editingUserId === userWithLocation.id ? (
                                    <select
                                        multiple
                                        onChange={handleLocationSelect}
                                        value={editedLocations.map(String)}
                                        className="px-2 py-1 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        style={{ minWidth: '150px', maxHeight: '80px' }}
                                    >
                                        {renderLocationOptions()}
                                    </select>
                                ) : (
                                    userWithLocation?.locations?.length > 0 ? (
                                        userWithLocation.locations.map((location) => (
                                            <span key={location.location_id} className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full font-medium">
                                                {location.location_name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-xs italic">Non assigné</span>
                                    )
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-2">
                                {editingUserId === userWithLocation.id ? (
                                    <>
                                        <button
                                            onClick={() => handleSave(userWithLocation.id)}
                                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                                            title="Sauvegarder les modifications"
                                        >
                                            <Save className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="p-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
                                            title="Annuler l'édition"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEdit(userWithLocation)}
                                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                            title="Modifier l'utilisateur"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(userWithLocation.id)}
                                            className="p-2 rounded-full text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                                            title="Supprimer l'utilisateur"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Pagination Controls for Locations - only visible when editing */}
            {editingUserId !== null && availableLocationPagination.totalPages > 1 && (
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-center">
                    <PaginationControls
                        pagination={availableLocationPagination}
                        onGoToPage={goToAvailableLocationPage}
                        onGoToPreviousPage={() => goToAvailableLocationPage(availableLocationPagination.currentPage - 1)}
                        onGoToNextPage={() => goToAvailableLocationPage(availableLocationPagination.currentPage + 1)}
                    />
                </div>
            )}
        </div>
    );
};
