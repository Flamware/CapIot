import { Pagination } from "./pagination.ts";

export type Notification = {
    log_id: number;
    log_content: string;
    log_timestamp: string;
    log_read: boolean;
    site_id?: number | null;
    site_name?: string | null;
    location_id?: number | null;
    location_name?: string | null;
    component_name?: string | null;
    component_type?: string | null;
};

export type NotificationsResponse = Pagination & {
    data: Notification[];
};
