const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_TOKEN_EXPIRY = '15m';
const JWT_REFRESH_TOKEN_EXPIRY = '1d';

const generateAccessToken = (userId) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRY });
}

const generateRefreshToken = (userId) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRY });
}

const verifyAccessToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return setErrorResponse(res, HttpStatus.UNAUTHORIZED, "You must be logged in");

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, JWT_SECRET, (error, payload) => {
    if (error) {
      return setErrorResponse(res, HttpStatus.UNAUTHORIZED, "You must be logged in");
    }

    const { _id } = payload;
    User.findById(_id).then(existingUser => {
      existingUser.password = undefined; //so that password is not exposed.
      req.user = existingUser;
      next();
    });
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken
};
