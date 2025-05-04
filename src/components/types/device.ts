import {Pagination} from "./pagination.ts";
import {Location} from "./location.ts";

export interface CaptorInfo {
    captor_id: string;
    captor_type: string;
}

export type Device = {
    device_id: string
    last_seen : string
    status    : string
    created_at : string
    captors  : CaptorInfo[]
}


export type DevicesWithLocation = Device & {
    location: Location
}

export type DevicesLocationsResponse = Pagination & {
    data: DevicesWithLocation[]
}