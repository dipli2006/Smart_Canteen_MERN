const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  email: {
    type: String, required: true, unique: true,
    validate: {
      validator: v => v.endsWith('@kongu.edu'),
      message: 'Email must end with @kongu.edu'
    }
  },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);