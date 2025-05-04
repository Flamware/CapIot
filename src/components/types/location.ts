// types/location.ts

import {User} from "./user.ts";
import {Device} from "./device.ts";
import {Pagination} from "./pagination.ts";

export type Location = {
    location_id: number;
    location_name: string;
    location_description: string;
};


export type LocationWithUsersDevices = Device & User & Location

export type LocationsWithUsersDevicesResponse = Pagination & {
    data: LocationWithUsersDevices[];
};

export type LocationsResponse = Pagination & {
    data: Location[];
};