import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍽️</span>
          <span className="brand-name">KonguBites</span>
        </Link>

        {user && (
          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Menu</Link>
            <Link to="/my-orders" className={`nav-link ${location.pathname === '/my-orders' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Orders</Link>
            <Link to="/cart" className={`nav-cart ${location.pathname === '/cart' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              <span>🛒</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              <span>Cart</span>
            </Link>
            <div className="nav-user">
              <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
              <span className="user-name">{user.name.split(' ')[0]}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        )}

        {user && (
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>
    </nav>
  );
}