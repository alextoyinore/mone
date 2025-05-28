const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for email/password auth
  googleId: { type: String }, // For Google login
  avatar: { type: String },
  bio: { type: String, default: "" },
  social: { type: Object, default: {} }, // e.g. { instagram, twitter, soundcloud }
  notificationPreferences: {
    comments: { type: Boolean, default: true },
    likes: { type: Boolean, default: true },
    follows: { type: Boolean, default: true },
    system: { type: Boolean, default: true }
  },
  recentlyPlayed: [{
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    playedAt: { type: Date, default: Date.now }
  }], 
  role: { type: String, enum: ['artist', 'user', 'admin'], default: 'user' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  badges: { type: [String], default: [] },
  isPremium: { type: Boolean, default: false },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  premiumSince: { type: Date },
  premiumUntil: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

