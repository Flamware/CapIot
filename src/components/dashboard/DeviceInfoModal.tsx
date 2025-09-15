import React, { useCallback, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import {DeviceInfo} from "../location/Props.tsx";
import {ComponentInfo} from "../types/device.ts";


interface DeviceInfoModalProps {
    isOpen: boolean;
    device: DeviceInfo;
    onClose: () => void;
    onResetComponent: (component: ComponentInfo) => Promise<void>;
}

const DeviceInfoModal: React.FC<DeviceInfoModalProps> = ({ isOpen, device, onClose, onResetComponent }) => {
    if (!isOpen) return null;

    const [isResetting, setIsResetting] = useState<string | null>(null);

    const renderComponentDetails = useCallback((component: ComponentInfo) => {
        const hasLifespan = typeof component.max_running_hours === 'number' && component.max_running_hours > 0;
        let lifespanPercentage = 0;
        let progressBarColor = 'bg-gray-400';
        let lifespanExceeded = false;

        if (hasLifespan && typeof component.current_running_hours === 'number' && component.max_running_hours) {
            lifespanPercentage = (1 - (component.current_running_hours / component.max_running_hours)) * 100;

            if (lifespanPercentage <= 0) {
                lifespanPercentage = 0;
                lifespanExceeded = true;
                progressBarColor = 'bg-red-500';
            } else if (lifespanPercentage > 75) {
                progressBarColor = 'bg-green-500';
            } else if (lifespanPercentage > 25) {
                progressBarColor = 'bg-yellow-500';
            } else {
                progressBarColor = 'bg-red-500';
            }
        }

        const handleResetClick = async () => {
            setIsResetting(component.component_id);
            try {
                await onResetComponent(component);
            } finally {
                setIsResetting(null);
            }
        };

        const isComponentResetting = isResetting === component.component_id;

        return (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800">
                    {component.component_type.charAt(0).toUpperCase() + component.component_type.slice(1)} ({component.component_subtype})
                </h4>
                <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
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
                                style={{ width: `${lifespanPercentage}%` }}
                            ></div>
                        </div>
                        <div className="text-right text-xs mt-1">
                            {lifespanExceeded ? (
                                <span className="text-red-600 font-semibold">Lifespan Exceeded!</span>
                            ) : (
                                <span className="text-gray-500">{Math.round(lifespanPercentage)}%</span>
                            )}
                        </div>
                        {component.current_running_hours > 0 && (
                            <button
                                onClick={handleResetClick}
                                disabled={isComponentResetting}
                                className="mt-2 w-full text-white bg-red-600 hover:bg-red-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isComponentResetting ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" /> Resetting...
                                    </>
                                ) : (
                                    'Reset Running Hours'
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }, [onResetComponent, isResetting]);


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
                    <p className="text-sm text-gray-500">Last Seen: {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'N/A'}</p>
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
