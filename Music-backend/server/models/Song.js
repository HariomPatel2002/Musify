const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Song title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Artist is required'],
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      default: null,
    },
    genre: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
    },
    audioUrl: {
      type: String,
      required: [true, 'Audio URL is required'],
    },
    audioPublicId: {
      type: String,
      required: [true, 'Audio public ID is required'],
    },
    coverUrl: {
      type: String,
      default: '',
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    lyrics: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

SongSchema.index({ title: 'text', lyrics: 'text' });
SongSchema.index({ artist: 1, genre: 1 });

module.exports = mongoose.model('Song', SongSchema);
