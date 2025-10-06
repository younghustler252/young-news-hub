const Post = require('../models/Post');
const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');

// 📌 Like or unlike a post
// POST /api/likes/post/:id
const togglePostLike = asyncHandler(async (req, res) => {
	const userId = req.user.userId;
	const post = await Post.findById(req.params.id);

	if (!post || post.status !== 'approved') {
		res.status(404);
		throw new Error('Post not found or not approved');
	}

	const hasLiked = post.likes.includes(userId);

	if (hasLiked) {
		post.likes.pull(userId);
		await post.save();
		return res.status(200).json({ liked: false, likesCount: post.likes.length });
	} else {
		post.likes.addToSet(userId);
		await post.save();
		return res.status(200).json({ liked: true, likesCount: post.likes.length });
	}
});


// 📌 Like or unlike a comment
// POST /api/likes/comment/:id
const toggleCommentLike = asyncHandler(async (req, res) => {
	const userId = req.user.userId;
	const comment = await Comment.findById(req.params.id);

	if (!comment || comment.isDeleted) {
		res.status(404);
		throw new Error('Comment not found or deleted');
	}

	const hasLiked = comment.likes.includes(userId);

	if (hasLiked) {
		comment.likes.pull(userId);
		await comment.save();
		return res.status(200).json({ liked: false, likesCount: comment.likes.length });
	} else {
		comment.likes.addToSet(userId);
		await comment.save();
		return res.status(200).json({ liked: true, likesCount: comment.likes.length });
	}
});
