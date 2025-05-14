const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');

// Trending Songs: by most recent (optionally by play count if available)
router.get('/songs', async (req, res) => {
  try {
    // If you have playCount: sort({ playCount: -1, createdAt: -1 })
    const songs = await Song.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('artist');
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trending Albums: most recent
router.get('/albums', async (req, res) => {
  try {
    const albums = await Album.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('artist');
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trending Playlists: most recent public
router.get('/playlists', async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('user');
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
