import {Pagination} from "./pagination.ts";
import {Location} from "./location.ts";

export interface sensorInfo {
    sensor_id: string;
    sensor_type: string;
    min_threshold?: number;
    max_threshold?: number;
}


export type Device = {
    device_id: string
    last_seen : string
    status    : string
    created_at : string
    sensors  : sensorInfo[]
}


export type DevicesWithLocation = Device & {
    location: Location
}

export type DevicesLocationsResponse = Pagination & {
    data: DevicesWithLocation[]
}