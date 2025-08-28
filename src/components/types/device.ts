import { Pagination } from "./pagination.ts";
import { Location } from "./location.ts";

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
    min_threshold?: number;
    max_threshold?: number;
}

export type Device = {
    device_id: string
    last_seen: string
    status: string
    created_at: string
    components: Component[]
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
    location: Location
}

export type DevicesLocationsResponse = Pagination & {
    data: DeviceWithComponentsAndLocation[]
}

export type ComponentInfo ={
    component_id: string;
    component_type: ComponentType;
    component_subtype?: ComponentSubtype;
    component_status?: string;
    min_threshold?: number;
    max_threshold?: number;
    max_running_hours?: number;
}

export type DevicesWithLocation = Device & {
    location: Location
}