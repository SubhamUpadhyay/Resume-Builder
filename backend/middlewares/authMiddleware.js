const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const protect = async(req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, token not found" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Token invalid or expired" });
        }
        
        // Attach user to request
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        
        next();
    } catch(err) {
        res.status(401).json({ message: "Token verification failed", error: err.message });
    }
}

module.exports = protect;