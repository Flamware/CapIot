// components/monitoring/SensorChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js/auto';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SensorChartProps {
    sensorType: string;
    dataPoints: { time: string; value: number }[];
}

const SensorChart: React.FC<SensorChartProps> = ({ sensorType, dataPoints }) => {
    const chartData = {
        labels: dataPoints.map(data => new Date(data.time).toLocaleTimeString()),
        datasets: [
            {
                label: sensorType.charAt(0).toUpperCase() + sensorType.slice(1), // Capitalize sensor type
                data: dataPoints.map(data => data.value),
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const chartOptions: any = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Évolution de ${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}`,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Heure',
                },
            },
            y: {
                title: {
                    display: true,
                    text: sensorType,
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-md shadow-md p-4">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default SensorChart;