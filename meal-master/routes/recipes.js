const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { getAllRecords, getRecordById, addRecord, updateRecord, deleteRecord, executeQuery } = require('../db/crudOnDb');
const router = express.Router();
const db = require('../db/config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 },
});


router.get('/', async (req, res) => {
    try {
        const recipes = await getAllRecords('recipes', ['id', 'name', 'createdAt', 'imageUrl']);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'ID must be a positive integer.' });
    }
    try {
        const { recipe, ingredients } = await getRecipeDetails(id);
        res.json({ recipe, ingredients });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', upload.single('image'), async (req, res) => {

    const { name, description, userId, ingredients } = req.body;
    let imageUrl = null;

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;

    }
    let parsedIngredients = [];
    if (ingredients) {
        try {
            parsedIngredients = JSON.parse(ingredients);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid ingredients format' });
        }
    }

    if (!name || !description || !userId || parsedIngredients.length === 0) {

        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (isNaN(userId) || parseInt(userId) <= 0 || !Number.isInteger(Number(userId))) {
        return res.status(400).json({ error: 'Invalid userId, it must be a positive integer.' });
    }
    try {
        const [recipeResult] = await db.query(
            'INSERT INTO recipes (name, description, userId, imageUrl) VALUES (?, ?, ?, ?)',
            [name, description, userId, imageUrl]
        );
        const recipeId = recipeResult.insertId;
        for (const ingredient of parsedIngredients) {
            const { name, quantity, unit, notes } = ingredient;
            if (!name || quantity == null || !unit) {
                throw new Error('Invalid ingredient details');
            }
            let ingredientId;

            const [existingIngredient] = await db.query(
                'SELECT id FROM ingredients WHERE name = ?',
                [name]
            );
            if (existingIngredient.length > 0) {

                ingredientId = existingIngredient[0].id;
            } else {

                const [ingredientResult] = await db.query(
                    'INSERT INTO ingredients (name, unit) VALUES (?, ?)',
                    [name, unit]
                );
                ingredientId = ingredientResult.insertId;
            }

            await db.query(
                'INSERT INTO recipe_ingredients (recipeId, ingredientId, quantity, unit, notes) VALUES (?, ?, ?, ?, ?)',
                [recipeId, ingredientId, quantity, unit, notes]
            );
        }

        res.status(201).json({ message: 'Recipe added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, userId } = req.body;

    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'Invalid id, it must be a positive integer.' });
    }

    if (!name || !description) {
        return res.status(400).json({ error: 'Missing required fields: name or description' });
    }

    if (userId !== undefined) {
        if (isNaN(userId) || parseInt(userId) <= 0 || !Number.isInteger(Number(userId))) {
            return res.status(400).json({ error: 'Invalid userId, it must be a positive integer.' });
        }
    }

    try {
        const updatedRecipe = { name, description, userId: userId || null }; 
        await updateRecord('recipes', id, updatedRecipe);
        res.json({ message: 'Recipe updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'Invalid id, it must be a positive integer.' });
    }
    try {
        await db.query('DELETE FROM recipe_ingredients WHERE recipeId = ?', [id]);
        
        await deleteRecord('recipes', id);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getRecipeDetails = async (recipeId) => {
    if (!recipeId || isNaN(recipeId) || parseInt(recipeId) <= 0 || !Number.isInteger(Number(recipeId))) {
        throw new Error('Invalid recipeId, it must be a positive integer.');
    }
    const recipeQuery = `SELECT * FROM recipes WHERE id = ?`;
    const recipe = await executeQuery(recipeQuery, [recipeId]);

    const ingredientsQuery = `
        SELECT i.name, ri.quantity, ri.unit
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredientId = i.id
        WHERE ri.recipeId = ?`;
    const ingredients = await executeQuery(ingredientsQuery, [recipeId]);

    return { recipe, ingredients };
};

module.exports = router;