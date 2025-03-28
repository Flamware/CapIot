// src/components/DeviceForm.jsx

import React, { useState } from "react";

interface DeviceFormProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateDevice: (device: { name: string; type: string; description: string }) => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ isOpen, onClose, onCreateDevice }) => {
    const [deviceName, setDeviceName] = useState("");
    const [deviceType, setDeviceType] = useState("");
    const [deviceDescription, setDeviceDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (deviceName && deviceType) {
            const newDevice = {
                name: deviceName,
                type: deviceType,
                description: deviceDescription,
            };
            onCreateDevice(newDevice);
            setDeviceName("");
            setDeviceType("");
            setDeviceDescription("");
            onClose(); // Close the modal after creation
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Create New Device</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700">
                            Device Name
                        </label>
                        <input
                            type="text"
                            id="deviceName"
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700">
                            Device Type
                        </label>
                        <select
                            id="deviceType"
                            value={deviceType}
                            onChange={(e) => setDeviceType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="Air Purifier">Air Purifier</option>
                            <option value="Dehumidifier">Dehumidifier</option>
                            <option value="Heater">Heater</option>
                            <option value="Cooler">Cooler</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="deviceDescription" className="block text-sm font-medium text-gray-700">
                            Device Description
                        </label>
                        <textarea
                            id="deviceDescription"
                            value={deviceDescription}
                            onChange={(e) => setDeviceDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={4}
                        ></textarea>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Create Device
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeviceForm;
