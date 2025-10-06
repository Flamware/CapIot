import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faQuestionCircle,
    faMicrochip,
    faPen,
    faMapMarkerAlt,
    faThermometerHalf,
    faTint,
    faFan,
    faLightbulb,
    faInfoCircle,
    faPlay,
    faPause,
    faCalendarAlt,
    faBolt,
    faChartLine,
    faBell,
} from '@fortawesome/free-solid-svg-icons';
import {ComponentSubtype, ComponentType, Device} from "../types/device.ts";
import React from "react";
import {useIsMobile} from "../hooks/useIsMobile.tsx";

// Helper function to get the appropriate FontAwesome icon based on the component subtype.
const getComponentIcon = (subtype: string) => {
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

const getStatusColorClass = (deviceStatus: string) => {
    switch (deviceStatus?.toLowerCase()) {
        case 'running':
        case 'online':
        case 'ok':
            return 'bg-green-100 text-green-800 border border-green-200';
        case 'running_plan':
            return 'bg-teal-100 text-teal-800 border border-teal-200';
        case 'offline':
        case 'fault':
        case 'faulty':
            return 'bg-red-100 text-red-800 border border-red-200';
        case 'idle':
        case 'stopped_plan':
            return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'warning':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        case 'alert':
            return 'bg-orange-100 text-orange-800 border border-orange-200';
        default:
            return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
};

type LocationCardProps = {
    location_name: string;
    devices: Device[];
    description?: string;
    onEditDeviceSettings: (device: Device) => void;
    onViewDeviceDetails: (device: Device) => void;
    onDeviceCommandSend?: (device: Device, command: 'Start' | 'Stop' | 'Follow_Schedule') => void;
    onDeviceScheduleSettings?: (device: Device) => void;
};

const LocationCard: React.FC<LocationCardProps> = ({
                                                       location_name,
                                                       devices,
                                                       description,
                                                       onEditDeviceSettings,
                                                       onViewDeviceDetails,
                                                       onDeviceCommandSend,
                                                       onDeviceScheduleSettings,
                                                   }) => {

    const isMobile = useIsMobile(1600);

    function onViewDeviceNotifications(device_id: string) {
        window.location.href = `/notifications/device/${device_id}`;
    }

    return (
        <div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden">
            {/* Location Header Section */}
            <div
                className="bg-gradient-to-r from-green-200 to-green-100 p-5 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center min-w-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl mr-3 flex-shrink-0 text-green-700"/>
                    <h3 className="font-extrabold text-2xl text-gray-800 truncate"
                        title={location_name}>{location_name}</h3>
                </div>
            </div>

            {/* Last Updated Info */}
            <div
                className="bg-green-50 text-green-800 text-sm px-5 py-2 flex justify-between items-center border-b border-green-100">
                <span>Description: {description ? description : <em className="text-gray-500">Aucune description</em>}</span>
            </div>

            {/* Devices Section */}
            <div className="p-5 flex-grow overflow-y-auto custom-scrollbar">
                <h4 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">Appareils Associé(s)
                    ({devices.length})</h4>
                {devices.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {devices.map((device) => {
                            const sensors = device.components?.filter(comp => comp.component_type === ComponentType.Sensor) || [];
                            const otherComponents = device.components?.filter(comp => comp.component_type !== ComponentType.Sensor) || [];

                            return (
                                <div key={device.device_id}
                                     className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
                                    {/* Device ID and Status */}
                                    <h5 className="font-semibold text-gray-800 text-md truncate flex-grow min-w-0"
                                        title={device.device_id}>
                                        {device.device_id}
                                    </h5>
                                    <div
                                        className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} mb-3 pb-2 border-b border-gray-200`}>
                                        <div className="flex items-center flex-grow min-w-0">
                                            <FontAwesomeIcon icon={faMicrochip} className="mr-3 text-gray-500 text-lg flex-shrink-0"/>
                                            <span
                                                className={`ml-3 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize flex-shrink-0 ${getStatusColorClass(device?.status ?? '')}`}
                                                title={`Statut: ${device.status ?? 'N/A'}`}>
                                                {device.status ?? 'N/A'}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div
                                            className={`flex ${isMobile ? 'justify-start flex-wrap gap-2 pt-2' : 'space-x-2'} flex-shrink-0`}>
                                            {onDeviceCommandSend && (device.status?.toLowerCase() === 'online' || device.status?.toLowerCase() === 'running_plan' || device.status?.toLowerCase() === 'running' || device.status?.toLowerCase() === 'stopped_plan') && (
                                                <button
                                                    onClick={() => onDeviceCommandSend(device, (device.status?.toLowerCase() === 'online' || device.status?.toLowerCase() === 'stopped_plan') ? 'Start' : 'Stop')}
                                                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${(device.status?.toLowerCase() === 'online' || device.status?.toLowerCase() === 'stopped_plan') ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-300' : 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-300'}`}
                                                    title={(device.status?.toLowerCase() === 'online' || device.status?.toLowerCase() === 'stopped_plan') ? 'Démarrer l\'appareil' : 'Mettre l\'appareil en pause'}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={(device.status?.toLowerCase() === 'online' || device.status?.toLowerCase() === 'stopped_plan') ? faPlay : faPause}
                                                        className="text-sm"/>
                                                </button>
                                            )}

                                            {/* Follow Schedule */}
                                            {onDeviceCommandSend && (device.status?.toLowerCase() === 'online' || device.status?.toLowerCase() === 'running') && (
                                                <button
                                                    onClick={() => onDeviceCommandSend(device, 'Follow_Schedule')}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-300"
                                                    title="Suivre le planning"
                                                >
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-sm"/>
                                                </button>
                                            )}

                                            {/* Info + Settings */}
                                            <button
                                                onClick={() => onViewDeviceDetails(device)}
                                                className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 text-blue-500 bg-gray-100 border border-gray-200 hover:bg-gray-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                title="Voir les détails"
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} className="text-base"/>
                                            </button>
                                            <button
                                                onClick={() => onEditDeviceSettings(device)}
                                                className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 text-green-500 bg-gray-100 border border-gray-200 hover:bg-gray-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
                                                title="Modifier les paramètres"
                                            >
                                                <FontAwesomeIcon icon={faPen} className="text-base"/>
                                            </button>
                                            <button
                                                onClick={() => onDeviceScheduleSettings && onDeviceScheduleSettings(device)}
                                                className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 text-purple-500 bg-gray-100 border border-gray-200 hover:bg-gray-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300"
                                                title="Configurer le planning"
                                            >
                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-base"/>
                                            </button>
                                            <button
                                                onClick={() => onViewDeviceNotifications(device.device_id)}
                                                className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 text-orange-500 bg-gray-100 border border-gray-200 hover:bg-gray-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                                title="Voir les notifications de l'appareil"
                                            >
                                                {/* You may want to import faBell instead of faInfoCircle */}
                                                <FontAwesomeIcon icon={faBell} className="text-base"/>
                                            </button>

                                        </div>
                                    </div>

                                    {/* Consumption */}
                                    <div className="mt-4">
                                        <h6 className="font-semibold text-gray-700 text-sm mb-2">Consommation :</h6>
                                        <div
                                            className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-2 text-center`}>
                                            <div
                                                className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex flex-col items-center">
                                                <FontAwesomeIcon icon={faBolt} className="text-blue-500 text-lg"/>
                                                <span className="text-gray-700 text-sm font-medium mt-1">Voltage</span>
                                                <span className="text-gray-900 font-bold">{device?.voltage != null ? device.voltage.toFixed(2) + ' V' : 'N/A'}</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex flex-col items-center">
                                                <FontAwesomeIcon icon={faBolt} className="text-blue-500 text-lg"/>
                                                <span className="text-gray-700 text-sm font-medium mt-1">Courant</span>
                                                <span className="text-gray-900 font-bold">{device?.current != null ? device.current.toFixed(2) + ' A' : 'N/A'}</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex flex-col items-center">
                                                <FontAwesomeIcon icon={faChartLine} className="text-blue-500 text-lg"/>
                                                <span className="text-gray-700 text-sm font-medium mt-1">Puissance</span>
                                                <span className="text-gray-900 font-bold">{device?.power != null ? device.power.toFixed(2) + ' W' : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sensors */}
                                    {sensors.length > 0 && (
                                        <div className="mt-2">
                                            <h6 className="font-semibold text-gray-700 text-sm mb-2">Capteurs ({sensors.length}):</h6>
                                            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                                                {sensors.map((component) => (
                                                    <div key={component.component_id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center flex-grow min-w-0">
                                                            <FontAwesomeIcon icon={getComponentIcon(component.component_subtype)} className="text-gray-500 text-sm mr-3 flex-shrink-0"/>
                                                            <span className="text-gray-700 text-sm font-medium capitalize truncate flex-grow min-w-0">{component.component_subtype ?? component.component_type}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Other Components */}
                                    {otherComponents.length > 0 && (
                                        <div className="mt-4">
                                            <h6 className="font-semibold text-gray-700 text-sm mb-2">Autres Composants ({otherComponents.length}):</h6>
                                            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                                                {otherComponents.map((component) => (
                                                    <div key={component.component_id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center flex-grow min-w-0">
                                                            <FontAwesomeIcon icon={getComponentIcon(component.component_subtype)} className="text-gray-500 text-sm mr-3 flex-shrink-0"/>
                                                            <span className="text-gray-700 text-sm font-medium capitalize truncate flex-grow min-w-0">{component.component_subtype ?? component.component_type}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {sensors.length === 0 && otherComponents.length === 0 && (
                                        <p className="text-sm text-gray-500 italic mt-2">Aucun composant configuré pour cet appareil.</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                        <FontAwesomeIcon icon={faQuestionCircle} className="text-3xl mb-3 text-gray-400"/>
                        <p className="text-md font-medium">Aucun appareil enregistré pour ce lieu.</p>
                        <p className="text-sm">Veuillez ajouter des appareils pour commencer le suivi.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationCard;
