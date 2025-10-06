const cloudinary = require('../utils/cloudinary');
const Media = require('../models/Media');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

// POST /api/media/upload
exports.uploadMedia = asyncHandler(async (req, res) => {
	if (!req.file) {
		res.status(400);
		throw new Error('No file uploaded');
	}

	const result = await cloudinary.uploader.upload(req.file.path, {
		folder: 'blog_uploads'
	});

	// Clean up local file
	fs.unlinkSync(req.file.path);

	// Save media to DB
	const media = await Media.create({
		name: req.file.originalname,
		url: result.secure_url,
		publicId: result.public_id,
		type: req.file.mimetype,
		size: req.file.size,
		uploader: req.user._id,
	});

	res.status(201).json(media);
});

// GET /api/media
exports.getAllMedia = asyncHandler(async (req, res) => {
	const media = await Media.find().sort({ createdAt: -1 });
	res.status(200).json(media);
});

// DELETE /api/media/:id
exports.deleteMedia = asyncHandler(async (req, res) => {
	const media = await Media.findById(req.params.id);
	if (!media) {
		res.status(404);
		throw new Error('Media not found');
	}

	// Remove from Cloudinary
	await cloudinary.uploader.destroy(media.publicId);

	// Remove from DB
	await media.deleteOne();

	res.status(200).json({ message: 'Media deleted' });
});
