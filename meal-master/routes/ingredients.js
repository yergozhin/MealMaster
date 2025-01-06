const express = require('express');
const { getAllRecords, getRecordById, addRecord, updateRecord, deleteRecord, executeQuery } = require('../db/crudOnDb');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const ingredients = await getAllRecords('ingredients', ['id', 'name', 'unit']);
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const ingredient = await getRecordById('ingredients', id);
        if (!ingredient) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }
        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { name, unit } = req.body;

    if (!name || !unit) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newIngredient = { name, unit };
        await addRecord('ingredients', newIngredient);
        res.status(201).json({ message: 'Ingredient added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, unit } = req.body;

    if (!name || !unit) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedIngredient = { name, unit };
        await updateRecord('ingredients', id, updatedIngredient);
        res.json({ message: 'Ingredient updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM recipe_ingredients WHERE ingredientId = ?', [id]);
        await deleteRecord('ingredients', id);
        res.json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;