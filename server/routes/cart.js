const express = require('express');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const router = express.Router();

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }) || { items: [] };
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add item
router.post('/add', auth, async (req, res) => {
  try {
    const { itemId, name, price, category, imageUrl } = req.body;
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) cart = new Cart({ user: req.userId, items: [] });

    const existing = cart.items.find(i => i.item.toString() === itemId);
    if (existing) existing.quantity += 1;
    else cart.items.push({ item: itemId, name, price, quantity: 1, category, imageUrl });

    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update quantity
router.put('/update', auth, async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    if (quantity <= 0) cart.items = cart.items.filter(i => i.item.toString() !== itemId);
    else {
      const item = cart.items.find(i => i.item.toString() === itemId);
      if (item) item.quantity = quantity;
    }
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Remove item
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i.item.toString() !== req.params.itemId);
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.userId }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;