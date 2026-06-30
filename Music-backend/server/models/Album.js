const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Album title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Artist is required'],
    },
    coverUrl: {
      type: String,
      default: '',
    },
    releaseYear: {
      type: Number,
    },
    genre: {
      type: String,
      default: '',
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Album', AlbumSchema);
