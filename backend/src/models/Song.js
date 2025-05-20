const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  audioUrl: { type: String, required: true }, // Cloudinary URL
  coverArt: { type: String }, // Cloudinary URL
  genre: { type: String },
  description: { type: String },
  releaseDate: { type: Date },
  lyrics: { type: String },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  language: { type: String },
  duration: { type: Number }, // in seconds
  plays: { type: Number, default: 0 },
  likes: [{ type: String }], // user emails or ids
  recentlyPlayed: [{ user: String, playedAt: { type: Date, default: Date.now } }], // array of { user, playedAt }
  // Links to streaming platforms
  links: {
    spotify: { type: String },
    appleMusic: { type: String },
    audiomack: { type: String },
    boomplay: { type: String },
    youtube: { type: String },
    soundcloud: { type: String },
    deezer: { type: String },
    tidal: { type: String },
    amazonMusic: { type: String },
    other: { type: String },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Song', songSchema);

