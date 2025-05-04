import React, { useState } from 'react';
import { MoreHorizontal, Trash2, MapPin } from 'lucide-react';
import {DevicesWithLocation} from "../../types/device.ts";

interface DeviceMenuDropdownProps {
    device: DevicesWithLocation;
    onDelete: (id: string) => void;
    onAssignLocation: (id: string) => void;
}

export const DeviceMenuDropdown: React.FC<DeviceMenuDropdownProps> = ({ device, onDelete, onAssignLocation }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                    onMouseLeave={() => setIsOpen(false)} // Optional: Close when mouse leaves
                >
                    <div className="py-1" role="none">
                        <button
                            onClick={() => {
                                onAssignLocation(device.device_id!);
                                setIsOpen(false);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                            role="menuitem"
                        >
                            <MapPin className="mr-2 h-4 w-4 inline-block" />
                            Assign Location
                        </button>
                        <button
                            onClick={() => {
                                onDelete(device.device_id!);
                                setIsOpen(false);
                            }}
                            className="block px-4 py-2 text-sm text-red-500 w-full text-left hover:bg-gray-100"
                            role="menuitem"
                        >
                            <Trash2 className="mr-2 h-4 w-4 inline-block" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};