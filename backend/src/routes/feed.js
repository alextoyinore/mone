const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');

// GET /api/feed/:userId
// Returns a personalized feed for the user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('following');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get songs from followed artists
    const followedArtistIds = user.following.map(f => f._id);
    const songs = await Song.find({ artist: { $in: followedArtistIds } }).sort({ createdAt: -1 }).limit(20).populate('artist');

    // Get recent public albums from followed artists
    const albums = await Album.find({ artist: { $in: followedArtistIds }, isPublic: true }).sort({ createdAt: -1 }).limit(10).populate('artist');

    // Get recent public playlists from followed users
    const playlists = await Playlist.find({ user: { $in: followedArtistIds }, isPublic: true }).sort({ createdAt: -1 }).limit(10).populate('user');

    // Optionally: trending songs (most recent, or by play count if tracked)
    const trending = await Song.find({}).sort({ createdAt: -1 }).limit(5).populate('artist');

    res.json({ songs, albums, playlists, trending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
