const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require('../models/User.js');
const HttpStatus = require('../utils/HttpStatus.js');
const { setErrorResponse } = require('../utils/Response.js');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization)
        return setErrorResponse(res, HttpStatus.UNAUTHORIZED, "You must be logged in");

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, (error, payload) => {
        if (error)
            return setErrorResponse(res, HttpStatus.UNAUTHORIZED, "You must be logged in");

        const { _id } = payload;
        User.findById(_id)
            .populate('userTypeId')
            .populate('collegeInfoId')
            .then(existingUser => {
                existingUser.password = "undefined"; //so that password is not exposed.
                req.user = existingUser;
                next();
            });
    });
}