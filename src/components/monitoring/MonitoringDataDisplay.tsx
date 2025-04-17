// components/monitoring/MonitoringDataDisplay.tsx
import React from 'react';
import SensorChart from './SensorChart';

interface MonitoringDataDisplayProps {
    monitoringData: {
        [deviceId: string]: {
            readings: {
                [sensorType: string]: { time: string; value: number }[];
            };
        };
    } | null;
}

const MonitoringDataDisplay: React.FC<MonitoringDataDisplayProps> = ({ monitoringData }) => {
    if (!monitoringData) {
        return <p>Aucune donnée de monitoring à afficher.</p>;
    }

    return (
        <div className="space-y-4">
            {Object.keys(monitoringData).map((deviceId) => (
                <div key={deviceId} className="mb-4 p-4 bg-gray-50 rounded-md shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Device: {deviceId}</h3>
                    <div className="space-y-4">
                        {Object.keys(monitoringData[deviceId].readings).map((sensorType) => (
                            <SensorChart
                                key={`${deviceId}-${sensorType}`}
                                sensorType={sensorType}
                                dataPoints={monitoringData[deviceId].readings[sensorType].map(reading => ({
                                    time: reading.time,
                                    value: reading.value,
                                }))}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MonitoringDataDisplay;