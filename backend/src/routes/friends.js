const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

// Get friend activity
router.get('/activity', verifyFirebaseToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Get user's friends
    const friends = await User.find({
      _id: { $in: user.following },
      isPrivate: false
    }).select('avatar name currentSong');

    // Get current song info for each friend
    const friendsWithSongs = await Promise.all(
      friends.map(async (friend) => {
        if (friend.currentSong) {
          const song = await Song.findById(friend.currentSong).select('title artist cover');
          return {
            ...friend.toObject(),
            currentSong: song
          };
        }
        return friend;
      })
    );

    res.json(friendsWithSongs);
  } catch (err) {
    console.error('Error fetching friend activity:', err);
    res.status(500).json({ error: 'Failed to fetch friend activity' });
  }
});

module.exports = router;
