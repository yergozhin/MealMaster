import React, { useEffect, useState } from 'react';
import logo from '../meal-master-logo.png';
import '../App.css';

function Home() {
    const [recipes, setRecipes] = useState([]);
    useEffect(() => {
        fetch('/api/recipes')
            .then((response) => response.json())
            .then((data) => setRecipes(data));
    }, []);
    return (
        <div className="App">
            <header>
                <div className="container">
                    <div className="section" id="section1">
                        <div className="subsection">
                            <img src={logo} className="App-logo" alt="logo" />
                        </div>
                        <div className="subsection">
                            <h3>RecipeShare</h3>
                        </div>
                    </div>
                    <div className="section">
                        <div className="subsection">
                            <button>Home</button>
                        </div>
                        <div className="subsection">
                            <button>My Recipes</button>
                        </div>
                        <div className="subsection">
                            <button>Add Recipe</button>
                        </div>
                        <div className="subsection">
                            <div className="filter-dropdown">
                                <button className="filter-dropdown-button">Browse Recipes</button>
                                <div className="filter-dropdown-content">
                                    <label><input type="checkbox" className="filter" name="breakfast" />Breakfast</label>
                                    <label><input type="checkbox" className="filter" name="lunch" />Lunch</label>
                                    <label><input type="checkbox" className="filter" name="dinner" />Dinner</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section">
                        <div className="subsection">
                            <div className="search-recipes">
                                <input type="text" className="search-input" placeholder="Search for recipes..." />
                            </div>
                        </div>
                        <div className="subsection">
                            <button>Favorite Recipes</button>
                        </div>
                        <div className="subsection">
                            <div className="user-profile">
                                <a href="" className="profile-button">
                                    <img src="profile-picture.png" className="profile-avatar" />
                                    User Name
                                </a>
                                <div className="profile-dropdown-menu">
                                    <a href="">My Profile</a>
                                    <a href="">Settings</a>
                                    <a href="">Logout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <h2>Example Recipes</h2>
                <div className="recipe-card-container page-1">
                    <div className="recipe-card">
                        <img src="pizza.jpeg" className="recipe-image" />
                        <h3>Pizza</h3>
                        <p className="recipe-description">Delicious pizza!</p>
                        <button className="recipe-button">View Recipe</button>
                        <button className="addtofavorites-button">Add To Favorites</button>
                        <div className="rating">
                            <button className="star" data-value="1">☆</button>
                            <button className="star" data-value="2">☆</button>
                            <button className="star" data-value="3">☆</button>
                            <button className="star" data-value="4">☆</button>
                            <button className="star" data-value="5">☆</button>
                        </div>
                    </div>
                    <div className="recipe-card">
                        <img src="burger.jpeg" className="recipe-image" />
                        <h3>Burger</h3>
                        <p className="recipe-description">Delicious burger!</p>
                        <button className="recipe-button">View Recipe</button>
                        <button className="addtofavorites-button">Add To Favorites</button>
                        <div className="rating">
                            <button className="star" data-value="1">☆</button>
                            <button className="star" data-value="2">☆</button>
                            <button className="star" data-value="3">☆</button>
                            <button className="star" data-value="4">☆</button>
                            <button className="star" data-value="5">☆</button>
                        </div>
                    </div>
                    <div className="recipe-card">
                        <img src="pasta.jpeg" className="recipe-image" />
                        <h3>Pasta</h3>
                        <p className="recipe-description">Delicious pasta</p>
                        <button className="recipe-button">View Recipe</button>
                        <button className="addtofavorites-button">Add To Favorites</button>
                        <div className="rating">
                            <button className="star" data-value="1">☆</button>
                            <button className="star" data-value="2">☆</button>
                            <button className="star" data-value="3">☆</button>
                            <button className="star" data-value="4">☆</button>
                            <button className="star" data-value="5">☆</button>
                        </div>
                    </div>
                </div>
                <div className="recipe-card-container page-2">
                    <div className="recipe-card">
                        <img src="pasta.jpeg" className="recipe-image" />
                        <h3>Pasta</h3>
                        <p className="recipe-description">Delicious pasta</p>
                        <button className="recipe-button">View Recipe</button>
                        <button className="addtofavorites-button">Add To Favorites</button>
                        <div className="rating">
                            <button className="star" data-value="1">☆</button>
                            <button className="star" data-value="2">☆</button>
                            <button className="star" data-value="3">☆</button>
                            <button className="star" data-value="4">☆</button>
                            <button className="star" data-value="5">☆</button>
                        </div>
                    </div>
                    <div className="recipe-card">
                        <img src="pasta.jpeg" className="recipe-image" />
                        <h3>Pasta</h3>
                        <p className="recipe-description">Delicious pasta</p>
                        <button className="recipe-button">View Recipe</button>
                        <button className="addtofavorites-button">Add To Favorites</button>
                        <div className="rating">
                            <button className="star" data-value="1">☆</button>
                            <button className="star" data-value="2">☆</button>
                            <button className="star" data-value="3">☆</button>
                            <button className="star" data-value="4">☆</button>
                            <button className="star" data-value="5">☆</button>
                        </div>
                    </div>
                    <div className="recipe-card">
                        <img src="pasta.jpeg" className="recipe-image" />
                        <h3>Pasta</h3>
                        <p className="recipe-description">Delicious pasta</p>
                        <button className="recipe-button">View Recipe</button>
                        <button className="addtofavorites-button">Add To Favorites</button>
                        <div className="rating">
                            <button className="star" data-value="1">☆</button>
                            <button className="star" data-value="2">☆</button>
                            <button className="star" data-value="3">☆</button>
                            <button className="star" data-value="4">☆</button>
                            <button className="star" data-value="5">☆</button>
                        </div>
                    </div>
                </div>
                <div className="pagination">
                    <button className="prev-button">Prev</button>
                    <button className="next-button">Next</button>
                </div>
            </main>
            <footer>
                <div className="footer-container">
                    <div className="footer-links">
                        <a href="" className="footer-link">Privacy Policy</a>
                        <a href="" className="footer-link">Terms of Service</a>
                        <a href="" className="footer-link">About</a>
                        <a href="" className="footer-link">Support/Contact</a>
                    </div>
                </div>
            </footer>
            {/*<header className="App-header">
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>
                            {recipe.name}
                        </li>
                    ))}
                </ul>

                    </header>*/}
        </div>
    );
}

export default Home;