// src/components/admin/user/UserListHeader.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface UserListHeaderProps {
    searchTerm: string;
    onSearch: (term: string) => void;
}

export const UserListHeader: React.FC<UserListHeaderProps> = ({ searchTerm, onSearch}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
            <div className="relative w-full sm:w-auto">
                <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    placeholder="Rechercher des utilisateurs..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full sm:w-64 border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};