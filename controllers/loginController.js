const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const HttpStatus = require('../utils/HttpStatus.js');
const { validateLoginForm } = require('../utils/ValidationUtil.js');
const { setSuccessResponse, setErrorResponse } = require('../utils/Response.js');
const { generateAccessToken, generateRefreshToken } = require('./authentication.js');

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
    const { username, password } = req.body;

    const errors = await validateLoginForm(username, password);

    if (errors.length > 0)
        return setErrorResponse(res, HttpStatus.BAD_REQUEST, errors);

    const user = await User.findOne({
        $or: [
            { email: username },
            { mobileNumber: username },
            { username: username }
        ]
    }).populate('userTypeId');

    if (user) {

        if (user.status == "BLOCKED") {
            return setErrorResponse(res, HttpStatus.BAD_REQUEST, "This account is no longer active. We sent you an email explaining what happened.");
        } else if (user.status == "DELETED") {
            return setErrorResponse(res, HttpStatus.BAD_REQUEST, "Your account has been deleted.");
        }

        let passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) { //if passwords match

            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            user.password = undefined;

            return setSuccessResponse(res, "User logged in successfully", { accessToken, refreshToken, user });
        } else {
            return setErrorResponse(res, HttpStatus.BAD_REQUEST, "Invalid login credentials.");
        }
    }

    console.log("User not found");
    return setErrorResponse(res, HttpStatus.BAD_REQUEST, "Invalid login credentials.");
}

const verifyRefreshToken = (req, res) => {
    const { refreshToken } = req.body;

    // Verify the refresh token
    jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            // If the refresh token is invalid or expired, send an error response
            return setErrorResponse(res, HttpStatus.UNAUTHORIZED, "Invalid refresh token.");
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken(decoded._id);

        // Send the new access token in the response
        return setSuccessResponse(res, "New Access token generated", { newAccessToken });
    });
}

module.exports = { login, verifyRefreshToken };