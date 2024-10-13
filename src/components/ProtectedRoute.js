import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedScopes }) => {
    const { isAuthenticated, userScope } = useAuth();

    const hasAccess = allowedScopes.includes(userScope);

    if (!isAuthenticated || !hasAccess) {
        return <Navigate to="/signin" />;
    }

    return children;
};

export default ProtectedRoute;
