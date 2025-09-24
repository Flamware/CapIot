import { PaginationControls } from "../components/admin/PaginationControls.tsx";
import { useNotifications } from "../components/hooks/useNotifications.tsx";
import { BellRing, Loader2, Trash2, CheckCircle, MailOpen } from "lucide-react";
import { useEffect, useState } from "react";
import {useApiError} from "../components/hooks/useApiError.tsx";

const NotificationsPage = () => {
    const {
        fetchNotifications,
        notifications,
        loading,
        pagination,
        setPagination,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications
    } = useNotifications();

    const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
    const { showError } = useApiError();

    // fetch notifications when pagination changes
    useEffect(() => {
        const loadNotifications = async () => {
            try {
                await fetchNotifications(pagination.currentPage, pagination.pageSize);
            } catch (err) {
                showError(err);
            }
        };
        loadNotifications();
    }, [pagination.currentPage, pagination.pageSize]);

    const handleGoToPage = (page: number) =>
        setPagination((prev) => ({ ...prev, currentPage: page }));

    const handleGoToPreviousPage = () =>
        setPagination((prev) => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }));

    const handleGoToNextPage = () =>
        setPagination((prev) => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }));

    const toggleSelectNotification = (id: number) => {
        setSelectedNotifications((prev) =>
            prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedNotifications.length === 0) return;
        try {
            await Promise.all(selectedNotifications.map(id => deleteNotification(id)));
            setSelectedNotifications([]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllNotifications();
            setSelectedNotifications([]);
        } catch (err) {
            console.error(err);
        }
    };

    const renderNotifications = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin h-16 w-16 text-green-500" />
                </div>
            );
        }

        if (notifications.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <BellRing className="w-16 h-16 mb-6 text-green-400" />
                    <p className="text-xl font-medium">Aucune nouvelle notification.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {notifications.map((notification) => {
                    const isSelected = selectedNotifications.includes(notification.log_id);
                    return (
                        <div
                            key={notification.log_id}
                            className={`p-5 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all duration-300 ${
                                isSelected ? "bg-green-100 border-green-500 shadow-lg" : ""
                            } ${
                                notification.log_read
                                    ? "bg-white border-gray-200 hover:bg-gray-50"
                                    : "bg-green-50 border-green-200 shadow-md hover:bg-green-100"
                            }`}
                            onClick={() => toggleSelectNotification(notification.log_id)}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    toggleSelectNotification(notification.log_id);
                                }}
                                className="form-checkbox h-5 w-5 text-green-600 rounded-md border-gray-300 focus:ring-green-500"
                            />
                            <div
                                className={`h-3 w-3 rounded-full flex-shrink-0 ${
                                    notification.log_read ? "bg-gray-400" : "bg-green-600"
                                }`}
                            ></div>
                            <div className="flex-grow flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className={`text-base font-semibold ${notification.log_read ? "text-gray-600" : "text-gray-900"}`}>
                                        {notification.component_name} de {notification.site_name}
                                    </h3>
                                    <span className="text-sm text-gray-400">
                                        {new Date(notification.log_timestamp).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <p className={`text-sm ${notification.log_read ? "text-gray-500" : "text-gray-700 font-medium"}`}>
                                    {notification.log_content}
                                </p>
                                {notification.location_name && (
                                    <span className="text-xs text-gray-400 mt-1">
                                        Lieu : {notification.location_name}
                                    </span>
                                )}
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2">
                                {!notification.log_read && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.log_id);
                                        }}
                                        className="p-2 text-green-600 hover:text-green-800 transition-colors"
                                        title="Marquer comme lu"
                                    >
                                        <MailOpen className="h-5 w-5" />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.log_id);
                                    }}
                                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                                    title="Supprimer"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className=" max-w-7xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 bg-white border border-green-500 rounded-lg hover:bg-green-50 transition-colors"
                    >
                        <CheckCircle className="h-4 w-4" />
                        <span>Marquer tout comme lu</span>
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDeleteSelected}
                            disabled={selectedNotifications.length === 0}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 bg-white border border-red-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Supprimer sélectionné</span>
                        </button>
                        <button
                            onClick={handleDeleteAll}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Supprimer tout</span>
                        </button>
                    </div>
            </div>

            {renderNotifications()}

            <div className="mt-8">
                <PaginationControls
                    pagination={pagination}
                    onGoToPage={handleGoToPage}
                    onGoToPreviousPage={handleGoToPreviousPage}
                    onGoToNextPage={handleGoToNextPage}
                />
            </div>
        </div>
    );
};

export default NotificationsPage;