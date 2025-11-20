const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
	name: { type: String, required: true },
	url: { type: String, required: true },
	publicId: { type: String, required: true },
	type: { 
		type: String, 
		required: true,
		enum: [
			'image/jpeg', 'image/png', 'image/gif', 'image/webp',
			'video/mp4', 'video/quicktime', 'video/webm', 'video/avi', 'video/mkv'
		]
	},
	size: { type: Number, required: true },
	uploader: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

mediaSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);
