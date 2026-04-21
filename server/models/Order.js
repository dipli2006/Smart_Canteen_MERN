const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    name: String,
    price: Number,
    quantity: Number,
    category: String,
    imageUrl: String
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Placed', enum: ['Placed', 'Preparing', 'Ready', 'Delivered'] },
  orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);