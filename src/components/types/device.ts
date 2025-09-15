import { Pagination } from "./pagination.ts";
import {Location} from "./location.ts";

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
    current_running_hours?: number;
}

export interface Device {
    device_id: string;
    components: Component[];
    last_seen?: string;       // <-- make optional
    created_at?: string;      // <-- make optional
    status?: string;          // <-- make optional
    location?: Location;      // <-- make optional
}

export type DeviceComponent = {
    device_id: string;
    component_id: string;
    installation_date: string;
    expiry_date?: string;
}

export type ComponentLog = {
    log_id: number;
    component_id: string;
    log_timestamp: string;
    log_content: string;
    log_read: boolean;
}

export type DeviceWithComponentsAndLocation = Device & {
    location: Location;
}

export type DevicesLocationsResponse = Pagination & {
    data: DeviceWithComponentsAndLocation[];
}

export type ComponentInfo = {
    component_id: string;
    component_type: ComponentType;
    component_subtype?: ComponentSubtype;
    min_threshold?: number;
    max_threshold?: number;
    max_running_hours?: number;
    current_running_hours: number;
}

export type DevicesWithLocation = Device & {
    location: Location; // now includes site inside location
}
