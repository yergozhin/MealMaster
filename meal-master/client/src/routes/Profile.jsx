import React, { useEffect, useState } from 'react';
import logo from '../meal-master-logo.png';
import profileAvatar from '../profile-picture.png';
import '../App.css';

function Profile() {
    const [user, setUser] = useState(null);
    const fetchTranslation = async (word, lang) => {
        console.log(word, lang);
        const response = await fetch(`/api/translations/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ word, lang }),
        });
        if (response.ok) {
            const data = await response.json();
            return data.translation;
        }
    };

    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState({
        Profile: '',
        Username: '',
        Email: '',
        Logout: '',
    });

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    useEffect(() => {
        const fetchPageTranslations = async () => {
            const translationsData = {
                Profile: await fetchTranslation('Profile', language),
                Username: await fetchTranslation('Username', language),
                Email: await fetchTranslation('Email', language),
                Logout: await fetchTranslation('Logout', language),
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

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
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
                            <h3>{translations.Profile}</h3>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {user ? (
                    <div className="user-profile">
                        <img src={profileAvatar} className="profile-avatar" alt="profilePicture" />
                        <h2>{translations.Username}: {user[0].name}</h2>
                        <p>{translations.Email}: {user[0].email}</p>
                        <button onClick={logout}>{translations.Logout}</button>
                    </div>
                ) : (
                    <div>
                        <h3>{translations.Profile}</h3>
                        <p>{translations.Username}: N/A</p>
                        <p>{translations.Email}: N/A</p>
                    </div>
                )}
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

export default Profile;
