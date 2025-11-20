const express = require('express');
const router = express.Router();

const {
  createPost,
  getAllApprovedPosts,
  getPostsByUsername,
  getMyPosts,
  getPostById,
  approvePost,
  rejectPost,
  deletePost
} = require('../controllers/postController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');


// 🌍 PUBLIC ROUTES

// Get all approved posts (homepage, public)
router.get('/', getAllApprovedPosts);

// Get approved posts by a specific user (public user profile)
router.get('/user/:username', getPostsByUsername);


// 🔐 AUTHENTICATED USER ROUTES

// Create a new post (logged-in users only)
router.post('/', protect, createPost);

// Get all posts by the logged-in user (any status)
router.get('/me', protect, getMyPosts);

// Get a single post (approved = public; else owner/admin only)
router.get('/:id', protect, getPostById);

// Delete a post (owner or admin)
router.delete('/:id', protect, deletePost);


// 🛡️ ADMIN-ONLY ROUTES

// Approve a post
router.put('/admin/:id/approve', protect, admin, approvePost);

// Reject a post
router.put('/admin/:id/reject', protect, admin, rejectPost);

module.exports = router;
