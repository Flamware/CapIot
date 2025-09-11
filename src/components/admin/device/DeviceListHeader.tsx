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
        onSearch(e.target.value);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
            <div className="relative w-full sm:w-64">
                <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search devices..."
                    value={localSearchTerm}
                    onChange={handleInputChange}
                    className="w-full border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};