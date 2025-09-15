import React, { useEffect, useState } from "react";
import {DeviceInfo} from "../location/Props.tsx";
import {ComponentInfo} from "../types/device.ts";

interface DeviceSettingsModalProps {
    isOpen: boolean;
    device: DeviceInfo | null;
    onClose: () => void;
    onSave: (updatedComponent: ComponentInfo, deviceId: string) => void;
    onReset: (componentInfo: ComponentInfo) => void;
}

const DeviceSettingsModal: React.FC<DeviceSettingsModalProps> = ({ isOpen, device, onClose, onSave, onReset }) => {
    const [editedDevice, setEditedDevice] = useState<DeviceInfo | null>(device);

    useEffect(() => {
        if (isOpen && device) {
            setEditedDevice({ ...device });
        } else if (!isOpen) {
            setEditedDevice(null);
        }
    }, [isOpen, device]);

    const handleComponentChange = (
        index: number,
        field: "min_threshold" | "max_threshold" | "max_running_hours",
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

    const handleSaveComponent = (index: number) => {
        if (!editedDevice || !editedDevice.components) return;
        const componentToSave = editedDevice.components[index];
        // The componentToSave object already contains the updated `max_running_hours`
        // due to the state being updated in `handleComponentChange`.
        onSave(componentToSave, editedDevice.device_id);
    };

    const handleResetComponent = (index: number) => {
        if (!editedDevice || !editedDevice.components) return;
        const componentToReset = editedDevice.components[index];
        onReset(componentToReset);
    };

    if (!isOpen || !editedDevice) return null;

    // The code below was changed. Previously, it was filtering out components
    // that were not of type 'sensor' or 'actuator'. This has been removed
    // to show all components.
    const components = editedDevice.components?.map((component, index) => ({ component, index })) || [];

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

                {components.length > 0 ? (
                    <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-5">
                        {components.map(({ component, index }) => (
                            <div
                                key={component.component_id}
                                className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md"
                            >
                                <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                        {component.component_subtype}
                                    </span>
                                    {component.component_id}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor={`current-running-${component.component_id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Current Running Hours
                                        </label>
                                        <input
                                            id={`current-running-${component.component_id}`}
                                            type="text"
                                            className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900 bg-gray-100 cursor-not-allowed"
                                            value={component.current_running_hours ?? "N/A"}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`max-running-${component.component_id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Running Hours
                                        </label>
                                        <input
                                            id={`max-running-${component.component_id}`}
                                            type="number"
                                            className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                            value={component.max_running_hours ?? ""}
                                            onChange={(e) => handleComponentChange(index, "max_running_hours", e.target.value)}
                                            placeholder="e.g., 20000"
                                        />
                                    </div>
                                    {component.component_type === 'sensor' && (
                                        <>
                                            <div>
                                                <label htmlFor={`min-${component.component_id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                    Min Threshold
                                                </label>
                                                <input
                                                    id={`min-${component.component_id}`}
                                                    type="number"
                                                    className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                                    value={component.min_threshold ?? ""}
                                                    onChange={(e) => handleComponentChange(index, "min_threshold", e.target.value)}
                                                    placeholder="e.g., 0"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`max-${component.component_id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                    Max Threshold
                                                </label>
                                                <input
                                                    id={`max-${component.component_id}`}
                                                    type="number"
                                                    className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                                    value={component.max_threshold ?? ""}
                                                    onChange={(e) => handleComponentChange(index, "max_threshold", e.target.value)}
                                                    placeholder="e.g., 100"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="text-right space-x-2">
                                    {/* The reset button is now conditionally rendered */}
                                    {component.current_running_hours > 0 && (
                                        <button
                                            onClick={() => handleResetComponent(index)}
                                            className="px-5 py-2.5 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                                        >
                                            Reset
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleSaveComponent(index)}
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
                        <p className="text-gray-600 text-lg font-medium">No components with settings available for this device.</p>
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
