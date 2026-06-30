const History = require('../models/History');
const asyncHandler = require('../utils/asyncHandler');

exports.getHistory = asyncHandler(async (req, res) => {
  const history = await History.find({ user: req.user._id })
    .populate({ path: 'song', select: 'title coverUrl duration artist', populate: { path: 'artist', select: 'username avatar' } })
    .sort({ playedAt: -1 })
    .limit(20);

  res.json({ success: true, data: history });
});

exports.clearHistory = asyncHandler(async (req, res) => {
  await History.deleteMany({ user: req.user._id });
  res.json({ success: true, message: 'History cleared' });
});

exports.removeFromHistory = asyncHandler(async (req, res) => {
  await History.findOneAndDelete({ user: req.user._id, song: req.params.songId });
  res.json({ success: true, message: 'Removed from history' });
});
