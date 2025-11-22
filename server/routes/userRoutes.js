const express = require('express');
const router = express.Router();

const {
    getMe,
    getUserByUsername,
    checkUsername,
    completeProfile,
    updateProfile,
    toggleFollow,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { validateUserProfileUpdate, validateBanAction, validateCompleteProfile } = require('../middleware/userValidators');
const validateRequest = require('../middleware/validateRequest');

// Get logged-in user
router.get('/me', protect, getMe);

// Update user profile
router.put('/me', protect, validateUserProfileUpdate, validateRequest, updateProfile);

router.put('/complete-profile', protect,validateCompleteProfile, validateRequest, completeProfile);


router.get('/check-username', checkUsername)

router.get('/:username', getUserByUsername)


// Follow/unfollow a user
router.post('/:id/follow', protect, toggleFollow);

// Admin: Ban/unban a user

module.exports = router;
