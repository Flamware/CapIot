import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faQuestionCircle,
    faMicrochip,
    faPen,
    faMapMarkerAlt // Added a new icon for location
} from '@fortawesome/free-solid-svg-icons';
import { DeviceInfo } from "./Props.tsx";

interface LocationCardProps {
    location_name: string;
    devices: DeviceInfo[];
    lastUpdated: string;
    status: string; // Keeping status prop for potential overall location status
    onViewDetails: () => void;
    onToggleNotifications: () => void;
    onViewChart: () => void;
    onEditDeviceSettings: (device: DeviceInfo) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
                                                       location_name,
                                                       devices,
                                                       lastUpdated,
                                                       status, // Destructure status as it's passed in
                                                       onEditDeviceSettings,
                                                   }) => {

    // Helper function to determine badge color based on status
    const getStatusColorClass = (deviceStatus: string | undefined) => {
        switch (deviceStatus?.toLowerCase()) { // Ensure case-insensitivity
            case 'running':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'online': // Added 'online' as a common positive status
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'offline':
                return 'bg-red-100 text-red-800 border border-red-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'alert': // Added 'alert' for critical warnings
                return 'bg-orange-100 text-orange-800 border border-orange-200';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200'; // Default for unknown/N/A
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden">
            {/* Location Header Section */}
            <div className="bg-gradient-to-r from-green-200 to-green-100 text-white p-5 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl mr-3" />
                    <h3 className="font-extrabold text-2xl truncate" title={location_name}>{location_name}</h3>
                </div>
                {/* Optional: Display overall location status badge if 'status' prop is used for it */}
                {status && (
                    <span
                        className={`ml-3 text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColorClass(status)}`}
                    >
                        {status}
                    </span>
                )}
            </div>

            {/* Last Updated Info */}
            <div className="bg-green-50 text-green-800 text-sm px-5 py-2 flex justify-between items-center border-b border-blue-100">
                <span>Dernière mise à jour :</span>
                <span className="font-medium">{lastUpdated}</span>
            </div>

            {/* Devices Section */}
            <div className="p-5 flex-grow overflow-y-auto custom-scrollbar"> {/* Added custom-scrollbar for aesthetics */}
                <h4 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">Appareils Connectés ({devices.length})</h4>
                {devices && devices.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {devices.map((device) => (
                            <div key={device.device_id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
                                {/* Device ID and Status */}
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faMicrochip} className="mr-3 text-gray-500 text-lg" />
                                        <h5 className="font-semibold text-gray-800 text-md truncate" title={device.device_id}>
                                            {device.device_id}
                                        </h5>
                                        <span
                                            className={`ml-3 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${getStatusColorClass(
                                                device.status
                                            )}`}
                                        >
                                            {device.status ?? 'N/A'}
                                        </span>
                                    </div>
                                    {/* Edit Device Settings Button */}
                                    <button
                                        onClick={() => onEditDeviceSettings(device)}
                                        className="text-green-500 hover:text-green-700 transition-colors duration-200 p-1 rounded-full hover:bg-green-100"
                                        title="Modifier les paramètres de l'appareil"
                                    >
                                        <FontAwesomeIcon icon={faPen} className="text-base" />
                                    </button>
                                </div>

                                {/* sensors List */}
                                {device.sensors && device.sensors.length > 0 ? (
                                    <div className="mt-2">
                                        <h6 className="font-semibold text-gray-700 text-sm mb-2">Capteurs ({device.sensors.length}):</h6>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {device.sensors.map((sensor) => (
                                                <div key={sensor.sensor_id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex items-center">
                                                    <span className="text-gray-600 text-sm font-medium">
                                                        {sensor.sensor_type}
                                                    </span>
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        ({sensor.sensor_id.substring(0, 8)}...) {/* Truncate ID for display */}
                                                    </span>
                                                    {/* You could add a small indicator for threshold status here if available */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic mt-2">Aucun capteur configuré pour cet appareil.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                        <FontAwesomeIcon icon={faQuestionCircle} className="text-3xl mb-3 text-gray-400" />
                        <p className="text-md font-medium">Aucun appareil enregistré pour ce lieu.</p>
                        <p className="text-sm">Veuillez ajouter des appareils pour commencer le suivi.</p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default LocationCard;