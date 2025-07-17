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
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-end gap-4 sm:gap-6">
            {/* Start Date and Time Input */}
            <div className="flex-1 min-w-0"> {/* flex-1 allows it to grow, min-w-0 prevents overflow */}
                <label htmlFor="startTime" className="block text-gray-700 text-sm font-medium mb-2">
                    Date et heure de début:
                </label>
                <input
                    type="datetime-local"
                    id="startTime"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-800
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               transition duration-200 ease-in-out placeholder-gray-400"
                    value={startTime}
                    onChange={onStartTimeChange}
                    aria-label="Date et heure de début" // Added for accessibility
                />
            </div>

            {/* End Date and Time Input */}
            <div className="flex-1 min-w-0"> {/* flex-1 allows it to grow, min-w-0 prevents overflow */}
                <label htmlFor="endTime" className="block text-gray-700 text-sm font-medium mb-2">
                    Date et heure de fin:
                </label>
                <input
                    type="datetime-local"
                    id="endTime"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-800
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               transition duration-200 ease-in-out placeholder-gray-400"
                    value={endTime}
                    onChange={onEndTimeChange}
                    aria-label="Date et heure de fin" // Added for accessibility
                />
            </div>
        </div>
    );
};

export default DateTimeInputs;