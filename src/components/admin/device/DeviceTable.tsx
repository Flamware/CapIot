import React, { useState } from 'react';
import {Location, Site} from "../../types/location.ts";
import {DevicesWithLocation} from "../../types/device.ts";
// Helper function to get a consistent status color class
const getStatusColorClass = (deviceStatus: string | undefined) => {
    switch (deviceStatus?.toLowerCase()) {
        case 'running':
        case 'online':
        case 'ok':
            return 'bg-green-100 text-green-800 border border-green-200';
        case 'offline':
        case 'fault':
        case 'faulty':
            return 'bg-red-100 text-red-800 border border-red-200';
        case 'idle':
        case 'unassigned':
            return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'warning':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        case 'alert':
            return 'bg-orange-100 text-orange-800 border border-orange-200';
        default:
            return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
};

// --- Updated DeviceTable component for inline editing ---
interface DeviceTableProps {
    devices: DevicesWithLocation[];
    locations: Location[]; // Now using the full Location type
    sites: Site[]; // New prop for sites
    onUpdate: (deviceId: string, newStatus: string, newLocationId: number | null) => void;
    onDelete: (id: string) => void;
}

// Inline SVG icons
const PenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-4 w-4 fill-current">
        <path d="M410.3 231l13.6-13.6c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L376.8 197.1 270.5 90.9l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L248.1 57.1 141.9 163.4 164.5 186l-106.2 106.2L.5 352.3c-2.4 2.4-3.5 5.7-3.2 8.9l3.2 38.6c.7 8.3 7.5 15.1 15.8 15.8l38.6 3.2c3.2 .3 6.5-.8 8.9-3.2l106.2-106.2L197.1 376.8l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L248.1 418.1l106.2 106.2 22.6-22.6-106.2-106.2 106.2-106.2L410.3 231zM346.5 401.5l13.6-13.6c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L312.6 367.6l-22.6 22.6 33.9 33.9 22.6-22.6zM461.7 151.8l-22.6 22.6-33.9-33.9 22.6-22.6c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-4 w-4 fill-current">
        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
    </svg>
);

const MicrochipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-10 w-10 fill-current">
        <path d="M64 480H512V320H64V480zm0-192h448V128H64v160zM48 0C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM240 448c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H240zM240 288c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H240zM240 128c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H240z" />
    </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-4 w-4 fill-current">
        <path d="M433.9 146.1L289.9 2.1C285.8 .8 281.3 0 276.7 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192c0-4.6-1.5-9.1-4.1-12.7zm-147.3-88.8L376 176H288V57.3zM400 464H48V48h192v144c0 13.3 10.7 24 24 24h144v232zm-32-64H80v-32h288v32zm0-96H80v-32h288v32zm0-96H80v-32h288v32z" />
    </svg>
);

const TimesCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-4 w-4 fill-current">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
    </svg>
);

export const DeviceTable: React.FC<DeviceTableProps> = ({ devices, locations, sites, onUpdate, onDelete }) => {
    // State to track which device is currently being edited
    const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
    // State to hold the temporary values for the device being edited
    const [editValues, setEditValues] = useState<{ status: string; location: number | null }>({ status: '', location: null });
    // State to track the currently selected site for location filtering
    const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);

    // Function to start editing a device
    const handleEditClick = (device: DevicesWithLocation) => {
        setEditingDeviceId(device.device_id);
        setEditValues({
            status: device.status,
            location: device.location?.location_id || null,
        });

        // Determine the current site of the device's location
        const currentSite = locations.find(loc => loc.location_id === device.location?.location_id);
        setSelectedSiteId(currentSite?.site_id || null);
    };

    // Function to save the changes
    const handleSaveClick = (deviceId: string) => {
        onUpdate(deviceId, editValues.status, editValues.location);
        setEditingDeviceId(null); // Exit editing mode
        setSelectedSiteId(null); // Reset site selection
    };

    // Function to cancel the edit
    const handleCancelClick = () => {
        setEditingDeviceId(null); // Exit editing mode without saving
        setSelectedSiteId(null); // Reset site selection
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-100 grid grid-cols-6 items-center px-6 py-3 font-semibold text-gray-700 text-sm border-b border-gray-200">
                <span>ID de l'appareil</span>
                <span>Statut</span>
                <span>Dernière vue</span>
                <span>Lieu</span>
                <span>Capteurs</span>
                <span className="text-right">Actions</span>
            </div>

            {/* Table Body */}
            {devices.length === 0 ? (
                <div className="p-6 text-center text-gray-500 bg-white">
                    <MicrochipIcon />
                    <p className="text-lg font-medium">Aucun appareil trouvé.</p>
                    <p className="text-sm">Commencez par ajouter de nouveaux appareils.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {devices.map((device) => (
                        <div key={device.device_id} className="grid grid-cols-6 items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                            {/* Device ID */}
                            <span className="font-medium text-gray-900 truncate" title={device.device_id}>{device.device_id}</span>

                            {/* Status */}
                            {editingDeviceId === device.device_id ? (
                                <select
                                    value={editValues.status}
                                    onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                                    className="p-1 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
                                >
                                    {['online', 'offline', 'warning', 'idle'].map(status => (
                                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                    ))}
                                </select>
                            ) : (
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColorClass(device.status)}`}>
                                    {device.status}
                                </span>
                            )}

                            {/* Last Seen */}
                            <span className="text-gray-600 text-sm">{new Date(device.last_seen).toLocaleString()}</span>

                            {/* Location */}
                            {editingDeviceId === device.device_id ? (
                                <div className="flex flex-col gap-2">
                                    {/* Site Selection */}
                                    <div>
                                        <label htmlFor="site-select" className="text-xs font-semibold text-gray-500 block mb-1">Site</label>
                                        <select
                                            id="site-select"
                                            value={selectedSiteId || ''}
                                            onChange={(e) => {
                                                const newSiteId = e.target.value === '' ? null : Number(e.target.value);
                                                setSelectedSiteId(newSiteId);
                                                // Reset location selection when site changes
                                                setEditValues(prev => ({ ...prev, location: null }));
                                            }}
                                            className="p-1 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
                                        >
                                            <option value="">Sélectionner un site</option>
                                            {sites?.map(site => (
                                                <option key={site.site_id} value={site.site_id}>{site.site_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Location Selection (only if a site is selected) */}
                                    {selectedSiteId !== null && (
                                        <div className="ml-4 border-l pl-4 border-gray-200">
                                            <label htmlFor="location-select" className="text-xs font-semibold text-gray-500 block mb-1">Lieu</label>
                                            <select
                                                id="location-select"
                                                value={editValues.location || ''}
                                                onChange={(e) => {
                                                    const newLocationId = e.target.value === '' ? null : Number(e.target.value);
                                                    setEditValues({ ...editValues, location: newLocationId });
                                                }}
                                                className="p-1 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
                                            >
                                                <option value="">Non assigné</option>
                                                {locations.filter(loc => loc.site_id === selectedSiteId).map(location => (
                                                    <option key={location.location_id} value={location.location_id}>{location.location_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span className="text-gray-600 text-sm truncate" title={device.location?.location_name}>
                                    {device.location ? device.location.location_name : 'Non assigné'}
                                </span>
                            )}

                            {/* Sensors */}
                            <div className="flex flex-wrap gap-1">
                                {device.components && device.components.length > 0 ? (
                                    device.components.map(sensor => (
                                        <span key={sensor.component_id} className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full font-medium">{sensor.component_type}</span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-xs italic">Aucun</span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end items-center space-x-2">
                                {editingDeviceId === device.device_id ? (
                                    <>
                                        <button
                                            onClick={() => handleSaveClick(device.device_id)}
                                            className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors duration-200"
                                            title="Enregistrer les modifications"
                                        >
                                            <SaveIcon />
                                        </button>
                                        <button
                                            onClick={handleCancelClick}
                                            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                            title="Annuler"
                                        >
                                            <TimesCircleIcon />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEditClick(device)}
                                            className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors duration-200"
                                            title="Modifier l'appareil"
                                        >
                                            <PenIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete(device.device_id)}
                                            className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
                                            title="Supprimer l'appareil"
                                        >
                                            <TrashIcon />
                                        </button>
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
export default DeviceTable;
