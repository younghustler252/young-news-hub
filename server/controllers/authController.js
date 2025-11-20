const User = require('../models/User'); 
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const sendEmailCode = require('../utils/sendEmailCode');
const sendSmsCode = require('../utils/sendSmsCode');
const generateCode = require('../utils/generateCode')
const { saveCode, verifyCode } = require('../utils/codeStore');


// @desc    Register new user (only email, name, password)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, method = 'email' } = req.body;

    // Input validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Name, email, and password are required");
    }

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(409);
        throw new Error("User with this email already exists");
    }

    // Create user with minimal info, phone empty for now
    const user = new User({ name, email, password });
    await user.save();

    // Generate verification code for email
    const code = generateCode();

    try {
        await sendEmailCode(email, code);
        saveCode(email, code);
    } catch (error) {
        console.error("Failed to send verification code:", error.message);
        return res.status(201).json({
            message: "User registered, but failed to send verification code. Please try again.",
            userId: user._id,
            verificationPending: true
        });
    }

    res.status(201).json({
        message: `Verification code sent via email`,
        userId: user._id,
        verificationPending: true
    });
});


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        res.status(400);
        throw new Error("Email or phone and password are required");
    }

    const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    // Optional verification check (uncomment if needed)
    // if (!user.isVerified) {
    //     res.status(403);
    //     throw new Error("Account not verified. Please verify first.");
    // }

    res.status(200).json({
        status: "success",
        message: "Login successful",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        },
        token: generateToken(user._id),
    });
});




// @desc    Verify email or phone code
// @route   POST /api/auth/verify
// @access  Public
const verifyUser = asyncHandler(async (req, res) => {
    const { identifier, code, type = 'email' } = req.body; 
    // type can be 'email' or 'phone'

    if (!identifier || !code) {
        res.status(400);
        throw new Error("Identifier and code are required");
    }
    
    const query = type === 'phone' ? { phone: identifier } : { email: identifier };
    const user = await User.findOne(query);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isValid = verifyCode(identifier, code);
    if (!isValid) {
        res.status(400);
        throw new Error("Invalid or expired code");
    }

    if (type === 'email') {
        user.isVerified = true;
        user.verifiedAt = new Date();
    } else if (type === 'phone') {
        user.isPhoneVerified = true;
        user.phoneVerifiedAt = new Date();
    }

    await user.save();
  
    res.status(200).json({
        message: `${type === 'email' ? 'Email' : 'Phone'} verified successfully`,
        token: generateToken(user._id),
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isVerified: user.isVerified,
            isPhoneVerified: user.isPhoneVerified || false,
        }
    }); 
});


// @desc    Resend verification code (email or phone)
// @route   POST /api/auth/resend-code
// @access  Public
const resendCode = asyncHandler(async (req, res) => {
    const { identifier, method = 'email' } = req.body;

    if (!identifier) {
        res.status(400);
        throw new Error("Identifier is required");
    }

    const query = method === 'sms' ? { phone: identifier } : { email: identifier };
    const user = await User.findOne(query);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Check verification status for chosen method
    if (method === 'email' && user.isVerified) {
        res.status(400);
        throw new Error("Email is already verified");
    }
    if (method === 'sms' && user.isPhoneVerified) {
        res.status(400);
        throw new Error("Phone number is already verified");
    }

    const code = generateCode();

    try {
        if (method === 'sms') {
            await sendSmsCode(user.phone, code);
            saveCode(user.phone, code);
        } else {
            await sendEmailCode(user.email, code);
            saveCode(user.email, code);
        }

        res.status(200).json({
            message: `Verification code resent via ${method}`,
            userId: user._id
        });
    } catch (err) {
        console.error("Failed to resend code:", err.message);
        res.status(500);
        throw new Error("Failed to send verification code. Please try again.");
    }
});


// @desc    Check username availability
// @route   GET /api/auth/check-username
// @access  Public
const checkUsername = asyncHandler(async (req, res) => {
    const { username } = req.query;
    if (!username) {
        res.status(400);
        throw new Error("Username query param required");
    }
    const userExists = await User.findOne({ username: username.toLowerCase() });
    res.status(200).json({ available: !userExists });
});



module.exports = { 
    registerUser, 
    loginUser, 
    verifyUser, 
    resendCode, 
    checkUsername, 
};
