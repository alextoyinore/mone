const express = require('express');
const upload = require('../middleware/upload');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const router = express.Router();

// Get all playlists for a user
router.get('/', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'User required' });
    // Find playlists owned by user or where user is a collaborator
    const playlists = await Playlist.find({ $or: [ { user }, { collaborators: user } ] }).populate('songs');
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a playlist by id
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new playlist
router.post('/', async (req, res) => {
  try {
    const { name, user } = req.body;
    if (!name || !user) return res.status(400).json({ error: 'Name and user required' });
    
    const playlist = new Playlist({
      name,
      user,
      songs: []
    });
    
    await playlist.save();
    
    // Notify followers of new playlist
    try {
      const User = require('../models/User');
      const { sendNotification } = require('../utils/notify');
      const creator = await User.findOne({ email: user });
      if (creator && creator.followers && creator.followers.length > 0) {
        for (const followerId of creator.followers) {
          const follower = await User.findOne({ email: followerId });
          if (follower && follower.email !== creator.email) {
            await sendNotification({
              user: follower.email,
              type: 'new_playlist',
              message: `${creator.fullname || creator.name} created a new playlist: "${playlist.name}"`,
              link: `/playlist/${playlist._id}`
            });
          }
        }
      }
    } catch (e) { /* ignore notification errors */ }
    
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add song to playlist (owner or collaborator only)
router.post('/:id/add', async (req, res) => {
  try {
    const { songId, user } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (playlist.user !== user && !playlist.collaborators.includes(user)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (!playlist.songs.includes(songId)) playlist.songs.push(songId);
    await playlist.save();
    await playlist.populate('songs');
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove song from playlist (owner or collaborator only)
router.post('/:id/remove', async (req, res) => {
  try {
    const { songId, user } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (playlist.user !== user && !playlist.collaborators.includes(user)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    playlist.songs = playlist.songs.filter(s => s.toString() !== songId);
    await playlist.save();
    await playlist.populate('songs');
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update playlist (name, description, cover, isPublic)
router.put('/:id', upload.single('cover'), async (req, res) => {
  try {
    const { name, description, cover, isPublic } = req.body;
    let update = { name };
    if (description !== undefined) update.description = description;

     // Handle cover file upload
     let coverPath = '';

     if (req.files && req.files.cover && req.files.cover[0]) {
       const result = await new Promise((resolve, reject) => {
         const stream = cloudinary.uploader.upload_stream(
           { resource_type: 'image', folder: 'playlists/covers' },
           (error, result) => {
             if (error) reject(error);
             else resolve(result);
           }
         );
         stream.end(req.files.cover[0].buffer);
       });
       coverPath = result.secure_url;
     }

    if (cover !== undefined) update.cover = coverPath;

    if (isPublic !== undefined) {
      update.isPublic = isPublic;
      if (isPublic) {
        // Generate slug if making public and not set
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist.slug) {
          update.slug = (name || playlist.name).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 6);
        }
      } else {
        update.slug = undefined;
      }
    }
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get public playlist by slug
router.get('/public/:slug', async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ slug: req.params.slug, isPublic: true }).populate('songs');
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete playlist
router.delete('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get collaborators
router.get('/:id/collaborators', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist.collaborators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add collaborator
router.post('/:id/collaborators', async (req, res) => {
  try {
    const { collaborator, user } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (playlist.user !== user) return res.status(403).json({ error: 'Only owner can add collaborators' });
    if (!playlist.collaborators.includes(collaborator)) playlist.collaborators.push(collaborator);
    await playlist.save();
    res.json(playlist.collaborators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove collaborator
router.delete('/:id/collaborators', async (req, res) => {
  try {
    const { collaborator, user } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (playlist.user !== user) return res.status(403).json({ error: 'Only owner can remove collaborators' });
    playlist.collaborators = playlist.collaborators.filter(c => c !== collaborator);
    await playlist.save();
    res.json(playlist.collaborators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
