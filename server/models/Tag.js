const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,       // ensures no duplicates
        trim: true,
        lowercase: true,    // always store lowercase for consistency
    },
    description: {
        type: String,
        default: '',        // optional description
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,       // URL-friendly identifier
        lowercase: true,
        trim: true,
    },
    postCount: {
        type: Number,
        default: 0,         // how many posts use this tag
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});


tagSchema.index({ postCount: -1 }); // sort popular tags quickly

// 🔄 Pre-save hook to generate slug if not set
tagSchema.pre('validate', function(next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/\s+/g, '-')        // replace spaces with dashes
            .replace(/[^\w\-]+/g, '')   // remove non-word chars
            .replace(/\-\-+/g, '-')     // remove duplicate dashes
            .replace(/^-+/, '')          // trim starting dash
            .replace(/-+$/, '');         // trim ending dash
    }
    next();
});

// ✅ Optional: static method to increment postCount
tagSchema.statics.incrementPostCount = async function(tagId) {
    return this.findByIdAndUpdate(tagId, { $inc: { postCount: 1 } }, { new: true });
};

// ✅ Optional: static method to decrement postCount
tagSchema.statics.decrementPostCount = async function(tagId) {
    return this.findByIdAndUpdate(tagId, { $inc: { postCount: -1 } }, { new: true });
};

module.exports = mongoose.model('Tag', tagSchema);
