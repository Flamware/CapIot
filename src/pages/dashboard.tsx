import React from 'react';
import ExampleLocations from "../components/location/ExampleLocation.tsx"; // Corrected import path and component name

const Dashboard: React.FC = () => {
    return (
        <div className="p-5 bg-gray-300 rounded-lg shadow-md max-w-7xl mx-auto">
            <div className="mb-5 border-b border-gray-300 pb-5">
                <h2 className="text-2xl font-semibold mb-3">Monitored Locations</h2>
                <ExampleLocations />
            </div>
        </div>
    );
};

export default Dashboard;