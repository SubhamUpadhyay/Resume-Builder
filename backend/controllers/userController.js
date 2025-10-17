const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res
                .status(400)
                .json({ message: "User Already Exist. Try another Email" });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Password must be at least 8 characters long",
                });
        }

        // Hashing password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        
        const token = generateToken(user._id);
        
        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax'
        });
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const find_user = await User.findOne({ email });
        if (!find_user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, find_user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        
        const token = generateToken(find_user._id);
        
        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax'
        });
        
        res.status(200).json({
            _id: find_user._id,
            name: find_user.name,
            email: find_user.email,
            token: token
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};

// GET USER function - Uses req.user from protect middleware
const getUserProfile = async(req, res) => {
    try {
        // req.user is already attached by the protect middleware
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch(err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
}

module.exports = { registerUser, loginUser, getUserProfile };