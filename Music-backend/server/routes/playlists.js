const express = require('express');
const {
  getUserPlaylists,
  getMyPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createPlaylistSchema,
  updatePlaylistSchema,
  addSongToPlaylistSchema,
} = require('../validations/playlistValidation');

const router = express.Router();

router.get('/', getUserPlaylists);
router.get('/mine', protect, getMyPlaylists);

router.get('/:id', getPlaylist);

router.post('/', protect, validate(createPlaylistSchema), createPlaylist);

router.put('/:id', protect, validate(updatePlaylistSchema), updatePlaylist);

router.delete('/:id', protect, deletePlaylist);

router.post(
  '/:id/songs',
  protect,
  validate(addSongToPlaylistSchema),
  addSongToPlaylist
);

router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);

module.exports = router;
