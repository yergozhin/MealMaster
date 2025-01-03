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
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

// Routes

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await getAllRecords('recipes', ['id', 'name', 'createdAt', 'imageUrl']);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { recipe, ingredients } = await getRecipeDetails(id);
        res.json({ recipe, ingredients });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new recipe
router.post('/', upload.single('image'), async (req, res) => {
    const { name, description, userId, ingredients } = req.body;
    let imageUrl = null;

    // Handle uploaded file
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
        //console.log('Uploaded image URL:', imageUrl);
    }

    // Validate required fields
    if (!name || !description || !userId || !Array.isArray(ingredients)|| ingredients.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [recipeResult] = await db.query(
            'INSERT INTO recipes (name, description, userId) VALUES (?, ?, ?)',
            [name, description, userId]
        );
        const recipeId = recipeResult.insertId;

        for (const ingredient of ingredients) {
            const { name, quantity, unit, notes } = ingredient;
            if (!name || quantity == null || !unit) {
                throw new Error('Invalid ingredient details');
            }

            let ingredientId;

            // Check if the ingredient already exists
            const [existingIngredient] = await db.query(
                'SELECT id FROM ingredients WHERE name = ?',
                [name]
            );

            if (existingIngredient.length > 0) {
                // Use the existing ingredient
                ingredientId = existingIngredient[0].id;
            } else {
                // Insert the new ingredient
                const [ingredientResult] = await db.query(
                    'INSERT INTO ingredients (name, unit) VALUES (?, ?)',
                    [name, unit]
                );
                ingredientId = ingredientResult.insertId;
            }

            // Associate the ingredient with the recipe
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

    if (!name || !description || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedRecipe = { name, description, userId };
        await updateRecord('recipes', id, updatedRecipe);
        res.json({ message: 'Recipe updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await deleteRecord('recipes', id);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getRecipeDetails = async (recipeId) => {
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