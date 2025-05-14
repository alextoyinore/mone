const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: { type: String, enum: ['upload', 'like', 'comment', 'follow'], required: true },
  user: { type: String, required: true }, // user email or id
  targetUser: { type: String }, // for follow, like, comment
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
