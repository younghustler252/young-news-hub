// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const {
	addComment,
	getCommentsByPost,
	deleteComment,
	flagComment,
} = require('../controllers/commentController');
const { protect} = require('../middleware/authMiddleware'); // assumes auth middleware is in place
const {admin} = require('../middleware/roleMiddleware');
// Add a comment (top-level or reply) - private
router.post('/:postId', protect, addComment);

// Get all comments for a post - public
router.get('/:postId', getCommentsByPost);

// Delete a comment - private (author/post owner/admin)
router.delete('/:id', protect, deleteComment);

// Admin: Flag a comment - admin only
router.put('/:id/flag', protect, admin, flagComment);

module.exports = router;
