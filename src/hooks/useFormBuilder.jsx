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

    // Populate state when editing or creating from a template
    useEffect(() => {
        setIsLoading(true);
        if (mode === 'edit' && paramId) {
            getFormById(paramId);
        } else if (mode === 'template' && paramId) {
            getTemplateById(paramId);
        } else {
            setIsLoading(false); // For blank form creation
        }
        return () => clearCurrentForm();
    }, [paramId, mode, getFormById, getTemplateById, clearCurrentForm]);
    
    useEffect(() => {
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
        e.preventDefault();
        const fieldType = e.dataTransfer.getData('fieldType');
        const newField = {
            id: Date.now().toString(),
            type: fieldType,
            label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
            placeholder: `Enter value`,
            isRequired: false,
            // Add default properties for new types
            ...(fieldType === 'image' && { altText: 'Form image' }),
            ...(fieldType === 'layout-row' && { children: [], columns: 2 }),
        };
        
        setFormFields(prevFields => {
            if (targetRowId) {
                // Recursive function to add field to a nested row
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
        const payload = {
            name: formName,
            description: formDescription,
            fields: formFields,
            headerImage,
            settings: { watermarkImage },
            status: 'draft'
        };

        try {
            if (formId && mode === 'edit') {
                await updateForm(formId, payload);
                toast.success("Form updated successfully!");
            } else {
                const newForm = await createForm(payload);
                setFormId(newForm._id);
                // Redirect to the new edit page after creation
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
        handleHeaderImageUpload, handleWatermarkImageUpload, handleSave
    };
};