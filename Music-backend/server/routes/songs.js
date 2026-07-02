const express = require('express');
const axios = require('axios');
const {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
  searchSongs,
  likeSong,
  playSong,
} = require('../controllers/songController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validate');
const { createSongSchema, updateSongSchema } = require('../validations/songValidation');
const { createCommentSchema } = require('../validations/commentValidation');

const router = express.Router();

router.get('/search', searchSongs);

router.get('/', getSongs);

router.get('/:id', getSong);

router.get('/:id/stream', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid song ID format' });
    }

    const Song = require('../models/Song');
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    if (!song.audioUrl) {
      return res.status(404).json({ success: false, message: 'Audio URL not found for this song' });
    }

    // Redirect the browser directly to the Cloudinary audio URL
    return res.redirect(song.audioUrl);
  } catch (err) {
    console.error('Error during audio streaming redirect:', err.message || err);
    res.status(500).json({ success: false, message: 'Stream error', details: err.message });
  }
});


router.post(
  '/',
  protect,
  authorize('artist', 'admin'),
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  validate(createSongSchema),
  createSong
);

router.put(
  '/:id',
  protect,
  authorize('artist', 'admin'),
  upload.fields([{ name: 'cover', maxCount: 1 }]),
  validate(updateSongSchema),
  updateSong
);

router.delete('/:id', protect, authorize('artist', 'admin'), deleteSong);

router.post('/:id/like', protect, likeSong);

router.post('/:id/play', playSong);

router.get('/:id/download', protect, async (req, res) => {
  try {
    const axios = require('axios');
    const Song = require('../models/Song');
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    const response = await axios.get(song.audioUrl, { responseType: 'stream' });
    res.setHeader('Content-Disposition', `attachment; filename="${song.title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');
    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Download failed' });
  }
});

router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, validate(createCommentSchema), addComment);

module.exports = router;
