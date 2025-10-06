const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

// @desc    Create a new post (draft/pending)
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
	const { title, content, tags, coverImage } = req.body;

	if (!title || !content) {
		res.status(400);
		throw new Error('Title and content are required');
	}

	const post = await Post.create({
		title,
		content,
		tags,
		coverImage,
		author: req.user.userId,
		status: 'pending', // All new posts require admin approval
	});

	res.status(201).json({
		message: 'Post submitted for review',
		post,
	});
});

// @desc    Get all approved posts
// @route   GET /api/posts
// @access  Public
// @desc    Get all approved posts with optional filters
// @route   GET /api/posts
// @access  Public
exports.getAllApprovedPosts = asyncHandler(async (req, res) => {
	const { search, tags, author, sort = 'desc', page = 1, limit = 10 } = req.query;

	const query = {
		status: 'approved',
	};

	// 🔍 Full-text search (title or content)
	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: 'i' } },
			{ content: { $regex: search, $options: 'i' } }
		];
	}

	// 🏷️ Filter by tags (comma-separated list)
	if (tags) {
		const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
		query.tags = { $in: tagsArray };
	}

	// 👤 Filter by author ID
	if (author) {
		query.author = author;
	}

	// 📄 Pagination
	const pageNum = parseInt(page, 10) || 1;
	const limitNum = parseInt(limit, 10) || 10;
	const skip = (pageNum - 1) * limitNum;

	// 🧾 Count for pagination metadata
	const total = await Post.countDocuments(query);

	// 📥 Fetch posts
	const posts = await Post.find(query)
		.sort({ createdAt: sort === 'asc' ? 1 : -1 })
		.skip(skip)
		.limit(limitNum)
		.populate('author', 'name');

	res.status(200).json({
		page: pageNum,
		limit: limitNum,
		totalPages: Math.ceil(total / limitNum),
		totalPosts: total,
		posts,
	});
});


// @desc    Get a single post (only if approved or owner/admin)
// @route   GET /api/posts/:id
// @access  Public / Private
const getPostById = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id).populate('author', 'name');

	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}

	if (
		post.status !== 'approved' &&
		post.author._id.toString() !== req.user?.userId &&
		req.user?.role !== 'admin'
	) {
		res.status(403);
		throw new Error('You are not authorized to view this post');
	}

	res.status(200).json(post);
});

// @desc    Admin: Approve a post
// @route   PUT /api/admin/posts/:id/approve
// @access  Admin
const approvePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}

	post.status = 'approved';
	post.rejectionReason = undefined;
	await post.save();

	res.status(200).json({ message: 'Post approved' });
});

// @desc    Admin: Reject a post
// @route   PUT /api/admin/posts/:id/reject
// @access  Admin
const rejectPost = asyncHandler(async (req, res) => {
	const { reason } = req.body;
	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}

	post.status = 'rejected';
	post.rejectionReason = reason || 'No reason given';
	await post.save();

	res.status(200).json({ message: 'Post rejected' });
});

// @desc    Delete your own post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}

	// Allow delete only by author or admin
	if (
		post.author.toString() !== req.user.userId &&
		req.user.role !== 'admin'
	) {
		res.status(403);
		throw new Error('You are not authorized to delete this post');
	}

	await post.deleteOne();

	res.status(200).json({ message: 'Post deleted' });
});
