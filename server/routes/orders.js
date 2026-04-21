const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const router = express.Router();

// Place order
router.post('/place', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    const totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({
      user: req.userId,
      items: cart.items,
      totalAmount
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get my orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ orderedAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;