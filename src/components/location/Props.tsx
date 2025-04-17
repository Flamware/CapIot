// src/components/location/Props.tsx
export interface LocationsSectionProps {
    locationsData: LocationData[];
    onViewDetails: (locationName: string) => void;
    onToggleNotifications: (locationName: string) => void;
    onViewChart: (locationName: string) => void;
    onSetupNewLocation: () => void;
}

export interface CaptorInfo {
    captor_id: string;
    captor_type: string;

}

export interface DeviceInfo {
    device_id: string;
    last_seen?: string;
    status?: string;
    created_at?: string;
    captors?: CaptorInfo[]; // Captors might be fetched separately or included
}

export interface LocationData {
    id: number;
    location_name: string;
    location_description: string;
    devices: DeviceInfo[];
}