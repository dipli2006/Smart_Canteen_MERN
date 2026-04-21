import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, placeOrder } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handleQty = async (itemId, qty) => {
    if (qty < 1) { await removeFromCart(itemId); return; }
    await updateCartItem(itemId, qty);
  };

  const handlePlaceOrder = async () => {
    setError('');
    setPlacing(true);
    try {
      await placeOrder();
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state fade-in">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some delicious items from our menu!</p>
          <Link to="/menu" className="btn btn-primary" style={{ marginTop: 24 }}>Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-container fade-in">
      <h1 className="cart-title">Your Cart</h1>
      <p className="cart-subtitle">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.item} className="cart-item card">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item-img"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'; }}
              />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <span className="cart-item-cat">{item.category}</span>
                <div className="cart-item-price">₹{item.price} each</div>
              </div>
              <div className="cart-item-controls">
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => handleQty(item.item, item.quantity - 1)}>−</button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => handleQty(item.item, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-total">₹{item.price * item.quantity}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item.item)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-rows">
            {items.map(item => (
              <div key={item.item} className="summary-row">
                <span>{item.name} ×{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="summary-row"><span>Tax (5%)</span><span>₹{tax}</span></div>
          <div className="summary-divider" />
          <div className="summary-row total-row"><span>Total</span><span>₹{total}</span></div>

          {error && <div className="alert alert-error" style={{ marginTop: 16 }}>⚠️ {error}</div>}

          <button className="btn btn-primary" style={{ width: '100%', marginTop: 24 }} onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing Order...' : '🍽️ Place Order'}
          </button>

          <Link to="/menu" className="btn btn-ghost" style={{ width: '100%', marginTop: 12, textAlign: 'center' }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}