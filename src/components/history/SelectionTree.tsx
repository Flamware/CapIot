import React from 'react';
import {ChevronRight, ChevronDown, MapPin, HardDrive, Cpu} from 'lucide-react';
import {SiteWithLocationAndDevices} from "../types/location";
import {Component} from "../types/device.ts";


interface SelectionTreeProps {
    sitesWithLocations: SiteWithLocationAndDevices[];
    selectedlocationID: number | null;
    selecteddeviceID: string | null;
    selectedComponents: Component[];
    expandedlocationID: number | null;
    expandeddeviceID: string | null;
    onLocationClick: (locationID: number) => void;
    onDeviceClick: (deviceID: string) => void;
    onComponentChange: (component: Component) => void;
    selectedMetric: ('current' | 'voltage' | 'power' | null)[];
    onDeviceAndMetricClick: (deviceID: string, metric: 'current' | 'voltage' | 'power' | null) => void;
}


const SelectionTree: React.FC<SelectionTreeProps> = ({
                                                         sitesWithLocations,
                                                         selectedlocationID,
                                                         selecteddeviceID,
                                                         selectedComponents,
                                                         expandedlocationID,
                                                         expandeddeviceID,
                                                         onLocationClick,
                                                         onDeviceClick,
                                                         onComponentChange,
                                                         selectedMetric,
                                                         onDeviceAndMetricClick,
                                                     }) => {
    const handleLocationClick = (e: React.MouseEvent, locationID: number) => {
        e.stopPropagation();
        onLocationClick(locationID);
    };

    const handleDeviceClick = (e: React.MouseEvent, deviceID: string) => {
        e.stopPropagation();
        onDeviceClick(deviceID);
    };

    return (
        <div className="space-y-4">
            {sitesWithLocations?.map(site => (
                <div key={site.site_id}>
                    <div className="flex items-center space-x-2 text-gray-800 font-bold mb-2">
                        <MapPin className="h-5 w-5 text-green-500"/>
                        <span>{site.site_name}</span>
                    </div>
                    <ul className="pl-4 space-y-2">
                        {site.locations.map(location => (
                            <li key={location.location_id}>
                                <div
                                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                                        selectedlocationID === location.location_id ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                    onClick={(e) => handleLocationClick(e, location.location_id)}
                                >
                                    {expandedlocationID === location.location_id ? (
                                        <ChevronDown className="h-4 w-4"/>
                                    ) : (
                                        <ChevronRight className="h-4 w-4"/>
                                    )}
                                    <span className="truncate">{location.location_name}</span>
                                </div>
                                {expandedlocationID === location.location_id && (
                                    <ul className="pl-6 mt-2 space-y-2">
                                        {location?.devices.map(device => (
                                            <li key={device.device_id}>
                                                <div
                                                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                                                        selecteddeviceID === device.device_id ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100 text-gray-700'
                                                    }`}
                                                    onClick={(e) => handleDeviceClick(e, device.device_id)}
                                                >
                                                    {expandeddeviceID === device.device_id ? (
                                                        <ChevronDown className="h-4 w-4"/>
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4"/>
                                                    )}
                                                    <HardDrive className="h-4 w-4"/>
                                                    <span className="truncate">{device.device_id}</span>
                                                </div>
                                                {expandeddeviceID === device.device_id && (
                                                    <ul className="pl-6 mt-2 space-y-1">
                                                        <li className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedMetric?.includes('current')}
                                                                onChange={() => onDeviceAndMetricClick(device.device_id, 'current')}
                                                                className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                                            />
                                                            <span>Current</span>
                                                        </li>
                                                        <li className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedMetric?.includes('voltage')}
                                                                onChange={() => onDeviceAndMetricClick(device.device_id, 'voltage')}
                                                                className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                                            />
                                                            <span>Voltage</span>
                                                        </li>
                                                        <li className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedMetric?.includes('power')}
                                                                onChange={() => onDeviceAndMetricClick(device.device_id, 'power')}
                                                                className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                                            />
                                                            <span>Power</span>
                                                        </li>
                                                        {device?.components.map((component) => (
                                                            <li
                                                                key={component.component_id}
                                                                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedComponents.some((c) => c?.component_id === component?.component_id)}
                                                                    onChange={() => onComponentChange(component)}
                                                                    className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                                                />
                                                                <Cpu className="h-4 w-4 text-gray-500"/>
                                                                <span className="truncate">
                                                                    {component?.component_subtype || component?.component_type} ({component?.component_id})
                                                                </span>
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