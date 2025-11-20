const express = require('express');
const router = express.Router();
const { togglePostLike, getPostLikeStatus } = require('../controllers/likeController');
const {protect} = require('../middleware/authMiddleware'); // ensure user is logged in

router.post('/:postId', protect, togglePostLike);
router.get('/status/:postId', protect, getPostLikeStatus);

module.exports = router;
