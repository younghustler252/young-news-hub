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
        type: Schema.Types.ObjectId,
        ref: 'Tag',
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

    // 👁️ Views
    viewsCount: {
        type: Number,
        default: 0, // track number of views for trending
    },

    // ❤️ Interactions
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Like', // ✅ reference Like schema
    }],
    likesCount: {
        type: Number,
        default: 0,
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    commentsCount: {
        type: Number,
        default: 0,
    },

    // 📊 Trending score
    trendingScore: {
        type: Number,
        default: 0,
        index: true,
    }

}, {
    timestamps: true,
});

// 🧮 Virtual for quick stats
postSchema.virtual('summary').get(function() {
    return {
        likes: this.likesCount,
        comments: this.commentsCount,
        views: this.viewsCount
    };
});

// 📈 Method to calculate trending score
postSchema.methods.calculateTrendingScore = function() {
    const hoursOld = (Date.now() - this.createdAt) / 36e5;
    this.trendingScore = (this.likesCount * 2) + (this.commentsCount * 3) + (this.viewsCount * 1) - (hoursOld * 0.5);
    return this.trendingScore;
};

// 🔄 Update trending score on save
postSchema.pre('save', function(next) {
    this.calculateTrendingScore();
    next();
});

// 🔥 Indexes
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ likesCount: -1, commentsCount: -1 });
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
