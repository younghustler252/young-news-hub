const multer = require('multer');
const path = require('path');

// Store file temporarily on disk
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'temp/');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	}
});

// Only allow images (jpeg, png, etc.)
const fileFilter = (req, file, cb) => {
	const ext = path.extname(file.originalname).toLowerCase();
	if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
		cb(null, true);
	} else {
		cb(new Error('Only image files are allowed!'), false);
	}
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
