import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const AddRecipe = () => {
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        name: '',
        description: '',
        userId: '',
        imageUrl: null,
    });
    const [ingredients, setIngredients] = useState([
        { name: '', quantity: '', unit: '', notes: '' },
    ]);
    const [message, setMessage] = useState('');

    const handleRecipeChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (e) => {
        setRecipe((prevData) => ({
            ...prevData,
            imageUrl: e.target.files[0],
        }));
    };
    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index][field] = value;
        setIngredients(updatedIngredients);
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '', notes: '' }]);
    };
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
                                setUser(userData);
                            })
                            .catch((error) => {
                                console.error('Error fetching user data:', error);
                                setUser(null);
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recipe.name.trim()) {
            alert('Recipe name is required');
            return;
        }

        if (!recipe.description.trim()) {
            alert('Description is required');
            return;
        }

        if (!recipe.imageUrl) {
            alert('Image is required');
            return;
        }

        ingredients.forEach((ingredient, index) => {
            if (!ingredient.name.trim()) {
                alert(`Ingredient ${index + 1}: Name is required`);
                return;
            }
            if (!ingredient.quantity || ingredient.quantity <= 0) {
                alert(`Ingredient ${index + 1}: Quantity must be a positive number`);
                return;
            }
            if (!ingredient.unit.trim()) {
                alert(`Ingredient ${index + 1}: Unit is required`);
                return;
            }
            if (!ingredient.notes.trim()) {
                alert(`Ingredient ${index + 1}: Notes are required`);
                return;
            }
        });
        const formData = new FormData();

        formData.append('name', recipe.name);
        formData.append('description', recipe.description);
        formData.append('userId', user[0].id);
        formData.append('image', recipe.imageUrl);
        formData.append('ingredients', JSON.stringify(ingredients));
        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(`Recipe added successfully! ID: ${result.id}`);
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            setMessage('Error: Could not add recipe');
        }
        navigate("/");
    };

    return (
        <div>
            <h1>Add Recipe</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Recipe Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={recipe.name}
                        onChange={handleRecipeChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={recipe.description}
                        onChange={handleRecipeChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <h2>Ingredients</h2>
                    {ingredients.map((ingredient, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={ingredient.name}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'name', e.target.value)
                                }
                                required
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={ingredient.quantity}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'quantity', e.target.value)
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Unit (e.g., grams)"
                                value={ingredient.unit}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'unit', e.target.value)
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Note"
                                value={ingredient.notes}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'notes', e.target.value)
                                }
                                required
                            />
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addIngredientField}>
                    Add More Ingredients
                </button>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddRecipe;
