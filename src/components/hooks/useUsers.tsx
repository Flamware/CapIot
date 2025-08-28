import { useState, useCallback } from 'react';
import { User } from "@auth0/auth0-react";
import {createApi} from "../../axios/api.tsx";
import {UsersLocationsResponse, UserWithLocations} from "../types/user.ts";
import {Pagination} from "../types/pagination.ts";

export function useUsersApi() {
    const api = createApi();
    const [usersLocations, setUsersLocations] = useState<UserWithLocations[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<any | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
    });

    const fetchUsers = useCallback(async (page: number, limit: number, query?: string) => {
        setLoading(true);
        setApiError(null);
        try {
            const response = await api.get<UsersLocationsResponse>(`/admin/users-locations`, {
                params: { page, limit, search: query },
            });
            setUsersLocations(response.data.data || []);
            setPagination({
                currentPage: response.data.currentPage,
                pageSize: response.data.pageSize,
                totalItems: response.data.totalItems,
                totalPages: response.data.totalPages,
            });
        } catch (error: any) {
            setApiError(error);
        } finally {
            setLoading(false);
        }
    }, [api]);

    const addUser = useCallback(async (userData: Partial<Omit<User, 'id' | 'createdAt' | 'roles'>>) => {
        setLoading(true);
        setApiError(null);
        try {
            await api.post('/admin/users', userData);
            await fetchUsers(1, pagination.pageSize);
        } catch (error: any) {
            setApiError(error);
        } finally {
            setLoading(false);
        }
    }, [api, fetchUsers, pagination.pageSize]);

    const updateUser = useCallback(async (id: string, userData: { name?: string; locations?: number[] }) => {
        setLoading(true);
        setApiError(null);
        try {
            await api.put(`/admin/users/${id}`, userData);
            await fetchUsers(pagination.currentPage, pagination.pageSize);
        } catch (error: any) {
            setApiError(error);
        } finally {
            setLoading(false);
        }
    }, [api, fetchUsers, pagination.currentPage, pagination.pageSize]);

    const deleteUser = useCallback(async (id: string) => {
        setLoading(true);
        setApiError(null);
        try {
            await api.delete(`/admin/users/${id}`);
            setUsersLocations(prev => prev.filter(user => user.id !== id));
            setPagination(prev => ({
                ...prev,
                totalItems: prev.totalItems - 1,
                totalPages: Math.ceil((prev.totalItems - 1) / prev.pageSize),
            }));
        } catch (error: any) {
            setApiError(error);
        } finally {
            setLoading(false);
        }
    }, [api]);

    return {
        usersLocations,
        loading,
        apiError,
        pagination,
        setPagination,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser,
        setApiError,
    };
}
