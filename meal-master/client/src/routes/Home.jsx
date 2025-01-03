import React, { useEffect, useState } from 'react';
import logo from '../meal-master-logo.png';
import profileAvatar from '../profile-picture.png'
import '../App.css';
import { useNavigate } from "react-router-dom";

function Home() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch('/auth/check-login', {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === 'User is logged in') {
                        fetch(`/api/users/${data.user.userId}`)
                            .then((response) => response.json())
                            .then((userData) => {
                                setUser(userData); // Set the full user data
                            })
                            .catch((error) => {
                                console.error('Error fetching user data:', error);
                                setUser(null); // In case of error, clear user data
                            });
                    } else {
                        setUser(null);
                    }
                })
                .catch((error) => {
                    console.error('Error during login check:', error);
                    setUser(null);
                });
        } else {
            setUser(null);
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
    const goToRegister = () => {
        navigate("/register");
    };
    const goToLogin = () => {
        navigate("/login");
    };
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const totalPages = Math.ceil(recipes.length / itemsPerPage);

    const handleChangePage = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = recipes.slice(startIndex, startIndex + itemsPerPage);

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPageLinks = 5; // Maximum visible page links
        const halfWindow = Math.floor(maxPageLinks / 2);

        let start = Math.max(1, currentPage - halfWindow);
        let end = Math.min(totalPages, currentPage + halfWindow);

        // Adjust the range if at the beginning or end
        if (currentPage <= halfWindow) {
            end = Math.min(totalPages, start + maxPageLinks - 1);
        }
        if (currentPage + halfWindow >= totalPages) {
            start = Math.max(1, totalPages - maxPageLinks + 1);
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };


    return (
        <div className="App">
            <header>
                <div>
                    {user ? (
                        <h1>Welcome, User {user[0].id}!</h1>
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
                        {user ? (<>
                            <div className="subsection">
                                <button>My Recipes</button>
                            </div>
                            <div className="subsection">
                                <button onClick={goToAddRecipe}>Add Recipe</button>
                            </div>
                        </>
                        ) : (<></>)}
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
                        {user ? (
                            <>
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
                                            {user[0].name}
                                        </button>
                                        <div className="profile-dropdown-menu">
                                            <button onClick={goToProfile}>My Profile</button>
                                            <button onClick={goToSettings}>Settings</button>
                                            <button onClick={logout}>Logout</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="auth-buttons-wrapper">
                                    <div className="subsection">
                                        <button className="authButton" onClick={goToRegister}>Register</button>
                                    </div>
                                    <div className="subsection">
                                        <button className="authButton" onClick={goToLogin}>Login</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <main>
                <h2>Recipes</h2>
                <div className="recipe-card-container page-1"> {currentItems.map((recipe) => (
                    <div className="recipe-card" key={recipe.id}>
                        {<img src={recipe.imageUrl || '/uploads/default.jpeg'} className="recipe-image" alt="receipeImage" />}
                        <h3>{recipe.name}</h3>
                        <p className="recipe-description">Delicious {recipe.name}!</p>
                        <button className="recipe-button">View Recipe</button>
                        {user ? (
                            <><button className="addtofavorites-button">Add To Favorites</button>
                                <div className="rating">
                                    <button className="star" data-value="1">☆</button>
                                    <button className="star" data-value="2">☆</button>
                                    <button className="star" data-value="3">☆</button>
                                    <button className="star" data-value="4">☆</button>
                                    <button className="star" data-value="5">☆</button>
                                </div></>
                        ) : (
                            <></>
                        )}

                    </div>))}
                </div>
                <div className="pagination">
                    <button onClick={() => handleChangePage(1)} disabled={currentPage === 1} className="first-button">First</button>
                    <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1} className="prev-button">Previous</button>
                    {currentPage > 3 && <span>...</span>}

                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            className={currentPage === page ? "active" : ""}
                            onClick={() => handleChangePage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    {currentPage < totalPages - 2 && <span>...</span>}
                    <button  onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages} className="next-button">Next</button>
                    <button onClick={() => handleChangePage(totalPages)} disabled={currentPage === totalPages} className="last-button">Last</button>
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