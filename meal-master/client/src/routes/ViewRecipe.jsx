import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

function ViewRecipe() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    useEffect(() => {
        fetch(`/api/recipes/${id}`)
            .then((response) => response.json())
            .then((data) => {console.log('Fetched recipe data:', data);
                setRecipe(data);})
            .catch((error) => console.error('Error fetching recipe:', error));
    }, [id]);
    if (!recipe) {
        return <p>Loading...</p>;
    }
    return (
        <>
        <h1>Recipe with ID = {recipe.recipe[0].id}</h1>
        </>
    );
}
export default ViewRecipe;