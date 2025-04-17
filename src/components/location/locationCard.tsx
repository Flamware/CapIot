import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChartLine, faChevronRight, faQuestionCircle, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { LocationData } from "./Props";

interface LocationCardProps {
    location_name: string;
    devices: LocationData['devices']; // Explicitly type 'devices'
    lastUpdated: string;
    status: string;
    onViewDetails: () => void;
    onToggleNotifications: () => void;
    onViewChart: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
                                                       location_name,
                                                       devices,
                                                       lastUpdated,
                                                       status,
                                                       onViewDetails,
                                                       onToggleNotifications,
                                                       onViewChart,
                                                   }) => {
    const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-100 text-green-800';
            case 'offline': return 'bg-red-100 text-red-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white location-card p-6 rounded-lg shadow transition duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-black">{location_name}</h3>
                    <p className="text-gray-500 text-sm">
                        Dernière mise à jour : <span className="text-gray-700">{lastUpdated}</span>
                    </p>
                </div>
                <span className={`${getStatusColorClass(status)} text-xs px-2 py-1 rounded-full capitalize`}>{status}</span>
            </div>

            <div className="mb-4">
                <h4 className="font-semibold text-md text-gray-700 mb-2">Appareils:</h4>
                {devices && devices.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {devices.map((device) => (
                            <div key={device.device_id} className="bg-gray-50 p-4 rounded-md">
                                <div className="flex items-center mb-2">
                                    <FontAwesomeIcon icon={faMicrochip} className="mr-2 text-gray-400" />
                                    <h5 className="font-semibold text-gray-700">{device.device_id}</h5>
                                    <span className={`ml-2 text-xs px-2 py-1 rounded-full capitalize ${getStatusColorClass(device.status ?? 'unknown')}`}>{device.status ?? 'N/A'}</span>
                                </div>
                                {device.captors && device.captors.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-2">
                                        <h6 className="col-span-full font-semibold text-gray-600">Capteurs:</h6>
                                        {device.captors.map((captor) => (
                                            <div key={captor.captor_id} className="bg-white p-2 rounded-md shadow-sm">
                                                <p className="text-gray-600">{captor.captor_id || captor.captor_type}</p>

                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-2">Aucun capteur pour cet appareil.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        <FontAwesomeIcon icon={faQuestionCircle} className="mb-2" />
                        <p className="text-sm">Aucun appareil disponible pour ce lieu.</p>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
                <button onClick={onViewDetails} className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none">
                    Voir Détails <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
                </button>
                <div className="flex space-x-1">
                    <button onClick={onToggleNotifications} className="text-gray-400 hover:text-blue-600 focus:outline-none">
                        <FontAwesomeIcon icon={faBell} />
                    </button>
                    <button onClick={onViewChart} className="text-gray-400 hover:text-blue-600 focus:outline-none">
                        <FontAwesomeIcon icon={faChartLine} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationCard;