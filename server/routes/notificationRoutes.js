const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
	createNotification,
	getNotifications,
	getUnreadCount,
	markAsRead,
	markAllAsRead,
	deleteNotification,
	deleteAllNotifications,
} = require('../controllers/notificationController');

// 🔒 Protect all notification routes
router.use(protect);

// ================== Notification Routes ==================

// 📩 Create a new notification
router.post('/', createNotification);

// 📜 Get paginated notifications for the logged-in user
router.get('/', getNotifications);

// 🔢 Get count of unread notifications
router.get('/unread-count', getUnreadCount);

// ✅ Mark a single notification as read
router.patch('/:id/read', markAsRead);

// ✅ Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// 🗑️ Soft delete a single notification
router.delete('/:id', deleteNotification);

// 🗑️ Soft delete all notifications
router.delete('/', deleteAllNotifications);

module.exports = router;
