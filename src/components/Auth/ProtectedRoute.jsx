import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FullPageLoader = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700 animate-pulse">Loading Your Session...</p>
    </div>
);

const ProtectedRoute = () => {
    const { user, loading: authLoading } = useAuth();

    if (authLoading) {
        return <FullPageLoader />;
    }

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;