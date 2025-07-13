import React, { useState } from 'react';
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

    const [localStatus, setLocalStatus] = useState(""); // Initialize local status with empty string

    // Function to handle status change and ensure lowercase
    const handleStatusChange = (status: string) => {
        setLocalStatus(status); // Update local state
        onStatusChange(status); //
    };

    // Function to handle save
    const handleSave = () => {
        onSave();
    };

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
                                value={localStatus} // Use localStatus here
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"

                            >
                                <option value="" disabled selected>Select Status</option>
                                <option value="Running">Running</option>
                                <option value="Stopped">Stopped</option>
                                <option value="Idle">Idle</option>
                            </select>
                        </div>
                        {/* Add more editable fields here */}
                    </div>
                </div>
                <div className="flex justify-end p-4 gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600">Save</button>
                </div>
            </div>
        </dialog>
    );
};
