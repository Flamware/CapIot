import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { RecurringSchedule } from '../types/schedule';
import { DeviceInfo } from '../location/Props';
import 'react-calendar/dist/Calendar.css';

// Props for the component
interface DeviceScheduleSettingModalProps {
    isOpen: boolean;
    device: DeviceInfo;
    onClose: () => void;
    onSaveSchedule: (schedules: Partial<RecurringSchedule>[], deviceId: string) => void;
}

type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

const DeviceScheduleSettingModal: React.FC<DeviceScheduleSettingModalProps> = ({
                                                                                   isOpen,
                                                                                   device,
                                                                                   onClose,
                                                                                   onSaveSchedule,
                                                                               }) => {
    // State to toggle between regular and exception schedules
    const [isExceptionMode, setIsExceptionMode] = useState(false);

    // State for recurring schedule (green)
    const [scheduleName, setScheduleName] = useState('');
    const [scheduleRecurrenceType, setScheduleRecurrenceType] = useState<'monthly' | 'weekly' | 'daily'>('daily');
    const [dailySchedule, setDailySchedule] = useState({ start_hour: '09:00', end_hour: '17:00' });
    const [weeklySchedule, setWeeklySchedule] = useState({
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

    // State for exception schedule (red)
    const [exceptionRecurrenceType, setExceptionRecurrenceType] = useState<'monthly' | 'weekly' | 'daily'>('daily');
    const [dailyException, setDailyException] = useState({ start_hour: '00:00', end_hour: '23:59' });
    const [weeklyException, setWeeklyException] = useState({
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

    // Reset all states when the modal is closed
    const resetSchedules = () => {
        setIsExceptionMode(false);
        setScheduleName('');
        setScheduleRecurrenceType('daily');
        setDailySchedule({ start_hour: '09:00', end_hour: '17:00' });
        setWeeklySchedule({
            mon: { isSelected: true, start: '09:00', end: '17:00' },
            tue: { isSelected: true, start: '09:00', end: '17:00' },
            wed: { isSelected: true, start: '09:00', end: '17:00' },
            thu: { isSelected: true, start: '09:00', end: '17:00' },
            fri: { isSelected: true, start: '09:00', end: '17:00' },
            sat: { isSelected: false, start: '', end: '' },
            sun: { isSelected: false, start: '', end: '' },
        });
        setMonthlySchedule({ start_date: '', end_date: '', start_time: '09:00', end_time: '17:00' });
        setSelectedScheduleDateRange(null);
        setExceptionRecurrenceType('daily');
        setDailyException({ start_hour: '00:00', end_hour: '23:59' });
        setWeeklyException({
            mon: { isSelected: false, start: '', end: '' },
            tue: { isSelected: false, start: '', end: '' },
            wed: { isSelected: false, start: '', end: '' },
            thu: { isSelected: false, start: '', end: '' },
            fri: { isSelected: false, start: '', end: '' },
            sat: { isSelected: true, start: '00:00', end: '23:59' },
            sun: { isSelected: true, start: '00:00', end: '23:59' },
        });
        setMonthlyException({ start_date: '', end_date: '', start_time: '00:00', end_time: '23:59' });
        setSelectedExceptionDateRange(null);
    };

    // Close handler for the modal
    const handleCloseModal = () => {
        resetSchedules();
        onClose();
    };

    // Handlers for regular schedule
    const handleDailyScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDailySchedule(prev => ({ ...prev, [name]: value }));
    };
    const toggleWeeklyDay = (day: Day) => {
        setWeeklySchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], isSelected: !prev[day].isSelected },
        }));
    };
    const handleWeeklyTimeChange = (day: Day, type: 'start' | 'end', value: string) => {
        setWeeklySchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [type]: value },
        }));
    };
    const handleMonthlyScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMonthlySchedule(prev => ({ ...prev, [name]: value }));
    };
    const handleDateChange = (value: Date[] | Date | null) => {
        if (Array.isArray(value)) {
            setSelectedScheduleDateRange(value);
            setMonthlySchedule(prev => ({
                ...prev,
                start_date: value[0] ? value[0].toISOString().split('T')[0] : '',
                end_date: value[1] ? value[1].toISOString().split('T')[0] : '',
            }));
        }
    };

    // Handlers for exception schedule
    const handleDailyExceptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDailyException(prev => ({ ...prev, [name]: value }));
    };
    const toggleWeeklyExceptionDay = (day: Day) => {
        setWeeklyException(prev => ({
            ...prev,
            [day]: { ...prev[day], isSelected: !prev[day].isSelected },
        }));
    };
    const handleWeeklyExceptionTimeChange = (day: Day, type: 'start' | 'end', value: string) => {
        setWeeklyException(prev => ({
            ...prev,
            [day]: { ...prev[day], [type]: value },
        }));
    };
    const handleMonthlyExceptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMonthlyException(prev => ({ ...prev, [name]: value }));
    };
    const handleExceptionDateChange = (value: Date[] | Date | null) => {
        if (Array.isArray(value)) {
            setSelectedExceptionDateRange(value);
            setMonthlyException(prev => ({
                ...prev,
                start_date: value[0] ? value[0].toISOString().split('T')[0] : '',
                end_date: value[1] ? value[1].toISOString().split('T')[0] : '',
            }));
        }
    };

    const handleSaveSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        const schedulesToSave: Partial<RecurringSchedule>[] = [];
        const today = new Date().toISOString().split('T')[0];

        if (!isExceptionMode) {
            // Process regular schedule
            if (scheduleRecurrenceType === 'daily') {
                const dailyScheduleToSave = {
                    schedule_name: scheduleName || `Daily Schedule for ${device.device_id}`,
                    start_time: `${today}T${dailySchedule.start_hour}:00Z`,
                    end_time: `${today}T${dailySchedule.end_hour}:00Z`,
                    recurrence_rule: 'FREQ=DAILY',
                    start_date: `${today}T00:00:00Z`,
                    end_date: `9999-12-31T23:59:59Z`,
                    is_exception: false,
                };
                schedulesToSave.push(dailyScheduleToSave);
            } else if (scheduleRecurrenceType === 'weekly') {
                const selectedDays = (Object.keys(weeklySchedule) as Day[]).filter(day => weeklySchedule[day].isSelected);
                selectedDays.forEach(day => {
                    const rruleDay = day.substring(0, 2).toUpperCase();
                    const schedule = {
                        schedule_name: `${scheduleName || 'Weekly Schedule'} - ${day.charAt(0).toUpperCase() + day.slice(1)}`,
                        start_time: `${today}T${weeklySchedule[day].start}:00Z`,
                        end_time: `${today}T${weeklySchedule[day].end}:00Z`,
                        recurrence_rule: `FREQ=WEEKLY;BYDAY=${rruleDay}`,
                        start_date: `${today}T00:00:00Z`,
                        end_date: `9999-12-31T23:59:59Z`,
                        is_exception: false,
                    };
                    schedulesToSave.push(schedule);
                });
            } else if (scheduleRecurrenceType === 'monthly') {
                const monthlyScheduleToSave = {
                    schedule_name: scheduleName || `Monthly Schedule for ${device.device_id}`,
                    start_time: `${monthlySchedule.start_date}T${monthlySchedule.start_time}:00Z`,
                    end_time: `${monthlySchedule.end_date}T${monthlySchedule.end_time}:00Z`,
                    recurrence_rule: 'FREQ=MONTHLY',
                    start_date: `${monthlySchedule.start_date}T00:00:00Z`,
                    end_date: `${monthlySchedule.end_date}T23:59:59Z`,
                    is_exception: false,
                };
                schedulesToSave.push(monthlyScheduleToSave);
            }
        } else {
            // Process exception schedule
            if (exceptionRecurrenceType === 'daily') {
                const dailyExceptionToSave = {
                    schedule_name: `Daily Exception for ${device.device_id}`,
                    start_time: `${today}T${dailyException.start_hour}:00Z`,
                    end_time: `${today}T${dailyException.end_hour}:00Z`,
                    recurrence_rule: 'FREQ=DAILY',
                    start_date: `${today}T00:00:00Z`,
                    end_date: `9999-12-31T23:59:59Z`,
                    is_exception: true,
                };
                schedulesToSave.push(dailyExceptionToSave);
            } else if (exceptionRecurrenceType === 'weekly') {
                const selectedDays = (Object.keys(weeklyException) as Day[]).filter(day => weeklyException[day].isSelected);
                selectedDays.forEach(day => {
                    const rruleDay = day.substring(0, 2).toUpperCase();
                    const exception = {
                        schedule_name: `Weekly Exception for ${device.device_id} - ${day.charAt(0).toUpperCase() + day.slice(1)}`,
                        start_time: `${today}T${weeklyException[day].start}:00Z`,
                        end_time: `${today}T${weeklyException[day].end}:00Z`,
                        recurrence_rule: `FREQ=WEEKLY;BYDAY=${rruleDay}`,
                        start_date: `${today}T00:00:00Z`,
                        end_date: `9999-12-31T23:59:59Z`,
                        is_exception: true,
                    };
                    schedulesToSave.push(exception);
                });
            } else if (exceptionRecurrenceType === 'monthly') {
                const monthlyExceptionToSave = {
                    schedule_name: `Monthly Exception for ${device.device_id}`,
                    start_time: `${monthlyException.start_date}T${monthlyException.start_time}:00Z`,
                    end_time: `${monthlyException.end_date}T${monthlyException.end_time}:00Z`,
                    recurrence_rule: 'FREQ=MONTHLY',
                    start_date: `${monthlyException.start_date}T00:00:00Z`,
                    end_date: `${monthlyException.end_date}T23:59:59Z`,
                    is_exception: true,
                };
                schedulesToSave.push(monthlyExceptionToSave);
            }
        }

        onSaveSchedule(schedulesToSave, device.device_id);
        handleCloseModal();
    };

    if (!isOpen) return null;

    const days: Day[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl transform scale-100 transition-transform duration-300">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Set {isExceptionMode ? "Exception" : "Regular"} Schedule for {device.device_id}
                    </h2>
                    <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors text-3xl leading-none">
                        &times;
                    </button>
                </div>

                <div className="modal-body">
                    <div className="flex justify-center mb-6">
                        <button
                            type="button"
                            onClick={() => setIsExceptionMode(!isExceptionMode)}
                            className={`px-4 py-2 rounded-md shadow-sm font-medium transition-colors ${
                                isExceptionMode
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            {isExceptionMode ? ` Back to Regular Schedule` : `Add Exception Schedule`}
                        </button>
                    </div>

                    <form onSubmit={handleSaveSchedule} className="flex flex-col space-y-4">
                        {!isExceptionMode ? (
                            // Regular Schedule UI (Green)
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Name</label>
                                    <input
                                        type="text"
                                        name="schedule_name"
                                        value={scheduleName}
                                        onChange={(e) => setScheduleName(e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence Type</label>
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setScheduleRecurrenceType('daily')}
                                            className={`px-4 py-2 rounded-md transition-colors ${
                                                scheduleRecurrenceType === 'daily'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            }`}
                                        >
                                            Daily
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setScheduleRecurrenceType('weekly')}
                                            className={`px-4 py-2 rounded-md transition-colors ${
                                                scheduleRecurrenceType === 'weekly'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            }`}
                                        >
                                            Weekly
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setScheduleRecurrenceType('monthly')}
                                            className={`px-4 py-2 rounded-md transition-colors ${
                                                scheduleRecurrenceType === 'monthly'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            }`}
                                        >
                                            Monthly
                                        </button>
                                    </div>
                                </div>
                                {scheduleRecurrenceType === 'daily' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Daily Schedule</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Hour</label>
                                                <input
                                                    type="time"
                                                    name="start_hour"
                                                    value={dailySchedule.start_hour}
                                                    onChange={handleDailyScheduleChange}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Hour</label>
                                                <input
                                                    type="time"
                                                    name="end_hour"
                                                    value={dailySchedule.end_hour}
                                                    onChange={handleDailyScheduleChange}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {scheduleRecurrenceType === 'weekly' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Weekly Schedule</h3>
                                        <p className="text-sm text-gray-500">Select start and end times for each day of the week.</p>
                                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                                            {days.map(day => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => toggleWeeklyDay(day)}
                                                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                                        weeklySchedule[day].isSelected
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(Object.keys(weeklySchedule) as Day[]).filter(day => weeklySchedule[day].isSelected).map(day => (
                                                <div key={day} className="space-y-2">
                                                    <h4 className="font-semibold text-sm text-gray-800">{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
                                                            <input
                                                                type="time"
                                                                value={weeklySchedule[day].start}
                                                                onChange={(e) => handleWeeklyTimeChange(day, 'start', e.target.value)}
                                                                className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
                                                            <input
                                                                type="time"
                                                                value={weeklySchedule[day].end}
                                                                onChange={(e) => handleWeeklyTimeChange(day, 'end', e.target.value)}
                                                                className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {scheduleRecurrenceType === 'monthly' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Monthly Schedule</h3>
                                        <div className="w-full max-w-sm mx-auto">
                                            <Calendar
                                                onChange={handleDateChange}
                                                value={selectedScheduleDateRange}
                                                selectRange={true}
                                                className="w-full border-2 border-gray-300 rounded-lg shadow-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                <input
                                                    type="date"
                                                    name="start_date"
                                                    value={monthlySchedule.start_date}
                                                    readOnly
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                <input
                                                    type="date"
                                                    name="end_date"
                                                    value={monthlySchedule.end_date}
                                                    readOnly
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                                <input
                                                    type="time"
                                                    name="start_time"
                                                    value={monthlySchedule.start_time}
                                                    onChange={handleMonthlyScheduleChange}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                                <input
                                                    type="time"
                                                    name="end_time"
                                                    value={monthlySchedule.end_time}
                                                    onChange={handleMonthlyScheduleChange}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Exception Schedule UI (Red)
                            <>
                                <div className="space-y-4 mt-4">
                                    <h3 className="text-lg font-semibold text-red-600">Exception Recurrence Type (Device WON'T run)</h3>
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setExceptionRecurrenceType('daily')}
                                            className={`px-4 py-2 rounded-md transition-colors ${
                                                exceptionRecurrenceType === 'daily'
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            }`}
                                        >
                                            Daily
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setExceptionRecurrenceType('weekly')}
                                            className={`px-4 py-2 rounded-md transition-colors ${
                                                exceptionRecurrenceType === 'weekly'
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            }`}
                                        >
                                            Weekly
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setExceptionRecurrenceType('monthly')}
                                            className={`px-4 py-2 rounded-md transition-colors ${
                                                exceptionRecurrenceType === 'monthly'
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            }`}
                                        >
                                            Monthly
                                        </button>
                                    </div>
                                    {exceptionRecurrenceType === 'daily' && (
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-800">Daily Exception</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Hour</label>
                                                    <input
                                                        type="time"
                                                        name="start_hour"
                                                        value={dailyException.start_hour}
                                                        onChange={handleDailyExceptionChange}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Hour</label>
                                                    <input
                                                        type="time"
                                                        name="end_hour"
                                                        value={dailyException.end_hour}
                                                        onChange={handleDailyExceptionChange}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {exceptionRecurrenceType === 'weekly' && (
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-800">Weekly Exception</h4>
                                            <p className="text-sm text-gray-500">Select start and end times for each day of the week.</p>
                                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                                {days.map(day => (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => toggleWeeklyExceptionDay(day)}
                                                        className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                                            weeklyException[day].isSelected
                                                                ? 'bg-red-600 text-white'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                    >
                                                        {day.charAt(0).toUpperCase() + day.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(Object.keys(weeklyException) as Day[]).filter(day => weeklyException[day].isSelected).map(day => (
                                                    <div key={day} className="space-y-2">
                                                        <h4 className="font-semibold text-sm text-gray-800">{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
                                                                <input
                                                                    type="time"
                                                                    value={weeklyException[day].start}
                                                                    onChange={(e) => handleWeeklyExceptionTimeChange(day, 'start', e.target.value)}
                                                                    className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
                                                                <input
                                                                    type="time"
                                                                    value={weeklyException[day].end}
                                                                    onChange={(e) => handleWeeklyExceptionTimeChange(day, 'end', e.target.value)}
                                                                    className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {exceptionRecurrenceType === 'monthly' && (
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-800">Monthly Exception</h4>
                                            <div className="w-full max-w-sm mx-auto">
                                                <Calendar
                                                    onChange={handleExceptionDateChange}
                                                    value={selectedExceptionDateRange}
                                                    selectRange={true}
                                                    className="w-full border-2 border-gray-300 rounded-lg shadow-sm"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                    <input
                                                        type="date"
                                                        name="start_date"
                                                        value={monthlyException.start_date}
                                                        readOnly
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                    <input
                                                        type="date"
                                                        name="end_date"
                                                        value={monthlyException.end_date}
                                                        readOnly
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                                    <input
                                                        type="time"
                                                        name="start_time"
                                                        value={monthlyException.start_time}
                                                        onChange={handleMonthlyExceptionChange}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                                    <input
                                                        type="time"
                                                        name="end_time"
                                                        value={monthlyException.end_time}
                                                        onChange={handleMonthlyExceptionChange}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                    isExceptionMode
                                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                }`}
                            >
                                Save Schedule
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeviceScheduleSettingModal;