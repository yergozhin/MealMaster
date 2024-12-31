import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Check token presence

    if (!token) {
        return <Navigate to="/login" replace />; // Redirect to login if not logged in
    }

    return children; // Render the protected component if logged in
};

export default ProtectedRoute;
