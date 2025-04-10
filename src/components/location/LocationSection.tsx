import React from 'react';
import LocationCard from './locationCard.tsx';
import AddNewLocationCard from './addNewLocationCard.tsx';

interface SensorData {
    photocatalyseFonctionne: boolean | null;
    ionisateurFonctionne: boolean | null;
    ozoneNiveauDeclenchement: number | null;
    capteurQualiteAir: number | null;
    capteurPolluantSpecifique: number | null;
    capteurEfficaciteAutreSysteme: number | null;
}

interface LocationsSectionProps {
    locationsData: {
        location_name: string;
        lastUpdated: string;
        status: string; // Can be 'Normal', 'Warning', 'Critical', 'Ozone Actif', etc.
        sensorData: SensorData;
    }[];
    onViewDetails: (locationName: string) => void;
    onToggleNotifications: (locationName: string) => void;
    onViewChart: (locationName: string) => void;
    onSetupNewLocation: () => void;
}

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
                <h2 className="text-xl font-bold text-gray-900 mb-6">Your Locations</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locationsData.map((location, index) => (
                        <LocationCard
                            key={index}
                            name={location.location_name}
                            lastUpdated={location.lastUpdated}
                            status={location.status}
                            sensorData={location.sensorData}
                            onViewDetails={() => onViewDetails(location.location_name)}
                            onToggleNotifications={() => onToggleNotifications(location.location_name)}
                            onViewChart={() => onViewChart(location.location_name)}
                        />
                    ))}
                    <AddNewLocationCard onSetupLocation={onSetupNewLocation} />
                </div>
            </div>
        </section>
    );
};

export default LocationsSection;