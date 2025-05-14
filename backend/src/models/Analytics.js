const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  user: { type: String }, // user email or id
  type: { type: String, enum: ['play', 'like', 'share'], required: true },
  createdAt: { type: Date, default: Date.now },
  geo: {
    country: { type: String },
    city: { type: String }
  },
  device: { type: String },
  browser: { type: String }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
