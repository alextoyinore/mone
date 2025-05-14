const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true }, // user email or id
  cover: { type: String },
  releaseDate: { type: Date },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Album', AlbumSchema);
