// middleware/resolveUserByUsername.js
const User = require('../models/User');

const resolveUserByUsername = async (req, res, next) => {
    const { username } = req.params;
    if (!username) return next();
    const user = await User.findOne({ username }).select('_id username name');
    console.log("Looking up user:", username);
    if (!user) {
        res.status(404);
        return next(new Error('User not found'));
    }

    // Attach resolved user id to the request object
    req.resolvedUser = user;
    next();
};

module.exports = resolveUserByUsername;
