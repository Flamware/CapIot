import React, { useState, useEffect } from 'react';
import { CalendarIcon, ChevronDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Helper function to convert human-readable time strings (like "1m", "5s") to seconds
const parseDurationToSeconds = ({duration}: { duration: any }) => {
    if (!duration) return 0;

    const value = parseInt(duration.slice(0, -1), 10);
    const unit = duration.slice(-1);

    switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 3600;
        default: return 0;
    }
};

interface DateTimeInputsProps {
    windowPeriod: string;
    startTime: string;
    endTime: string;
    onStartTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEndTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onwindowPeriodChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DateTimeInputs: React.FC<DateTimeInputsProps> = ({ windowPeriod, startTime, endTime, onStartTimeChange, onEndTimeChange, onwindowPeriodChange }) => {
    const MAX_POINTS = 15000; // Define a reasonable maximum number of data points allowed per query
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    // Define the common input classes
    const inputClasses = `
        w-full px-4 py-2.5 border rounded-lg shadow-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
        transition duration-200 ease-in-out placeholder-gray-400
    `;

    // Custom select styling: appearance-none hides the default arrow,
    // and pr-10 makes space for the custom icon.
    const selectClasses = `
        appearance-none bg-white pr-10 cursor-pointer 
    `;

    // --- Validation Logic ---
    useEffect(() => {
        if (!startTime || !endTime || !windowPeriod) {
            setValidationMessage(null);
            return;
        }

        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();

        if (start >= end) {
            setValidationMessage("⚠️ La date de début doit être antérieure à la date de fin.");
            return;
        }

        const durationMs = end - start;
        const durationSeconds = durationMs / 1000;
        const windowSeconds = parseDurationToSeconds({duration: windowPeriod});

        if (windowSeconds <= 0) {
            setValidationMessage("⚠️ Veuillez sélectionner une période de fenêtre valide.");
            return;
        }

        // Calculate total number of points requested
        const totalPoints = Math.ceil(durationSeconds / windowSeconds);

        if (totalPoints > MAX_POINTS) {
            const formattedPoints = totalPoints.toLocaleString('fr-FR');
            const maxPointsFormatted = MAX_POINTS.toLocaleString('fr-FR');
            setValidationMessage(
                `❌ Requete trop large! Le nombre de points de données est de ${formattedPoints}. Maximum autorisé: ${maxPointsFormatted}.`
            );
        } else {
            setValidationMessage(null);
        }

    }, [startTime, endTime, windowPeriod]);


    // Determine if the Window Period selector should be visually disabled/warned
    const isInvalid = validationMessage !== null && !validationMessage.startsWith("⚠️");

    // Conditional styling based on validation status
    const getBorderClass = ({isInputInvalid}: { isInputInvalid: any }) => {
        if (isInputInvalid) return "border-red-500";
        return "border-gray-300";
    };

    return (
        <div className="mb-8 flex flex-col lg:flex-row items-stretch lg:items-end gap-6 bg-white p-6 rounded-xl shadow-lg">

            {/* Start Date and Time Input */}
            <div className="flex-1 min-w-0">
                <label htmlFor="startTime" className="block text-gray-700 text-sm font-semibold mb-2">
                    Date et heure de début:
                </label>
                <div className="relative">
                    <input
                        type="datetime-local"
                        id="startTime"
                        className={`${inputClasses} ${getBorderClass({isInputInvalid: isInvalid})}`}
                        value={startTime}
                        onChange={onStartTimeChange}
                        aria-label="Date et heure de début"
                    />
                    <CalendarIcon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                    />
                </div>
            </div>

            {/* End Date and Time Input */}
            <div className="flex-1 min-w-0">
                <label htmlFor="endTime" className="block text-gray-700 text-sm font-semibold mb-2">
                    Date et heure de fin:
                </label>
                <div className="relative">
                    <input
                        type="datetime-local"
                        id="endTime"
                        className={`${inputClasses} ${getBorderClass({isInputInvalid: isInvalid})}`}
                        value={endTime}
                        onChange={onEndTimeChange}
                        aria-label="Date et heure de fin"
                    />
                    <CalendarIcon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                    />
                </div>
            </div>

            {/* Window Period Select Input */}
            <div className="flex-1 min-w-0">
                <label htmlFor="windowPeriod" className="block text-gray-700 text-sm font-semibold mb-2">
                    Période de fenêtre:
                </label>
                <div className="relative">
                    <select
                        id="windowPeriod"
                        className={`${selectClasses} ${inputClasses} ${getBorderClass({isInputInvalid: isInvalid})}`}
                        value={windowPeriod}
                        onChange={onwindowPeriodChange}
                        aria-label="Période de fenêtre"
                        disabled={isInvalid} // Disable if the point limit is exceeded
                    >
                        <option value="" disabled>Sélectionner une période</option>
                        {/* Options are available, but the select is disabled if range/window is too aggressive */}
                        <option value="5s">5 secondes (Très Haute Résolution)</option>
                        <option value="10s">10 secondes</option>
                        <option value="30s">30 secondes</option>
                        <option value="1m">1 minute</option>
                        <option value="5m">5 minutes</option>
                        <option value="15m">15 minutes</option>
                        <option value="30m">30 minutes</option>
                        <option value="1h">1 heure</option>
                        <option value="6h">6 heures</option>
                        <option value="12h">12 heures</option>
                        <option value="24h">24 heures</option>
                    </select>
                    {/* Custom dropdown icon to match the style */}
                    <ChevronDownIcon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                    />
                </div>
            </div>

            {/* Validation Message */}
            {validationMessage && (
                <div className="lg:absolute lg:mt-2 w-full lg:w-auto left-6 right-6 top-[calc(100%)] p-3 text-sm flex items-center gap-2 rounded-lg bg-red-100 text-red-700 shadow-md transition-all duration-300 ease-in-out">
                    <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                    <p className="font-medium">{validationMessage}</p>
                </div>
            )}
        </div>
    );
};

export default DateTimeInputs;
