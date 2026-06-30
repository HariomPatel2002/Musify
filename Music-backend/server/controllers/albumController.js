const Album = require('../models/Album');
const Song = require('../models/Song');
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

exports.getAlbums = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const total = await Album.countDocuments({ isPublic: true });
  const albums = await Album.find({ isPublic: true })
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

exports.getAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id)
    .populate('artist', 'username avatar')
    .populate({
      path: 'songs',
      populate: { path: 'artist', select: 'username avatar' },
    });

  if (!album) {
    return res.status(404).json({ success: false, message: 'Album not found' });
  }

  res.json({ success: true, data: album });
});

exports.createAlbum = asyncHandler(async (req, res) => {
  let coverUrl = '';
  if (req.files && req.files.cover) {
    const coverResult = await uploadToCloudinary(req.files.cover[0].buffer, 'image', 'albums/covers');
    coverUrl = coverResult.secure_url;
  }

  const album = await Album.create({
    title: req.body.title,
    artist: req.user._id,
    coverUrl,
    releaseYear: req.body.releaseYear,
    genre: req.body.genre || '',
    isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
  });

  await album.populate('artist', 'username avatar');

  res.status(201).json({ success: true, data: album });
});

exports.updateAlbum = asyncHandler(async (req, res) => {
  let album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json({ success: false, message: 'Album not found' });
  }

  if (album.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this album' });
  }

  const updateData = {};
  if (req.body.title) updateData.title = req.body.title;
  if (req.body.releaseYear) updateData.releaseYear = req.body.releaseYear;
  if (req.body.genre) updateData.genre = req.body.genre;
  if (req.body.isPublic !== undefined) updateData.isPublic = req.body.isPublic;

  if (req.files && req.files.cover) {
    if (album.coverUrl) {
      const oldPublicId = album.coverUrl.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`albums/covers/${oldPublicId}`);
      } catch (e) {}
    }
    const coverResult = await uploadToCloudinary(req.files.cover[0].buffer, 'image', 'albums/covers');
    updateData.coverUrl = coverResult.secure_url;
  }

  album = await Album.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
    .populate('artist', 'username avatar');

  res.json({ success: true, data: album });
});

exports.deleteAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json({ success: false, message: 'Album not found' });
  }

  if (album.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this album' });
  }

  await Song.updateMany({ album: album._id }, { album: null });
  await Album.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Album deleted successfully' });
});

exports.addSongToAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) {
    return res.status(404).json({ success: false, message: 'Album not found' });
  }

  if (album.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const song = await Song.findById(req.body.songId);
  if (!song) {
    return res.status(404).json({ success: false, message: 'Song not found' });
  }

  if (song.artist.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Can only add your own songs to the album' });
  }

  if (album.songs.includes(song._id)) {
    return res.status(400).json({ success: false, message: 'Song already in album' });
  }

  album.songs.push(song._id);
  await album.save();

  song.album = album._id;
  await song.save();

  await album.populate('songs');

  res.json({ success: true, data: album });
});

exports.removeSongFromAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) {
    return res.status(404).json({ success: false, message: 'Album not found' });
  }

  if (album.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const songIndex = album.songs.indexOf(req.params.songId);
  if (songIndex === -1) {
    return res.status(404).json({ success: false, message: 'Song not in this album' });
  }

  album.songs.splice(songIndex, 1);
  await album.save();

  await Song.findByIdAndUpdate(req.params.songId, { album: null });

  await album.populate('songs');

  res.json({ success: true, data: album });
});
