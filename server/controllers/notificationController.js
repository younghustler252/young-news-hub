const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification'); // ✅ ensure file name matches your model

// Helper: populate related fields for clean responses
const populateNotification = (query) =>
	query
		.populate('sender', 'name username profileImageUrl')
		.populate('post', '_id')
		.populate('comment', '_id')
		.populate('message', '_id');

// ================== Create Notification ==================
exports.createNotification = asyncHandler(async (req, res) => {
	try {
		const { recipient, type, content, post, comment, message, metadata } = req.body;
		const sender = req.user._id;

		const notification = await Notification.createNotification({
			recipient,
			sender,
			type,
			content,
			post,
			comment,
			message,
			metadata,
		});

		if (!notification) {
			return res.status(400).json({
				success: false,
				message: 'Cannot send notification to yourself',
			});
		}

		// Emit notification in real-time if Socket.io is available
		if (req.io) {
			req.io.to(recipient.toString()).emit('newNotification', notification);
		}

		res.status(201).json({ success: true, data: notification });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});

// ================== Get Notifications (Paginated) ==================
exports.getNotifications = asyncHandler(async (req, res) => {
	try {
		const userId = req.user._id;
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const skip = (page - 1) * limit;

		const [notifications, total] = await Promise.all([
			populateNotification(
				Notification.find({ recipient: userId, isDeleted: false })
					.sort({ createdAt: -1 })
					.skip(skip)
					.limit(limit)
			),
			Notification.countDocuments({ recipient: userId, isDeleted: false }),
		]);
		console.log('notifications',notifications)

		res.status(200).json({
			success: true,
			data: notifications,
			pagination: { total, page, pages: Math.ceil(total / limit) },
		});
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});

// ================== Get Unread Count ==================
exports.getUnreadCount = asyncHandler(async (req, res) => {
	try {
		const count = await Notification.countDocuments({
			recipient: req.user._id,
			isRead: false,
			isDeleted: false,
		});

		res.status(200).json({ success: true, count });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});

// ================== Mark Single Notification as Read ==================
exports.markAsRead = asyncHandler(async (req, res) => {
	try {
		const notification = await Notification.findOneAndUpdate(
			{ _id: req.params.id, recipient: req.user._id, isDeleted: false, isRead: false },
			{ $set: { isRead: true, readAt: new Date() } },
			{ new: true }
		);

		if (!notification) {
			return res.status(404).json({
				success: false,
				message: 'Notification not found or already read',
			});
		}

		res.status(200).json({ success: true, message: 'Marked as read', notification });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});

// ================== Mark All as Read ==================
exports.markAllAsRead = asyncHandler(async (req, res) => {
	try {
		const result = await Notification.markAllAsRead(req.user._id);

		res.status(200).json({
			success: true,
			message: 'All notifications marked as read',
			modifiedCount: result.modifiedCount,
		});
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});

// ================== Soft Delete Single Notification ==================
exports.deleteNotification = asyncHandler(async (req, res) => {
	try {
		const notification = await Notification.findOneAndUpdate(
			{ _id: req.params.id, recipient: req.user._id, isDeleted: false },
			{ $set: { isDeleted: true } },
			{ new: true }
		);

		if (!notification) {
			return res.status(404).json({ success: false, message: 'Notification not found' });
		}

		res.status(200).json({ success: true, message: 'Notification deleted' });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});

// ================== Soft Delete All Notifications ==================
exports.deleteAllNotifications = asyncHandler(async (req, res) => {
	try {
		const result = await Notification.updateMany(
			{ recipient: req.user._id, isDeleted: false },
			{ $set: { isDeleted: true } }
		);

		res.status(200).json({
			success: true,
			message: 'All notifications deleted',
			modifiedCount: result.modifiedCount,
		});
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});
