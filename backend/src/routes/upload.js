const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

// Upload image or audio (expects 'file' field)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    // Determine resource type (image/audio)
    const resourceType = file.mimetype.startsWith('image') ? 'image' : 'video';
    const uploadRes = await cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error, result) => {
        if (error) return res.status(500).json({ error: 'Upload failed' });
        res.json({ url: result.secure_url, public_id: result.public_id });
      }
    );
    uploadRes.end(file.buffer);
  } catch (err) {
    res.status(500).json({ error: 'Upload error' });
  }
});

module.exports = router;
