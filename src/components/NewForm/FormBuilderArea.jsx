import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import create from '../../assets/statscard/create.png';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../Common/ImageUploader';

const FormBuilderArea = ({
    formFields,
    setFormFields,
    setSelectedElement,
    selectedElement,
    onDeleteField,
    onDrop,
    onStartFromScratch,
    onUseTemplate,
    headerImage,
    watermarkImage
}) => {
    const navigate = useNavigate();

    const handleInlineImageUpload = (fieldId, imageData) => {
        const updatedFields = formFields.map(field => {
            if (field.id === fieldId) {
                return { ...field, ...imageData };
            }
            return field;
        });
        setFormFields(updatedFields);
    };

    const handleDragOver = (e) => e.preventDefault();
    
    const renderField = (field) => {
        if (!field) return null;
        const isSelected = selectedElement && selectedElement.id === field.id;

        if (field.type === 'image') {
            return (
                <div key={field.id} onClick={() => setSelectedElement(field)} className={`relative p-4 mb-4 border rounded-lg cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                    {field.url ? (
                        <img 
                            src={field.url} 
                            alt={field.altText || 'Form content image'} 
                            className="w-full max-h-64 object-contain rounded-md bg-gray-100 dark:bg-gray-700" 
                        />
                    ) : (
                        <ImageUploader 
                            folder={`forms/inline_images`}
                            onUploadSuccess={(data) => handleInlineImageUpload(field.id, data)}
                            placeholderText="Upload Content Image"
                        />
                    )}
                     <button onClick={(e) => { e.stopPropagation(); onDeleteField(field.id); }} className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none">
                        <FiTrash2 size={16} />
                     </button>
                </div>
            );
        }

        // Fallback for other simple types for brevity
        return (
            <div key={field.id} onClick={() => setSelectedElement(field)} className={`relative p-4 mb-4 border rounded-lg cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" readOnly />
                <button onClick={(e) => { e.stopPropagation(); onDeleteField(field.id); }} className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none">
                    <FiTrash2 size={16} />
                </button>
            </div>
        );
    };

     // Light mode style for the watermark (this is correct)
    const watermarkStyle = watermarkImage?.url ? {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${watermarkImage.url})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
    } : {};
    
    // FIX: Corrected styles for the dark mode watermark
    const darkWatermarkStyle = watermarkImage?.url ? {
        backgroundImage: `linear-gradient(rgba(31, 41, 55, 0.96), rgba(31, 41, 55, 0.96)), url(${watermarkImage.url})`, // Using gray-800 with 96% opacity
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
    } : {};


    if (formFields.length === 0) {
        return (
            <div
                className="min-h-[calc(100vh-170px)] bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center p-8"
                onDrop={(e) => onDrop(e)}
                onDragOver={handleDragOver}
            >
                <div className="text-center p-10 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg max-w-lg">
                    <img className="mx-auto mb-4" src={create} width="100px" alt="Create new form" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Create New Form</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-base">Drag and drop form elements from the left sidebar or start with a template</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={onStartFromScratch}
                            className="flex items-center bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <FiPlus className="mr-2" /> Start From Scratch
                        </button>
                        <button
                            onClick={onUseTemplate}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                            Use Template
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 min-h-[calc(100vh-170px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            onDrop={(e) => onDrop(e)}
            onDragOver={handleDragOver}
            style={{ ...watermarkStyle, ...darkWatermarkStyle }}
        >
            {headerImage?.url && (
                <div className="mb-8 flex justify-center">
                    <img src={headerImage.url} alt="Form Header" className="max-w-md max-h-48 h-auto object-contain" />
                </div>
            )}
            {formFields.map((field) => renderField(field))}
            <style>{`.dark .dark-watermark { background-image: ${darkWatermarkStyle.backgroundImage} !important; }`}</style>
        </div>
    );
};

export default FormBuilderArea;