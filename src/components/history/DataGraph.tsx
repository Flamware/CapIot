import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { Component, DeviceReadings } from "../types/device.ts";

interface DataGraphProps {
    monitoringData: DeviceReadings[];
    selectedComponents?: Component[];
}

const COLORS = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#f97316",
    "#8b5cf6",
    "#eab308",
    "#14b8a6",
    "#ec4899",
    "#6366f1",
];

/**
 * Custom Tooltip component for Recharts to display full date/time and handle null values.
 */
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // Format the ISO label string (e.g., "2025-10-06T10:31:00Z") into a human-readable datetime
        const formattedDate = new Date(label).toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        return (
            <div className="p-3 bg-white border border-gray-300 shadow-lg rounded-lg text-sm backdrop-blur-sm bg-opacity-80">
                <p className="font-bold text-gray-800 mb-2 border-b pb-1">{formattedDate}</p>
                {payload.map((item: any, index: number) => {
                    // Filter out min/max lines from the main list in the tooltip body
                    if (item.dataKey.endsWith('_min') || item.dataKey.endsWith('_max')) return null;

                    return (
                        <p key={index} style={{ color: item.color }} className="text-gray-700">
                            {`${item.name}: `}
                            <span className="font-mono font-semibold">
                                {item.value === null ? 'N/A' : item.value.toFixed(3)}
                            </span>
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};

/**
 * Formats the time tick on the XAxis to show date and time for better context.
 * Shows "JJ/MM HH:mm".
 */
const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    // Format to "DD/MM HH:mm" for better context, especially when spanning days.
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};


const DataGraph: React.FC<DataGraphProps> = ({ monitoringData, selectedComponents }) => {
    // The hook ensures monitoringData is null if there's no data, or if no actual readings were found.
    if (!monitoringData || monitoringData.length === 0) return null;

    // We assume monitoringData always contains data for a single device for simplicity
    const readings = monitoringData[0]?.readings;
    if (!readings) return null;

    // Get all reading types dynamically
    const readingKeys = Object.keys(readings);

    // Merge all readings based on timestamps (guaranteed to be aligned by useInfluxDB's densifyData)
    const chartData: Record<string, any>[] = [];
    if (readingKeys.length > 0) {
        const firstKey = readingKeys[0];

        // Iterate over the densified array (guaranteed to have all time steps)
        readings[firstKey]?.forEach((point, index) => {
            // Use the raw ISO string time as the primary data key for Recharts
            const dataPoint: Record<string, any> = { time: point.time };

            readingKeys.forEach((key) => {
                // Since the arrays are aligned by index, this lookup works for densified data
                const value = readings[key]?.[index]?.value;
                dataPoint[key] = value ?? null; // explicitly set null for missing values

                // Find matching component for thresholds
                const component = selectedComponents?.find(c => c.component_subtype === key);
                if (component) {
                    if (component.min_threshold !== undefined) dataPoint[`${key}_min`] = component.min_threshold;
                    if (component.max_threshold !== undefined) dataPoint[`${key}_max`] = component.max_threshold;
                }
            });
            chartData.push(dataPoint);
        });
    }

    // If chartData is empty after processing, return null
    if (chartData.length === 0) return null;


    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Données de Monitoring
            </h2>

            <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="time"
                            tickFormatter={formatXAxis}
                            interval="preserveStartEnd"
                            minTickGap={20}
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis style={{ fontSize: '12px' }}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }}/>

                        {readingKeys.map((key, idx) => (
                            <React.Fragment key={key}>
                                <Line
                                    type="monotone"
                                    dataKey={key}
                                    stroke={COLORS[idx % COLORS.length]}
                                    strokeWidth={2}
                                    dot={false}
                                    connectNulls={false} // Ensure null gaps are not connected
                                />
                                {/* Show thresholds if available */}
                                {selectedComponents?.some(c => c.component_subtype === key && c.min_threshold !== undefined) && (
                                    <Line
                                        type="monotone"
                                        dataKey={`${key}_min`}
                                        stroke={COLORS[idx % COLORS.length]}
                                        strokeDasharray="5 5"
                                        strokeWidth={1}
                                        dot={false}
                                        name={`Seuil min (${key})`} // Descriptive name for legend/tooltip
                                        activeDot={false}
                                        connectNulls={true} // Thresholds should span the entire range
                                    />
                                )}
                                {selectedComponents?.some(c => c.component_subtype === key && c.max_threshold !== undefined) && (
                                    <Line
                                        type="monotone"
                                        dataKey={`${key}_max`}
                                        stroke={COLORS[idx % COLORS.length]}
                                        strokeDasharray="5 5"
                                        strokeWidth={1}
                                        dot={false}
                                        name={`Seuil max (${key})`} // Descriptive name for legend/tooltip
                                        activeDot={false}
                                        connectNulls={true} // Thresholds should span the entire range
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DataGraph;
