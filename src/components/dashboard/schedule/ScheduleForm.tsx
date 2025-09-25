// src/components/schedule/ScheduleForm.tsx

import React from 'react';
import Calendar from 'react-calendar';
import { Day, RecurrenceType, WeeklySchedule } from '../../types/types.tsx';
import 'react-calendar/dist/Calendar.css';

interface Props {
    recurrenceType: RecurrenceType;
    dailySchedule: { start_hour: string; end_hour: string };
    weeklySchedule: WeeklySchedule;
    monthlySchedule: { start_time: string; end_time: string };
    selectedDateRange: Date[] | Date | null;
    onChange: any;
    color: 'green' | 'red';
    selectRange: boolean;
}

const ScheduleForm: React.FC<Props> = ({
                                           recurrenceType,
                                           dailySchedule,
                                           weeklySchedule,
                                           monthlySchedule,
                                           onChange,
                                           color,
                                       }) => {
    const days: Day[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    const primaryColorClass = `bg-${color}-600`;
    const ringColorClass = `focus:ring-${color}-500`;

    // State for the "All Day" button
    const [isAllDay, setIsAllDay] = React.useState(false);

    // Function to handle the "All Day" button click
    const handleAllDayClick = () => {
        const newIsAllDay = !isAllDay;
        setIsAllDay(newIsAllDay);

        // Call the setAllDay function from the parent
        if (newIsAllDay) {
            onChange.setAllDay('00:00', '23:59');
        } else {
            // Optional: reset times when toggling off
            onChange.setAllDay('', '');
        }
    };
    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
            {recurrenceType === 'daily' && (
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <label className="text-gray-700 font-medium">Heure de début:</label>
                    <input
                        type="time"
                        value={dailySchedule.start_hour}
                        onChange={onChange.dailyStart}
                        disabled={isAllDay}
                        className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${ringColorClass} focus:border-transparent transition duration-150 ease-in-out ${isAllDay ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                    />
                    <label className="text-gray-700 font-medium">Heure de fin:</label>
                    <input
                        type="time"
                        value={dailySchedule.end_hour}
                        onChange={onChange.dailyEnd}
                        disabled={isAllDay}
                        className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${ringColorClass} focus:border-transparent transition duration-150 ease-in-out ${isAllDay ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                    />
                </div>
            )}

            {recurrenceType === 'weekly' && (
                <div className="space-y-4">
                    {days.map(day => (
                        <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-white rounded-lg shadow-sm">
                            <button
                                type="button"
                                onClick={() => onChange.toggleWeekDay(day)}
                                className={`w-full sm:w-24 text-center px-4 py-2 font-medium rounded-lg border transition duration-150 ease-in-out ${
                                    weeklySchedule[day].isSelected ? `${primaryColorClass} text-white border-transparent` : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                                }`}
                            >
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </button>
                            {weeklySchedule[day].isSelected && (
                                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                    <label className="text-gray-700">Début:</label>
                                    <input
                                        type="time"
                                        value={weeklySchedule[day].start}
                                        onChange={e => onChange.weeklyTimeChange(day, 'start', e.target.value)}
                                        className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${ringColorClass} focus:border-transparent transition duration-150 ease-in-out`}
                                    />
                                    <label className="text-gray-700">Fin:</label>
                                    <input
                                        type="time"
                                        value={weeklySchedule[day].end}
                                        onChange={e => onChange.weeklyTimeChange(day, 'end', e.target.value)}
                                        className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${ringColorClass} focus:border-transparent transition duration-150 ease-in-out`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {(recurrenceType === 'monthly' || recurrenceType === 'specific') && (
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-lg shadow-lg">
                        <Calendar
                            onChange={onChange.monthlyDate}
                            selectRange={recurrenceType === 'monthly'}
                            className="w-full max-w-sm font-sans"
                            allowPartialRange={recurrenceType === 'monthly'}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <div className="flex items-center gap-2">
                            <label className="text-gray-700">Heure de début:</label>
                            <input
                                type="time"
                                name="start_time"
                                value={monthlySchedule.start_time}
                                onChange={onChange.monthlyTimeChange}
                                disabled={isAllDay}
                                className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${ringColorClass} focus:border-transparent transition duration-150 ease-in-out ${isAllDay ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-gray-700">Heure de fin:</label>
                            <input
                                type="time"
                                name="end_time"
                                value={monthlySchedule.end_time}
                                onChange={onChange.monthlyTimeChange}
                                disabled={isAllDay}
                                className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${ringColorClass} focus:border-transparent transition duration-150 ease-in-out ${isAllDay ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleAllDayClick}
                        className={`mt-4 px-6 py-2 rounded-full font-bold text-white transition-colors duration-200 ease-in-out ${isAllDay ? `bg-gray-500` : `${primaryColorClass} hover:${primaryColorClass.replace('600', '700')}`}`}
                    >
                        Toute la journée
                    </button>
                </div>
            )}
        </div>
    );
};

export default ScheduleForm;