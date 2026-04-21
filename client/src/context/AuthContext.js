import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart');
      setCart(res.data);
    } catch {}
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    setToken(t); setUser(u);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    await fetchCart();
    return u;
  };

  const signup = async (name, rollNumber, email, password) => {
    const res = await axios.post('/api/auth/signup', { name, rollNumber, email, password });
    const { token: t, user: u } = res.data;
    setToken(t); setUser(u);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    return u;
  };

  const logout = () => {
    setToken(null); setUser(null); setCart({ items: [] });
    localStorage.removeItem('token'); localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const addToCart = async (item) => {
    const res = await axios.post('/api/cart/add', {
      itemId: item._id, name: item.name, price: item.price,
      category: item.category, imageUrl: item.imageUrl
    });
    setCart(res.data);
  };

  const updateCartItem = async (itemId, quantity) => {
    const res = await axios.put('/api/cart/update', { itemId, quantity });
    setCart(res.data);
  };

  const removeFromCart = async (itemId) => {
    const res = await axios.delete(`/api/cart/remove/${itemId}`);
    setCart(res.data);
  };

  const placeOrder = async () => {
    const res = await axios.post('/api/orders/place');
    setCart({ items: [] });
    return res.data;
  };

  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AuthContext.Provider value={{
      user, token, cart, cartCount,
      login, signup, logout, addToCart, updateCartItem, removeFromCart, placeOrder, fetchCart
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);