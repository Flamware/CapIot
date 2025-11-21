export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'specific';

export interface TimeRange {
    start: string;
    end: string;
}

export type WeeklySchedule = {
    [key in Day]: { isSelected: boolean; start: string; end: string };
};
