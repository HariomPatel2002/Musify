const express = require('express');
const { getNotifications, markAllRead, markOneRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/read', protect, markAllRead);
router.put('/:id/read', protect, markOneRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
