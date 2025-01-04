import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [recipe, setRecipe] = useState(null);
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
    useEffect(() => {
        fetch(`/api/recipes/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched recipe data:', data);
                setRecipe(data);
            })
            .catch((error) => console.error('Error fetching recipe:', error));
    }, [id]);
    const token = localStorage.getItem('token'); // Check token presence

    if (!token) {
        return <Navigate to="/login" replace />; // Redirect to login if not logged in
    }
    if (!recipe) {
        return <p>Loading...</p>;
    }
    
    if(user && user.length > 0 && (user[0].roleId !== 1 && user[0].id !== recipe.recipe[0].userId)) {
        return <div>You don't have access to this.</div>;
    }

    return children; // Render the protected component if logged in
};

export default AdminRoute;