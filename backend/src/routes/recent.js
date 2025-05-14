const express = require('express');
const RecentlyPlayed = require('../models/RecentlyPlayed');
const router = express.Router();

// Add to recently played
router.post('/:songId', async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ error: 'User required' });
    const recent = new RecentlyPlayed({ user, song: req.params.songId });
    await recent.save();
    res.status(201).json(recent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recently played for a user
router.get('/', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'User required' });
    const recents = await RecentlyPlayed.find({ user }).sort({ playedAt: -1 }).limit(50).populate('song');
    res.json(recents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
