import React, { createContext, useContext } from 'react';
import api from '../services/api'; // Import your configured axios instance
import { toast } from 'react-toastify';

// 1. Create the context
const PublicContext = createContext();

// 2. Create a custom hook for easy access
export const usePublic = () => {
    return useContext(PublicContext);
};

// 3. Create the Provider component
export const PublicProvider = ({ children }) => {

    /**
     * Submits the contact us form.
     * @param {object} formData - The form data { firstName, lastName, email, etc. }.
     * @returns {Promise<{success: boolean, message: string}>}
     */
    const submitContactForm = async (formData) => {
        try {
            const response = await api.post('/public/contact', formData);
            if (response.status === 201) {
                toast.success(response.data.message || "Message sent successfully!");
                return { success: true, message: response.data.message };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    /**
     * Submits the book a demo form.
     * @param {object} formData - The form data { firstName, lastName, emailAddress, etc. }.
     * @returns {Promise<{success: boolean, message: string}>}
     */
    const submitDemoRequest = async (formData) => {
        try {
            const response = await api.post('/public/demos', formData);
             if (response.status === 201) {
                toast.success(response.data.message || "Demo request sent!");
                return { success: true, message: response.data.message };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    // 4. Value to be passed to consuming components
    const value = {
        submitContactForm,
        submitDemoRequest,
    };

    return (
        <PublicContext.Provider value={value}>
            {children}
        </PublicContext.Provider>
    );
};