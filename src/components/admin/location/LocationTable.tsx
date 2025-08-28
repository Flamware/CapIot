import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {Location} from "../../types/location.ts";

interface LocationTableProps {
    locations: Location[];
    onEdit: (location: Location) => void;
    onDelete: (id: number) => void;
}

const LocationTable: React.FC<LocationTableProps> = ({ locations, onEdit, onDelete }) => {
    return (
        <table className="min-w-full text-sm border rounded-md text-left">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Site</th>
                <th className="px-4 py-3 text-right">Actions</th>
            </tr>
            </thead>
            <tbody>
            {locations.length ? (
                locations.map((location) => (
                    <tr key={location.location_id} className="border-t">
                        <td className="px-4 py-2 font-medium">{location.location_id}</td>
                        <td className="px-4 py-2">{location.location_name}</td>
                        <td className="px-4 py-2">{location.location_description}</td>
                        <td className="px-4 py-2">{location.site_name}</td>
                        <td className="px-4 py-2 text-right relative">
                            <ActionDropdown location={location} onEdit={onEdit} onDelete={onDelete} />
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                        Aucun emplacement trouvé.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

interface ActionDropdownProps {
    location: Location;
    onEdit: (location: Location) => void;
    onDelete: (id: number) => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ location, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (isOpen && !(event.target as HTMLElement).closest('.relative')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Actions
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button">
                        <button
                            onClick={() => {
                                onEdit(location);
                                setIsOpen(false);
                            }}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                        >
                            <Pencil className="w-4 h-4 inline mr-2" /> Modifier
                        </button>
                        <button
                            onClick={() => {
                                onDelete(location.location_id);
                                setIsOpen(false);
                            }}
                            className="block w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-red-900"
                            role="menuitem"
                        >
                            <Trash2 className="w-4 h-4 inline mr-2" /> Supprimer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationTable;
