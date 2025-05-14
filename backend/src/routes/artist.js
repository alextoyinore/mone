const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const upload = require('../middleware/upload');

// Create artist with avatar upload
router.post('/', upload.single('avatar'), artistController.createArtist);
router.get('/', artistController.getArtists);
router.get('/:id', artistController.getArtistById);
router.put('/:id', artistController.updateArtist);
router.delete('/:id', artistController.deleteArtist);

module.exports = router;

