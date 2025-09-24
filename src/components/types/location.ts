// types/location.ts

import {Device} from "./device.ts";
import {Pagination} from "./pagination.ts";

export interface Location {
    location_id: number;
    location_name: string;
    location_description: string;
    site_id?: number | null;
    site_name?: string | null;
}

export interface Site {
    site_id: number;
    site_name: string;
    site_address: string;
}

export type SiteWithLocations = Site & {
    locations: Location[];
}

export type SiteWithLocationAndDevices = Site & {
    locations: LocationWithDevices[];
}

export type LocationWithDevices = Location & {
    devices: Device[];
}

export type LocationsResponse = Pagination & {
    data: Location[];
};

export type SitesResponse = Pagination & {
    data: Site[];
};

