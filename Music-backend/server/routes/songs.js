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
    const Song = require('../models/Song');
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    const range = req.headers.range;
    const response = await axios.head(song.audioUrl);
    const totalSize = parseInt(response.headers['content-length'], 10);

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunkSize = end - start + 1;

      const audioResponse = await axios.get(song.audioUrl, {
        headers: { Range: `bytes=${start}-${end}` },
        responseType: 'stream',
      });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg',
      });

      audioResponse.data.pipe(res);
    } else {
      const audioResponse = await axios.get(song.audioUrl, {
        responseType: 'stream',
      });

      res.writeHead(200, {
        'Content-Length': totalSize,
        'Content-Type': 'audio/mpeg',
      });

      audioResponse.data.pipe(res);
    }
  } catch (err) {
    console.error('Error during audio streaming proxy:', err.message || err);
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
