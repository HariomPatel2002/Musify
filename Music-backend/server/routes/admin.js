const express = require('express');
const { getStats, getUsers, updateUserRole, deleteUser, getAdminSongs, deleteSong } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/songs', getAdminSongs);
router.delete('/songs/:id', deleteSong);

module.exports = router;
