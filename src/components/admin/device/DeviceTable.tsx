import React, { useState } from "react";
import { DevicesWithLocation } from "../../types/device";
import EditDeviceModal from "./EditDeviceModal";
import {Location} from "../../types/location.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
// Suppression de l'importation de 'redirect' non utilisée et source d'erreur
// import {redirect} from "react-router-dom"; // Remplacé par une navigation manuelle

const getStatusColorClass = (deviceStatus?: string) => {
    switch (deviceStatus?.toLowerCase()) {
        case "running":
        case "online":
        case "ok":
            return "bg-green-100 text-green-800 border border-green-200";
        case "offline":
        case "fault":
        case "faulty":
            return "bg-red-100 text-red-800 border border-red-200";
        case "idle":
        case "unassigned":
            return "bg-blue-100 text-blue-800 border border-blue-200";
        case "warning":
            return "bg-yellow-100 text-yellow-800 border border-yellow-200";
        case "alert":
            return "bg-orange-100 text-orange-800 border border-orange-200";
        default:
            return "bg-gray-100 text-gray-700 border border-gray-200";
    }
};

// Icons
const PenIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;

interface DeviceTableProps {
    devices: DevicesWithLocation[];
    onUpdate: (deviceID: string, location: Location | null) => void;
    onDelete: (deviceID: string) => void;
    onDeviceCommandSend?: (device: DevicesWithLocation, command: string) => void;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({ devices, onUpdate, onDelete, onDeviceCommandSend }) => {
    const [editingDevice, setEditingDevice] = useState<DevicesWithLocation | null>(null);

    const handleSave = (newLoc : Location | null) => {
        if (editingDevice) {
            onUpdate(editingDevice.device_id, newLoc);
            setEditingDevice(null);
        }
    };

    const handleCancel = () => setEditingDevice(null);

    // Fonction de navigation manuelle pour les notifications
    const handleNotificationRedirect = (deviceId: string) => {
        const url = `/notifications/device/${deviceId}/`;
        // Utilisation de window.location.assign pour naviguer, cohérent avec NotificationButton.jsx
        window.location.assign(url);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-100 grid grid-cols-7 items-center px-6 py-3 font-semibold text-gray-700 text-sm border-b border-gray-200">
                <span>ID de l'appareil</span>
                <span>Statut</span>
                <span>Dernière vue</span>
                <span>Site</span>
                <span>Lieu</span>
                <span>Capteurs</span>
                <span className="text-right">Actions</span>
            </div>

            {/* Table Body */}
            {devices.length === 0 ? (
                <div className="p-6 text-center text-gray-500 bg-white">
                    <p className="text-lg font-medium">Aucun appareil trouvé.</p>
                    <p className="text-sm">Commencez par ajouter de nouveaux appareils.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {devices.map((device) => (
                        <div
                            key={device.device_id}
                            className="grid grid-cols-7 items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <span className="font-medium text-gray-900 truncate">{device.device_id}</span>
                            <div className="flex items-center space-x-2">
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColorClass(
                                        device.status
                                    )}`}
                                >
                                    {device.status}
                                </span>
                                {onDeviceCommandSend && (device.status === 'Online' || device.status === 'Running' || device.status === 'Idle') && (
                                    <button
                                        onClick={() => onDeviceCommandSend(device, device.status === 'Online' ? 'Start' : 'Stop')}
                                        className={`
                                            w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300
                                            shadow-md hover:shadow-lg transform hover:scale-105
                                            focus:outline-none focus:ring-2 focus:ring-opacity-50
                                            ${device.status === 'Online'
                                            ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-300'
                                            : 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-300'
                                        }
                                        `}
                                        title={device.status === 'Online' ? 'Démarrer l\'appareil' : 'Mettre l\'appareil en pause'}
                                        aria-label={device.status === 'Online' ? 'Démarrer l\'appareil' : 'Mettre l\'appareil en pause'}
                                    >
                                        <FontAwesomeIcon icon={device.status === 'Online' ? faPlay : faPause} className="text-xs" />
                                    </button>
                                )}
                            </div>
                            <span className="text-gray-600 text-sm">
                                {device.last_seen ? new Date(device.last_seen).toLocaleString() : "Jamais"}
                            </span>
                            <span className="text-gray-600 text-sm">
                                {device.location?.site_name ?? "Non assigné"}
                            </span>
                            <span className="text-gray-600 text-sm">
                                {device.location?.location_name ?? "Non assigné"}
                            </span>

                            <div className="flex flex-wrap gap-1">
                                {device.components && device.components.length > 0 ? (
                                    device.components.map((sensor) => (
                                        <span
                                            key={sensor.component_id}
                                            className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full font-medium"
                                        >
                                            {sensor.component_type}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-xs italic">Aucun</span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end items-center space-x-2">
                                <button onClick={() => setEditingDevice(device)} title="Modifier">
                                    <PenIcon />
                                </button>
                                <button onClick={() => onDelete(device.device_id)} title="Supprimer">
                                    <TrashIcon />
                                </button>
                                <button
                                    // Utilisation du gestionnaire de redirection corrigé
                                    onClick={() => handleNotificationRedirect(device.device_id)}
                                    title="Voir les notifications"
                                >
                                    📜
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingDevice && (
                <EditDeviceModal
                    device={editingDevice}
                    onClose={handleCancel}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};
