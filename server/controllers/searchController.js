const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const Tag = require('../models/Tag');

/**
 * Full search with weighting, trending & tag filtering
 * GET /search?q=keyword&page=1&limit=10&userId=...
 */
const searchAll = asyncHandler(async (req, res) => {
    const { q, limit = 10, page = 1, userId } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    if (!q) return res.status(400).json({ message: 'Query is required' });

    const regex = new RegExp(q, 'i');
    let posts = [];

    // ---------------------
    // Personalized / Tag-aware posts
    // ---------------------
    const query = { status: 'approved', $or: [{ title: regex }, { content: regex }] };

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        // Get user-preferred and trending tags
        const userTagsDocs = await Tag.find({ followers: userId }).sort({ postCount: -1 }).limit(5);
        const trendingTagsDocs = await Tag.find().sort({ postCount: -1 }).limit(5);

        const preferredTags = Array.from(new Set([
            ...userTagsDocs.map(t => t.name),
            ...trendingTagsDocs.map(t => t.name)
        ]));

        // Fetch personalized posts first
        const personalizedPosts = await Post.find({
            ...query,
            tags: { $in: preferredTags }
        })
        .sort({ trendingScore: -1, createdAt: -1 })
        .limit(limitNum)
        .populate('author', 'name username profileImageUrl title');

        // Fill remaining with general posts if needed
        const remaining = limitNum - personalizedPosts.length;
        let generalPosts = [];
        if (remaining > 0) {
            generalPosts = await Post.find(query)
                .sort({ trendingScore: -1, createdAt: -1 })
                .limit(remaining)
                .populate('author', 'name username profileImageUrl title');
        }

        // Combine and remove duplicates
        posts = Array.from(
            new Map([...personalizedPosts, ...generalPosts].map(p => [p._id.toString(), p]))
        ).values();
        posts = Array.from(posts).slice(0, limitNum);
    } else {
        // Non-logged in users: regular search
        posts = await Post.find(query)
            .sort({ trendingScore: -1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('author', 'name username profileImageUrl title');
    }

    // ---------------------
    // Authors & Tags
    // ---------------------
    const authors = await User.aggregate([
        {
            $addFields: {
                score: { $add: [
                    { $cond: [{ $regexMatch: { input: "$name", regex } }, 2, 0] },
                    { $cond: [{ $regexMatch: { input: "$username", regex } }, 1, 0] }
                ]}
            }
        },
        { $match: { score: { $gt: 0 } } },
        { $sort: { score: -1 } },
        { $limit: limitNum },
        { $project: { name: 1, username: 1, profileImageUrl: 1, title: 1, score: 1 } }
    ]);

    const tags = await Tag.aggregate([
        { $match: { name: regex } },
        { $sort: { postCount: -1 } }, // trending first
        { $limit: limitNum },
        { $project: { _id: 1, name: 1, slug: 1, description: 1, postCount: 1 } }
    ]);

    const totalPosts = await Post.countDocuments(query);
    const totalAuthors = await User.countDocuments({ $or: [{ name: regex }, { username: regex }] });
    const totalTags = await Tag.countDocuments({ name: regex });

    res.status(200).json({
        page: pageNum,
        limit: limitNum,
        posts: { count: posts.length, total: totalPosts, data: posts },
        authors: { count: authors.length, total: totalAuthors, data: authors },
        tags: { count: tags.length, total: totalTags, data: tags }
    });
});

/**
 * Autocomplete / suggestions
 * GET /search/suggest?q=keyword
 */
const searchSuggest = asyncHandler(async (req, res) => {
    const { q, limit = 5 } = req.query;
    if (!q) return res.status(400).json({ message: 'Query is required' });

    const regex = new RegExp(q, 'i');
    const limitNum = parseInt(limit, 10);

    const posts = await Post.find({ status: 'approved', title: regex })
        .select('_id title')
        .limit(limitNum);

    const authors = await User.find({ $or: [{ name: regex }, { username: regex }] })
        .select('_id name username')
        .limit(limitNum);

    const tags = await Tag.find({ name: regex })
        .sort({ postCount: -1 })
        .select('_id name slug')
        .limit(limitNum);

    res.status(200).json({ posts, authors, tags });
});

module.exports = { searchAll, searchSuggest };
