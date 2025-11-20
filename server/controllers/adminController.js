const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification'); // ⬅️ FIX: Missing import
const asyncHandler = require('express-async-handler');

/*-------------------------------------------------------
🟢 Dashboard Overview
-------------------------------------------------------*/
const getOverviewStats = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const approvedPosts = await Post.countDocuments({ status: 'approved' });
    const pendingPosts = await Post.countDocuments({ status: 'pending' });
    const rejectedPosts = await Post.countDocuments({ status: 'rejected' });
    const totalComments = await Comment.countDocuments();
    const flaggedComments = await Comment.countDocuments({ flagged: true });

    res.status(200).json({
      users: totalUsers,
      posts: {
        total: totalPosts,
        approved: approvedPosts,
        pending: pendingPosts,
        rejected: rejectedPosts
      },
      comments: {
        total: totalComments,
        flagged: flaggedComments
      }
    });
  } catch (error) {
    console.error('🔴 Error in getOverviewStats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/*-------------------------------------------------------
🟢 Top Liked Posts
-------------------------------------------------------*/
const getTopPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: 'approved' })
    .sort({ likes: -1 })
    .limit(5)
    .select('title likes createdAt')
    .populate('author', 'name');

  res.status(200).json(posts);
});

/*-------------------------------------------------------
🟢 Top Authors
-------------------------------------------------------*/
const getTopAuthors = asyncHandler(async (req, res) => {
  const authors = await Post.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$author', postCount: { $sum: 1 } } },
    { $sort: { postCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'authorInfo'
      }
    },
    { $unwind: '$authorInfo' },
    {
      $project: {
        authorId: '$_id',
        name: '$authorInfo.name',
        postCount: 1
      }
    }
  ]);

  res.status(200).json(authors);
});

/*-------------------------------------------------------
🟢 Posts by Date (Graph)
-------------------------------------------------------*/
const getPostsByDate = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const postsByDate = await Post.aggregate([
    { $match: { createdAt: { $gte: since }, status: 'approved' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json(postsByDate);
});

/*-------------------------------------------------------
🟢 Get All Posts (Admin)
-------------------------------------------------------*/
const getAllPosts = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const query = {};

  if (status) query.status = status;

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const skip = (page - 1) * limit;

  const posts = await Post.find(query)
    .populate('author', 'name username role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalPosts = await Post.countDocuments(query);

  res.status(200).json({
    total: totalPosts,
    page: Number(page),
    totalPages: Math.ceil(totalPosts / limit),
    posts
  });
});

/*-------------------------------------------------------
🟢 Get All Users (Admin)
-------------------------------------------------------*/
const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, banned, page = 1, limit = 20 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) query.role = role;

  if (banned === 'true') query.isBanned = true;
  if (banned === 'false') query.isBanned = false;

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalUsers = await User.countDocuments(query);

  res.status(200).json({
    total: totalUsers,
    page: Number(page),
    totalPages: Math.ceil(totalUsers / limit),
    users
  });
});

/*-------------------------------------------------------
🟢 Get User by ID
-------------------------------------------------------*/
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('followers', 'name profileImageUrl username')
    .populate('following', 'name profileImageUrl username');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});

/*-------------------------------------------------------
🟢 Ban / Unban User
-------------------------------------------------------*/
const banUser = asyncHandler(async (req, res) => {
  const { action, reason } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (action === 'ban') {
    user.isBanned = true;
    user.banReason = reason || 'No reason specified';
    user.bannedAt = new Date();
  } else if (action === 'unban') {
    user.isBanned = false;
    user.banReason = null;
    user.bannedAt = null;
  } else {
    res.status(400);
    throw new Error('Invalid action. Must be "ban" or "unban".');
  }

  await user.save();

  res.status(200).json({
    message: `User ${action === 'ban' ? 'banned' : 'unbanned'} successfully`,
    user
  });
});

/*-------------------------------------------------------
🟢 Promote / Demote Admin
-------------------------------------------------------*/
const toggleAdmin = asyncHandler(async (req, res) => {
  const { role } = req.body; // "admin" or "user"
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!['admin', 'user'].includes(role)) {
    res.status(400);
    throw new Error("Role must be either 'admin' or 'user'");
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    message: `User role updated to ${role}`,
    user
  });
});

/*-------------------------------------------------------
🟢 Approve Post
-------------------------------------------------------*/
const approvePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}

	post.status = 'approved';
	post.approvedBy = req.user._id;
	post.rejectionReason = undefined;
	post.calculateTrendingScore();

	await post.save();

	await Notification.createNotification({
		recipient: post.author,
		sender: req.user._id,
		type: 'admin',
		content: `Your post "${post.title}" has been approved.`,
		post: post._id,
	});

	res.status(200).json({ message: 'Post approved', postId: post._id });
});

/*-------------------------------------------------------
🟢 Reject post (admin)
@route   PUT /api/admin/posts/:id/reject
@access  Admin
-------------------------------------------------------*/
const rejectPost = asyncHandler(async (req, res) => {
	const { reason } = req.body;
	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}

	post.status = 'rejected';
	post.rejectedBy = req.user._id;
	post.rejectionReason = reason || 'No reason provided';
	await post.save();

	await Notification.createNotification({
		recipient: post.author,
		sender: req.user._id,
		type: 'admin',
		content: `Your post "${post.title}" was rejected. Reason: ${post.rejectionReason}`,
		post: post._id,
	});

	res.status(200).json({
		message: 'Post rejected',
		postId: post._id,
		reason: post.rejectionReason,
	});
});

/*-------------------------------------------------------
🟢 Delete post
@route   DELETE /api/posts/:id
@access  Private / Admin
-------------------------------------------------------*/
const deletePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}

	const isAuthor = post.author.toString() === req.user._id.toString();
	const isAdmin = req.user.role === 'admin';

	if (!isAuthor && !isAdmin) {
		res.status(403);
		throw new Error('You are not authorized to delete this post');
	}

	await post.deleteOne();

	if (isAdmin && !isAuthor) {
		await Notification.createNotification({
			recipient: post.author,
			sender: req.user._id,
			type: 'admin',
			content: `Your post "${post.title}" was deleted by an administrator.`,
			post: post._id,
		});
	}

	res.status(200).json({ message: 'Post deleted' });
});

/*-------------------------------------------------------
🟢 EXPORTS
-------------------------------------------------------*/
module.exports = {
  getOverviewStats,
  getTopPosts,
  getTopAuthors,
  getPostsByDate,
  getAllPosts,
  getAllUsers,
  getUserById,
  banUser,
  toggleAdmin,
  approvePost,
  rejectPost
};
