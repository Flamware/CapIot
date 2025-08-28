// src/components/location/Props.tsx
import {Location} from "../types/location.ts";
import {ComponentInfo} from "../types/device.ts";

export interface LocationsSectionProps {
    locationsData: LocationData[];
    onViewDetails: (locationName: string) => void;
    onToggleNotifications: (locationName: string) => void;
    onViewChart: (locationName: string) => void;
    onSetupNewLocation: () => void;
    onEditDeviceSettings: (device: DeviceInfo) => void;
}


export interface DeviceInfo {
    device_id: string;
    last_seen?: string;
    location?: Location; // Location might be fetched separately or included
    status?: string;
    created_at?: string;
    components?: ComponentInfo[]; // sensors might be fetched separately or included
}

export interface LocationData {
    location_id: number;
    location_name: string;
    location_description: string;
    devices: DeviceInfo[];
}