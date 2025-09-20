import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const SubmissionContext = createContext();

export const useSubmissions = () => useContext(SubmissionContext);

export const SubmissionProvider = ({ children }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Fetches all submissions for a specific form (Private)
    const getSubmissionsByFormId = async (formId) => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${API_BASE_URL}/forms/${formId}/submissions`, config);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch submissions.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Fetches a single submission by its ID (Private)
    const getSubmissionById = async (submissionId) => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${API_BASE_URL}/submissions/${submissionId}`, config);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch submission.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Deletes a single submission (Private)
    const deleteSubmission = async (submissionId) => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.delete(`${API_BASE_URL}/submissions/${submissionId}`, config);
            return response.data.message;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete submission.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Fetches a form for public access using formId and accessCode
    const getPublicForm = async (formId, accessCode) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/submissions/${formId}/${accessCode}`);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to load form. Invalid or expired link.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Logs a submission view action by calling the backenddd
     const logSubmissionView = async (submissionId) => {
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` },
            };
            await axios.post(`${API_BASE_URL}/submissions/${submissionId}/log-view`, {}, config);
        } catch (err) {
            console.error('Failed to log view action:', err);
        }
    };

    // Logs a submission download action by calling the backend endpoint
    const logSubmissionDownload = async (submissionId) => {
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` },
            };
            await axios.post(`${API_BASE_URL}/submissions/${submissionId}/log-download`, {}, config);
        } catch (err) {
            console.error('Failed to log download action:', err);
        }
    };

    const value = {
        loading,
        error,
        getSubmissionsByFormId,
        getSubmissionById,
        deleteSubmission,
        getPublicForm,
        logSubmissionView,
        logSubmissionDownload,
    };

    return (
        <SubmissionContext.Provider value={value}>
            {children}
        </SubmissionContext.Provider>
    );
};