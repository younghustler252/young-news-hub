const mongoose = require('mongoose');
const { Schema } = mongoose;

const userPostSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    viewed: {
        type: Boolean,
        default: false, // true when post is viewed by user
    },
    liked: {
        type: Boolean,
        default: false, // true if the user likes the post
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('UserPost', userPostSchema);
