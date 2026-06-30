const User = require('../models/User');
const Song = require('../models/Song');
const Album = require('../models/Album');
const asyncHandler = require('../utils/asyncHandler');

exports.getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalSongs = await Song.countDocuments();
  const totalAlbums = await Album.countDocuments();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
  const newSongsToday = await Song.countDocuments({ createdAt: { $gte: today } });

  const totalPlays = await Song.aggregate([
    { $group: { _id: null, total: { $sum: '$plays' } } },
  ]);

  const topSongs = await Song.find()
    .populate('artist', 'username avatar')
    .sort({ plays: -1 })
    .limit(5)
    .select('title plays likes coverUrl artist');

  const topArtists = await Song.aggregate([
    { $group: { _id: '$artist', totalPlays: { $sum: '$plays' }, songCount: { $sum: 1 } } },
    { $sort: { totalPlays: -1 } },
    { $limit: 5 },
  ]);

  const populatedArtists = await User.populate(topArtists, { path: '_id', select: 'username avatar' });

  res.json({
    success: true,
    data: {
      totalUsers,
      totalSongs,
      totalAlbums,
      totalPlays: totalPlays[0]?.total || 0,
      newUsersToday,
      newSongsToday,
      topSongs,
      topArtists: populatedArtists,
    },
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { username: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

  res.json({
    success: true,
    data: users,
    pagination: { count: total, totalPages: Math.ceil(total / limit), currentPage: page, limit },
  });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  await Song.deleteMany({ artist: user._id });
  await Album.deleteMany({ artist: user._id });
  await User.findByIdAndDelete(user._id);

  res.json({ success: true, message: 'User deleted' });
});

exports.getAdminSongs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const total = await Song.countDocuments();
  const songs = await Song.find()
    .populate('artist', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: songs,
    pagination: { count: total, totalPages: Math.ceil(total / limit), currentPage: page, limit },
  });
});

exports.deleteSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
  await Song.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Song deleted' });
});
