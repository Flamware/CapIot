import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Component} from "../types/device.ts";
import {Timer} from "lucide-react";

interface ComponentStatsGraphProps {
    components: Component[];
}

const ComponentStatsGraph: React.FC<ComponentStatsGraphProps> = ({ components }) => {
    // Filter to get only components that have running hour data
    const componentsWithRunTime = components.filter(c =>
        c.current_running_hours !== undefined && c.current_running_hours !== null
    );

    if (componentsWithRunTime.length === 0) {
        return null; // Don't render anything if no relevant data is available
    }

    // Prepare data for the bar chart
    const chartData = componentsWithRunTime.map(c => ({
        name: c.component_id,
        'Temps de run (heures)': c.current_running_hours,
        'Temps max (heures)': c.max_running_hours || 0,
    }));

    const getProgressBarColor = (current: number, max: number | undefined) => {
        if (max === undefined || max === 0) return 'bg-gray-400';
        const percentage = (current / max) * 100;
        if (percentage > 90) return 'bg-red-500';
        if (percentage > 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="space-y-8 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                Statistiques des composants
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {componentsWithRunTime.map(component => (
                    <div key={component.component_id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                            <Timer className="text-green-500 mr-2" size={20} />
                            <h3 className="font-semibold text-lg text-gray-700">
                                {component.component_subtype || 'Composant'}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">ID: {component.component_id}</p>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div
                                className={`h-2.5 rounded-full ${getProgressBarColor(component.current_running_hours, component.max_running_hours)}`}
                                style={{
                                    width: `${(component.current_running_hours / (component.max_running_hours || 1)) * 100}%`
                                }}
                            ></div>
                        </div>

                        <div className="flex justify-between text-sm font-medium text-gray-600">
                            <span>{component.current_running_hours.toFixed(1)}h</span>
                            <span>{component.max_running_hours ? `${component.max_running_hours.toFixed(1)}h max` : 'N/A'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recharts Bar Chart */}
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Temps de run (heures)" fill="#82ca9d" />
                        <Bar dataKey="Temps max (heures)" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ComponentStatsGraph;
