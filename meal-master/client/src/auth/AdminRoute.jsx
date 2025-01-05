import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch('/auth/check-login', {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === 'User is logged in') {
                        fetch(`/api/users/${data.user.userId}`)
                            .then((response) => response.json())
                            .then((userData) => {
                                setUser(userData); // Set the full user data
                            })
                            .catch((error) => {
                                console.error('Error fetching user data:', error);
                                setUser(null); // In case of error, clear user data
                            });
                    } else {
                        setUser(null);
                    }
                })
                .catch((error) => {
                    console.error('Error during login check:', error);
                    setUser(null);
                });
        } else {
            setUser(null);
        }
    }, []);
    const token = localStorage.getItem('token'); // Check token presence

    if (!token) {
        return <Navigate to="/login" replace />; // Redirect to login if not logged in
    }
    
    if(user && user.length > 0 && user[0].roleId !== 1) {
        return <div>You don't have access to this.</div>;
    }
    
    return children; // Render the protected component if logged in
};

export default AdminRoute;