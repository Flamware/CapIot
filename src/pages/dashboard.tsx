import React, { useState } from 'react';

type Device = {
    name: string;
    // Add other properties if needed
};

const Dashboard: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(false);

    // Get the Auth0 ID (for example, from the logged-in user token)

    const fetchDeviceList = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/devices', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDevices(data.devices);
            } else {
                console.error('Error fetching devices');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 ">
            <button
                className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600"
                onClick={fetchDeviceList}
                disabled={loading}
            >
                {loading ? 'Refreshing...' : 'Refresh Device List'}
            </button>

            <div className="my-5 border-b border-gray-300 pb-5">
                <h2 className="text-2xl font-semibold">Device List</h2>
                <div>
                    {devices.length === 0 ? (
                        <p>No devices found</p>
                    ) : (
                        <ul>
                            {devices.map((device, index) => (
                                <li key={index}>{device.name}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;