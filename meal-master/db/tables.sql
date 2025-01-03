USE food_receipt_app;

DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS translations;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    roleId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    userId INT NOT NULL,
    imageUrl VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    unit VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipeId INT NOT NULL,
    ingredientId INT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredientId) REFERENCES ingredients(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    translationKey VARCHAR(100) NOT NULL,
    languageCode VARCHAR(10) NOT NULL,
    text TEXT NOT NULL,
    UNIQUE (translationKey, languageCode)
);

-- Insert sample data into roles
INSERT INTO roles (name) VALUES
('Admin'),
('Guest'),
('User');

-- Insert sample data into users
INSERT INTO users (name, email, passwordHash, roleId) VALUES
('Alice Admin', 'alice@example.com', 'hashedpassword1', 1),
('Bob Guest', 'bob@example.com', 'hashedpassword2', 2),
('Charlie User', 'charlie@example.com', 'hashedpassword3', 3);

-- Insert sample data into recipes
INSERT INTO recipes (name, description, userId, imageUrl) VALUES
('Spaghetti Bolognese', 'A classic Italian pasta dish.', 1, NULL),
('Chicken Curry', 'A spicy and flavorful chicken curry.', 2, NULL),
('Vegetable Stir Fry', 'A quick and healthy stir-fry.', 3, NULL);

-- Insert sample data into ingredients
INSERT INTO ingredients (name, unit) VALUES
('Spaghetti', 'grams'),
('Minced Beef', 'grams'),
('Tomato Sauce', 'ml'),
('Chicken', 'grams'),
('Curry Powder', 'tablespoons'),
('Mixed Vegetables', 'grams'),
('Soy Sauce', 'ml');

-- Insert sample data into recipe_ingredients
INSERT INTO recipe_ingredients (recipeId, ingredientId, quantity, unit, notes) VALUES
(1, 1, 500, 'grams', 'Cook until al dente.'),
(1, 2, 250, 'grams', 'Brown before adding sauce.'),
(1, 3, 200, 'ml', 'Add to cooked beef.'),
(2, 4, 300, 'grams', 'Use chicken breast or thighs.'),
(2, 5, 2, 'tablespoons', 'Adjust to taste.'),
(3, 6, 200, 'grams', 'Use fresh or frozen vegetables.'),
(3, 7, 50, 'ml', 'Add for flavor.');

-- Insert sample data into translations
INSERT INTO translations (translationKey, languageCode, text) VALUES
('welcome_message', 'en', 'Welcome to the Food Receipt App!'),
('welcome_message', 'es', '¡Bienvenido a la aplicación de recetas!'),
('welcome_message', 'fr', 'Bienvenue dans l application de recettes!'),
('recipe_title', 'en', 'Recipes'),
('recipe_title', 'es', 'Recetas'),
('recipe_title', 'fr', 'Recettes');