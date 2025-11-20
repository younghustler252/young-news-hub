const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    // 🔑 Basic Info
    name: { type: String, required: true, trim: true },

    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        match: /^[a-zA-Z0-9_]{3,30}$/,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    phone: { type: String, sparse: true },

    isPhoneVerified: { type: Boolean, default: false },

    password: { type: String, required: true },

    // 🧑‍🎨 Profile Info
    bio: { type: String, default: '' },
    profileImageUrl: { type: String, default: '' },
    website: { type: String, trim: true },
    location: { type: String, trim: true },

    socialLinks: {
        twitter: String,
        github: String,
        linkedin: String,
    },

    // 🔥 Privacy
    isPrivate: { type: Boolean, default: false },

    // 🔥 Account Type
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

    accountType: {
        type: String,
        enum: ['user', 'creator', 'company', 'recruiter'],
        default: 'user',
    },

    headline: { type: String, default: '' },
    interests: [{ type: String, lowercase: true, trim: true }],

    // 🟢 Online Status
    isOnline: { type: Boolean, default: false },
    lastActiveAt: { type: Date, default: Date.now },
    lastLoginAt: Date,

    // 🟢 Notification Settings
    notificationSettings: {
        likes: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        followers: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
    },

    // 🛡️ Security
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // 🔥 Shadowban Support
    shadowBanned: { type: Boolean, default: false },

    // 📊 Relationships
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    connectionRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    // ⚠️ Moderation
    isBanned: { type: Boolean, default: false },
    banReason: String,
    bannedAt: Date,

    // 📊 Quick Stats
    postsCount: { type: Number, default: 0 },
    likesReceived: { type: Number, default: 0 },

}, { timestamps: true });


// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
