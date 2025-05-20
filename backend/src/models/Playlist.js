const mongoose = require('mongoose');

// Array of default cover images
const defaultCovers = [
  'https://res.cloudinary.com/musicnow/image/upload/v1747352477/cover5_dfjbch.png',
  'https://res.cloudinary.com/musicnow/image/upload/v1747352476/cover4_ji3p8o.png',
  'https://res.cloudinary.com/musicnow/image/upload/v1747352476/cover3_ys4vhu.png',
  'https://res.cloudinary.com/musicnow/image/upload/v1747352476/cover2_ochf3r.png',
  'https://res.cloudinary.com/musicnow/image/upload/v1747352477/cover1_oxv1jk.png'
];


// Function to get a random cover
const getRandomCover = () => {
  const randomIndex = Math.floor(Math.random() * defaultCovers.length);
  return defaultCovers[randomIndex];
};

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  cover: { type: String, default: getRandomCover }, // image url
  isPublic: { type: Boolean, default: false },
  slug: { type: String, unique: true, sparse: true }, // for public sharing
  user: { type: String, required: true }, // owner email or id
  collaborators: [{ type: String }], // array of user emails or ids
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
}, { timestamps: true });

module.exports = mongoose.model('Playlist', PlaylistSchema);

