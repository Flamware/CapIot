import { useState, useCallback } from 'react';
import { RecurringSchedule } from '../types/schedule';
import { useApi } from './useApi';

export const useScheduleApi = () => {
    const api = useApi();
    const [loading, setLoading] = useState(false);

    const createRecurringSchedule = useCallback(async (deviceID: string, schedule: Partial<RecurringSchedule>) => {
        setLoading(true);
        try {
            const response = await api.post(`/devices/${deviceID}/schedules`, schedule);
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            throw err;
        }
    }, [api]);

    const getRecurringSchedules = useCallback(async (deviceID: string) => {
        setLoading(true);
        try {
            const response = await api.get<RecurringSchedule[]>(`/devices/${deviceID}/schedules`);
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            throw err;
        }
    }, [api]);

    const updateRecurringSchedule = useCallback(async (deviceID: string, scheduleId: number, schedule: Partial<RecurringSchedule>) => {
        setLoading(true);
        try {
            const response = await api.put(`/devices/${deviceID}/schedules/${scheduleId}`, schedule);
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            throw err;
        }
    }, [api]);

    const deleteRecurringSchedule = useCallback(async (deviceID: string, scheduleId: number) => {
        setLoading(true);
        try {
            await api.delete(`/devices/${deviceID}/schedules/${scheduleId}`);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            throw err;
        }
    }, [api]);

    return {
        loading,
        createRecurringSchedule,
        getRecurringSchedules,
        updateRecurringSchedule,
        deleteRecurringSchedule,
    };
};