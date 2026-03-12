const jwt = require('jsonwebtoken');

exports.generateAccessToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

exports.generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
