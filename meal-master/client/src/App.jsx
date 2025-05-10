import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './routes/Main.jsx';
import Profile from './routes/Profile.jsx';
import Settings from './routes/Settings.jsx';
import AddRecipe from './routes/AddRecipe.jsx';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import ProtectedRoute from './auth/ProtectedRoute';
import ViewRecipe from './routes/ViewRecipe.jsx';
import AdminRouteRecipe from './auth/AdminRouteRecipe';
import DeleteRecipe from './routes/DeleteRecipe.jsx';
import UpdateRecipe from './routes/UpdateRecipe.jsx';
import AddTranslation from './routes/AddTranslation.jsx';
import AdminRoute from './auth/AdminRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/addRecipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/recipe/:id" element={<ViewRecipe />} />
      <Route path="/deleteRecipe/:id" element={<AdminRouteRecipe><DeleteRecipe /></AdminRouteRecipe>} />
      <Route path="/updateRecipe/:id" element={<AdminRouteRecipe><UpdateRecipe /></AdminRouteRecipe>} />
      <Route path="/addTranslation" element={<AdminRoute><AddTranslation /></AdminRoute>} />
    </Routes>
  </Router>
);

export default App;
