import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UpdateRecipe = () => {
    const { id: recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState({
        name: '',
        quantity: '',
        unit: '',
        notes: '',
    });

    useEffect(() => {
        fetch(`/api/recipes/${recipeId}`)
            .then((response) => response.json())
            .then((data) => {
                setRecipe(data.recipe);
                setIngredients(data.ingredients);
            })
            .catch((error) => {
                console.error('Error fetching recipe data:', error);
            });
    }, [recipeId]);

    const handleUpdateRecipe = async (e) => {
        e.preventDefault();
        const updatedRecipe = {
            name: recipe[0].name,
            description: recipe[0].description,
            userId: recipe[0].userId,
        };

        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRecipe),
            });

            if (response.ok) {
                alert('Recipe updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    };

    const handleAddIngredient = async (e) => {
        e.preventDefault();
        
        const newIngredientData = {
            name: newIngredient.name,
            quantity: newIngredient.quantity,
            unit: newIngredient.unit,
            notes: newIngredient.notes,
        };
        try {
            const ingredientResponse = await fetch('/api/ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: newIngredientData.name, unit: newIngredientData.unit}),
            });
    
            if (!ingredientResponse.ok) {
                const errorData = await ingredientResponse.json();
                alert(`Error adding ingredient: ${errorData.error}`);
                return;
            }
    
            const ingredient = await ingredientResponse.json();
    
            const recipeIngredientData = {
                ...newIngredientData,
                recipeId: recipeId,
                ingredientId: ingredient.ingredientsId[0].id,
                userId: recipe[0].userId,
            };
    
            const recipeIngredientResponse = await fetch('/api/recipe_ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipeIngredientData),
            });
    
            if (recipeIngredientResponse.ok) {
                setIngredients((prevIngredients) => [
                    ...prevIngredients,
                    ingredient,
                ]);
                setNewIngredient({ name: '', quantity: '', unit: '', notes: '' });
                alert('Ingredient added successfully!');
            } else {
                const errorData = await recipeIngredientResponse.json();
                alert(`Error linking ingredient to recipe: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error adding ingredient:', error);
        }
    };
    
    const handleDeleteIngredient = async (ingredientId) => {
        try {
            const response = await fetch(`/api/recipe_ingredients/recipe/${recipeId}/ingredient/${ingredientId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setIngredients((prevIngredients) =>
                    prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
                );
                alert('Ingredient deleted successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error deleting ingredient:', error);
        }
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className="update-recipe">
            <h2>Update Recipe</h2>
            <form onSubmit={handleUpdateRecipe}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={recipe[0] ? recipe[0].name : ''} 
                        onChange={(e) => {
                            const updatedRecipe = [...recipe]; 
                            updatedRecipe[0].name = e.target.value; 
                            setRecipe(updatedRecipe); 
                        }}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={recipe[0] ? recipe[0].description : ''}  
                        onChange={(e) => {
                            const updatedRecipe = [...recipe]; 
                            updatedRecipe[0].description = e.target.value;  
                            setRecipe(updatedRecipe); 
                        }}
                    />
                </div>
                <div>
                    <button type="submit">Update Recipe</button>
                </div>
            </form>



            <h3>Ingredients</h3>
            <ul>
                {ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                        {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                        <button onClick={() => handleDeleteIngredient(ingredient.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>Add Ingredient</h3>
            <form onSubmit={handleAddIngredient}>
                <div>
                    <label>Ingredient:</label>
                    <input
                        type="text"
                        value={newIngredient.name}
                        onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={newIngredient.quantity}
                        onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                    />
                </div>
                <div>
                    <label>Unit:</label>
                    <input
                        type="text"
                        value={newIngredient.unit}
                        onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                    />
                </div>
                <div>
                    <label>Notes:</label>
                    <input
                        type="text"
                        value={newIngredient.notes}
                        onChange={(e) => setNewIngredient({ ...newIngredient, notes: e.target.value })}
                    />
                </div>
                <div>
                    <button type="submit">Add Ingredient</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateRecipe;
