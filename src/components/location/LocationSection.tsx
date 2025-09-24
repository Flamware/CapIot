import React from 'react';
import {LocationData} from "./Props";
import LocationCard from "./locationCard";
import {useIsMobile} from "../hooks/useIsMobile.tsx";
import {Device} from "../types/device.ts";

export interface LocationsSectionProps {
    locationsData: LocationData[];
    onViewDeviceDetails: (device: Device) => void;
    onEditDeviceSettings: (device: Device) => void;
    onDeviceCommandSend?: (device: Device, command: string) => void;
    onDeviceScheduleSettings?: (device: Device) => void;
}

const LocationsSection: React.FC<LocationsSectionProps> = ({
                                                               locationsData,
                                                               onEditDeviceSettings,
                                                               onViewDeviceDetails,
    onDeviceCommandSend,
    onDeviceScheduleSettings,
                                                           }) => {
    useIsMobile(1100);
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