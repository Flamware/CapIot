// src/components/location/Props.tsx
import {Location} from "../types/location.ts";
import {Component} from "../types/device.ts";
import {RecurringSchedule} from "../types/schedule.tsx";



export interface DeviceInfo {
    device_id: string;
    last_seen: Date;
    location?: Location; // Location might be fetched separately or included
    status?: string;
    created_at?: string;
    components?: Component[]; // sensors might be fetched separately or included
    schedule?: RecurringSchedule[]; // schedules might be fetched separately or included
}

export interface LocationData {
    location_id: number;
    location_name: string;
    location_description: string;
    devices: DeviceInfo[];
}