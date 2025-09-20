import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const UploadContext = createContext();

export const useUpload = () => useContext(UploadContext);

export const UploadProvider = ({ children }) => {
    const { token } = useAuth();
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    /**
     * Fetches a secure signature from the backend for direct Cloudinary uploads.
     * @param {string} folder - The destination folder in Cloudinary (e.g., 'users/userId').
     * @returns {Promise<object|null>} - The signature details or null on failure.
     */
    const getCloudinarySignature = async (folder) => {
        if (!token) {
            toast.error("Authentication required to upload files.");
            return null;
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`${API_BASE_URL}/uploads/signature`, { folder }, config);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not get upload signature.");
            return null;
        }
    };

    const value = {
        getCloudinarySignature,
    };

    return (
        <UploadContext.Provider value={value}>
            {children}
        </UploadContext.Provider>
    );
};