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


exports.validateCompleteProfile = [
    body('username')
        .exists()
        .withMessage('Username is required')
        .isString()
        .trim()
        .isLength({ min: 3, max: 30 })
        .matches(/^[a-z0-9_]+$/i)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('bio')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),
    body('phone')
        .optional()
        .trim()
        .matches(/^\+?[0-9]{7,15}$/)
        .withMessage('Invalid phone number format'),
    body('location')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 100 }),
    body('website')
        .optional()
        .isURL({ require_protocol: true })
        .withMessage('Website must be a valid URL with http/https'),
];