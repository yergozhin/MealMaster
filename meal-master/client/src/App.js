import React, { useEffect, useState } from 'react';
import logo from './meal-master-logo.png';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    fetch('/api/recipes')
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
        
      </header>
    </div>
  );
}

export default App;
