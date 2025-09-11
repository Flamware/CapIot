import React from 'react';
import { LocationsSectionProps } from "./Props";
import LocationCard from "./locationCard";

const LocationsSection: React.FC<LocationsSectionProps> = ({
                                                               locationsData,
                                                               onEditDeviceSettings,
                                                               onViewDeviceDetails,
    onDeviceCommandSend
                                                           }) => {

    if (!locationsData || locationsData.length === 0) {
        return (
            <div className="text-center py-10 text-gray-600 text-lg">
                Aucun lieu trouvé. Veuillez ajouter un site ou un emplacement.
            </div>
        );
    }

    return (

                <div className="flex    gap-6">
                    {locationsData.map((location) => (
                        <LocationCard
                            key={location.location_id}
                            location_name={location.location_name}
                            devices={location.devices}
                            lastUpdated={''}
                            status={''}
                            // Pass down both handler props to LocationCard
                            onEditDeviceSettings={(device) => onEditDeviceSettings(device)}
                            onViewDeviceDetails={(device) => onViewDeviceDetails(device)}
                            onDeviceCommandSend={onDeviceCommandSend}
                        />
                    ))}
                </div>
    );
};

export default LocationsSection;