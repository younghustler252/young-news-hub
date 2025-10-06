const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyUser, resendCode } = require('../controllers/AuthController');

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Verify account
router.get('/verify', verifyUser); 

router.get('/resend-code', resendCode);

module.exports = router;
