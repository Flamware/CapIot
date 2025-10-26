// src/components/schedule/ScheduleForm.tsx

import React, { useState, useEffect } from 'react';
import { X, Loader2, Trash2, List, CalendarDays } from 'lucide-react';
import {Component, Device} from "../types/device.ts";
import { RecurringSchedule } from "../types/schedule.tsx";
import { useScheduleApi } from "../hooks/useSchedule.tsx";

interface DeviceInfoModalProps {
    isOpen: boolean;
    device: Device;
    onClose: () => void;
    onResetComponent: (component: Component) => Promise<void>;
}

const DeviceInfoModal: React.FC<DeviceInfoModalProps> = ({ isOpen, device, onClose, onResetComponent }) => {
    const [schedules, setSchedules] = useState<RecurringSchedule[]>([]);
    const { getRecurringSchedules, loading, deleteRecurringSchedule } = useScheduleApi();
    const [isResetting, setIsResetting] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showAllSchedules, setShowAllSchedules] = useState(false);
    const [displayedMonth, setDisplayedMonth] = useState(new Date().getMonth());
    const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (isOpen && device?.device_id) {
            const getSchedules = async () => {
                const fetchedSchedules = await getRecurringSchedules(device.device_id);
                setSchedules(fetchedSchedules);
            };
            getSchedules();
        }
    }, [isOpen, device, getRecurringSchedules]);

    if (!isOpen) return null;

    const handleResetClick = async (component: Component) => {
        setIsResetting(component.component_id);
        try {
            await onResetComponent(component);
        } finally {
            setIsResetting(null);
        }
    };

    const handleDeleteClick = async (deviceID: string, id: number) => {
        setIsDeleting(id);
        try {
            await deleteRecurringSchedule(deviceID, id);
            setSchedules(prev => prev.filter(s => s.recurring_schedule_id !== id));
        } finally {
            setIsDeleting(null);
            if (selectedDate) {
                setSelectedDate(new Date(selectedDate.getTime()));
            }
        }
    };

    const formatTime = (isoString: string): string => {
        try {
            const date = new Date(isoString);
            const localHours = date.getHours();
            const localMinutes = date.getMinutes();
            return `${String(localHours).padStart(2, '0')}:${String(localMinutes).padStart(2, '0')}`;
        } catch (e) {
            return "N/A";
        }
    };
    const handlePrevMonth = () => {
        if (displayedMonth === 0) {
            setDisplayedMonth(11);
            setDisplayedYear(prev => prev - 1);
        } else {
            setDisplayedMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (displayedMonth === 11) {
            setDisplayedMonth(0);
            setDisplayedYear(prev => prev + 1);
        } else {
            setDisplayedMonth(prev => prev + 1);
        }
    };

    const getRRuleDay = (date: Date): string => {
        const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
        return days[date.getDay()];
    };

    const handleDayClick = (day: number | null) => {
        if (day !== null) {
            const clickedDate = new Date(displayedYear, displayedMonth, day);
            setSelectedDate(clickedDate);
        }
    };

    const matchesSchedule = (date: Date, schedule: RecurringSchedule): boolean => {
        const rruleDay = getRRuleDay(date); // 'MO', 'TU', etc.
        const scheduleStart = new Date(schedule.start_time);
        const scheduleEnd = schedule.end_time ? new Date(schedule.end_time) : null;

        if (schedule.recurrence_rule.includes("FREQ=ONCE")) {
            return (
                date.getFullYear() === scheduleStart.getFullYear() &&
                date.getMonth() === scheduleStart.getMonth() &&
                date.getDate() === scheduleStart.getDate()
            );
        }

        if (schedule.recurrence_rule.includes("FREQ=DAILY")) {
            return true; // always applies
        }

        if (schedule.recurrence_rule.includes("FREQ=WEEKLY")) {
            return schedule.recurrence_rule.includes(`BYDAY=${rruleDay}`);
        }

        if (schedule.recurrence_rule.includes("FREQ=MONTHLY")) {
            const day = date.getDate();
            const startDay = scheduleStart.getDate();
            const endDay = scheduleEnd ? scheduleEnd.getDate() : null;

            if (endDay !== null) {
                // Normal range
                if (startDay <= endDay) {
                    return day >= startDay && day <= endDay;
                }
                // Wrap-around range (e.g. 28 → 3)
                return day >= startDay || day <= endDay;
            }
            return day === startDay;
        }

        return false;
    };

    const getSchedulesForDate = (date: Date): RecurringSchedule[] => {
        const specific = schedules.filter(
            (s) => s.recurrence_rule.includes("FREQ=ONCE") && matchesSchedule(date, s)
        );
        if (specific.length > 0) return specific;

        // Priority 2: Exceptions
        const exceptions = schedules.filter(
            (s) => s.is_exception && matchesSchedule(date, s)
        );
        if (exceptions.length > 0) return exceptions;

        // Priority 3: Regular schedules
        return schedules.filter(
            (s) => !s.is_exception && matchesSchedule(date, s)
        );
    };


    const renderCombinedScheduleCalendar = () => {
        if (schedules.length === 0) return null;

        const startMonth = displayedMonth;
        const startYear = displayedYear;

        const daysInMonth = new Date(startYear, startMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(startYear, startMonth, 1).getDay();
        const emptyCells = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);

        const days: (number | null)[] = [];
        for (let i = 0; i < emptyCells; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }


        return (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                    <button onClick={handlePrevMonth}
                            className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">◀
                    </button>
                    <h4 className="font-semibold text-gray-800">
                        Schedules
                        for {new Date(startYear, startMonth).toLocaleString('default', {month: 'long'})} {startYear}
                    </h4>
                    <button onClick={handleNextMonth}
                            className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">▶
                    </button>
                </div>
                <table className="w-full text-center text-sm mt-2">
                    <thead>
                    <tr className="text-gray-500 text-xs">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <th key={day} className="py-2 font-medium">{day}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({length: Math.ceil(days.length / 7)}).map((_, weekIndex) => (
                        <tr key={weekIndex}>
                            {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                                const fullDate = day ? new Date(startYear, startMonth, day) : null;
                                const schedulesForDay = fullDate ? getSchedulesForDate(fullDate) : [];
                                let cellClass = 'w-8 h-8 rounded-full flex items-center justify-center text-gray-700';
                                if (schedulesForDay.length > 0) {
                                    const hasSpecific = schedulesForDay.some(s => s.recurrence_rule.includes('FREQ=ONCE'));
                                    const hasException = schedulesForDay.some(s => s.is_exception);
                                    console.log("exception :",hasException);
                                    if (hasSpecific && !hasException) {
                                        cellClass = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-cyan-500 cursor-pointer hover:bg-cyan-600';
                                    } else if (hasException) {
                                        cellClass = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-red-500 cursor-pointer hover:bg-red-600';
                                    } else {
                                        const hasMonthly = schedulesForDay.some(s => s.recurrence_rule.includes('FREQ=MONTHLY'));
                                        const hasWeekly = schedulesForDay.some(s => s.recurrence_rule.includes('FREQ=WEEKLY'));
                                        const hasDaily = schedulesForDay.some(s => s.recurrence_rule.includes('FREQ=DAILY'));

                                        if (hasMonthly && hasWeekly) {
                                            cellClass = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-purple-500 cursor-pointer hover:bg-purple-600';
                                        } else if (hasMonthly) {
                                            cellClass = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-green-500 cursor-pointer hover:bg-green-600';
                                        } else if (hasWeekly) {
                                            cellClass = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-green-500 cursor-pointer hover:bg-green-600';
                                        } else if (hasDaily) {
                                            cellClass = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-orange-500 cursor-pointer hover:bg-orange-600';
                                        }
                                    }
                                }

                                return (
                                    <td key={dayIndex} className="p-1">
                                        <div
                                            className={cellClass}
                                            onClick={() => handleDayClick(day)}
                                        >
                                            {day}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="mt-4 space-y-2 text-sm">
                    <h5 className="font-semibold text-gray-700">Legend:</h5>
                    <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 inline-block rounded-full bg-green-500"></span>
                        <p className="text-gray-600">Monthly Schedule</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 inline-block rounded-full bg-green-500"></span>
                        <p className="text-gray-600">Weekly Schedule</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 inline-block rounded-full bg-orange-500"></span>
                        <p className="text-gray-600">Daily Schedule</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 inline-block rounded-full bg-cyan-500"></span>
                        <p className="text-gray-600">Specific Day Schedule</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 inline-block rounded-full bg-red-500"></span>
                        <p className="text-gray-600">Exception Schedule</p>
                    </div>
                </div>

            </div>
        );
    };

    const renderAllSchedulesList = () => {
        if (schedules.length === 0) return <p className="text-gray-500">No schedules found for this device.</p>;

        return (
            <div className="max-h-96 overflow-y-auto">
                <div className="space-y-4">
                    {schedules.map((schedule) => {
                        const isException = schedule.is_exception;
                        const recurrenceType = schedule.recurrence_rule.includes('FREQ=MONTHLY') ? 'Monthly' :
                            schedule.recurrence_rule.includes('FREQ=WEEKLY') ? 'Weekly' :
                                schedule.recurrence_rule.includes('FREQ=ONCE') ? 'Specific' :
                                    schedule.recurrence_rule.includes('FREQ=DAILY') ? 'Daily' : 'Unknown';

                        const recurrenceDetails = recurrenceType === 'Specific' ? new Date(schedule.start_time).toLocaleDateString() :
                            recurrenceType === 'Weekly' ? schedule.recurrence_rule.split('BYDAY=')[1] :
                                recurrenceType;

                        return (
                            <div
                                key={schedule.recurring_schedule_id}
                                className={`flex justify-between items-center p-3 rounded-md transition-colors ${
                                    isException ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                                }`}
                            >
                                <div>
                                    <p className="font-semibold">{isException ? `❌ Exception: ${schedule.schedule_name}` : schedule.schedule_name}</p>
                                    <p className="text-sm">
                                        Time: {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Type: {recurrenceType} {recurrenceType !== 'Daily' && recurrenceType !== 'Monthly' && `(${recurrenceDetails})`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteClick(device.device_id, schedule.recurring_schedule_id)}
                                    disabled={isDeleting === schedule.recurring_schedule_id}
                                    className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete Schedule"
                                >
                                    {isDeleting === schedule.recurring_schedule_id ? (
                                        <Loader2 className="animate-spin h-4 w-4" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderScheduleModal = () => {
        if (!selectedDate) return null;

        const schedulesOnDay = getSchedulesForDate(selectedDate);
        console.log("Schedules on", selectedDate.toISOString(), schedulesOnDay);
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative">
                    <button
                        onClick={() => setSelectedDate(null)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <h3 className="text-lg font-bold mb-4">Schedules for {selectedDate.toLocaleDateString()}</h3>
                    {schedulesOnDay.length > 0 ? (
                        <div className="space-y-4">
                            {schedulesOnDay.map((schedule) => {
                                const isException = schedule.is_exception;
                                return (
                                    <div
                                        key={schedule.recurring_schedule_id}
                                        className={`flex justify-between items-center p-3 rounded-md transition-colors ${
                                            isException ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                                        }`}
                                    >
                                        <div>
                                            <p className="font-semibold">{isException ? `❌ ${schedule.schedule_name}` : schedule.schedule_name}</p>
                                            <p className="text-sm">
                                                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {schedule.recurrence_rule.includes('FREQ=MONTHLY') ? 'Monthly' :
                                                    schedule.recurrence_rule.includes('FREQ=WEEKLY') ? 'Weekly' :
                                                        schedule.recurrence_rule.includes('FREQ=ONCE') ? 'Specific' : 'Daily'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteClick(device.device_id, schedule.recurring_schedule_id)}
                                            disabled={isDeleting === schedule.recurring_schedule_id}
                                            className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Delete Schedule"
                                        >
                                            {isDeleting === schedule.recurring_schedule_id ? (
                                                <Loader2 className="animate-spin h-4 w-4" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500">No schedules found for this date.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            {selectedDate && renderScheduleModal()}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Device Information</h2>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Device: {device.device_id}</h3>
                    <p className="text-sm text-gray-500">Last Seen: {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'N/A'}</p>
                    <p className="text-sm text-gray-500">Status: {device.status}</p>
                </div>

                {/* Components Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Components</h3>
                    {device.components && device.components.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {device.components.map((component, index) => {
                                const hasLifespan = typeof component.max_running_hours === 'number' && component.max_running_hours > 0;
                                let lifespanPercentage = 0;
                                let progressBarColor = 'bg-gray-400';
                                let lifespanExceeded = false;

                                if (hasLifespan && typeof component.current_running_hours === 'number' && component.max_running_hours) {
                                    lifespanPercentage = (1 - (component.current_running_hours / component.max_running_hours)) * 100;

                                    if (lifespanPercentage <= 0) {
                                        lifespanPercentage = 0;
                                        lifespanExceeded = true;
                                        progressBarColor = 'bg-red-500';
                                    } else if (lifespanPercentage > 75) {
                                        progressBarColor = 'bg-green-500';
                                    } else if (lifespanPercentage > 25) {
                                        progressBarColor = 'bg-yellow-500';
                                    } else {
                                        progressBarColor = 'bg-red-500';
                                    }
                                }

                                const isComponentResetting = isResetting === component.component_id;

                                return (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="font-semibold text-gray-800">
                                            {component.component_type.charAt(0).toUpperCase() + component.component_type.slice(1)} ({component.component_subtype})
                                        </h4>
                                        <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                                            {typeof component.min_threshold === 'number' && <li>Min Threshold: {component.min_threshold}</li>}
                                            {typeof component.max_threshold === 'number' && <li>Max Threshold: {component.max_threshold}</li>}
                                            {typeof component.max_running_hours === 'number' && <li>Max Running Hours: {component.max_running_hours}</li>}
                                            {typeof component.current_running_hours === 'number' && <li>Current Running Hours: {Math.round(component.current_running_hours)}</li>}
                                        </ul>
                                        {hasLifespan && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-700">Lifespan Remaining</p>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                                    <div
                                                        className={`h-2.5 rounded-full transition-all duration-500 ${progressBarColor}`}
                                                        style={{ width: `${lifespanPercentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-right text-xs mt-1">
                                                    {lifespanExceeded ? (
                                                        <span className="text-red-600 font-semibold">Lifespan Exceeded!</span>
                                                    ) : (
                                                        <span className="text-gray-500">{Math.round(lifespanPercentage)}%</span>
                                                    )}
                                                </div>
                                                {component.current_running_hours > 0 && (
                                                    <button
                                                        onClick={() => handleResetClick(component)}
                                                        disabled={isComponentResetting}
                                                        className="mt-2 w-full text-white bg-red-600 hover:bg-red-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center"
                                                    >
                                                        {isComponentResetting ? (
                                                            <>
                                                                <Loader2 className="animate-spin h-5 w-5 mr-2" /> Resetting...
                                                            </>
                                                        ) : (
                                                            'Reset Running Hours'
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500">No components found for this device.</p>
                    )}
                </div>

                {/* Schedules Section */}
                <div className="space-y-4 mt-6">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-xl font-bold text-gray-800">Schedules</h3>
                        <button
                            onClick={() => setShowAllSchedules(!showAllSchedules)}
                            className="px-4 py-2 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700 flex items-center gap-1"
                        >
                            {showAllSchedules ? (
                                <>
                                    <CalendarDays size={16} /> Show Calendar
                                </>
                            ) : (
                                <>
                                    <List size={16} /> Show All
                                </>
                            )}
                        </button>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                            <p className="ml-2 text-gray-500">Loading schedules...</p>
                        </div>
                    ) : showAllSchedules ? (
                        renderAllSchedulesList()
                    ) : (
                        renderCombinedScheduleCalendar()
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeviceInfoModal;
