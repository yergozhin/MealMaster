import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/recipes')
        .then((response) => response.json())
        .then((data) => setRecipes(data));
      }, []);
  return (
    <div className="App">
      <header className="App-header">
      <ul>
                {recipes.map((recipe) => (
                    <li key={recipe.id}>
                        {recipe.name}
                    </li>
                ))}
            </ul>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
