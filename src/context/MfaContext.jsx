import React, { createContext, useState, useContext, useCallback } from 'react'; // 1. Import useCallback
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const MfaContext = createContext();

export const useMfa = () => {
    return useContext(MfaContext);
};

export const MfaProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { logout, setUser } = useAuth();

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // ✨ FIX: Wrap all exported functions in useCallback
    const setupGoogleAuth = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/mfa/setup-google`, {});
            return { success: true, data: response.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to start MFA setup.';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    const verifyGoogleAuth = useCallback(async ({ token }) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/mfa/verify-google`, { token });
            if (response.data.validationRequired) {
                toast.success("2FA enabled successfully! Please log in again to verify.");
                setTimeout(() => logout(), 2500);
            }
            return { success: true, data: response.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to verify MFA token.';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL, logout]);
    
    const disableMfa = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_BASE_URL}/mfa/disable`, {});
            toast.success(response.data.message || "Two-Factor Authentication has been disabled.");
            setUser(prevUser => ({
                ...prevUser,
                mfaEnabled: false,
                mfaMethod: null
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to disable MFA.';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL, setUser]);

    const value = {
        isLoading,
        error,
        setupGoogleAuth,
        verifyGoogleAuth,
        disableMfa,
    };

    return <MfaContext.Provider value={value}>{children}</MfaContext.Provider>;
};