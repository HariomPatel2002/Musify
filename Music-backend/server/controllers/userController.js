const User = require('../models/User');
const Song = require('../models/Song');
const Album = require('../models/Album');
const Notification = require('../models/Notification');
const cloudinary = require('../config/cloudinary');
const asyncHandler = require('../utils/asyncHandler');

const uploadToCloudinary = (fileBuffer, resourceType, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -email');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const songCount = await Song.countDocuments({ artist: user._id, isPublic: true });
  const albumCount = await Album.countDocuments({ artist: user._id, isPublic: true });

  res.json({
    success: true,
    data: {
      ...user.toObject(),
      songCount,
      albumCount,
      followerCount: user.followers.length,
      followingCount: user.following.length,
    },
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const updateData = {};
  if (req.body.username) updateData.username = req.body.username;
  if (req.body.bio !== undefined) updateData.bio = req.body.bio;

  if (req.files && req.files.avatar) {
    const avatarResult = await uploadToCloudinary(req.files.avatar[0].buffer, 'image', 'users/avatars');
    updateData.avatar = avatarResult.secure_url;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  res.json({ success: true, data: user });
});

exports.followUser = asyncHandler(async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (targetUser._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
  }

  const currentUser = await User.findById(req.user._id);
  const isFollowing = currentUser.following.includes(targetUser._id);

  if (isFollowing) {
    currentUser.following.pull(targetUser._id);
    targetUser.followers.pull(currentUser._id);
  } else {
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await Notification.create({
      recipient: targetUser._id,
      sender: req.user._id,
      type: 'follow',
      message: `${req.user.username} started following you`,
    });
  }

  await currentUser.save();
  await targetUser.save();

  res.json({
    success: true,
    data: {
      following: !isFollowing,
      followerCount: targetUser.followers.length,
    },
  });
});

exports.getUserSongs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const total = await Song.countDocuments({ artist: req.params.id, isPublic: true });
  const songs = await Song.find({ artist: req.params.id, isPublic: true })
    .populate('artist', 'username avatar')
    .populate('album', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: songs,
    pagination: {
      count: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    },
  });
});

exports.getUserAlbums = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const total = await Album.countDocuments({ artist: req.params.id, isPublic: true });
  const albums = await Album.find({ artist: req.params.id, isPublic: true })
    .populate('artist', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: albums,
    pagination: {
      count: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    },
  });
});

exports.getFeed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const followingIds = user.following;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const songs = await Song.find({ artist: { $in: followingIds }, isPublic: true })
    .populate('artist', 'username avatar')
    .lean();

  const albums = await Album.find({ artist: { $in: followingIds }, isPublic: true })
    .populate('artist', 'username avatar')
    .lean();

  const feed = [
    ...songs.map((s) => ({ type: 'song', item: s, user: s.artist, createdAt: s.createdAt })),
    ...albums.map((a) => ({ type: 'album', item: a, user: a.artist, createdAt: a.createdAt })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(skip, skip + limit);

  const total = songs.length + albums.length;

  res.json({
    success: true,
    data: feed,
    pagination: { count: total, totalPages: Math.ceil(total / limit), currentPage: page, limit },
  });
});
