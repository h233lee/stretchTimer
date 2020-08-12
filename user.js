const mongoose = require('mongoose');
const user = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  alert: { type: String, default: '0' },
  timer: { type: String, default: '0' },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', user);
