import React, { useState } from 'react';
import { DeviceInfo } from '../location/Props';
import {RecurringSchedule} from "../types/schedule.tsx";
import {Day, RecurrenceType, WeeklySchedule} from "../types/types.tsx";
import ScheduleForm from "./schedule/ScheduleForm.tsx";
import 'react-calendar/dist/Calendar.css';

interface Props {
    isOpen: boolean;
    device: DeviceInfo;
    onClose: () => void;
    onSaveSchedule: (schedules: Partial<RecurringSchedule>[], deviceId: string) => void;
}

const DeviceScheduleSettingModal: React.FC<Props> = ({ isOpen, device, onClose, onSaveSchedule }) => {
    const [isExceptionMode, setIsExceptionMode] = useState(false);

    // Regular schedule states
    const [scheduleRecurrenceType, setScheduleRecurrenceType] = useState<RecurrenceType>('daily');
    const [dailySchedule, setDailySchedule] = useState({ start_hour: '09:00', end_hour: '17:00' });
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({
        mon: { isSelected: true, start: '09:00', end: '17:00' },
        tue: { isSelected: true, start: '09:00', end: '17:00' },
        wed: { isSelected: true, start: '09:00', end: '17:00' },
        thu: { isSelected: true, start: '09:00', end: '17:00' },
        fri: { isSelected: true, start: '09:00', end: '17:00' },
        sat: { isSelected: false, start: '', end: '' },
        sun: { isSelected: false, start: '', end: '' },
    });
    const [monthlySchedule, setMonthlySchedule] = useState({
        start_date: '',
        end_date: '',
        start_time: '09:00',
        end_time: '17:00',
    });
    const [selectedScheduleDateRange, setSelectedScheduleDateRange] = useState<Date[] | Date | null>(null);

    // Exception schedule states
    const [exceptionRecurrenceType, setExceptionRecurrenceType] = useState<RecurrenceType>('daily');
    const [dailyException, setDailyException] = useState({ start_hour: '00:00', end_hour: '23:59' });
    const [weeklyException, setWeeklyException] = useState<WeeklySchedule>({
        mon: { isSelected: false, start: '', end: '' },
        tue: { isSelected: false, start: '', end: '' },
        wed: { isSelected: false, start: '', end: '' },
        thu: { isSelected: false, start: '', end: '' },
        fri: { isSelected: false, start: '', end: '' },
        sat: { isSelected: true, start: '00:00', end: '23:59' },
        sun: { isSelected: true, start: '00:00', end: '23:59' },
    });
    const [monthlyException, setMonthlyException] = useState({
        start_date: '',
        end_date: '',
        start_time: '00:00',
        end_time: '23:59',
    });
    const [selectedExceptionDateRange, setSelectedExceptionDateRange] = useState<Date[] | Date | null>(null);

    const recurrenceTypes: RecurrenceType[] = ['daily', 'weekly', 'monthly', 'specific'];

    if (!isOpen) return null;

    // Determine which set of data to use based on the mode
    const currentRecurrenceType = isExceptionMode ? exceptionRecurrenceType : scheduleRecurrenceType;
    const currentDaily = isExceptionMode ? dailyException : dailySchedule;
    const currentWeekly = isExceptionMode ? weeklyException : weeklySchedule;
    const currentMonthly = isExceptionMode ? monthlyException : monthlySchedule;
    const currentSelectedDateRange = isExceptionMode ? selectedExceptionDateRange : selectedScheduleDateRange;
    const currentSetRecurrenceType = isExceptionMode ? setExceptionRecurrenceType : setScheduleRecurrenceType;

    // Define the onChange handlers based on the mode
    const currentOnChange = isExceptionMode ? {
        dailyStart: (e: any) => setDailyException(prev => ({ ...prev, start_hour: e.target.value })),
        dailyEnd: (e: any) => setDailyException(prev => ({ ...prev, end_hour: e.target.value })),
        toggleWeekDay: (day: Day) => setWeeklyException(prev => ({ ...prev, [day]: { ...prev[day], isSelected: !prev[day].isSelected } })),
        weeklyTimeChange: (day: Day, type: 'start' | 'end', value: string) => setWeeklyException(prev => ({ ...prev, [day]: { ...prev[day], [type]: value } })),
        monthlyDate: setSelectedExceptionDateRange,
        monthlyTimeChange: (e: any) => setMonthlyException(prev => ({ ...prev, [e.target.name]: e.target.value })),
    } : {
        dailyStart: (e: any) => setDailySchedule(prev => ({ ...prev, start_hour: e.target.value })),
        dailyEnd: (e: any) => setDailySchedule(prev => ({ ...prev, end_hour: e.target.value })),
        toggleWeekDay: (day: Day) => setWeeklySchedule(prev => ({ ...prev, [day]: { ...prev[day], isSelected: !prev[day].isSelected } })),
        weeklyTimeChange: (day: Day, type: 'start' | 'end', value: string) => setWeeklySchedule(prev => ({ ...prev, [day]: { ...prev[day], [type]: value } })),
        monthlyDate: setSelectedScheduleDateRange,
        monthlyTimeChange: (e: any) => setMonthlySchedule(prev => ({ ...prev, [e.target.name]: e.target.value })),
    };

    // Helper function to format a date string in YYYY-MM-DDTHH:mm:00Z format
    const formatDateForGo = (date: Date, time: string): string => {
        const [hour, minute] = time.split(':');
        const formattedDate = new Date(date);
        formattedDate.setHours(Number(hour), Number(minute), 0, 0);
        return formattedDate.toISOString();
    };

    const handleSave = () => {
        const schedulesToSave: Partial<RecurringSchedule>[] = [];
        const isException = isExceptionMode;

        const today = new Date();

        if (currentRecurrenceType === 'daily') {
            schedulesToSave.push({
                start_time: formatDateForGo(today, currentDaily.start_hour),
                end_time: formatDateForGo(today, currentDaily.end_hour),
                recurrence_rule: 'RRULE:FREQ=DAILY',
                is_exception: isException,
                schedule_name: `Daily: ${currentDaily.start_hour}-${currentDaily.end_hour}`,
            });
        } else if (currentRecurrenceType === 'weekly') {
            Object.entries(currentWeekly).forEach(([day, schedule]) => {
                if (schedule.isSelected) {
                    schedulesToSave.push({
                        start_time: formatDateForGo(today, schedule.start),
                        end_time: formatDateForGo(today, schedule.end),
                        recurrence_rule: `RRULE:FREQ=WEEKLY;BYDAY=${day.toUpperCase().substring(0,2)}`,
                        is_exception: isException,
                        schedule_name: `${day.charAt(0).toUpperCase() + day.slice(1)}: ${schedule.start}-${schedule.end}`,
                    });
                }
            });
        } else if (currentRecurrenceType === 'monthly') {
            if (currentSelectedDateRange && Array.isArray(currentSelectedDateRange) && currentSelectedDateRange.length === 2) {
                const [start, end] = currentSelectedDateRange;
                schedulesToSave.push({
                    start_time: formatDateForGo(start, currentMonthly.start_time),
                    end_time: formatDateForGo(end, currentMonthly.end_time),
                    start_date: start.toISOString(),
                    end_date: end.toISOString(),
                    recurrence_rule: `RRULE:FREQ=MONTHLY`,
                    is_exception: isException,
                    schedule_name: `Monthly from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
                });
            }
        } else if (currentRecurrenceType === 'specific') {
            if (currentSelectedDateRange) {
                const dates = Array.isArray(currentSelectedDateRange) ? currentSelectedDateRange : [currentSelectedDateRange];
                dates.forEach(date => {
                    schedulesToSave.push({
                        start_time: formatDateForGo(date, currentMonthly.start_time),
                        end_time: formatDateForGo(date, currentMonthly.end_time),
                        start_date: date.toISOString(),
                        end_date: date.toISOString(),
                        recurrence_rule: 'RRULE:FREQ=ONCE',
                        is_exception: isException,
                        schedule_name: `Specific day: ${date.toLocaleDateString()}`,
                    });
                });
            }
        }

        if (schedulesToSave.length > 0) {
            onSaveSchedule(schedulesToSave, device.device_id);
        } else {
            console.error("No schedules to save. Check your selected options.");
        }
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        Set {isExceptionMode ? 'Exception' : 'Regular'} Schedule for {device.device_id}
                    </h2>
                    <button onClick={onClose} className="text-3xl">&times;</button>
                </div>

                <div className="mb-4 flex justify-center">
                    <button
                        onClick={() => setIsExceptionMode(!isExceptionMode)}
                        className={`px-4 py-2 rounded-md text-white ${
                            isExceptionMode ? 'bg-green-600' : 'bg-red-600'
                        }`}
                    >
                        {isExceptionMode ? 'Back to Regular' : 'Add Exception'}
                    </button>
                </div>

                <div className="flex justify-center gap-4 mb-4">
                    {recurrenceTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => currentSetRecurrenceType(type)}
                            className={`px-4 py-2 rounded-md ${
                                currentRecurrenceType === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                            }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                <ScheduleForm
                    recurrenceType={currentRecurrenceType}
                    dailySchedule={currentDaily}
                    weeklySchedule={currentWeekly}
                    monthlySchedule={currentMonthly}
                    selectedDateRange={currentSelectedDateRange}
                    onChange={currentOnChange}
                    color={isExceptionMode ? "red" : "green"}
                    selectRange={isExceptionMode || (!isExceptionMode && currentRecurrenceType === 'monthly')}

                />

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-md bg-gray-200 text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-md bg-blue-600 text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeviceScheduleSettingModal;