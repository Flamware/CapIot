// Add new types for schedules and exceptions
export interface RecurringSchedule {
    recurring_schedule_id: number;
    schedule_name: string;
    start_time: string;
    end_time: string;
    recurrence_rule: string;
    is_exception: boolean;
}


