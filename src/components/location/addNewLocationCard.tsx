import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface AddNewLocationCardProps {
    onSetupLocation: () => void;
}

const AddNewLocationCard: React.FC<AddNewLocationCardProps> = ({ onSetupLocation }) => (
    <div className="bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 p-6 rounded-lg shadow-sm transition duration-300 flex flex-col items-center justify-center">
        <div className="bg-blue-50 p-4 rounded-full mb-3">
            <FontAwesomeIcon icon={faPlus} className="text-blue-600 text-xl" />
        </div>
        <h3 className="font-medium text-gray-700 mb-1">Add New Location</h3>
        <p className="text-gray-500 text-sm text-center">Connect new sensors to monitor additional areas</p>
        <button
            onClick={onSetupLocation}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none"
        >
            Setup Location
        </button>
    </div>
);

export default AddNewLocationCard;