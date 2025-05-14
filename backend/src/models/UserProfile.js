const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  avatar: { type: String },
  bio: { type: String },
  socials: {
    instagram: String,
    twitter: String,
    facebook: String
  }
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
