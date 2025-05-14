const Song = require('../models/Song');

const cloudinary = require('../config/cloudinary');

const User = require('../models/User');
const Artist = require('../models/Artist');
const Activity = require('../models/Activity');

const auth = require('../middleware/verifyFirebaseToken');

exports.createSong = async (req, res) => {
  try {

    console.log('req.files: ', req.files);
    console.log('req.body: ', req.body);
    
    // Validation
    const { title, genre, description, album = '' } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });
    
    // User is already authenticated and attached to req by middleware
    const user = await User.findOne({ email: req.user.email }).populate('artist');
    if (!user || !user.artist) return res.status(403).json({ error: 'You must be an artist to upload songs.' });
    const artistId = user.artist._id;

    console.log('user: ', user);
    console.log('artistId: ', artistId);
    
    // Validate files
    if (!req.files || !req.files.audio || !req.files.audio[0]) return res.status(400).json({ error: 'Audio file is required.' });
    if (!req.files || !req.files.coverArt || !req.files.coverArt[0]) return res.status(400).json({ error: 'Cover art is required.' });

    // Validate audio file
    const audioFile = req.files.audio[0];
    const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a'];
    if (!allowedAudioTypes.includes(audioFile.mimetype)) {
      return res.status(400).json({ error: 'Audio file must be MP3, WAV, or M4A.' });
    }
    if (audioFile.size > 15 * 1024 * 1024) {
      return res.status(400).json({ error: 'Audio file must be less than 15MB.' });
    }
    
    // Validate coverArt if present
    let coverArtFile = req.files.coverArt && req.files.coverArt[0];
    if (coverArtFile) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedImageTypes.includes(coverArtFile.mimetype)) {
        return res.status(400).json({ error: 'Cover art must be JPG, PNG, or WEBP.' });
      }
      if (coverArtFile.size > 3 * 1024 * 1024) {
        return res.status(400).json({ error: 'Cover art must be less than 3MB.' });
      }
    } 

    let audioUrl, coverArtUrl;
    // Upload audio file
    if (req.files && req.files.audio && req.files.audio[0]) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'video', folder: 'songs/audio' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.audio[0].buffer);
      });
      audioUrl = result.secure_url;
    }

    // Upload cover art
    if (req.files && req.files.coverArt && req.files.coverArt[0]) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'songs/covers' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.coverArt[0].buffer);
      });
      coverArtUrl = result.secure_url;
    }

    // Parse links if sent as JSON string (for form-data)
    let links = req.body.links;
    if (typeof links === 'string') {
      try { links = JSON.parse(links); } catch { links = {}; }
    }


    const song = await Song.create({
      title,
      artist: artistId,
      album,
      genre,
      description,
      audioUrl,
      coverArt: coverArtUrl,
      links,
    }).catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.message });
    });


    // Log activity
    try {
      await Activity.create({
        type: 'upload',
        user: user._id,
        song: song._id,
        message: 'uploaded a new song'
      });
    } catch (e) { /* ignore activity errors */ }

    // Notify followers of new song
    try {
      const User = require('../models/User');
      const { sendNotification } = require('../utils/notify');
      const artistUser = await User.findById(user._id);
      if (artistUser && artistUser.followers && artistUser.followers.length > 0) {
        for (const followerId of artistUser.followers) {
          const follower = await User.findById(followerId);
          if (follower && follower.email !== artistUser.email) {
            await sendNotification({
              user: follower.email,
              type: 'new_song',
              message: `${artistUser.fullname || artistUser.name} released a new song: "${song.title}"`,
              link: `/song/public/${song._id}`
            });
          }
        }
      }
    } catch (e) { /* ignore notification errors */ }

    res.status(201).json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate('artist', 'name avatar');
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
};

exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('artist', 'name avatar');
    if (!song) return res.status(404).json({ error: 'Song not found' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch song' });
  }
};

exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!song) return res.status(404).json({ error: 'Song not found' });
    res.json(song);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update song' });
  }
};

exports.downloadSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ error: 'Song not found' });
    if (!song.audioUrl) return res.status(400).json({ error: 'No audio file available' });
    // Proxy download from Cloudinary or direct URL
    const https = require('https');
    const url = song.audioUrl;
    res.setHeader('Content-Disposition', `attachment; filename="${song.title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');
    https.get(url, fileRes => {
      fileRes.pipe(res);
    }).on('error', err => {
      res.status(500).json({ error: 'Failed to download audio' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to download song' });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const songId = req.params.id;
    const song = await Song.findByIdAndDelete(songId);
    
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Failed to delete song' });
  }
};

// Get user's songs
exports.getUserSongs = async (req, res) => {
  try {
    // Find the user and their artist profile
    const user = await User.findOne({ email: req.user.email }).populate('artist');
    
    if (!user || !user.artist) {
      return res.status(403).json({ 
        error: 'You must be an artist to view songs',
        songs: [] 
      });
    }

    // Find songs by the artist
    const songs = await Song.find({ artist: user.artist._id })
      .populate('artist', 'name')
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.json({ 
      songs: songs,
      total: songs.length,
      artist: {
        id: user.artist._id,
        name: user.artist.name
      }
    });
  } catch (error) {
    console.error('Error fetching user songs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch songs', 
      message: error.message 
    });
  }
};

exports.getSongByArtist = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const songs = await Song.find({ artist: artistId });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
};


exports.getSongByAlbum = async (req, res) => {
  try {
    const album = req.params.album;
    const songs = await Song.find({ album });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
};


exports.getSongByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const songs = await Song.find({ genre });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
};


