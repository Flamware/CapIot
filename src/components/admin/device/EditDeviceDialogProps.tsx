import React from 'react';
import { DevicesWithLocation } from '../../types/device.ts';

interface EditDeviceDialogProps {
    isOpen: boolean;
    device: DevicesWithLocation | null;
    onClose: () => void;
    onSave: () => void;
    onStatusChange: (status: string) => void;
}

export const EditDeviceDialog: React.FC<EditDeviceDialogProps> = ({ isOpen, device, onClose, onSave, onStatusChange }) => {
    if (!isOpen || !device) {
        return null;
    }

    return (
        <dialog open={isOpen} className="w-full max-w-md p-0 rounded-lg shadow-md">
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-2">Edit Device</h2>
                    <p className="text-gray-500 mb-4">
                        Edit the details of the selected device.
                    </p>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="edit-device-id" className="text-sm font-medium">
                                Device ID
                            </label>
                            <input
                                id="edit-device-id"
                                value={device.device_id}
                                className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                readOnly
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="edit-device-status" className="text-sm font-medium">
                                Status
                            </label>
                            <select
                                id="edit-device-status"
                                value={device.status}
                                onChange={(e) => onStatusChange(e.target.value)}
                                className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                        {/* Add more editable fields here */}
                    </div>
                </div>
                <div className="flex justify-end p-4 gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100">Cancel</button>
                    <button onClick={onSave} className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Save Changes</button>
                </div>
            </div>
        </dialog>
    );
};