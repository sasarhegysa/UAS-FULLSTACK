// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleButtonClick = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white z-30">
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        <span className="font-bold text-xl text-red-500">Traveloop</span>
        <svg
          className="w-5 h-5 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>

      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
        <Link to="/" className="hover:text-red-600 hover:underline">Home</Link>
        <Link to="/booking/custom" className="hover:text-red-600 hover:underline">Booking Custom</Link>
        <Link to="/events" className="hover:text-red-600 hover:underline">Event Info</Link>
      </nav>

      <button
        onClick={handleButtonClick}
        className="text-sm border border-gray-300 px-4 py-2 rounded-md hover:shadow-md transition"
      >
        {user ? 'Dashboard' : 'Get in Touch'}
      </button>
    </header>
  );
};

export default Header;
