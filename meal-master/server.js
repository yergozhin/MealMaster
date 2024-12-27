const express = require('express');
const bodyParser = require('body-parser');
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const ingredientRoutes = require('./routes/ingredients');
const permissionRoutes = require('./routes/permissions');
const recipe_ingredientRoutes = require('./routes/recipe_ingredients');
const translationRoutes = require('./routes/translations');
const roleRoutes = require('./routes/roles');


const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Express is working!');
});

app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/recipe_ingredients', recipe_ingredientRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/roles', roleRoutes);

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3001}`);
});