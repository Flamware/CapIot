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

const DataGraph: React.FC<DataGraphProps> = ({ monitoringData, selectedComponents }) => {
    if (!monitoringData || monitoringData.length === 0) return null;

    const readings = monitoringData[0]?.readings;
    if (!readings) return null;

    // Get all reading types dynamically
    const readingKeys = Object.keys(readings);

    // Merge all readings based on timestamps
    const chartData: Record<string, any>[] = [];
    if (readingKeys.length > 0) {
        const firstKey = readingKeys[0];
        readings[firstKey]?.forEach((point, index) => {
            const dataPoint: Record<string, any> = { time: new Date(point.time).toLocaleTimeString() };
            readingKeys.forEach((key) => {
                dataPoint[key] = readings[key]?.[index]?.value ?? null;

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

    return (
        <div className="bg-gray-50 rounded-xl shadow-inner p-4 mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Données de Monitoring
            </h2>

            <div className="h-96 w-full">
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        {readingKeys.map((key, idx) => (
                            <React.Fragment key={key}>
                                <Line
                                    type="monotone"
                                    dataKey={key}
                                    stroke={COLORS[idx % COLORS.length]}
                                    dot={false}
                                />
                                {/* Show thresholds if available */}
                                {selectedComponents?.some(c => c.component_subtype === key && c.min_threshold !== undefined) && (
                                    <Line
                                        type="monotone"
                                        dataKey={`${key}_min`}
                                        stroke={COLORS[idx % COLORS.length]}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name={`${key} min`}
                                    />
                                )}
                                {selectedComponents?.some(c => c.component_subtype === key && c.max_threshold !== undefined) && (
                                    <Line
                                        type="monotone"
                                        dataKey={`${key}_max`}
                                        stroke={COLORS[idx % COLORS.length]}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name={`${key} max`}
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
