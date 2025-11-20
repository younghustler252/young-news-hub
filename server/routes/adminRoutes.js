const express = require('express');
const router = express.Router();

const {
  getOverviewStats,
  getTopPosts,
  getTopAuthors,
  getPostsByDate,
  banUser,
  approvePost,
  rejectPost,
  getAllUsers,
  getUserById,
  getAllPosts,
  toggleAdmin,   // ✅ added because YOU said it exists
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');
const { validateBanAction } = require('../middleware/userValidators');
const validateRequest = require('../middleware/validateRequest');

// 🔐 All admin routes protected
router.use(protect, admin);

// 📊 Dashboard stats
router.get('/overview', getOverviewStats);
router.get('/top-posts', getTopPosts);
router.get('/top-authors', getTopAuthors);
router.get('/posts-by-date', getPostsByDate);

// 👮‍♂️ Ban / Unban user
router.put('/users/:id/ban', validateBanAction, validateRequest, banUser);

// 👑 Promote / Demote user (admin <-> user)
router.put('/users/:id/role', toggleAdmin);   // ✅ simple clean route

// 🧠 User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

// 📝 Post Management
router.get('/posts', getAllPosts);
router.put('/posts/:id/approve', approvePost);
router.put('/posts/:id/reject', rejectPost);

module.exports = router;
