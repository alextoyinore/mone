const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  bio: { type: String },
  avatar: { type: String }, // Cloudinary URL
  socials: {
    instagram: String,
    twitter: String,
    facebook: String,
    youtube: String,
    tiktok: String,
    website: String
  },
  genres: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Artist', artistSchema);
