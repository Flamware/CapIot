import React, { useState, useEffect } from "react";
import {DevicesWithLocation} from "../../types/device";
import {useSites} from "../../hooks/useSite.tsx";
import {useLocations} from "../../hooks/useLocation.tsx";
import {Location} from "../../types/location.ts";

interface EditDeviceModalProps {
    device: DevicesWithLocation;
    onClose: () => void;
    onSave: ( newLoc : Location | null) => void;
}


export const EditDeviceModal: React.FC<EditDeviceModalProps> = ({
                                                                    device,
                                                                    onClose,
                                                                    onSave,
                                                                }) => {
    const [selectedSiteId, setSelectedSiteId] = useState<number | null>(device.location?.location_id || null);
    const [selectedlocationID, setSelectedlocationID] = useState<number | null>(device.location?.location_id || null);

    const [siteSearch, setSiteSearch] = useState("");
    const [locationSearch, setLocationSearch] = useState("");
    const {
        sites: sites,
        fetchSites,
    } = useSites();

    const{
        locations: locations,
        fetchLocationsBySiteIds,
    }=useLocations();


    // Fetch all sites, allow search term to filter
    useEffect(() => {
        fetchSites(1, 10, siteSearch);

    }, [fetchSites, siteSearch, fetchLocationsBySiteIds, selectedSiteId]);

    // Update filtered locations whenever site or search changes
    useEffect(() => {
        if (selectedSiteId !== null) {
            if(selectedSiteId){
                fetchLocationsBySiteIds([selectedSiteId], 1, 10, locationSearch);
            }

        } else {
            setSelectedlocationID(null);
        }
    }, [selectedSiteId, locationSearch]);

    const handleSave = () => {
        const selectedLoc = locations.find(loc => loc.location_id === selectedlocationID) || null;

        const newLoc: Location | null = selectedLoc
            ? {
                ...selectedLoc,
                site_name: sites.find(site => site.site_id === selectedLoc.site_id)?.site_name || null,
            }
            : null;

        onSave(newLoc);
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white rounded-xl w-full max-w-lg p-8 shadow-2xl transform transition-all duration-300 scale-95">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier l'appareil {device.device_id}</h2>

                {/* Site */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Site</label>
                    <input
                        type="text"
                        placeholder="Rechercher un site..."
                        value={siteSearch}
                        onChange={(e) => setSiteSearch(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                    <select
                        value={selectedSiteId || ""}
                        onChange={(e) => setSelectedSiteId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full p-3 border border-gray-300 bg-green-50 text-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition hover:bg-green-100"
                    >
                        <option value="">Sélectionner un site</option>
                        {sites.map((site) => (
                                <option key={site.site_id} value={site.site_id}>
                                    {site.site_name}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Location */}
                {selectedSiteId && (
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Lieu</label>
                        <input
                            type="text"
                            placeholder="Rechercher un lieu..."
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        />
                        <select
                            value={selectedlocationID || ""}
                            onChange={(e) => setSelectedlocationID(e.target.value ? Number(e.target.value) : null)}
                            className="w-full p-3 border border-gray-300 bg-green-200 text-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition hover:bg-green-100"
                        >
                            <option value="">Non assigné</option>
                            {locations.map((loc) => (
                                <option key={loc.location_id} value={loc.location_id}>
                                    {loc.location_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDeviceModal;
