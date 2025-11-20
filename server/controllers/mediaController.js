const cloudinary = require('../utils/cloudinary');
const Media = require('../models/Media');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

// @desc    Upload media file to Cloudinary
// @route   POST /api/media/upload
// @access  Private
const upload = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    // console.log('Uploading file:', req.file);

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog_uploads',
        });

        // Log the Cloudinary upload result
        // console.log('Cloudinary Upload Result:', result);

        // Clean up local temp file
        fs.unlinkSync(req.file.path);

        // Save media data to DB
        const media = await Media.create({
            name: req.file.originalname,
            url: result.secure_url,  // Cloudinary URL
            publicId: result.public_id,
            type: req.file.mimetype,
            size: req.file.size,
            uploader: req.user._id,
        });

        // Log the saved media data
        // console.log('Saved Media in DB:', media);

        res.status(201).json({
            message: 'Media uploaded successfully',
            media,
        });
    } catch (error) {
        console.error('Cloudinary upload failed:', error);
        res.status(500).send('Error uploading media');
    }
});


// @desc    Get all media
// @route   GET /api/media
// @access  Private/Admin (depending on implementation)
const getAll = asyncHandler(async (req, res) => {
	const media = await Media.find().sort({ createdAt: -1 });

	res.status(200).json({
		message: 'Media fetched successfully',
		total: media.length,
		media,
	});
});

// @desc    Delete a media file
// @route   DELETE /api/media/:id
// @access  Private (owner or admin)
const remove = asyncHandler(async (req, res) => {
	const media = await Media.findById(req.params.id);

	if (!media) {
		res.status(404);
		throw new Error('Media not found');
	}

	// Delete from Cloudinary
	await cloudinary.uploader.destroy(media.publicId);

	// Delete from DB
	await media.deleteOne();

	res.status(200).json({
		message: 'Media deleted successfully',
		mediaId: req.params.id,
	});
});

module.exports = {
	upload,
	getAll,
	remove,
};
