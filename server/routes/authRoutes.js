const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    verifyUser,
    resendCode,
    checkUsername,
} = require('../controllers/authController');
const {protect} = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyUser);
router.post('/resend-code', resendCode);
router.get('/check-username', checkUsername);

module.exports = router;
