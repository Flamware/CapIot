import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChartLine, faChevronRight, faSun, faWind, faBolt } from '@fortawesome/free-solid-svg-icons'; // Added icons

interface SensorData {
    photocatalyseFonctionne: boolean | null;
    ionisateurFonctionne: boolean | null;
    ozoneNiveauDeclenchement: number | null;
    capteurQualiteAir: number | null;
    capteurPolluantSpecifique: number | null;
    capteurEfficaciteAutreSysteme: number | null;
}

interface LocationCardProps {
    name: string;
    lastUpdated: string;
    status: string; // Can be 'Normal', 'Warning', 'Critical', 'Ozone Actif', etc.
    sensorData: SensorData;
    onViewDetails: () => void;
    onToggleNotifications: () => void;
    onViewChart: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
                                                       name,
                                                       lastUpdated,
                                                       status,
                                                       sensorData,
                                                       onViewDetails,
                                                       onToggleNotifications,
                                                       onViewChart,
                                                   }) => {
    const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'Normal':
                return 'bg-green-100 text-green-800';
            case 'Warning':
                return 'bg-yellow-100 text-yellow-800';
            case 'Critical':
                return 'bg-red-100 text-red-800';
            case 'Ozone Actif':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white location-card p-6 rounded-lg shadow transition duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-black">{name}</h3>
                    <p className="text-gray-500 text-sm">
                        Dernière mise à jour : <span className="text-gray-700">{lastUpdated}</span>
                    </p>
                </div>
                <span className={`${getStatusColorClass(status)} text-xs px-2 py-1 rounded-full`}>{status}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-gray-500 text-sm">Qualité Air</p>
                    <p className="font-bold">
                        <span className="sensor-value">{sensorData.capteurQualiteAir !== null ? `${sensorData.capteurQualiteAir}%` : 'N/A'}</span>
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Polluant Spécifique</p>
                    <p className="font-bold">
                        <span className="sensor-value">{sensorData.capteurPolluantSpecifique !== null ? `${sensorData.capteurPolluantSpecifique} ppm` : 'N/A'}</span>
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Efficacité Système</p>
                    <p className="font-bold">
                        <span className="sensor-value">{sensorData.capteurEfficaciteAutreSysteme !== null ? `${sensorData.capteurEfficaciteAutreSysteme}%` : 'N/A'}</span>
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Photocatalyse</p>
                    <p className="font-semibold">
                        {sensorData.photocatalyseFonctionne === true ? (
                            <span className="text-green-600"><FontAwesomeIcon icon={faSun} className="mr-1" />Activée</span>
                        ) : sensorData.photocatalyseFonctionne === false ? (
                            <span className="text-red-600"><FontAwesomeIcon icon={faSun} className="mr-1" />Désactivée</span>
                        ) : (
                            'N/A'
                        )}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Ionisateur</p>
                    <p className="font-semibold">
                        {sensorData.ionisateurFonctionne === true ? (
                            <span className="text-green-600"><FontAwesomeIcon icon={faWind} className="mr-1" />Activé</span>
                        ) : sensorData.ionisateurFonctionne === false ? (
                            <span className="text-red-600"><FontAwesomeIcon icon={faWind} className="mr-1" />Désactivé</span>
                        ) : (
                            'N/A'
                        )}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Ozone</p>
                    <p className="font-semibold">
                        {sensorData.ozoneNiveauDeclenchement !== null ? (
                            <span className="text-purple-600"><FontAwesomeIcon icon={faBolt} className="mr-1" />Activé ({sensorData.ozoneNiveauDeclenchement})</span>
                        ) : (
                            'Désactivé'
                        )}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
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