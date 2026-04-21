import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

export default function HomePage() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', rollNumber: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.email.endsWith('@kongu.edu')) {
      setError('Email must end with @kongu.edu'); return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        setSuccess('Welcome back! 🎉');
      } else {
        await signup(form.name, form.rollNumber, form.email, form.password);
        setSuccess('Account created! Welcome 🎉');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🎓 Kongu Engineering College</div>
          <h1 className="hero-title">
            Campus Food,<br />
            <span className="accent">Delivered Fast</span>
          </h1>
          <p className="hero-subtitle">
            Order your favourite meals from the college canteen — hot, fresh, and right to you.
          </p>
          {user ? (
            <div className="hero-actions">
              <p className="welcome-msg">Welcome back, <strong>{user.name}</strong>! 👋</p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/menu')}>
                🍽️ Order Now
              </button>
            </div>
          ) : (
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' })}>
                Get Started
              </button>
            </div>
          )}
        </div>
        <div className="hero-visual">
          <div className="food-orbit">
            {['🍛', '🍗', '🥗', '🧋', '🥟', '🍚'].map((emoji, i) => (
              <div key={i} className="orbit-item" style={{ '--i': i }}>
                <span>{emoji}</span>
              </div>
            ))}
            <div className="orbit-center">🍽️</div>
          </div>
        </div>
      </section>

      {/* Features Row */}
      <section className="features-row">
        {[
          { icon: '⚡', title: 'Fast Ordering', desc: 'Place your order in under a minute' },
          { icon: '🔒', title: 'Secure Login', desc: 'Only @kongu.edu emails allowed' },
          { icon: '📦', title: 'Track Orders', desc: 'Check your order history anytime' },
        ].map((f, i) => (
          <div key={i} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Auth Section */}
      {!user && (
        <section className="auth-section" id="auth-section">
          <div className="auth-card card">
            <div className="auth-tabs">
              <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Login</button>
              <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(''); }}>Sign Up</button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <h2 className="auth-title">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="auth-subtitle">{mode === 'login' ? 'Sign in to order food' : 'Join the campus food community'}</p>

              {mode === 'signup' && (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input className="input-field" name="name" placeholder="Your full name" value={form.name} onChange={handle} required />
                  </div>
                  <div className="form-group">
                    <label>Roll Number</label>
                    <input className="input-field" name="rollNumber" placeholder="e.g. 20CS001" value={form.rollNumber} onChange={handle} required />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input className="input-field" name="email" type="email" placeholder="yourname@kongu.edu" value={form.email} onChange={handle} required />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input className="input-field" name="password" type="password" placeholder="Enter password" value={form.password} onChange={handle} required />
              </div>

              {error && <div className="alert alert-error">⚠️ {error}</div>}
              {success && <div className="alert alert-success">✅ {success}</div>}

              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
                {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
              </button>

              <p className="auth-switch">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" className="link-btn" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
                  {mode === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}