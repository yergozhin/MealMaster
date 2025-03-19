const express = require('express');
const { getAllRecords, getRecordById, addRecord, updateRecord, deleteRecord, executeQuery } = require('../db/crudOnDb');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const recipe_ingredients = await getAllRecords('recipe_ingredients', ['id', 'recipeId', 'ingredientId', 'quantity', 'unit', 'notes']);
        res.json(recipe_ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'Invalid id, it must be a positive integer.' });
    }
    try {
        const { recipe, ingredient, recipe_ingredients } = await getRecipeAndIngredientDetails(id);
        res.json({ recipe, ingredient, recipe_ingredients });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { recipeId, ingredientId, quantity, unit, notes } = req.body;

    if (!recipeId || !ingredientId || !quantity || !unit || !notes) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (isNaN(recipeId) || parseInt(recipeId) <= 0 || !Number.isInteger(Number(recipeId))) {
        return res.status(400).json({ error: 'Invalid recipeId, it must be a positive integer.' });
    }

    if (isNaN(ingredientId) || parseInt(ingredientId) <= 0 || !Number.isInteger(Number(ingredientId))) {
        return res.status(400).json({ error: 'Invalid ingredientId, it must be a positive integer.' });
    }

    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be a positive number.' });
    }
    if (typeof unit !== 'string' || unit.trim() === '') {
        return res.status(400).json({ error: 'Unit must be a non-empty string.' });
    }

    if (typeof notes !== 'string' || notes.trim() === '') {
        return res.status(400).json({ error: 'Notes must be a non-empty string.' });
    }
    try {
        const newRecipe_ingredients = { recipeId, ingredientId, quantity, unit, notes };
        await addRecord('recipe_ingredients', newRecipe_ingredients);
        res.status(201).json({ message: 'Recipe_Ingredients added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { recipeId, ingredientId, quantity, unit, notes } = req.body;

    if (!recipeId || !ingredientId || !quantity || !unit || !notes) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (isNaN(recipeId) || parseInt(recipeId) <= 0 || !Number.isInteger(Number(recipeId))) {
        return res.status(400).json({ error: 'Invalid recipeId, it must be a positive integer.' });
    }

    if (isNaN(ingredientId) || parseInt(ingredientId) <= 0 || !Number.isInteger(Number(ingredientId))) {
        return res.status(400).json({ error: 'Invalid ingredientId, it must be a positive integer.' });
    }
    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be a positive number.' });
    }

    if (typeof unit !== 'string' || unit.trim() === '') {
        return res.status(400).json({ error: 'Unit must be a non-empty string.' });
    }

    if (typeof notes !== 'string' || notes.trim() === '') {
        return res.status(400).json({ error: 'Notes must be a non-empty string.' });
    }
    try {
        const updatedRecipe_ingredients = { recipeId, ingredientId, quantity, unit, notes };
        await updateRecord('recipe_ingredients', id, updatedRecipe_ingredients);
        res.json({ message: 'Recipe_Ingredients updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'Invalid ID, it must be a positive integer.' });
    }
    try {
        await deleteRecord('recipe_ingredients', id);
        res.json({ message: 'Recipe_Ingredients deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getRecipeAndIngredientDetails = async (recipe_ingredientsId) => {
    const recipe_ingredientsQuery = `SELECT * FROM recipe_ingredients WHERE id = ?`;
    const recipe_ingredients = await executeQuery(recipe_ingredientsQuery, [recipe_ingredientsId]);

    if (recipe_ingredients.length === 0) {
        throw new Error('Recipe_ingredient not found');
    }

    const recipesQuery = `
        SELECT r.name, r.description, r.userId, r.createdAt, r.updatedAt
        FROM recipe_ingredients ri
        JOIN recipes r ON ri.recipeId = r.id
        WHERE ri.id = ?`;
    const recipe = await executeQuery(recipesQuery, [recipe_ingredientsId]);

    const ingredientsQuery = `
        SELECT i.name, i.unit
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredientId = i.id
        WHERE ri.id = ?`;
    const ingredient = await executeQuery(ingredientsQuery, [recipe_ingredientsId]);

    return { recipe, ingredient, recipe_ingredients };
};

router.delete('/recipe/:recipeId/ingredient/:ingredientId', async (req, res) => {
    const { recipeId, ingredientId } = req.params;

    if (isNaN(recipeId) || parseInt(recipeId) <= 0 || !Number.isInteger(Number(recipeId))) {
        return res.status(400).json({ error: 'Invalid recipeId, it must be a positive integer.' });
    }

    if (isNaN(ingredientId) || parseInt(ingredientId) <= 0 || !Number.isInteger(Number(ingredientId))) {
        return res.status(400).json({ error: 'Invalid ingredientId, it must be a positive integer.' });
    }

    try {
        const deleteQuery = `
            DELETE FROM recipe_ingredients
            WHERE recipeId = ? AND ingredientId = ?`;
        
        const result = await executeQuery(deleteQuery, [recipeId, ingredientId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No matching recipe_ingredient found for the provided recipeId and ingredientId.' });
        }

        res.json({ message: 'Recipe_ingredient entry deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;