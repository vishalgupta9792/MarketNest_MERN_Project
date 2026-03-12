const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @route   POST /api/auth/signup
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, 'All fields are required.');
  }
  if (!['brand', 'customer'].includes(role)) {
    throw new ApiError(400, 'Role must be brand or customer.');
  }

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered.');

  const user = await User.create({ name, email, password, role });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

  res.status(201).json({
    success: true,
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required.');

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) throw new ApiError(401, 'Invalid email or password.');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password.');

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

  res.json({
    success: true,
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @route   POST /api/auth/refresh
exports.refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, 'No refresh token.');

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== token) {
    throw new ApiError(403, 'Invalid refresh token.');
  }

  const accessToken = generateAccessToken(user._id, user.role);
  res.json({ success: true, accessToken });
});

// @route   POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const user = await User.findOne({ refreshToken: token }).select('+refreshToken');
    if (user) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }
  }
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// @route   GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found.');
  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});
