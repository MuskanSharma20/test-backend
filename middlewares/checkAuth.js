const jwt = require("jsonwebtoken");
const User = require("../models/User.model"); 

const secretKey = process.env.ACCESS_TOKEN_SECRET;

const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided!" });
        }

        const decoded = jwt.verify(token, secretKey);

        const user = await User.findById(decoded.userId); 
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        req.user = user; 
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token has expired. Please log in again.",
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid Token !!",
            });
        } else {
            return res.status(500).json({
                message: "Authentication failed!",
            });
        }
    }
};

module.exports = checkAuth;
