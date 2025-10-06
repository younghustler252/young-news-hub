const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // 🔑 Basic Info
    name: {
        type: String,
        required: true,
        trim: true,
    },

    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    // 🧑‍🎨 Profile
    bio: {
        type: String,
        default: '',
    },

    profileImageUrl: {
        type: String,
        default: '',
    },

    website: {
        type: String,
        default: '',
    },

    location: {
        type: String,
        default: '',
    },

    socialLinks: {
        twitter: String,
        github: String,
        linkedin: String,
        // Add more as needed
    },

    // 🛡️ Auth / Security
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },

    emailVerificationToken: String,
    emailVerificationExpires: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,

    // 📊 Relationships
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],

    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],

    // ⚠️ Moderation
    isBanned: {
        type: Boolean,
        default: false,
    },
    banReason: String,
    bannedAt: Date,
    // 📅 Activity

    lastLoginAt: Date,
    // ⏱️ Timestamps

}, {
    timestamps: true // adds createdAt and updatedAt automatically
});

userSchema.pre('save', async function (next) {
	const user = this;

	// Only hash if the password was modified or is new
	if (!user.isModified('passwordHash')) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
		next();
	} catch (err) {
		next(err);
	}
});
module.exports = mongoose.model('User', userSchema);
