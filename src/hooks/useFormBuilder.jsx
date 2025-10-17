// import { useState, useEffect, useCallback } from 'react';
// import { useForms } from '../context/FormContext';
// import { useTemplates } from '../context/TemplateContext';
// import { toast } from 'react-toastify';
// import { useParams, useNavigate } from 'react-router-dom';

// export const useFormBuilder = (mode = 'create') => {
//     const { id: paramId } = useParams();
//     const navigate = useNavigate();
    
//     // Contexts
//     const { createForm, updateForm, getFormById, currentForm, clearCurrentForm, updateFormHeaderImage, updateFormWatermarkImage } = useForms();
//     const { createTemplate, getTemplateById, currentTemplate, updateTemplateHeaderImage, updateTemplateWatermarkImage } = useTemplates();

//     // Form Data State
//     const [formId, setFormId] = useState(null);
//     const [formName, setFormName] = useState('Untitled Form');
//     const [formDescription, setFormDescription] = useState('');
//     const [formFields, setFormFields] = useState([]);
//     const [headerImage, setHeaderImage] = useState(null);
//     const [watermarkImage, setWatermarkImage] = useState(null);
//     const [selectedElement, setSelectedElement] = useState(null);
//     const [status, setStatus] = useState('draft');
    
//     // UI State
//     const [isSaving, setIsSaving] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);

//     // Populate state when editing or creating from a template
//     useEffect(() => {
//         setIsLoading(true);
//         if (mode === 'edit' && paramId) {
//             getFormById(paramId);
//         } else if (mode === 'template' && paramId) {
//             getTemplateById(paramId);
//         } else {
//             setIsLoading(false); // For blank form creation
//         }
//         return () => clearCurrentForm();
//     }, [paramId, mode, getFormById, getTemplateById, clearCurrentForm]);
    
//     useEffect(() => {
//         const source = mode === 'edit' ? currentForm : currentTemplate;
//         if (source) {
//             setFormId(source._id);
//             setFormName(mode === 'template' ? `Copy of ${source.name}` : source.name);
//             setFormDescription(source.description || '');
//             setFormFields(JSON.parse(JSON.stringify(source.fields || [])));
//             setHeaderImage(source.headerImage || null);
//             setWatermarkImage(source.settings?.watermarkImage || null);
//             setStatus(source.status || 'draft');
//             setIsLoading(false);
//         }
//     }, [currentForm, currentTemplate, mode]);

//     const handleDrop = useCallback((e, targetRowId = null) => {
//         e.preventDefault();
//         const fieldType = e.dataTransfer.getData('fieldType');
//         const newField = {
//             id: Date.now().toString(),
//             type: fieldType,
//             label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
//             placeholder: `Enter value`,
//             isRequired: false,
//             // Add default properties for new types
//             ...(fieldType === 'image' && { altText: 'Form image' }),
//             ...(fieldType === 'layout-row' && { children: [], columns: 2 }),
//         };
        
//         setFormFields(prevFields => {
//             if (targetRowId) {
//                 // Recursive function to add field to a nested row
//                 const addRecursive = fields => fields.map(f => {
//                     if (f.id === targetRowId) {
//                         return { ...f, children: [...(f.children || []), newField] };
//                     }
//                     if (f.type === 'layout-row' && f.children) {
//                         return { ...f, children: addRecursive(f.children) };
//                     }
//                     return f;
//                 });
//                 return addRecursive(prevFields);
//             }
//             return [...prevFields, newField];
//         });
//         setSelectedElement(newField);
//     }, []);

//     const handleUpdateElement = useCallback((updatedElement) => {
//         const updateRecursive = (fields) => fields.map(f => {
//             if (f.id === updatedElement.id) return updatedElement;
//             if (f.type === 'layout-row' && f.children) {
//                 return { ...f, children: updateRecursive(f.children) };
//             }
//             return f;
//         });
//         setFormFields(prevFields => updateRecursive(prevFields));
//         setSelectedElement(updatedElement);
//     }, []);
    
//     const handleDeleteField = useCallback((fieldId) => {
//         const deleteRecursive = (fields) => fields.filter(f => {
//             if (f.id === fieldId) return false;
//             if (f.type === 'layout-row' && f.children) {
//                 f.children = deleteRecursive(f.children);
//             }
//             return true;
//         });
//         setFormFields(prevFields => deleteRecursive(prevFields));
//         if (selectedElement?.id === fieldId) setSelectedElement(null);
//     }, [selectedElement]);

//     const handleHeaderImageUpload = async (imageData) => {
//         if (!formId) {
//             toast.error("Please save the form as a draft before adding an image.");
//             return;
//         }
//         const result = await (mode === 'edit' ? updateFormHeaderImage(formId, imageData) : updateTemplateHeaderImage(formId, imageData));
//         if (result.success) setHeaderImage(result.headerImage);
//     };

//     const handleWatermarkImageUpload = async (imageData) => {
//         if (!formId) {
//             toast.error("Please save the form as a draft first.");
//             return;
//         }
//         const result = await (mode === 'edit' ? updateFormWatermarkImage(formId, imageData) : updateTemplateWatermarkImage(formId, imageData));
//         if (result.success) setWatermarkImage(result.watermarkImage);
//     };

//     const handleSave = async () => {
//         setIsSaving(true);
//         const payload = {
//             name: formName,
//             description: formDescription,
//             fields: formFields,
//             headerImage,
//             settings: { watermarkImage },
//             status: 'draft'
//         };

//         try {
//             if (formId && mode === 'edit') {
//                 await updateForm(formId, payload);
//                 toast.success("Form updated successfully!");
//             } else {
//                 const newForm = await createForm(payload);
//                 setFormId(newForm._id);
//                 // Redirect to the new edit page after creation
//                 navigate(`/forms/edit/${newForm._id}`, { replace: true });
//                 toast.success("Form created successfully!");
//             }
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to save.");
//         } finally {
//             setIsSaving(false);
//         }
//     };
    
//     return {
//         // State
//         formId, formName, formDescription, formFields, headerImage, watermarkImage, selectedElement, status, isSaving, isLoading,
//         // Setters
//         setFormName, setFormDescription,
//         setFormFields,
//         setSelectedElement,
//         // Handlers
//         handleDrop, handleUpdateElement, handleDeleteField,
//         handleHeaderImageUpload, handleWatermarkImageUpload, handleSave
//     };
// };








import { useState, useEffect, useCallback } from 'react';
import { useForms } from '../context/FormContext';
import { useTemplates } from '../context/TemplateContext';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

export const useFormBuilder = (mode = 'create') => {
    const { id: paramId } = useParams();
    const navigate = useNavigate();
    
    // Contexts
    const { createForm, updateForm, getFormById, currentForm, clearCurrentForm, updateFormHeaderImage, updateFormWatermarkImage } = useForms();
    const { createTemplate, getTemplateById, currentTemplate, updateTemplateHeaderImage, updateTemplateWatermarkImage } = useTemplates();

    // Form Data State
    const [formId, setFormId] = useState(null);
    const [formName, setFormName] = useState('Untitled Form');
    const [formDescription, setFormDescription] = useState('');
    const [formFields, setFormFields] = useState([]);
    const [headerImage, setHeaderImage] = useState(null);
    const [watermarkImage, setWatermarkImage] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [status, setStatus] = useState('draft');
    
    // UI State
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // --- NEW: State for Drag and Drop Reordering ---
    const [draggedFieldId, setDraggedFieldId] = useState(null);
    const [dropIndicator, setDropIndicator] = useState(null); // { targetId: string, position: 'above' | 'below' }


    // Populate state when editing or creating from a template
    useEffect(() => {
        // ... (this section remains unchanged)
        setIsLoading(true);
        if (mode === 'edit' && paramId) {
            getFormById(paramId);
        } else if (mode === 'template' && paramId) {
            getTemplateById(paramId);
        } else {
            setIsLoading(false);
        }
        return () => clearCurrentForm();
    }, [paramId, mode, getFormById, getTemplateById, clearCurrentForm]);
    
    useEffect(() => {
        // ... (this section remains unchanged)
        const source = mode === 'edit' ? currentForm : currentTemplate;
        if (source) {
            setFormId(source._id);
            setFormName(mode === 'template' ? `Copy of ${source.name}` : source.name);
            setFormDescription(source.description || '');
            setFormFields(JSON.parse(JSON.stringify(source.fields || [])));
            setHeaderImage(source.headerImage || null);
            setWatermarkImage(source.settings?.watermarkImage || null);
            setStatus(source.status || 'draft');
            setIsLoading(false);
        }
    }, [currentForm, currentTemplate, mode]);

    const handleDrop = useCallback((e, targetRowId = null) => {
        // ... (this section remains unchanged, it's for adding NEW fields)
        e.preventDefault();
        const fieldType = e.dataTransfer.getData('fieldType');
        if (!fieldType) return; // This was likely a reorder drop, so ignore

        const newField = {
            id: Date.now().toString(),
            type: fieldType,
            label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
            placeholder: `Enter value`,
            isRequired: false,
            ...(fieldType === 'image' && { altText: 'Form image' }),
            ...(fieldType === 'layout-row' && { children: [], columns: 2 }),
        };
        
        setFormFields(prevFields => {
            if (targetRowId) {
                const addRecursive = fields => fields.map(f => {
                    if (f.id === targetRowId) {
                        return { ...f, children: [...(f.children || []), newField] };
                    }
                    if (f.type === 'layout-row' && f.children) {
                        return { ...f, children: addRecursive(f.children) };
                    }
                    return f;
                });
                return addRecursive(prevFields);
            }
            return [...prevFields, newField];
        });
        setSelectedElement(newField);
    }, []);

    const handleUpdateElement = useCallback((updatedElement) => {
        // ... (this section remains unchanged)
        const updateRecursive = (fields) => fields.map(f => {
            if (f.id === updatedElement.id) return updatedElement;
            if (f.type === 'layout-row' && f.children) {
                return { ...f, children: updateRecursive(f.children) };
            }
            return f;
        });
        setFormFields(prevFields => updateRecursive(prevFields));
        setSelectedElement(updatedElement);
    }, []);
    
    const handleDeleteField = useCallback((fieldId) => {
        // ... (this section remains unchanged)
        const deleteRecursive = (fields) => fields.filter(f => {
            if (f.id === fieldId) return false;
            if (f.type === 'layout-row' && f.children) {
                f.children = deleteRecursive(f.children);
            }
            return true;
        });
        setFormFields(prevFields => deleteRecursive(prevFields));
        if (selectedElement?.id === fieldId) setSelectedElement(null);
    }, [selectedElement]);

    // --- NEW: Handlers for Drag and Drop Reordering ---

    const handleDragStart = useCallback((fieldId) => {
        setDraggedFieldId(fieldId);
    }, []);

    const handleDragOver = useCallback((targetId, position) => {
        // Prevent setting indicator on the item being dragged
        if (targetId === draggedFieldId) {
            setDropIndicator(null);
            return;
        };
        setDropIndicator({ targetId, position });
    }, [draggedFieldId]);

    const handleReorder = useCallback(() => {
        if (!draggedFieldId || !dropIndicator) return;

        let draggedItem = null;

        // Recursive function to find and pull out the dragged item
        const removeDraggedItem = (fields) => {
            const newFields = [];
            for (const field of fields) {
                if (field.id === draggedFieldId) {
                    draggedItem = field;
                } else {
                    if (field.type === 'layout-row' && field.children) {
                        newFields.push({ ...field, children: removeDraggedItem(field.children) });
                    } else {
                        newFields.push(field);
                    }
                }
            }
            return newFields;
        };

        const fieldsAfterRemoval = removeDraggedItem(formFields);
        if (!draggedItem) return; // Item not found

        // Recursive function to find the target and insert the item
        const insertDraggedItem = (fields) => {
            let inserted = false;
            const newFields = [];
            for (const field of fields) {
                 if (field.id === dropIndicator.targetId) {
                    if (dropIndicator.position === 'above') {
                        newFields.push(draggedItem, field);
                    } else {
                        newFields.push(field, draggedItem);
                    }
                    inserted = true;
                } else {
                     if (field.type === 'layout-row' && field.children) {
                        const newChildren = insertDraggedItem(field.children);
                        // Check if the item was inserted in the children
                        if (newChildren.length > field.children.length) inserted = true;
                        newFields.push({ ...field, children: newChildren });
                    } else {
                        newFields.push(field);
                    }
                }
            }
            // If the target was not found in a nested structure, maybe it's at the top level
            if (!inserted && fields === formFields) {
                 const targetIndex = fields.findIndex(f => f.id === dropIndicator.targetId);
                 if (targetIndex > -1) {
                     const finalFields = [...fields];
                     finalFields.splice(targetIndex + (dropIndicator.position === 'below' ? 1 : 0), 0, draggedItem);
                     return finalFields;
                 }
            }
            return newFields;
        };
        
        const finalFields = insertDraggedItem(fieldsAfterRemoval);
        setFormFields(finalFields);

    }, [draggedFieldId, dropIndicator, formFields]);

    const handleDragEnd = useCallback(() => {
        // If an item was being dragged, trigger reorder
        if (draggedFieldId && dropIndicator) {
            handleReorder();
        }
        // Cleanup state
        setDraggedFieldId(null);
        setDropIndicator(null);
    }, [draggedFieldId, dropIndicator, handleReorder]);

    // ... (handleHeaderImageUpload, handleWatermarkImageUpload, and handleSave remain unchanged)
    const handleHeaderImageUpload = async (imageData) => {
        if (!formId) {
            toast.error("Please save the form as a draft before adding an image.");
            return;
        }
        const result = await (mode === 'edit' ? updateFormHeaderImage(formId, imageData) : updateTemplateHeaderImage(formId, imageData));
        if (result.success) setHeaderImage(result.headerImage);
    };

    const handleWatermarkImageUpload = async (imageData) => {
        if (!formId) {
            toast.error("Please save the form as a draft first.");
            return;
        }
        const result = await (mode === 'edit' ? updateFormWatermarkImage(formId, imageData) : updateTemplateWatermarkImage(formId, imageData));
        if (result.success) setWatermarkImage(result.watermarkImage);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const payload = { name: formName, description: formDescription, fields: formFields, headerImage, settings: { watermarkImage }, status: 'draft' };
        try {
            if (formId && mode === 'edit') {
                await updateForm(formId, payload);
                toast.success("Form updated successfully!");
            } else {
                const newForm = await createForm(payload);
                setFormId(newForm._id);
                navigate(`/forms/edit/${newForm._id}`, { replace: true });
                toast.success("Form created successfully!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save.");
        } finally {
            setIsSaving(false);
        }
    };
    
    return {
        // State
        formId, formName, formDescription, formFields, headerImage, watermarkImage, selectedElement, status, isSaving, isLoading,
        // Setters
        setFormName, setFormDescription,
        setFormFields,
        setSelectedElement,
        // Handlers
        handleDrop, handleUpdateElement, handleDeleteField,
        handleHeaderImageUpload, handleWatermarkImageUpload, handleSave,

        // --- NEW: Return new state and handlers ---
        draggedFieldId,
        dropIndicator,
        handleDragStart,
        handleDragOver,
        handleDragEnd
    };
};