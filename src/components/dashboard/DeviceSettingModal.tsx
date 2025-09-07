import React, { useEffect, useState } from "react";
import {ComponentInfo, Device} from "../types/device.ts";
import {DeviceInfo} from "../location/Props.tsx";

interface DeviceSettingsModalProps {
    isOpen: boolean;
    device: DeviceInfo | null;
    onClose: () => void;
    onSave: (updatedComponent: ComponentInfo, deviceId: string) => void;
}

const DeviceSettingsModal: React.FC<DeviceSettingsModalProps> = ({ isOpen, device, onClose, onSave }) => {
    const [editedDevice, setEditedDevice] = useState<Device | null>(device);

    useEffect(() => {
        if (isOpen && device) {
            setEditedDevice({ ...device });
        } else if (!isOpen) {
            setEditedDevice(null);
        }
    }, [isOpen, device]);

    const handleSensorChange = (
        index: number,
        field: "min_threshold" | "max_threshold",
        value: string
    ) => {
        if (!editedDevice || !editedDevice.components) return;

        const updatedComponents = [...editedDevice.components];
        const newNumericValue = value === "" ? undefined : Number(value);

        updatedComponents[index] = {
            ...updatedComponents[index],
            [field]: newNumericValue,
        };
        setEditedDevice({ ...editedDevice, components: updatedComponents });
    };

    const handleSaveSensor = (index: number) => {
        if (!editedDevice || !editedDevice.components) return;
        const sensor = editedDevice.components[index];
        onSave(sensor, editedDevice.device_id);
    };

    if (!isOpen || !editedDevice) return null;

    const sensors =
        editedDevice.components
            ?.map((component, index) => ({ component, index }))
            .filter(({ component }) => component.component_type === 'sensor') || [];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Device Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Device ID</label>
                    <div className="text-gray-900 font-mono text-lg bg-gray-100 p-2 rounded-md border border-gray-300">
                        {editedDevice.device_id}
                    </div>
                </div>

                {sensors.length > 0 ? (
                    <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-5">
                        {sensors.map(({ component: sensor, index }) => (
                            <div
                                key={sensor.component_id}
                                className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md"
                            >
                                <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                        {sensor.component_subtype}
                                    </span>
                                    {sensor.component_id}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor={`min-${sensor.component_id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Threshold
                                        </label>
                                        <input
                                            id={`min-${sensor.component_id}`}
                                            type="number"
                                            className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                            value={sensor.min_threshold ?? ""}
                                            onChange={(e) => handleSensorChange(index, "min_threshold", e.target.value)}
                                            placeholder="e.g., 0"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`max-${sensor.component_id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Threshold
                                        </label>
                                        <input
                                            id={`max-${sensor.component_id}`}
                                            type="number"
                                            className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                            value={sensor.max_threshold ?? ""}
                                            onChange={(e) => handleSensorChange(index, "max_threshold", e.target.value)}
                                            placeholder="e.g., 100"
                                        />
                                    </div>
                                </div>

                                <div className="text-right">
                                    <button
                                        onClick={() => handleSaveSensor(index)}
                                        className="px-5 py-2.5 text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-grow flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600 text-lg font-medium">No sensors available for this device.</p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeviceSettingsModal;
