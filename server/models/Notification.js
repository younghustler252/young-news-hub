const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // 👤 Recipient of the notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // 🙋 Sender who triggered the notification
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // 🔔 Type of notification
    type: {
      type: String,
      required: true,
      enum: ['like', 'comment', 'follow', 'mention', 'message', 'admin', 'system', 'post'],
    },

    // 🧩 Context (post, comment, message)
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },

    // 📝 Short notification text
    content: {
      type: String,
      required: true,
      trim: true,
    },

    // 🧠 Extra metadata (supports deep links)
    metadata: {
      targetUrl: { type: String },
      extra: { type: Object },
    },

    // 🔖 Read/unread
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null },

    // 🚫 Soft delete
    isDeleted: { type: Boolean, default: false, index: true },

    // ⏳ Optional expiration (for temp/system notifications)
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

//
// 🔧 Indexes for speed
//
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ sender: 1, createdAt: -1 });

//
// ⚠️ Validation depending on type
//
notificationSchema.pre('validate', function (next) {
  switch (this.type) {
    case 'like':
    case 'comment':
      if (!this.post)
        return next(new Error('Post is required for like/comment notifications'));
      break;
    case 'message':
      if (!this.message)
        return next(new Error('Message is required for message notifications'));
      break;
    case 'mention':
      if (!this.post && !this.comment)
        return next(new Error('Post or comment is required for mention notifications'));
      break;
  }
  next();
});

//
// ✅ Instance method: mark a single notification as read
//
notificationSchema.methods.markAsRead = async function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

//
// ✅ Static: safely create a notification
//
notificationSchema.statics.createNotification = async function (data) {
  if (data.recipient?.toString() === data.sender?.toString()) return null;
  return this.create(data);
};

//
// ✅ Static: mark all as read for a user
//
notificationSchema.statics.markAllAsRead = async function (recipientId) {
  return this.updateMany(
    { recipient: recipientId, isRead: false, isDeleted: false },
    { isRead: true, readAt: new Date() }
  );
};

module.exports = mongoose.model('Notification', notificationSchema);
