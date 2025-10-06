const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    // 📄 Basic Content
    title: {
        type: String,
        required: true,
        trim: true,
    },

    content: {
        type: String,
        required: true,
    },

    coverImageUrl: {
        type: String,
        default: '',
    },

    tags: [{
        type: String,
        lowercase: true,
        trim: true,
    }],

    // 👤 Author Info
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // 🛡️ Moderation & Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },

    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    rejectedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    rejectionReason: {
        type: String,
    },

    // ❤️ Interactions
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],

  // 🕒 Timestamps
}, {
    timestamps: true // adds createdAt and updatedAt
});
    

module.exports = mongoose.model('Post', postSchema);
