const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const audioTypes = /mp3|wav|flac|aac|ogg|m4a/;
  const imageTypes = /jpeg|jpg|png|webp|gif/;

  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  if (file.fieldname === 'audio') {
    if (audioTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files (mp3, wav, flac, aac, ogg, m4a) are allowed'), false);
    }
  } else if (file.fieldname === 'cover') {
    if (imageTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = upload;
