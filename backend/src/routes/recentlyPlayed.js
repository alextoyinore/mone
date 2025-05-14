const express = require('express');
const router = express.Router();
const RecentlyPlayed = require('../models/RecentlyPlayed');
const Song = require('../models/Song');

// Add a song to recently played
router.post('/', async (req, res) => {
  try {
    const { user, song } = req.body;
    // Remove any existing record for this user/song
    await RecentlyPlayed.deleteMany({ user, song });
    // Add new record
    const entry = await RecentlyPlayed.create({ user, song });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recently played songs for a user (most recent first, max 30)
router.get('/:user', async (req, res) => {
  try {
    const { user } = req.params;
    const entries = await RecentlyPlayed.find({ user })
      .sort({ playedAt: -1 })
      .limit(30)
      .populate('song');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear recently played for a user
router.delete('/:user', async (req, res) => {
  try {
    const { user } = req.params;
    await RecentlyPlayed.deleteMany({ user });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
