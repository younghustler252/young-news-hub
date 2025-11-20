const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const { sendNotification } = require('../utils/notificationUtils');

// 📌 Toggle like for a post
const togglePostLike = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post || post.status !== 'approved') {
        res.status(404);
        throw new Error('Post not found or not approved');
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
        // 🔄 Unlike
        await existingLike.deleteOne();
        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
        return res.status(200).json({
            liked: false,
            likesCount: await Like.countDocuments({ post: postId }),
        });
    } else {
        // ❤️ Like
        await Like.create({ user: userId, post: postId });
        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

        // 🔔 Notify post author (even if self-like)
        await sendNotification({
            recipient: post.author,
            sender: userId,
            type: 'like',
            content: `Someone liked your post "${post.title}".`,
            post: post._id,
            metadata: { action: 'like_post' },
        });

        return res.status(200).json({
            liked: true,
            likesCount: await Like.countDocuments({ post: postId }),
        });
    }
});

// 📌 Toggle like for a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted) {
        res.status(404);
        throw new Error('Comment not found or deleted');
    }

    const existingLike = await Like.findOne({ user: userId, comment: commentId });

    if (existingLike) {
        // 🔄 Unlike
        await existingLike.deleteOne();
        await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } });
        return res.status(200).json({
            liked: false,
            likesCount: await Like.countDocuments({ comment: commentId }),
        });
    } else {
        // ❤️ Like
        await Like.create({ user: userId, comment: commentId });
        await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });

        // 🔔 Notify comment author (even if self-like)
        await sendNotification({
            recipient: comment.author,
            sender: userId,
            type: 'like',
            content: `Someone liked your comment.`,
            comment: comment._id,
            post: comment.post,
            metadata: { action: 'like_comment' },
        });

        return res.status(200).json({
            liked: true,
            likesCount: await Like.countDocuments({ comment: commentId }),
        });
    }
});

// 📊 Get likes count for a post
const getPostLikesCount = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post || post.status !== 'approved') {
        res.status(404);
        throw new Error('Post not found or not approved');
    }

    res.status(200).json({ count: await Like.countDocuments({ post: post._id }) });
});

// 📊 Check if current user liked a post
const getPostLikeStatus = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post || post.status !== 'approved') {
        res.status(404);
        throw new Error('Post not found or not approved');
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });

    res.status(200).json({
        liked: !!existingLike,
        likesCount: await Like.countDocuments({ post: postId }),
    });
});


// 📊 Get likes count for a comment
const getCommentLikesCount = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.isDeleted) {
        res.status(404);
        throw new Error('Comment not found or deleted');
    }

    res.status(200).json({ count: await Like.countDocuments({ comment: comment._id }) });
});

module.exports = {
    togglePostLike,
    getPostLikeStatus,
    toggleCommentLike,
    getPostLikesCount,
    getCommentLikesCount,
};
