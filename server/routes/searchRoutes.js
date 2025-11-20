const express = require('express');
const { searchAll, searchSuggest } = require('../controllers/searchController');
const router = express.Router();

router.get('/', searchAll);
router.get('/suggest', searchSuggest);

module.exports = router;
