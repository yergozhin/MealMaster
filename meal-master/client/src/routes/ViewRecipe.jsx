import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function ViewRecipe() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [user, setUser] = useState(null);
    const goToDeleteRecipe = (id) => {
        navigate(`/deleteRecipe/${id}`);
    };
    const goToUpdateRecipe = (id) => {
        navigate(`/updateRecipe/${id}`);
    };
    useEffect(() => {
        fetch(`/api/recipes/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched recipe data:', data);
                setRecipe(data);
            })
            .catch((error) => console.error('Error fetching recipe:', error));
    }, [id]);
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
    if (!recipe) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>Recipe: {recipe.recipe[0].name}</h1>
            {<img src={recipe.recipe[0].imageUrl || '/uploads/default.jpeg'} className="recipe-image" alt="receipeImage" />}
            <h2>Ingredients:</h2>
            <div>{recipe.ingredients.map((ingredient) =>
                <div key={ingredient.id}>
                    <h4>Name: {ingredient.name}({ingredient.quantity} {ingredient.unit})</h4>
                </div>
            )}</div>
            <h2>Description: </h2>
            <div>{recipe.recipe[0].description}</div>
            {user && user.length > 0 && (user[0].roleId === 1 || user[0].id === recipe.recipe[0].userId) ? (
                <>
                    <button onClick={() => goToUpdateRecipe(recipe.recipe[0].id)} >Update Recipe</button>
                    <button onClick={() => goToDeleteRecipe(recipe.recipe[0].id)}>Delete Recipe</button></>) : (<></>)}
        </>
    );
}
export default ViewRecipe;