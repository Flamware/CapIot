// components/monitoring/MonitoringDataDisplay.tsx
import React from 'react';
import SensorChart from './SensorChart';

interface MonitoringDataDisplayProps {
    monitoringData: {
        [deviceID: string]: {
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
            {Object.keys(monitoringData).map((deviceID) => (
                <div key={deviceID} className="mb-4 p-4 bg-gray-50 rounded-md shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Device: {deviceID}</h3>
                    <div className="space-y-4">
                        {Object.keys(monitoringData[deviceID].readings).map((sensorType) => (
                            <SensorChart
                                key={`${deviceID}-${sensorType}`}
                                sensorType={sensorType}
                                dataPoints={monitoringData[deviceID].readings[sensorType].map(reading => ({
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