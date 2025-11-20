// utils/notificationUtils.js
const Notification = require('../models/Notification');

/**
 * Send a user notification
 * @param {Object} options
 * @param {String} options.recipient - The ID of the user receiving the notification
 * @param {String|null} [options.sender] - The ID of the user sending the notification (or null for system)
 * @param {String} options.type - Notification type (e.g. 'follow', 'ban', 'system', etc.)
 * @param {String} options.content - The text content of the notification
 * @param {Object} [options.metadata] - Optional metadata (e.g. { action: 'follow', postId: ... })
 * @param {String} [options.post] - Optional post reference
 * @param {String} [options.comment] - Optional comment reference
 * @param {String} [options.message] - Optional message reference
 * @returns {Promise<Object|null>} - Returns the created notification or null on failure
 */
const sendNotification = async ({
	recipient,
	sender = null,
	type,
	content,
	metadata = {},
	post = null,
	comment = null,
	message = null,
}) => {
	try {
		// Prevent self-notifications
		if (sender && sender.toString() === recipient.toString()) {
			console.warn('⚠️ Skipping self-notification');
			return null;
		}

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

		return notification;
	} catch (error) {
		console.error('❌ Failed to send notification:', error.message);
		return null;
	}
};

module.exports = { sendNotification };
