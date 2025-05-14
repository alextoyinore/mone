const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Song = require('../models/Song');
const User = require('../models/User');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');

// Site-wide summary
router.get('/summary', async (req, res) => {
  try {
    const [totalUsers, totalSongs, totalAlbums, totalPlaylists, totalPlays, totalLikes, totalShares] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      Album.countDocuments(),
      Playlist.countDocuments(),
      Analytics.countDocuments({ type: 'play' }),
      Analytics.countDocuments({ type: 'like' }),
      Analytics.countDocuments({ type: 'share' })
    ]);
    res.json({ totalUsers, totalSongs, totalAlbums, totalPlaylists, totalPlays, totalLikes, totalShares });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Top songs site-wide
router.get('/top-songs', async (req, res) => {
  try {
    const top = await Analytics.aggregate([
      { $match: { type: 'play' } },
      { $group: { _id: "$song", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const songIds = top.map(t => t._id);
    const songs = await Song.find({ _id: { $in: songIds } }).populate('artist');
    res.json(songs.map(song => ({ ...song.toObject(), playCount: top.find(t => t._id.equals(song._id)).count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Top artists site-wide
router.get('/top-artists', async (req, res) => {
  try {
    const top = await Analytics.aggregate([
      { $match: { type: 'play' } },
      { $group: { _id: "$artist", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const artistIds = top.map(t => t._id);
    const artists = await User.find({ _id: { $in: artistIds } });
    res.json(artists.map(artist => ({ ...artist.toObject(), playCount: top.find(t => t._id.equals(artist._id)).count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
