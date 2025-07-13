import React, { useEffect, useState } from 'react';
import { sensorInfo } from "../types/device.ts";
import { DeviceInfo } from "../location/Props.tsx";

interface DeviceSettingsModalProps {
    isOpen: boolean;
    device: DeviceInfo;
    onClose: () => void;
    onSave: (updatedsensor: sensorInfo, deviceId: string) => void;
}

const DeviceSettingsModal: React.FC<DeviceSettingsModalProps> = ({ isOpen, device, onClose, onSave }) => {
    // State to manage the device data being edited within the modal
    const [editedDevice, setEditedDevice] = useState<DeviceInfo>({ ...device });

    // Sync state with prop changes when the modal opens or the device prop changes
    useEffect(() => {
        if (isOpen) {
            setEditedDevice({ ...device });
        }
    }, [isOpen, device]);

    /**
     * Handles changes to sensor range values (min/max).
     * @param index The index of the sensor in the array.
     * @param field The field to update ('rangeMin' or 'rangeMax').
     * @param value The new numerical value.
     */
    const handlesensorChange = (index: number, field: 'min_threshold' | 'max_threshold', value: number) => {
        // Ensure sensors exist before attempting to update
        if (!editedDevice.sensors) return;

        // Create a new array to avoid direct state mutation
        const updatedsensors = [...editedDevice.sensors];
        // Update the specific sensor's field
        updatedsensors[index] = {
            ...updatedsensors[index],
            [field]: value,
        };
        // Update the editedDevice state with the new sensors array
        setEditedDevice({ ...editedDevice, sensors: updatedsensors });
    };

    /**
     * Handles saving a single sensor's updated range.
     * @param index The index of the sensor to save.
     */
    const handlesensorsave = (index: number) => {
        const sensor = editedDevice.sensors?.[index];
        // Ensure the sensor exists before attempting to save
        if (!sensor) return;
        // Call the onSave prop with the updated sensor and device ID
        onSave(sensor, editedDevice.device_id);
    };

    // If the modal is not open, render nothing
    if (!isOpen) return null;

    return (
        // Overlay for the modal, covering the entire screen
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            {/* Modal content container */}
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out scale-100 opacity-100">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Device Settings</h2>
                    {/* Close button (X icon) */}
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Device ID Section */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Device ID</label>
                    <div className="text-gray-900 font-mono text-lg select-all bg-gray-100 p-2 rounded-md border border-gray-300">
                        {editedDevice.device_id}
                    </div>
                </div>

                {/* sensors Section */}
                {editedDevice.sensors && editedDevice.sensors.length > 0 ? (
                    <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-5"> {/* Added pr-2 -mr-2 for scrollbar */}
                        {editedDevice.sensors.map((sensor, index) => (
                            <div key={sensor.sensor_id} className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                        {sensor.sensor_type}
                                    </span>
                                    {sensor.sensor_id}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* Min Threshold Input */}
                                    <div>
                                        <label htmlFor={`min-${sensor.sensor_id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Threshold
                                        </label>
                                        <input
                                            id={`min-${sensor.sensor_id}`}
                                            type="number"
                                            className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                                            value={sensor.min_threshold ?? ''} // Corrected field name
                                            onChange={(e) =>
                                                handlesensorChange(index, 'min_threshold', Number(e.target.value)) // Corrected field name
                                            }
                                            placeholder="e.g., 0"
                                        />
                                    </div>
                                    {/* Max Threshold Input */}
                                    <div>
                                        <label htmlFor={`max-${sensor.sensor_id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Threshold
                                        </label>
                                        <input
                                            id={`max-${sensor.sensor_id}`}
                                            type="number"
                                            className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                                            value={sensor.max_threshold ?? ''} // Corrected field name
                                            onChange={(e) =>
                                                handlesensorChange(index, 'max_threshold', Number(e.target.value)) // Corrected field name
                                            }
                                            placeholder="e.g., 100"
                                        />
                                    </div>
                                </div>

                                {/* Save sensor Button */}
                                <div className="text-right">
                                    <button
                                        onClick={() => handlesensorsave(index)}
                                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Message for no sensors
                    <div className="flex-grow flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600 text-lg font-medium">No sensors available for this device.</p>
                    </div>
                )}

                {/* Modal Footer (Close button) */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeviceSettingsModal;