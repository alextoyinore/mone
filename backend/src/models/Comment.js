const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user email or id
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
  playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: String }], // user emails or ids
});

// Virtual for replies count
CommentSchema.virtual('repliesCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
  count: true
});

CommentSchema.set('toObject', { virtuals: true });
CommentSchema.set('toJSON', { virtuals: true });

// Require at least one of song, playlist, or album
CommentSchema.pre('validate', function(next) {
  if (!this.song && !this.playlist && !this.album) {
    next(new Error('Either song, playlist, or album is required'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
