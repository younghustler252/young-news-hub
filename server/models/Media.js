const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
	name: String,
	url: String,
	publicId: String,
	type: String,
	size: Number,
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

module.exports = mongoose.model('Media', mediaSchema);
