import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const setupToken = params.get('setup_token');
        const error = params.get('error');

        if (error) {
            toast.error("Google authentication failed. Please try again.");
            navigate('/signin');
        } else if (token) {
            // --- SCENARIO 1: Existing user ---
            // The backend has confirmed the user and sent back the final JWT.
            localStorage.setItem('userToken', token);
            setToken(token);
            toast.success("Welcome back!");
            navigate('/dashboard');
        } else if (setupToken) {
            // --- SCENARIO 2: New user ---
            // The backend has created a user and sent a temporary token for organization setup.
            localStorage.setItem('setupToken', setupToken);
            navigate('/auth/setup-organization');
        } else {
            // Fallback in case of an unexpected redirect
            toast.error("An unknown error occurred during authentication.");
            navigate('/signin');
        }
    }, [location, navigate, setToken]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Processing your authentication...</h1>
                <p className="mt-2 text-gray-600">Please wait a moment.</p>
            </div>
        </div>
    );
};

export default GoogleCallback;
