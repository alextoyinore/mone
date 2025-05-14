const express = require('express');
const Album = require('../models/Album');
const Song = require('../models/Song');
const User = require('../models/User');
const { sendNotification } = require('../utils/notify');
const router = express.Router();

// Create new album
router.post('/', async (req, res) => {
  try {
    const { title, artist, description = '', cover = '', isPublic = false, songs = [] } = req.body;
    if (!title || !artist) return res.status(400).json({ error: 'Title and artist required' });
    const album = new Album({ title, artist, description, cover, isPublic, songs });
    await album.save();
    // Notify followers of new album
    try {
      const artistUser = await User.findById(artist);
      if (artistUser && artistUser.followers && artistUser.followers.length > 0) {
        for (const followerId of artistUser.followers) {
          const follower = await User.findById(followerId);
          if (follower && follower.email !== artistUser.email) {
            await sendNotification({
              user: follower.email,
              type: 'new_album',
              message: `${artistUser.fullname || artistUser.name} released a new album: "${album.title}"`,
              link: `/album/${album._id}`
            });
          }
        }
      }
    } catch (e) { /* ignore notification errors */ }
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all albums for an artist
router.get('/artist/:artistId', async (req, res) => {
  try {
    const albums = await Album.find({ artist: req.params.artistId });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single album by id
router.get('/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('songs');
    if (!album) return res.status(404).json({ error: 'Album not found' });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update album
router.put('/:id', async (req, res) => {
  try {
    const { title, description, cover, isPublic, songs } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (cover !== undefined) update.cover = cover;
    if (isPublic !== undefined) update.isPublic = isPublic;
    if (songs !== undefined) update.songs = songs;
    const album = await Album.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!album) return res.status(404).json({ error: 'Album not found' });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete album
router.delete('/:id', async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ error: 'Album not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
