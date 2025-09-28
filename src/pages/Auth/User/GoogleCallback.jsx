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
        const finalToken = params.get('token');
        const setupToken = params.get('setup_token');
        const error = params.get('error');

        if (error) {
            toast.error("Google authentication failed. Please try again.");
            navigate('/signin', { replace: true });
            return;
        }

        // SCENARIO 1: Existing user has logged in.
        if (finalToken) {
            // This is the most important step. We update the global state.
            localStorage.setItem('userToken', finalToken);
            setToken(finalToken);
            
            // Because setToken triggers a re-render and a fetchMe in AuthContext,
            // the user object will be populated BEFORE we navigate to the dashboard.
            // The `replace: true` is important for browser history.
            toast.success("Welcome back!");
            navigate('/dashboard', { replace: true });
            return;
        }

        // SCENARIO 2: New user needs to set up their organization.
        if (setupToken) {
            // We pass the token via state to avoid any localStorage race conditions.
            navigate('/organization-setup', { 
                replace: true, 
                state: { setupToken: setupToken } 
            });
            return;
        }

        // Fallback if no token is found
        toast.error("An unexpected error occurred. Please try signing in again.");
        navigate('/signin', { replace: true });

    }, [location, navigate, setToken]);

    // This component shows a loading state while it processes the token.
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-2xl font-semibold animate-pulse">
                    Finalizing Authentication...
                </h1>
            </div>
        </div>
    );
};

export default GoogleCallback;