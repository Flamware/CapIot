import React, {useState} from "react";
import {Plus, Search} from "lucide-react";

interface LocationListHeaderProps {
    onSearch: (term: string) => void;
    onAddLocation: () => void;
    onAddSite: () => void;
    searchTerm: string;
}

const LocationListHeader: React.FC<LocationListHeaderProps> = ({ searchTerm, onSearch, onAddSite }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
            <div className="relative w-full sm:w-auto">
                <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Rechercher des emplacements..."
                    value={localSearchTerm}
                    onChange={handleInputChange}
                    className="w-full sm:w-64 border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onAddSite}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter un Site
                </button>
            </div>
        </div>
    );
};

export default LocationListHeader;