// components/location/SelectionTree.tsx
import React from 'react';
import { LocationData as LocationDataType, DeviceInfo as DeviceInfoType } from "../location/Props";
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Sensor {
    sensor_id: string;
    sensor_type: string;
    name?: string;
}

interface Device extends Omit<DeviceInfoType, 'captors'> {
    captors: Sensor[];
    name?: string;
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
        <aside className="bg-white w-64 p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Sélection</h2>
            <div className="space-y-2">
                {locations.map((location) => (
                    <div key={location.location_id}>
                        <div
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedLocationId === location.location_id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                            onClick={() => onLocationClick(location.location_id)}
                        >
                            <span className="font-semibold">{location.location_name}</span>
                            {expandedLocationId === location.location_id ? (
                                <ChevronDownIcon className="h-5 w-5" />
                            ) : (
                                <ChevronRightIcon className="h-5 w-5" />
                            )}
                        </div>
                        {expandedLocationId === location.location_id && (
                            <ul className="ml-4 space-y-1">
                                {location.devices.map((device) => (
                                    <li key={device.device_id}>
                                        <div
                                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedDeviceId === device.device_id ? 'bg-green-100' : 'hover:bg-gray-50'}`}
                                            onClick={() => onDeviceClick(device.device_id)}
                                        >
                                            <span>{device.device_id}</span>
                                            {expandedDeviceId === device.device_id ? (
                                                <ChevronDownIcon className="h-4 w-4" />
                                            ) : (
                                                <ChevronRightIcon className="h-4 w-4" />
                                            )}
                                        </div>
                                        {expandedDeviceId === device.device_id && (
                                            <ul className="ml-4 space-y-1">
                                                {device.captors.map((sensor) => (
                                                    <li key={sensor.sensor_id}>
                                                        <label className={`flex items-center p-2 rounded-md hover:bg-gray-50 ${selectedSensorIds.includes(sensor.sensor_id) ? 'bg-yellow-100' : ''}`}>
                                                            <input
                                                                type="checkbox"
                                                                className="mr-2"
                                                                value={sensor.sensor_id}
                                                                checked={selectedSensorIds.includes(sensor.sensor_id)}
                                                                onChange={() => onSensorChange(sensor.sensor_id, sensor.sensor_type)}
                                                            />
                                                            <span>{sensor.name}</span>
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
        </aside>
    );
};

export default SelectionTree;