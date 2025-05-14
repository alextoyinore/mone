const Artist = require('../models/Artist');

const cloudinary = require('../config/cloudinary');

exports.createArtist = async (req, res) => {
  try {
    let avatarUrl = undefined;
    if (req.file) {
      // Upload avatar to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'artists' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      avatarUrl = result.secure_url;
    }
    const artist = await Artist.create({ ...req.body, avatar: avatarUrl });
    // Update the user to reference this artist
    const User = require('../models/User');
    await User.findByIdAndUpdate(artist.user, { artist: artist._id });
    res.status(201).json(artist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create artist' });
  }
};

exports.getArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch artist' });
  }
};

exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update artist' });
  }
};

exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json({ message: 'Artist deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete artist' });
  }
};
