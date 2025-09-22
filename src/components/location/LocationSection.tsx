import React from 'react';
import {DeviceInfo, LocationData} from "./Props";
import LocationCard from "./locationCard";
import {useIsMobile} from "../hooks/useIsMobile.tsx";

export interface LocationsSectionProps {
    locationsData: LocationData[];
    onViewDeviceDetails: (device: DeviceInfo) => void;
    onEditDeviceSettings: (device: DeviceInfo) => void;
    onDeviceCommandSend?: (device: DeviceInfo, command: string) => void;
    onDeviceScheduleSettings?: (device: DeviceInfo) => void;
}

const LocationsSection: React.FC<LocationsSectionProps> = ({
                                                               locationsData,
                                                               onEditDeviceSettings,
                                                               onViewDeviceDetails,
    onDeviceCommandSend,
    onDeviceScheduleSettings,
                                                           }) => {

    const isMobile = useIsMobile(1100);
    if (!locationsData || locationsData.length === 0) {
        return (
            <div className="text-center py-10 text-gray-600 text-lg">
                Aucun lieu trouvé. Veuillez ajouter un site ou un emplacement.
            </div>
        );
    }

    return (

                <div className="flex    ">
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
                            onDeviceScheduleSettings={onDeviceScheduleSettings}
                        />
                    ))}
                </div>
    );
};

export default LocationsSection;