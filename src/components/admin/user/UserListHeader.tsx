// src/components/admin/user/UserListHeader.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface UserListHeaderProps {
    searchTerm: string;
    onSearch: (term: string) => void;
}

export const UserListHeader: React.FC<UserListHeaderProps> = ({ searchTerm, onSearch}) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                    placeholder="Rechercher des utilisateurs..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-[250px] px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};