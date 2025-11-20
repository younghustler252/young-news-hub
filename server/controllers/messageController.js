const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');
const { sendNotification } = require('../utils/notificationUtils');

/**
 * @desc    Send a message to a friend
 * @route   POST /api/messages/:username
 * @access  Private
 */
const sendMessage = asyncHandler(async (req, res) => {
    const receiverId = req.resolvedUser._id;
    const { content, image } = req.body; // add image
    const senderId = req.user._id;

    if ((!content || content.trim() === '') && !image) {
        res.status(400);
        throw new Error('Message content or image is required');
    }

    // Verify friendship
    const sender = await User.findById(senderId);
    if (!sender.following.includes(receiverId)) {
        res.status(403);
        throw new Error('You can only message users you follow');
    }
    console.log('messadeid', receiverId )

    // Create new message
    const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content: content ? content.trim() : '',
        image: image || null, // save image if provided
    });

    // Send notification
    await sendNotification({
        recipient: receiverId,
        sender: senderId,
        type: 'message',
        content: `${sender.username} sent you a message`,
        message: message._id,
    });

    res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message,
    });
});

/**
 * @desc    Get messages between two users (conversation)
 * @route   GET /api/messages/:username
 * @access  Private
 */
const getConversation = asyncHandler(async (req, res) => {
    const userId = req.resolvedUser._id; // The receiver
    const currentUserId = req.user._id;  // The sender
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Get the total count of messages in the conversation
    const totalCount = await Message.countDocuments({
        $or: [
            { sender: currentUserId, receiver: userId },
            { sender: userId, receiver: currentUserId },
        ],
        deletedBy: { $ne: currentUserId }, // Exclude messages deleted by the current user
    });

    // Fetch paginated messages for the conversation
    const messages = await Message.find({
        $or: [
            { sender: currentUserId, receiver: userId },
            { sender: userId, receiver: currentUserId },
        ],
        deletedBy: { $ne: currentUserId },
    })
    .populate('sender', 'name username profileImageUrl')   // Populate sender details
    .populate('receiver', 'name username profileImageUrl') // Populate receiver details
    .sort({ createdAt: 1 })  // Sort messages by creation date in ascending order
    .skip(skip)              // Skip messages based on pagination
    .limit(limit)            // Limit number of messages per page
    .lean();                 // Return plain JavaScript object (not Mongoose Document)

    // Ensure image field is always present (null if not set)
    const formattedMessages = messages.map(msg => ({
        ...msg,
        image: msg.image || null
    }));

    res.status(200).json({
        success: true,
        page,
        limit,
        count: totalCount,  // Total number of messages in the conversation
        messages: formattedMessages,
    });
});



/**
 * @desc    Get all chat conversations for logged-in user
 * @route   GET /api/messages
 * @access  Private
 */
const getChatList = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const chats = await Message.aggregate([
        { $match: { $or: [{ sender: userId }, { receiver: userId }], deletedBy: { $ne: userId } } },
        { $sort: { updatedAt: -1 } },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ["$sender", userId] },
                        "$receiver",
                        "$sender"
                    ]
                },
                lastMessage: { $first: "$content" },
                lastMessageAt: { $first: "$updatedAt" },
                isRead: { $first: "$isRead" },
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                _id: 0,
                user: { name: "$user.name", username: "$user.username", profileImageUrl: "$user.profileImageUrl" },
                lastMessage: 1,
                lastMessageAt: 1,
                isRead: 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        chats
    });
});

/**
 * @desc    Mark a message as read
 * @route   PATCH /api/messages/:messageId/read
 * @access  Private
 */
const markAsRead = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    if (message.receiver.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('Not authorized to mark this message');
    }

    message.isRead = true;
    await message.save();

    // 🔔 Notify sender that their message was read
    await sendNotification({
        recipient: message.sender,
        sender: userId,
        type: 'message_read',
        content: `${req.user.username} read your message`,
        message: message._id,
    });

    res.status(200).json({
        success: true,
        message: 'Message marked as read',
        data: message,
    });
});

/**
 * @desc    Delete a message for a user (soft delete)
 * @route   DELETE /api/messages/:messageId
 * @access  Private
 */
const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    // Only sender or receiver can delete
    if (
        message.sender.toString() !== userId.toString() &&
        message.receiver.toString() !== userId.toString()
    ) {
        res.status(403);
        throw new Error('You are not authorized to delete this message');
    }

    // Mark as deleted for this user
    if (!message.deletedBy.includes(userId)) {
        message.deletedBy.push(userId);
        await message.save();
    }

    // If both users deleted → permanently delete
    if (message.deletedBy.length === 2) {
        await Message.deleteOne({ _id: message._id });
    }

    res.status(200).json({
        success: true,
        message: 'Message deleted successfully',
    });
});

module.exports = {
    sendMessage,
    getConversation,
    getChatList,
    markAsRead,
    deleteMessage,
};
