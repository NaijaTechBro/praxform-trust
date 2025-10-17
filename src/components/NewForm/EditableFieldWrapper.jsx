import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { BsGripVertical } from 'react-icons/bs';

const EditableFieldWrapper = ({
    field,
    isSelected,
    setSelectedElement,
    handleDeleteField, // <-- 1. Change prop name from onDelete
    children,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
}) => {

    const handleSelect = (e) => {
        e.stopPropagation();
        setSelectedElement(field); 
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        // 2. Call the correct prop name here
        handleDeleteField(field.id);
    };
    
    const onDragOverHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const midpoint = rect.top + (rect.height / 2);
        const position = e.clientY < midpoint ? 'above' : 'below';
        handleDragOver(field.id, position);
    };

    const isIndicatorAbove = dropIndicator?.targetId === field.id && dropIndicator?.position === 'above';
    const isIndicatorBelow = dropIndicator?.targetId === field.id && dropIndicator?.position === 'below';

    const borderClass = isSelected
        ? 'border-blue-500 ring-2 ring-blue-500'
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600';

    return (
        <div className="relative group">
            {isIndicatorAbove && <div className="absolute top-[-2px] left-0 w-full h-1 bg-blue-500 rounded z-10" />}
            
            <div
                className={`p-4 rounded-lg bg-white dark:bg-gray-800 cursor-pointer transition-all duration-200 ${borderClass}`}
                onClick={handleSelect}
                onDragOver={onDragOverHandler}
            >
                <div
                    className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
                    draggable="true"
                    onDragStart={(e) => {
                        e.stopPropagation();
                        handleDragStart(field.id);
                    }}
                    onDragEnd={handleDragEnd}
                >
                    <BsGripVertical size={16} />
                </div>
                
                <div className="ml-6">
                    {children}
                </div>
                
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Field"
                >
                    <FiTrash2 size={14} />
                </button>
            </div>

            {isIndicatorBelow && <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-blue-500 rounded z-10" />}
        </div>
    );
};

export default EditableFieldWrapper;