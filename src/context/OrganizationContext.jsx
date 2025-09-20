import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const OrganizationContext = createContext();

export const useOrganization = () => {
    return useContext(OrganizationContext);
};

export const OrganizationProvider = ({ children }) => {
    const { user, setUser: setAuthUser, token, loading: authLoading } = useAuth();
    const [organization, setOrganization] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const fetchOrganizationDetails = useCallback(async (orgId) => {
        if (!orgId || !token) return;
        setLoading(true);
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgId}`, config);
            const orgData = response.data;
            setOrganization(orgData);

            if (user?._id && orgData.members) {
                const member = orgData.members.find(m => m.userId?._id === user._id);
                setUserRole(member ? member.role : '');
            }
            return orgData;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch organization details.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user?._id, API_BASE_URL, token]);

    const refetchOrganizationWithoutLoading = useCallback(async (orgId) => {
        if (!orgId || !token) return;
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgId}`, config);
            const orgData = response.data;
            setOrganization(orgData);
            return orgData;
        } catch (err) {
            console.error("Silent refetch failed:", err);
            throw err;
        }
    }, [token, API_BASE_URL]);

    // This single useEffect handles the initial data load for the organization.
    useEffect(() => {
        if (!authLoading && user?.currentOrganization?._id) {
            fetchOrganizationDetails(user.currentOrganization._id);
        } else if (!authLoading) {
            setLoading(false);
            setOrganization(null);
        }
    }, [user, authLoading, fetchOrganizationDetails]);

    const updateOrganizationDetails = async (orgData) => {
        if (!organization?._id) {
            toast.error("Organization not found.");
            return { success: false };
        }
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.put(`${API_BASE_URL}/organizations/${organization._id}`, orgData, config);
            const updatedOrg = response.data;
            setOrganization(updatedOrg);

            if (user.currentOrganization.name !== updatedOrg.name) {
                setAuthUser(prevUser => ({
                    ...prevUser,
                    currentOrganization: { ...prevUser.currentOrganization, name: updatedOrg.name }
                }));
            }
            toast.success("Organization information updated successfully!");
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update organization.';
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    };
    
    const updateOrganizationLogo = async (orgId, logoData) => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const { data } = await axios.put(`${API_BASE_URL}/organizations/${orgId}/logo`, logoData, config);
            setOrganization(prevOrg => ({ ...prevOrg, logo: data.logo }));
            if (user.currentOrganization._id === orgId) {
                setAuthUser(prevUser => ({
                    ...prevUser,
                    currentOrganization: { ...prevUser.currentOrganization, logo: data.logo }
                }));
            }
            toast.success(data.message);
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update logo.");
            return { success: false };
        }
    };

    const generateApiKey = async (password) => {
        if (!organization?._id) {
            toast.error("Organization not found.");
            return { success: false };
        }
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.post(`${API_BASE_URL}/organizations/${organization._id}/api-keys`, { password }, config);
            return { success: true, ...response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to generate new keys.';
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    const value = {
        organization,
        userRole,
        loading,
        error,
        setOrganization,
        updateOrganizationDetails,
        generateApiKey,
        fetchOrganizationDetails,
        updateOrganizationLogo,
        refetchOrganizationWithoutLoading,
    };

    return (
        <OrganizationContext.Provider value={value}>
            {children}
        </OrganizationContext.Provider>
    );
};