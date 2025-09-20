import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading, token } = useAuth(); 


  if (loading && token) { 
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!user && !loading) { 
    return <Navigate to="/signin" replace />;
  }


  if (user) {
    return <Outlet />;
  }
  return <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
