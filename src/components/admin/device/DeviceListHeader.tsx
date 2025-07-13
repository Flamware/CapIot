import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface DeviceListHeaderProps {
    searchTerm: string;
    onSearch: (term: string) => void;
}

export const DeviceListHeader: React.FC<DeviceListHeaderProps> = ({ searchTerm, onSearch }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(e.target.value);
    };

    const handleSearchButtonClick = () => {
        onSearch(localSearchTerm);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 border rounded px-2 py-1">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search devices..."
                    value={localSearchTerm}
                    onChange={handleInputChange}
                    className="w-64 border-none outline-none text-sm"
                />
                <button
                    onClick={handleSearchButtonClick}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Search
                </button>
            </div>

        </div>
    );
};