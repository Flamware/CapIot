import {useState} from "react";
import { Notification, NotificationsResponse } from "../types/notification.ts";
import {useApi} from "./useApi.tsx";

export function useNotifications(deviceId?: string) {
       const api = useApi();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
    });

    const fetchNotifications = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const response = await api.get<NotificationsResponse>("/notifications", {
                params: { page, limit },
            });
            setNotifications(response.data.data || []);
            setPagination({
                currentPage: response.data.currentPage,
                pageSize: response.data.pageSize,
                totalItems: response.data.totalItems,
                totalPages: response.data.totalPages,
            });
        } catch (error: any) {
            console.error("Authentication expired. The interceptor is handling the logout.");
            console.log(error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDeviceNotification = async (page: number, limit: number) => {
    setLoading(true);
    if (!deviceId) {
        setNotifications([]);
        setPagination({
            currentPage: 1,
            pageSize: limit,
            totalItems: 0,
            totalPages: 1,
        });
        setLoading(false);
        return;
    }
    try {
        const response = await api.get<NotificationsResponse>(`/notifications/device/${deviceId}`, {
            params: { page, limit },
        });
        setNotifications(response.data.data || []);
        setPagination({
            currentPage: response.data.currentPage,
            pageSize: response.data.pageSize,
            totalItems: response.data.totalItems,
            totalPages: response.data.totalPages,
        });
    } catch (error: any) {
        console.error("Authentication expired. The interceptor is handling the logout.");
        console.log(error);
        setNotifications([]);
    } finally {
        setLoading(false);
    }
};

    const markAsRead = async (notificationID: number) => {
        try {
            const notificationToUpdate = notifications.find(n => n.log_id === notificationID);

            // Only proceed if the notification exists and is currently unread
            if (notificationToUpdate && !notificationToUpdate.log_read) {
                await api.patch(`/notifications/${notificationID}`);

                // Update local state and decrement totalItems
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.log_id === notificationID ? { ...n, log_read: true } : n
                    )
                );

                setPagination((prev) => ({
                    ...prev,
                    totalItems: Math.max(0, prev.totalItems - 1),
                }));
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch("/notifications/mark-all-read");
            // Update local state and set totalItems to 0
            setNotifications((prev) => prev.map((n) => ({ ...n, log_read: true })));
            setPagination((prev) => ({
                ...prev,
                totalItems: 0,
            }));
        } catch (err: any) {
            console.error("Failed to mark all notifications as read:", err);
        }
    };

    const deleteNotification = async (notificationID: number) => {
        try {
            await api.delete(`/notifications/${notificationID}`);
            // Check if the deleted notification was unread
            const wasUnread = notifications.find(n => n.log_id === notificationID)?.log_read === false;

            // Update local state
            setNotifications((prev) => prev.filter((n) => n.log_id !== notificationID));

            // Decrement totalItems only if the deleted notification was unread
            if (wasUnread) {
                setPagination((prev) => ({
                    ...prev,
                    totalItems: Math.max(0, prev.totalItems - 1),
                }));
            }
        }
        catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const deleteAllNotifications = async () => {
        try {
            await api.delete("/notifications/delete-all");
            // Update local state and set totalItems to 0
            setNotifications([]);
            setPagination((prev) => ({
                ...prev,
                totalItems: 0,
            }));
        }
        catch (error) {
            console.error("Failed to delete all notifications:", error);
        }
    };

    return {
        notifications,
        loading,
        pagination,
        setPagination,
        fetchNotifications,
        deleteNotification,
        deleteAllNotifications,
        fetchDeviceNotification,
        markAsRead,
        markAllAsRead,
    };
}