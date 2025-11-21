import React, {useState} from "react";
import {Pencil, Trash2, Save, X} from "lucide-react";
import {Location} from "../../types/location.ts";

interface LocationTableProps {
    locations: Location[];
    onDelete: (id: number) => void;
    onSaveEdit: (location: Location) => void;
}

const LocationTable: React.FC<LocationTableProps> = ({ locations, onDelete, onSaveEdit }) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedLocation, setEditedLocation] = useState<Location | null>(null);

    const handleStartEdit = (location: Location) => {
        setEditingId(location.location_id);
        setEditedLocation({...location});
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedLocation(null);
    };

    const handleSaveEdit = () => {
        if (editedLocation) {
            onSaveEdit(editedLocation);
            setEditingId(null);
            setEditedLocation(null);
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedLocation(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet emplacement ? Cette action est irréversible.");
        if (confirmDelete) {
            onDelete(id);
        }
    };
    return (
        <div className="overflow-x-auto  rounded-lg shadow-md mb-8">
            <table className="min-w-full text-sm border-collapse table-auto">
                <thead className="bg-green-100">
                <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Nom</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {locations.length ? (
                    locations?.map((location) => (
                        <tr key={location.location_id}>
                            <td className="px-4 py-3 font-medium">{location.location_id}</td>
                            {editingId === location.location_id ? (
                                <>
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            name="location_name"
                                            value={editedLocation?.location_name || ''}
                                            onChange={handleEditChange}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            name="location_description"
                                            value={editedLocation?.location_description || ''}
                                            onChange={handleEditChange}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="text-green-600 hover:text-green-800"
                                            title="Sauvegarder"
                                        >
                                            <Save size={18} />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="text-gray-600 hover:text-gray-800"
                                            title="Annuler"
                                        >
                                            <X size={18} />
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="px-4 py-3">{location.location_name}</td>
                                    <td className="px-4 py-3">{location.location_description}</td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() => handleStartEdit(location)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Modifier"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(location.location_id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </>
                            )}
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
        </div>
    );
};

export default LocationTable;