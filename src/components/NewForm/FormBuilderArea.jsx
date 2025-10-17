import React from 'react';
import { FiPlus } from 'react-icons/fi';
import create from '../../assets/statscard/create.png';
import EditableFieldWrapper from './EditableFieldWrapper';
import SignaturePad from './SignaturePad';

// ... (renderPreviewField helper function is correct and unchanged) ...
const renderPreviewField = (field) => {
    if (!field) return null;
  
    if (field.type === 'signature') {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field.label || 'Signature'} {field.isRequired && <span className="text-red-500">*</span>}
                </label>
                <SignaturePad isBuilderPreview={true} />
            </div>
        );
    }
    const placeholderText = field.type.charAt(0).toUpperCase() + field.type.slice(1);
    const displayPlaceholder = field.placeholder || `[${placeholderText} Placeholder]`;
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {field.label || 'Field Label'} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-500 dark:text-gray-400 truncate">
                {displayPlaceholder}
            </div>
        </div>
    );
};


// ... (renderEditableField helper function is correct and unchanged) ...
const renderEditableField = (field, props) => {
    if (!field) return null;
    const { selectedElement } = props;
    const isSelected = selectedElement?.id === field.id;

    if (field.type === 'layout-row') {
        const gridColsClass = `grid-cols-${field.columns || 2}`;
        return (
            <EditableFieldWrapper
                key={field.id}
                field={field}
                isSelected={isSelected}
                {...props}
            >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                <div
                    className={`grid ${gridColsClass} gap-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md min-h-[100px] bg-gray-50 dark:bg-gray-700/50`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.stopPropagation(); props.handleDrop(e, field.id); }}
                >
                    {(field.children || []).map(child =>
                        renderEditableField(child, props)
                    )}
                </div>
            </EditableFieldWrapper>
        );
    }

    return (
        <EditableFieldWrapper
            key={field.id}
            field={field}
            isSelected={isSelected}
            {...props}
        >
            {renderPreviewField(field)}
        </EditableFieldWrapper>
    );
};


const FormBuilderArea = (props) => {
    // 1. Destructure handleDrop (the correct name) instead of onDrop
    const { 
        formFields, handleDrop, onStartFromScratch, onUseTemplate, 
        headerImage, watermarkImage 
    } = props;
    
    const handleDragOver = (e) => e.preventDefault();

    if (!formFields || formFields.length === 0) {
        return (
             <div
                className="min-h-[calc(100vh-170px)] bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center p-8"
                // 2. Use handleDrop here
                onDrop={(e) => handleDrop(e, null)}
                onDragOver={handleDragOver}
            >
                 <div className="text-center p-10 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg max-w-lg">
                    <img className="mx-auto mb-4" src={create} width="100px" alt="Create new form" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Create New Form</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-base">Drag and drop form elements here or start with a template.</p>
                     <div className="flex justify-center space-x-4">
                        <button onClick={onStartFromScratch} className="flex items-center bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                            <FiPlus className="mr-2" /> Start From Scratch
                        </button>
                        <button onClick={onUseTemplate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                            Use Template
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="w-full h-full p-8 bg-gray-100 dark:bg-gray-900 overflow-y-auto group"
            onDragOver={handleDragOver}
            // 3. And use handleDrop here
            onDrop={(e) => handleDrop(e, null)}
            onDragEnd={props.handleDragEnd}
        >
            {headerImage?.url && (
                <div className="mb-8 flex justify-center">
                    <img src={headerImage.url} alt="Form Header" className="max-w-md max-h-48 h-auto object-contain" />
                </div>
            )}
            <div className="space-y-4">
                {formFields.map(field => renderEditableField(field, props))}
            </div>
        </div>
    );
};

export default FormBuilderArea;