const express = require('express');
const Activity = require('../models/Activity');
const router = express.Router();

// Get activity feed for a user (from followed users)
router.get('/feed', async (req, res) => {
  try {
    const { user, following } = req.query;
    if (!user || !following) return res.status(400).json({ error: 'User and following required' });
    // following: comma-separated list of emails/ids
    const followingList = following.split(',');
    const activities = await Activity.find({ user: { $in: followingList } })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) Endpoint to create activity (for testing/manual)
router.post('/', async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
