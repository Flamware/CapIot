import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faPen,
    faMapMarkerAlt,
    faTrashAlt,
    faMicrochip
} from '@fortawesome/free-solid-svg-icons';

// En production, ces types seraient importés.
enum ComponentSubtype {
    Temperature = 'temperature',
    Humidity = 'humidity',
    Fan = 'fan',
    LED = 'LED',
}

interface ComponentInfo {
    component_id: string;
    component_type: 'sensor' | 'actuator' | 'indicator';
    component_subtype?: ComponentSubtype;
    component_status?: string;
}

interface DeviceInfo {
    device_id: string;
    status?: string;
    last_seen: string;
    components?: ComponentInfo[];
}

interface LocationInfo {
    location_id: string;
    location_name: string;
    devices: DeviceInfo[];
    lastUpdated: string;
    status: string;
}

interface DevicesWithLocation {
    device_id: string;
    status: string;
    last_seen: string;
    location: LocationInfo | null;
    sensors: {
        sensor_id: string;
        sensor_type: string;
    }[];
}

// --- Fin des définitions de types simulées ---

interface DeviceTableProps {
    devices: DevicesWithLocation[],
    onDelete: (id: string) => void,
    onAssignLocation: (id: string) => void,
    onEdit: (device: DevicesWithLocation) => void,
}

// Helper function to get a consistent status color class (copied from LocationCard for harmony)
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

export const DeviceTable: React.FC<DeviceTableProps> = ({devices, onDelete, onAssignLocation, onEdit}) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div
                className="bg-gray-100 grid grid-cols-6 items-center px-6 py-3 font-semibold text-gray-700 text-sm border-b border-gray-200">
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
                    <FontAwesomeIcon icon={faMicrochip} className="text-4xl text-gray-300 mb-3"/>
                    <p className="text-lg font-medium">Aucun appareil trouvé.</p>
                    <p className="text-sm">Commencez par ajouter de nouveaux appareils.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {devices.map((deviceLocation) => (
                        <div key={deviceLocation.device_id}
                             className="grid grid-cols-6 items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                            {/* Device ID */}
                            <span className="font-medium text-gray-900 truncate"
                                  title={deviceLocation.device_id}>{deviceLocation.device_id}</span>
                            {/* Status */}
                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColorClass(deviceLocation.status)}`}>
                                {deviceLocation.status}
                            </span>
                            {/* Last Seen */}
                            <span
                                className="text-gray-600 text-sm">{new Date(deviceLocation.last_seen).toLocaleString()}</span>
                            {/* Location */}
                            <span className="text-gray-600 text-sm truncate"
                                  title={deviceLocation.location?.location_name}>
                                {deviceLocation.location ? deviceLocation.location.location_name : 'Non assigné'}
                            </span>
                            {/* Sensors */}
                            <div className="flex flex-wrap gap-1">
                                {deviceLocation.sensors && deviceLocation.sensors.length > 0 ? (
                                    deviceLocation.sensors.map(sensor => (
                                        <span key={sensor.sensor_id}
                                              className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full font-medium">{sensor.sensor_type}</span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-xs italic">Aucun</span>
                                )}
                            </div>
                            {/* Actions */}
                            <div className="flex justify-end items-center space-x-2">
                                <button
                                    onClick={() => onEdit(deviceLocation)}
                                    className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors duration-200"
                                    title="Modifier l'appareil"
                                >
                                    <FontAwesomeIcon icon={faPen}/>
                                </button>
                                <button
                                    onClick={() => onAssignLocation(deviceLocation.device_id)}
                                    className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                                    title="Assigner un lieu"
                                >
                                    <FontAwesomeIcon icon={faMapMarkerAlt}/>
                                </button>
                                <button
                                    onClick={() => onDelete(deviceLocation.device_id)}
                                    className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
                                    title="Supprimer l'appareil"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeviceTable;
