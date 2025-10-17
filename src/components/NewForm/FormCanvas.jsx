import React from 'react';
import EditableFieldWrapper from './EditableFieldWrapper'; // Import the wrapper

// This function will render your fields from the preview modal, but wrapped for editing
const renderPreviewField = (field) => {
    if (!field) return null;

    // A simple placeholder for most fields
    const genericPlaceholder = (label, type) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {field.label || label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-500 dark:text-gray-400">
                [{type} Placeholder]
            </div>
        </div>
    );
    
    // Customize rendering as needed, this is a simplified version
    switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'date':
            return genericPlaceholder(field.label, field.type);
        case 'textarea':
            return genericPlaceholder(field.label, 'Text Area');
        case 'image':
             return (
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                    <div className="w-full h-24 flex items-center justify-center border border-dashed ...">Image</div>
                 </div>
             );
        // Add other cases as needed...
        default:
            return genericPlaceholder(field.label, field.type);
    }
};


// Recursive function to render editable fields
const renderEditableField = (field, { selectedElement, setSelectedElement, handleDeleteField, handleDrop }) => {
    if (!field) return null;

    const isSelected = selectedElement?.id === field.id;

    // Handle Layout Row
    if (field.type === 'layout-row') {
        const gridColsClass = `grid-cols-${field.columns || 2}`;
        return (
            <EditableFieldWrapper
                key={field.id}
                field={field}
                isSelected={isSelected}
                onSelect={setSelectedElement}
                onDelete={handleDeleteField}
            >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                <div 
                    className={`grid ${gridColsClass} gap-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md min-h-[80px] bg-gray-50 dark:bg-gray-700/50`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.stopPropagation(); handleDrop(e, field.id); }} // Drop inside the row
                >
                    {(field.children || []).map(child =>
                        // --- RECURSIVE CALL ---
                        renderEditableField(child, { selectedElement, setSelectedElement, handleDeleteField, handleDrop })
                    )}
                </div>
            </EditableFieldWrapper>
        );
    }

    // Handle all other field types
    return (
        <EditableFieldWrapper
            key={field.id}
            field={field}
            isSelected={isSelected}
            onSelect={setSelectedElement}
            onDelete={handleDeleteField}
        >
            {/* Render a simplified preview of the field */}
            {renderPreviewField(field)}
        </EditableFieldWrapper>
    );
};


const FormCanvas = ({ formFields, selectedElement, setSelectedElement, handleDeleteField, handleDrop }) => {
    return (
        <div
            className="w-full h-full p-8 bg-gray-100 dark:bg-gray-900 overflow-y-auto group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, null)} // Drop on the main canvas
        >
            <div className="space-y-4">
                {formFields.length > 0 ? (
                    formFields.map(field => renderEditableField(field, { selectedElement, setSelectedElement, handleDeleteField, handleDrop }))
                ) : (
                    <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">Drag and drop a field here to start</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormCanvas;