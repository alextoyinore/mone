const express = require('express');
const Follow = require('../models/Follow');
const { sendNotification } = require('../utils/notify');
const router = express.Router();

// Toggle follow (follow/unfollow)
router.post('/:artistId', async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ error: 'User required' });
    const existing = await Follow.findOne({ user, artist: req.params.artistId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ following: false });
    }
    const follow = new Follow({ user, artist: req.params.artistId });
    await follow.save();
    // Notify artist if not self
    if (req.params.artistId !== user) {
      await sendNotification({
        user: req.params.artistId,
        type: 'follow',
        message: `Someone followed you!`,
        link: `/artist/${req.params.artistId}` // direct to artist public profile
      });
    }
    // Log activity
    try {
      const Activity = require('../models/Activity');
      await Activity.create({
        type: 'follow',
        user,
        targetUser: req.params.artistId,
        message: 'followed'
      });
    } catch (e) { /* ignore activity errors */ }
    res.json({ following: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get followed artists for a user
router.get('/', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'User required' });
    const follows = await Follow.find({ user }).populate('artist');
    res.json(follows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
