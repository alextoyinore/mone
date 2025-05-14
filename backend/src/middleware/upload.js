const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB for audio (will be checked again in controller)
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a'];
      if (!allowedAudioTypes.includes(file.mimetype)) {
        return cb(new Error('Audio file must be MP3, WAV, or M4A.'));
      }
    }
    if (file.fieldname === 'coverArt') {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedImageTypes.includes(file.mimetype)) {
        return cb(new Error('Cover art must be JPG, PNG, or WEBP.'));
      }
    }
    cb(null, true);
  }
});
module.exports = upload;

