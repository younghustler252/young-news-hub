const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');
const {sendNotification} = require('../utils/notificationUtils')

// @desc Get current logged-in user
const getMe = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
		.select('-password')
		.populate('followers', 'name profileImageUrl username')
		.populate('following', 'name profileImageUrl username');

	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	const postsCount = await Post.countDocuments({ author: user._id });

	res.status(200).json({
		user: {
			_id: user._id,
			name: user.name,
			username: user.username,
			email: user.email,
			role: user.role,                 // 🔥 FIX ADDED
			avatar: user.profileImageUrl,
			bio: user.bio,
			location: user.location,
			website: user.website,
			socialLinks: user.socialLinks,
			createdAt: user.createdAt,
			isBanned: user.isBanned,
			banReason: user.banReason || '',
			postsCount,
			followers: user.followers,
			following: user.following,
		},
	});
});




// @desc Get public profile of user by username
const getUserByUsername = asyncHandler(async (req, res) => {
	const user = await User.findOne({ username: req.params.username.toLowerCase() })
		.select('-password -email')
		.populate('followers', 'name profileImageUrl username')
		.populate('following', 'name profileImageUrl username')

	if (!user) {
		res.status(404)
		throw new Error('User not found')
	}
	const followers = user.followers || [];
	const following = user.following || [];


	const postsCount = await Post.countDocuments({ author: user._id, status: 'approved' })

	
	res.status(200).json({
	user: {
		_id: user._id,
		name: user.name,
		username: user.username,
		avatar: user.profileImageUrl,
		bio: user.bio,
		location: user.location,
		website: user.website,
		socialLinks: user.socialLinks,
		createdAt: user.createdAt,
		isBanned: user.isBanned,
		postsCount,
		followers,
		following,
	},
	});
})


// @desc    Complete user profile (add username, phone, bio)
// @route   PUT /api/users/complete-profile
// @access  Private (user must be logged in/verified)
// @desc    Complete user profile (add username, phone, bio)
// @route   PUT /api/users/complete-profile
// @access  Private (user must be logged in/verified)
const completeProfile = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const { username, bio, phone, accountType, location, website } = req.body;

	if (!username) {
		res.status(400);
		throw new Error("Username is required");
	}

	// Check if username taken
	const existingUsername = await User.findOne({ username: username.toLowerCase() });
	if (existingUsername && existingUsername._id.toString() !== userId.toString()) {
		res.status(400);
		throw new Error("Username already taken");
	}

	const user = await User.findById(userId);
	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	user.username = username.toLowerCase().trim();
	if (bio) user.bio = bio;
	if (phone && phone !== user.phone) {
		user.phone = phone;
		user.isPhoneVerified = false;
	}
	if (accountType) user.accountType = accountType;  // New addition for accountType
	if (location) user.location = location;
	if (website) user.website = website;

	await user.save();

	// 🔔 Send system notification
	await sendNotification({
		recipient: user._id,
		type: 'system',
		content: `Welcome, ${user.name || user.username}! Your profile is now complete.`,
		metadata: { action: 'profile_complete' },
	});

	res.status(200).json({
		message: "Profile completed successfully",
		user: {
		_id: user._id,
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		phone: user.phone,
		accountType: user.accountType,  // Include account type in the response
		isPhoneVerified: user.isPhoneVerified || false,
		}
	});
});




// @desc Update user profile
// @desc Update user profile (including username)
// @desc Update user profile (including username, accountType, etc.)
const updateProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	const allowedUpdates = [
		'name',
		'username', 
		'bio',
		'location',
		'website',
		'socialLinks',
		'profileImageUrl',
		'accountType',  // Allow update for account type
	];

	allowedUpdates.forEach(field => {
		if (req.body[field] !== undefined) {
		user[field] = req.body[field];
		}
	});

	// ✅ Optional: Enforce username format here (if not already in schema)
	if (req.body.username) {
		const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
		if (!usernameRegex.test(req.body.username)) {
		res.status(400);
		throw new Error(
			'Username must be 3-30 characters and only contain letters, numbers, or underscores.'
		);
		}
	}

	try {
		await user.save();
		res.status(200).json({
		message: 'Profile updated successfully',
		user: {
			_id: user._id,
			name: user.name,
			username: user.username,
			email: user.email,
			avatar: user.profileImageUrl,
			bio: user.bio,
			location: user.location,
			website: user.website,
			socialLinks: user.socialLinks,
			accountType: user.accountType,  // Include account type in the response
		},
		});
	} catch (err) {
		if (err.code === 11000 && err.keyPattern?.username) {
		res.status(400);
		throw new Error('Username is already taken.');
		}
		console.error(err);
		res.status(500);
		throw new Error('Something went wrong during profile update.');
	}
});


// @desc Check if username is available
// GET /api/users/check-username?username=desired_name
const checkUsername = asyncHandler(async (req, res) => {
	const { username } = req.query

	if (!username) {
		res.status(400)
		throw new Error('Username is required')
	}

	const exists = await User.exists({ username: username.toLowerCase() })
	res.json({ available: !exists })
})


// @desc Follow or unfollow a user
const toggleFollow = asyncHandler(async (req, res) => {
	const targetUser = await User.findById(req.params.id);
	const currentUser = await User.findById(req.user._id);

	if (!targetUser) {
		res.status(404);
		throw new Error('User to follow not found');
	}

	if (targetUser._id.equals(currentUser._id)) {
		res.status(400);
		throw new Error("You can't follow yourself.");
	}

	const isFollowing = currentUser.following.includes(targetUser._id);

	if (isFollowing) {
		// 🔄 Unfollow
		currentUser.following.pull(targetUser._id);
		targetUser.followers.pull(currentUser._id);
		await currentUser.save();
		await targetUser.save();

		return res.status(200).json({ message: 'Unfollowed user' });
	} else {
		// 🤝 Follow
		currentUser.following.push(targetUser._id);
		targetUser.followers.push(currentUser._id);
		await currentUser.save();
		await targetUser.save();

		// 🔔 Send follow notification
		await sendNotification({
			recipient: targetUser._id,
			sender: currentUser._id,
			type: 'follow',
			content: `${currentUser.name || currentUser.username} started following you.`,
			metadata: { action: 'follow' },
		});

		return res.status(200).json({ message: 'Followed user' });
	}
});





module.exports = {
	getMe,
	getUserByUsername,
	completeProfile,
	updateProfile,
	toggleFollow,
	checkUsername
};
