const express = require('express');
const Song = require('../models/Song');
const router = express.Router();

// Add user to recentlyPlayed for a song (with timestamp)
router.post('/', async (req, res) => {
  const { user, song } = req.body;
  if (!user || !song) return res.status(400).json({ error: 'User and song required' });
  await Song.updateOne(
    { _id: song },
    { $push: { recentlyPlayed: { user, playedAt: new Date() } } }
  );
  res.json({ success: true });
});

// Get recently played songs for a user (most recent first, up to 20)
router.get('/:user', async (req, res) => {
  const user = req.params.user;
  if (!user) return res.status(400).json({ error: 'User required' });
  // Find all songs where recentlyPlayed contains this user
  const songs = await Song.find({ 'recentlyPlayed.user': user });
  // Map each song to the most recent playedAt for this user
  const withPlayedAt = songs.map(song => {
    const entry = song.recentlyPlayed.filter(rp => rp.user === user).sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))[0];
    return { ...song.toObject(), playedAt: entry ? entry.playedAt : null };
  });
  // Sort by playedAt desc, then limit
  withPlayedAt.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
  res.json(withPlayedAt.slice(0, 20));
});

// Remove a song from user's recently played
router.delete('/:user/:songId', async (req, res) => {
  const { user, songId } = req.params;
  await Song.updateOne(
    { _id: songId },
    { $pull: { recentlyPlayed: { user } } }
  );
  res.json({ success: true });
});

// Clear all recently played for a user
router.delete('/clear/:user', async (req, res) => {
  const user = req.params.user;
  await Song.updateMany(
    { 'recentlyPlayed.user': user },
    { $pull: { recentlyPlayed: { user } } }
  );
  res.json({ success: true });
});

module.exports = router;
