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

module.exports = router;