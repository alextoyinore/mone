const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: String, required: true }, // recipient email
  type: { type: String, enum: ['comment', 'like', 'follow', 'system'], required: true },
  message: { type: String, required: true },
  link: { type: String }, // e.g. /song/:id or /artist/:id
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
