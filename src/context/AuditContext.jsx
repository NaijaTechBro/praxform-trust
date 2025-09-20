import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AuditContext = createContext();

export const useAudit = () => useContext(AuditContext);

export const AuditProvider = ({ children }) => {
    const { token } = useAuth();
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const getAuditLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${API_BASE_URL}/audit-logs`, config);
            setAuditLogs(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch audit logs.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        auditLogs,
        loading,
        error,
        getAuditLogs,
    };

    return (
        <AuditContext.Provider value={value}>
            {children}
        </AuditContext.Provider>
    );
};
