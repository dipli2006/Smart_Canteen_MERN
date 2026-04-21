import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MenuPage.css';

const CATEGORIES = ['All', 'Veg', 'Non-Veg', 'Snacks', 'Drinks'];

const CATEGORY_META = {
  Veg:       { icon: '🥗', color: 'badge-veg' },
  'Non-Veg': { icon: '🍗', color: 'badge-nonveg' },
  Snacks:    { icon: '🥟', color: 'badge-snacks' },
  Drinks:    { icon: '🧋', color: 'badge-drinks' },
};

export default function MenuPage() {
  const { addToCart, cart } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedMap, setAddedMap] = useState({});

  useEffect(() => {
    axios.get('/api/items').then(r => {
      setItems(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAdd = async (item) => {
    try {
      await addToCart(item);
      setAddedMap(prev => ({ ...prev, [item._id]: true }));
      setTimeout(() => setAddedMap(prev => ({ ...prev, [item._id]: false })), 1500);
    } catch (err) { console.error(err); }
  };

  const getCartQty = (itemId) => {
    const found = cart?.items?.find(i => i.item === itemId || i.item?._id === itemId);
    return found ? found.quantity : 0;
  };

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    const catItems = filtered.filter(i => i.category === cat);
    if (catItems.length) acc[cat] = catItems;
    return acc;
  }, {});

  if (loading) return <div className="page-container"><div className="spinner" /></div>;

  return (
    <div className="menu-page page-container fade-in">
      <div className="menu-header">
        <div>
          <h1 className="menu-title">Our Menu</h1>
          <p className="menu-subtitle">Fresh food, made with love 🤍</p>
        </div>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat !== 'All' && CATEGORY_META[cat]?.icon + ' '}
            {cat}
          </button>
        ))}
      </div>

      {Object.entries(grouped).map(([category, catItems]) => (
        <div key={category} className="category-section">
          <div className="category-heading">
            <span className="cat-emoji">{CATEGORY_META[category]?.icon}</span>
            <h2>{category}</h2>
            <span className="cat-count">{catItems.length} items</span>
          </div>
          <div className="items-grid">
            {catItems.map(item => {
              const qty = getCartQty(item._id);
              const justAdded = addedMap[item._id];
              return (
                <div key={item._id} className="item-card card fade-in">
                  <div className="item-img-wrap">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="item-img"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; }}
                    />
                    <span className={`badge ${CATEGORY_META[item.category]?.color} item-badge`}>
                      {item.category}
                    </span>
                    {qty > 0 && <div className="qty-pill">×{qty} in cart</div>}
                  </div>
                  <div className="item-body">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-desc">{item.description}</p>
                    <div className="item-footer">
                      <span className="item-price">₹{item.price}</span>
                      <button
                        className={`btn btn-sm ${justAdded ? 'btn-added' : 'btn-primary'}`}
                        onClick={() => handleAdd(item)}
                      >
                        {justAdded ? '✓ Added!' : qty > 0 ? '+ Add More' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No items found</h3>
          <p>Try a different category</p>
        </div>
      )}
    </div>
  );
}