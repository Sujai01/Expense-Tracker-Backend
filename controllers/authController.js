const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // 7 days is standard for apps
};

// @desc    Register User
exports.registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({ fullName, email, password });

    res.status(201).json({
        success: true,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
        },
        token: generateToken(user._id)
    });
});

// @desc    Login User
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Assuming you have a comparePassword method in your User Model
    if (user && (await user.comparePassword(password))) {
        res.json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl
            },
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

exports.getUserInfo = asyncHandler(async (req, res) => {
    const user = await req.user; // req.user is set by the protect middleware

    if (user) {
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl
            }
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
