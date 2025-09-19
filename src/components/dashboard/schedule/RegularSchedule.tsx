// src/components/schedule/RegularSchedule.tsx

import React from 'react';
import { Day, RecurrenceType, WeeklySchedule } from "../../types/types.tsx";
import ScheduleForm from './ScheduleForm.tsx';

interface Props {
    scheduleRecurrenceType: RecurrenceType;
    dailySchedule: { start_hour: string; end_hour: string };
    weeklySchedule: WeeklySchedule;
    monthlySchedule: { start_date: string; end_date: string; start_time: string; end_time: string };
    selectedScheduleDateRange: Date[] | Date | null;
    onChange: {
        dailyStart: (e: React.ChangeEvent<HTMLInputElement>) => void;
        dailyEnd: (e: React.ChangeEvent<HTMLInputElement>) => void;
        toggleWeekDay: (day: Day) => void;
        weeklyTimeChange: (day: Day, type: 'start' | 'end', value: string) => void;
        monthlyDate: (value: Date[] | Date | null) => void;
        monthlyTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
}

const RegularSchedule: React.FC<Props> = ({
                                              scheduleRecurrenceType,
                                              dailySchedule,
                                              weeklySchedule,
                                              monthlySchedule,
                                              selectedScheduleDateRange,
                                              onChange,
                                          }) => {
    return (
        <ScheduleForm
            recurrenceType={scheduleRecurrenceType}
            dailySchedule={dailySchedule}
            weeklySchedule={weeklySchedule}
            monthlySchedule={monthlySchedule}
            selectedDateRange={selectedScheduleDateRange}
            onChange={onChange}
            color="green"
            selectRange={scheduleRecurrenceType === 'monthly'}
        />
    );
};

export default RegularSchedule;