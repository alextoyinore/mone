const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user email or id
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
