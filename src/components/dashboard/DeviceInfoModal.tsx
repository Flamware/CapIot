import React from 'react';
import { DeviceInfo } from '../location/Props.tsx';
import { ComponentInfo } from '../types/device.ts';
import { X } from 'lucide-react';

interface DeviceInfoModalProps {
    isOpen: boolean;
    device: DeviceInfo;
    onClose: () => void;
}

const DeviceInfoModal: React.FC<DeviceInfoModalProps> = ({ isOpen, device, onClose }) => {
    if (!isOpen) return null;

    const renderComponentDetails = (component: ComponentInfo) => {
        const hasLifespan = typeof component.max_running_hours === 'number' && component.max_running_hours > 0;
        let lifespanPercentage = 0;
        let progressBarColor = 'bg-gray-400';

        if (hasLifespan && typeof component.current_running_hours === 'number') {
            lifespanPercentage = (1 - (component.current_running_hours / component.max_running_hours)) * 100;
            if (lifespanPercentage > 75) {
                progressBarColor = 'bg-green-500';
            } else if (lifespanPercentage > 25) {
                progressBarColor = 'bg-yellow-500';
            } else {
                progressBarColor = 'bg-red-500';
            }
        }

        return (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800">
                    {component.component_type.charAt(0).toUpperCase() + component.component_type.slice(1)} ({component.component_subtype})
                </h4>
                <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                    {component.component_status && <li>Status: {component.component_status}</li>}
                    {typeof component.min_threshold === 'number' && <li>Min Threshold: {component.min_threshold}</li>}
                    {typeof component.max_threshold === 'number' && <li>Max Threshold: {component.max_threshold}</li>}
                    {typeof component.max_running_hours === 'number' && <li>Max Running Hours: {component.max_running_hours}</li>}
                    {typeof component.current_running_hours === 'number' && <li>Current Running Hours: {Math.round(component.current_running_hours)}</li>}
                </ul>
                {hasLifespan && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Lifespan Remaining</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${progressBarColor}`}
                                style={{ width: `${Math.max(0, lifespanPercentage)}%` }}
                            ></div>
                        </div>
                        <p className="text-right text-xs text-gray-500 mt-1">{Math.round(lifespanPercentage)}%</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Device Information</h2>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Device: {device.device_id}</h3>
                    <p className="text-sm text-gray-500">Last Seen: {new Date(device.last_seen).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Status: {device.status}</p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Components</h3>
                    {device.components && device.components.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {device.components.map((component, index) => (
                                <React.Fragment key={index}>
                                    {renderComponentDetails(component)}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No components found for this device.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeviceInfoModal;
