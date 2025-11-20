const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

// ========================
// Tag Routes
// ========================

// Create a new tag
// POST /api/tags
router.post('/', tagController.createTag);

// Get all tags (optional: ?sortBy=popularity)
// GET /api/tags
router.get('/', tagController.getAllTags);

// Get trending/popular tags
// GET /api/tags/popular?limit=10
router.get('/popular', tagController.getPopularTags);

// Get a single tag by slug
// GET /api/tags/:slug
router.get('/:slug', tagController.getTagBySlug);

// Update a tag by ID
// PUT /api/tags/:id
router.put('/:id', tagController.updateTag);

// Delete a tag by ID
// DELETE /api/tags/:id
router.delete('/:id', tagController.deleteTag);

module.exports = router;
