// src/components/location/LocationsSection.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { LocationsSectionProps } from "./Props";
import LocationCard from "./locationCard";

const LocationsSection: React.FC<LocationsSectionProps> = ({
                                                               locationsData,
                                                               onViewDetails,
                                                               onToggleNotifications,
                                                               onViewChart,
                                                               onSetupNewLocation,
                                                           }) => {
    return (
        <section id="locations" className="py-8 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Vos Lieux de Surveillance</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locationsData.map((location) => (
                        <LocationCard
                            key={location.id}
                            location_name={location.location_name}
                            devices={location.devices}
                            onViewDetails={() => onViewDetails(location.location_name)}
                            onToggleNotifications={() => onToggleNotifications(location.location_name)}
                            onViewChart={() => onViewChart(location.location_name)}
                            lastUpdated={''} // Consider how to derive this
                            status={''}      // Consider how to derive this
                        />
                    ))}
                </div>

                {locationsData.length === 0 && (
                    <div className="text-center mt-8 text-gray-500">
                        <p>Aucun lieu de surveillance configuré.</p>
                        <button
                            onClick={onSetupNewLocation}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                            Ajouter un premier emplacement
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LocationsSection;