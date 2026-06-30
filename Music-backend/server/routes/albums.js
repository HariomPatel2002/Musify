const express = require('express');
const {
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addSongToAlbum,
  removeSongFromAlbum,
} = require('../controllers/albumController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validate');
const {
  createAlbumSchema,
  updateAlbumSchema,
  addSongToAlbumSchema,
} = require('../validations/albumValidation');

const router = express.Router();

router.get('/', getAlbums);

router.get('/:id', getAlbum);

router.post(
  '/',
  protect,
  authorize('artist', 'admin'),
  upload.fields([{ name: 'cover', maxCount: 1 }]),
  validate(createAlbumSchema),
  createAlbum
);

router.put(
  '/:id',
  protect,
  authorize('artist', 'admin'),
  upload.fields([{ name: 'cover', maxCount: 1 }]),
  validate(updateAlbumSchema),
  updateAlbum
);

router.delete('/:id', protect, authorize('artist', 'admin'), deleteAlbum);

router.post(
  '/:id/songs',
  protect,
  authorize('artist', 'admin'),
  validate(addSongToAlbumSchema),
  addSongToAlbum
);

router.delete('/:id/songs/:songId', protect, authorize('artist', 'admin'), removeSongFromAlbum);

module.exports = router;
