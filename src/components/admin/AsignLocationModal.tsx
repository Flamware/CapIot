import React from 'react';
import {Location} from '../types/location.ts';
import {Pagination} from '../types/pagination.ts';
import {ChevronLeft, ChevronRight} from "lucide-react";

interface AssignLocationModalProps {
    isOpen: boolean;
    deviceId: string | null;
    availableLocations: Location[];
    selectedLocationId: number | null;
    onLocationSelected: (locationId: number) => void;
    onAssign: () => void;
    onCancel: () => void;
    loadingLocations: boolean;
    errorLocations: string | null;
    locationPagination: Pagination;
    onGoToLocationPage: (page: number) => void;
    onGoToPreviousLocationPage: () => void;
    onGoToNextLocationPage: () => void;
}

export const AssignLocationModal: React.FC<AssignLocationModalProps> = ({
                                                                            isOpen,
                                                                            deviceId,
                                                                            availableLocations,
                                                                            selectedLocationId,
                                                                            onLocationSelected,
                                                                            onAssign,
                                                                            onCancel,
                                                                            loadingLocations,
                                                                            errorLocations,
                                                                            locationPagination,
                                                                            onGoToLocationPage,
                                                                            onGoToPreviousLocationPage,
                                                                            onGoToNextLocationPage,
                                                                        }) => {
    if (!isOpen || !deviceId) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Assign Location to Device: {deviceId}</h2>
                {loadingLocations ? (
                    <p className="text-gray-500 mb-4">Fetching locations...</p>
                ) : errorLocations ? (
                    <p className="text-red-500 mb-4">Error fetching locations: {errorLocations}</p>
                ) : availableLocations.length > 0 ? (
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Select Location:
                        </label>
                        <select
                            id="location"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={selectedLocationId || ""}
                            onChange={(e) => onLocationSelected(Number(e.target.value))}
                        >
                            <option value="" disabled>Select a location</option>
                            {availableLocations.map((location: Location) => (
                                <option key={location.location_id} value={location.location_id}>
                                    {location.location_name}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <p className="text-gray-500 mb-4">No locations available.</p>
                )}

                {locationPagination.totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <button
                            onClick={onGoToPreviousLocationPage}
                            disabled={locationPagination.currentPage === 1}
                            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4"/>
                        </button>
                        {Array.from({length: locationPagination.totalPages}, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => onGoToLocationPage(page)}
                                className={`px-3 py-1 border rounded text-sm hover:bg-gray-100 ${
                                    locationPagination.currentPage === page ? 'bg-green-500 text-white' : ''
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={onGoToNextLocationPage}
                            disabled={locationPagination.currentPage === locationPagination.totalPages}
                            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="h-4 w-4"/>
                        </button>
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md">Cancel
                    </button>
                    <button onClick={onAssign} disabled={selectedLocationId === null}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Assign
                    </button>
                </div>
            </div>
        </div>
    );
};