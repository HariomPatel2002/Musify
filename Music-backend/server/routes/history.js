const express = require('express');
const { getHistory, clearHistory, removeFromHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getHistory);
router.delete('/', protect, clearHistory);
router.delete('/:songId', protect, removeFromHistory);

module.exports = router;
