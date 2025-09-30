import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// 1. Create the context
const PaymentContext = createContext();

// 2. Create a custom hook for easy consumption
export const usePayments = () => {
    return useContext(PaymentContext);
};

// 3. Create the Provider component
export const PaymentProvider = ({ children }) => {
    const { token } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // A helper function for authenticated requests
    const makeAuthenticatedRequest = async (method, url, data = null) => {
        if (!token) {
            const authError = 'Authentication is required for this action.';
            setError(authError);
            throw new Error(authError);
        }
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios[method](url, ...(data ? [data, config] : [config]));
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred with your payment request.';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };


    // ✅ 1. Add new function to fetch plans publicly (no token needed)
    const getPublicPlans = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Use a direct axios call, not the authenticated helper
            const response = await axios.get(`${API_BASE_URL}/payments/public-plans`);
            setPlans(response.data.data);
            return response.data.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to load pricing plans.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    /**
     * Fetches all available subscription plans from the API.
     */
    const getPlans = useCallback(async () => {
        try {
            const response = await makeAuthenticatedRequest('get', `${API_BASE_URL}/payments/plans`);
            setPlans(response.data);
            return response.data;
        } catch (err) {
            // Error is handled by the helper
        }
    }, [token, API_BASE_URL]);

    /**
     * Creates a Stripe checkout session and redirects the user to Stripe's payment page.
     * @param {string} priceId - The Stripe Price ID for the selected plan.
     */
    const createCheckoutSession = useCallback(async (priceId) => {
        try {
            const response = await makeAuthenticatedRequest('post', `${API_BASE_URL}/payments/create-checkout-session`, { priceId });
            if (response.url) {
                // Redirect to Stripe checkout
                window.location.href = response.url;
            }
            return response;
        } catch (err) {
            // Error is handled by the helper, no need to re-throw unless you want to
        }
    }, [token, API_BASE_URL]);
    
    /**
     * Creates a Stripe Customer Portal session and redirects the user to manage their subscription.
     */
    const getCustomerPortal = useCallback(async () => {
        try {
            const response = await makeAuthenticatedRequest('get', `${API_BASE_URL}/payments/customer-portal`);
            if (response.url) {
                // Redirect to the Stripe customer portal
                window.location.href = response.url;
            }
            return response;
        } catch (err) {
            // Error is handled by the helper
        }
    }, [token, API_BASE_URL]);


    // 4. Value to be passed to consumers
    const value = {
        plans,
        loading,
        error,
        getPlans,
        createCheckoutSession,
        getCustomerPortal,
        getPublicPlans,
    };

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
};