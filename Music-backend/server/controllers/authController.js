const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../utils/asyncHandler');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id, jti: crypto.randomBytes(16).toString('hex') }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const sendTokenResponse = async (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  res.status(statusCode).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      accessToken,
      refreshToken,
    },
  });
};

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
  }

  const user = await User.create({ username, email, password });

  const verifyToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  user.emailVerifyToken = hashedToken;
  user.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  try {
    const verifyUrl = `http://localhost:3000/verify-email/${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your Musify email',
      html: `<p>Hi ${user.username},</p><p>Welcome to Musify! Please verify your email:</p><p><a href="${verifyUrl}">Verify Email</a></p><p>Link expires in 24 hours.</p>`,
    });
  } catch (e) {}

  await sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  await sendTokenResponse(user, 200, res);
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token is required' });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  if (user.refreshToken !== refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token not found or revoked' });
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

  res.json({
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  });
});

exports.logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.json({ success: true, message: 'Logged out successfully' });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('likedSongs', 'title coverUrl artist')
    .populate('playlists', 'name coverUrl');

  res.json({ success: true, data: user });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'No user with that email' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your Musify password',
      html: `<p>Hi ${user.username},</p><p>You requested a password reset.</p><p><a href="${resetUrl}">Reset Password</a></p><p>Link expires in 10 minutes.</p><p>If you didn't request this, ignore this email.</p>`,
    });
    res.json({ success: true, message: 'Reset email sent' });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ success: false, message: 'Email could not be sent' });
  }
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken');

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  await sendTokenResponse(user, 200, res);
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    emailVerifyToken: hashedToken,
    emailVerifyExpires: { $gt: Date.now() },
  }).select('+emailVerifyToken');

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.json({ success: true, message: 'Email verified successfully' });
});

exports.resendVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+emailVerifyToken');
  if (user.isVerified) {
    return res.status(400).json({ success: false, message: 'Email already verified' });
  }

  const verifyToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  user.emailVerifyToken = hashedToken;
  user.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  try {
    const verifyUrl = `http://localhost:3000/verify-email/${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your Musify email',
      html: `<p>Hi ${user.username},</p><p>Please verify your email:</p><p><a href="${verifyUrl}">Verify Email</a></p><p>Link expires in 24 hours.</p>`,
    });
    res.json({ success: true, message: 'Verification email sent' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Email could not be sent' });
  }
});
