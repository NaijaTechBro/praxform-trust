
import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WebhookContext = createContext();

export const useWebhooks = () => useContext(WebhookContext);

export const WebhookProvider = ({ children }) => {
    const { token } = useAuth();

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Helper to create auth config
    const getConfig = () => ({
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const createWebhook = async (webhookData) => {
        // Functions are now simpler. They just make the API call.
        const response = await axios.post(`${API_BASE_URL}/webhooks`, webhookData, getConfig());
        return response.data;
    };

    const getWebhooks = async () => {
        const response = await axios.get(`${API_BASE_URL}/webhooks`, getConfig());
        return response.data;
    };

    const updateWebhook = async (id, webhookData) => {
        const response = await axios.put(`${API_BASE_URL}/webhooks/${id}`, webhookData, getConfig());
        return response.data;
    };

    const deleteWebhook = async (id) => {
        await axios.delete(`${API_BASE_URL}/webhooks/${id}`, getConfig());
        return 'Webhook removed successfully.';
    };

    const value = {
        // REMOVED: Loading and error are gone
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