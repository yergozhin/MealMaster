const express = require('express');
const multer = require('multer');
const { getAllRecords, getRecordById, addRecord, updateRecord, deleteRecord, executeQuery } = require('../db/crudOnDb');
const router = express.Router();

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
    }
  });
  const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const recipes = await getAllRecords('recipes', ['id', 'name', 'createdAt']);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { recipe, ingredients } = await getRecipeDetails(id);
        res.json({ recipe, ingredients });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    const { name, description, userId } = req.body;
    const imageUrl = null;
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!name || !description || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newRecipe = { name, description, userId, imageUrl};
        await addRecord('recipes', newRecipe);
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