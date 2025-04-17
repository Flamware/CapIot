// components/common/DateTimeInputs.tsx
import React from 'react';

interface DateTimeInputsProps {
    startTime: string;
    endTime: string;
    onStartTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEndTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateTimeInputs: React.FC<DateTimeInputsProps> = ({ startTime, endTime, onStartTimeChange, onEndTimeChange }) => {
    return (
        <div className="mb-4 flex items-center space-x-4">
            <div>
                <label htmlFor="startTime" className="block text-gray-700 text-sm font-bold mb-2">
                    Date et heure de début:
                </label>
                <input
                    type="datetime-local"
                    id="startTime"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={startTime}
                    onChange={onStartTimeChange}
                />
            </div>
            <div>
                <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold mb-2">
                    Date et heure de fin:
                </label>
                <input
                    type="datetime-local"
                    id="endTime"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={endTime}
                    onChange={onEndTimeChange}
                />
            </div>
        </div>
    );
};

export default DateTimeInputs;