const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const upload = require('../middleware/upload');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const requirePremium = require('../middleware/requirePremium');

// Create song with audio and coverArt upload
router.post('/', verifyFirebaseToken, upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'coverArt', maxCount: 1 }
]), songController.createSong);
router.get('/', songController.getSongs);
router.get('/my-songs', verifyFirebaseToken, songController.getUserSongs);
router.get('/:id', songController.getSongById);
router.get('/:id/download', requirePremium, songController.downloadSong);
router.put('/:id', songController.updateSong);
router.delete('/:id', songController.deleteSong);

module.exports = router;

