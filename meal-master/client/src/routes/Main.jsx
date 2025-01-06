import React, { useEffect, useState } from 'react';
import logo from '../meal-master-logo.png';
import profileAvatar from '../profile-picture.png'
import '../App.css';
import { useNavigate } from "react-router-dom";

function Main() {
    const [recipes, setRecipes] = useState([]);
    const [user, setUser] = useState(null);
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
    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };
    useEffect(() => {
        const translateRecipes = async () => {
            const translatedRecipes = await Promise.all(
                recipes.map(async (recipe) => {
                    const translatedName = await fetchTranslation(recipe.name || '', language);
                    const translatedDescription = await fetchTranslation(recipe.description || '', language);

                    return {
                        ...recipe,
                        name: translatedName,
                        description: translatedDescription,
                    };
                })
            );
            setRecipes(translatedRecipes);
        };

        if (recipes.length > 0) {
            translateRecipes();
        }
    }, [recipes, language]);
    
      
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
        fetch('/api/recipes')
            .then((response) => response.json())
            .then((data) => {
                setRecipes(data);
            });
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
    const goToMyRecipes = () => {
        navigate("/myRecipes");
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
    const goToViewRecipe = (id) => {
        navigate(`/recipe/${id}`);
    };
    const goToAddTranslation = () => {
        navigate("/addTranslation");
    };
    const goToHome = () => {
        navigate("/");
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
    const currentItems = Array.isArray(recipes) ? recipes.slice(startIndex, startIndex + itemsPerPage) : [];

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
                        {user && user.length > 0 ? (<>
                            <div className="subsection">
                                <button onClick={goToMyRecipes}>{translations.MyRecipes}</button>
                            </div>
                            <div className="subsection">
                                <button onClick={goToAddRecipe}>{translations.AddRecipe}</button>
                            </div>
                        </>
                        ) : (<></>)}
                        <div className="subsection">
                            <div className="filter-dropdown">
                                <button className="filter-dropdown-button">{translations.BrowseRecipes}</button>
                                <div className="filter-dropdown-content">
                                    <label><input type="checkbox" className="filter" name="breakfast" />Breakfast</label>
                                    <label><input type="checkbox" className="filter" name="lunch" />Lunch</label>
                                    <label><input type="checkbox" className="filter" name="dinner" />Dinner</label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => changeLanguage('en')}>English</button>
                            <button onClick={() => changeLanguage('es')}>Español</button>
                            {user && user.length > 0 && user[0].roleId === 1 ?
                                <button onClick={goToAddTranslation}>Add Translation</button> : <></>}
                        </div>
                    </div>
                    <div className="section">
                        {user && user.length > 0 ? (
                            <>
                                <div className="subsection">
                                    <div className="search-recipes">
                                        <input type="text" className="search-input" placeholder="Search for recipes..." />
                                    </div>
                                </div>
                                <div className="subsection">
                                    <button>{translations.FavoriteRecipes}</button>
                                </div>
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
                            <>
                                <div className="auth-buttons-wrapper">
                                    <div className="subsection">
                                        <button className="authButton" onClick={goToRegister}>{translations.Register}</button>
                                    </div>
                                    <div className="subsection">
                                        <button className="authButton" onClick={goToLogin}>{translations.Login}</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <main>
                <h2>{translations.Recipes}</h2>
                <div className="recipe-card-container page-1"> {currentItems.map((recipe) => (
                    <div className="recipe-card" key={recipe.id}>
                        {<img src={recipe.imageUrl || '/uploads/default.jpeg'} className="recipe-image" alt="receipeImage" />}
                        <h3>{recipe.name}</h3>
                        <p className="recipe-description">{translations.Delicious} {recipe.name}!</p>
                        <button onClick={() => goToViewRecipe(recipe.id)} className="recipe-button">{translations.ViewRecipe}</button>
                    </div>))}
                </div>
                <div className="pagination">
                    <button onClick={() => handleChangePage(1)} disabled={currentPage === 1} className="first-button">{translations.First}</button>
                    <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1} className="prev-button">{translations.Previous}</button>
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
                    <button onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages} className="next-button">{translations.Next}</button>
                    <button onClick={() => handleChangePage(totalPages)} disabled={currentPage === totalPages} className="last-button">{translations.Last}</button>
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

export default Main;