const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get current logged-in user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.userId).select('-passwordHash');
	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}
	res.status(200).json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
	const { name, bio, location, website, socialLinks } = req.body;

	const user = await User.findById(req.user.userId);
	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	user.name = name || user.name;
	user.bio = bio || user.bio;
	user.location = location || user.location;
	user.website = website || user.website;
	user.socialLinks = socialLinks || user.socialLinks;

	await user.save();

	res.status(200).json({ message: 'Profile updated', user });
});

// @desc    Follow or unfollow a user
// @route   POST /api/users/:id/follow
// @access  Private
const toggleFollow = asyncHandler(async (req, res) => {
	const targetUser = await User.findById(req.params.id);
	const currentUser = await User.findById(req.user.userId);

	if (!targetUser) {
		res.status(404);
		throw new Error('User to follow not found');
	}

	const isFollowing = currentUser.following.includes(targetUser._id);

	if (isFollowing) {
		// Unfollow
		currentUser.following.pull(targetUser._id);
		targetUser.followers.pull(currentUser._id);
		await currentUser.save();
		await targetUser.save();
		return res.status(200).json({ message: 'Unfollowed user' });
	} else {
		// Follow
		currentUser.following.push(targetUser._id);
		targetUser.followers.push(currentUser._id);
		await currentUser.save();
		await targetUser.save();
		return res.status(200).json({ message: 'Followed user' });
	}
});

// @desc    Admin: Ban or unban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Admin only
const banUser = asyncHandler(async (req, res) => {
	const { action, reason } = req.body; // action: 'ban' or 'unban'

	const user = await User.findById(req.params.id);
	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	if (action === 'ban') {
		user.isBanned = true;
		user.banReason = reason || 'No reason specified';
		user.bannedAt = new Date();
	} else {
		user.isBanned = false;
		user.banReason = null;
		user.bannedAt = null;
	}

	await user.save();

	res.status(200).json({ message: `User ${action}ned successfully.` });
});
