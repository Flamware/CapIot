import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface LocationListHeaderProps {
    onSearch: (term: string) => void;
    onAddLocation: (open: boolean) => void;
    searchTerm: string;

}

export const LocationListHeader: React.FC<LocationListHeaderProps> = ({ searchTerm, onSearch, onAddLocation  }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(e.target.value);
    };

    const handleSearchButtonClick = () => {
        onSearch(localSearchTerm);
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 border rounded px-2 py-1">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Rechercher des emplacements..."
                    value={localSearchTerm}
                    onChange={handleInputChange}
                    className="w-64 border-none outline-none text-sm"
                />
                <button
                    onClick={handleSearchButtonClick}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Rechercher
                </button>
            </div>
            <button
                onClick={() => { onAddLocation(true); }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
            >
                <MapPin className="w-4 h-4" />
                Ajouter un Emplacement
            </button>
        </div>
    );
};