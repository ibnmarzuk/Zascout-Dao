const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  resourceType: {
    type: String,
    enum: ['quest', 'event', 'gig', 'grant', 'bounty'],
    required: true
  },
  resourceId: {
    type: String,
    required: true
  },
  resourceTitle: String,
  resourceData: mongoose.Schema.Types.Mixed, // Snapshot of data at bookmark time
  createdAt: { type: Date, default: Date.now }
});

// Compound index — one bookmark per resource per wallet
BookmarkSchema.index({ walletAddress: 1, resourceType: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
