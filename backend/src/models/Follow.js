const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user email or id
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Follow', FollowSchema);
