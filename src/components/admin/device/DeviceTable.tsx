import React from 'react';
import { DevicesWithLocation } from '../../types/device.ts';
import { DeviceMenuDropdown } from './DeviceMenuDropdown.tsx'; // Assuming you'll move this as well

interface DeviceTableProps {
    devices: DevicesWithLocation[];
    onDelete: (id: string) => void;
    onAssignLocation: (id: string) => void;
    onEdit: (device: DevicesWithLocation) => void;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({ devices, onDelete, onAssignLocation, onEdit }) => {
    if (devices.length === 0) {
        return (
            <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                    No devices found.
                </td>
            </tr>
        );
    }

    return (
        <tbody>
        {devices.map((deviceLocation) => (
            <tr key={deviceLocation?.device_id} className="border-t">
                <td className="p-2 font-medium">{deviceLocation?.device_id}</td>
                <td className="p-2">
                        <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                                deviceLocation?.status === "Running"
                                    ? "bg-green-100 text-green-700"
                                    : deviceLocation?.status === "stopped"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                            {deviceLocation?.status}
                        </span>
                </td>
                <td className="p-2">{new Date(deviceLocation?.last_seen).toLocaleString()}</td>
                <td className="p-2">
                    {deviceLocation.location ? (
                        <div>
                            {deviceLocation.location.location_name}
                        </div>
                    ) : (
                        <span className="text-gray-500">No location assigned</span>
                    )}
                </td>
                <td className="p-2">
                    {deviceLocation?.sensors && deviceLocation.sensors.length > 0 ? (
                        deviceLocation.sensors.map(sensor => (
                            <div key={sensor.sensor_id}>
                                {sensor.sensor_type} ({sensor.sensor_id})
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-500">No sensors</span>
                    )}
                </td>
                <td className="p-2">
                    <button
                        onClick={() => onEdit(deviceLocation)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Edit
                    </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    <DeviceMenuDropdown
                        device={deviceLocation}
                        onDelete={onDelete}
                        onAssignLocation={onAssignLocation}
                    />
                </td>
            </tr>
        ))}
        </tbody>
    );
};