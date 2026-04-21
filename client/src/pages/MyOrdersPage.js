import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MyOrdersPage.css';

const STATUS_CONFIG = {
  Placed:    { color: '#3B82F6', bg: '#DBEAFE', icon: '📋' },
  Preparing: { color: '#F59E0B', bg: '#FEF3C7', icon: '👨‍🍳' },
  Ready:     { color: '#10B981', bg: '#D1FAE5', icon: '✅' },
  Delivered: { color: '#6B7280', bg: '#F3F4F6', icon: '🎉' },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get('/api/orders/my').then(r => {
      setOrders(r.data);
      if (r.data.length > 0) setExpanded(r.data[0]._id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><div className="spinner" /></div>;

  if (orders.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state fade-in">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Place your first order to see it here!</p>
          <Link to="/menu" className="btn btn-primary" style={{ marginTop: 24 }}>Order Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page page-container fade-in">
      <div className="orders-header">
        <div>
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
        <Link to="/menu" className="btn btn-outline">+ New Order</Link>
      </div>

      <div className="orders-list">
        {orders.map(order => {
          const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.Placed;
          const isOpen = expanded === order._id;
          const date = new Date(order.orderedAt).toLocaleString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          });

          return (
            <div key={order._id} className={`order-card card ${isOpen ? 'open' : ''}`}>
              <div className="order-header" onClick={() => setExpanded(isOpen ? null : order._id)}>
                <div className="order-meta">
                  <div className="order-id">Order #{order._id.slice(-6).toUpperCase()}</div>
                  <div className="order-date">{date}</div>
                </div>
                <div className="order-info">
                  <div className="order-items-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                  <div className="order-amount">₹{order.totalAmount}</div>
                  <div className="order-status" style={{ background: status.bg, color: status.color }}>
                    {status.icon} {order.status}
                  </div>
                  <span className="expand-icon">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div className="order-details fade-in">
                  <div className="order-items-grid">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="order-item-img"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'; }}
                        />
                        <div className="order-item-info">
                          <span className="order-item-name">{item.name}</span>
                          <span className="order-item-cat">{item.category}</span>
                        </div>
                        <div className="order-item-qty">×{item.quantity}</div>
                        <div className="order-item-price">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  <div className="order-totals">
                    <div className="total-line"><span>Subtotal</span><span>₹{Math.round(order.totalAmount / 1.05)}</span></div>
                    <div className="total-line"><span>Tax (5%)</span><span>₹{order.totalAmount - Math.round(order.totalAmount / 1.05)}</span></div>
                    <div className="total-line grand"><span>Total Paid</span><span>₹{order.totalAmount}</span></div>
                  </div>

                  <div className="order-status-track">
                    {['Placed', 'Preparing', 'Ready', 'Delivered'].map((s, i) => {
                      const statuses = ['Placed', 'Preparing', 'Ready', 'Delivered'];
                      const currentIdx = statuses.indexOf(order.status);
                      const isDone = i <= currentIdx;
                      const sc = STATUS_CONFIG[s];
                      return (
                        <div key={s} className={`track-step ${isDone ? 'done' : ''}`}>
                          <div className="track-dot" style={isDone ? { background: sc.color } : {}}>
                            {isDone ? sc.icon : '○'}
                          </div>
                          <span>{s}</span>
                          {i < 3 && <div className={`track-line ${isDone && i < currentIdx ? 'done' : ''}`} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}