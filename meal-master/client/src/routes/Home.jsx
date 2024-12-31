import React, { useEffect, useState } from 'react';
import logo from '../meal-master-logo.png';
import profileAvatar from '../profile-picture.png'
import '../App.css';
import { useNavigate } from "react-router-dom";

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
          fetch('/auth/check-login', {
            method: 'GET',
            headers: {
              'Authorization': `${token}`,  // Send token in the Authorization header
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message === 'User is logged in') {
                setIsLoggedIn(true);
                setUser(data.user);
              } else {
                setIsLoggedIn(false);
              }
            })
            .catch((error) => {
              console.error('Error during login check:', error);
              setIsLoggedIn(false);
            });
        } else {
          setIsLoggedIn(false);
        }
      }, []);
    

    const [recipes, setRecipes] = useState([]);
    useEffect(() => {
        fetch('/api/recipes')
            .then((response) => response.json())
            .then((data) => setRecipes(data));
    }, []);

    const navigate = useNavigate();
    const goToProfile = () => {
        navigate("/profile");
    };
    const goToSettings = () => {
        navigate("/settings");
    };
    const goToAddRecipe = () => {
        navigate("/addRecipe");
    };
    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false); // Or trigger a recheck of the login status
    };
    return (
        <div className="App">
            <header>
            <div>
            {isLoggedIn ? (
                <h1>Welcome, you are logged in!</h1>
            ) : (
                <h1>Please log in</h1>
            )}
        </div>
        <div>
          {user ? (
            <h1>Welcome, User {user.userId}!</h1> // Displaying userId or name if returned
          ) : (
            <h1>Please log in</h1>
          )}
        </div>
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
                            <button onClick={goToAddRecipe}>Add Recipe</button>
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
                                <button onClick={goToProfile} className="profile-button">
                                    <img src={profileAvatar} className="profile-avatar" alt="profilePicture" />
                                    User Name
                                </button>
                                <div className="profile-dropdown-menu">
                                    <button onClick={goToProfile}>My Profile</button>
                                    <button onClick={goToSettings}>Settings</button>
                                    <button onClick={logout}>Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <h2>Recipes</h2>
                <div className="recipe-card-container page-1"> {recipes.map((recipe) => (
                    <div className="recipe-card" key={recipe.id}>
                        {<img src={recipe.imageUrl || '/uploads/default.jpeg'} className="recipe-image" alt="receipeImage"/>}
                        <h3>{recipe.name}</h3>
                        <p className="recipe-description">Delicious {recipe.name}!</p>
                        <button className="recipe-button">View Recipe</button>
                        <button className="addtofavorites-button">Add To Favorites</button>
                        <div className="rating">
                            <button className="star" data-value="1">☆</button>
                            <button className="star" data-value="2">☆</button>
                            <button className="star" data-value="3">☆</button>
                            <button className="star" data-value="4">☆</button>
                            <button className="star" data-value="5">☆</button>
                        </div>
                    </div>))}
                </div>
                <div className="pagination">
                    <button className="prev-button">Prev</button>
                    <button className="next-button">Next</button>
                </div>
            </main>
            <footer>
                <div className="footer-container">
                    <div className="footer-links">
                        <a href="/" className="footer-link">Privacy Policy</a>
                        <a href="/" className="footer-link">Terms of Service</a>
                        <a href="/" className="footer-link">About</a>
                        <a href="/" className="footer-link">Support/Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;