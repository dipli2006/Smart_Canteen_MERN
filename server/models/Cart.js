const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    category: String,
    imageUrl: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);