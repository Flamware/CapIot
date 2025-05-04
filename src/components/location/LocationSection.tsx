// src/components/location/LocationsSection.tsx
import React from 'react';
import { LocationsSectionProps } from "./Props";
import LocationCard from "./locationCard";

const LocationsSection: React.FC<LocationsSectionProps> = ({
                                                               locationsData,
                                                               onViewDetails,
                                                               onToggleNotifications,
                                                               onViewChart,
                                                           }) => {
    return (
        <section id="locations" className="py-12 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Vos Lieux de Surveillance</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locationsData.map((location) => (
                        <LocationCard
                            key={location.id}
                            location_name={location.location_name}
                            devices={location.devices}
                            onViewDetails={() => onViewDetails(location.location_name)}
                            onToggleNotifications={() => onToggleNotifications(location.location_name)}
                            onViewChart={() => onViewChart(location.location_name)}
                            lastUpdated={''}
                            status={''}
                        />
                    ))}
                </div>


            </div>
        </section>
    );
};

export default LocationsSection;