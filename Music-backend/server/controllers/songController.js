const Song = require('../models/Song');
const User = require('../models/User');
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

exports.getSongs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const total = await Song.countDocuments({ isPublic: true });
  const songs = await Song.find({ isPublic: true })
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

exports.getSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id)
    .populate('artist', 'username avatar')
    .populate('album', 'title coverUrl');

  if (!song) {
    return res.status(404).json({ success: false, message: 'Song not found' });
  }

  res.json({ success: true, data: song });
});

exports.createSong = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.audio) {
    return res.status(400).json({ success: false, message: 'Audio file is required' });
  }

  const audioResult = await uploadToCloudinary(req.files.audio[0].buffer, 'video', 'songs/audio');

  let coverUrl = '';
  if (req.files.cover) {
    const coverResult = await uploadToCloudinary(req.files.cover[0].buffer, 'image', 'songs/covers');
    coverUrl = coverResult.secure_url;
  }

  const song = await Song.create({
    title: req.body.title,
    artist: req.user._id,
    album: req.body.album || null,
    genre: req.body.genre || '',
    duration: req.body.duration || 0,
    audioUrl: audioResult.secure_url,
    audioPublicId: audioResult.public_id,
    coverUrl,
    lyrics: req.body.lyrics || '',
    isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
  });

  await song.populate('artist', 'username avatar');

  res.status(201).json({ success: true, data: song });
});

exports.updateSong = asyncHandler(async (req, res) => {
  let song = await Song.findById(req.params.id);

  if (!song) {
    return res.status(404).json({ success: false, message: 'Song not found' });
  }

  if (song.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this song' });
  }

  const updateData = {};
  if (req.body.title) updateData.title = req.body.title;
  if (req.body.genre) updateData.genre = req.body.genre;
  if (req.body.duration) updateData.duration = req.body.duration;
  if (req.body.lyrics) updateData.lyrics = req.body.lyrics;
  if (req.body.isPublic !== undefined) updateData.isPublic = req.body.isPublic;
  if (req.body.album) updateData.album = req.body.album;

  if (req.files && req.files.cover) {
    if (song.coverUrl) {
      const oldPublicId = song.coverUrl.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`songs/covers/${oldPublicId}`);
      } catch (e) {}
    }
    const coverResult = await uploadToCloudinary(req.files.cover[0].buffer, 'image', 'songs/covers');
    updateData.coverUrl = coverResult.secure_url;
  }

  song = await Song.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
    .populate('artist', 'username avatar')
    .populate('album', 'title');

  res.json({ success: true, data: song });
});

exports.deleteSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    return res.status(404).json({ success: false, message: 'Song not found' });
  }

  if (song.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this song' });
  }

  if (song.audioPublicId) {
    try {
      await cloudinary.uploader.destroy(song.audioPublicId, { resource_type: 'video' });
    } catch (e) {}
  }

  if (song.album) {
    await Album.findByIdAndUpdate(song.album, { $pull: { songs: song._id } });
  }

  await User.updateMany({ likedSongs: song._id }, { $pull: { likedSongs: song._id } });

  await Song.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Song deleted successfully' });
});

exports.searchSongs = asyncHandler(async (req, res) => {
  const { q, genre, artistName } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = { isPublic: true };

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
    ];
  }

  if (genre) {
    filter.genre = { $regex: genre, $options: 'i' };
  }

  if (artistName) {
    const artists = await User.find({ username: { $regex: artistName, $options: 'i' } }).select('_id');
    filter.artist = { $in: artists.map((a) => a._id) };
  }

  const total = await Song.countDocuments(filter);
  const songs = await Song.find(filter)
    .populate('artist', 'username avatar')
    .populate('album', 'title')
    .sort({ plays: -1 })
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

exports.likeSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    return res.status(404).json({ success: false, message: 'Song not found' });
  }

  const user = await User.findById(req.user._id);
  const index = user.likedSongs.indexOf(song._id);

  if (index > -1) {
    user.likedSongs.splice(index, 1);
    song.likes = Math.max(0, song.likes - 1);
  } else {
    user.likedSongs.push(song._id);
    song.likes += 1;

    if (song.artist.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: song.artist,
        sender: req.user._id,
        type: 'like',
        song: song._id,
        message: `${req.user.username} liked your song "${song.title}"`,
      });
    }
  }

  await user.save();
  await song.save();

  res.json({
    success: true,
    data: {
      liked: index === -1,
      likes: song.likes,
    },
  });
});

exports.playSong = asyncHandler(async (req, res) => {
  const song = await Song.findByIdAndUpdate(
    req.params.id,
    { $inc: { plays: 1 } },
    { new: true }
  );

  if (!song) {
    return res.status(404).json({ success: false, message: 'Song not found' });
  }

  if (req.user) {
    const History = require('../models/History');
    await History.findOneAndUpdate(
      { user: req.user._id, song: song._id },
      { playedAt: new Date() },
      { upsert: true, new: true }
    );
  }

  res.json({ success: true, data: { plays: song.plays } });
});
