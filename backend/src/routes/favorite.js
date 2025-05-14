const express = require('express');
const Favorite = require('../models/Favorite');
const Song = require('../models/Song');
const { sendNotification } = require('../utils/notify');
const router = express.Router();

// Toggle favorite (like/unlike)
router.post('/:songId', async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ error: 'User required' });
    const existing = await Favorite.findOne({ user, song: req.params.songId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ liked: false });
    }
    const fav = new Favorite({ user, song: req.params.songId });
    await fav.save();
    // Notify song owner if not self
    const song = await Song.findById(req.params.songId);
    if (song && song.artist && song.artist !== user) {
      await sendNotification({
        user: song.artist,
        type: 'like',
        message: `Someone liked your song: "${song.title}"`,
        link: `/song/${req.params.songId}`
      });
    }
    // Log activity
    try {
      const Activity = require('../models/Activity');
      await Activity.create({
        type: 'like',
        user,
        song: req.params.songId,
        message: 'liked the song',
        targetUser: song && song.artist ? song.artist : undefined
      });
    } catch (e) { /* ignore activity errors */ }
    res.json({ liked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all favorites for a user
router.get('/', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'User required' });
    const favorites = await Favorite.find({ user }).populate('song');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
