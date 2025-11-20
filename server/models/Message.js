// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    image: { type: String, default: null },
    deletedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// Optional: add an index for faster queries on conversations
messageSchema.index(
    { sender: 1, receiver: 1, createdAt: -1 },
    { background: true }
);

module.exports = mongoose.model('Message', messageSchema);
