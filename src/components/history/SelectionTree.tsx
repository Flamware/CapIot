// components/location/SelectionTree.tsx
import React from 'react';
import { LocationData as LocationDataType, DeviceInfo as DeviceInfoType } from "../location/Props";
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import {
    MapPinIcon, // Replaces default chevron for locations
    ServerStackIcon, // Icon for devices
    CloudArrowUpIcon // Icon for sensors (or more specific if available, e.g., ThermometerIcon)
} from '@heroicons/react/24/solid'; // Solid icons for selected states

interface Sensor {
    sensor_id: string;
    sensor_type: string;
    name?: string; // Sensor name (e.g., "Temperature Sensor")
}

interface Device extends Omit<DeviceInfoType, 'sensors'> {
    sensors: Sensor[];
    name?: string; // Device name (e.g., "Main Server")
}

interface Location extends Omit<LocationDataType, 'devices'> {
    devices: Device[];
}

interface SelectionTreeProps {
    locations: Location[];
    selectedLocationId: number | null;
    selectedDeviceId: string | null;
    selectedSensorIds: string[];
    expandedLocationId: number | null;
    expandedDeviceId: string | null;
    onLocationClick: (locationId: number) => void;
    onDeviceClick: (deviceId: string) => void;
    onSensorChange: (sensorId: string, sensorType: string) => void;
}

const SelectionTree: React.FC<SelectionTreeProps> = ({
                                                         locations,
                                                         selectedLocationId,
                                                         selectedDeviceId,
                                                         selectedSensorIds,
                                                         expandedLocationId,
                                                         expandedDeviceId,
                                                         onLocationClick,
                                                         onDeviceClick,
                                                         onSensorChange,
                                                     }) => {

    return (
        <aside className="bg-white w-72 min-h-full p-5 shadow-xl rounded-lg border border-gray-100 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                <span className="text-green-600 mr-2">Arbre de Sélection</span>
            </h2>

            {/* Information about number of locations */}
            {locations.length === 0 ? (
                <div className="text-gray-500 italic text-center py-4">
                    Aucune localisation disponible
                </div>
            ) : (
                <div className="text-gray-600 text-sm mb-4 px-2">
                    <span className="font-semibold text-green-700">{locations.length}</span>
                    &nbsp;localisation{locations.length > 1 ? 's' : ''} trouvée{locations.length > 1 ? 's' : ''}
                </div>
            )}

            {/* Tree Structure */}
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 -mr-2"> {/* Added custom scrollbar */}
                <div className="space-y-2">
                    {locations.map((location) => (
                        <div key={location.location_id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                            {/* Location Item */}
                            <div
                                className={`flex items-center justify-between p-3 cursor-pointer transition-colors duration-200 ${
                                    selectedLocationId === location.location_id
                                        ? 'bg-green-400 text-white font-semibold'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-100'
                                }`}
                                onClick={() => onLocationClick(location.location_id)}
                            >
                                <div className="flex items-center">
                                    <MapPinIcon className="h-5 w-5 mr-2" />
                                    <span className="truncate">{location.location_name}</span>
                                </div>
                                {expandedLocationId === location.location_id ? (
                                    <ChevronDownIcon className="h-5 w-5 ml-2" />
                                ) : (
                                    <ChevronRightIcon className="h-5 w-5 ml-2" />
                                )}
                            </div>

                            {/* Devices List (conditionally rendered) */}
                            {expandedLocationId === location.location_id && (
                                <ul className="ml-0 border-t border-gray-200 bg-white">
                                    {location.devices.length === 0 && (
                                        <li className="p-3 text-gray-500 italic text-sm">Aucun appareil pour ce lieu.</li>
                                    )}
                                    {location.devices.map((device) => (
                                        <li key={device.device_id} className="border-b border-gray-100 last:border-b-0">
                                            {/* Device Item */}
                                            <div
                                                className={`flex items-center justify-between p-3 pl-6 cursor-pointer transition-colors duration-200 ${
                                                    selectedDeviceId === device.device_id
                                                        ? 'bg-green-300 text-green-800 font-medium'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                                onClick={() => onDeviceClick(device.device_id)}
                                            >
                                                <div className="flex items-center">
                                                    <ServerStackIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                    <span className="truncate" title={device.name || device.device_id}>
                                                        {device.name || device.device_id}
                                                    </span>
                                                </div>
                                                {expandedDeviceId === device.device_id ? (
                                                    <ChevronDownIcon className="h-4 w-4 ml-2 text-gray-500" />
                                                ) : (
                                                    <ChevronRightIcon className="h-4 w-4 ml-2 text-gray-500" />
                                                )}
                                            </div>

                                            {/* Sensors List (conditionally rendered) */}
                                            {expandedDeviceId === device.device_id && (
                                                <ul className="ml-0 border-t border-gray-100 bg-gray-100">
                                                    {device.sensors.length === 0 && (
                                                        <li className="p-3 pl-10 text-gray-500 italic text-sm">Aucun capteur pour cet appareil.</li>
                                                    )}
                                                    {device.sensors.map((sensor) => (
                                                        <li key={sensor.sensor_id}>
                                                            <label
                                                                className={`flex items-center p-3 pl-10 cursor-pointer rounded-b-lg last:rounded-b-lg transition-colors duration-200 ${
                                                                    selectedSensorIds.includes(sensor.sensor_id)
                                                                        ? 'bg-green-50 text-white font-medium'
                                                                        : 'hover:bg-gray-50 text-gray-700'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className={`mr-3 h-4 w-4 rounded form-checkbox ${
                                                                        selectedSensorIds.includes(sensor.sensor_id)
                                                                            ? 'text-yellow-700 focus:ring-yellow-500'
                                                                            : 'text-green-600 focus:ring-blue-500'
                                                                    }`}
                                                                    value={sensor.sensor_id}
                                                                    checked={selectedSensorIds.includes(sensor.sensor_id)}
                                                                    onChange={() => onSensorChange(sensor.sensor_id, sensor.sensor_type)}
                                                                />
                                                                <CloudArrowUpIcon className="h-4 w-4 mr-2 text-gray-500" /> {/* Generic sensor icon */}
                                                                <span className="truncate" title={sensor.name || sensor.sensor_id}>
                                                                    {sensor.name || sensor.sensor_id}
                                                                </span>
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default SelectionTree;