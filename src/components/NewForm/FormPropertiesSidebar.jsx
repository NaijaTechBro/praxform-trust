import React from 'react';
import ImageUploader from '../Common/ImageUploader'; // Ensure this path is correct

const FormPropertiesSidebar = ({ 
    formName, setFormName, 
    formDescription, setFormDescription, 
    headerImageUrl, onHeaderImageUpload,
    watermarkImageUrl, onWatermarkImageUpload,
    formId 
}) => {
    return (
        <div className="w-full h-full p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Form Properties</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="formName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Form Name</label>
                    <input
                        type="text"
                        id="formName"
                        className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md text-sm"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="formDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        id="formDescription"
                        rows="4"
                        className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md text-sm"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Header Image / Logo</label>
                    <ImageUploader
                        currentImageUrl={headerImageUrl}
                        folder={`forms/${formId}/header`}
                        onUploadSuccess={onHeaderImageUpload}
                        placeholderText="Form Header"
                        uniqueId="header-image"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Watermark Image</label>
                    <ImageUploader
                        currentImageUrl={watermarkImageUrl}
                        folder={`forms/${formId}/watermark`}
                        onUploadSuccess={onWatermarkImageUpload}
                        placeholderText="Watermark"
                        uniqueId="watermark-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default FormPropertiesSidebar;