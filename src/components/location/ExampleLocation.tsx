import React, { useState, useEffect } from 'react';
import createApi from '../../axios/api';
import LocationsSection, { LocationItemProps } from './LocationSection.tsx'; // Import the correct type

interface Location {
    id: number; // Backend uses 'ID' (uppercase)
    location_name: string; // Backend uses 'Name' (uppercase)
    location_description: string; // Backend uses 'Description'
}

const ExampleLocations = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const api = createApi();

    useEffect(() => {
        fetchUserLocations();
    }, []);

    const fetchUserLocations = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/me/locations');
            console.log('User Locations:', response.data);
            // Assuming the backend returns an array of Location objects
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching user locations:', error);
            // Handle error appropriately
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (locationName: string) => {
        console.log(`Voir les détails pour ${locationName}`);
        // Implement your logic
    };

    const handleToggleNotifications = (locationName: string) => {
        console.log(`Activer/désactiver les notifications pour ${locationName}`);
        // Implement your logic
    };

    const handleViewChart = (locationName: string) => {
        console.log(`Voir le graphique pour ${locationName}`);
        // Implement your logic
    };

    const handleSetupNewLocation = () => {
        console.log('Configurer un nouvel emplacement');
        // Implement your logic
    };

    if (loading) {
        return <div>Chargement des localisations...</div>;
    }

    return (
        <div>
            <LocationsSection
                locationsData={locations.map(loc => ({
                    id: String(loc.id), // Convert backend 'ID' to string for frontend 'id'
                    location_name: loc.location_name, // Use backend 'Name'
                    lastUpdated: 'N/A', // Backend doesn't provide this, you might need to fetch it separately or calculate it
                    status: 'N/A', // Backend doesn't provide a direct status, you might need to determine it based on other data
                    sensorData: {
                        temperature: 0, // Backend doesn't provide sensor data here
                        humidity: 0,
                        airPurity: 0,
                        nh2Levels: 0,
                        photocatalyseFonctionne: null,
                        ionisateurFonctionne: null,
                        ozoneNiveauDeclenchement: null,
                        capteurQualiteAir: null,
                        capteurPolluantSpecifique: null,
                        capteurEfficaciteAutreSysteme: null,
                    },
                }))}
                onViewDetails={handleViewDetails}
                onToggleNotifications={handleToggleNotifications}
                onViewChart={handleViewChart}
                onSetupNewLocation={handleSetupNewLocation}
            />
        </div>
    );
};

export default ExampleLocations;