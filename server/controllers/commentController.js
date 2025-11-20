const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');
const { sendNotification } = require('../utils/notificationUtils'); // ✅ centralized notification

/*-------------------------------------------------------
💬 Add a comment to a post (top-level or reply)
@route   POST /api/comments/:postId
@access  Private
-------------------------------------------------------*/
const addComment = asyncHandler(async (req, res) => {
	const { content, parentComment } = req.body;

	if (!content) {
		res.status(400);
		throw new Error('Comment content is required');
	}

	const post = await Post.findById(req.params.postId);
	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}
	if (post.status && post.status !== 'approved') {
		res.status(403);
		throw new Error('Post not approved for comments');
	}

	let parent = null;
	if (parentComment) {
		parent = await Comment.findById(parentComment);
		if (!parent || parent.post.toString() !== post._id.toString()) {
			res.status(400);
			throw new Error('Invalid parent comment');
		}
	}

	const comment = await Comment.create({
		content,
		post: post._id,
		author: req.user._id,
		parentComment: parent ? parent._id : null,
	});

	/* 🔔 Notifications */

	// Notify post author if commenter is not the post author
	if (post.author.toString() !== req.user._id.toString()) {
		await sendNotification({
			recipient: post.author,
			sender: req.user._id,
			type: 'comment',
			content: `${req.user.username} commented on your post "${post.title}".`,
			post: post._id,
			comment: comment._id,
			metadata: { action: 'comment_post' },
		});
	}

	// Notify parent comment author if it's a reply (and not self)
	if (parent && parent.author.toString() !== req.user._id.toString()) {
		await sendNotification({
			recipient: parent.author,
			sender: req.user._id,
			type: 'comment',
			content: `${req.user.username} replied to your comment.`,
			post: post._id,
			comment: comment._id,
			metadata: { action: 'reply_comment' },
		});
	}

	res.status(201).json({ success: true, data: comment });
});

/*-------------------------------------------------------
💬 Get all comments for a post
@route   GET /api/comments/:postId
@access  Public
-------------------------------------------------------*/
const getCommentsByPost = asyncHandler(async (req, res) => {
	const comments = await Comment.find({
		post: req.params.postId,
		isDeleted: false,
	})
		.sort({ createdAt: -1 })
		.populate('author', 'name profileImageUrl username');

	res.status(200).json({ success: true, data: comments });
});

/*-------------------------------------------------------
🗑️ Delete a comment
@route   DELETE /api/comments/:id
@access  Private
-------------------------------------------------------*/
const deleteComment = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);
	if (!comment) {
		res.status(404);
		throw new Error('Comment not found');
	}

	const post = await Post.findById(comment.post);
	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}

	const userId = req.user._id.toString();
	const isAuthor = comment.author.toString() === userId;
	const isPostOwner = post.author.toString() === userId;
	const isAdmin = req.user.role === 'admin';

	if (!isAuthor && !isPostOwner && !isAdmin) {
		res.status(403);
		throw new Error('Not authorized to delete this comment');
	}

	comment.isDeleted = true;
	await comment.save();

	// Notify comment author if admin deleted
	if (isAdmin && !isAuthor) {
		await sendNotification({
			recipient: comment.author,
			sender: req.user._id,
			type: 'admin',
			content: `Your comment on "${post.title}" was deleted by an administrator.`,
			post: post._id,
			comment: comment._id,
			metadata: { action: 'admin_delete_comment' },
		});
	}

	res.status(200).json({
		success: true,
		message: 'Comment deleted',
		commentId: comment._id,
	});
});

/*-------------------------------------------------------
🚩 Flag a comment for review (admin)
@route   PUT /api/comments/:id/flag
@access  Admin
-------------------------------------------------------*/
const flagComment = asyncHandler(async (req, res) => {
	if (req.user.role !== 'admin') {
		res.status(403);
		throw new Error('Only admins can flag comments');
	}

	const comment = await Comment.findById(req.params.id);
	if (!comment) {
		res.status(404);
		throw new Error('Comment not found');
	}

	comment.flagged = true;
	await comment.save();

	// Notify author
	await sendNotification({
		recipient: comment.author,
		sender: req.user._id,
		type: 'admin',
		content: 'Your comment was flagged for review by an administrator.',
		comment: comment._id,
		metadata: { action: 'flag_comment' },
	});

	res.status(200).json({
		success: true,
		message: 'Comment flagged',
		commentId: comment._id,
	});
});

module.exports = {
	addComment,
	getCommentsByPost,
	deleteComment,
	flagComment,
};
