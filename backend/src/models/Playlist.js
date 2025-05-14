const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  cover: { type: String, default: "" }, // image url
  isPublic: { type: Boolean, default: false },
  slug: { type: String, unique: true, sparse: true }, // for public sharing
  user: { type: String, required: true }, // owner email or id
  collaborators: [{ type: String }], // array of user emails or ids
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
}, { timestamps: true });

module.exports = mongoose.model('Playlist', PlaylistSchema);
