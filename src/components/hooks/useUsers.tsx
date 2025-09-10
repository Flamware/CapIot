import { useState, useCallback } from 'react';
import { User } from "@auth0/auth0-react";
import { createApi } from "../../axios/api.tsx";
import { UsersLocationsResponse, UserWithLocations } from "../types/user.ts";
import { Pagination } from "../types/pagination.ts";
import { Site } from "../types/location.ts";

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

    const fetchMe = useCallback(async (): Promise<User | null> => {
        setLoading(true);
        setApiError(null);
        try {
            const response = await api.get<User>(`/users/me`);
            return response.data;
        } catch (error: any) {
            setApiError(error);
            return null;
        } finally {
            setLoading(false);
        }
    }
    , [api]);

    const fetchUsers = useCallback(async (page: number, limit: number, query?: string) => {
        setLoading(true);
        setApiError(null);
        try {
            const response = await api.get<UsersLocationsResponse>(`/admin/users`, {
                params: { page, limit, search: query },
            });
            setUsersLocations(response.data.data || []);
            setPagination({
                currentPage: response.data.currentPage,
                pageSize: response.data.pageSize,
                totalItems: response.data.totalItems,
                totalPages: response.data.totalPages,
            });
            return response.data; // Return data for use in other functions
        } catch (error: any) {
            setApiError(error);
            // Don't rethrow or call fetchUsers again
        } finally {
            setLoading(false);
        }
    }, []);

    const addUser = useCallback(async (userData: Partial<Omit<User, 'id' | 'createdAt' | 'roles'>>) => {
        setLoading(true);
        setApiError(null);
        try {
            await api.post('/admin/users', userData);
            // Only refetch if the operation was successful
            await fetchUsers(1, pagination.pageSize);
        } catch (error: any) {
            setApiError(error);
            // No re-render loop here, as we don't call fetchUsers again on error
        } finally {
            setLoading(false);
        }
    }, [api, fetchUsers, pagination.pageSize]);

    const updateUser = useCallback(async (id: string, userData: { name?: string; sites?: number[] }) =>  {
        setLoading(true);
        setApiError(null);
        try {
            await api.put(`/admin/users/${id}`, userData);
            // Only refetch if the operation was successful
            await fetchUsers(pagination.currentPage, pagination.pageSize);
        } catch (error: any) {
            setApiError(error);
            // No re-render loop here
        } finally {
            setLoading(false);
        }
    }, [api, fetchUsers, pagination.currentPage, pagination.pageSize]);

    const updateMe = useCallback(async (userData: { name?: string; }) =>  {
        setLoading(true);
        setApiError(null);
        try {
            const response = await api.put(`/users/me`, userData);
            return response.data; // Return updated user from API
        } catch (error: any) {
            setApiError(error);
            // Throw the error so calling component can handle it
            throw error;
        } finally {
            setLoading(false);
        }
    }, [api]);



    const deleteUser = useCallback(async (id: string) => {
        setLoading(true);
        setApiError(null);
        try {
            await api.delete(`/admin/users/${id}`);
            // Use a functional update to avoid stale state issues
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

    const fetchUserSites = useCallback(async (userId: string) => {
        try {
            const response = await api.get<Site[]>(`/admin/users/${userId}/sites`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user sites:", error);
            setApiError(error);
            return [];
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
        updateMe,
        deleteUser,
        setApiError,
        fetchUserSites,
        fetchMe
    };
}