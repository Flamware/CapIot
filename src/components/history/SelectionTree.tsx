import React from 'react';
import { ChevronRight, ChevronDown, MapPin, HardDrive, Cpu } from 'lucide-react';
import {SiteWithLocationAndDevices} from "../types/location";


interface SelectionTreeProps {
    sitesWithLocations: SiteWithLocationAndDevices[];
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
                                                         sitesWithLocations,
                                                         selectedLocationId,
                                                         selectedDeviceId,
                                                         selectedSensorIds,
                                                         expandedLocationId,
                                                         expandedDeviceId,
                                                         onLocationClick,
                                                         onDeviceClick,
                                                         onSensorChange,
                                                     }) => {
    const handleLocationClick = (e: React.MouseEvent, locationId: number) => {
        e.stopPropagation();
        onLocationClick(locationId);
    };

    const handleDeviceClick = (e: React.MouseEvent, deviceId: string) => {
        e.stopPropagation();
        onDeviceClick(deviceId);
    };

    const handleSensorChange = (e: React.ChangeEvent<HTMLInputElement>, sensorId: string, sensorType: string) => {
        e.stopPropagation();
        onSensorChange(sensorId, sensorType);
    };

    return (
        <div className="space-y-4">
            {sitesWithLocations?.map(site => (
                <div key={site.site_id}>
                    <div className="flex items-center space-x-2 text-gray-800 font-bold mb-2">
                        <MapPin className="h-5 w-5 text-green-500" />
                        <span>{site.site_name}</span>
                    </div>
                    <ul className="pl-4 space-y-2">
                        {site.locations.map(location => (
                            <li key={location.location_id}>
                                <div
                                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                                        selectedLocationId === location.location_id ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                    onClick={(e) => handleLocationClick(e, location.location_id)}
                                >
                                    {expandedLocationId === location.location_id ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                    <span className="truncate">{location.location_name}</span>
                                </div>
                                {expandedLocationId === location.location_id && (
                                    <ul className="pl-6 mt-2 space-y-2">
                                        {location?.devices.map(device => (
                                            <li key={device.device_id}>
                                                <div
                                                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                                                        selectedDeviceId === device.device_id ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100 text-gray-700'
                                                    }`}
                                                    onClick={(e) => handleDeviceClick(e, device.device_id)}
                                                >
                                                    {expandedDeviceId === device.device_id ? (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4" />
                                                    )}
                                                    <HardDrive className="h-4 w-4" />
                                                    <span className="truncate">{device.device_id}</span>
                                                </div>
                                                {expandedDeviceId === device.device_id && (
                                                    <ul className="pl-6 mt-2 space-y-1">
                                                        {device.components.map(sensor => (
                                                            <li key={sensor.component_id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedSensorIds.includes(sensor.component_id)}
                                                                    onChange={(e) => handleSensorChange(e, sensor.component_id, sensor.component_type)}
                                                                    className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                                                />
                                                                <Cpu className="h-4 w-4 text-gray-500" />
                                                                <span className="truncate">{sensor.component_subtype || sensor.component_type} ({sensor.component_id})</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default SelectionTree;
