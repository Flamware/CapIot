import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faQuestionCircle,
    faMicrochip,
    faPen,
    faMapMarkerAlt,
    faThermometerHalf,
    faTint,
    faFan,
    faLightbulb,
    faInfoCircle, // Import the new info icon
} from '@fortawesome/free-solid-svg-icons';
import { DeviceInfo } from './Props.tsx';
import { ComponentSubtype } from '../types/device.ts';

// Interface for the LocationCard component props.
interface LocationCardProps {
    location_name: string;
    devices: DeviceInfo[];
    lastUpdated: string;
    status: string;
    onEditDeviceSettings: (device: DeviceInfo) => void;
    onViewDeviceDetails: (device: DeviceInfo) => void; // New prop to handle the info modal
}

// Helper function to get the appropriate FontAwesome icon based on the component subtype.
const getComponentIcon = (subtype?: ComponentSubtype) => {
    switch (subtype) {
        case ComponentSubtype.Temperature:
            return faThermometerHalf;
        case ComponentSubtype.Humidity:
            return faTint;
        case ComponentSubtype.Fan:
            return faFan;
        case ComponentSubtype.LED:
            return faLightbulb;
        default:
            return faQuestionCircle;
    }
};

const LocationCard: React.FC<LocationCardProps> = ({
                                                       location_name,
                                                       devices,
                                                       lastUpdated,
                                                       status,
                                                       onEditDeviceSettings,
                                                       onViewDeviceDetails, // Make sure to destructure the new prop
                                                   }) => {
    // Helper function to determine the badge color based on the device or location status.
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
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'alert':
                return 'bg-orange-100 text-orange-800 border border-orange-200';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden">
            {/* Location Header Section */}
            <div className="bg-gradient-to-r from-green-200 to-green-100 p-5 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center min-w-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl mr-3 flex-shrink-0 text-green-700" />
                    <h3 className="font-extrabold text-2xl text-gray-800 truncate" title={location_name}>{location_name}</h3>
                </div>
                {status && (
                    <span className={`ml-3 text-xs font-semibold px-3 py-1 rounded-full capitalize flex-shrink-0 ${getStatusColorClass(status)}`}>
                        {status}
                    </span>
                )}
            </div>

            {/* Last Updated Info */}
            <div className="bg-green-50 text-green-800 text-sm px-5 py-2 flex justify-between items-center border-b border-green-100">
                <span>Dernière mise à jour :</span>
                <span className="font-medium">{lastUpdated}</span>
            </div>

            {/* Devices Section */}
            <div className="p-5 flex-grow overflow-y-auto custom-scrollbar">
                <h4 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">Appareils Connectés ({devices.length})</h4>
                {devices.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {devices.map((device) => {
                            const sensors = device.components?.filter(comp => comp.component_type === 'sensor') || [];
                            const otherComponents = device.components?.filter(comp => comp.component_type !== 'sensor') || [];
                            return (
                                <div key={device.device_id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
                                    {/* Device ID and Status */}
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                                        <div className="flex items-center flex-grow min-w-0">
                                            <FontAwesomeIcon icon={faMicrochip} className="mr-3 text-gray-500 text-lg flex-shrink-0" />
                                            <h5 className="font-semibold text-gray-800 text-md truncate flex-grow min-w-0" title={device.device_id}>
                                                {device.device_id}
                                            </h5>
                                            <span className={`ml-3 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize flex-shrink-0 ${getStatusColorClass(device.status)}`}>
                                                {device.status ?? 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 flex-shrink-0">
                                            {/* Info button for component details */}
                                            <button
                                                onClick={() => onViewDeviceDetails(device)}
                                                className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1 rounded-full hover:bg-blue-100"
                                                title="Voir les détails de l'appareil"
                                                aria-label="Voir les détails de l'appareil"
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} className="text-base" />
                                            </button>
                                            <button
                                                onClick={() => onEditDeviceSettings(device)}
                                                className="text-green-500 hover:text-green-700 transition-colors duration-200 p-1 rounded-full hover:bg-green-100"
                                                title="Modifier les paramètres de l'appareil"
                                                aria-label="Modifier les paramètres de l'appareil"
                                            >
                                                <FontAwesomeIcon icon={faPen} className="text-base" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sensors List */}
                                    {sensors.length > 0 && (
                                        <div className="mt-2">
                                            <h6 className="font-semibold text-gray-700 text-sm mb-2">Capteurs ({sensors.length}):</h6>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {sensors.map((component) => (
                                                    <div key={component.component_id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center flex-grow min-w-0">
                                                            <FontAwesomeIcon icon={getComponentIcon(component.component_subtype)} className="text-gray-500 text-sm mr-3 flex-shrink-0" />
                                                            <span className="text-gray-700 text-sm font-medium capitalize truncate flex-grow min-w-0">
                                                                {component.component_subtype ?? component.component_type}
                                                            </span>
                                                        </div>
                                                        <span className={`ml-3 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize flex-shrink-0 ${getStatusColorClass(component.component_status)}`}>
                                                            {component.component_status ?? 'N/A'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Other Components List */}
                                    {otherComponents.length > 0 && (
                                        <div className="mt-4">
                                            <h6 className="font-semibold text-gray-700 text-sm mb-2">Autres Composants ({otherComponents.length}):</h6>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {otherComponents.map((component) => (
                                                    <div key={component.component_id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center flex-grow min-w-0">
                                                            <FontAwesomeIcon icon={getComponentIcon(component.component_subtype)} className="text-gray-500 text-sm mr-3 flex-shrink-0" />
                                                            <span className="text-gray-700 text-sm font-medium capitalize truncate flex-grow min-w-0">
                                                                {component.component_subtype ?? component.component_type}
                                                            </span>
                                                        </div>
                                                        <span className={`ml-3 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize flex-shrink-0 ${getStatusColorClass(component.component_status)}`}>
                                                            {component.component_status ?? 'N/A'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Empty state for components */}
                                    {sensors.length === 0 && otherComponents.length === 0 && (
                                        <p className="text-sm text-gray-500 italic mt-2">Aucun composant configuré pour cet appareil.</p>
                                    )}
                                </div>
                            );
                        })}
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