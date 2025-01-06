import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../App.css';

function ViewRecipe() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [user, setUser] = useState(null);
    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState({
        Recipe: '',
        Name: '',
        Ingredients: '',
        Description: '',
        UpdateRecipe: '',
        DeleteRecipe: '',
    });
    const goToUpdateRecipe = (id) => {
        navigate(`/updateRecipe/${id}`);
    };
    const fetchTranslation = async (word, lang) => {
        try {
            const response = await fetch(`/api/translations/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word, lang }),
            });

            if (!response.ok) {
                throw new Error('Translation failed');
            }

            const data = await response.json();
            return data.translation || word;
        } catch (error) {
            console.error('Error fetching translation:', error);
            return word;
        }
    };
    useEffect(() => {
        const fetchPageTranslations = async () => {
            const translationsData = {
                Recipe: await fetchTranslation('Recipe', language),
                Name: await fetchTranslation('Name', language),
                Ingredients: await fetchTranslation('Ingredients', language),
                Description: await fetchTranslation('Description', language),
                UpdateRecipe: await fetchTranslation('Update Recipe', language),
                DeleteRecipe: await fetchTranslation('Delete Recipe', language),
            };
            setTranslations(translationsData);
        };

        fetchPageTranslations();
    }, [language]);
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);
    useEffect(() => {
        const translateRecipe = async () => {
            if (recipe && recipe.recipe[0]) {
                const translatedName = await fetchTranslation(recipe.recipe[0].name || '', language);
                const translatedDescription = await fetchTranslation(recipe.recipe[0].description || '', language);
    
                const translatedIngredients = recipe.ingredients
                    ? await Promise.all(
                          recipe.ingredients.map(async (ingredient) => ({
                              ...ingredient,
                              name: await fetchTranslation(ingredient.name || '', language),
                              unit: await fetchTranslation(ingredient.unit || '', language),
                          }))
                      )
                    : [];
    
                setRecipe({
                    ...recipe,
                    recipe: [
                        {
                            ...recipe.recipe[0],
                            name: translatedName,
                            description: translatedDescription,
                        },
                    ],
                    ingredients: translatedIngredients,
                });
            }
        };
    
        if (recipe && language) {
            translateRecipe();
        }
    }, [recipe, language]);
    
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
    if (!recipe) {
        return <p>Loading...</p>;
    }
    const deleteRecipe = async (id) => {
        if (window.confirm(translations.ConfirmDelete || "Are you sure you want to delete this recipe?")) {
            try {
                const response = await fetch(`/api/recipes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                    },
                });
    
                if (response.ok) {
                    alert('Recipe deleted successfully.');
                    navigate('/');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to delete recipe: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error deleting recipe:', error);
                alert('An error occurred while trying to delete the recipe.');
            }
        }
    };
    

    return (
        <div className="view-recipe">
            {recipe && recipe.recipe && recipe.recipe[0] ? (
                <>
                    <h1>{translations.Recipe}: {recipe.recipe[0].name}</h1>
                    <img 
                        src={recipe.recipe[0].imageUrl || '/uploads/default.jpeg'} 
                        className="recipe-image" 
                        alt="Recipe" 
                    />
                    <h2>{translations.Ingredients}:</h2>
                    <div className="ingredients-container">
                        {recipe.ingredients.map((ingredient) =>
                            <div key={ingredient.id}>
                                <h4>{translations.Name}: {ingredient.name} ({ingredient.quantity} {ingredient.unit})</h4>
                            </div>
                        )}
                    </div>
                    <h2>{translations.Description}:</h2>
                    <div>{recipe.recipe[0].description}</div>
                    {user && user.length > 0 && (user[0].roleId === 1 || user[0].id === recipe.recipe[0].userId) && (
                        <div className="buttons">
                            <button onClick={() => goToUpdateRecipe(recipe.recipe[0].id)}>{translations.UpdateRecipe}</button>
                            <button onClick={() => deleteRecipe(recipe.recipe[0].id)}>{translations.DeleteRecipe}</button>
                        </div>
                    )}
                </>
            ) : (
                <p>{translations.Loading}</p>
            )}
        </div>
    );
    
    
}
export default ViewRecipe;