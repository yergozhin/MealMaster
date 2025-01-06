import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../meal-master-logo.png';
import profileAvatar from '../profile-picture.png';
import '../App.css';

function MyRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [user, setUser] = useState(null);
    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState({
        Welcome: '',
        Pleaselogin: '',
        Home: '',
        MyRecipes: '',
        AddRecipe: '',
        BrowseRecipes: '',
        SearchPlaceholder: '',
        FavoriteRecipes: '',
        Register: '',
        Login: '',
        Logout: '',
        Profile: '',
        Settings: '',
        Title: '',
        Description: '',
        User: '',
        Recipes: '',
        Delicious: '',
        ViewRecipe: '',
        AddToFavorites: '',
        First: '',
        Previous: '',
        Next: '',
        Last: '',
    });

    const fetchTranslation = async (word, lang) => {
        try {
            const response = await fetch(`/api/translations/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word, lang }),
            });
    
            if (!response.ok) {
                throw new Error('Translation failed');
            }
    
            const data = await response.json();
            return data.translation || word;
        } catch (error) {
            console.error('Error fetching translation:', error);
            return word;
        }
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    useEffect(() => {
        const fetchPageTranslations = async () => {
            const translationsData = {
                Welcome: await fetchTranslation('Welcome', language),
                Pleaselogin: await fetchTranslation('Please log in', language),
                Home: await fetchTranslation('Home', language),
                MyRecipes: await fetchTranslation('My Recipes', language),
                AddRecipe: await fetchTranslation('Add Recipe', language),
                BrowseRecipes: await fetchTranslation('Browse Recipes', language),
                SearchPlaceholder: await fetchTranslation('Search for recipes...', language),
                FavoriteRecipes: await fetchTranslation('Favorite Recipes', language),
                Register: await fetchTranslation('Register', language),
                Login: await fetchTranslation('Login', language),
                Logout: await fetchTranslation('Logout', language),
                Profile: await fetchTranslation('Profile', language),
                Settings: await fetchTranslation('Settings', language),
                Title: await fetchTranslation('Title', language),
                Description: await fetchTranslation('Description', language),
                User: await fetchTranslation('User', language),
                Recipes: await fetchTranslation('Recipes', language),
                Delicious: await fetchTranslation('Delicious', language),
                ViewRecipe: await fetchTranslation('View Recipe', language),
                AddToFavorites: await fetchTranslation('Add To Favorites', language),
                First: await fetchTranslation('First', language),
                Previous: await fetchTranslation('Previous', language),
                Next: await fetchTranslation('Next', language),
                Last: await fetchTranslation('Last', language),
            };
            setTranslations(translationsData);
        };

        fetchPageTranslations();
    }, [language]);

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
                                setUser(userData);
                            })
                            .catch((error) => {
                                console.error('Error fetching user data:', error);
                                setUser(null);
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

    useEffect(() => {
        if (user) {
            fetch('/api/recipes')
                .then((response) => response.json())
                .then((data) => {
                    const userRecipes = data.filter(recipe => recipe.userId === user[0].id);
                    setRecipes(userRecipes);
                });
        }
    }, [user]);
    

    const navigate = useNavigate();
    const goToProfile = () => navigate("/profile");
    const goToSettings = () => navigate("/settings");
    const goToAddRecipe = () => navigate("/addRecipe");
    const goToViewRecipe = (id) => navigate(`/recipe/${id}`);
    const goToHome = () => {
        navigate("/");
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
        const maxPageLinks = 5;
        const halfWindow = Math.floor(maxPageLinks / 2);

        let start = Math.max(1, currentPage - halfWindow);
        let end = Math.min(totalPages, currentPage + halfWindow);

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
                        <h1>{translations.Welcome}, {translations.User} {user[0].id}!</h1>
                    ) : (
                        <h1>{translations.Pleaselogin}</h1>
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
                            <button onClick={goToHome}>{translations.Home}</button>
                        </div>
                        {user && (
                            <>
                                <div className="subsection">
                                    <button onClick={goToAddRecipe}>{translations.AddRecipe}</button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="section">
                        {user ? (
                            <>
                                <div className="subsection">
                                    <div className="user-profile">
                                        <button onClick={goToProfile} className="profile-button">
                                            <img src={profileAvatar} className="profile-avatar" alt="profilePicture" />
                                            {user[0].name}
                                        </button>
                                        <div className="profile-dropdown-menu">
                                            <button onClick={goToProfile}>{translations.Profile}</button>
                                            <button onClick={goToSettings}>{translations.Settings}</button>
                                            <button onClick={logout}>{translations.Logout}</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="auth-buttons-wrapper">
                                <div className="subsection">
                                    <button onClick={() => navigate("/register")}>{translations.Register}</button>
                                </div>
                                <div className="subsection">
                                    <button onClick={() => navigate("/login")}>{translations.Login}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main>
                <h2>{translations.MyRecipes}</h2>
                <div className="recipe-card-container">
                    {currentItems.map((recipe) => (
                        <div className="recipe-card" key={recipe.id}>
                            <img src={recipe.imageUrl || '/uploads/default.jpeg'} className="recipe-image" alt="recipe" />
                            <h3>{recipe.name}</h3>
                            <p>{translations.Delicious} {recipe.name}!</p>
                            <button onClick={() => goToViewRecipe(recipe.id)}>{translations.ViewRecipe}</button>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <button onClick={() => handleChangePage(1)} disabled={currentPage === 1}>{translations.First}</button>
                    <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1}>{translations.Previous}</button>
                    {getPageNumbers().map((page) => (
                        <button key={page} onClick={() => handleChangePage(page)}>{page}</button>
                    ))}
                    <button onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages}>{translations.Next}</button>
                    <button onClick={() => handleChangePage(totalPages)} disabled={currentPage === totalPages}>{translations.Last}</button>
                </div>
            </main>
            <footer>
                <div className="footer-container">
                    <div className="footer-links">
                        <a href="/" className="footer-link">Privacy Policy</a>
                        <a href="/" className="footer-link">Terms of Service</a>
                        <a href="/" className="footer-link">About Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default MyRecipes;
