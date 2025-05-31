const express = require('express');
const User = require('../models/User');
const Artist = require('../models/Artist');
const Favorite = require('../models/Favorite');
const Comment = require('../models/Comment');
const Playlist = require('../models/Playlist');
const Follow = require('../models/Follow');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const router = express.Router();

// Get user profile by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
    .populate('artist');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile by id
router.get('/id/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .populate('artist');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alias: GET /:id (profile by id)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .populate('artist');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:id/activity (recent activity, mock)
router.get('/:id/activity', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Fetch various user activities
    const likes = await Favorite.find({ user: userId })
      .populate('song', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const comments = await Comment.find({ user: userId })
      .populate({
        path: 'song',
        select: 'title'
      })
      .sort({ createdAt: -1 })
      .limit(5);

    const playlists = await Playlist.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const follows = await Follow.find({ follower: userId })
      .populate('artist', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Transform activities into a unified format
    const activities = [
      ...likes.map(like => ({
        type: 'like',
        description: `Liked song "${like.song.title}"`
      })),
      ...comments.map(comment => ({
        type: 'comment',
        description: `Commented on song "${comment.song.title}"`
      })),
      ...playlists.map(playlist => ({
        type: 'playlist',
        description: `Created playlist "${playlist.name}"`
      })),
      ...follows.map(follow => ({
        type: 'follow',
        description: `Followed artist "${follow.artist.name}"`
      }))
    ];

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user by email
router.delete('/:email', async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.params.email });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user theme preference
router.get('/:id/theme', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ theme: user.theme || 'system' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user theme preference
router.put('/:id/theme', async (req, res) => {
  try {
    const { theme } = req.body;
    if (!['light', 'dark', 'system'].includes(theme)) return res.status(400).json({ error: 'Invalid theme' });
    const user = await User.findByIdAndUpdate(req.params.id, { theme }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ theme: user.theme });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/:email', async (req, res) => {
  try {
    const { name, fullname, avatar, bio, social } = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { name, fullname, avatar, bio, social },
      { upsert: false, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get notification preferences
router.get('/notifications/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.notificationPreferences || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update notification preferences
router.put('/notifications/:email', async (req, res) => {
  try {
    const prefs = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { notificationPreferences: prefs },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.notificationPreferences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /:id/follow
router.post('/:id/follow', async (req, res) => {
  try {
    const userId = req.params.id;
    const { followerId } = req.body;
    if (!followerId) return res.status(400).json({ error: 'Missing followerId' });
    if (userId === followerId) return res.status(400).json({ error: 'Cannot follow yourself' });
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);
    if (!user || !follower) return res.status(404).json({ error: 'User not found' });
    if (!user.followers.includes(followerId)) user.followers.push(followerId);
    if (!follower.following.includes(userId)) follower.following.push(userId);
    await user.save();
    await follower.save();
    // Send notification (if not already following)
    const { sendNotification } = require('../utils/notify');
    await sendNotification({ user: user.email, type: 'follows', message: `${follower.fullname || follower.name} followed you!`, link: `/user/${follower._id}` });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /:id/unfollow
router.post('/:id/unfollow', async (req, res) => {
  try {
    const userId = req.params.id;
    const { followerId } = req.body;
    if (!followerId) return res.status(400).json({ error: 'Missing followerId' });
    if (userId === followerId) return res.status(400).json({ error: 'Cannot unfollow yourself' });
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);
    if (!user || !follower) return res.status(404).json({ error: 'User not found' });
    user.followers = user.followers.filter(id => id.toString() !== followerId);
    follower.following = follower.following.filter(id => id.toString() !== userId);
    await user.save();
    await follower.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:id/followers
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'fullname name avatar email');
    res.json(user.followers || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:id/following
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'fullname name avatar email');
    res.json(user.following || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search users by name or email (for mentions)
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) return res.json([]);
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { fullname: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).limit(10).select('name fullname email avatar');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add badge to user (admin only)
router.post('/:id/badges', async (req, res) => {
  try {
    const { badge } = req.body;
    if (!badge) return res.status(400).json({ error: 'Badge required' });
    const user = await User.findByIdAndUpdate(req.params.id, { $addToSet: { badges: badge } }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.badges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upgrade user to premium
router.post('/:id/premium', async (req, res) => {
  try {
    const now = new Date();
    const premiumUntil = req.body.premiumUntil ? new Date(req.body.premiumUntil) : null;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isPremium: true,
        premiumSince: now,
        ...(premiumUntil && { premiumUntil })
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ isPremium: user.isPremium, premiumSince: user.premiumSince, premiumUntil: user.premiumUntil });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Downgrade user from premium
router.delete('/:id/premium', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isPremium: false, premiumUntil: null },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ isPremium: user.isPremium });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove badge from user (admin only)
router.delete('/:id/badges', async (req, res) => {
  try {
    const { badge } = req.body;
    if (!badge) return res.status(400).json({ error: 'Badge required' });
    const user = await User.findByIdAndUpdate(req.params.id, { $pull: { badges: badge } }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.badges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get artist status
router.get('/artist-status', verifyFirebaseToken, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    // Validate user authentication
    if (!req.user || !req.user.email) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        isArtist: false 
      });
    }

    // Find user with comprehensive error handling
    const user = await User.findOne({ email: req.user.email }).catch(err => {
      throw new Error(`Database query failed: ${err.message}`);
    });

    console.log('user:', user);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        isArtist: false 
      });
    }

    // Determine artist status based on role
    const isArtist = user.artist ? true : false;

    res.json({ 
      isArtist: isArtist,
      user: user
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to check artist status', 
      message: error.message,
      details: error.stack
    });
  }
});


// Become an artist
router.post('/become-artist', verifyFirebaseToken, async (req, res) => {

  try {
    const user = await User.findOne({ email: req.user.email }).catch(err => {
      throw new Error(`Database query failed: ${err.message}`);
    });
    
    if (user.artist) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already an artist' 
      });
    }

    // Create new artist profile
    const newArtist = new Artist({
      name: user.displayName || user.email.split('@')[0],
      user: user._id,
      bio: 'New artist on Xitoplay',
      profileImage: user.photoURL || ''
    });

    await newArtist.save();

    // Link artist to user
    user.artist = newArtist._id;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Successfully became an artist',
      artist: newArtist 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to become an artist' 
    });
  }
});

module.exports = router;
