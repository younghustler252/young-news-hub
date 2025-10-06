const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  // 📄 Comment Content
    content: {
        type: String,
        required: true,
        trim: true,
    },

    // 👤 Author
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // 📰 Post the comment belongs to
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },

    // 💬 (Optional) Parent comment for nested replies
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },

    // ✅ Moderation Fields (optional)
    isDeleted: {
        type: Boolean,
        default: false,
    },

    flagged: {
        type: Boolean,
        default: false,
    },

    // 🕒 Timestamps
    }, {
    timestamps: true // createdAt, updatedAt
    });

module.exports = mongoose.model('Comment', commentSchema);

