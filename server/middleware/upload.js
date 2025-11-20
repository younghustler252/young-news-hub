const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, tempDir);
	},
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${file.originalname}`;
		cb(null, uniqueName);
	}
});

// Allowed file extensions
const allowedExtensions = [
	// Images
	'.jpg', '.jpeg', '.png', '.gif', '.webp',
	// Videos
	'.mp4', '.mov', '.avi', '.mkv', '.webm'
];

// File filter
const fileFilter = (req, file, cb) => {
	const ext = path.extname(file.originalname).toLowerCase();
	if (allowedExtensions.includes(ext)) {
		cb(null, true);
	} else {
		cb(new Error('Only image and video files are allowed'), false);
	}
};

// Optional limits
const limits = {
	fileSize: 100 * 1024 * 1024 // 100MB
};

// Final multer instance
const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
