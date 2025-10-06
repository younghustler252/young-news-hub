const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

// @desc    Add a comment to a post (top-level or reply)
// @route   POST /api/comments/:postId
// @access  Private
const addComment = asyncHandler(async (req, res) => {
	const { content, parentComment } = req.body;

	if (!content) {
		res.status(400);
		throw new Error('Comment content is required');
	}

	const post = await Post.findById(req.params.postId);
	if (!post || post.status !== 'approved') {
		res.status(404);
		throw new Error('Post not found or not approved');
	}

	const comment = await Comment.create({
		content,
		post: post._id,
		author: req.user.userId,
		parentComment: parentComment || null,
	});

	res.status(201).json(comment);
});


// @desc    Get all comments for a post (excluding soft-deleted)
// @route   GET /api/comments/:postId
// @access  Public
const getCommentsByPost = asyncHandler(async (req, res) => {
	const comments = await Comment.find({
		post: req.params.postId,
		isDeleted: false,
	})
		.sort({ createdAt: -1 })
		.populate('author', 'name');

	res.status(200).json(comments);
});


// @desc    Delete a comment (author, post owner, or admin)
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);
	if (!comment) {
		res.status(404);
		throw new Error('Comment not found');
	}

	const post = await Post.findById(comment.post);

	const isAuthor = comment.author.toString() === req.user.userId;
	const isPostOwner = post.author.toString() === req.user.userId;
	const isAdmin = req.user.role === 'admin';

	if (!isAuthor && !isPostOwner && !isAdmin) {
		res.status(403);
		throw new Error('Not authorized to delete this comment');
	}

	// Soft delete
	comment.isDeleted = true;
	await comment.save();

	res.status(200).json({ message: 'Comment deleted (soft)', commentId: comment._id });
});


// @desc    Admin: Flag a comment for review
// @route   PUT /api/comments/:id/flag
// @access  Admin
const flagComment = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);
	if (!comment) {
		res.status(404);
		throw new Error('Comment not found');
	}

	comment.flagged = true;
	await comment.save();

	res.status(200).json({ message: 'Comment flagged', commentId: comment._id });
});
