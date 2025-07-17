import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import {createApi} from '../../axios/api'; // Corrected import

interface AddNewLocationCardProps {
    onLocationCreated: () => void; // Callback to notify parent of successful creation
}

const AddNewLocationCard: React.FC<AddNewLocationCardProps> = ({ onLocationCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLocationName, setNewLocationName] = useState('');
    const [newLocationDescription, setNewLocationDescription] = useState('');
    const [creationError, setCreationError] = useState<string | null>(null);
    const api = createApi();

    const openModal = () => {
        setIsModalOpen(true);
        setCreationError(null); // Clear any previous errors
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewLocationName('');
        setNewLocationDescription('');
        setCreationError(null);
    };

    const handleCreateLocation = async () => {
        if (newLocationName.trim()) {
            try {
                const response = await api.post('/location/create', {
                    location_name: newLocationName,
                    location_description: newLocationDescription,
                });
                console.log('Location created successfully:', response.data);
                onLocationCreated(); // Notify the parent component
                closeModal();
            } catch (error: any) {
                console.error('Error creating location:', error);
                setCreationError('Failed to create location. Please try again.');
                if (error.response && error.response.data && error.response.data.message) {
                    setCreationError(`Failed to create location: ${error.response.data.message}`);
                }
            }
        } else {
            setCreationError('Please enter a location name.');
        }
    };

    return (
        <>
            <div
                className="bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 p-6 rounded-lg shadow-sm transition duration-300 flex flex-col items-center justify-center cursor-pointer"
                onClick={openModal}
            >
                <div className="bg-green-50 p-4 rounded-full mb-3">
                    <FontAwesomeIcon icon={faPlus} className="text-green-600 text-xl" />
                </div>
                <h3 className="font-medium text-gray-700 mb-1">Add New Location</h3>
                <p className="text-gray-500 text-sm text-center">Connect new sensors to monitor additional areas</p>
            </div>

            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Create New Location
                                        </h3>
                                        <div className="mt-2">
                                            <div>
                                                <label htmlFor="location-name" className="block text-sm font-medium text-gray-700">
                                                    Location Name
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        name="location-name"
                                                        id="location-name"
                                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="Living Room, Office, etc."
                                                        value={newLocationName}
                                                        onChange={(e) => setNewLocationName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="location-description" className="block text-sm font-medium text-gray-700">
                                                    Description (Optional)
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        id="location-description"
                                                        name="location-description"
                                                        rows={3}
                                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="Details about this location"
                                                        value={newLocationDescription}
                                                        onChange={(e) => setNewLocationDescription(e.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            {creationError && (
                                                <div className="mt-4 text-red-500 text-sm">
                                                    {creationError}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 pt-4 pr-4 sm:block">
                                        <button
                                            type="button"
                                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            onClick={closeModal}
                                        >
                                            <span className="sr-only">Close</span>
                                            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleCreateLocation}
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddNewLocationCard;