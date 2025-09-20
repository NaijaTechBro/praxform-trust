import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; 

// Create the Template Context
const TemplateContext = createContext();

// Create a custom hook to use the Template Context
export const useTemplates = () => {
    return useContext(TemplateContext);
};


export const TemplateProvider = ({ children }) => {
    const { token, user, loading: authLoading } = useAuth(); 
    const [templates, setTemplates] = useState([]);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Function to clear errors
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Function to fetch all templates (public and organization-specific)
    const getTemplates = useCallback(async () => {
        if (!token || authLoading) return;

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/form-templates`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTemplates(response.data);
            return response.data;
        } catch (err) {
            console.error('Fetch templates error:', err);
            setError(err.response?.data?.message || 'Failed to fetch form templates.');
        } finally {
            setLoading(false);
        }
    }, [token, authLoading, API_BASE_URL]);

    // Function to fetch a single template by ID
    const getTemplateById = useCallback(async (id) => {
        if (!token || authLoading) return;

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/form-templates/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCurrentTemplate(response.data);
            return response.data;
        } catch (err) {
            console.error('Fetch template by ID error:', err);
            setError(err.response?.data?.message || `Failed to fetch template with ID ${id}.`);
        } finally {
            setLoading(false);
        }
    }, [token, authLoading, API_BASE_URL]);

    // Function to create a new template
    const createTemplate = useCallback(async (templateData) => {
        if (!token || authLoading) {
            setError('Authentication required to create a template.');
            return;
        }
        if (!user?.currentOrganization) {
            setError('User must belong to an organization to create a template.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/form-templates`, templateData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTemplates((prevTemplates) => [...prevTemplates, response.data]);
            return response.data;
        } catch (err) {
            console.error('Create template error:', err);
            setError(err.response?.data?.message || 'Failed to create form template.');
            throw err; // Rethrow to allow component to catch specific errors
        } finally {
            setLoading(false);
        }
    }, [token, user, authLoading, API_BASE_URL]);

    // Function to update an existing template
    const updateTemplate = useCallback(async (id, templateData) => {
        if (!token || authLoading) {
            setError('Authentication required to update a template.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_BASE_URL}/form-templates/${id}`, templateData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTemplates((prevTemplates) =>
                prevTemplates.map((template) =>
                    template._id === id ? response.data : template
                )
            );
            setCurrentTemplate(response.data); // Update if this is the current template
            return response.data;
        } catch (err) {
            console.error('Update template error:', err);
            setError(err.response?.data?.message || 'Failed to update form template.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token, authLoading, API_BASE_URL]);

    // Function to delete a template
    const deleteTemplate = useCallback(async (id) => {
        if (!token || authLoading) {
            setError('Authentication required to delete a template.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${API_BASE_URL}/form-templates/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTemplates((prevTemplates) => prevTemplates.filter((template) => template._id !== id));
            if (currentTemplate && currentTemplate._id === id) {
                setCurrentTemplate(null);
            }
            return { success: true };
        } catch (err) {
            console.error('Delete template error:', err);
            setError(err.response?.data?.message || 'Failed to delete form template.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token, authLoading, currentTemplate, API_BASE_URL]);
 const updateTemplateHeaderImage = useCallback(async (templateId, imageData) => {
        if (!token) return { success: false, message: 'Not authenticated' };
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const { data } = await axios.put(`${API_BASE_URL}/form-templates/${templateId}/header-image`, imageData, config);
            return { success: true, ...data };
        } catch (err) {
            console.error('Update template header image error:', err);
            return { success: false, message: err.response?.data?.message || 'Failed to update header image.' };
        }
    }, [token, API_BASE_URL]);

    const updateTemplateWatermarkImage = useCallback(async (templateId, imageData) => {
        if (!token) return { success: false, message: 'Not authenticated' };
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const { data } = await axios.put(`${API_BASE_URL}/form-templates/${templateId}/watermark-image`, imageData, config);
            return { success: true, ...data };
        } catch (err) {
            console.error('Update template watermark image error:', err);
            return { success: false, message: err.response?.data?.message || 'Failed to update watermark image.' };
        }
    }, [token, API_BASE_URL]);

    // Initial fetch of templates when component mounts or token changes
    useEffect(() => {
        if (token && !authLoading) {
            getTemplates();
        }
    }, [token, authLoading, getTemplates]);


    const value = {
        templates,
        currentTemplate,
        loading,
        error,
        clearError,
        getTemplates,
        getTemplateById,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        updateTemplateHeaderImage,
        updateTemplateWatermarkImage
    };

    return (
        <TemplateContext.Provider value={value}>
            {children}
        </TemplateContext.Provider>
    );
};
