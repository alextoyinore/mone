const express = require('express');
const Comment = require('../models/Comment');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const Album = require('../models/Album');
const { sendNotification } = require('../utils/notify');
const router = express.Router();

// Add comment or reply to song/playlist/album
router.post('/:type/:id', async (req, res) => {
  try {
    const { user, text, parent } = req.body;
    const { type, id } = req.params;
    if (!user || !text) return res.status(400).json({ error: 'User and text required' });
    let comment;
    if (type === 'song') comment = new Comment({ user, song: id, text, parent: parent || null });
    else if (type === 'playlist') comment = new Comment({ user, playlist: id, text, parent: parent || null });
    else if (type === 'album') comment = new Comment({ user, album: id, text, parent: parent || null });
    else return res.status(400).json({ error: 'Invalid type' });
    await comment.save();
    // Notify owner
    let owner;
    let notifyType = 'comment';
    // Always link to the public page and anchor to the comment or parent
    let pagePath = type === 'song' ? `/song/public/${id}` : type === 'album' ? `/album/${id}` : type === 'playlist' ? `/playlist/public/${id}` : `/${type}/${id}`;
    let notifyMsg = `Someone commented on your ${type}: "${text}"`;
    if (parent) {
      // Notify parent comment owner if not self
      const parentComment = await Comment.findById(parent);
      if (parentComment && parentComment.user !== user) {
        await sendNotification({
          user: parentComment.user,
          type: 'reply',
          message: `Someone replied to your comment: "${text}"`,
          link: `${pagePath}#comment-${parent}`
        });
      }
    } else {
      if (type === 'song') {
        const song = await Song.findById(id);
        owner = song && song.artist;
      } else if (type === 'playlist') {
        const playlist = await Playlist.findById(id);
        owner = playlist && playlist.user;
      } else if (type === 'album') {
        const album = await Album.findById(id);
        owner = album && album.artist;
      }
      if (owner && owner !== user) {
        await sendNotification({
          user: owner,
          type: notifyType,
          message: notifyMsg,
          link: `${pagePath}#comment-${comment._id}`
        });
      }
    }
    // Mention notifications
    const User = require('../models/User');
    const mentionRegex = /@([\w]+)/g;
    let match;
    let notified = new Set([user]);
    while ((match = mentionRegex.exec(text))) {
      const mentioned = await User.findOne({ name: match[1] });
      if (mentioned && mentioned.email !== user && !notified.has(mentioned.email)) {
        await sendNotification({
          user: mentioned.email,
          type: 'mention',
          message: `You were mentioned in a comment: "${text}"`,
          link: `${pagePath}#comment-${comment._id}`
        });
        notified.add(mentioned.email);
      }
    }
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get top-level comments for song/playlist/album (parent=null)
router.get('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const user = req.query.user;
    let filter = { parent: null };
    if (type === 'song') filter.song = id;
    else if (type === 'playlist') filter.playlist = id;
    else if (type === 'album') filter.album = id;
    else return res.status(400).json({ error: 'Invalid type' });
    let comments = await Comment.find(filter).sort({ createdAt: -1 });
    comments = comments.map(c => ({
      ...c.toObject(),
      likeCount: c.likes ? c.likes.length : 0,
      liked: user && c.likes ? c.likes.includes(user) : false
    }));
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get replies for a comment
router.get('/replies/:parentId', async (req, res) => {
  try {
    const user = req.query.user;
    let replies = await Comment.find({ parent: req.params.parentId }).sort({ createdAt: 1 });
    replies = replies.map(c => ({
      ...c.toObject(),
      likeCount: c.likes ? c.likes.length : 0,
      liked: user && c.likes ? c.likes.includes(user) : false
    }));
    res.json(replies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like/unlike comment
router.post('/:id/like', async (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).json({ error: 'User required' });
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  if (!comment.likes) comment.likes = [];
  if (comment.likes.includes(user)) {
    comment.likes = comment.likes.filter(u => u !== user);
  } else {
    comment.likes.push(user);
  }
  await comment.save();
  res.json({ likeCount: comment.likes.length, liked: comment.likes.includes(user) });
});

// Delete comment (only by owner)
router.delete('/:commentId', async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  if (comment.user !== req.body.user) return res.status(403).json({ error: 'Not allowed' });
  await Comment.findByIdAndDelete(req.params.commentId);
  res.json({ success: true });
});

// Add comment to playlist
router.post('/playlist/:playlistId', async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!user || !text) return res.status(400).json({ error: 'User and text required' });
    const comment = new Comment({ user, playlist: req.params.playlistId, text });
    await comment.save();
    // Notify playlist owner if not self
    const playlist = await Playlist.findById(req.params.playlistId);
    if (playlist && playlist.owner && playlist.owner !== user) {
      await sendNotification({
        user: playlist.owner,
        type: 'comment',
        message: `Someone commented on your playlist: "${text}"`,
        link: `/playlists/${req.params.playlistId}`
      });
    }
    // Mention notifications
    const User = require('../models/User');
    const mentionRegex = /@([\w]+)/g;
    let match;
    let notified = new Set([user]);
    while ((match = mentionRegex.exec(text))) {
      const mentioned = await User.findOne({ name: match[1] });
      if (mentioned && mentioned.email !== user && !notified.has(mentioned.email)) {
        await sendNotification({
          user: mentioned.email,
          type: 'mention',
          message: `You were mentioned in a comment: "${text}"`,
          link: `${pagePath}#comment-${comment._id}`
        });
        notified.add(mentioned.email);
      }
    }
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get comments for a playlist
router.get('/playlist/:playlistId', async (req, res) => {
  try {
    const comments = await Comment.find({ playlist: req.params.playlistId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a comment (owner only)
router.put('/:id', async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!user || !text) return res.status(400).json({ error: 'User and text required' });
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.user !== user) return res.status(403).json({ error: 'Not allowed' });
    comment.text = text;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

