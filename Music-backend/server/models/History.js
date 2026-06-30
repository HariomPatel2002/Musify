const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
      required: true,
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

HistorySchema.index({ user: 1, playedAt: -1 });
HistorySchema.index({ user: 1, song: 1 }, { unique: true });

module.exports = mongoose.model('History', HistorySchema);
