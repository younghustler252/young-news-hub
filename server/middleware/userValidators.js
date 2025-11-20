const { body } = require('express-validator');

exports.validateUserProfileUpdate = [
    body('name').optional().isString().trim().isLength({ max: 50 }),
    body('bio').optional().isString().trim().isLength({ max: 200 }),
    body('location').optional().isString().trim().isLength({ max: 100 }),
    body('website').optional().isURL().withMessage('Website must be a valid URL'),
    body('socialLinks').optional().isObject(),
];

exports.validateBanAction = [
    body('action')
        .exists()
        .isIn(['ban', 'unban'])
        .withMessage('Action must be "ban" or "unban"'),
    body('reason').optional().isString().trim(),
];
