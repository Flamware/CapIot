import React, { useState, useEffect } from "react";
import {DevicesWithLocation} from "../../types/device";
import {useSites} from "../../hooks/useSite.tsx";
import {useLocations} from "../../hooks/useLocation.tsx";
import {Location} from "../../types/location.ts";

interface EditDeviceModalProps {
    device: DevicesWithLocation;
    onClose: () => void;
    onSave: (status: string, newLoc : Location | null) => void;
}

const getStatusOptions = ["online", "offline", "warning", "idle","Running"];

export const EditDeviceModal: React.FC<EditDeviceModalProps> = ({
                                                                    device,
                                                                    onClose,
                                                                    onSave,
                                                                }) => {
    const [status, setStatus] = useState(device.status || "");
    const [selectedSiteId, setSelectedSiteId] = useState<number | null>(device.location?.location_id || null);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(device.location?.location_id || null);

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
            setSelectedLocationId(null);
        }
    }, [selectedSiteId, locationSearch]);

    const handleSave = () => {
        const selectedLoc = locations.find(loc => loc.location_id === selectedLocationId) || null;

        const newLoc: Location | null = selectedLoc
            ? {
                ...selectedLoc,
                site_name: sites.find(site => site.site_id === selectedLoc.site_id)?.site_name || null,
            }
            : null;

        onSave(status, newLoc);
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Modifier l'appareil {device.device_id}</h2>

                {/* Status */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                        {getStatusOptions.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Site */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
                    <input
                        type="text"
                        placeholder="Rechercher site..."
                        value={siteSearch}
                        onChange={(e) => setSiteSearch(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-1"
                    />
                    <select
                        value={selectedSiteId || ""}
                        onChange={(e) => setSelectedSiteId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
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
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                        <input
                            type="text"
                            placeholder="Rechercher lieu..."
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-1"
                        />
                        <select
                            value={selectedLocationId || ""}
                            onChange={(e) => setSelectedLocationId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
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
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDeviceModal;
