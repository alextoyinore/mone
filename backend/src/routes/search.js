const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');

// Search across songs, artists, and playlists
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    console.log(q);
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Search songs
    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
      ]
    })
    .populate('artist')
    .limit(10);

    console.log(songs);

    // Search artists
    const artists = await Artist.find({
      name: { $regex: q, $options: 'i' }
    })
    .limit(10);

    // Search playlists
    const playlists = await Playlist.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    })
    .populate('user')
    .limit(10);

    res.json({
      songs,
      artists,
      playlists
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search songs only
router.get('/songs', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
      ]
    })
    .populate('artist')
    .limit(20);

    res.json(songs);
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search artists only
router.get('/artists', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const artists = await Artist.find({
      name: { $regex: q, $options: 'i' }
    })
    .limit(20);

    res.json(artists);
  } catch (error) {
    console.error('Error searching artists:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search playlists only
router.get('/playlists', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const playlists = await Playlist.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    })
    .limit(20);

    res.json(playlists);
  } catch (error) {
    console.error('Error searching playlists:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
