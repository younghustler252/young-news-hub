const asyncHandler = require('express-async-handler');
const Tag = require('../models/Tag');

// ========================
// Create a new tag
// ========================
const createTag = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const existingTag = await Tag.findOne({ name: name.toLowerCase().trim() });
    if (existingTag) {
        res.status(400);
        throw new Error('Tag already exists');
    }

    const tag = await Tag.create({ name, description });
    res.status(201).json(tag);
});

// ========================
// Get all tags, optionally sorted by popularity
// ========================
const getAllTags = asyncHandler(async (req, res) => {
    const { sortBy } = req.query;
    let sortOption = { createdAt: -1 };
    if (sortBy === 'popularity') sortOption = { postCount: -1 };

    const tags = await Tag.find().sort(sortOption);
    res.json(tags);
});

// ========================
// Get a single tag by slug
// ========================
const getTagBySlug = asyncHandler(async (req, res) => {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) {
    return res.status(200).json({
      success: true,
      message: 'No tag found',
      tag: null,
    });
  }
    res.json(tag);
});

// ========================
// Update a tag
// ========================
const updateTag = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
        res.status(404);
        throw new Error('Tag not found');
    }

    if (name) tag.name = name;
    if (description !== undefined) tag.description = description;

    await tag.save(); // slug auto-updates if name changes
    res.json(tag);
});

// ========================
// Delete a tag
// ========================
const deleteTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
        res.status(404);
        throw new Error('Tag not found');
    }
    res.json({ message: 'Tag deleted successfully' });
});

// ========================
// Get popular/trending tags
// ========================
const getPopularTags = asyncHandler(async (req, res) => {
     console.log("🔥 GET /api/tags/popular hit");

  const limit = parseInt(req.query.limit) || 10;

  const tags = await Tag.find({ postCount: { $gt: 0 } })
    .sort({ postCount: -1 })
    .limit(limit);

  console.log("📊 Found tags:", tags);
  res.json(tags);
});

// ========================
// Increment post count (helper function)
// ========================
const incrementPostCount = asyncHandler(async (tagId) => {
    const tag = await Tag.incrementPostCount(tagId);
    return tag;
});

// ========================
// Export all controllers
// ========================
module.exports = {
    createTag,
    getAllTags,
    getTagBySlug,
    updateTag,
    deleteTag,
    getPopularTags,
    incrementPostCount
};
