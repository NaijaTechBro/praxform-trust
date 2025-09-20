import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WebhookContext = createContext();

export const useWebhooks = () => useContext(WebhookContext);

export const WebhookProvider = ({ children }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const createWebhook = async (webhookData) => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
            const response = await axios.post(`${API_BASE_URL}/webhooks`, webhookData, config);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create webhook.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getWebhooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
            const response = await axios.get(`${API_BASE_URL}/webhooks`, config);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch webhooks.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateWebhook = async (id, webhookData) => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
            const response = await axios.put(`${API_BASE_URL}/webhooks/${id}`, webhookData, config);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update webhook.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteWebhook = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
            await axios.delete(`${API_BASE_URL}/webhooks/${id}`, config);
            return 'Webhook removed successfully.';
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete webhook.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        loading,
        error,
        createWebhook,
        getWebhooks,
        updateWebhook,
        deleteWebhook,
    };

    return (
        <WebhookContext.Provider value={value}>
            {children}
        </WebhookContext.Provider>
    );
};