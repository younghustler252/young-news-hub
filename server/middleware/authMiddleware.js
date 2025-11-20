const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Middleware to protect routes
// authMiddleware.js
const protect = asyncHandler(async (req, res, next) => {
  console.log('🟢 protect middleware hit');
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        console.log('❌ User not found');
        return res.status(401).json({ message: 'User not found, not authorized' });
      }

      if (req.user.isBanned) {
        console.log('❌ User is banned');
        return res.status(403).json({ message: 'Your account has been banned.' });
      }

      console.log('✅ protect middleware passed', req.user.email);
      next();
    } catch (error) {
      console.error('❌ Token verification failed', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});


const optionalAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader && authHeader.startsWith('Bearer')) {
		const token = authHeader.split(' ')[1];

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findById(decoded.userId).select('-password');

			if (user && !user.isBanned) {
				req.user = user;
			}
		} catch (err) {
			// Ignore invalid token errors
			req.user = null;
		}
	}

	next();
};


module.exports = { protect, optionalAuth };
