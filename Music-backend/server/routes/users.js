const express = require('express');
const {
  getUserProfile,
  updateProfile,
  followUser,
  getUserSongs,
  getUserAlbums,
  getFeed,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('../validations/userValidation');

const router = express.Router();

router.get('/feed', protect, getFeed);

router.put(
  '/profile',
  protect,
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  validate(updateProfileSchema),
  updateProfile
);

router.get('/:id', getUserProfile);
router.post('/:id/follow', protect, followUser);
router.get('/:id/songs', getUserSongs);
router.get('/:id/albums', getUserAlbums);

module.exports = router;
