import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PricingPage from './pages/PricingPage';


function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={!user ? <AuthPage onLogin={handleLogin} initialMode="login" /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <AuthPage onLogin={handleLogin} initialMode="create_company" /> : <Navigate to="/dashboard" />} 
        />
        <Route path="/pricing" element={<PricingPage user={user} onLogin={handleLogin} />} />


        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            !user ? <Navigate to="/login" /> : (
              user.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> :
              user.role === 'manager' ? <ManagerDashboard user={user} onLogout={handleLogout} /> :
              <EmployeeDashboard user={user} onLogout={handleLogout} />
            )
          } 
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
