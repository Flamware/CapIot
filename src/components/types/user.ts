import { Location,Site } from "./location.ts";
import { Pagination } from "./pagination.ts"; // Assuming you have a Pagination type

export type User = {
    id: string;
    name: string;
    roles: string[];
};

export type UserWithLocations = User & {
    locations?: Location[];
};

export type UsersLocationsResponse = Pagination & { // Using intersection for cleaner extension
    data: UserWithLocations[];
};

export type UserWithSites = User &{
    sites: Site[];
};
