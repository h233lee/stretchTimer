const mongoose = require('mongoose');
const user = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  alert: { type: Number, default: 0 },
  timer: { type: Number, default: 0 },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', user);
