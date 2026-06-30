const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      maxlength: [300, 'Comment cannot exceed 300 characters'],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

CommentSchema.index({ song: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
