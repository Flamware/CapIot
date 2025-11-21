// src/components/schedule/DeviceScheduleSettingModal.tsx

import React, { useState } from 'react';
import { RecurringSchedule } from "../types/schedule.tsx";
import { Day, RecurrenceType, WeeklySchedule } from "../types/types.tsx";
import ScheduleForm from "./schedule/ScheduleForm.tsx";
import 'react-calendar/dist/Calendar.css';
import { Device } from "../types/device.ts";

interface Props {
    isOpen: boolean;
    device: Device;
    onClose: () => void;
    onSaveSchedule: (schedules: Partial<RecurringSchedule>[], deviceID: string) => void;
}

const DeviceScheduleSettingModal: React.FC<Props> = ({ isOpen, device, onClose, onSaveSchedule }) => {
    // Mode d'affichage: faux pour l'horaire régulier, vrai pour l'exception
    const [isExceptionMode, setIsExceptionMode] = useState(false);

    // --- États de l'horaire RÉGULIER ---
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

    // --- États de l'horaire d'EXCEPTION ---
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

    // Déterminer quel ensemble de données utiliser selon le mode (Régulier ou Exception)
    const currentRecurrenceType = isExceptionMode ? exceptionRecurrenceType : scheduleRecurrenceType;
    const currentDaily = isExceptionMode ? dailyException : dailySchedule;
    const currentWeekly = isExceptionMode ? weeklyException : weeklySchedule;
    const currentMonthly = isExceptionMode ? monthlyException : monthlySchedule;
    const currentSelectedDateRange = isExceptionMode ? selectedExceptionDateRange : selectedScheduleDateRange;
    const currentSetRecurrenceType = isExceptionMode ? setExceptionRecurrenceType : setScheduleRecurrenceType;


    // Fonction pour définir la même plage horaire pour tous les jours sélectionnés
    const setAllDayHandler = (start: string, end: string) => {
        if (currentRecurrenceType === 'daily') {
            isExceptionMode
                ? setDailyException(prev => ({ ...prev, start_hour: start, end_hour: end }))
                : setDailySchedule(prev => ({ ...prev, start_hour: start, end_hour: end }));
        } else if (currentRecurrenceType === 'weekly') {
            const updateWeekly = (schedule: WeeklySchedule, setSchedule: (s: WeeklySchedule) => void) => {
                const updatedWeeklySchedule = { ...schedule };
                Object.keys(updatedWeeklySchedule).forEach(day => {
                    if (updatedWeeklySchedule[day as Day].isSelected) {
                        updatedWeeklySchedule[day as Day].start = start;
                        updatedWeeklySchedule[day as Day].end = end;
                    }
                });
                setSchedule(updatedWeeklySchedule);
            };
            isExceptionMode
                ? updateWeekly(weeklyException, setWeeklyException)
                : updateWeekly(weeklySchedule, setWeeklySchedule);
        } else if (currentRecurrenceType === 'monthly' || currentRecurrenceType === 'specific') {
            isExceptionMode
                ? setMonthlyException(prev => ({ ...prev, start_time: start, end_time: end }))
                : setMonthlySchedule(prev => ({ ...prev, start_time: start, end_time: end }));
        }
    };


    // Définition des gestionnaires de changement (onChange) en fonction du mode
    const currentOnChange = {
        dailyStart: (e: React.ChangeEvent<HTMLInputElement>) => isExceptionMode
            ? setDailyException(prev => ({ ...prev, start_hour: e.target.value }))
            : setDailySchedule(prev => ({ ...prev, start_hour: e.target.value })),

        dailyEnd: (e: React.ChangeEvent<HTMLInputElement>) => isExceptionMode
            ? setDailyException(prev => ({ ...prev, end_hour: e.target.value }))
            : setDailySchedule(prev => ({ ...prev, end_hour: e.target.value })),

        toggleWeekDay: (day: Day) => isExceptionMode
            ? setWeeklyException(prev => ({ ...prev, [day]: { ...prev[day], isSelected: !prev[day].isSelected } }))
            : setWeeklySchedule(prev => ({ ...prev, [day]: { ...prev[day], isSelected: !prev[day].isSelected } })),

        weeklyTimeChange: (day: Day, type: 'start' | 'end', value: string) => isExceptionMode
            ? setWeeklyException(prev => ({ ...prev, [day]: { ...prev[day], [type]: value } }))
            : setWeeklySchedule(prev => ({ ...prev, [day]: { ...prev[day], [type]: value } })),

        monthlyDate: (dates: Date[] | Date | null) => isExceptionMode
            ? setSelectedExceptionDateRange(dates)
            : setSelectedScheduleDateRange(dates),

        monthlyTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => isExceptionMode
            ? setMonthlyException(prev => ({ ...prev, [e.target.name]: e.target.value }))
            : setMonthlySchedule(prev => ({ ...prev, [e.target.name]: e.target.value })),

        setAllDay: setAllDayHandler,
    };


    // Fonction utilitaire pour formater une date en YYYY-MM-DDTHH:mm:00Z (format Go)
    const formatDateForGo = (date: Date, time: string): string => {
        const [hour, minute] = time.split(':');
        const formattedDate = new Date(date);
        // Réglage de l'heure locale
        formattedDate.setHours(Number(hour), Number(minute), 0, 0);
        // Utilisation de toISOString() pour le format UTC
        return formattedDate.toISOString();
    };

    const handleSave = () => {
        const schedulesToSave: Partial<RecurringSchedule>[] = [];
        const isException = isExceptionMode;
        const today = new Date(); // Utilisé comme date de référence pour les horaires quotidiens/hebdomadaires

        if (currentRecurrenceType === 'daily') {
            schedulesToSave.push({
                start_time: formatDateForGo(today, currentDaily.start_hour),
                end_time: formatDateForGo(today, currentDaily.end_hour),
                recurrence_rule: 'RRULE:FREQ=DAILY',
                is_exception: isException,
                schedule_name: `Quotidien: ${currentDaily.start_hour}-${currentDaily.end_hour}`,
            });
        } else if (currentRecurrenceType === 'weekly') {
            Object.entries(currentWeekly).forEach(([day, schedule]) => {
                if (schedule.isSelected) {
                    schedulesToSave.push({
                        start_time: formatDateForGo(today, schedule.start),
                        end_time: formatDateForGo(today, schedule.end),
                        // BYDAY: MO, TU, WE, TH, FR, SA, SU (ici on prend les 2 premières lettres en majuscules)
                        recurrence_rule: `RRULE:FREQ=WEEKLY;BYDAY=${day.toUpperCase().substring(0,2)}`,
                        is_exception: isException,
                        schedule_name: `${day.charAt(0).toUpperCase() + day.slice(1)}: ${schedule.start}-${schedule.end}`,
                    });
                }
            });
        } else if (currentRecurrenceType === 'monthly') {
            if (
                currentSelectedDateRange &&
                Array.isArray(currentSelectedDateRange) &&
                currentSelectedDateRange.length === 2
            ) {
                const [start, end] = currentSelectedDateRange;

                // Empêche la double sauvegarde si les dates de début et de fin sont identiques
                if (start.toDateString() !== end.toDateString()) {
                    schedulesToSave.push({
                        start_time: formatDateForGo(start, currentMonthly.start_time),
                        end_time: formatDateForGo(end, currentMonthly.end_time),
                        recurrence_rule: `RRULE:FREQ=MONTHLY`,
                        is_exception: isException,
                        schedule_name: `Mensuel du ${start.toLocaleDateString()} au ${end.toLocaleDateString()}`,
                    });
                } else {
                    // Traiter comme un horaire d'un seul jour
                    schedulesToSave.push({
                        start_time: formatDateForGo(start, currentMonthly.start_time),
                        end_time: formatDateForGo(start, currentMonthly.end_time),
                        recurrence_rule: `RRULE:FREQ=MONTHLY`,
                        is_exception: isException,
                        schedule_name: `Mensuel: ${start.toLocaleDateString()}`,
                    });
                }
            }
        } else if (currentRecurrenceType === 'specific') {
            if (currentSelectedDateRange) {
                const dates = Array.isArray(currentSelectedDateRange)
                    ? currentSelectedDateRange
                    : [currentSelectedDateRange];

                // Supprimer les doublons de dates
                const uniqueDates = Array.from(
                    new Set(dates.map((d) => d.toDateString()))
                ).map((str) => new Date(str));

                uniqueDates.forEach((date) => {
                    schedulesToSave.push({
                        start_time: formatDateForGo(date, currentMonthly.start_time),
                        end_time: formatDateForGo(date, currentMonthly.end_time),
                        recurrence_rule: 'RRULE:FREQ=ONCE',
                        is_exception: isException,
                        schedule_name: `Jour spécifique: ${date.toLocaleDateString()}`,
                    });
                });
            }
        }

        if (schedulesToSave.length > 0) {
            onSaveSchedule(schedulesToSave, device.device_id);
            console.log("Horaires à sauvegarder:", schedulesToSave);
        } else {
            console.error("Aucun horaire à sauvegarder. Vérifiez vos options sélectionnées.");
        }
        onClose();
    };

    return (
        // CONTENEUR FIXE: Ajout de min-h-screen
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4 min-h-screen">
            {/* CORPS DU MODAL: Ajout de max-h-[90vh] et overflow-y-auto */}
            <div className="bg-white p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        Définir l'horaire {isExceptionMode ? 'd\'exception' : 'régulier'} pour l'appareil {device.device_id}
                    </h2>
                    <button onClick={onClose} className="text-3xl">&times;</button>
                </div>

                <div className="mb-4 flex justify-center">
                    <button
                        onClick={() => setIsExceptionMode(!isExceptionMode)}
                        // Utilisation de bg-green pour le mode régulier et bg-red pour l'exception
                        className={`px-4 py-2 rounded-md text-white ${
                            isExceptionMode ? 'bg-green-600' : 'bg-red-600'
                        }`}
                    >
                        {isExceptionMode ? 'Retour à l\'horaire régulier' : 'Ajouter une exception'}
                    </button>
                </div>

                <div className="flex justify-center gap-4 mb-4">
                    {recurrenceTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => currentSetRecurrenceType(type)}
                            className={`px-4 py-2 rounded-md ${
                                currentRecurrenceType === type ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'
                            }`}
                        >
                            {type === 'daily' ? 'Quotidien' :
                             type === 'weekly' ? 'Hebdomadaire' :
                             type === 'monthly' ? 'Mensuel' :
                             'Spécifique'}
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
                    // Passer la couleur appropriée pour le formulaire
                    color={isExceptionMode ? "red" : "green"}
                    selectRange={true}
                />

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-md bg-gray-200 text-gray-800"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-md bg-green-600 text-white"
                    >
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeviceScheduleSettingModal;

