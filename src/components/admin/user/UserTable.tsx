import React, { useState } from 'react';
import { Trash2, Globe, Pencil, Check, X, Search } from 'lucide-react';
import { UserWithSites } from "../../types/user.ts";
import { Site } from "../../types/location.ts";

interface UserTableProps {
    users: UserWithSites[];
    allSites: Site[];
    onSave: (user: UserWithSites, updatedData: { name: string; siteIds: string[]; }) => Promise<void>;
}

export const UserTable: React.FC<UserTableProps> = ({
                                                        users,
                                                        allSites,
                                                        onSave,
                                                    }) => {
    // State to track which user is being edited
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');
    // This state is correctly typed as string[]
    const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);

    // New state for the site search term
    const [siteSearchTerm, setSiteSearchTerm] = useState('');

    const handleEditClick = (user: UserWithSites) => {
        setEditingUserId(user.id);
        setEditedName(user.name);
        // FIX: Provide an empty array as a fallback if user.sites is undefined or null
        setSelectedSiteIds(user.sites ? user.sites.map(site => String(site?.site_id)) : []);
        setSiteSearchTerm(''); // Reset the search term when a new user is selected
    };

    const handleSaveClick = (user: UserWithSites) => {
        onSave(user, { name: editedName, siteIds: selectedSiteIds });
        setEditingUserId(null);
    };

    const handleCancelClick = () => {
        setEditingUserId(null);
    };

    const handleSiteToggle = (siteId: number) => { // This parameter needs to be a number.
        // FIX 2: Check if the string array includes the string version of the ID
        setSelectedSiteIds(prevIds =>
            prevIds.includes(String(siteId))
                ? prevIds.filter(id => id !== String(siteId))
                : [...prevIds, String(siteId)]
        );
    };

    // Filter the sites based on the siteSearchTerm
    const filteredSites = allSites.filter(site =>
        site.site_name.toLowerCase().includes(siteSearchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-100 grid grid-cols-4 items-center px-6 py-3 font-semibold text-gray-700 text-sm border-b border-gray-200">
                <span>Nom de l'utilisateur</span>
                <span className="col-span-2">Sites assignés</span>
                <span className="text-right">Actions</span>
            </div>

            {users.length === 0 ? (
                <div className="p-6 text-center text-gray-500 bg-white">
                    <div className="flex justify-center mb-3">
                        <Trash2 className="text-4xl text-gray-300"/>
                    </div>
                    <p className="text-lg font-medium">Aucun utilisateur trouvé.</p>
                    <p className="text-sm">Commencez par ajouter de nouveaux utilisateurs.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <div key={user.id} className="grid grid-cols-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                            {/* User Name */}
                            <div className="font-medium text-gray-900 truncate" title={user.name}>
                                {editingUserId === user.id ? (
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm text-sm"
                                    />
                                ) : (
                                    user.name
                                )}
                            </div>

                            {/* Sites */}
                            <div className="flex flex-wrap gap-2 col-span-2">
                                {editingUserId === user.id ? (
                                    <div className="flex flex-col w-full gap-2">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Rechercher un site..."
                                                value={siteSearchTerm}
                                                onChange={(e) => setSiteSearchTerm(e.target.value)}
                                                className="w-full pl-8 rounded-md border-gray-300 shadow-sm text-sm"
                                            />
                                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        </div>
                                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 border rounded-md">
                                            {filteredSites.length > 0 ? (
                                                filteredSites.map(site => (
                                                    <label key={site.site_id} className="flex items-center space-x-1 text-xs">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedSiteIds.includes(String(site?.site_id))}
                                                            onChange={() => handleSiteToggle(site?.site_id)}
                                                        />
                                                        <span>{site.site_name}</span>
                                                    </label>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 italic">Aucun site trouvé.</span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    user.sites?.length > 0 ? (
                                        user.sites.map((site) => (
                                            <span key={site.site_id} className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 text-xs rounded-full font-medium">
                                                <Globe className="h-3 w-3 mr-1.5" />
                                                {site.site_name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-xs italic">Non assigné</span>
                                    )
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-2">
                                {editingUserId === user.id ? (
                                    <>
                                        {/* Save Button */}
                                        <button
                                            onClick={() => handleSaveClick(user)}
                                            className="p-2 rounded-full text-green-500 hover:bg-green-100 transition-colors"
                                            title="Enregistrer"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                        {/* Cancel Button */}
                                        <button
                                            onClick={handleCancelClick}
                                            className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                                            title="Annuler"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="p-2 rounded-full text-blue-500 hover:bg-blue-100 transition-colors"
                                            title="Modifier l'utilisateur"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        {/* Delete Button */}

                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
