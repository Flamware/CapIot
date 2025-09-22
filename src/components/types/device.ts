import { Pagination } from "./pagination.ts";
import { Location } from "./location.ts";
import { ReadingPoint } from "../history/DataGraph.tsx";

export interface Site {
    site_id: number;
    site_name: string;
    site_address?: string;
}

export enum ComponentType {
    Sensor = "sensor",
    Actuator = "actuator",
    Indicator = "indicator"
}

export enum ComponentSubtype {
    Temperature = "temperature",
    Humidity = "humidity",
    Fan = "fan",
    LED = "LED"
}

export interface Component {
    component_id: string;
    component_type: ComponentType;
    component_subtype?: ComponentSubtype;
    max_running_hours?: number;
    min_threshold?: number;
    max_threshold?: number;
    current_running_hours: number;
}

export interface Device {
    device_id: string;
    components: Component[];
    last_seen?: Date;
    created_at?: string;
    status?: string;
    location?: Location;
    current: number;
    voltage: number;
    power: number;
}

export type DeviceWithComponentsAndLocation = Device & {
    location: Location;
}

export type DevicesLocationsResponse = Pagination & {
    data: DeviceWithComponentsAndLocation[];
}

export type DevicesWithLocation = Device & {
    location: Location; // now includes site inside location
}
export interface DeviceReadings {
    deviceID: string;
    readings: {
        [key: string]: ReadingPoint[];
    };
}
