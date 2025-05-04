import React from 'react';
import { DevicesWithLocation } from '../../types/device.ts';
import { DeviceMenuDropdown } from './DeviceMenuDropdown.tsx'; // Assuming you'll move this as well

interface DeviceTableProps {
    devices: DevicesWithLocation[];
    onDelete: (id: string) => void;
    onAssignLocation: (id: string) => void;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({ devices, onDelete, onAssignLocation }) => {
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
                                deviceLocation?.status === "Online"
                                    ? "bg-green-100 text-green-700"
                                    : deviceLocation?.status === "Offline"
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
                    {deviceLocation?.captors && deviceLocation.captors.length > 0 ? (
                        deviceLocation.captors.map(captor => (
                            <div key={captor.captor_id}>
                                {captor.captor_type} ({captor.captor_id})
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-500">No captors</span>
                    )}
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