const Comment = require('../models/Comment');
const Song = require('../models/Song');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

exports.getComments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const total = await Comment.countDocuments({ song: req.params.id });
  const comments = await Comment.find({ song: req.params.id })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: comments,
    pagination: { count: total, totalPages: Math.ceil(total / limit), currentPage: page, limit },
  });
});

exports.addComment = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

  const comment = await Comment.create({
    song: req.params.id,
    user: req.user._id,
    text: req.body.text,
  });

  await comment.populate('user', 'username avatar');

  if (song.artist.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: song.artist,
      sender: req.user._id,
      type: 'comment',
      song: song._id,
      message: `${req.user.username} commented on "${song.title}"`,
    });
  }

  res.status(201).json({ success: true, data: comment });
});

exports.updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  comment.text = req.body.text;
  await comment.save();
  await comment.populate('user', 'username avatar');

  res.json({ success: true, data: comment });
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await Comment.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Comment deleted' });
});

exports.likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

  comment.likes += 1;
  await comment.save();

  res.json({ success: true, data: { likes: comment.likes } });
});
