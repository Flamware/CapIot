import {createApi} from '../../axios/api';
import {useEffect, useState} from "react"; // Import the correct type

interface Location {
    id: number; // Backend uses 'ID' (uppercase)
    location_name: string; // Backend uses 'Name' (uppercase)
    location_description: string; // Backend uses 'Description'
}

const ExampleLocations = () => {
    const [locations, setLocations] = useState<Location[] | null>([]); // Allow null as a possible state
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
            // Assuming the backend returns an array of Location objects or null
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching user locations:', error);
            // Handle error appropriately
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div>Chargement des localisations...</div>;
    }

    // Check if locations is null or an empty array
    if (!locations || locations.length === 0) {
        return <div>Aucune localisation trouvée.</div>;
    }

    return (
        <div>

        </div>
    );
};

export default ExampleLocations;