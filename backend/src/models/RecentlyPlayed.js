const mongoose = require('mongoose');

const RecentlyPlayedSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user email or id
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
  playedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecentlyPlayed', RecentlyPlayedSchema);
