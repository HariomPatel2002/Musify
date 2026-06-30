const Song = require('../models/Song');
const Album = require('../models/Album');
const asyncHandler = require('../utils/asyncHandler');

exports.getCharts = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const trending = await Song.find({ isPublic: true, createdAt: { $gte: sevenDaysAgo } })
    .populate('artist', 'username avatar')
    .sort({ plays: -1 })
    .limit(20);

  const topLiked = await Song.find({ isPublic: true })
    .populate('artist', 'username avatar')
    .sort({ likes: -1 })
    .limit(20);

  const newReleases = await Song.find({ isPublic: true })
    .populate('artist', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(20);

  const topAlbums = await Album.find({ isPublic: true })
    .populate('artist', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    success: true,
    data: { trending, topLiked, newReleases, topAlbums },
  });
});
