const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');

// @desc Admin dashboard overview stats
exports.getOverviewStats = asyncHandler(async (req, res) => {
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
});

// @desc Get top liked posts
exports.getTopPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find({ status: 'approved' })
		.sort({ likes: -1 })
		.limit(5)
		.select('title likes createdAt')
		.populate('author', 'name');

	res.status(200).json(posts);
});

// @desc Get top authors by number of posts
exports.getTopAuthors = asyncHandler(async (req, res) => {
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

// @desc Posts grouped by date (for graph)
// e.g., posts created per day over last 7 days
exports.getPostsByDate = asyncHandler(async (req, res) => {
	const days = parseInt(req.query.days) || 7;
	const since = new Date();
	since.setDate(since.getDate() - days);

	const postsByDate = await Post.aggregate([
		{ $match: { createdAt: { $gte: since }, status: 'approved' } },
		{
			$group: {
				_id: {
					$dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
				},
				count: { $sum: 1 }
			}
		},
		{ $sort: { _id: 1 } }
	]);

	res.status(200).json(postsByDate);
});
