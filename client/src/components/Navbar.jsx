// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // 👈 import logo

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src={logo} 
            alt="Nexora" 
            className="h-8 w-8 rounded-lg" // adjust size as needed
          />
          <span className="text-xl font-bold text-nexora-primary">Nexora</span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="text-gray-700 hover:text-nexora-secondary transition"
            >
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-nexora-primary text-white px-3 py-1 rounded-lg hover:bg-nexora-secondary transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-nexora-primary hover:text-nexora-secondary font-medium"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;