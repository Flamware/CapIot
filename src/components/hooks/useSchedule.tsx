import { useState, useCallback } from 'react';
import { RecurringSchedule } from '../types/schedule';
import { useApi } from './useApi';

export const useScheduleApi = () => {
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any | null>(null);

    const createRecurringSchedule = useCallback(async (deviceId: string, schedule: Partial<RecurringSchedule>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`/devices/${deviceId}/schedules`, schedule);
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            setError(err);
            throw err;
        }
    }, [api]);

    const getRecurringSchedules = useCallback(async (deviceId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<RecurringSchedule[]>(`/devices/${deviceId}/schedules`);
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            setError(err);
            throw err;
        }
    }, [api]);

    const updateRecurringSchedule = useCallback(async (deviceId: string, scheduleId: number, schedule: Partial<RecurringSchedule>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/devices/${deviceId}/schedules/${scheduleId}`, schedule);
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            setError(err);
            throw err;
        }
    }, [api]);

    const deleteRecurringSchedule = useCallback(async (deviceId: string, scheduleId: number) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/devices/${deviceId}/schedules/${scheduleId}`);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err);
            throw err;
        }
    }, [api]);

    return {
        loading,
        error,
        createRecurringSchedule,
        getRecurringSchedules,
        updateRecurringSchedule,
        deleteRecurringSchedule,
        setError,
    };
};