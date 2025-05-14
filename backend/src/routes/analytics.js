const express = require('express');
const Analytics = require('../models/Analytics');
const router = express.Router();

// Log analytics event
router.post('/:type/:id', async (req, res) => {
  try {
    const { user } = req.body;
    const { type, id } = req.params;
    if (!['play', 'like', 'share'].includes(type)) return res.status(400).json({ error: 'Invalid type' });
    const data = { type, user };
    if (type === 'play' || type === 'like' || type === 'share') data.song = id;
    // Optionally, add artist analytics
    const analytics = new Analytics(data);
    await analytics.save();
    res.status(201).json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics for a song
router.get('/song/:songId', async (req, res) => {
  try {
    const analytics = await Analytics.find({ song: req.params.songId });
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics for an artist
router.get('/artist/:artistId', async (req, res) => {
  try {
    const analytics = await Analytics.find({ artist: req.params.artistId });
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Summary analytics for artist
router.get('/summary/artist/:artistId', async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const Song = require('../models/Song');
    const Comment = require('../models/Comment');
    const Follow = require('../models/Follow');
    // Get all songs by artist
    const songs = await Song.find({ artist: artistId });
    const songIds = songs.map(s => s._id);
    // Aggregate analytics
    const [plays, likes, shares, comments, followers] = await Promise.all([
      Analytics.countDocuments({ type: 'play', song: { $in: songIds } }),
      Analytics.countDocuments({ type: 'like', song: { $in: songIds } }),
      Analytics.countDocuments({ type: 'share', song: { $in: songIds } }),
      Comment.countDocuments({ song: { $in: songIds } }),
      Follow.countDocuments({ artist: artistId })
    ]);
    // Per-song stats
    const perSong = await Promise.all(songs.map(async song => {
      const [songPlays, songLikes, songShares, songComments] = await Promise.all([
        Analytics.countDocuments({ type: 'play', song: song._id }),
        Analytics.countDocuments({ type: 'like', song: song._id }),
        Analytics.countDocuments({ type: 'share', song: song._id }),
        Comment.countDocuments({ song: song._id })
      ]);
      return {
        song: song,
        plays: songPlays,
        likes: songLikes,
        shares: songShares,
        comments: songComments
      };
    }));
    res.json({ plays, likes, shares, comments, followers, perSong });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Summary analytics for song
router.get('/summary/song/:songId', async (req, res) => {
  try {
    const songId = req.params.songId;
    const Comment = require('../models/Comment');
    const [plays, likes, shares, comments] = await Promise.all([
      Analytics.countDocuments({ type: 'play', song: songId }),
      Analytics.countDocuments({ type: 'like', song: songId }),
      Analytics.countDocuments({ type: 'share', song: songId }),
      Comment.countDocuments({ song: songId })
    ]);
    res.json({ plays, likes, shares, comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get timeseries analytics for a song
router.get('/timeseries/song/:songId', async (req, res) => {
  try {
    const { type = 'play', days = 30 } = req.query;
    const songId = req.params.songId;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    // Plays, likes, shares from Analytics
    if (['play','like','share'].includes(type)) {
      const data = await Analytics.aggregate([
        { $match: { song: mongoose.Types.ObjectId(songId), type, createdAt: { $gte: startDate } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        } },
        { $sort: { _id: 1 } }
      ]);
      return res.json(data.map(d => ({ date: d._id, count: d.count })));
    }
    // Comments from Comment model
    if (type === 'comment') {
      const Comment = require('../models/Comment');
      const data = await Comment.aggregate([
        { $match: { song: mongoose.Types.ObjectId(songId), createdAt: { $gte: startDate } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        } },
        { $sort: { _id: 1 } }
      ]);
      return res.json(data.map(d => ({ date: d._id, count: d.count })));
    }
    res.status(400).json({ error: 'Invalid type' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get geo breakdown for a song
router.get('/geo/song/:songId', async (req, res) => {
  try {
    const songId = req.params.songId;
    // Top countries
    const countries = await Analytics.aggregate([
      { $match: { song: mongoose.Types.ObjectId(songId) } },
      { $group: { _id: "$geo.country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    // Top cities
    const cities = await Analytics.aggregate([
      { $match: { song: mongoose.Types.ObjectId(songId) } },
      { $group: { _id: "$geo.city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ countries, cities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get device/browser breakdown for a song
router.get('/device/song/:songId', async (req, res) => {
  try {
    const songId = req.params.songId;
    // Top devices
    const devices = await Analytics.aggregate([
      { $match: { song: mongoose.Types.ObjectId(songId) } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    // Top browsers
    const browsers = await Analytics.aggregate([
      { $match: { song: mongoose.Types.ObjectId(songId) } },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ devices, browsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get top listeners for a song
router.get('/listeners/song/:songId', async (req, res) => {
  try {
    const songId = req.params.songId;
    const listeners = await Analytics.aggregate([
      { $match: { song: mongoose.Types.ObjectId(songId), type: 'play' } },
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    // Populate user info
    const User = require('../models/User');
    const enriched = await Promise.all(listeners.map(async l => {
      if (!l._id) return { ...l, name: 'Unknown', avatar: '', email: '' };
      const user = await User.findOne({ email: l._id });
      return {
        ...l,
        name: user?.name || user?.fullname || l._id,
        avatar: user?.avatar || '',
        email: user?.email || l._id
      };
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
