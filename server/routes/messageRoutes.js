const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // assuming you have auth middleware
const resolveUserByUsername = require('../middleware/resolveByUsername');
const {
    sendMessage,
    getConversation,
    getChatList,
    markAsRead,
    deleteMessage,
} = require('../controllers/messageController');

// Get all chat conversations for logged-in user
router.get('/', protect, getChatList);

// Send a message to a friend by username
router.post('/:username', protect, resolveUserByUsername, sendMessage);

// Get conversation with a user by username
router.get('/:username', protect, resolveUserByUsername, getConversation);

// Mark a message as read by messageId
router.patch('/:messageId/read', protect, markAsRead);

// Delete a message by messageId
router.delete('/:messageId', protect, deleteMessage);

module.exports = router;
