const Playlist = require('../models/Playlist');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.getUserPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ isPublic: true })
    .populate('owner', 'username avatar')
    .populate({
      path: 'songs',
      select: 'title coverUrl artist duration',
      populate: { path: 'artist', select: 'username avatar' },
    })
    .sort({ updatedAt: -1 });

  res.json({ success: true, data: playlists });
});

exports.getMyPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id })
    .populate('owner', 'username avatar')
    .populate({
      path: 'songs',
      select: 'title coverUrl artist duration',
      populate: { path: 'artist', select: 'username avatar' },
    })
    .sort({ updatedAt: -1 });

  res.json({ success: true, data: playlists });
});

exports.getPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate('owner', 'username avatar')
    .populate({
      path: 'songs',
      populate: { path: 'artist', select: 'username avatar' },
    });

  if (!playlist) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }

  if (!playlist.isPublic && playlist.owner._id.toString() !== req.user?._id?.toString()) {
    return res.status(403).json({ success: false, message: 'This playlist is private' });
  }

  res.json({ success: true, data: playlist });
});

exports.createPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.create({
    name: req.body.name,
    description: req.body.description || '',
    owner: req.user._id,
    isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
  });

  await User.findByIdAndUpdate(req.user._id, { $push: { playlists: playlist._id } });

  await playlist.populate('owner', 'username avatar');

  res.status(201).json({ success: true, data: playlist });
});

exports.updatePlaylist = asyncHandler(async (req, res) => {
  let playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this playlist' });
  }

  const updateData = {};
  if (req.body.name) updateData.name = req.body.name;
  if (req.body.description !== undefined) updateData.description = req.body.description;
  if (req.body.isPublic !== undefined) updateData.isPublic = req.body.isPublic;

  playlist = await Playlist.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
    .populate('owner', 'username avatar');

  res.json({ success: true, data: playlist });
});

exports.deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }

  if (playlist.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this playlist' });
  }

  await User.findByIdAndUpdate(playlist.owner, { $pull: { playlists: playlist._id } });
  await Playlist.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Playlist deleted successfully' });
});

exports.addSongToPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (playlist.songs.includes(req.body.songId)) {
    return res.status(400).json({ success: false, message: 'Song already in playlist' });
  }

  playlist.songs.push(req.body.songId);
  await playlist.save();

  await playlist.populate({
    path: 'songs',
    populate: { path: 'artist', select: 'username avatar' },
  });

  res.json({ success: true, data: playlist });
});

exports.removeSongFromPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const songIndex = playlist.songs.indexOf(req.params.songId);
  if (songIndex === -1) {
    return res.status(404).json({ success: false, message: 'Song not in this playlist' });
  }

  playlist.songs.splice(songIndex, 1);
  await playlist.save();

  await playlist.populate({
    path: 'songs',
    populate: { path: 'artist', select: 'username avatar' },
  });

  res.json({ success: true, data: playlist });
});
