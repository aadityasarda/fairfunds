const jwt = require("jsonwebtoken");

const generateToken = (userID) => {
    return jwt.sign({id:userID}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

module.exports = generateToken;
