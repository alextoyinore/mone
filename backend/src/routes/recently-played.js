const express = require('express');
const Song = require('../models/Song');
const User = require('../models/User');
const router = express.Router();


// Add song to user's recently played list (with timestamp)
router.post('/', async (req, res) => {
  let { user } = req.query;
  let { song } = req.body;
  if (!song || !user) return res.status(400).json({ error: 'Song and user required' });

  try {
    // Get user
    user = await User.findOne({ email: user });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if song is already in recently played
    const existingEntry = user.recentlyPlayed.find(rp => rp.song.toString() === song);
    if (existingEntry) {
      // Update existing entry's timestamp
      existingEntry.playedAt = new Date();
    } else {
      // Add new entry if not already present
      if (user.recentlyPlayed.length >= 50) {
        // Remove the oldest entry (first in the array)
        user.recentlyPlayed.shift();
      }
      user.recentlyPlayed.push({ song, playedAt: new Date() });
    }

    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating recently played:', error);
    res.status(500).json({ error: 'Failed to update recently played' });
  }
});

// Get user's recently played songs (most recent first, up to 20)
router.get('/', async (req, res) => {
  let { user } = req.query;
  if (!user) return res.status(400).json({ error: 'User required' });

  try {
    user = await User.findOne({ email: user });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the song IDs from recently played entries
    const songIds = user.recentlyPlayed.map(rp => rp.song);
    
    // Fetch all songs in one query
    const songs = await Song.find({ _id: { $in: songIds } });
    
    // Create mapping of song IDs to songs
    const songsMap = songs.reduce((acc, song) => {
      acc[song._id.toString()] = song;
      return acc;
    }, {});

    // Map recently played entries to include song data
    const withPlayedAt = user.recentlyPlayed
      .map(rp => {
        const song = songsMap[rp.song.toString()];
        return song ? { ...song.toObject(), playedAt: rp.playedAt } : null;
      })
      .filter(Boolean) // Remove null entries
      .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));

    res.json(withPlayedAt.slice(0, 20));
  } catch (error) {
    console.error('Error fetching recently played:', error);
    res.status(500).json({ error: 'Failed to fetch recently played songs' });
  }
});

// Remove a song from user's recently played
router.delete('/:songId', async (req, res) => {
  let { user } = req.query;
  if (!user) return res.status(400).json({ error: 'User required' });

  try {
    user = await User.findOne({ email: user });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.recentlyPlayed = user.recentlyPlayed.filter(rp => rp.song.toString() !== req.params.songId);
    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from recently played:', error);
    res.status(500).json({ error: 'Failed to remove from recently played' });
  }
});

// Clear user's recently played list
router.delete('/clear', async (req, res) => {
  let { user } = req.query;
  if (!user) return res.status(400).json({ error: 'User required' });

  try {
    user = await User.findOne({ email: user });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.recentlyPlayed = [];
    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing recently played:', error);
    res.status(500).json({ error: 'Failed to clear recently played' });
  }
});

module.exports = router;
