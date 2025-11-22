const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const sendEmailCode = require('../utils/sendEmailCode');
const sendSmsCode = require('../utils/sendSmsCode');
const generateCode = require('../utils/generateCode');
const { saveCode, verifyCode } = require('../utils/codeStore');
const rateLimit = require('express-rate-limit');

// ======================= RATE LIMITERS =========================
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // max 5 registrations per IP per hour
    message: "Too many accounts created from this IP, please try again later."
});

const resendLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // max 5 resends per identifier per hour
    keyGenerator: (req) => req.body.identifier || '', // track by identifier
    message: "Too many resend requests, please try again later."
});

// ======================= HELPER =========================
const normalizeIdentifier = (identifier, method = 'email') => {
    if (!identifier) return '';
    return method === 'email' ? identifier.trim().toLowerCase() : identifier.trim();
};

// ======================= REGISTER USER =========================
const registerUser = asyncHandler(async (req, res) => {
    let { name, email, password } = req.body;

    name = name?.trim();
    email = normalizeIdentifier(email, 'email');

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Name, email, and password are required");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be at least 6 characters");
    }

    if (await User.findOne({ email })) {
        res.status(409);
        throw new Error("User with this email already exists");
    }

    const user = new User({ name, email, password });
    await user.save();

    const code = generateCode();

    try {
        await sendEmailCode(email, code);
        await saveCode(email, code);
    } catch (err) {
        console.error("Failed to send verification code:", err);
        return res.status(201).json({
            message: "User registered, but verification code failed. Try resending.",
            userId: user._id,
            verificationPending: true
        });
    }

    res.status(201).json({
        message: "Verification code sent via email",
        userId: user._id,
        verificationPending: true
    });
});

// ======================= LOGIN USER =========================
const loginUser = asyncHandler(async (req, res) => {
    let { identifier, password } = req.body;
    identifier = identifier?.trim();

    if (!identifier || !password) {
        res.status(400);
        throw new Error("Email, username, or phone and password are required");
    }

    const user = await User.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { username: identifier.toLowerCase() },
            { phone: identifier }
        ]
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    if (!user.isEmailVerified) {
        res.status(403);
        throw new Error("Account not verified. Please verify your email or phone.");
    }

    res.status(200).json({
        status: "success",
        message: "Login successful",
        user: {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified || false
        },
        token: generateToken(user._id)
    });
});

// ======================= VERIFY USER =========================
const verifyUser = asyncHandler(async (req, res) => {
    const { identifier, code, type = 'email' } = req.body;
    const normalizedId = normalizeIdentifier(identifier, type);

    if (!normalizedId || !code) {
        res.status(400);
        throw new Error("Identifier and code are required");
    }

    const query = type === 'phone' ? { phone: normalizedId } : { email: normalizedId };
    const user = await User.findOne(query);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isValid = verifyCode(normalizedId, code);
    if (!isValid) {
        res.status(400);
        throw new Error("Invalid or expired code");
    }

    if (type === 'email') {
        user.isEmailVerified = true;
        user.verifiedAt = new Date();
    } else {
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
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified || false
        }
    });
});

// ======================= RESEND VERIFICATION CODE =========================
const resendCode = asyncHandler(async (req, res) => {
    const { identifier, method = 'email' } = req.body;
    const normalizedId = normalizeIdentifier(identifier, method);

    if (!normalizedId) {
        res.status(400);
        throw new Error("Identifier is required");
    }

    const query = method === 'sms' ? { phone: normalizedId } : { email: normalizedId };
    const user = await User.findOne(query);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if ((method === 'email' && user.isEmailVerified) || 
        (method === 'sms' && user.isPhoneVerified)) {
        res.status(400);
        throw new Error(`${method === 'email' ? 'Email' : 'Phone'} is already verified`);
    }

    const code = generateCode();

    try {
        if (method === 'sms') {
            await sendSmsCode(user.phone, code);
            await saveCode(user.phone, code);
        } else {
            await sendEmailCode(user.email, code);
            await saveCode(user.email, code);
        }

        res.status(200).json({
            message: `Verification code resent via ${method}`,
            userId: user._id
        });
    } catch (err) {
        console.error("Failed to resend code:", err);
        res.status(500);
        throw new Error("Failed to send verification code. Please try again.");
    }
});

// ======================= CHECK USERNAME =========================
const checkUsername = asyncHandler(async (req, res) => {
    const username = req.query.username?.trim().toLowerCase();
    if (!username) {
        res.status(400);
        throw new Error("Username query param required");
    }
    const userExists = await User.findOne({ username });
    res.status(200).json({ available: !userExists });
});

module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    resendCode,
    checkUsername,
    registerLimiter,
    resendLimiter
};
