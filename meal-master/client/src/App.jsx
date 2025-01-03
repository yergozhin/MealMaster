import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/Home.jsx';
import Profile from './routes/Profile.jsx';
import Settings from './routes/Settings.jsx';
import AddRecipe from './routes/AddRecipe.jsx';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import ProtectedRoute from './auth/ProtectedRoute';
import ViewRecipe from './routes/ViewRecipe.jsx';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/addRecipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/recipe/:id" element={<ViewRecipe />} />
    </Routes>
  </Router>
);

export default App;
