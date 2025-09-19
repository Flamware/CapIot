import { Day } from '../components/types/types';

// Convert a Date or Date[] to start/end ISO strings
export const normalizeDateRange = (value: Date[] | Date | null): [Date, Date] | null => {
    if (!value) return null;
    if (Array.isArray(value)) return [value[0], value[1] ?? value[0]];
    return [value, value];
};

export const formatISODate = (date: Date, time?: string) =>
    `${date.toISOString().split('T')[0]}${time ? `T${time}:00Z` : ''}`;

export const getRRuleDay = (day: Day) => day.substring(0, 2).toUpperCase();
