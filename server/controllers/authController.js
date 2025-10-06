const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const sendEmailCode = require('../utils/sendEmailCode');
const sendSmsCode = require('../utils/sendSmsCode');
const generateCode = require('../utils/generateCode')
const { saveCode, verifyCode } = require('../utils/codeStore');


// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, phone, password,  method = 'email' } = req.body;

    // Input validation
    if (!name || !email || !phone || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        res.status(409);
        throw new Error("User already exists");
    }

    // Create and save new user
    const user = new User({ name, email, phone, password });
    await user.save();

    const code = generateCode();

    try {
        if (method === 'sms') {
            await sendSmsCode(phone, code);
            saveCode(phone, code);
        } else {
            await sendEmailCode(email, code);
            saveCode(email, code);
        }
    } catch (error) {
        console.error("Failed to send verification code:", error.message);
        return res.status(201).json({
            message: "User registered, but failed to send verification code. Please try again.",
            userId: user._id,
            verificationPending: true
        });
    }
        


    // Respond with user data and token
    res.status(201).json({
        message: `Verification code sent via ${method || 'email'}`,
        userId: user._id,
    });
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { identifier, password } = req.body;

	if (!identifier || !password) {
		res.status(400);
		throw new Error("Email or phone and password are required");
	}

	// Try finding user by either email or phone
	const user = await User.findOne({
		$or: [{ email: identifier }, { phone: identifier }]
	}).select("+password");

	if (!user) {
		res.status(401);
		throw new Error("Invalid email or phone");
	}

	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		res.status(401);
		throw new Error("Invalid password");
	}
    console.log("User from DB:", user);

	res.status(200).json({
		status: "success",
		message: "Login successful",
		data: {
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
                isVerified: user.isVerified,
			},
			token: generateToken(user._id),
		},
	});
});


const verifyUser = asyncHandler(async (req, res) => {

    const { identifier, code } = req.body; 
    if (!identifier || !code) {
        res.status(400);
        throw new Error("Email or phone and code are required");
    }
    
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isValid = verifyCode(identifier, code);
    if (!isValid) {
        res.status(400);
        throw new Error("Invalid or expired code");
    }
    user.isVerified = true;
    user.verifiedAt = new Date();
    await user.save();
  
    res.status(200).json({
        message: "User verified successfully",
        token: generateToken(user._id),
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        }
    }); 

});


const resendCode = asyncHandler(async (req, res) => {
    const {identifier, method= 'email'} = req.body;

    if (!identifier) {
        res.status(400);
        throw new Error("Email or phone is required");
    }

    const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    })

    if (user.isVerified) {
        res.status(400);
        throw new Error("User is already verified");
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

module.exports = { registerUser, loginUser, verifyUser, resendCode};
