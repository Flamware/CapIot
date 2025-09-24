// src/components/location/Props.tsx
import {Device} from "../types/device.ts";

export interface LocationData {
    location_id: number;
    location_name: string;
    location_description: string;
    devices: Device[];
}