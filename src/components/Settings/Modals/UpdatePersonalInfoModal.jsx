import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ImageUploader from '../../Common/ImageUploader'; // Import the new component

const UpdatePersonalInfoModal = ({ onClose }) => {
    const { user, updatePersonalInfo, updateUserAvatar } = useAuth();
    const [formData, setFormData] = useState({ firstName: '', lastName: '' });
    const [newAvatar, setNewAvatar] = useState(null); // State to hold new avatar details
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Await both operations
        const infoResult = await updatePersonalInfo(formData);
        if (newAvatar) {
            await updateUserAvatar(newAvatar);
        }

        setIsSubmitting(false);
        if (infoResult.success) {
            onClose(); // Close modal on success
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Update Personal Information</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* --- Image Uploader Integration --- */}
                    <div className="mb-6">
                        <ImageUploader
                            currentImageUrl={user?.avatar?.url}
                            folder={`users/${user?._id}`}
                            onUploadSuccess={(data) => setNewAvatar(data)}
                            placeholderText="Your Avatar"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePersonalInfoModal;