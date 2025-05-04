import { useState, useEffect, useCallback } from 'react';
import {UsersLocationsResponse, UserWithLocations} from "../../components/types/user.ts";
import {Pagination} from "../../components/types/pagination.ts";
import {createApi} from "../../axios/api.tsx";
import {User} from "@auth0/auth0-react";
import {UserListHeader} from "../../components/admin/user/UserListHeader.tsx";
import {ApiErrorModal} from "../../components/ApiErrorModal.tsx";
import {UserTable} from "../../components/admin/user/UserTable.tsx";
import {PaginationControls} from "../../components/admin/PaginationControls.tsx";
import {AddUserModal} from "../../components/admin/user/AddUserModal.tsx";

export function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [, setIsEditUserOpen] = useState(false);
    const [, setCurrentUser] = useState<UserWithLocations | null>(null);
    const [usersLocations, setUsersLocations] = useState<UserWithLocations[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<any | null>(null);
    const [isApiErrorModalOpen, setIsApiErrorModalOpen] = useState(false);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
    });
    const api = createApi();
    const [, setNewUser] = useState<Partial<Omit<User, 'id' | 'createdAt' | 'roles'>>>({
        name: '',
    });

    const fetchUsers = useCallback(async (page: number, limit: number, query?: string) => {
        setLoading(true);
        setApiError(null);
        setIsApiErrorModalOpen(false);
        try {
            const response = await api.get<UsersLocationsResponse>(`/admin/users-locations`, {
                params: {
                    page: page,
                    limit: limit,
                    search: query,
                },
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
            setIsApiErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [api]);

    const addUser = useCallback(async (userData: Partial<Omit<User, 'id' | 'createdAt' | 'roles'>>) => {
        setLoading(true);
        setApiError(null);
        setIsApiErrorModalOpen(false);
        try {
            await api.post('/admin/users', userData);
            fetchUsers(1, pagination.pageSize, searchTerm); // Refetch after adding
        } catch (error: any) {
            setApiError(error);
            setIsApiErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [api, fetchUsers, pagination.pageSize, searchTerm]);

    const updateUser = useCallback(async (id: string, userData: { name?: string; locations?: number[] }) => {
        setLoading(true);
        setApiError(null);
        setIsApiErrorModalOpen(false);
        try {
            await api.put(`/admin/users/${id}`, userData);
            fetchUsers(pagination.currentPage, pagination.pageSize, searchTerm); // Refetch after updating
        } catch (error: any) {
            setApiError(error);
            setIsApiErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [api, fetchUsers, pagination.currentPage, pagination.pageSize, searchTerm]);

    const deleteUser = useCallback(async (id: string) => {
        setLoading(true);
        setApiError(null);
        setIsApiErrorModalOpen(false);
        try {
            await api.delete(`/admin/users/${id}`);
            setUsersLocations(prev => prev.filter(user => user.id !== id));
            setPagination(prev => ({ ...prev, totalItems: prev.totalItems - 1, totalPages: Math.ceil((prev.totalItems - 1) / prev.pageSize) }));
        } catch (error: any) {
            setApiError(error);
            setIsApiErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchUsers(pagination.currentPage, pagination.pageSize, searchTerm);
    }, [pagination.currentPage, pagination.pageSize, searchTerm]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const openAddUserModal = () => {
        setIsAddUserOpen(true);
        setNewUser({ name: '' });
    };

    const closeAddUserModal = () => {
        setIsAddUserOpen(false);
    };

    const handleAddUserSubmit = (userData: { name: string }) => {
        addUser(userData);
        closeAddUserModal();
    };
    const closeEditDialog = () => {
        setIsEditUserOpen(false);
        setCurrentUser(null);
    };

    // Corrected signature to accept id, name, and locations as separate arguments
    const handleEditUserSubmit = (id: string, name: string, locations: number[]) => {
        // Call updateUser with the provided arguments
        updateUser(id, { name, locations });
        closeEditDialog()
    };

    const handleDeleteUserClick = (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            deleteUser(id);
        }
    };

    const goToPage = (page: number) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handleCloseErrorModal = () => {
        setIsApiErrorModalOpen(false);
        setApiError(null);
    };

    if (loading) {
        return <div>Chargement des utilisateurs...</div>;
    }

    return (
        <div className="space-y-4">
            <UserListHeader searchTerm={searchTerm} onSearch={handleSearch} onAddUser={openAddUserModal} />
            <ApiErrorModal isOpen={isApiErrorModalOpen} error={apiError} onClose={handleCloseErrorModal} />

            <div className="rounded-md border">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôles</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <UserTable users={usersLocations} onDelete={handleDeleteUserClick} onUserUpdated={handleEditUserSubmit} />
                </table>
            </div>

            <PaginationControls pagination={pagination} onGoToPage={goToPage}
                                onGoToPreviousPage={() => goToPage(pagination.currentPage - 1)}
                                onGoToNextPage={() => goToPage(pagination.currentPage + 1)}
            />

            <AddUserModal isOpen={isAddUserOpen} onClose={closeAddUserModal} onAdd={handleAddUserSubmit} />
        </div>
    );
}