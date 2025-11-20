const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const Tag = require('../models/Tag'); // 🔄 Using new Tag model
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');
const Like = require('../models/Like')

/*-------------------------------------------------------
🟢 Create a new post (draft/pending)
@route   POST /api/posts
@access  Private
-------------------------------------------------------*/
const createPost = asyncHandler(async (req, res) => {
    const { title, content, tags = [], coverImageUrl } = req.body;

    // 🧹 Normalize tags: remove "#" + lowercase + trim
    const normalizedTags = (Array.isArray(tags) ? tags : tags.split(','))
        .map(tag => {
            if (typeof tag === 'string') return tag.replace(/^#/, '').trim().toLowerCase();
            if (tag?.name) return tag.name.replace(/^#/, '').trim().toLowerCase();
            return null;
        })
        .filter(tag => tag?.length > 0);

    // 🏷️ Ensure tags exist or create new ones
    const processedTags = [];
    for (const tagName of normalizedTags) {
        let tag = await Tag.findOne({ name: tagName });

        if (tag) {
            // Increment post count for existing tag
            await Tag.findByIdAndUpdate(tag._id, { $inc: { postCount: 1 } });
        } else {
            // Create a new tag
            tag = await Tag.create({
                name: tagName,
                postCount: 1,
            });
        }

        processedTags.push(tag._id); // store tag IDs for the post
    }

    // 📝 Create the new post
    const newPost = new Post({
        title,
        content,
        tags: processedTags,
        coverImageUrl: coverImageUrl || '',
        author: req.user._id,
        status: 'pending', // still requires approval
    });

    const savedPost = await newPost.save();

    // Populate tags and author for immediate frontend use
    const populatedPost = await Post.findById(savedPost._id)
        .populate('tags', 'name slug postCount')
        .populate('author', 'username _id');

    // 👑 Notify all admins about the new pending post
    const admins = await User.find({ role: 'admin' }, '_id');
    await Promise.all(
        admins.map(admin =>
            Notification.createNotification({
                recipient: admin._id,
                sender: req.user._id,
                type: 'admin',
                content: `${req.user.username} submitted a new post for review.`,
                post: savedPost._id,
            })
        )
    );

    res.status(201).json({
        message: 'Post created successfully and sent for review.',
        post: populatedPost,
    });
});



/*-------------------------------------------------------
🟢 Get all approved posts (with optional filters + personalization)
@route   GET /api/posts
@access  Public
-------------------------------------------------------*/

const getAllApprovedPosts = asyncHandler(async (req, res) => {
    const { search, tags, author, sort = 'desc', sortBy = 'new', page = 1, limit = 10, userId } = req.query;
    const query = { status: 'approved' };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
        ];
    }

    if (tags) {
        const tagNames = tags.split(',').map(tag => tag.trim().toLowerCase());
        const tagDocs = await Tag.find({ name: { $in: tagNames } });
        const tagIds = tagDocs.map(tag => tag._id);
        if (tagIds.length > 0) query.tags = { $in: tagIds };
        else return res.status(200).json({ page: parseInt(page), limit: parseInt(limit), totalPages: 0, totalPosts: 0, count: 0, posts: [] });
    }

    if (author && mongoose.Types.ObjectId.isValid(author)) query.author = author;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let sortOption = {};
    switch (sortBy) {
        case 'trending': sortOption = { trendingScore: -1, createdAt: -1 }; break;
        case 'popular': sortOption = { likesCount: -1, commentsCount: -1 }; break;
        default: sortOption = { createdAt: sort === 'asc' ? 1 : -1 };
    }

    let posts = [];
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        const userTagsDocs = await Tag.find({ followers: userId }).sort({ postCount: -1 }).limit(5);
        const trendingTagsDocs = await Tag.find().sort({ postCount: -1 }).limit(5);
        const preferredTags = Array.from(new Set([...userTagsDocs.map(t => t._id), ...trendingTagsDocs.map(t => t._id)]));

        const personalizedPosts = await Post.find({ ...query, tags: { $in: preferredTags } })
            .sort(sortOption)
            .limit(limitNum)
            .populate('author', 'name username profileImageUrl title');

        const remaining = limitNum - personalizedPosts.length;
        let generalPosts = [];
        if (remaining > 0) {
            generalPosts = await Post.find(query)
                .sort(sortOption)
                .limit(remaining)
                .populate('author', 'name username profileImageUrl title');
        }

        const allPosts = [...personalizedPosts, ...generalPosts];
        const uniquePosts = Array.from(new Map(allPosts.map(p => [p._id.toString(), p])).values());
        posts = uniquePosts.slice(0, limitNum);
    } else {
        posts = await Post.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .populate('author', 'name username profileImageUrl title');
    }

    // --- Add likes info for each post ---
    const postIds = posts.map(p => p._id);
    const likes = await Like.find({ post: { $in: postIds } });
    const likesMap = {};
    likes.forEach(like => {
        likesMap[like.post.toString()] = likesMap[like.post.toString()] || [];
        likesMap[like.post.toString()].push(like.user.toString());
    });

    const userIdStr = req.user?._id?.toString();
    const postsWithLikes = posts.map(post => {
        const likedBy = likesMap[post._id.toString()] || [];
        return {
            ...post.toObject(),
            likesCount: likedBy.length,
            likedByCurrentUser: userIdStr ? likedBy.includes(userIdStr) : false
        };
    });

    const total = await Post.countDocuments(query);
    res.status(200).json({
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        totalPosts: total,
        count: postsWithLikes.length,
        posts: postsWithLikes
    });
});





/*-------------------------------------------------------
🟢 Get posts by username
@route   GET /api/users/:username/posts
@access  Public
-------------------------------------------------------*/
const getPostsByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const filter = { author: user._id, status: 'approved' };
    const totalPosts = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name username profileImageUrl');

    // Likes info
    const postIds = posts.map(p => p._id);
    const likes = await Like.find({ post: { $in: postIds } });
    const likesMap = {};
    likes.forEach(like => {
        likesMap[like.post.toString()] = likesMap[like.post.toString()] || [];
        likesMap[like.post.toString()].push(like.user.toString());
    });

    const userIdStr = req.user?._id?.toString();
    const postsWithLikes = posts.map(post => {
        const likedBy = likesMap[post._id.toString()] || [];
        return {
            ...post.toObject(),
            likesCount: likedBy.length,
            likedByCurrentUser: userIdStr ? likedBy.includes(userIdStr) : false
        };
    });

    res.status(200).json({
        page,
        limit,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        posts: postsWithLikes,
    });
});


/*-------------------------------------------------------
🟢 Get my posts
@route   GET /api/posts/me
@access  Private
-------------------------------------------------------*/
const getMyPosts = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { author: userId };
    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name username profileImageUrl');

    // Likes info
    const postIds = posts.map(p => p._id);
    const likes = await Like.find({ post: { $in: postIds } });
    const likesMap = {};
    likes.forEach(like => {
        likesMap[like.post.toString()] = likesMap[like.post.toString()] || [];
        likesMap[like.post.toString()].push(like.user.toString());
    });

    const userIdStr = userId.toString();
    const postsWithLikes = posts.map(post => {
        const likedBy = likesMap[post._id.toString()] || [];
        return {
            ...post.toObject(),
            likesCount: likedBy.length,
            likedByCurrentUser: likedBy.includes(userIdStr)
        };
    });

    res.status(200).json({
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        posts: postsWithLikes,
    });
});


/*-------------------------------------------------------
🟢 Get single post
@route   GET /api/posts/:id
@access  Public / Private
-------------------------------------------------------*/
const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'name username profileImageUrl');

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (post.status !== 'approved' &&
        post.author._id.toString() !== req.user?._id.toString() &&
        req.user?.role !== 'admin') {
        res.status(403);
        throw new Error('You are not authorized to view this post');
    }

    // Likes info
    const likes = await Like.find({ post: post._id });
    const likedByCurrentUser = req.user ? likes.some(like => like.user.toString() === req.user._id.toString()) : false;

    res.status(200).json({
        ...post.toObject(),
        likesCount: likes.length,
        likedByCurrentUser
    });
});

/*-------------------------------------------------------
🟢 Approve post (admin)
@route   PUT /api/admin/posts/:id/approve
@access  Admin
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

    // Delete post
    await post.deleteOne();

    // Delete associated likes
    await Like.deleteMany({ post: post._id });

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


module.exports = {
    createPost,
    getAllApprovedPosts,
    getPostById,
    approvePost,
    rejectPost,
    deletePost,
    getPostsByUsername,
    getMyPosts,
};
