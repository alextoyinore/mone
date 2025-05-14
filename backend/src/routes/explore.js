const express = require('express');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const Album = require('../models/Album');
const User = require('../models/User');
const router = express.Router();

// Trending: top 10 songs/playlists/albums by playCount (mocked)
router.get('/trending', async (req, res) => {
  const songs = await Song.find().sort({ playCount: -1 }).limit(10);
  const playlists = await Playlist.find().sort({ plays: -1 }).limit(5);
  const albums = await Album.find().sort({ plays: -1 }).limit(5);
  res.json({ songs, playlists, albums });
});

// New releases: latest songs, playlists, albums
router.get('/new', async (req, res) => {
  const songs = await Song.find().sort({ createdAt: -1 }).limit(10);
  const playlists = await Playlist.find().sort({ createdAt: -1 }).limit(5);
  const albums = await Album.find().sort({ createdAt: -1 }).limit(5);
  res.json({ songs, playlists, albums });
});

// Top artists: by followers (mock)
router.get('/top-artists', async (req, res) => {
  const artists = await User.find({ role: 'artist' }).sort({ followers: -1 }).limit(10);
  res.json(artists);
});

// Genres (distinct from songs)
router.get('/genres', async (req, res) => {
  const genres = await Song.distinct('genre');
  res.json(genres.filter(Boolean));
});

// Moods (distinct from songs)
router.get('/moods', async (req, res) => {
  const moods = await Song.distinct('mood');
  res.json(moods.filter(Boolean));
});

// Songs by genre
router.get('/genre/:genre', async (req, res) => {
  const songs = await Song.find({ genre: req.params.genre }).limit(20);
  res.json(songs);
});

// Songs by mood
router.get('/mood/:mood', async (req, res) => {
  const songs = await Song.find({ mood: req.params.mood }).limit(20);
  res.json(songs);
});

// Personalized recommended: likes, followed artists, genres from playlists, exclude recently played
router.get('/recommended', async (req, res) => {
  const { user } = req.query;
  if (!user) {
    // fallback: random
    const songs = await Song.aggregate([{ $sample: { size: 10 } }]);
    return res.json(songs);
  }
  // 1. Songs liked by user
  let likedSongs = [];
  if (Song.schema.path('likes')) {
    likedSongs = await Song.find({ likes: user }).limit(10);
  }
  // 2. Playlists by user (get genres from songs in playlists)
  const playlists = await Playlist.find({ user });
  let playlistGenres = [];
  for (const pl of playlists) {
    const songs = await Song.find({ _id: { $in: pl.songs } });
    playlistGenres.push(...songs.map(s => s.genre).filter(Boolean));
  }
  // 3. Followed artists
  const userObj = await User.findOne({ email: user });
  let followedArtistIds = [];
  if (userObj && userObj.following && userObj.following.length) {
    followedArtistIds = userObj.following;
  }
  // 4. Collect all genres
  const likedGenres = likedSongs.map(s => s.genre).filter(Boolean);
  const allGenres = [...new Set([...likedGenres, ...playlistGenres])];
  // 5. Find recently played song ids
  const recentlyPlayedSongs = await Song.find({ recentlyPlayed: user }, { _id: 1 });
  const recentlyPlayedIds = recentlyPlayedSongs.map(s => s._id);
  // 6. Recommend songs by followed artists (not recently played)
  let artistRecs = [];
  if (followedArtistIds.length) {
    artistRecs = await Song.find({ artist: { $in: followedArtistIds }, _id: { $nin: recentlyPlayedIds } }).limit(10);
  }
  // 7. Recommend by genre (not recently played)
  let genreRecs = [];
  if (allGenres.length) {
    genreRecs = await Song.find({ genre: { $in: allGenres }, likes: { $ne: user }, _id: { $nin: recentlyPlayedIds } }).limit(10);
  }
  // 8. Merge and dedupe
  let recs = [...artistRecs, ...genreRecs].filter((v,i,a)=>a.findIndex(t=>(t._id+"")==(v._id+""))===i);
  // 9. If not enough, fill with other recs not recently played
  if (recs.length < 10) {
    const fill = await Song.find({ _id: { $nin: recs.map(s=>s._id).concat(recentlyPlayedIds) } }).limit(10-recs.length);
    recs = recs.concat(fill);
  }
  if (recs.length) return res.json(recs.slice(0, 10));
  // fallback: random
  const songs = await Song.aggregate([{ $sample: { size: 10 } }]);
  res.json(songs);
});

module.exports = router;
