import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import phone from '../../assets/phone.png'

const UpdateNumberModal = ({ onClose }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+234');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Update number:', { countryCode, phoneNumber });
        toast.success('Phone number updated successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <FiX size={24} />
                </button>
                <div className="flex flex-col items-center mb-6">
                    <h2 className="block text-xl font-bold text-gray-800">Update Phone Number</h2>
                    <img src={phone} alt="Phone Icon" className="mb-4" width="80px" />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Phone Number</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="pl-3 py-2 border border-gray-300 rounded-l-md"
                            >
                                <option value="+234">🇳🇬 +234</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+44">🇬🇧 +44</option>
                                {/* Add more country codes as needed */}
                            </select>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="flex-1 block w-full pl-3 py-2 border border-gray-300 rounded-r-md"
                                placeholder="000 000 0000"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-full bg-blue-600 text-white flex items-center hover:bg-blue-700"
                        >
                            Update Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateNumberModal;
