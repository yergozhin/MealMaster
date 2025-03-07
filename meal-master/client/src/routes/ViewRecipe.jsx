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
        <h1>Recipe: {recipe.recipe[0].name}</h1>
        {<img src={recipe.recipe[0].imageUrl || '/uploads/default.jpeg'} className="recipe-image" alt="receipeImage" />}
        <h2>Ingredients:</h2>
        <div>{recipe.ingredients.map((ingredient) => 
        <div key={ingredient.id}>
            <h4>Name: {ingredient.name}({ingredient.quantity} {ingredient.unit})</h4>
        </div>
        )}</div>
        </>
    );
}
export default ViewRecipe;