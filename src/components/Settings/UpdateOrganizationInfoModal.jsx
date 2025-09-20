import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import ImageUploader from '../Common/ImageUploader';

// Helper component for form inputs - Updated for dark mode
const InputField = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input
            id={props.name}
            type={props.type || 'text'}
            {...props}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
);

const UpdateOrganizationInfoModal = ({ onClose }) => {
    const { organization, updateOrganizationDetails, updateOrganizationLogo } = useOrganization();
    const [formData, setFormData] = useState({ name: '', industry: '', website: '', phoneNumber: '', email: '', address: { street: '', city: '', state: '', zip: '', country: '' } });
    const [newLogo, setNewLogo] = useState(null); // FIX: Corrected variable name from 'newlogo' to 'newLogo'
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                industry: organization.industry || '',
                website: organization.website || '',
                phoneNumber: organization.phoneNumber || '',
                email: organization.email || '',
                address: {
                    street: organization.address?.street || '',
                    city: organization.address?.city || '',
                    state: organization.address?.state || '',
                    zip: organization.address?.zip || '',
                    country: organization.address?.country || ''
                }
            });
        }
    }, [organization]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const detailsResult = await updateOrganizationDetails(formData);
        
        // This will now work correctly
        if (newLogo) {
            await updateOrganizationLogo(organization._id, newLogo);
        }
        
        setIsSubmitting(false);
        if (detailsResult.success) {
            onClose();
        }
    };


    return (
        // Updated for dark mode
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Update Organization Information</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <ImageUploader
                            currentImageUrl={organization?.logo?.url}
                            folder={`organizations/${organization?._id}`}
                            onUploadSuccess={(data) => setNewLogo(data)}
                            placeholderText="Org Logo"
                        />
                    </div>
                    {/* Basic Info */}
                    <InputField label="Organization Name" name="name" value={formData.name} onChange={handleChange} />
                    <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} />
                    <InputField label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} />
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                    <InputField label="Website" name="website" type="url" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
                    
                    {/* Address Fields */}
                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 pt-2 border-t dark:border-gray-700">Address</h3>
                    <InputField label="Street" name="street" value={formData.address.street} onChange={handleAddressChange} />
                    <InputField label="City" name="city" value={formData.address.city} onChange={handleAddressChange} />
                    <InputField label="State / Province" name="state" value={formData.address.state} onChange={handleAddressChange} />
                    <InputField label="ZIP / Postal Code" name="zip" value={formData.address.zip} onChange={handleAddressChange} />
                    <InputField label="Country" name="country" value={formData.address.country} onChange={handleAddressChange} />

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
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

export default UpdateOrganizationInfoModal;