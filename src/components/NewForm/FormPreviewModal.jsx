import React from 'react';

// A recursive function to render any field, including those nested in layout rows
const renderField = (field) => {
    if (!field) return null;

    // The container for each field with its label
    const fieldWrapper = (label, content) => (
        <div key={field.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            {content}
        </div>
    );

    // In-line Content Image
    if (field.type === 'image') {
        return fieldWrapper(field.label, 
            <img src={field.url} alt={field.altText || 'Form image'} className="max-w-xs h-auto rounded-md border border-gray-200 dark:border-gray-700" />
        );
    }
    
    // Layout Row (renders children recursively)
    if (field.type === 'layout-row') {
        const columnClass = `grid-cols-${field.columns || 2}`;
        return fieldWrapper(field.label, 
            <div className={`grid ${columnClass} gap-4`}>
                {(field.children || []).map(child => renderField(child))}
            </div>
        );
    }

    // Standard input fields
    if (['text', 'email', 'number', 'ssn', 'date', 'tel'].includes(field.type)) {
        return fieldWrapper(field.label, 
            <input type={field.type} placeholder={field.placeholder} readOnly className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm" />
        );
    }

    // Textarea
    if (field.type === 'textarea') {
        return fieldWrapper(field.label, 
            <textarea placeholder={field.placeholder} rows={field.rows || 3} readOnly className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm" />
        );
    }

    // Select (Dropdown)
    if (field.type === 'select') {
        return fieldWrapper(field.label, 
            <select disabled className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm">
                {(field.options || []).map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
            </select>
        );
    }

    // Checkbox
    if (field.type === 'checkbox') {
        return fieldWrapper(field.label, 
            <div className="flex items-center mt-2">
                <input type="checkbox" disabled className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{field.value || 'Option'}</span>
            </div>
        );
    }
    
    // Radio Group
    if (field.type === 'radio-group') {
        return fieldWrapper(field.label, 
            <div className="space-y-2 mt-2">
                {(field.options || []).map((opt, i) => (
                    <div key={i} className="flex items-center">
                        <input type="radio" name={field.id} disabled className="h-4 w-4 text-blue-600 border-gray-300" />
                        <label className="ml-2 text-sm text-gray-600 dark:text-gray-300">{opt.label}</label>
                    </div>
                ))}
            </div>
        );
    }

    // Embed
    if (field.type === 'embed') {
         return fieldWrapper(field.label, 
            <div className="w-full h-32 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                [Embed Placeholder: {field.url}]
            </div>
        );
    }

    // Fallback for types from your original component
    if (field.type === 'file') {
        return fieldWrapper(field.label, 
            <div className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-400 text-sm flex items-center">[File Upload Placeholder]</div>
        );
    }
    if (field.type === 'signature') {
        return fieldWrapper(field.label, 
            <div className="w-full h-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">[Signature Pad Placeholder]</div>
        );
    }

    // Final fallback for any truly unsupported types
    return <p className="text-red-500 text-sm">Unsupported field type: {field.type}</p>;
};


const FormPreviewModal = ({ show, onClose, formName, formDescription, formFields, headerImage, watermarkImage }) => {
    if (!show) {
        return null;
    }

    const watermarkStyle = watermarkImage?.url ? {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${watermarkImage.url})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
    } : {};
    
    const darkWatermarkStyle = watermarkImage?.url ? {
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.96), rgba(17, 24, 39, 0.96)), url(${watermarkImage.url})`,
    } : {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 font-sans">
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col overflow-hidden">
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{formName} - Preview</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl focus:outline-none">
                        &times;
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 light-watermark dark:dark-watermark" style={watermarkStyle}>
                    {headerImage?.url && (
                        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex justify-center">
                            <img src={headerImage.url} alt="Form Header" className="max-w-xs max-h-32 h-auto object-contain" />
                        </div>
                    )}
                    {formDescription && <p className="text-gray-600 dark:text-gray-400 mb-6">{formDescription}</p>}
                    <form className="space-y-6">
                        {formFields.length > 0 ? formFields.map(field => renderField(field)) : <p>No fields added to the form yet.</p>}
                    </form>
                </div>
                
                <div className="sticky bottom-0 z-10 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                        Close Preview
                    </button>
                </div>
            </div>
            {/* Simple style block to apply dark mode watermark correctly */}
            <style>{`.dark .dark-watermark { background-image: ${darkWatermarkStyle.backgroundImage} !important; }`}</style>
        </div>
    );
};

export default FormPreviewModal;