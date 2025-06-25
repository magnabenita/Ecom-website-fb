import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser,role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-blue-900 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">
            <Link to="/">MAGNA</Link> {currentUser && <span className="text-sm text-purple-300 ml-2">({currentUser.email})</span>}
          </h1>


          {/* Hamburger menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-purple-400">Home</Link>
            <Link to="/products" className="hover:text-purple-400">Products</Link>
            <Link to="/cart" className="hover:text-purple-400">Cart</Link>
            <Link to="/wishlist" className="hover:text-purple-400">Wishlist</Link>

            {currentUser && role === 'admin' && (
              <Link to="/addproduct" className="hover:text-purple-400">Sell</Link>
            )}

            {currentUser && (
              <Link to="/orders" className="hover:text-purple-400">Orders</Link>
            )}

            {currentUser && role === 'admin' && (
              <Link to="/admin/orders" className="hover:text-yellow-400">Admin Orders</Link>
            )}

            {currentUser && role === 'admin' && (
              <Link to="/admin/analytics" className="hover:text-purple-400">Analytics</Link>
            )}

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/signup" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">Sign Up</Link>
                <Link to="/login" className="px-4 py-2 border border-purple-400 rounded">Login</Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Dropdown */}
        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-4 pb-4 pl-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-purple-400">Home</Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="hover:text-purple-400">Products</Link>
            <Link to="/cart" onClick={() => setIsOpen(false)} className="hover:text-purple-400">Cart</Link>
            <Link to="/wishlist" onClick={() => setIsOpen(false)} className="hover:text-purple-400">Wishlist</Link>

            {currentUser && role === 'admin' && (
              <>
                <Link to="/admin/orders" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Admin Orders</Link>
                <Link to="/admin/analytics" onClick={() => setIsOpen(false)} className="hover:text-purple-400">Analytics</Link>
              </>
            )}

            {currentUser && role !== 'admin' && (
              <Link to="/orders" onClick={() => setIsOpen(false)} className="hover:text-purple-400">Orders</Link>
            )}

          {currentUser ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-left text-red-400 pl-1"
              >
                Logout
            </button>
          ) : (
            <>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="text-purple-400">Sign Up</Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-purple-400">Login</Link>
            </>
          )}
        </div>
      )}
      </div>
    </header>
  );
};

export default Header;
