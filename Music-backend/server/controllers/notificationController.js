const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

exports.getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const total = await Notification.countDocuments({ recipient: req.user._id });
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'username avatar')
    .populate('song', 'title coverUrl')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

  res.json({
    success: true,
    data: notifications,
    unreadCount,
    pagination: { count: total, totalPages: Math.ceil(total / limit), currentPage: page, limit },
  });
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});

exports.markOneRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: notification });
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });
  if (!notification) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, message: 'Notification deleted' });
});
