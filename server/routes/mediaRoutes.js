const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // <-- your multer config
const { protect } = require('../middleware/authMiddleware');
const { upload: uploadMedia, getAll, remove } = require('../controllers/mediaController');

// Upload media
router.post('/upload', protect, (req, res, next) => {
  console.log('Before multer, user:', req.user); // Check user is set by protect
  next();
}, upload.single('file'), (req, res, next) => {
  console.log('After multer, file:', req.file); // Should log file object
  next();
}, uploadMedia);

// Get all media
router.get('/', protect, getAll);

// Delete media
router.delete('/:id', protect, remove);

module.exports = router;
