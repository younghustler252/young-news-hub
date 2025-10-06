const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema({
	// 👤 User who liked
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	// 📄 Post that was liked
	post: {
		type: Schema.Types.ObjectId,
		ref: 'Post',
		required: true,
	},

	// 🕒 Timestamps
}, {
	timestamps: true // adds createdAt, updatedAt
});

likeSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
